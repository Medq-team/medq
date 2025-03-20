
// The original file can't be modified, so we will modify the components that use it

// Update the Question components that are editable:
<lov-write file_path="src/components/questions/MCQQuestion.tsx">
import { useState } from 'react';
import { Question } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { MCQHeader } from './mcq/MCQHeader';
import { MCQOptionItem } from './mcq/MCQOptionItem';
import { MCQExplanation } from './mcq/MCQExplanation';
import { MCQActions } from './mcq/MCQActions';
import { QuestionEditDialog } from './QuestionEditDialog';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface MCQQuestionProps {
  question: Question;
  onSubmit: (selectedOptionIds: string[]) => void;
  onNext: () => void;
}

export function MCQQuestion({ question, onSubmit, onNext }: MCQQuestionProps) {
  const { t } = useTranslation();
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [expandedExplanations, setExpandedExplanations] = useState<string[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Get correct answers array from question
  const correctAnswers = question.correctAnswers || question.correct_answers || [];

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

  const handleSubmit = () => {
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
  };

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
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsEditDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <Pencil className="h-3.5 w-3.5" />
          {t('Edit')}
        </Button>
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
