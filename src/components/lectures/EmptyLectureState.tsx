
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface EmptyLectureStateProps {
  onAddQuestion: () => void;
}

export function EmptyLectureState({ onAddQuestion }: EmptyLectureStateProps) {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold">No questions available</h2>
      <p className="text-muted-foreground mt-2 mb-6">
        This lecture doesn't have any questions yet. Be the first to add one!
      </p>
      <div className="flex justify-center">
        <Button 
          onClick={onAddQuestion}
          size="lg"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add First Question
        </Button>
      </div>
    </div>
  );
}
