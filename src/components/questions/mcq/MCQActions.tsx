
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface MCQActionsProps {
  isSubmitted: boolean;
  canSubmit: boolean;
  isCorrect: boolean | null;
  onSubmit: () => void;
  onNext: () => void;
}

export function MCQActions({ 
  isSubmitted, 
  canSubmit, 
  isCorrect, 
  onSubmit, 
  onNext 
}: MCQActionsProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex justify-between pt-4">
      {!isSubmitted ? (
        <Button 
          onClick={onSubmit} 
          disabled={!canSubmit}
          className="ml-auto"
        >
          {t('Submit Answer')}
        </Button>
      ) : (
        <div className="flex items-center ml-auto gap-2">
          <div className="flex items-center mr-4">
            {isCorrect ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">{t('Correct!')}</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">{t('Incorrect')}</span>
              </div>
            )}
          </div>
          <Button onClick={onNext} className="group">
            {t('Next Question')}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
