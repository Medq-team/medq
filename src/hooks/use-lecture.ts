
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Lecture, Question } from '@/types';
import { useLocalStorage } from './use-local-storage';

export function useLecture(lectureId: string | undefined) {
  const navigate = useNavigate();
  const [lecture, setLecture] = useState<Lecture | null>(null);
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
            setCurrentQuestionIndex(0);
          }
          
          // Load the first question immediately
          await fetchQuestionByIndex(currentQuestionIndex);
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
  }, [lectureId, navigate, isAddQuestionOpen]);

  // Function to fetch question by index
  const fetchQuestionByIndex = useCallback(async (index: number) => {
    if (!lectureId || index < 0 || index >= totalQuestions) return null;
    
    // If we already have this question in cache, use it
    if (questionCache[index]) {
      // Update the questions array with the cached question
      setQuestions(prevQuestions => {
        const newQuestions = [...prevQuestions];
        newQuestions[index] = questionCache[index];
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
  }, [lectureId, questionCache, totalQuestions]);

  // Load the current question whenever the index changes
  useEffect(() => {
    if (lectureId && totalQuestions > 0 && !isComplete) {
      fetchQuestionByIndex(currentQuestionIndex);
    }
  }, [currentQuestionIndex, fetchQuestionByIndex, lectureId, totalQuestions, isComplete]);

  // Reset data when a new question is added
  useEffect(() => {
    if (isAddQuestionOpen === false) {
      // Refresh question count and data when the add question dialog is closed
      async function refreshData() {
        if (!lectureId) return;
        
        try {
          // Get updated total question count
          const { count, error: countError } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true })
            .eq('lecture_id', lectureId);

          if (countError) {
            throw countError;
          }

          if (count !== totalQuestions) {
            setTotalQuestions(count || 0);
            // Clear cache to ensure we fetch fresh data
            setQuestionCache({});
            await fetchQuestionByIndex(currentQuestionIndex);
          }
        } catch (error) {
          console.error('Error refreshing question data:', error);
        }
      }
      
      refreshData();
    }
  }, [isAddQuestionOpen, lectureId, currentQuestionIndex, fetchQuestionByIndex, totalQuestions]);

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
    fetchQuestionByIndex(0);
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
    handleRestart,
    handleBackToSpecialty,
    clearSessionData,
    fetchQuestionByIndex
  };
}
