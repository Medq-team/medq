import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Lecture, Question } from '@/types';
import { useLocalStorage } from './use-local-storage';
import { ensureQuestionMediaBucket } from '@/lib/supabase';

export function useLecture(lectureId: string | undefined) {
  const navigate = useNavigate();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const storageKey = `lecture-${lectureId}`;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useLocalStorage<number>(`${storageKey}-currentIndex`, 0);
  const [answers, setAnswers] = useLocalStorage<Record<string, any>>(`${storageKey}-answers`, {});
  const [isComplete, setIsComplete] = useLocalStorage<boolean>(`${storageKey}-complete`, false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);

  useEffect(() => {
    ensureQuestionMediaBucket();
    
    async function fetchLectureAndQuestions() {
      if (!lectureId) return;
      
      setIsLoading(true);
      
      try {
        const { data: lectureData, error: lectureError } = await supabase
          .from('lectures')
          .select('*')
          .eq('id', lectureId)
          .single();

        if (lectureError) {
          throw lectureError;
        }

        setLecture(lectureData);

        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('lecture_id', lectureId);

        if (questionsError) {
          throw questionsError;
        }

        const sortedQuestions = [...(questionsData || [])].sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === 'mcq' ? -1 : 1;
          }
          
          if (a.number !== undefined && b.number !== undefined) {
            return a.number - b.number;
          }
          
          if (a.number !== undefined) return -1;
          if (b.number !== undefined) return 1;
          
          return a.id.localeCompare(b.id);
        });

        setQuestions(sortedQuestions);
        
        if (sortedQuestions.length > 0 && currentQuestionIndex >= sortedQuestions.length) {
          setCurrentQuestionIndex(0);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
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

    fetchLectureAndQuestions();
  }, [lectureId, navigate, isAddQuestionOpen, currentQuestionIndex]);

  const handleAnswerSubmit = (questionId: string, answer: any) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsComplete(false);
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
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 
    ? ((currentQuestionIndex + (Object.keys(answers).includes(currentQuestion?.id) ? 1 : 0)) / questions.length) * 100
    : 0;

  return {
    lecture,
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
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
    clearSessionData
  };
}
