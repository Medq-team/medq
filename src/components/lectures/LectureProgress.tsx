
import { Progress } from '@/components/ui/progress';
import { Lecture } from '@/types';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock } from 'lucide-react';
import { ProgressStatus } from '@/hooks/use-lecture-progress'; 

interface LectureProgressProps {
  lecture: Lecture | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredCount: number;
  progress: number;
  status?: ProgressStatus;
}

export function LectureProgress({
  lecture,
  currentQuestionIndex,
  totalQuestions,
  answeredCount,
  progress,
  status = 'not-started'
}: LectureProgressProps) {
  const { t } = useTranslation();
  
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">{lecture?.title}</h2>
        <div>
          {status === 'completed' ? (
            <Badge className="bg-green-500 hover:bg-green-600 flex gap-1 items-center">
              <CheckCircle2 className="h-3 w-3" />
              {t('lectures.completed')}
            </Badge>
          ) : status === 'in-progress' ? (
            <Badge variant="secondary" className="flex gap-1 items-center">
              <Clock className="h-3 w-3" />
              {t('lectures.inProgress')}
            </Badge>
          ) : null}
        </div>
      </div>
      
      <div className="mt-4 mb-6">
        <div className="flex justify-between text-sm mb-1 dark:text-gray-300 text-foreground">
          <span>
            <span className="font-medium">{answeredCount}</span> {t('common.of')} {totalQuestions} {t('common.answered')}
          </span>
          <span>{Math.round(progress)}% {t('common.complete')}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
}
