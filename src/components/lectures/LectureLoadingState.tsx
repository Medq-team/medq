
import { Skeleton } from '@/components/ui/skeleton';

export function LectureLoadingState() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-2/3 rounded" />
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}
