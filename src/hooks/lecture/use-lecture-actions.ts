
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Hook to manage lecture actions like answering, navigation, etc.
 */
export function useLectureActions(state: any) {
  const navigate = useNavigate();
  const {
    totalQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    setAnswers,
    setIsComplete,
    setQuestionCache,
    lecture
  } = state;

  const handleAnswerSubmit = useCallback((questionId: string, answer: any) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer
    }));
  }, [setAnswers]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsComplete(true);
    }
  }, [currentQuestionIndex, totalQuestions, setCurrentQuestionIndex, setIsComplete]);

  const handleRestart = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsComplete(false);
    
    // Clear cache to ensure we fetch fresh data
    setQuestionCache({});
  }, [setCurrentQuestionIndex, setAnswers, setIsComplete, setQuestionCache]);

  const handleBackToSpecialty = useCallback(() => {
    if (lecture && lecture.specialtyId) {
      navigate(`/specialty/${lecture.specialtyId}`);
    } else {
      navigate('/dashboard');
    }
  }, [lecture, navigate]);

  const clearSessionData = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsComplete(false);
    setQuestionCache({});
  }, [setCurrentQuestionIndex, setAnswers, setIsComplete, setQuestionCache]);

  return {
    handleAnswerSubmit,
    handleNext,
    handleRestart,
    handleBackToSpecialty,
    clearSessionData
  };
}
