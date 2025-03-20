
import { HelpCircle } from 'lucide-react';

interface MCQHeaderProps {
  questionText: string;
  isSubmitted: boolean;
}

export function MCQHeader({ questionText, isSubmitted }: MCQHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-sm font-medium">
        <HelpCircle className="h-4 w-4 mr-1" />
        Multiple Choice
      </div>
      <h3 className="text-xl font-semibold text-foreground dark:text-gray-200">{questionText}</h3>
      <p className="text-sm text-muted-foreground dark:text-gray-300">
        {isSubmitted ? "Review your answers below:" : "Select all correct answers:"}
      </p>
    </div>
  );
}
