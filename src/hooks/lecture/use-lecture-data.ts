
import { useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Question } from '@/types';

/**
 * Hook to handle lecture data fetching
 */
export function useLectureData(
  lectureId: string | undefined,
  state: any,
  navigate: any
) {
  const {
    setLecture,
    setTotalQuestions,
    setQuestions,
    setIsLoading,
    setIsLoadingQuestions,
    questionCache,
    setQuestionCache,
    currentQuestionIndex,
    isComplete
  } = state;

  // Fetch lecture data and total question count
  useEffect(() => {
    async function fetchLectureAndQuestionCount() {
      if (!lectureId) return;
      
      setIsLoading(true);
      
      try {
        // Fetch lecture
        const { data: lectureData, error: lectureError } = await supabase
          .from('lectures')
          .select('*')
          .eq('id', lectureId)
          .single();

        if (lectureError) {
          throw lectureError;
        }

        setLecture(lectureData);

        // Get total question count for this lecture
        const { count, error: countError } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .eq('lecture_id', lectureId);

        if (countError) {
          throw countError;
        }

        setTotalQuestions(count || 0);
        
        // Initialize questions array with empty placeholders based on count
        if (count && count > 0) {
          // Create an empty array with placeholders for all questions
          const placeholders = Array(count).fill(null);
          setQuestions(placeholders as any);
          
          // If we have a current question index beyond the total, reset it
          if (currentQuestionIndex >= count) {
            // This will be handled by the navigation hook
          }
          
          // Load the first question immediately
          // This will be handled by fetchQuestionByIndex in the appropriate effect
        }
      } catch (error) {
        console.error('Error fetching lecture data:', error);
        toast({
          title: "Error",
          description: "Failed to load lecture information. Please try again.",
          variant: "destructive",
        });
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    }

    fetchLectureAndQuestionCount();
  }, [lectureId, navigate, currentQuestionIndex, setIsLoading, setLecture, setQuestions, setTotalQuestions]);

  // Function to fetch question by index
  const fetchQuestionByIndex = useCallback(async (index: number) => {
    if (!lectureId || index < 0) return null;
    
    // If we already have this question in cache, use it
    if (questionCache[index]) {
      // Update the questions array with the cached question
      setQuestions(prevQuestions => {
        const newQuestions = [...prevQuestions];
        if (index < newQuestions.length) {
          newQuestions[index] = questionCache[index];
        }
        return newQuestions;
      });
      return questionCache[index];
    }
    
    setIsLoadingQuestions(true);
    
    try {
      // Fetch all questions to get them in the right order
      const { data: allQuestions, error } = await supabase
        .from('questions')
        .select('*')
        .eq('lecture_id', lectureId)
        .order('type', { ascending: true }) // MCQ first
        .order('number', { ascending: true }); // Then by question number

      if (error) {
        throw error;
      }

      if (!allQuestions || allQuestions.length === 0) {
        return null;
      }

      // Sort questions: first by type (MCQ first), then by number
      const sortedQuestions = [...allQuestions].sort((a, b) => {
        // First sort by type (MCQ first)
        if (a.type !== b.type) {
          return a.type === 'mcq' ? -1 : 1;
        }
        
        // If numbers are present, sort by number
        if (a.number !== undefined && b.number !== undefined) {
          return a.number - b.number;
        }
        
        // If one has a number and the other doesn't, prioritize the one with a number
        if (a.number !== undefined) return -1;
        if (b.number !== undefined) return 1;
        
        // Default sort by id
        return a.id.localeCompare(b.id);
      });

      // Update our cache with all the questions
      const newCache = { ...questionCache };
      sortedQuestions.forEach((q, idx) => {
        newCache[idx] = q;
      });
      setQuestionCache(newCache);
      
      // Update the questions array with all fetched questions
      setQuestions(sortedQuestions);
      
      // Return the requested question
      return sortedQuestions[index] || null;
    } catch (error) {
      console.error('Error fetching question:', error);
      toast({
        title: "Error",
        description: "Failed to load question. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoadingQuestions(false);
    }
  }, [lectureId, questionCache, setIsLoadingQuestions, setQuestionCache, setQuestions]);

  // Reset data when a new question is added
  useEffect(() => {
    if (lectureId) {
      // Load the current question when needed
      const loadCurrentQuestion = async () => {
        if (lectureId && !isComplete) {
          await fetchQuestionByIndex(currentQuestionIndex);
        }
      };
      
      loadCurrentQuestion();
    }
  }, [currentQuestionIndex, fetchQuestionByIndex, lectureId, isComplete]);

  return {
    fetchQuestionByIndex
  };
}
