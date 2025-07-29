
import { useState, useEffect } from 'react';
import { Question } from '@/types';
import { motion } from 'framer-motion';
import { OpenQuestionHeader } from './open/OpenQuestionHeader';
import { OpenQuestionInput } from './open/OpenQuestionInput';
import { OpenQuestionExplanation } from './open/OpenQuestionExplanation';
import { OpenQuestionSelfAssessment } from './open/OpenQuestionSelfAssessment';
import { OpenQuestionActions } from './open/OpenQuestionActions';
import { QuestionEditDialog } from './QuestionEditDialog';
import { ReportQuestionDialog } from './ReportQuestionDialog';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProgress } from '@/hooks/use-progress';

import { QuestionMedia } from './QuestionMedia';
import { ClinicalCaseDisplay } from './ClinicalCaseDisplay';

interface OpenQuestionProps {
  question: Question;
  onSubmit: (answer: string, resultValue: boolean | 'partial') => void;
  onNext: () => void;
  lectureId?: string;
  isAnswered?: boolean;
  answerResult?: boolean | 'partial';
  userAnswer?: string;
}

export function OpenQuestion({ question, onSubmit, onNext, lectureId, isAnswered, answerResult, userAnswer }: OpenQuestionProps) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showSelfAssessment, setShowSelfAssessment] = useState(false);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const { t } = useTranslation();
  const { trackQuestionProgress } = useProgress();

  // Initialize component state based on whether question is already answered
  useEffect(() => {
    if (isAnswered && answerResult !== undefined) {
      setAnswer(userAnswer || '');
      setSubmitted(true);
      setAssessmentCompleted(true);
      setShowSelfAssessment(false);
    } else {
      setAnswer('');
      setSubmitted(false);
      setShowSelfAssessment(false);
      setAssessmentCompleted(false);
    }
  }, [question.id, isAnswered, answerResult, userAnswer]);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    
    setSubmitted(true);
    setShowSelfAssessment(true);
    
    // Don't call onSubmit here - wait for self-assessment
  };

  const handleSelfAssessment = async (rating: 'correct' | 'wrong' | 'partial') => {
    setAssessmentCompleted(true);
    setShowSelfAssessment(false);
    
    // Store the rating as a string for proper handling in the navigator
    const resultValue = rating === 'correct' ? true : rating === 'partial' ? 'partial' : false;
    
    // Track progress if lectureId is provided
    if (lectureId) {
      // Pass the actual rating to progress tracking
      const progressValue = rating === 'correct' ? true : rating === 'partial' ? 'partial' : false;
      trackQuestionProgress(lectureId, question.id, progressValue);
    }
    
    // Call onSubmit with the rating information
    onSubmit(answer, resultValue);
  };

  const handleQuestionUpdated = () => {
    // Reload the page to refresh the question data
    window.location.reload();
  };

  // Reset question state to allow re-answering
  const handleReAnswer = () => {
    setAnswer('');
    setSubmitted(false);
    setShowSelfAssessment(false);
    setAssessmentCompleted(false);
  };

  // Add keyboard shortcut for submitting answer
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '1') {
        // Only trigger if not already submitted and there's text in the answer
        if (!submitted && answer.trim()) {
          handleSubmit();
        } else if (submitted && assessmentCompleted) {
          // If already submitted and assessment completed, move to next question
          onNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [submitted, answer, assessmentCompleted, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 w-full max-w-full"
    >
      {/* Clinical Case Display - Above the question */}
      <ClinicalCaseDisplay 
        caseNumber={question.caseNumber}
        caseText={question.caseText}
        caseQuestionNumber={question.caseQuestionNumber}
      />
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <OpenQuestionHeader 
            questionText={question.text} 
            questionNumber={question.number}
            session={question.session}
          />
        </div>
        
        <div className="flex gap-2 flex-shrink-0">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t('common.edit')}</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsReportDialogOpen(true)}
          >
            <span className="hidden sm:inline">{t('questions.report')}</span>
          </Button>
        </div>
      </div>
      
      {/* Question Media */}
      <QuestionMedia question={question} className="mb-4" />

      <OpenQuestionInput
        answer={answer}
        setAnswer={setAnswer}
        isSubmitted={submitted}
      />

      {submitted && (
        <OpenQuestionExplanation
          courseReminder={question.course_reminder}
          explanation={question.explanation}
          correctAnswers={question.correctAnswers || question.correct_answers}
        />
      )}

      {showSelfAssessment && (
        <OpenQuestionSelfAssessment
          onAssessment={handleSelfAssessment}
        />
      )}

      <OpenQuestionActions
        isSubmitted={submitted}
        canSubmit={answer.trim().length > 0}
        onSubmit={handleSubmit}
        onNext={onNext}
        showNext={assessmentCompleted}
        onReAnswer={handleReAnswer}
      />
      
      <QuestionEditDialog
        question={question}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onQuestionUpdated={handleQuestionUpdated}
      />
      
      <ReportQuestionDialog
        question={question}
        isOpen={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
      />
    </motion.div>
  );
}
