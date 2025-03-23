import { Progress } from '@/components/ui/progress';
import { Lecture } from '@/types';
import { useTranslation } from 'react-i18next';
interface LectureProgressProps {
  lecture: Lecture | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  progress: number;
}
export function LectureProgress({
  lecture,
  currentQuestionIndex,
  totalQuestions,
  progress
}: LectureProgressProps) {
  const {
    t
  } = useTranslation();
  return <div>
      <h2 className="text-2xl font-bold tracking-tight">{lecture?.title}</h2>
      <div className="mt-4 mb-6">
        <div className="flex justify-between text-sm mb-1 bg-sky-950">
          <span>{currentQuestionIndex + 1} {t('common.of')} {totalQuestions}</span>
          <span>{Math.round(progress)}% {t('common.complete')}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>;
}