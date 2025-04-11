
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MCQQuestion } from '@/components/questions/MCQQuestion';
import { OpenQuestion } from '@/components/questions/OpenQuestion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { QuestionForm } from '@/components/admin/QuestionForm';
import { LectureHeader } from '@/components/lectures/LectureHeader';
import { LectureProgress } from '@/components/lectures/LectureProgress';
import { LectureComplete } from '@/components/lectures/LectureComplete';
import { LectureLoadingState } from '@/components/lectures/LectureLoadingState';
import { QuestionLoadingState } from '@/components/lectures/QuestionLoadingState';
import { EmptyLectureState } from '@/components/lectures/EmptyLectureState';
import { LectureTimer } from '@/components/lectures/LectureTimer';
import { QuestionControlPanel } from '@/components/lectures/QuestionControlPanel';
import { useLecture } from '@/hooks/use-lecture';
import { useVisibility } from '@/hooks/use-visibility';
import { AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function LecturePage() {
  const { lectureId } = useParams<{ lectureId: string }>();
  
  const isVisible = useVisibility();
  
  const {
    lecture,
    questions,
    totalQuestions,
    currentQuestionIndex,
    isLoading,
    isLoadingQuestions,
    isComplete,
    isAddQuestionOpen,
    setIsAddQuestionOpen,
    currentQuestion,
    progress,
    answers,
    answeredCount,
    handleAnswerSubmit,
    handleNext,
    handlePrevious,
    handleQuestionSelect,
    handleRestart,
    handleBackToSpecialty,
    fetchQuestionByIndex
  } = useLecture(lectureId);

  // Log visibility state changes for debugging
  useEffect(() => {
    console.log(`Tab visibility changed: ${isVisible ? 'visible' : 'hidden'}`);
  }, [isVisible]);

  return <AppLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <div className="md:col-span-3 space-y-6">
          <Dialog open={isAddQuestionOpen} onOpenChange={setIsAddQuestionOpen}>
            <div className="flex justify-between items-center mb-6">
              <LectureHeader 
                lecture={lecture} 
                onBackClick={handleBackToSpecialty} 
                onAddQuestionClick={() => setIsAddQuestionOpen(true)} 
              />
              
              {lectureId && !isLoading && totalQuestions > 0 && !isComplete && (
                <LectureTimer lectureId={lectureId} />
              )}
            </div>
            
            <DialogContent className="max-w-3xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Add New Question</DialogTitle>
                <DialogDescription>
                  Create a new question for this lecture. Questions help students test their knowledge.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
                {lectureId && <QuestionForm lectureId={lectureId} onComplete={() => setIsAddQuestionOpen(false)} />}
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {isLoading ? <LectureLoadingState /> : lecture && totalQuestions > 0 ? <>
              <LectureProgress 
                lecture={lecture} 
                currentQuestionIndex={currentQuestionIndex} 
                totalQuestions={totalQuestions} 
                answeredCount={answeredCount}
                progress={progress} 
              />

              {isComplete ? <LectureComplete onRestart={handleRestart} onBackToSpecialty={handleBackToSpecialty} /> : (
                <AnimatePresence mode="wait">
                  {isLoadingQuestions || !currentQuestion ? (
                    <QuestionLoadingState />
                  ) : currentQuestion.type === 'mcq' ? (
                    <MCQQuestion 
                      key={currentQuestion.id} 
                      question={currentQuestion} 
                      onSubmit={answer => handleAnswerSubmit(currentQuestion.id, answer)} 
                      onNext={handleNext}
                      onPrevious={handlePrevious}
                    />
                  ) : (
                    <OpenQuestion 
                      key={currentQuestion.id} 
                      question={currentQuestion} 
                      onSubmit={answer => handleAnswerSubmit(currentQuestion.id, answer)} 
                      onNext={handleNext}
                      onPrevious={handlePrevious}
                    />
                  )}
                </AnimatePresence>
              )}
            </> : <EmptyLectureState onAddQuestion={() => setIsAddQuestionOpen(true)} />}
        </div>
        
        {/* Question Control Panel - only shown when we have questions */}
        {!isLoading && totalQuestions > 0 && (
          <div className="md:col-span-1">
            <QuestionControlPanel 
              questions={questions}
              totalQuestions={totalQuestions}
              currentQuestionIndex={currentQuestionIndex}
              answers={answers}
              onQuestionSelect={handleQuestionSelect}
              onPrevious={handlePrevious}
              onNext={handleNext}
              isComplete={isComplete}
            />
          </div>
        )}
      </div>
    </AppLayout>;
}
