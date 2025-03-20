
import { Progress } from '@/components/ui/progress';
import { Lecture } from '@/types';

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
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight">{lecture?.title}</h2>
      <div className="mt-4 mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>{currentQuestionIndex + 1} of {totalQuestions}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
}
