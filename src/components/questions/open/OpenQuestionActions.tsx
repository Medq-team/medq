
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface OpenQuestionActionsProps {
  isSubmitted: boolean;
  canSubmit: boolean;
  onSubmit: () => void;
  onNext: () => void;
}

export function OpenQuestionActions({ 
  isSubmitted, 
  canSubmit, 
  onSubmit, 
  onNext 
}: OpenQuestionActionsProps) {
  return (
    <div className="flex justify-end space-x-3 pt-4">
      {!isSubmitted ? (
        <Button 
          onClick={onSubmit} 
          disabled={!canSubmit}
        >
          Submit Answer
        </Button>
      ) : (
        <Button onClick={onNext} className="group">
          Next Question
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      )}
    </div>
  );
}
