
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question } from '@/types';
import { fetchLecture, getQuestionCount, fetchLectureQuestions } from '../api';
import { sortQuestions } from '../utils';
import { useLectureProgress } from '@/hooks/use-lecture-progress';

export function useLectureData(
  lectureId: string | undefined,
  state: ReturnType<typeof import('../state/use-lecture-state').useLectureState>
) {
  const navigate = useNavigate();
  const { updateProgress } = useLectureProgress();
  
  const { 
    setLecture, 
    setQuestions, 
    setQuestionCache, 
    setIsLoading, 
    setCurrentQuestionIndex, 
    answeredCount 
  } = state;
  
  // Fetch lecture data and questions
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
            if (state.currentQuestionIndex >= count) {
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
  }, [lectureId, navigate, state.isAddQuestionOpen]);
  
  // Update progress whenever answers change
  useEffect(() => {
    if (lectureId && state.questions.length > 0) {
      updateProgress(lectureId, answeredCount, state.questions.length);
    }
  }, [answeredCount, lectureId, state.questions.length, updateProgress]);
  
  // Function to fetch question by index - now just retrieves from cache
  const fetchQuestionByIndex = useCallback(async (index: number): Promise<Question | null> => {
    if (!lectureId || index < 0 || index >= state.questions.length) return null;
    
    // If we have questions loaded already, just return the requested one
    if (state.questions.length > 0 && state.questions[index]) {
      return state.questions[index];
    }
    
    // If we already have this question in cache, return it
    if (state.questionCache[index]) {
      return state.questionCache[index];
    }
    
    // If we don't have it cached, try to fetch all questions again
    state.setIsLoadingQuestions(true);
    
    try {
      const allQuestions = await fetchLectureQuestions(lectureId);
      
      if (!allQuestions || allQuestions.length === 0) {
        return null;
      }

      const sortedQuestions = sortQuestions(allQuestions);
      
      // Update our questions array and cache
      setQuestions(sortedQuestions);
      
      // Update cache
      const newCache = { ...state.questionCache };
      sortedQuestions.forEach((q, idx) => {
        newCache[idx] = q;
      });
      setQuestionCache(newCache);
      
      return sortedQuestions[index] || null;
    } catch (error) {
      console.error('Error fetching question:', error);
      return null;
    } finally {
      state.setIsLoadingQuestions(false);
    }
  }, [lectureId, state.questionCache, state.questions]);

  return {
    fetchQuestionByIndex
  };
}
