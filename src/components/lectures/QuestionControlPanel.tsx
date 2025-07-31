
import { useState, useEffect, useRef } from 'react';
import { Question, ClinicalCase } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, XCircle, MinusCircle, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useTranslation } from 'react-i18next';

interface QuestionControlPanelProps {
  questions: (Question | ClinicalCase)[];
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
  
  // Refs to track question buttons for auto-scrolling
  const questionRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastScrolledIndex = useRef<number>(-1);
  const hasInitiallyScrolled = useRef<boolean>(false);

  // Auto-scroll to current question when index changes
  useEffect(() => {
    // Only scroll if the index has actually changed
    if (lastScrolledIndex.current !== currentQuestionIndex) {
      const scrollToCurrentQuestion = () => {
        const currentButton = questionRefs.current[currentQuestionIndex];
        if (!currentButton) return;
        
        // Simple and reliable scrolling
        currentButton.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
        
        lastScrolledIndex.current = currentQuestionIndex;
      };

      // Small delay for smooth rendering
      const timeoutId = setTimeout(scrollToCurrentQuestion, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentQuestionIndex]);

  // Initial scroll on component mount (for when page loads with existing progress)
  useEffect(() => {
    // Only do initial scroll once when questions are loaded
    if (questions.length > 0 && !hasInitiallyScrolled.current) {
      const scrollToCurrentQuestion = () => {
        const currentButton = questionRefs.current[currentQuestionIndex];
        if (!currentButton) return;
        
        // Simple approach: just use scrollIntoView with proper options
        currentButton.scrollIntoView({
          behavior: 'auto', // Use 'auto' for initial scroll to avoid conflicts
          block: 'center',
          inline: 'nearest'
        });
        
        lastScrolledIndex.current = currentQuestionIndex;
        hasInitiallyScrolled.current = true;
      };

      // Use requestAnimationFrame for better timing on initial load
      const animationFrame = requestAnimationFrame(() => {
        setTimeout(scrollToCurrentQuestion, 200);
      });
      
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [questions.length, currentQuestionIndex]); // Include currentQuestionIndex for initial positioning
  


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
          <ScrollArea ref={scrollAreaRef} className="h-[calc(80vh-140px)]">
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
        <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-16rem)]">
          {renderQuestionsList()}
        </ScrollArea>
        {renderNavigationButtons()}
      </CardContent>
    </Card>
  );

  const renderQuestionsList = () => {
    // Group questions by type
    const regularQuestions: Array<Question & { originalIndex: number }> = [];
    const clinicalCases: Array<ClinicalCase & { originalIndex: number }> = [];

    questions.forEach((item, index) => {
      if ('caseNumber' in item && 'questions' in item) {
        // This is a clinical case
        clinicalCases.push({ ...item, originalIndex: index });
      } else {
        // This is a regular question
        regularQuestions.push({ ...item, originalIndex: index });
      }
    });

    // Group regular questions by type
    const groupedQuestions = regularQuestions.reduce((groups, question) => {
      const type = question.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(question);
      return groups;
    }, {} as Record<string, Array<Question & { originalIndex: number }>>);

    // Define type order and labels
    const typeOrder = ['mcq', 'qroc'];
    const getTypeLabel = (type: string) => {
      switch (type) {
        case 'mcq': return t('questions.mcq');
        case 'qroc': return t('questions.open');
        default: return type;
      }
    };

    return (
      <div className="space-y-4">
        {/* Regular Questions */}
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
                      ref={(el) => { questionRefs.current[question.originalIndex] = el; }}
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

        {/* Clinical Cases */}
        {clinicalCases.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground px-2 py-1 bg-muted rounded flex items-center gap-2">
              <Stethoscope className="h-3 w-3" />
              Cas Cliniques ({clinicalCases.length})
            </div>
            <div className="space-y-1">
              {clinicalCases.map((clinicalCase) => {
                // Add null checks for questions array
                if (!clinicalCase.questions || !Array.isArray(clinicalCase.questions)) {
                  console.error('Invalid clinical case structure:', clinicalCase);
                  return null;
                }
                
                const isAnswered = clinicalCase.questions.every(q => answers[q.id] !== undefined);
                const isCurrent = clinicalCase.originalIndex === currentQuestionIndex && !isComplete;
                
                // Calculate overall result for the clinical case
                let isCorrect: boolean | 'partial' | undefined;
                if (isAnswered) {
                  const allCorrect = clinicalCase.questions.every(q => answerResults[q.id] === true);
                  const someCorrect = clinicalCase.questions.some(q => answerResults[q.id] === true || answerResults[q.id] === 'partial');
                  isCorrect = allCorrect ? true : (someCorrect ? 'partial' : false);
                }
                
                return (
                  <Button
                    key={`case-${clinicalCase.caseNumber}`}
                    ref={(el) => { questionRefs.current[clinicalCase.originalIndex] = el; }}
                    variant="outline"
                    className={cn(
                      "w-full justify-start",
                      isCurrent && "border-primary",
                      isAnswered && "bg-muted"
                    )}
                    onClick={() => {
                      onQuestionSelect(clinicalCase.originalIndex);
                      setIsDrawerOpen(false);
                    }}
                  >
                    <div className="flex items-center w-full">
                      <div className="flex items-center mr-2">
                        <Stethoscope className="h-3 w-3 mr-1" />
                        <span>
                          Cas #{clinicalCase.caseNumber} ({clinicalCase.totalQuestions} questions)
                        </span>
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
        )}
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
      {isComplete ? (
        <Button
          variant="outline"
          onClick={() => {
            // This should trigger the completion view
            onNext();
            setIsDrawerOpen(false);
          }}
        >
          {t('questions.viewSummary')}
        </Button>
      ) : (
        <Button
          onClick={() => {
            onNext();
            setIsDrawerOpen(false);
          }}
        >
          {t('common.next')}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </div>
  );

  return (
    <>
      <MobileDrawer />
      <DesktopPanel />
    </>
  );
}
