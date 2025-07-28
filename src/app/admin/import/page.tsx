'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, FileText, AlertCircle, CheckCircle, XCircle, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { read, utils } from 'xlsx';

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

interface Lecture {
  id: string;
  title: string;
  specialty: {
    id: string;
    name: string;
  };
}

interface ImportPreview {
  totalQuestions: number;
  matchedLectures: number;
  unmatchedLectures: number;
  specialties: string[];
  sheets: {
    [sheetName: string]: {
      totalQuestions: number;
      questionType: string;
      previewData: Array<{
        matiere: string;
        cours: string;
        questionNumber: number;
        questionText: string;
        matchedLecture?: Lecture;
        mediaUrl?: string | null;
        mediaType?: string | null;
        caseNumber?: number;
        caseText?: string;
        caseQuestionNumber?: number;
        options?: string[];
        correctAnswers?: string[];
      }>;
    };
  };
}

interface ImportProgress {
  progress: number;
  phase: 'validating' | 'importing' | 'complete';
  message: string;
  logs: string[];
  stats?: any;
}

export default function ImportPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const [lecturesRes, specialtiesRes] = await Promise.all([
        fetch('/api/lectures'),
        fetch('/api/specialties')
      ]);
      
      if (lecturesRes.ok) {
        const lecturesData = await lecturesRes.json();
        setLectures(lecturesData);
      }
      
      if (specialtiesRes.ok) {
        const specialtiesData = await specialtiesRes.json();
        setSpecialties(specialtiesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Debug progress state changes
  useEffect(() => {
    if (progress) {
      console.log('Progress state changed:', progress);
    }
  }, [progress]);

  const findMatchingLecture = (matiere: string, cours: string): Lecture | undefined => {
    // First, find the specialty
    const specialty = specialties.find(s => 
      s.name.toLowerCase().includes(matiere.toLowerCase()) ||
      matiere.toLowerCase().includes(s.name.toLowerCase())
    );

    if (!specialty) {
      return undefined;
    }

    // Then find the lecture within that specialty
    return lectures.find(l => 
      l.specialty.id === specialty.id && 
      (l.title.toLowerCase().includes(cours.toLowerCase()) ||
       cours.toLowerCase().includes(l.title.toLowerCase()))
    );
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    
    try {
      // Parse XLSX to preview data
      const arrayBuffer = await file.arrayBuffer();
      const workbook = read(arrayBuffer, { type: 'array' });
      
      const sheets = ['qcm', 'qroc', 'cas_qcm', 'cas_qroc'];
      const sheetsData: any = {};
      const uniqueSpecialties = new Set<string>();
      const uniqueLectureCombinations = new Set<string>();
      const matchedLectures = new Set<string>();
      const unmatchedLectures = new Set<string>();
      
      // Process each sheet
      for (const sheetName of sheets) {
        if (!workbook.Sheets[sheetName]) {
          continue; // Skip if sheet doesn't exist
        }
        
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          continue; // Skip empty sheets
        }
        
        // Parse header (first row)
        const headerRow = jsonData[0] as string[];
        const header = headerRow.map(h => h?.toString().trim().toLowerCase() || '');
        
        // Define expected headers for each sheet type
        let expectedHeaders: string[];
        let questionType: string;
        
        switch (sheetName) {
          case 'qcm':
            expectedHeaders = ['matiere', 'cours', 'question n', 'source', 'texte de la question', 'option a', 'option b', 'option c', 'option d', 'option e', 'reponse'];
            questionType = 'MCQ';
            break;
          case 'qroc':
            expectedHeaders = ['matiere', 'cours', 'question n', 'source', 'texte de la question', 'reponse'];
            questionType = 'QROC';
            break;
          case 'cas_qcm':
            expectedHeaders = ['matiere', 'cours', 'cas n', 'source', 'texte du cas', 'question n', 'texte de question', 'option a', 'option b', 'option c', 'option d', 'option e', 'reponse'];
            questionType = 'Clinical MCQ';
            break;
          case 'cas_qroc':
            expectedHeaders = ['matiere', 'cours', 'cas n', 'source', 'texte du cas', 'question n', 'texte de question', 'reponse'];
            questionType = 'Clinical QROC';
            break;
          default:
            continue;
        }
        
        // Check for missing headers
        const missingHeaders = expectedHeaders.filter(h => !header.includes(h));
        if (missingHeaders.length > 0) {
          console.warn(`Sheet ${sheetName} missing headers: ${missingHeaders.join(', ')}`);
          continue;
        }
        
        // Parse rows for this sheet
        const previewData = [];
        
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (!row || row.length === 0) continue;
          
          try {
            const values = row.map(cell => cell?.toString().trim() || '');
            if (values.length >= expectedHeaders.length) {
              const rowData: any = {};
              header.forEach((h, index) => {
                rowData[h] = values[index] || '';
              });
              
              if (rowData['matiere'] && rowData['cours']) {
                uniqueSpecialties.add(rowData['matiere']);
                const lectureKey = `${rowData['matiere']}:${rowData['cours']}`;
                uniqueLectureCombinations.add(lectureKey);
                
                // Try to match with existing lectures
                const matchedLecture = findMatchingLecture(rowData['matiere'], rowData['cours']);
                
                if (matchedLecture) {
                  matchedLectures.add(lectureKey);
                } else {
                  unmatchedLectures.add(lectureKey);
                }
                
                // Only add to preview if it's one of the first 5 rows per sheet
                if (previewData.length < 5) {
                  // Extract image URL from question text if present - use correct column name
                  const questionTextColumn = sheetName === 'cas_qcm' || sheetName === 'cas_qroc' ? 'texte de question' : 'texte de la question';
                  const { cleanedText, mediaUrl, mediaType } = extractImageUrlAndCleanText(rowData[questionTextColumn]);
                  
                  const previewItem: any = {
                    matiere: rowData['matiere'],
                    cours: rowData['cours'],
                    questionNumber: parseInt(rowData['question n']) || 0,
                    questionText: cleanedText,
                    matchedLecture,
                    mediaUrl,
                    mediaType
                  };
                  
                  // Add clinical case fields if applicable
                  if (sheetName === 'cas_qcm' || sheetName === 'cas_qroc') {
                    previewItem.caseNumber = parseInt(rowData['cas n']) || null;
                    previewItem.caseText = rowData['texte du cas'] || null;
                    previewItem.caseQuestionNumber = parseInt(rowData['question n']) || null;
                  }
                  
                  // Add MCQ options if applicable
                  if (sheetName === 'qcm' || sheetName === 'cas_qcm') {
                    const options = [];
                    for (let j = 0; j < 5; j++) {
                      const optionKey = `option ${String.fromCharCode(97 + j)}`; // a, b, c, d, e
                      if (rowData[optionKey] && rowData[optionKey].trim()) {
                        options.push(rowData[optionKey].trim());
                      }
                    }
                    previewItem.options = options;
                    previewItem.correctAnswers = rowData['reponse'] ? [rowData['reponse']] : [];
                  }
                  
                  previewData.push(previewItem);
                }
              }
            }
          } catch (error) {
            console.error(`Error parsing row ${i + 1} in sheet ${sheetName}:`, error);
          }
        }
        
        sheetsData[sheetName] = {
          totalQuestions: jsonData.length - 1,
          questionType,
          previewData
        };
      }
      
      if (Object.keys(sheetsData).length === 0) {
        toast({
          title: t('common.error'),
          description: 'No valid sheets found. Expected sheets: qcm, qroc, cas_qcm, cas_qroc',
          variant: 'destructive',
        });
        return;
      }
      
      setImportPreview({
        totalQuestions: Object.values(sheetsData).reduce((sum: number, sheet: any) => sum + sheet.totalQuestions, 0),
        matchedLectures: matchedLectures.size,
        unmatchedLectures: unmatchedLectures.size,
        specialties: Array.from(uniqueSpecialties),
        sheets: sheetsData
      });
      
    } catch (error) {
      console.error('Error parsing file:', error);
      toast({
        title: t('common.error'),
        description: 'Error parsing Excel file. Please check the file format.',
        variant: 'destructive',
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: t('common.error'),
        description: t('admin.pleaseSelectFileFirst'),
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setProgress(null);
    setImportResult(null);
    
    try {
      // Test if the endpoint is accessible
      console.log('Testing endpoint accessibility...');
      const testResponse = await fetch('/api/questions/bulk-import-progress', {
        method: 'OPTIONS'
      });
      console.log('Endpoint test response:', testResponse.status);

      // Set initial progress state to show the progress card immediately
      setProgress({
        progress: 0,
        phase: 'validating',
        message: 'Starting import...',
        logs: []
      });
      
      // Send file to server first
      const formData = new FormData();
      formData.append('file', selectedFile);
      // Note: Backend generates its own importId, so we don't need to send one

      console.log('Sending file to server (backend will generate importId)');

      const response = await fetch('/api/questions/bulk-import-progress', {
        method: 'POST',
        body: formData,
      });

      console.log('POST response status:', response.status);
      console.log('POST response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('POST response error text:', errorText);
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { error: errorText };
        }
        throw new Error(error.error || 'Upload failed');
      }

      const responseData = await response.json();
      console.log('POST response data:', responseData);

      // Use the importId returned by the backend
      const backendImportId = responseData.importId;
      console.log('Using backend importId:', backendImportId);

      console.log('File uploaded successfully, waiting before starting progress polling');

      // Wait a moment for the server to initialize the import session
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('Starting progress polling');

      // Start polling for progress updates
      const pollProgress = async () => {
        try {
          const response = await fetch(`/api/questions/bulk-import-progress?importId=${backendImportId}`);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const data = await response.json();
          console.log('Progress data received:', data);
          
          setProgress(data);
          
          // Continue polling if not complete
          if (data.progress < 100) {
            setTimeout(pollProgress, 1000);
          } else {
            // Import complete
            setImportResult(data.stats);
            setIsUploading(false);
            
            if (data.stats?.failed > 0) {
              toast({
                title: t('admin.importWithErrors'),
                description: `${t('admin.questionsImportedOf')} ${data.stats.imported}/${data.stats.total}`,
                variant: 'default',
              });
            } else {
              toast({
                title: t('admin.importSuccess'),
                description: `${t('admin.questionsImportedOf')} ${data.stats.imported}/${data.stats.total}`,
                variant: 'default',
              });
            }
          }
        } catch (error) {
          console.error('Progress polling error:', error);
          setIsUploading(false);
          toast({
            title: t('common.error'),
            description: t('admin.failedToUploadFile'),
            variant: 'destructive',
          });
        }
      };

      // Start polling
      pollProgress();

    } catch (error) {
      setIsUploading(false);
      console.error('Upload error:', error);
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('admin.failedToUploadFile'),
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImportPreview(null);
    setImportResult(null);
    setProgress(null);
  };

  const handleBack = () => {
    router.push('/admin');
  };

  return (
    <ProtectedRoute requireAdmin>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{t('admin.multiSheetImport')}</h1>
              <p className="text-muted-foreground">{t('admin.expectedSheets')}</p>
            </div>
          </div>

          {!selectedFile ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  {t('admin.selectExcelFile')}
                </CardTitle>
                <CardDescription>{t('admin.requiredExcelFormat')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">{t('admin.selectExcelFile')}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">XLSX or XLS</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".xlsx,.xls"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                    />
                  </label>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* File Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {selectedFile.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium">{t('admin.totalQuestions')}</p>
                      <p className="text-2xl font-bold">{importPreview?.totalQuestions || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t('admin.specialties')}</p>
                      <p className="text-2xl font-bold">{importPreview?.specialties.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t('admin.matchedLectures')}</p>
                      <p className="text-2xl font-bold text-green-600">{importPreview?.matchedLectures || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t('admin.unmatchedLectures')}</p>
                      <p className="text-2xl font-bold text-orange-600">{importPreview?.unmatchedLectures || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              {importPreview && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('admin.importPreview')}</CardTitle>
                    <CardDescription>{t('admin.previewFirst10')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Object.entries(importPreview.sheets).map(([sheetName, sheetData]) => (
                        <div key={sheetName} className="space-y-4">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold capitalize">{sheetName.replace('_', ' ')}</h3>
                            <Badge variant="outline">{sheetData.questionType}</Badge>
                            <Badge variant="secondary">{sheetData.totalQuestions} questions</Badge>
                          </div>
                          
                          <div className="space-y-3">
                            {sheetData.previewData.map((item, index) => (
                              <div key={index} className="flex items-start gap-4 p-3 border rounded-lg">
                                <div className="flex-shrink-0">
                                  {item.matchedLecture ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-orange-500" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <Badge variant={item.matchedLecture ? 'default' : 'secondary'}>
                                      {item.matiere}
                                    </Badge>
                                    <Badge variant={item.matchedLecture ? 'default' : 'secondary'}>
                                      {item.cours}
                                    </Badge>
                                    <Badge variant="outline">
                                      #{item.questionNumber}
                                    </Badge>
                                    {item.caseNumber && (
                                      <Badge variant="outline">
                                        Case #{item.caseNumber}
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  {item.caseText && (
                                    <div className="mb-2 p-2 bg-muted rounded text-xs">
                                      <strong>Case:</strong> {item.caseText.substring(0, 100)}...
                                    </div>
                                  )}
                                  
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {item.questionText}
                                  </p>
                                  
                                  {item.options && item.options.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                      <p className="text-xs font-semibold">Options:</p>
                                      {item.options.map((option, optIndex) => (
                                        <p key={optIndex} className="text-xs text-muted-foreground ml-2">
                                          {String.fromCharCode(65 + optIndex)}. {option}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                  
                                  {item.mediaUrl && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      <span className="font-semibold">{t('admin.image')}:</span> {item.mediaUrl}
                                    </p>
                                  )}
                                  
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {item.matchedLecture ? t('admin.matched') : t('admin.unmatched')}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {importPreview.unmatchedLectures > 0 && (
                      <Alert className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {t('admin.someLecturesNotMatched')}
                          {importPreview.unmatchedLectures > 0 && (
                            <span className="font-medium"> {t('admin.willCreateLectures')}</span>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Progress */}
              {progress && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {progress.phase === 'validating' && <FileText className="h-5 w-5" />}
                      {progress.phase === 'importing' && <Upload className="h-5 w-5 animate-pulse" />}
                      {progress.phase === 'complete' && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {progress.message}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t('admin.importProgress')}</span>
                        <span>{progress.progress.toFixed(2)}%</span>
                      </div>
                      <Progress value={progress.progress} className="w-full" />
                    </div>

                    {/* Live Logs */}
                    {progress.logs.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Live Logs</h4>
                          <Badge variant="outline">{progress.logs.length}</Badge>
                        </div>
                        <ScrollArea className="h-48 w-full border rounded-md p-3 bg-muted/50">
                          <div className="space-y-1">
                            {progress.logs.map((log, index) => (
                              <div key={index} className="text-xs font-mono text-muted-foreground">
                                {log}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Import Results */}
              {importResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      {t('admin.importResults')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium">{t('admin.totalQuestions')}</p>
                        <p className="text-2xl font-bold">{importResult.total}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t('admin.importSuccessful')}</p>
                        <p className="text-2xl font-bold text-green-600">{importResult.imported}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t('admin.failed')}</p>
                        <p className="text-2xl font-bold text-red-600">{importResult.failed}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t('admin.createdNewSpecialties')}</p>
                        <p className="text-2xl font-bold text-blue-600">{importResult.createdSpecialties}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {importResult.createdLectures > 0 && (
                        <div>
                          <p className="text-sm font-medium">{t('admin.createdNewLectures')}</p>
                          <p className="text-xl font-bold text-blue-600">{importResult.createdLectures}</p>
                        </div>
                      )}

                      {importResult.createdCases > 0 && (
                        <div>
                          <p className="text-sm font-medium">Clinical Cases Created</p>
                          <p className="text-xl font-bold text-indigo-600">{importResult.createdCases}</p>
                        </div>
                      )}

                      {importResult.questionsWithImages > 0 && (
                        <div>
                          <p className="text-sm font-medium">{t('admin.questionsWithImages')}</p>
                          <p className="text-xl font-bold text-purple-600">{importResult.questionsWithImages}</p>
                        </div>
                      )}
                    </div>

                    {importResult.errors && importResult.errors.length > 0 && (
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            {t('admin.viewErrors')} ({importResult.errors.length})
                            <ChevronDown className="h-4 w-4 ml-auto" />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                            <ScrollArea className="h-64">
                              <div className="space-y-2">
                                {importResult.errors.map((error: string, index: number) => (
                                  <div key={index} className="text-sm text-red-600">
                                    {error}
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                {!isUploading && !importResult && (
                  <Button onClick={handleUpload} className="flex-1">
                    <Upload className="h-4 w-4 mr-2" />
                    {t('admin.importQuestions')}
                  </Button>
                )}
                
                {!isUploading && (
                  <Button variant="outline" onClick={handleReset}>
                    {importResult ? t('admin.importAnotherFile') : t('common.reset')}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
} 