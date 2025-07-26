'use client'

import { useParams } from 'next/navigation'
import { useLecture } from '@/hooks/use-lecture'
import { AppLayout } from '@/components/layout/AppLayout'
import { LectureTimer } from '@/components/lectures/LectureTimer'
import { LectureComplete } from '@/components/lectures/LectureComplete'
import { LectureLoadingState } from '@/components/lectures/LectureLoadingState'
import { QuestionControlPanel } from '@/components/lectures/QuestionControlPanel'
import { MCQQuestion } from '@/components/questions/MCQQuestion'
import { OpenQuestion } from '@/components/questions/OpenQuestion'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function LecturePageRoute() {
  const params = useParams()
  const { t } = useTranslation()
  
  if (!params?.lectureId) {
    return <div>Lecture ID not found</div>
  }
  
  const lectureId = params.lectureId as string
  
  const {
    lecture,
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    answerResults,
    isLoading,
    isComplete,
    currentQuestion,
    progress,
    handleAnswerSubmit,
    handleNext,
    handleRestart,
    handleBackToSpecialty,
  } = useLecture(lectureId);

  if (isLoading) {
    return (
      <AppLayout>
        <LectureLoadingState />
      </AppLayout>
    );
  }

  if (!lecture) {
    return (
      <AppLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t('lectures.lectureNotFound')}</h1>
          <Button onClick={handleBackToSpecialty} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
        </div>
      </AppLayout>
    );
  }

  if (isComplete) {
    return (
      <AppLayout>
        <LectureComplete
          onRestart={handleRestart}
          onBackToSpecialty={handleBackToSpecialty}
        />
      </AppLayout>
    );
  }

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleMCQSubmit = (answer: string[], isCorrect: boolean) => {
    handleAnswerSubmit(currentQuestion!.id, answer, isCorrect);
    // Don't automatically move to next question - let user see the result first
  };

  const handleOpenSubmit = (answer: string) => {
    // For open questions, we don't have automatic correctness checking
    // So we'll just mark it as answered without a result
    handleAnswerSubmit(currentQuestion!.id, answer);
    // Don't automatically move to next question - let user see the result first
  };

  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row gap-4 pb-12 lg:pb-0">
        <div className="flex-1 space-y-6 min-w-0 w-full max-w-full">
          <div className="flex justify-end">
            <LectureTimer lectureId={lectureId} />
          </div>

          {currentQuestion && (
            <div className="space-y-6">
              {currentQuestion.type === 'mcq' ? (
                <MCQQuestion
                  question={currentQuestion}
                  onSubmit={handleMCQSubmit}
                  onNext={handleNext}
                  lectureId={lectureId}
                />
              ) : (
                <OpenQuestion
                  question={currentQuestion}
                  onSubmit={handleOpenSubmit}
                  onNext={handleNext}
                  lectureId={lectureId}
                />
              )}
            </div>
          )}
        </div>

        <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
          <QuestionControlPanel
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            answerResults={answerResults}
            onQuestionSelect={handleQuestionSelect}
            onPrevious={handlePrevious}
            onNext={handleNext}
            isComplete={isComplete}
          />
        </div>
      </div>
      
      {/* Mobile Control Panel - rendered separately to avoid layout issues */}
      <div className="lg:hidden">
        <QuestionControlPanel
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          answerResults={answerResults}
          onQuestionSelect={handleQuestionSelect}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isComplete={isComplete}
        />
      </div>
    </AppLayout>
  );
} 