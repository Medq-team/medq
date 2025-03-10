
import { HelpCircle } from 'lucide-react';

interface MCQHeaderProps {
  questionText: string;
  isSubmitted: boolean;
}

export function MCQHeader({ questionText, isSubmitted }: MCQHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
        <HelpCircle className="h-4 w-4 mr-1" />
        Multiple Choice
      </div>
      <h3 className="text-xl font-semibold">{questionText}</h3>
      <p className="text-sm text-muted-foreground">
        {isSubmitted ? "Review your answers below:" : "Select all correct answers:"}
      </p>
    </div>
  );
}
