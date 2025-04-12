
import { useNavigate } from 'react-router-dom';

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

  const handleAnswerSubmit = (questionId: string, answer: any) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsComplete(false);
    
    // Clear cache to ensure we fetch fresh data
    setQuestionCache({});
  };

  const handleBackToSpecialty = () => {
    if (lecture && lecture.specialtyId) {
      navigate(`/specialty/${lecture.specialtyId}`);
    } else {
      navigate('/dashboard');
    }
  };

  const clearSessionData = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsComplete(false);
    setQuestionCache({});
  };

  return {
    handleAnswerSubmit,
    handleNext,
    handleRestart,
    handleBackToSpecialty,
    clearSessionData
  };
}
