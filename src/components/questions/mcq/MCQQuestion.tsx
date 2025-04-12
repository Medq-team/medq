
import { useState, useEffect, useCallback } from 'react';
import { Question } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { MCQHeader } from './MCQHeader';
import { MCQOptionItem } from './MCQOptionItem';
import { MCQExplanation } from './MCQExplanation';
import { MCQActions } from './MCQActions';
import { QuestionEditDialog } from '../QuestionEditDialog';
import { ReportQuestionDialog } from '../ReportQuestionDialog';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useMCQKeyboardShortcuts } from './hooks/useMCQKeyboardShortcuts';
import { useMCQState } from './hooks/useMCQState';

interface MCQQuestionProps {
  question: Question;
  onSubmit: (selectedOptionIds: string[]) => void;
  onNext: () => void;
  onPrevious?: () => void;
  showPrevious?: boolean;
}

export function MCQQuestion({ 
  question, 
  onSubmit, 
  onNext,
  onPrevious,
  showPrevious = false
}: MCQQuestionProps) {
  const { t } = useTranslation();
  const { lectureId } = useParams<{ lectureId: string }>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Use custom hooks to manage state and keyboard shortcuts
  const {
    selectedOptionIds,
    submitted,
    isCorrect,
    expandedExplanations,
    handleOptionSelect,
    toggleExplanation,
    handleSubmit
  } = useMCQState({
    question,
    onSubmit
  });

  // Set up keyboard shortcuts
  useMCQKeyboardShortcuts({
    question,
    submitted,
    selectedOptionIds,
    handleOptionSelect,
    handleSubmit,
    onNext
  });

  const handleQuestionUpdated = () => {
    // Reload the page to refresh the question data
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-start">
        <MCQHeader 
          questionText={question.text}
          isSubmitted={submitted}
          questionNumber={question.number}
          session={question.session}
        />
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <Pencil className="h-3.5 w-3.5" />
            {t('common.edit')}
          </Button>
          
          {lectureId && <ReportQuestionDialog question={question} lectureId={lectureId} />}
        </div>
      </div>

      <div className="space-y-3">
        {question.options?.map((option, index) => (
          <MCQOptionItem
            key={option.id}
            option={option}
            index={index}
            isSelected={selectedOptionIds.includes(option.id)}
            isSubmitted={submitted}
            isCorrect={(question.correctAnswers || question.correct_answers || []).includes(option.id)}
            explanation={option.explanation}
            onSelect={handleOptionSelect}
            expandedExplanations={expandedExplanations}
            toggleExplanation={toggleExplanation}
          />
        ))}
      </div>

      {submitted && (
        <MCQExplanation
          courseReminder={question.course_reminder}
          explanation={question.explanation}
        />
      )}

      <MCQActions 
        isSubmitted={submitted}
        canSubmit={selectedOptionIds.length > 0}
        isCorrect={isCorrect}
        onSubmit={handleSubmit}
        onNext={onNext}
        onPrevious={onPrevious}
        showPrevious={showPrevious}
      />
      
      <QuestionEditDialog
        question={question}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onQuestionUpdated={handleQuestionUpdated}
      />
    </motion.div>
  );
}
