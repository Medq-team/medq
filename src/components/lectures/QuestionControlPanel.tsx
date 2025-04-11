
import { useState } from 'react';
import { Question } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

interface QuestionControlPanelProps {
  questions: Question[];
  totalQuestions: number;
  currentQuestionIndex: number;
  answers: Record<string, any>;
  onQuestionSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  isComplete: boolean;
}

export function QuestionControlPanel({
  questions,
  totalQuestions,
  currentQuestionIndex,
  answers,
  onQuestionSelect,
  onPrevious,
  onNext,
  isComplete
}: QuestionControlPanelProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Only show on mobile devices using a drawer
  const MobileDrawer = () => (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="fixed bottom-4 right-4 md:hidden z-10 gap-2">
          <span>Questions</span>
          <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
            {totalQuestions}
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[70vh]">
        <div className="p-4">
          <h3 className="font-medium text-lg mb-4">Questions Navigator</h3>
          <ScrollArea className="h-[calc(70vh-120px)]">
            {renderQuestionsList()}
          </ScrollArea>
          {renderNavigationButtons()}
        </div>
      </DrawerContent>
    </Drawer>
  );

  // Desktop panel
  const DesktopPanel = () => (
    <Card className="hidden md:block sticky top-4 h-fit max-h-[calc(100vh-8rem)]">
      <CardContent className="p-4">
        <h3 className="font-medium text-base mb-4">Questions Navigator</h3>
        <ScrollArea className="h-[calc(100vh-16rem)]">
          {renderQuestionsList()}
        </ScrollArea>
        {renderNavigationButtons()}
      </CardContent>
    </Card>
  );

  const renderQuestionsList = () => (
    <div className="space-y-2">
      {Array.from({ length: totalQuestions }).map((_, index) => {
        const question = questions[index];
        const isLoaded = question !== null && question !== undefined;
        const isAnswered = isLoaded && answers[question?.id] !== undefined;
        const isCurrent = index === currentQuestionIndex && !isComplete;
        
        return (
          <Button
            key={`question-${index}`}
            variant={isCurrent ? "default" : "outline"}
            className={cn(
              "w-full justify-start",
              isCurrent && "border-primary",
              isAnswered && !isCurrent && "bg-muted"
            )}
            onClick={() => {
              onQuestionSelect(index);
              setIsDrawerOpen(false);
            }}
            disabled={isComplete}
          >
            <div className="flex items-center w-full">
              <span className="mr-2">Q{isLoaded && question?.number ? question.number : index + 1}</span>
              
              {isAnswered ? (
                <CheckCircle className="h-4 w-4 text-primary ml-auto" />
              ) : !isLoaded ? (
                <Loader2 className="h-4 w-4 text-muted-foreground ml-auto animate-spin" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground ml-auto" />
              )}
            </div>
          </Button>
        );
      })}
    </div>
  );

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
        Previous
      </Button>
      <Button
        onClick={() => {
          onNext();
          setIsDrawerOpen(false);
        }}
        disabled={currentQuestionIndex >= totalQuestions - 1 || isComplete}
      >
        Next
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
