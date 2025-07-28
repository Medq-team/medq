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
  previewData: Array<{
    matiere: string;
    cours: string;
    questionNumber: number;
    questionText: string;
    matchedLecture?: Lecture;
    mediaUrl?: string | null;
    mediaType?: string | null;
  }>;
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
      
      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length < 2) {
        toast({
          title: t('common.error'),
          description: 'XLSX file must have at least a header and one data row',
          variant: 'destructive',
        });
        return;
      }

      // Parse header (first row)
      const headerRow = jsonData[0] as string[];
      const header = headerRow.map(h => h?.toString().trim().toLowerCase() || '');
      const expectedHeaders = ['matiere', 'cours', 'question n', 'source', 'texte de la question', 'reponse'];
      
      const missingHeaders = expectedHeaders.filter(h => !header.includes(h));
      if (missingHeaders.length > 0) {
        toast({
          title: t('common.error'),
          description: `Missing required headers: ${missingHeaders.join(', ')}`,
          variant: 'destructive',
        });
        return;
      }

      // Parse all rows to get accurate statistics
      const previewData = [];
      const uniqueSpecialties = new Set<string>();
      const uniqueLectureCombinations = new Set<string>();
      const matchedLectures = new Set<string>();
      const unmatchedLectures = new Set<string>();
      
      for (let i = 1; i < jsonData.length; i++) { // Process all rows for accurate stats
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
              const matchedLecture = findMatchingLecture(rowData['matiere'], rowData['cours']); // matiere=specialty, cours=lecture
              
              if (matchedLecture) {
                matchedLectures.add(lectureKey);
              } else {
                unmatchedLectures.add(lectureKey);
              }
              
              // Only add to preview if it's one of the first 10 rows
              if (previewData.length < 10) {
                // Extract image URL from question text if present
                const { cleanedText, mediaUrl, mediaType } = extractImageUrlAndCleanText(rowData['texte de la question']);
                
                previewData.push({
                  matiere: rowData['matiere'],
                  cours: rowData['cours'],
                  questionNumber: parseInt(rowData['question n']) || 0,
                  questionText: cleanedText,
                  matchedLecture,
                  mediaUrl,
                  mediaType
                });
              }
            }
          }
        } catch (error) {
          console.error(`Error parsing row ${i + 1}:`, error);
        }
      }
      
      setImportPreview({
        totalQuestions: jsonData.length - 1, // Exclude header
        matchedLectures: matchedLectures.size,
        unmatchedLectures: unmatchedLectures.size,
        specialties: Array.from(uniqueSpecialties),
        previewData
      });

    } catch (error) {
      console.error('Error parsing XLSX:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to parse XLSX file',
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
      // Generate unique import ID
      const importId = `import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
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
      formData.append('importId', importId);

      console.log('Sending file to server with importId:', importId);

      const response = await fetch('/api/questions/bulk-import-progress', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      console.log('File uploaded successfully, waiting before starting EventSource');

      // Wait a moment for the server to initialize the import session
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('Starting EventSource connection');

      // Start SSE connection for progress updates after successful upload
      const eventSource = new EventSource(`/api/questions/bulk-import-progress?importId=${importId}`);
      
      console.log('EventSource created for importId:', importId);
      
      eventSource.onopen = () => {
        console.log('EventSource connection opened');
      };
      
      eventSource.onmessage = (event) => {
        console.log('EventSource message received:', event.data);
        try {
          const data = JSON.parse(event.data);
          console.log('Parsed EventSource data:', data);
          console.log('Setting progress state:', data);
          setProgress(data);
          console.log('Progress state set, current progress:', data.progress, '%');
          
          if (data.phase === 'complete') {
            setImportResult(data.stats);
            eventSource.close();
            setIsUploading(false);
            
            if (data.stats?.errors?.length > 0) {
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
          console.error('Error parsing EventSource data:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('EventSource error:', error);
        eventSource.close();
        setIsUploading(false);
        toast({
          title: t('common.error'),
          description: t('admin.failedToUploadFile'),
          variant: 'destructive',
        });
      };

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
              <h1 className="text-2xl font-bold">{t('admin.importQROCQuestions')}</h1>
              <p className="text-muted-foreground">{t('admin.importDescription')}</p>
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
                    <div className="space-y-4">
                      {importPreview.previewData.map((item, index) => (
                        <div key={index} className="flex items-start gap-4 p-3 border rounded-lg">
                          <div className="flex-shrink-0">
                            {item.matchedLecture ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-orange-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={item.matchedLecture ? 'default' : 'secondary'}>
                                {item.matiere}
                              </Badge>
                              <Badge variant={item.matchedLecture ? 'default' : 'secondary'}>
                                {item.cours}
                              </Badge>
                              <Badge variant="outline">
                                #{item.questionNumber}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.questionText}
                            </p>
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
                        <span>{progress.progress}%</span>
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

                    {importResult.createdLectures > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium">{t('admin.createdNewLectures')}</p>
                        <p className="text-xl font-bold text-blue-600">{importResult.createdLectures}</p>
                      </div>
                    )}

                    {importResult.questionsWithImages > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium">{t('admin.questionsWithImages')}</p>
                        <p className="text-xl font-bold text-purple-600">{importResult.questionsWithImages}</p>
                      </div>
                    )}

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