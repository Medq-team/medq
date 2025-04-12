
import { Progress } from '@/components/ui/progress';
import { Lecture } from '@/types';
import { useTranslation } from 'react-i18next';
import { Keyboard } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LectureProgressProps {
  lecture: Lecture | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  progress: number;
}

export function LectureProgress({
  lecture,
  currentQuestionIndex,
  totalQuestions,
  progress
}: LectureProgressProps) {
  const { t } = useTranslation();
  
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">{lecture?.title}</h2>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-xs text-muted-foreground cursor-help">
                <Keyboard className="h-3.5 w-3.5 mr-1" />
                <span>{t('common.keyboardShortcuts')}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs p-4">
              <div className="space-y-2 text-sm">
                <h4 className="font-semibold">{t('common.keyboardShortcuts')}:</h4>
                <ul className="space-y-1.5">
                  <li className="flex justify-between">
                    <span className="font-mono bg-muted px-1.5 rounded text-xs">1-5</span>
                    <span>{t('shortcuts.selectOptions')}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-mono bg-muted px-1.5 rounded text-xs">Space</span>
                    <span>{t('shortcuts.submitOrNext')}</span>
                  </li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="mt-4 mb-6">
        <div className="flex justify-between text-sm mb-1 dark:text-gray-300 text-foreground">
          <span>{currentQuestionIndex + 1} {t('common.of')} {totalQuestions}</span>
          <span>{Math.round(progress)}% {t('common.complete')}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
}
