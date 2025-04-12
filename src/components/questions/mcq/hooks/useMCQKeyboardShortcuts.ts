
import { useEffect } from 'react';
import { Question } from '@/types';

interface UseMCQKeyboardShortcutsProps {
  question: Question;
  submitted: boolean;
  selectedOptionIds: string[];
  handleOptionSelect: (optionId: string) => void;
  handleSubmit: () => void;
  onNext: () => void;
}

export function useMCQKeyboardShortcuts({
  question,
  submitted,
  selectedOptionIds,
  handleOptionSelect,
  handleSubmit,
  onNext
}: UseMCQKeyboardShortcutsProps) {
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
  }, [question.options, submitted, selectedOptionIds, handleSubmit, handleOptionSelect, onNext]);
}
