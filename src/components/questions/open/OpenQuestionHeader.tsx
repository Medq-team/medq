
import { PenLine } from 'lucide-react';

interface OpenQuestionHeaderProps {
  questionText: string;
}

export function OpenQuestionHeader({ questionText }: OpenQuestionHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-sm font-medium">
        <PenLine className="h-4 w-4 mr-1" />
        Open Question
      </div>
      <h3 className="text-xl font-semibold text-foreground dark:text-gray-200">{questionText}</h3>
    </div>
  );
}
