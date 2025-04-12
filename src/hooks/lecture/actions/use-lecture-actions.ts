
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLectureProgress } from '@/hooks/use-lecture-progress';

export function useLectureActions(
  lectureId: string | undefined,
  state: ReturnType<typeof import('../state/use-lecture-state').useLectureState>
) {
  const navigate = useNavigate();
  const { updateProgress } = useLectureProgress();
  
  const { 
    setAnswers, 
    setCurrentQuestionIndex, 
    setIsComplete,
    questions, 
    currentQuestionIndex,
    answers
  } = state;
  
  const totalQuestions = questions.length;

  const handleAnswerSubmit = useCallback((questionId: string, answer: any) => {
    setAnswers(prevAnswers => {
      const newAnswers = {
        ...prevAnswers,
        [questionId]: answer
      };
      
      // Update progress after updating answers
      if (lectureId) {
        updateProgress(lectureId, Object.keys(newAnswers).length, totalQuestions);
      }
      
      return newAnswers;
    });
  }, [lectureId, totalQuestions, updateProgress, setAnswers]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsComplete(true);
      
      // Update progress to completed if all questions have been answered
      if (Object.keys(answers).length === totalQuestions && lectureId) {
        updateProgress(lectureId, totalQuestions, totalQuestions);
      }
    }
  }, [currentQuestionIndex, totalQuestions, answers, lectureId, setCurrentQuestionIndex, setIsComplete, updateProgress]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex, setCurrentQuestionIndex]);

  const handleRestart = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsComplete(false);
    
    // Update progress to zero
    if (lectureId) {
      updateProgress(lectureId, 0, totalQuestions);
    }
  }, [lectureId, totalQuestions, setCurrentQuestionIndex, setAnswers, setIsComplete, updateProgress]);

  const handleBackToSpecialty = useCallback(() => {
    if (state.lecture && state.lecture.specialtyId) {
      navigate(`/specialty/${state.lecture.specialtyId}`);
    } else {
      navigate('/dashboard');
    }
  }, [state.lecture, navigate]);

  const clearSessionData = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsComplete(false);
    
    // Update progress to zero
    if (lectureId) {
      updateProgress(lectureId, 0, totalQuestions);
    }
  }, [lectureId, totalQuestions, setCurrentQuestionIndex, setAnswers, setIsComplete, updateProgress]);

  return {
    handleAnswerSubmit,
    handleNext,
    handlePrevious,
    handleRestart,
    handleBackToSpecialty,
    clearSessionData
  };
}
