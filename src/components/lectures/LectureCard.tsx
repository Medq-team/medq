
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lecture } from '@/types';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLectureProgress, ProgressStatus } from '@/hooks/use-lecture-progress';

interface LectureCardProps {
  lecture: Lecture;
}

export function LectureCard({ lecture }: LectureCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getLectureProgress } = useLectureProgress();
  const progress = getLectureProgress(lecture.id);

  const handleClick = () => {
    navigate(`/lecture/${lecture.id}`);
  };

  const getStatusBadge = (status: ProgressStatus) => {
    switch(status) {
      case 'completed':
        return (
          <Badge className="bg-green-500 hover:bg-green-600 flex gap-1 items-center">
            <CheckCircle2 className="h-3 w-3" />
            {t('lectures.completed')}
          </Badge>
        );
      case 'in-progress':
        return <Badge variant="secondary">{t('lectures.inProgress')}</Badge>;
      default:
        return <Badge variant="outline">{t('lectures.notStarted')}</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col">
        <CardContent className="flex-grow pt-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg mb-1">{lecture.title}</h3>
                {progress && getStatusBadge(progress.status)}
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                {lecture.description || t('lectures.noDescription')}
              </p>
              
              {progress && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">
                      {progress.answeredCount} / {progress.totalQuestions} {t('common.answered')}
                    </span>
                    <span className="text-muted-foreground">
                      {Math.round(progress.progress)}%
                    </span>
                  </div>
                  <Progress value={progress.progress} className="h-1" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button onClick={handleClick} className="w-full">
            {progress?.status === 'in-progress' 
              ? t('lectures.continueLecture') 
              : progress?.status === 'completed'
                ? t('lectures.reviewLecture')
                : t('lectures.startLecture')}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
