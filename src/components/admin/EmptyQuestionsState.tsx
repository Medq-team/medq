
import { Button } from '@/components/ui/button';
import { HelpCircle, PlusCircle } from 'lucide-react';

interface EmptyQuestionsStateProps {
  onAddQuestion: () => void;
}

export function EmptyQuestionsState({ onAddQuestion }: EmptyQuestionsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <HelpCircle className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No questions yet</h3>
      <p className="text-muted-foreground mt-2">
        Add your first question to this lecture to help students learn.
      </p>
      <Button 
        variant="outline" 
        className="mt-4" 
        onClick={onAddQuestion}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Question
      </Button>
    </div>
  );
}
