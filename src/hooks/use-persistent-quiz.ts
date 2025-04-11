import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from './use-local-storage';
import { Question } from '@/types';
import { useBackgroundTasksContext } from '@/contexts/BackgroundTasksContext';

interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, any>;
  timeSpent: number;
  startTime: number;
  isComplete: boolean;
}

interface UsePersistentQuizReturn {
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  answers: Record<string, any>;
  handleAnswerSubmit: (questionId: string, answer: any) => void;
  timeSpent: number;
  isComplete: boolean;
  setIsComplete: (value: boolean) => void;
  progress: number;
  resetQuiz: () => void;
}

export function usePersistentQuiz(
  lectureId: string | undefined,
  questions: Question[]
): UsePersistentQuizReturn {
  // Unique key for this lecture's quiz state
  const stateKey = `quiz-state-${lectureId}`;
  
  // Use local storage for persisting the quiz state
  const [quizState, setQuizState] = useLocalStorage<QuizState>(stateKey, {
    currentQuestionIndex: 0,
    answers: {},
    timeSpent: 0,
    startTime: Date.now(),
    isComplete: false,
  });
  
  // Local state for time tracking
  const [timeSpent, setTimeSpent] = useState(quizState.timeSpent);
  const timerRef = useRef<number | null>(null);
  
  // Get background tasks context for timer task
  const { createTask, cancelTask } = useBackgroundTasksContext();
  const timerTaskRef = useRef<string | null>(null);

  // Initialize or resume timer when component mounts
  useEffect(() => {
    if (!lectureId || quizState.isComplete) return;
    
    // Start a background task for timing
    if (!timerTaskRef.current) {
      timerTaskRef.current = createTask('quiz-timer', { 
        lectureId, 
        startTime: quizState.startTime 
      }) || null;
    }
    
    // Also keep a local timer for immediate UI updates
    timerRef.current = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - quizState.startTime) / 1000);
      setTimeSpent(elapsed);
      
      // Update localStorage every 5 seconds to reduce writes
      if (elapsed % 5 === 0) {
        setQuizState(prev => ({
          ...prev,
          timeSpent: elapsed
        }));
      }
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (timerTaskRef.current) {
        cancelTask(timerTaskRef.current);
      }
    };
  }, [lectureId, quizState.isComplete, quizState.startTime]);
  
  // Sync with document visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Refresh time when tab becomes visible again
        const elapsed = Math.floor((Date.now() - quizState.startTime) / 1000);
        setTimeSpent(elapsed);
        
        // Update the persisted state
        setQuizState(prev => ({
          ...prev,
          timeSpent: elapsed
        }));
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [quizState.startTime]);
  
  // Handle answer submission
  const handleAnswerSubmit = (questionId: string, answer: any) => {
    const newAnswers = {
      ...quizState.answers,
      [questionId]: answer
    };
    
    setQuizState(prev => ({
      ...prev,
      answers: newAnswers
    }));
  };
  
  // Set current question index
  const setCurrentQuestionIndex = (index: number) => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: index
    }));
  };
  
  // Set quiz completion status
  const setIsComplete = (value: boolean) => {
    setQuizState(prev => ({
      ...prev,
      isComplete: value
    }));
    
    // Clear timer if complete
    if (value && timerRef.current) {
      window.clearInterval(timerRef.current);
      if (timerTaskRef.current) {
        cancelTask(timerTaskRef.current);
      }
    }
  };
  
  // Calculate progress
  const progress = questions.length > 0 
    ? ((quizState.currentQuestionIndex + (Object.keys(quizState.answers).includes(questions[quizState.currentQuestionIndex]?.id) ? 1 : 0)) / questions.length) * 100
    : 0;
  
  // Reset the quiz
  const resetQuiz = () => {
    const newQuizState = {
      currentQuestionIndex: 0,
      answers: {},
      timeSpent: 0,
      startTime: Date.now(),
      isComplete: false,
    };
    
    setQuizState(newQuizState);
    setTimeSpent(0);
    
    // Restart timer
    if (timerTaskRef.current) {
      cancelTask(timerTaskRef.current);
    }
    timerTaskRef.current = createTask('quiz-timer', { 
      lectureId, 
      startTime: newQuizState.startTime 
    }) || null;
  };
  
  return {
    currentQuestionIndex: quizState.currentQuestionIndex,
    setCurrentQuestionIndex,
    answers: quizState.answers,
    handleAnswerSubmit,
    timeSpent,
    isComplete: quizState.isComplete,
    setIsComplete,
    progress,
    resetQuiz,
  };
}
