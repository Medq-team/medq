import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';
import { read, utils } from 'xlsx';

// Store for active import sessions
const activeImports = new Map<string, {
  progress: number;
  phase: 'validating' | 'importing' | 'complete';
  message: string;
  logs: string[];
  stats: any;
}>();

async function postHandler(request: AuthenticatedRequest) {
  console.log('POST /api/questions/bulk-import-progress called');
  let importId: string | null = null;
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    importId = formData.get('importId') as string;

    console.log('Import ID:', importId);
    console.log('File:', file?.name, file?.size);

    if (!file) {
      console.log('No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!importId) {
      console.log('No import ID provided');
      return NextResponse.json({ error: 'Import ID required' }, { status: 400 });
    }

    // Initialize import session
    activeImports.set(importId, {
      progress: 0,
      phase: 'validating',
      message: 'Starting import...',
      logs: [],
      stats: {}
    });

    console.log('Import session initialized for ID:', importId);

    const updateProgress = (progress: number, phase: string, message: string, log?: string) => {
      if (!importId) return;
      const session = activeImports.get(importId);
      if (session) {
        session.progress = progress;
        session.phase = phase as any;
        session.message = message;
        if (log) {
          session.logs.push(`${new Date().toLocaleTimeString()}: ${log}`);
          // Keep only last 50 logs
          if (session.logs.length > 50) {
            session.logs = session.logs.slice(-50);
          }
        }
        console.log(`Progress update: ${progress}% - ${phase} - ${message}`);
      }
    };

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
      updateProgress(0, 'complete', 'Invalid file type', 'Error: Invalid file type. Please upload an Excel file (.xlsx or .xls)');
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    updateProgress(5, 'validating', 'Reading Excel file...', 'Reading Excel file...');

    // Read and parse XLSX file
    const arrayBuffer = await file.arrayBuffer();
    const workbook = read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

    updateProgress(10, 'validating', 'Validating file structure...', `File contains ${jsonData.length} rows`);

    if (jsonData.length < 2) {
      updateProgress(0, 'complete', 'Invalid file structure', 'Error: Excel file must have at least a header and one data row');
      return NextResponse.json({ error: 'Invalid file structure' }, { status: 400 });
    }

    // Parse header
    const headerRow = jsonData[0] as string[];
    const header = headerRow.map(h => h?.toString().trim().toLowerCase() || '');
    const expectedHeaders = ['matiere', 'cours', 'question n', 'source', 'texte de la question', 'reponse'];
    
    const missingHeaders = expectedHeaders.filter(h => !header.includes(h));
    if (missingHeaders.length > 0) {
      updateProgress(0, 'complete', 'Missing required headers', `Error: Missing required headers: ${missingHeaders.join(', ')}`);
      return NextResponse.json({ error: `Missing headers: ${missingHeaders.join(', ')}` }, { status: 400 });
    }

    updateProgress(15, 'validating', 'Fetching existing data...', 'Fetching existing lectures and specialties...');

    // Fetch existing data
    const [lectures, specialties] = await Promise.all([
      prisma.lecture.findMany({ include: { specialty: true } }),
      prisma.specialty.findMany()
    ]);

    updateProgress(20, 'validating', 'Processing data...', `Found ${lectures.length} existing lectures and ${specialties.length} specialties`);

    const questions = [];
    const errors = [];
    const totalRows = jsonData.length - 1;
    const importStats = {
      total: totalRows,
      imported: 0,
      failed: 0,
      matchedLectures: 0,
      unmatchedLectures: 0,
      createdSpecialties: 0,
      createdLectures: 0,
      questionsWithImages: 0
    };

    // Track created entities
    const createdSpecialties = new Map<string, any>();
    const createdLectures = new Map<string, any>();

    updateProgress(25, 'validating', 'Validating rows...', `Processing ${totalRows} rows...`);

    // Process each row
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i] as any[];
      if (!row || row.length === 0) continue;

      const progress = 25 + Math.floor((i / jsonData.length) * 40); // 25% to 65%
      updateProgress(progress, 'validating', `Validating row ${i}/${totalRows}...`, `Processing row ${i + 1}`);

      try {
        const values = row.map(cell => cell?.toString().trim() || '');
        if (values.length < expectedHeaders.length) {
          const errorMsg = `Row ${i + 1}: Insufficient data`;
          errors.push(errorMsg);
          importStats.failed++;
          continue;
        }

        const rowData: any = {};
        header.forEach((h, index) => {
          rowData[h] = values[index] || '';
        });

        if (!rowData['matiere'] || !rowData['cours'] || !rowData['texte de la question'] || !rowData['reponse']) {
          const errorMsg = `Row ${i + 1}: Missing required fields`;
          errors.push(errorMsg);
          importStats.failed++;
          continue;
        }

        // Find or create lecture
        let matchedLecture = findMatchingLecture(
          rowData['matiere'],
          rowData['cours'],
          lectures,
          specialties
        );

        if (!matchedLecture) {
          const specialtyName = rowData['matiere'];
          const lectureTitle = rowData['cours'];
          const lectureKey = `${specialtyName}:${lectureTitle}`;
          
          if (createdLectures.has(lectureKey)) {
            matchedLecture = createdLectures.get(lectureKey);
            importStats.matchedLectures++;
            continue;
          }

          try {
            let specialty = specialties.find(s => 
              s.name.toLowerCase().includes(specialtyName.toLowerCase()) ||
              specialtyName.toLowerCase().includes(s.name.toLowerCase())
            );

            if (!specialty && createdSpecialties.has(specialtyName)) {
              specialty = createdSpecialties.get(specialtyName);
            }

            if (!specialty) {
              specialty = await prisma.specialty.create({
                data: {
                  name: specialtyName,
                  description: `Specialty created during import: ${specialtyName}`
                }
              });
              specialties.push(specialty);
              createdSpecialties.set(specialtyName, specialty);
              importStats.createdSpecialties++;
              updateProgress(progress, 'validating', `Created specialty: ${specialtyName}`, `✓ Created specialty: ${specialtyName}`);
            }

            matchedLecture = await prisma.lecture.create({
              data: {
                title: lectureTitle,
                description: `Lecture created during import: ${lectureTitle}`,
                specialtyId: specialty.id
              }
            });
            lectures.push(matchedLecture);
            createdLectures.set(lectureKey, matchedLecture);
            importStats.matchedLectures++;
            importStats.createdLectures++;
            updateProgress(progress, 'validating', `Created lecture: ${lectureTitle}`, `✓ Created lecture: ${lectureTitle}`);
            
          } catch (error) {
            const errorMsg = `Row ${i + 1}: Failed to create specialty/lecture`;
            errors.push(errorMsg);
            importStats.failed++;
            importStats.unmatchedLectures++;
            continue;
          }
        }

        // Extract image URL from question text if present
        const { cleanedText, mediaUrl, mediaType } = extractImageUrlAndCleanText(rowData['texte de la question']);
        
        const questionData = {
          lectureId: matchedLecture.id,
          type: 'qroc',
          text: cleanedText,
          correctAnswers: [rowData['reponse']],
          courseReminder: null,
          number: parseInt(rowData['question n']) || null,
          session: rowData['source'],
          mediaUrl: mediaUrl,
          mediaType: mediaType
        };
        
        // Log if an image was extracted
        if (mediaUrl) {
          importStats.questionsWithImages++;
          updateProgress(progress, 'validating', `Extracted image from question ${i + 1}`, `📷 Extracted image: ${mediaUrl}`);
        }
        
        questions.push(questionData);
        importStats.matchedLectures++;
        
      } catch (error) {
        const errorMsg = `Row ${i + 1}: Error processing row`;
        errors.push(errorMsg);
        importStats.failed++;
      }
    }

    updateProgress(70, 'importing', 'Importing questions...', `Starting import of ${questions.length} questions...`);

    // Insert questions in batches
    const importErrors = [];
    const batchSize = 50;
    
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      const batchProgress = 70 + Math.floor((i / questions.length) * 25); // 70% to 95%
      
      try {
        await prisma.question.createMany({
          data: batch,
          skipDuplicates: true
        });
        importStats.imported += batch.length;
        updateProgress(batchProgress, 'importing', `Imported ${importStats.imported}/${questions.length} questions...`, `✓ Imported batch ${Math.floor(i / batchSize) + 1}: ${batch.length} questions`);
      } catch (error) {
        importErrors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        importStats.failed += batch.length;
        updateProgress(batchProgress, 'importing', `Error in batch ${Math.floor(i / batchSize) + 1}`, `✗ Error in batch ${Math.floor(i / batchSize) + 1}`);
      }
    }

    const allErrors = [...errors, ...importErrors];
    const finalMessage = allErrors.length > 0 
      ? `Import completed with ${allErrors.length} errors`
      : 'Import completed successfully';

    updateProgress(100, 'complete', finalMessage, `Import complete: ${importStats.imported} imported, ${importStats.failed} failed`);

    // Store final stats
    const session = activeImports.get(importId);
    if (session) {
      session.stats = { ...importStats, errors: allErrors.length > 0 ? allErrors : undefined };
    }

    return NextResponse.json({ success: true, importId });

  } catch (error) {
    if (importId) {
      const session = activeImports.get(importId);
      if (session) {
        session.progress = 0;
        session.phase = 'complete';
        session.message = 'Import failed';
        session.logs.push(`${new Date().toLocaleTimeString()}: Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return NextResponse.json({ 
      error: 'Failed to process import', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

function findMatchingLecture(matiere: string, cours: string, lectures: any[], specialties: any[]) {
  const specialty = specialties.find(s => 
    s.name.toLowerCase().includes(matiere.toLowerCase()) ||
    matiere.toLowerCase().includes(s.name.toLowerCase())
  );

  if (!specialty) {
    return null;
  }

  return lectures.find(l => 
    l.specialtyId === specialty.id && 
    (l.title.toLowerCase().includes(cours.toLowerCase()) ||
     cours.toLowerCase().includes(l.title.toLowerCase()))
  );
}

// Function to extract image URLs from text and clean the text
function extractImageUrlAndCleanText(text: string): { cleanedText: string; mediaUrl: string | null; mediaType: string | null } {
  // Regular expression to match URLs that start with http or https and end with common image extensions
  const imageUrlRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg|bmp|tiff|ico))(\s|$)/gi;
  
  let cleanedText = text;
  let mediaUrl: string | null = null;
  let mediaType: string | null = null;
  
  // Find the first image URL in the text
  const match = imageUrlRegex.exec(text);
  if (match) {
    mediaUrl = match[1];
    // Remove the URL from the text
    cleanedText = text.replace(match[0], '').trim();
    
    // Determine media type based on file extension
    const extension = mediaUrl.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        mediaType = 'image/jpeg';
        break;
      case 'png':
        mediaType = 'image/png';
        break;
      case 'gif':
        mediaType = 'image/gif';
        break;
      case 'webp':
        mediaType = 'image/webp';
        break;
      case 'svg':
        mediaType = 'image/svg+xml';
        break;
      case 'bmp':
        mediaType = 'image/bmp';
        break;
      case 'tiff':
        mediaType = 'image/tiff';
        break;
      case 'ico':
        mediaType = 'image/x-icon';
        break;
      default:
        mediaType = 'image';
    }
  }
  
  return { cleanedText, mediaUrl, mediaType };
}

export const POST = requireAdmin(postHandler);
async function getHandlerWrapper(request: AuthenticatedRequest) {
  console.log('GET /api/questions/bulk-import-progress called');
  const importId = request.nextUrl?.searchParams.get('importId');
  
  console.log('GET Import ID:', importId);
  
  if (!importId) {
    console.log('No import ID in GET request');
    return NextResponse.json({ error: 'Import ID required' }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      let lastProgress = -1;
      let lastPhase = '';
      let lastMessage = '';
      let lastLogCount = 0;

      const sendEvent = (data: any) => {
        console.log('Sending EventSource data:', data);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const checkProgress = () => {
        const session = activeImports.get(importId);
        if (session) {
          // Check if anything has changed
          const hasChanged = 
            session.progress !== lastProgress ||
            session.phase !== lastPhase ||
            session.message !== lastMessage ||
            session.logs.length !== lastLogCount;

          if (hasChanged) {
            console.log(`Progress changed: ${lastProgress}% -> ${session.progress}%, ${lastPhase} -> ${session.phase}`);
            
            sendEvent({
              progress: session.progress,
              phase: session.phase,
              message: session.message,
              logs: session.logs,
              stats: session.stats
            });

            // Update last values
            lastProgress = session.progress;
            lastPhase = session.phase;
            lastMessage = session.message;
            lastLogCount = session.logs.length;
          }

          if (session.phase === 'complete') {
            console.log('Import complete, closing EventSource');
            // Clean up after 30 seconds
            setTimeout(() => {
              activeImports.delete(importId);
            }, 30000);
            controller.close();
          } else {
            // Poll more frequently during active import
            setTimeout(checkProgress, 200);
          }
        } else {
          console.log('No session found for importId:', importId);
          controller.close();
        }
      };

      // Start checking immediately
      checkProgress();
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

export const GET = requireAdmin(getHandlerWrapper); 