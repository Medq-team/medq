
import { useState } from 'react';
import { useLocalStorage } from '../use-local-storage';
import { Lecture, Question } from '@/types';

/**
 * Hook to manage lecture state
 */
export function useLectureState(lectureId: string | undefined) {
  // Main lecture data
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [questionCache, setQuestionCache] = useState<Record<number, Question>>({});
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  
  // Dialog states
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  
  // Use localStorage for persistent state
  const storageKey = `lecture-${lectureId}`;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useLocalStorage<number>(`${storageKey}-currentIndex`, 0);
  const [answers, setAnswers] = useLocalStorage<Record<string, any>>(`${storageKey}-answers`, {});
  const [isComplete, setIsComplete] = useLocalStorage<boolean>(`${storageKey}-complete`, false);

  return {
    // Lecture data
    lecture,
    setLecture,
    questions,
    setQuestions,
    totalQuestions,
    setTotalQuestions,
    questionCache,
    setQuestionCache,
    
    // Loading states
    isLoading,
    setIsLoading,
    isLoadingQuestions,
    setIsLoadingQuestions,
    
    // Dialog states
    isAddQuestionOpen,
    setIsAddQuestionOpen,
    
    // Persistent state
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    setAnswers,
    isComplete,
    setIsComplete,
    
    // Storage key for local storage
    storageKey
  };
}
