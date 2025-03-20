
import { PenLine } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface OpenQuestionHeaderProps {
  questionText: string;
  questionNumber?: number;
  session?: string;
}

export function OpenQuestionHeader({ questionText, questionNumber, session }: OpenQuestionHeaderProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-2">
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-sm font-medium">
        <PenLine className="h-4 w-4 mr-1" />
        {t('Open Question')} {questionNumber !== undefined && `#${questionNumber}`}
      </div>
      {session && (
        <div className="text-xs text-muted-foreground dark:text-gray-400 font-medium">
          {session}
        </div>
      )}
      <h3 className="text-xl font-semibold text-foreground dark:text-gray-200">{questionText}</h3>
    </div>
  );
}
