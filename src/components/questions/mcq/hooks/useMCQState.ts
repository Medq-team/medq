
import { useState, useCallback, useEffect } from 'react';
import { Question } from '@/types';

interface UseMCQStateProps {
  question: Question;
  onSubmit: (selectedOptionIds: string[]) => void;
  initialSubmitted?: boolean;
  initialSelectedOptionIds?: string[];
}

export function useMCQState({ 
  question, 
  onSubmit, 
  initialSubmitted = false, 
  initialSelectedOptionIds = [] 
}: UseMCQStateProps) {
  // Use initial state from props if provided
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>(initialSelectedOptionIds);
  const [submitted, setSubmitted] = useState(initialSubmitted);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [expandedExplanations, setExpandedExplanations] = useState<string[]>([]);

  // Get correct answers array from question
  const correctAnswers = question.correctAnswers || question.correct_answers || [];

  // Handle checkbox change
  const handleOptionSelect = useCallback((optionId: string) => {
    if (submitted) return;
    
    setSelectedOptionIds(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  }, [submitted]);

  // Toggle explanation visibility
  const toggleExplanation = useCallback((optionId: string) => {
    setExpandedExplanations(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  }, []);

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

  // Reset state when question changes
  useEffect(() => {
    if (question.id && initialSelectedOptionIds.length === 0 && !initialSubmitted) {
      setSelectedOptionIds([]);
      setSubmitted(false);
      setIsCorrect(null);
      setExpandedExplanations([]);
    }
  }, [question.id, initialSelectedOptionIds, initialSubmitted]);

  return {
    selectedOptionIds,
    submitted,
    isCorrect,
    expandedExplanations,
    handleOptionSelect,
    toggleExplanation,
    handleSubmit
  };
}
