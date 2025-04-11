
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
import { BookOpen, ExternalLink, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import { Progress } from '@/components/ui/progress';
import { useLectureProgress } from '@/hooks/use-lecture-progress';
import { Badge } from '@/components/ui/badge';

interface LecturesListViewProps {
  lectures: Lecture[];
  isLoading: boolean;
}

export function LecturesListView({ lectures, isLoading }: LecturesListViewProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
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

  // Determine progress bar color based on completion percentage
  const getProgressColor = (percentage: number) => {
    if (percentage === 0) return "bg-red-500";
    if (percentage < 25) return "bg-red-400";
    if (percentage < 50) return "bg-orange-400";
    if (percentage < 75) return "bg-yellow-400";
    if (percentage < 100) return "bg-lime-400";
    return "bg-green-500";
  };

  return (
    <div className="rounded-md border animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('lectures.title')}</TableHead>
            <TableHead className="hidden md:table-cell">{t('lectures.description')}</TableHead>
            <TableHead className="w-[120px]">{t('common.progress')}</TableHead>
            <TableHead className="w-[100px]">{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lectures.map((lecture) => {
            const { progress, isComplete } = useLectureProgress(lecture.id);
            
            return (
              <TableRow 
                key={lecture.id}
                className="cursor-pointer hover:bg-muted/80"
                onClick={() => navigate(`/lecture/${lecture.id}`)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {isComplete ? (
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    ) : (
                      <BookOpen className="h-4 w-4 mr-2 text-primary" />
                    )}
                    {lecture.title}
                    {isComplete && (
                      <Badge variant="default" className="ml-2 bg-green-500 text-xs">
                        {t('lectures.completed')}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  <div className="truncate max-w-[400px]">
                    {lecture.description}
                  </div>
                </TableCell>
                <TableCell>
                  {progress > 0 ? (
                    <div>
                      <div className="text-xs mb-1">
                        {Math.round(progress)}%
                      </div>
                      <Progress 
                        value={progress} 
                        colorClass={getProgressColor(progress)} 
                        className="h-1.5 transition-all duration-300" 
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">{t('lectures.notStarted')}</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/lecture/${lecture.id}`);
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">{t('lectures.openLecture')}</span>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
