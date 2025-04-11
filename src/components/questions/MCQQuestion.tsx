
import { useState, useEffect, useCallback } from 'react';
import { Question } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { MCQHeader } from './mcq/MCQHeader';
import { MCQOptionItem } from './mcq/MCQOptionItem';
import { MCQExplanation } from './mcq/MCQExplanation';
import { MCQActions } from './mcq/MCQActions';
import { QuestionEditDialog } from './QuestionEditDialog';
import { ReportQuestionDialog } from './ReportQuestionDialog';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface MCQQuestionProps {
  question: Question;
  onSubmit: (selectedOptionIds: string[]) => void;
  onNext: () => void;
  onPrevious?: () => void;
}

export function MCQQuestion({ question, onSubmit, onNext, onPrevious }: MCQQuestionProps) {
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [expandedExplanations, setExpandedExplanations] = useState<string[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { t } = useTranslation();
  const { lectureId } = useParams<{ lectureId: string }>();

  // Get correct answers array from question
  const correctAnswers = question.correctAnswers || question.correct_answers || [];

  // Load saved answer if it exists
  useEffect(() => {
    if (question && question.id) {
      const savedAnswer = localStorage.getItem(`lecture-${lectureId}-answers`);
      if (savedAnswer) {
        try {
          const answers = JSON.parse(savedAnswer);
          if (answers[question.id]) {
            setSelectedOptionIds(answers[question.id]);
            setSubmitted(true);
            
            // Calculate if answer is correct
            const allCorrectSelected = correctAnswers.every(id => answers[question.id].includes(id));
            const noIncorrectSelected = answers[question.id].every(id => correctAnswers.includes(id));
            setIsCorrect(allCorrectSelected && noIncorrectSelected);

            // Auto-expand explanations for saved answers
            const autoExpandIds: string[] = [];
            answers[question.id].forEach((id: string) => {
              if (!correctAnswers.includes(id)) {
                autoExpandIds.push(id);
              }
            });
            correctAnswers.forEach(id => {
              if (!answers[question.id].includes(id)) {
                autoExpandIds.push(id);
              }
            });
            setExpandedExplanations(autoExpandIds);
          } else {
            // Reset state for a new question
            setSelectedOptionIds([]);
            setSubmitted(false);
            setIsCorrect(null);
            setExpandedExplanations([]);
          }
        } catch (e) {
          console.error('Error parsing saved answers:', e);
        }
      }
    }
  }, [question, lectureId, correctAnswers]);

  // Handle checkbox change
  const handleOptionSelect = (optionId: string) => {
    if (submitted) return;
    
    setSelectedOptionIds(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  // Toggle explanation visibility
  const toggleExplanation = (optionId: string) => {
    setExpandedExplanations(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleSubmit = useCallback(() => {
    if (selectedOptionIds.length === 0 || submitted) return;
    
    setSubmitted(true);
    
    // Check if answer is completely correct (all correct options selected and no incorrect ones)
    const allCorrectSelected = correctAnswers.every(id => selectedOptionIds.includes(id));
    const noIncorrectSelected = selectedOptionIds.every(id => correctAnswers.includes(id));
    setIsCorrect(allCorrectSelected && noIncorrectSelected);
    
    // Auto-expand explanations for incorrect answers and correct answers that weren't selected
    const autoExpandIds: string[] = [];
    
    // Add incorrect selections to auto-expand
    selectedOptionIds.forEach(id => {
      if (!correctAnswers.includes(id)) {
        autoExpandIds.push(id);
      }
    });
    
    // Add correct answers that weren't selected to auto-expand
    correctAnswers.forEach(id => {
      if (!selectedOptionIds.includes(id)) {
        autoExpandIds.push(id);
      }
    });
    
    setExpandedExplanations(autoExpandIds);
    
    onSubmit(selectedOptionIds);
  }, [correctAnswers, onSubmit, selectedOptionIds, submitted]);

  const handleQuestionUpdated = () => {
    // Reload the page to refresh the question data
    window.location.reload();
  };

  // Add keyboard shortcuts for submitting answer and selecting options
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't process keyboard shortcuts when focus is on input elements
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Number keys 1-5 select options A-E (only if options exist)
      if (!submitted && question.options && ['1', '2', '3', '4', '5'].includes(event.key)) {
        const index = parseInt(event.key) - 1;
        if (index < question.options.length) {
          const optionId = question.options[index].id;
          handleOptionSelect(optionId);
        }
      }
      
      // Spacebar to submit answer or go to next question
      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault(); // Prevent page scrolling
        
        if (!submitted && selectedOptionIds.length > 0) {
          handleSubmit();
        } else if (submitted) {
          // If already submitted, move to next question
          onNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [question.options, submitted, selectedOptionIds, handleSubmit, onNext]);

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
            isCorrect={correctAnswers.includes(option.id)}
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
        showPrevious={!!onPrevious}
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
