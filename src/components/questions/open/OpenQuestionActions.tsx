
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
  return (
    <div className="flex justify-end space-x-3 pt-4">
      {!isSubmitted ? (
        <Button 
          onClick={onSubmit} 
          disabled={!canSubmit}
        >
          {t('questions.submitAnswer')}
        </Button>
      ) : (
        <Button onClick={onNext} className="group">
          {t('questions.nextQuestion')}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      )}
    </div>
  );
}
