
import { useState } from 'react';
import { Question } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

interface QuestionControlPanelProps {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, any>;
  answerResults?: Record<string, boolean>;
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Only show on mobile devices using a drawer
  const MobileDrawer = () => (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="fixed bottom-4 right-4 md:hidden z-10 gap-2">
          <span>Questions</span>
          <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
            {questions.length}
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
      {questions.map((question, index) => {
        const isAnswered = answers[question.id] !== undefined;
        const isCurrent = index === currentQuestionIndex && !isComplete;
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
              onQuestionSelect(index);
              setIsDrawerOpen(false);
            }}
          >
            <div className="flex items-center w-full">
              <span className="mr-2">Q{question.number || index + 1}</span>
              {isAnswered ? (
                isCorrect ? (
                  <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
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
        disabled={isComplete}
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
