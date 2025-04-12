
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OpenQuestionActionsProps {
  isSubmitted: boolean;
  canSubmit: boolean;
  onSubmit: () => void;
  onNext: () => void;
  onPrevious?: () => void;
  showPrevious?: boolean;
}

export function OpenQuestionActions({
  isSubmitted,
  canSubmit,
  onSubmit,
  onNext,
  onPrevious,
  showPrevious = false
}: OpenQuestionActionsProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex justify-between mt-6">
      {showPrevious && onPrevious && (
        <Button
          variant="outline"
          onClick={onPrevious}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('common.previous')}
        </Button>
      )}
      
      <div className={`flex gap-2 ${showPrevious ? 'ml-auto' : ''}`}>
        {!isSubmitted ? (
          <Button 
            onClick={onSubmit} 
            disabled={!canSubmit}
            className="flex items-center gap-1"
          >
            {t('common.submit')}
          </Button>
        ) : (
          <Button 
            onClick={onNext}
            className="flex items-center gap-1"
          >
            {t('common.next')}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
