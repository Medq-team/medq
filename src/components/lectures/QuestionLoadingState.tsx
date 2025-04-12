
import { Skeleton } from '@/components/ui/skeleton';

export function QuestionLoadingState() {
  return (
    <div className="border rounded-lg p-6 shadow-sm bg-inherit dark:bg-gray-800">
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-2/3 rounded" />
          <Skeleton className="h-5 w-full rounded" />
          <Skeleton className="h-5 w-11/12 rounded" />
        </div>
        
        <div className="space-y-4 mt-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-full rounded" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-full rounded" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-full rounded" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-full rounded" />
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Skeleton className="h-9 w-24 rounded" />
        </div>
      </div>
    </div>
  );
}
