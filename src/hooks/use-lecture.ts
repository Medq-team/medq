import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { Lecture, Question } from '@/types';
import { useLocalStorage } from './use-local-storage';

export function useLecture(lectureId: string | undefined) {
  const router = useRouter();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const storageKey = `lecture-${lectureId}`;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useLocalStorage<number>(`${storageKey}-currentIndex`, 0);
  const [answers, setAnswers] = useLocalStorage<Record<string, any>>(`${storageKey}-answers`, {});
  const [answerResults, setAnswerResults] = useLocalStorage<Record<string, boolean>>(`${storageKey}-results`, {});
  const [isComplete, setIsComplete] = useLocalStorage<boolean>(`${storageKey}-complete`, false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);

  useEffect(() => {
    async function fetchLectureAndQuestions() {
      if (!lectureId) return;
      
      setIsLoading(true);
      
      try {
        // Fetch lecture
        const lectureResponse = await fetch(`/api/lectures/${lectureId}`);
        if (!lectureResponse.ok) {
          throw new Error('Failed to fetch lecture');
        }
        const lectureData = await lectureResponse.json();
        setLecture(lectureData);

        // Fetch questions
        const questionsResponse = await fetch(`/api/questions?lectureId=${lectureId}`);
        if (!questionsResponse.ok) {
          throw new Error('Failed to fetch questions');
        }
        const questionsData = await questionsResponse.json();

        const sortedQuestions = [...questionsData].sort((a, b) => {
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
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    }

    fetchLectureAndQuestions();
  }, [lectureId, router, isAddQuestionOpen, currentQuestionIndex]);

  const handleAnswerSubmit = (questionId: string, answer: any, isCorrect?: boolean) => {
    setAnswers((prevAnswers: Record<string, any>) => ({
      ...prevAnswers,
      [questionId]: answer
    }));
    
    if (isCorrect !== undefined) {
      setAnswerResults((prevResults: Record<string, boolean>) => ({
        ...prevResults,
        [questionId]: isCorrect
      }));
    }
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
    setAnswerResults({});
    setIsComplete(false);
  };

  const handleBackToSpecialty = () => {
    if (lecture && lecture.specialtyId) {
      router.push(`/specialty/${lecture.specialtyId}`);
    } else {
      router.push('/dashboard');
    }
  };

  const clearSessionData = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setAnswerResults({});
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
    clearSessionData
  };
}
