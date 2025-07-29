import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { Lecture, Question } from '@/types';
import { useLocalStorage } from './use-local-storage';
import { useAuth } from '@/contexts/AuthContext';

// Cache for lecture data to avoid refetching
const lectureCache = new Map<string, { lecture: Lecture; questions: Question[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useLecture(lectureId: string | undefined) {
  const router = useRouter();
  const { user } = useAuth();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const storageKey = `lecture-${lectureId}`;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useLocalStorage<number>(`${storageKey}-currentIndex`, 0);
  const [answers, setAnswers] = useLocalStorage<Record<string, any>>(`${storageKey}-answers`, {});
  const [answerResults, setAnswerResults] = useLocalStorage<Record<string, boolean | 'partial'>>(`${storageKey}-results`, {});
  const [isComplete, setIsComplete] = useLocalStorage<boolean>(`${storageKey}-complete`, false);
  
  // Debug storage state
  useEffect(() => {
    console.log('Storage state loaded:', {
      storageKey,
      currentQuestionIndex,
      answers,
      answerResults,
      isComplete
    });
  }, [storageKey, currentQuestionIndex, answers, answerResults, isComplete]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const hasSyncedProgress = useRef(false);

  const fetchLectureData = useCallback(async () => {
    if (!lectureId) return;
    
    // Check cache first
    const cached = lectureCache.get(lectureId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setLecture(cached.lecture);
      setQuestions(cached.questions);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Single optimized API call to fetch lecture with questions
      const response = await fetch(`/api/lectures/${lectureId}?includeQuestions=true`);
      if (!response.ok) {
        throw new Error('Failed to fetch lecture data');
      }
      
      const data = await response.json();
      
      // Cache the data
      lectureCache.set(lectureId, {
        lecture: data,
        questions: data.questions || [],
        timestamp: Date.now()
      });
      
      setLecture(data);
      setQuestions(data.questions || []);
      
      if (data.questions && data.questions.length > 0 && currentQuestionIndex >= data.questions.length) {
        setCurrentQuestionIndex(0);
      }
    } catch (error) {
      console.error('Error fetching lecture data:', error);
      toast({
        title: "Error",
        description: "Failed to load lecture information. Please try again.",
        variant: "destructive",
      });
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [lectureId, router, currentQuestionIndex]);

  useEffect(() => {
    fetchLectureData();
    // Reset sync flag when lecture changes
    hasSyncedProgress.current = false;
  }, [fetchLectureData]);

  // Clear cache when adding questions
  useEffect(() => {
    if (isAddQuestionOpen) {
      lectureCache.delete(lectureId!);
    }
  }, [isAddQuestionOpen, lectureId]);

  // Temporarily disabled progress sync to fix state overwriting issue
  // TODO: Re-enable with proper logic to prevent overwriting user actions
  /*
  useEffect(() => {
    if (!lectureId || !user || hasSyncedProgress.current) return;

    const syncProgressFromDatabase = async () => {
      try {
        const response = await fetch(`/api/progress?lectureId=${lectureId}`);
        if (response.ok) {
          const progressData = await response.json();
          
          // Convert database scores to answerResults format
          const syncedResults: Record<string, boolean | 'partial'> = {};
          const syncedAnswers: Record<string, any> = {};
          
          progressData.forEach((item: any) => {
            if (item.questionId && item.completed) {
              // Convert numeric score to result format
              let result: boolean | 'partial';
              if (item.score === 1) {
                result = true;
              } else if (item.score === 0.5) {
                result = 'partial';
              } else {
                result = false;
              }
              
              syncedResults[item.questionId] = result;
              syncedAnswers[item.questionId] = 'answered'; // Mark as answered
            }
          });
          
          // Only sync if we don't have any local data yet
          setAnswerResults((prevResults) => {
            console.log('Syncing answerResults:', { prevResults, syncedResults });
            if (Object.keys(prevResults).length === 0) {
              return syncedResults;
            }
            return prevResults;
          });
          
          setAnswers((prevAnswers) => {
            console.log('Syncing answers:', { prevAnswers, syncedAnswers });
            if (Object.keys(prevAnswers).length === 0) {
              return syncedAnswers;
            }
            return prevAnswers;
          });
          
          // Mark as synced to prevent future calls
          hasSyncedProgress.current = true;
        }
      } catch (error) {
        console.error('Error syncing progress from database:', error);
      }
    };

    syncProgressFromDatabase();
  }, [lectureId, user]);
  */



  const handleAnswerSubmit = useCallback((questionId: string, answer: any, isCorrect?: boolean | 'partial') => {
    console.log('handleAnswerSubmit called:', { questionId, answer, isCorrect });
    console.log('Current storage key:', storageKey);
    console.log('Current answers before update:', answers);
    console.log('Current answerResults before update:', answerResults);
    
    setAnswers((prevAnswers: Record<string, any>) => {
      const newAnswers = {
        ...prevAnswers,
        [questionId]: answer
      };
      console.log('Updated answers:', newAnswers);
      return newAnswers;
    });
    
    if (isCorrect !== undefined) {
      setAnswerResults((prevResults: Record<string, boolean | 'partial'>) => {
        const newResults = {
          ...prevResults,
          [questionId]: isCorrect
        };
        console.log('Updated answerResults:', newResults);
        return newResults;
      });
    }
  }, [answers, answerResults, storageKey]);

  const handleNext = useCallback(() => {
    console.log('handleNext called:', { 
      currentQuestionIndex, 
      questionsLength: questions.length, 
      isComplete: false 
    });
    
    if (currentQuestionIndex < questions.length - 1) {
      console.log('Moving to next question:', currentQuestionIndex + 1);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log('Setting lecture as complete');
      setIsComplete(true);
    }
  }, [currentQuestionIndex, questions.length, setCurrentQuestionIndex]);

  const handleRestart = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setAnswerResults({});
    setIsComplete(false);
    hasSyncedProgress.current = false; // Reset sync flag for restart
  }, [setCurrentQuestionIndex]);

  const handleBackToSpecialty = useCallback(() => {
    if (lecture && lecture.specialtyId) {
      router.push(`/specialty/${lecture.specialtyId}`);
    } else {
      router.push('/dashboard');
    }
  }, [lecture, router]);

  const clearSessionData = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setAnswerResults({});
    setIsComplete(false);
  }, [setCurrentQuestionIndex]);

  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  
  const progress = useMemo(() => {
    if (questions.length === 0) return 0;
    const answeredCount = Object.keys(answers).length;
    return (answeredCount / questions.length) * 100;
  }, [questions.length, answers]);

  return {
    lecture,
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    answerResults,
    isLoading,
    isComplete,
    isAddQuestionOpen,
    setIsAddQuestionOpen,
    currentQuestion,
    progress,
    handleAnswerSubmit,
    handleNext,
    handleRestart,
    handleBackToSpecialty,
    clearSessionData,
    refetch: fetchLectureData
  };
}
