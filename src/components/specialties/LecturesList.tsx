
import { Lecture } from '@/types';
import { LectureCard } from '@/components/lectures/LectureCard';
import { Skeleton } from '@/components/ui/skeleton';

interface LecturesListProps {
  lectures: Lecture[];
  isLoading: boolean;
}

export function LecturesList({ lectures, isLoading }: LecturesListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (lectures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-fade-in">
        <h3 className="text-lg font-semibold">No lectures available</h3>
        <p className="text-muted-foreground mt-2">
          There are no lectures available for this specialty yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {lectures.map((lecture) => (
        <LectureCard key={lecture.id} lecture={lecture} />
      ))}
    </div>
  );
}
