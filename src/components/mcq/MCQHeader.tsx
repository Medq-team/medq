
import { HelpCircle } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface MCQHeaderProps {
  questionText: string;
  isSubmitted: boolean;
  questionNumber?: number;
  session?: string;
}

export function MCQHeader({ questionText, isSubmitted, questionNumber, session }: MCQHeaderProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-2">
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-sm font-medium">
        <HelpCircle className="h-4 w-4 mr-1" />
        {t('Multiple Choice')} {questionNumber !== undefined && `#${questionNumber}`}
      </div>
      {session && (
        <div className="text-xs text-muted-foreground dark:text-gray-400 font-medium">
          {session}
        </div>
      )}
      <h3 className="text-xl font-semibold text-foreground dark:text-gray-200">{questionText}</h3>
      <p className="text-sm text-muted-foreground dark:text-gray-300">
        {isSubmitted ? t("Review your answers below:") : t("Select all correct answers:")}
      </p>
    </div>
  );
}
