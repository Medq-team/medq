
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Specialty } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { DetailedProgressBar } from './DetailedProgressBar';

interface SpecialtyHeaderProps {
  specialty: Specialty | null;
  isLoading: boolean;
}

export function SpecialtyHeader({ specialty, isLoading }: SpecialtyHeaderProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/3 rounded" />
          <Skeleton className="h-5 w-2/3 rounded" />
        </div>
        <Skeleton className="h-32 w-full rounded" />
      </div>
    );
  }

  if (!specialty) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Specialty not found</h2>
        <p className="text-muted-foreground mt-2">
          The specialty you're looking for doesn't exist or has been removed.
        </p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => router.push('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl font-bold tracking-tight">{specialty.name}</h2>
          {specialty.niveau && (
            <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
              {specialty.niveau.name}
            </span>
          )}
        </div>
        <p className="text-muted-foreground mt-2">
          {specialty.description || `Select a lecture to view questions and start learning`}
        </p>
      </div>

      {/* Detailed Progress Bar */}
      {specialty.progress && (
        <DetailedProgressBar
          data={{
            totalQuestions: specialty.progress.totalQuestions,
            correct: specialty.progress.correctQuestions,
            incorrect: specialty.progress.incorrectQuestions,
            partial: specialty.progress.partialQuestions,
            incomplete: specialty.progress.incompleteQuestions
          }}
          title={`${specialty.name} Progress`}
        />
      )}
    </div>
  );
}
