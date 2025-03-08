
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { MCQQuestion } from '@/components/questions/MCQQuestion';
import { OpenQuestion } from '@/components/questions/OpenQuestion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QuestionForm } from '@/components/admin/QuestionForm';
import { LectureHeader } from '@/components/lectures/LectureHeader';
import { LectureProgress } from '@/components/lectures/LectureProgress';
import { LectureComplete } from '@/components/lectures/LectureComplete';
import { LectureLoadingState } from '@/components/lectures/LectureLoadingState';
import { EmptyLectureState } from '@/components/lectures/EmptyLectureState';
import { useLecture } from '@/hooks/use-lecture';
import { AnimatePresence } from 'framer-motion';

export default function LecturePage() {
  const { lectureId } = useParams<{ lectureId: string }>();
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

  return (
    <AppLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <Dialog open={isAddQuestionOpen} onOpenChange={setIsAddQuestionOpen}>
          <LectureHeader 
            lecture={lecture} 
            onBackClick={handleBackToSpecialty}
            onAddQuestionClick={() => setIsAddQuestionOpen(true)}
          />
          
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Question</DialogTitle>
            </DialogHeader>
            {lectureId && (
              <QuestionForm 
                lectureId={lectureId} 
                onComplete={() => setIsAddQuestionOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        {isLoading ? (
          <LectureLoadingState />
        ) : lecture && questions.length > 0 ? (
          <>
            <LectureProgress 
              lecture={lecture}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              progress={progress}
            />

            {isComplete ? (
              <LectureComplete 
                onRestart={handleRestart}
                onBackToSpecialty={handleBackToSpecialty}
              />
            ) : currentQuestion ? (
              <AnimatePresence mode="wait">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  {currentQuestion.type === 'mcq' ? (
                    <MCQQuestion
                      key={currentQuestion.id}
                      question={currentQuestion}
                      onSubmit={(answer) => handleAnswerSubmit(currentQuestion.id, answer)}
                      onNext={handleNext}
                    />
                  ) : (
                    <OpenQuestion
                      key={currentQuestion.id}
                      question={currentQuestion}
                      onSubmit={(answer) => handleAnswerSubmit(currentQuestion.id, answer)}
                      onNext={handleNext}
                    />
                  )}
                </div>
              </AnimatePresence>
            ) : null}
          </>
        ) : (
          <EmptyLectureState onAddQuestion={() => setIsAddQuestionOpen(true)} />
        )}
      </div>
    </AppLayout>
  );
}
