
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
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLectureProgress } from '@/hooks/use-lecture-progress';

interface LecturesListViewProps {
  lectures: Lecture[];
  isLoading: boolean;
}

export function LecturesListView({ lectures, isLoading }: LecturesListViewProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getLectureProgress } = useLectureProgress();
  
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

  const getStatusBadge = (lectureId: string) => {
    const progress = getLectureProgress(lectureId);
    if (!progress) return null;
    
    switch(progress.status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">{t('lectures.completed')}</Badge>;
      case 'in-progress':
        return <Badge variant="secondary">{t('lectures.inProgress')}</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-md border animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('lectures.title')}</TableHead>
            <TableHead className="hidden md:table-cell">{t('lectures.description')}</TableHead>
            <TableHead className="hidden sm:table-cell">Progress</TableHead>
            <TableHead className="w-[100px]">{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lectures.map((lecture) => {
            const progress = getLectureProgress(lecture.id);
            
            return (
              <TableRow 
                key={lecture.id}
                className="cursor-pointer hover:bg-muted/80"
                onClick={() => navigate(`/lecture/${lecture.id}`)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <div>
                      {lecture.title}
                      <div className="mt-1 md:hidden">
                        {getStatusBadge(lecture.id)}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  <div className="truncate max-w-[400px]">
                    {lecture.description}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="hidden md:block">
                      {getStatusBadge(lecture.id)}
                    </div>
                    {progress ? (
                      <div className="w-full max-w-28">
                        <Progress value={progress.progress} className="h-2" />
                        <div className="text-xs text-muted-foreground mt-1">
                          {progress.answeredCount}/{progress.totalQuestions}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not started</span>
                    )}
                  </div>
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
