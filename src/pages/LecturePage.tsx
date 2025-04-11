
import { useParams } from 'react-router-dom';
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
import { useLecture } from '@/hooks/use-lecture';
import { QuizTimer } from '@/components/lectures/QuizTimer';
import { usePersistentQuiz } from '@/hooks/use-persistent-quiz';
import { AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';

export default function LecturePage() {
  const { lectureId } = useParams<{ lectureId: string }>();
  
  const {
    lecture,
    questions,
    isLoading,
    handleBackToSpecialty,
    isAddQuestionOpen,
    setIsAddQuestionOpen,
  } = useLecture(lectureId);
  
  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    handleAnswerSubmit,
    timeSpent,
    isComplete,
    setIsComplete,
    progress,
    resetQuiz
  } = usePersistentQuiz(lectureId, questions);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsComplete(true);
      toast({
        title: "Quiz completed!",
        description: `You completed the quiz in ${Math.floor(timeSpent / 60)} minutes and ${timeSpent % 60} seconds.`,
      });
    }
  };
  
  const handleRestart = () => {
    resetQuiz();
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <Dialog open={isAddQuestionOpen} onOpenChange={setIsAddQuestionOpen}>
          <div className="flex justify-between items-center">
            <LectureHeader 
              lecture={lecture} 
              onBackClick={handleBackToSpecialty} 
              onAddQuestionClick={() => setIsAddQuestionOpen(true)} 
            />
            {!isLoading && questions.length > 0 && !isComplete && (
              <QuizTimer timeSpent={timeSpent} className="bg-muted px-3 py-1 rounded-md text-sm" />
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
                <div className="border rounded-lg p-6 shadow-sm bg-inherit dark:bg-gray-800">
                  {currentQuestion.type === 'mcq' ? (
                    <MCQQuestion 
                      key={currentQuestion.id} 
                      question={currentQuestion} 
                      onSubmit={answer => handleAnswerSubmit(currentQuestion.id, answer)} 
                      onNext={handleNext} 
                    />
                  ) : (
                    <OpenQuestion 
                      key={currentQuestion.id} 
                      question={currentQuestion} 
                      onSubmit={answer => handleAnswerSubmit(currentQuestion.id, answer)} 
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
