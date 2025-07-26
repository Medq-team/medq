
import { Lecture } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface LecturesListViewProps {
  lectures: Lecture[];
  isLoading: boolean;
}

interface LectureProgressData {
  totalQuestions: number;
  correct: number;
  incorrect: number;
  partial: number;
  incomplete: number;
}

export function LecturesListView({ lectures, isLoading }: LecturesListViewProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [lectureProgress, setLectureProgress] = useState<Record<string, LectureProgressData>>({});
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);

  // Fetch progress for all lectures
  useEffect(() => {
    if (!user || lectures.length === 0) return;

    const fetchAllLectureProgress = async () => {
      setIsLoadingProgress(true);
      try {
        const progressPromises = lectures.map(async (lecture) => {
          const response = await fetch(`/api/progress?lectureId=${lecture.id}`);
          if (response.ok) {
            const progressData = await response.json();
            
            // Get total questions for this lecture
            const questionsResponse = await fetch(`/api/questions?lectureId=${lecture.id}`);
            if (questionsResponse.ok) {
              const questions = await questionsResponse.json();
              const totalQuestions = questions.length;
              
              // Calculate detailed progress
              let correct = 0;
              let incorrect = 0;
              let partial = 0;
              
              progressData.forEach((item: any) => {
                if (item.completed && item.questionId) {
                  if (item.score === 1) {
                    correct++;
                  } else if (item.score === 0) {
                    incorrect++;
                  } else if (item.score && item.score > 0 && item.score < 1) {
                    partial++;
                  } else {
                    incorrect++;
                  }
                }
              });
              
              const completed = correct + incorrect + partial;
              const incomplete = totalQuestions - completed;
              
              return {
                lectureId: lecture.id,
                progress: {
                  totalQuestions,
                  correct,
                  incorrect,
                  partial,
                  incomplete
                }
              };
            }
          }
          return null;
        });

        const results = await Promise.all(progressPromises);
        const progressMap: Record<string, LectureProgressData> = {};
        
        results.forEach(result => {
          if (result) {
            progressMap[result.lectureId] = result.progress;
          }
        });
        
        setLectureProgress(progressMap);
      } catch (error) {
        console.error('Error fetching lecture progress:', error);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    fetchAllLectureProgress();
  }, [lectures, user]);

  const renderProgressBar = (lectureId: string) => {
    const progress = lectureProgress[lectureId];
    if (!progress || progress.totalQuestions === 0) return null;

    const correctPercent = (progress.correct / progress.totalQuestions) * 100;
    const partialPercent = (progress.partial / progress.totalQuestions) * 100;
    const incorrectPercent = (progress.incorrect / progress.totalQuestions) * 100;
    const incompletePercent = (progress.incomplete / progress.totalQuestions) * 100;

    return (
      <div className="flex items-center gap-2">
        <div className="relative h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
          {/* Correct (Green) */}
          {correctPercent > 0 && (
            <div 
              className="absolute h-full bg-green-500"
              style={{ width: `${correctPercent}%` }}
            />
          )}
          {/* Partial (Yellow) */}
          {partialPercent > 0 && (
            <div 
              className="absolute h-full bg-yellow-500"
              style={{ 
                left: `${correctPercent}%`, 
                width: `${partialPercent}%` 
              }}
            />
          )}
          {/* Incorrect (Red) */}
          {incorrectPercent > 0 && (
            <div 
              className="absolute h-full bg-red-500"
              style={{ 
                left: `${correctPercent + partialPercent}%`, 
                width: `${incorrectPercent}%` 
              }}
            />
          )}
          {/* Incomplete (Gray) */}
          {incompletePercent > 0 && (
            <div 
              className="absolute h-full bg-gray-400"
              style={{ 
                left: `${correctPercent + partialPercent + incorrectPercent}%`, 
                width: `${incompletePercent}%` 
              }}
            />
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {progress.correct + progress.incorrect + progress.partial}/{progress.totalQuestions}
        </span>
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (lectures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-fade-in">
        <h3 className="text-lg font-semibold">{t('lectures.noLecturesAvailable')}</h3>
        <p className="text-muted-foreground mt-2">
          {t('lectures.noLecturesDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('lectures.title')}</TableHead>
            <TableHead className="hidden md:table-cell">{t('lectures.description')}</TableHead>
            <TableHead className="w-[120px]">Progress</TableHead>
            <TableHead className="w-[100px]">{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lectures.map((lecture) => (
            <TableRow 
              key={lecture.id}
              className="cursor-pointer hover:bg-muted/80"
              onClick={() => router.push(`/lecture/${lecture.id}`)}
            >
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-primary" />
                  {lecture.title}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                <div className="truncate max-w-[400px]">
                  {lecture.description}
                </div>
              </TableCell>
              <TableCell>
                {isLoadingProgress ? (
                  <Skeleton className="h-2 w-16" />
                ) : (
                  renderProgressBar(lecture.id)
                )}
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/lecture/${lecture.id}`);
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">{t('lectures.openLecture')}</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
