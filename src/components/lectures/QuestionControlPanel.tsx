
import { useState } from 'react';
import { Question } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, XCircle, MinusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useTranslation } from 'react-i18next';

interface QuestionControlPanelProps {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, any>;
  answerResults?: Record<string, boolean | 'partial'>;
  onQuestionSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  isComplete: boolean;
}

export function QuestionControlPanel({
  questions,
  currentQuestionIndex,
  answers,
  answerResults = {},
  onQuestionSelect,
  onPrevious,
  onNext,
  isComplete
}: QuestionControlPanelProps) {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Only show on mobile devices using a drawer
  const MobileDrawer = () => (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="fixed bottom-4 right-4 lg:hidden z-50 gap-2 shadow-lg">
          <span>{t('questions.questions')}</span>
          <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
            {questions.length}
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <div className="p-4">
          <h3 className="font-medium text-lg mb-4">{t('questions.questions')}</h3>
          <ScrollArea className="h-[calc(80vh-140px)]">
            {renderQuestionsList()}
          </ScrollArea>
          {renderNavigationButtons()}
        </div>
      </DrawerContent>
    </Drawer>
  );

  // Desktop panel
  const DesktopPanel = () => (
    <Card className="hidden lg:block sticky top-4 h-fit max-h-[calc(100vh-8rem)]">
      <CardContent className="p-4">
        <h3 className="font-medium text-base mb-4">{t('questions.questions')} {t('questions.navigator')}</h3>
        <ScrollArea className="h-[calc(100vh-16rem)]">
          {renderQuestionsList()}
        </ScrollArea>
        {renderNavigationButtons()}
      </CardContent>
    </Card>
  );

  const renderQuestionsList = () => {
    // Group questions by type
    const groupedQuestions = questions.reduce((groups, question, index) => {
      const type = question.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push({ ...question, originalIndex: index });
      return groups;
    }, {} as Record<string, Array<Question & { originalIndex: number }>>);

    // Define type order and labels
    const typeOrder = ['mcq', 'qroc', 'clinic_mcq', 'clinic_croq'];
    const getTypeLabel = (type: string) => {
      switch (type) {
        case 'mcq': return t('questions.mcq');
        case 'qroc': return t('questions.open');
        case 'clinic_mcq': return t('questions.casCliniqueQcm');
        case 'clinic_croq': return t('questions.casCliniqueQroc');
        default: return type;
      }
    };

    return (
      <div className="space-y-4">
        {typeOrder.map(type => {
          const typeQuestions = groupedQuestions[type];
          if (!typeQuestions || typeQuestions.length === 0) return null;

          return (
            <div key={type} className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground px-2 py-1 bg-muted rounded">
                {getTypeLabel(type)} ({typeQuestions.length})
              </div>
              <div className="space-y-1">
                {typeQuestions.map((question) => {
                  const isAnswered = answers[question.id] !== undefined;
                  const isCurrent = question.originalIndex === currentQuestionIndex && !isComplete;
                  const isCorrect = answerResults[question.id];
                  
                  return (
                    <Button
                      key={question.id}
                      variant="outline"
                      className={cn(
                        "w-full justify-start",
                        isCurrent && "border-primary",
                        isAnswered && "bg-muted"
                      )}
                      onClick={() => {
                        onQuestionSelect(question.originalIndex);
                        setIsDrawerOpen(false);
                      }}
                    >
                      <div className="flex items-center w-full">
                        <div className="flex items-center mr-2">
                          <span>
                            {question.number ? `${getTypeLabel(question.type)} ${question.number}` : `${getTypeLabel(question.type)} ${question.originalIndex + 1}`}
                          </span>
                          {question.session && (
                            <span className="text-xs text-muted-foreground ml-1">
                              {question.session}
                            </span>
                          )}
                        </div>
                        {isAnswered ? (
                          isCorrect === true ? (
                            <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                          ) : isCorrect === 'partial' ? (
                            <MinusCircle className="h-4 w-4 text-yellow-600 ml-auto" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600 ml-auto" />
                          )
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground ml-auto" />
                        )}
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderNavigationButtons = () => (
    <div className="flex justify-between mt-4">
              <Button
          variant="outline"
          onClick={() => {
            onPrevious();
            setIsDrawerOpen(false);
          }}
          disabled={currentQuestionIndex === 0 || isComplete}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t('common.previous')}
        </Button>
        <Button
          onClick={() => {
            onNext();
            setIsDrawerOpen(false);
          }}
          disabled={isComplete}
        >
          {t('common.next')}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
    </div>
  );

  return (
    <>
      <MobileDrawer />
      <DesktopPanel />
    </>
  );
}
