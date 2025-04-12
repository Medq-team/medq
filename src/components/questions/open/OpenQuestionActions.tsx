
import { Button } from '@/components/ui/button';
import { ArrowRight, Keyboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
    <div className="flex justify-between pt-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center text-xs text-muted-foreground">
              <Keyboard className="h-3.5 w-3.5 mr-1" />
              <span>
                {isSubmitted ? t('shortcuts.spacebarNext') : t('shortcuts.spacebarSubmit')}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs p-4">
            <div className="space-y-2 text-sm">
              <h4 className="font-semibold">{t('common.keyboardShortcuts')}:</h4>
              <ul className="space-y-1.5">
                <li className="flex justify-between">
                  <span className="font-mono bg-muted px-1.5 rounded text-xs">Spacebar</span>
                  <span>{isSubmitted ? t('shortcuts.nextQuestion') : t('shortcuts.submitAnswer')}</span>
                </li>
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

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
