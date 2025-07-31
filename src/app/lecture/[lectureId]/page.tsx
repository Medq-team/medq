'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useLecture } from '@/hooks/use-lecture'
import { AppLayout } from '@/components/layout/AppLayout'
import { LectureTimer } from '@/components/lectures/LectureTimer'
import { LectureComplete } from '@/components/lectures/LectureComplete'
import { LectureLoadingState } from '@/components/lectures/LectureLoadingState'
import { QuestionControlPanel } from '@/components/lectures/QuestionControlPanel'
import { MCQQuestion } from '@/components/questions/MCQQuestion'
import { OpenQuestion } from '@/components/questions/OpenQuestion'
import { ClinicalCaseQuestion } from '@/components/questions/ClinicalCaseQuestion'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ClinicalCase, Question } from '@/types'

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
    handleClinicalCaseSubmit,
    handleNext,
    handleRestart,
    handleBackToSpecialty,
  } = useLecture(lectureId);



  if (isLoading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <LectureLoadingState />
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (!lecture) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="text-center">
            <h1 className="text-2xl font-bold">{t('lectures.lectureNotFound')}</h1>
            <Button onClick={handleBackToSpecialty} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
            </Button>
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (isComplete) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <LectureComplete
            onRestart={handleRestart}
            onBackToSpecialty={handleBackToSpecialty}
            questions={questions}
            answers={answers}
            answerResults={answerResults}
            lectureTitle={lecture.title}
          />
        </AppLayout>
      </ProtectedRoute>
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
    // Only handle regular questions here, clinical cases are handled separately
    // Check if this is actually a clinical case (has questions array) vs a regular question
    if (!('questions' in currentQuestion!)) {
      const question = currentQuestion as Question;

      handleAnswerSubmit(question.id, answer, isCorrect);
    }
    // Don't automatically move to next question - let user see the result first
  };

  const handleOpenSubmit = (answer: string, resultValue?: boolean | 'partial') => {
    // Only handle regular questions here, clinical cases are handled separately
    // Check if this is actually a clinical case (has questions array) vs a regular question
    if (!('questions' in currentQuestion!)) {
      const question = currentQuestion as Question;

      // For open questions, we store the answer and the self-assessment result
      handleAnswerSubmit(question.id, answer, resultValue);
    }
    // Don't automatically move to next question - let user see the result first
  };

  const handleClinicalCaseComplete = (caseNumber: number, caseAnswers: Record<string, any>, caseResults: Record<string, boolean | 'partial'>) => {

    handleClinicalCaseSubmit(caseNumber, caseAnswers, caseResults);
  };

  const renderCurrentQuestion = () => {
    if (!currentQuestion) return null;

    // Check if current question is a clinical case
    if ('caseNumber' in currentQuestion && 'questions' in currentQuestion) {
      const clinicalCase = currentQuestion as ClinicalCase;
      
      // Add null checks for questions array
      if (!clinicalCase.questions || !Array.isArray(clinicalCase.questions)) {
        console.error('Invalid clinical case structure:', clinicalCase);
        return null;
      }
      
      const isAnswered = clinicalCase.questions.every(q => answers[q.id] !== undefined);
      const caseAnswerResult = isAnswered ? 
        (clinicalCase.questions.every(q => answerResults[q.id] === true) ? true : 
         clinicalCase.questions.some(q => answerResults[q.id] === true || answerResults[q.id] === 'partial') ? 'partial' : false) : 
        undefined;
      
      const caseUserAnswers: Record<string, any> = {};
      const caseAnswerResults: Record<string, boolean | 'partial'> = {};
      clinicalCase.questions.forEach(q => {
        if (answers[q.id] !== undefined) {
          caseUserAnswers[q.id] = answers[q.id];
        }
        if (answerResults[q.id] !== undefined) {
          caseAnswerResults[q.id] = answerResults[q.id];
        }
      });

      return (
        <ClinicalCaseQuestion
          clinicalCase={clinicalCase}
          onSubmit={handleClinicalCaseComplete}
          onNext={handleNext}
          lectureId={lectureId}
          isAnswered={isAnswered}
          answerResult={caseAnswerResult}
          userAnswers={caseUserAnswers}
          answerResults={caseAnswerResults}
          onAnswerUpdate={handleAnswerSubmit}
        />
      );
    }

    // Regular question handling
    const isAnswered = answers[currentQuestion.id] !== undefined;
    const answerResult = answerResults[currentQuestion.id];
    const userAnswer = answers[currentQuestion.id];
    

    
    if (currentQuestion.type === 'mcq') {
      return (
        <MCQQuestion
          question={currentQuestion}
          onSubmit={handleMCQSubmit}
          onNext={handleNext}
          lectureId={lectureId}
          isAnswered={isAnswered}
          answerResult={answerResult}
          userAnswer={userAnswer}
        />
      );
    } else {
      return (
        <OpenQuestion
          question={currentQuestion}
          onSubmit={handleOpenSubmit}
          onNext={handleNext}
          lectureId={lectureId}
          isAnswered={isAnswered}
          answerResult={answerResult}
          userAnswer={userAnswer}
        />
      );
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="flex flex-col lg:flex-row gap-4 pb-12 lg:pb-0">
          <div className="flex-1 space-y-6 min-w-0 w-full max-w-full">
            <div className="flex justify-end">
              <LectureTimer lectureId={lectureId} />
            </div>

            {currentQuestion && (
              <div className="space-y-6">
                {renderCurrentQuestion()}
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
    </ProtectedRoute>
  );
} 