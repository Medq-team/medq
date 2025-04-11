
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface MCQActionsProps {
  isSubmitted: boolean;
  canSubmit: boolean;
  isCorrect: boolean | null;
  onSubmit: () => void;
  onNext: () => void;
  onPrevious?: () => void;
  showPrevious?: boolean;
}

export function MCQActions({
  isSubmitted,
  canSubmit,
  isCorrect,
  onSubmit,
  onNext,
  onPrevious,
  showPrevious = true
}: MCQActionsProps) {
  return (
    <div className="flex justify-between mt-6">
      {showPrevious && onPrevious && (
        <Button
          variant="outline"
          onClick={onPrevious}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
      )}
      
      <div className={`flex gap-2 ${showPrevious && onPrevious ? 'ml-auto' : ''}`}>
        {!isSubmitted ? (
          <Button 
            onClick={onSubmit} 
            disabled={!canSubmit}
            className="flex items-center gap-1"
          >
            Submit
          </Button>
        ) : (
          <>
            {isCorrect !== null && (
              <div className="flex items-center mr-2">
                {isCorrect ? (
                  <CheckCircle className="text-green-500 h-5 w-5" />
                ) : (
                  <XCircle className="text-red-500 h-5 w-5" />
                )}
              </div>
            )}
            <Button 
              onClick={onNext}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
