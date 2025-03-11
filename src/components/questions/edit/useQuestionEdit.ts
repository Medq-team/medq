
import { useState, useEffect } from 'react';
import { Question } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface UseQuestionEditProps {
  question: Question | null;
  onOpenChange: (open: boolean) => void;
  onQuestionUpdated: () => void;
}

export function useQuestionEdit({
  question,
  onOpenChange,
  onQuestionUpdated
}: UseQuestionEditProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [courseReminder, setCourseReminder] = useState('');
  const [options, setOptions] = useState<{ id: string; text: string; explanation?: string }[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [answerText, setAnswerText] = useState('');

  useEffect(() => {
    if (question) {
      setQuestionText(question.text || '');
      setCourseReminder(question.course_reminder || question.explanation || '');
      
      if (question.type === 'mcq' && question.options) {
        setOptions(question.options);
        setCorrectAnswers(question.correct_answers || []);
      } else {
        setAnswerText('');
      }
    }
  }, [question]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to update questions.",
        variant: "destructive",
      });
      return;
    }
    
    if (!question) return;
    
    setIsLoading(true);
    
    try {
      let updateData: any = {
        text: questionText,
        course_reminder: courseReminder,
      };
      
      if (question.type === 'mcq') {
        updateData.options = options;
        updateData.correct_answers = correctAnswers;
      }
      
      const { error } = await supabase
        .from('questions')
        .update(updateData)
        .eq('id', question.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Question has been updated successfully.",
      });
      
      onOpenChange(false);
      onQuestionUpdated();
      
    } catch (error: any) {
      console.error('Error updating question:', error);
      toast({
        title: "Error updating question",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateOptionText = (id: string, text: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, text } : option
    ));
  };

  const updateOptionExplanation = (id: string, explanation: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, explanation } : option
    ));
  };

  const toggleCorrectAnswer = (id: string) => {
    if (correctAnswers.includes(id)) {
      setCorrectAnswers(correctAnswers.filter(answerId => answerId !== id));
    } else {
      setCorrectAnswers([...correctAnswers, id]);
    }
  };

  return {
    isLoading,
    questionText,
    setQuestionText,
    courseReminder,
    setCourseReminder,
    options,
    correctAnswers,
    updateOptionText,
    updateOptionExplanation,
    toggleCorrectAnswer,
    handleSubmit
  };
}
