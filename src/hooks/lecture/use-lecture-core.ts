
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useLectureProgress } from '@/hooks/use-lecture-progress';
import { Question } from '@/types';
import { fetchLecture, getQuestionCount, fetchLectureQuestions } from './api';
import { sortQuestions } from './utils';
import { LectureHookResult } from './types';

export function useLectureCore(lectureId: string | undefined): LectureHookResult {
  const navigate = useNavigate();
  const [lecture, setLecture] = useState(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [questionCache, setQuestionCache] = useState<Record<number, Question>>({});
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  
  // Use localStorage for persistent state
  const storageKey = `lecture-${lectureId}`;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useLocalStorage<number>(`${storageKey}-currentIndex`, 0);
  const [answers, setAnswers] = useLocalStorage<Record<string, any>>(`${storageKey}-answers`, {});
  const [isComplete, setIsComplete] = useLocalStorage<boolean>(`${storageKey}-complete`, false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);

  // Use the progress hook
  const { updateProgress } = useLectureProgress();

  // Update progress whenever answers change
  useEffect(() => {
    if (lectureId && totalQuestions > 0) {
      const answeredCount = Object.keys(answers).length;
      updateProgress(lectureId, answeredCount, totalQuestions);
    }
  }, [answers, lectureId, totalQuestions, updateProgress]);

  // Fetch lecture data and all questions at once
  useEffect(() => {
    async function fetchLectureAndQuestions() {
      if (!lectureId) return;
      
      setIsLoading(true);
      
      try {
        // Fetch lecture
        const lectureData = await fetchLecture(lectureId);
        if (!lectureData) {
          navigate('/dashboard');
          return;
        }
        
        setLecture(lectureData);

        // Get total question count
        const count = await getQuestionCount(lectureId);
        setTotalQuestions(count);
        
        if (count > 0) {
          // Fetch all questions at once
          const allQuestions = await fetchLectureQuestions(lectureId);
          
          if (allQuestions && allQuestions.length > 0) {
            // Sort questions
            const sortedQuestions = sortQuestions(allQuestions);
            
            // Update state with all questions
            setQuestions(sortedQuestions);
            
            // Cache all questions by index
            const newCache: Record<number, Question> = {};
            sortedQuestions.forEach((question, idx) => {
              newCache[idx] = question;
            });
            setQuestionCache(newCache);
            
            // If we have a current question index beyond the total, reset it
            if (currentQuestionIndex >= count) {
              setCurrentQuestionIndex(0);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching lecture data:', error);
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    }

    fetchLectureAndQuestions();
  }, [lectureId, navigate, isAddQuestionOpen]);

  // Function to fetch question by index - now just retrieves from cache
  const fetchQuestionByIndex = useCallback(async (index: number) => {
    if (!lectureId || index < 0 || index >= totalQuestions) return null;
    
    // If we have questions loaded already, just return the requested one
    if (questions.length > 0 && questions[index]) {
      return questions[index];
    }
    
    // If we already have this question in cache, return it
    if (questionCache[index]) {
      return questionCache[index];
    }
    
    // If we don't have it cached, try to fetch all questions again
    setIsLoadingQuestions(true);
    
    try {
      const allQuestions = await fetchLectureQuestions(lectureId);
      
      if (!allQuestions || allQuestions.length === 0) {
        return null;
      }

      const sortedQuestions = sortQuestions(allQuestions);
      
      // Update our questions array and cache
      setQuestions(sortedQuestions);
      
      // Update cache
      const newCache = { ...questionCache };
      sortedQuestions.forEach((q, idx) => {
        newCache[idx] = q;
      });
      setQuestionCache(newCache);
      
      return sortedQuestions[index] || null;
    } catch (error) {
      console.error('Error fetching question:', error);
      return null;
    } finally {
      setIsLoadingQuestions(false);
    }
  }, [lectureId, questionCache, totalQuestions, questions]);

  const handleAnswerSubmit = (questionId: string, answer: any) => {
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
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsComplete(true);
      
      // Update progress to completed if all questions have been answered
      if (Object.keys(answers).length === totalQuestions && lectureId) {
        updateProgress(lectureId, totalQuestions, totalQuestions);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsComplete(false);
    
    // Update progress to zero
    if (lectureId) {
      updateProgress(lectureId, 0, totalQuestions);
    }
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
    
    // Update progress to zero
    if (lectureId) {
      updateProgress(lectureId, 0, totalQuestions);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = totalQuestions > 0 
    ? (answeredCount / totalQuestions) * 100
    : 0;

  return {
    lecture,
    questions,
    totalQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    isLoading,
    isLoadingQuestions,
    isComplete,
    isAddQuestionOpen,
    setIsAddQuestionOpen,
    currentQuestion,
    progress,
    answeredCount,
    handleAnswerSubmit,
    handleNext,
    handlePrevious,
    handleRestart,
    handleBackToSpecialty,
    clearSessionData,
    fetchQuestionByIndex,
    questionCache
  };
}
