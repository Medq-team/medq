
import { Skeleton } from '@/components/ui/skeleton';

export function LectureLoadingState() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-40 rounded" />
        <Skeleton className="h-8 w-2/3 rounded" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-6 w-full rounded" />
        <Skeleton className="h-6 w-11/12 rounded" />
        <Skeleton className="h-6 w-4/5 rounded" />
      </div>
      
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <div className="space-y-6">
          <Skeleton className="h-8 w-2/3 rounded" />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-full rounded" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-full rounded" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-full rounded" />
            </div>
          </div>
          <Skeleton className="h-10 w-32 rounded ml-auto" />
        </div>
      </div>
    </div>
  );
}
