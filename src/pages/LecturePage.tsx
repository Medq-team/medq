
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
import { AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from 'react-i18next';

export default function LecturePage() {
  const { t } = useTranslation();
  const {
    lectureId
  } = useParams<{
    lectureId: string;
  }>();
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
  
  return <AppLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <Dialog open={isAddQuestionOpen} onOpenChange={setIsAddQuestionOpen}>
          <LectureHeader lecture={lecture} onBackClick={handleBackToSpecialty} onAddQuestionClick={() => setIsAddQuestionOpen(true)} />
          
          <DialogContent className="max-w-3xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{t('admin.addNewQuestion')}</DialogTitle>
              <DialogDescription>
                {t('questions.addQuestion')}
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
