
import { useState, useEffect } from 'react';
import { QuestionType, Option } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface UseQuestionFormProps {
  lectureId: string;
  editQuestionId?: string;
  onComplete?: () => void;
}

export function useQuestionForm({ lectureId, editQuestionId, onComplete }: UseQuestionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [questionType, setQuestionType] = useState<QuestionType>('mcq');
  const [questionText, setQuestionText] = useState('');
  const [courseReminder, setCourseReminder] = useState('');
  const [options, setOptions] = useState<Option[]>([
    { id: '1', text: '' },
    { id: '2', text: '' },
  ]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);

  useEffect(() => {
    if (editQuestionId) {
      fetchQuestionData();
    }
  }, [editQuestionId]);

  const fetchQuestionData = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('id', editQuestionId)
        .single();

      if (error) throw error;
      
      if (data) {
        setQuestionType(data.type);
        setQuestionText(data.text);
        setCourseReminder(data.course_reminder || data.explanation || '');
        
        if (data.type === 'mcq' && data.options) {
          setOptions(data.options);
          setCorrectAnswers(data.correct_answers || []);
        }
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      toast({
        title: "Error loading question",
        description: "Failed to load question data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleParsedContent = (
    parsedQuestionText: string, 
    parsedOptions: Option[]
  ) => {
    setQuestionText(parsedQuestionText);
    if (parsedOptions.length >= 2) {
      if (options.length === parsedOptions.length) {
        const updatedOptions = options.map((option, index) => ({
          ...option,
          text: parsedOptions[index].text,
          explanation: parsedOptions[index].explanation || option.explanation
        }));
        setOptions(updatedOptions);
      } else {
        setOptions(parsedOptions);
      }
    }
  };

  return {
    isLoading,
    setIsLoading,
    questionType,
    setQuestionType,
    questionText,
    setQuestionText,
    courseReminder,
    setCourseReminder,
    options,
    setOptions,
    correctAnswers,
    setCorrectAnswers,
    handleParsedContent,
    fetchQuestionData
  };
}
