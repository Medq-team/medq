
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Question } from '@/types';

/**
 * Hook to manage lecture state
 */
export function useLectureState(lectureId: string | undefined, totalQuestions: number) {
  // Use localStorage for persistent state
  const storageKey = `lecture-${lectureId}`;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useLocalStorage<number>(`${storageKey}-currentIndex`, 0);
  const [answers, setAnswers] = useLocalStorage<Record<string, any>>(`${storageKey}-answers`, {});
  const [isComplete, setIsComplete] = useLocalStorage<boolean>(`${storageKey}-complete`, false);
  
  const [lecture, setLecture] = useState(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionCache, setQuestionCache] = useState<Record<number, Question>>({});
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  
  // Reset state when question changes
  useEffect(() => {
    if (currentQuestionIndex >= totalQuestions && totalQuestions > 0) {
      setCurrentQuestionIndex(0);
    }
  }, [totalQuestions, currentQuestionIndex, setCurrentQuestionIndex]);
  
  return {
    // State
    lecture,
    setLecture,
    questions,
    setQuestions,
    questionCache,
    setQuestionCache,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    setAnswers,
    isComplete,
    setIsComplete,
    isLoading,
    setIsLoading,
    isLoadingQuestions,
    setIsLoadingQuestions,
    isAddQuestionOpen,
    setIsAddQuestionOpen,
    
    // Calculated values
    storageKey,
    answeredCount: Object.keys(answers).length,
    progress: totalQuestions > 0 ? (Object.keys(answers).length / totalQuestions) * 100 : 0
  };
}
