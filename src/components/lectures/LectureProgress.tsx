
import { Progress } from '@/components/ui/progress';
import { Lecture } from '@/types';
import { useTranslation } from 'react-i18next';

interface LectureProgressProps {
  lecture: Lecture | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredCount: number;
  progress: number;
}

export function LectureProgress({
  lecture,
  currentQuestionIndex,
  totalQuestions,
  answeredCount,
  progress
}: LectureProgressProps) {
  const { t } = useTranslation();
  
  // Determine progress bar color based on completion percentage
  const getProgressColor = (percentage: number) => {
    if (percentage === 0) return "bg-red-500";
    if (percentage < 25) return "bg-red-400";
    if (percentage < 50) return "bg-orange-400";
    if (percentage < 75) return "bg-yellow-400";
    if (percentage < 100) return "bg-lime-400";
    return "bg-green-500";
  };
  
  const progressColor = getProgressColor(progress);
  
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight">{lecture?.title}</h2>
      <div className="mt-4 mb-6">
        <div className="flex justify-between text-sm mb-1 dark:text-gray-300 text-foreground">
          <span>
            <span className="font-medium">{answeredCount}</span> {t('common.of')} {totalQuestions} {t('common.answered')}
          </span>
          <span>{Math.round(progress)}% {t('common.complete')}</span>
        </div>
        <Progress 
          value={progress} 
          colorClass={progressColor} 
          className="h-2 transition-all duration-500" 
        />
      </div>
    </div>
  );
}
