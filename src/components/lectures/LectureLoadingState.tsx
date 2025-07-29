
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function LectureLoadingState() {
  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-24" />
      </div>

      {/* Question skeleton */}
      <Card>
        <CardHeader>
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-64" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Clinical case skeleton */}
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-16 w-full" />
          </div>

          {/* Question options skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 p-4 border rounded-lg">
                <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>

          {/* Action buttons skeleton */}
          <div className="flex gap-2 justify-end">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
