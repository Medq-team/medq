
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
import { EmptyLectureState } from '@/components/lectures/EmptyLectureState';
import { LectureTimer } from '@/components/lectures/LectureTimer';
import { useLecture } from '@/hooks/use-lecture';
import { useVisibility } from '@/hooks/use-visibility';
import { AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function LecturePage() {
  const {
    lectureId
  } = useParams<{
    lectureId: string;
  }>();
  
  const isVisible = useVisibility();
  
  const {
    lecture,
    questions,
    currentQuestionIndex,
    isLoading,
    isComplete,
    isAddQuestionOpen,
    setIsAddQuestionOpen,
    currentQuestion,
    progress,
    handleAnswerSubmit,
    handleNext,
    handleRestart,
    handleBackToSpecialty
  } = useLecture(lectureId);

  // Log visibility state changes for debugging
  useEffect(() => {
    console.log(`Tab visibility changed: ${isVisible ? 'visible' : 'hidden'}`);
  }, [isVisible]);

  return <AppLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <Dialog open={isAddQuestionOpen} onOpenChange={setIsAddQuestionOpen}>
          <div className="flex justify-between items-center mb-6">
            <LectureHeader 
              lecture={lecture} 
              onBackClick={handleBackToSpecialty} 
              onAddQuestionClick={() => setIsAddQuestionOpen(true)} 
            />
            
            {lectureId && !isLoading && questions.length > 0 && !isComplete && (
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

        {isLoading ? <LectureLoadingState /> : lecture && questions.length > 0 ? <>
            <LectureProgress lecture={lecture} currentQuestionIndex={currentQuestionIndex} totalQuestions={questions.length} progress={progress} />

            {isComplete ? <LectureComplete onRestart={handleRestart} onBackToSpecialty={handleBackToSpecialty} /> : currentQuestion ? <AnimatePresence mode="wait">
                <div className="border rounded-lg p-6 shadow-sm bg-inherit dark:bg-gray-800">
                  {currentQuestion.type === 'mcq' ? <MCQQuestion key={currentQuestion.id} question={currentQuestion} onSubmit={answer => handleAnswerSubmit(currentQuestion.id, answer)} onNext={handleNext} /> : <OpenQuestion key={currentQuestion.id} question={currentQuestion} onSubmit={answer => handleAnswerSubmit(currentQuestion.id, answer)} onNext={handleNext} />}
                </div>
              </AnimatePresence> : null}
          </> : <EmptyLectureState onAddQuestion={() => setIsAddQuestionOpen(true)} />}
      </div>
    </AppLayout>;
}
