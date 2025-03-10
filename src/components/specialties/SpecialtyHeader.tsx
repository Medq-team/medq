
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Specialty } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

interface SpecialtyHeaderProps {
  specialty: Specialty | null;
  isLoading: boolean;
}

export function SpecialtyHeader({ specialty, isLoading }: SpecialtyHeaderProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3 rounded" />
        <Skeleton className="h-5 w-2/3 rounded" />
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
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">{specialty.name}</h2>
      <p className="text-muted-foreground mt-2">
        {specialty.description || `Select a lecture to view questions and start learning`}
      </p>
    </div>
  );
}
