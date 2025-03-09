
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionType } from '@/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { QuestionTypeSelect } from './QuestionTypeSelect';
import { QuestionFields } from './QuestionFields';
import { McqOptionsSection } from './McqOptionsSection';
import { AutoParseInput } from './AutoParseInput';
import { useAuth } from '@/contexts/AuthContext';

interface QuestionFormProps {
  lectureId: string;
  editQuestionId?: string;
  onComplete?: () => void;
}

export function QuestionForm({ lectureId, editQuestionId, onComplete }: QuestionFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [questionType, setQuestionType] = useState<QuestionType>('mcq');
  const [questionText, setQuestionText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [options, setOptions] = useState<{ id: string; text: string }[]>([
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
        setExplanation(data.explanation || '');
        
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create or edit questions.",
        variant: "destructive",
      });
      return;
    }
    
    if (questionType === 'mcq' && correctAnswers.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one correct answer",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const questionData = {
        lecture_id: lectureId,
        type: questionType,
        text: questionText,
        options: questionType === 'mcq' ? options : [],
        correct_answers: questionType === 'mcq' ? correctAnswers : [],
        explanation,
      };
      
      let result;
      
      if (editQuestionId) {
        result = await supabase
          .from('questions')
          .update(questionData)
          .eq('id', editQuestionId);
      } else {
        result = await supabase
          .from('questions')
          .insert(questionData);
      }
      
      if (result.error) {
        console.error('Error details:', result.error);
        throw result.error;
      }
      
      toast({
        title: `Question ${editQuestionId ? 'updated' : 'created'} successfully`,
        description: "The question has been saved to the database",
      });
      
      if (onComplete) {
        onComplete();
      } else {
        navigate(`/admin/lecture/${lectureId}`);
      }
    } catch (error: any) {
      console.error('Error saving question:', error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      // Handle specific error cases
      if (error.code === 'PGRST116') {
        errorMessage = "You don't have permission to perform this action. Make sure you're logged in.";
      } else if (error.code === '42501') {
        errorMessage = "Permission denied. You might not have the right access level.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error saving question",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onComplete) {
      onComplete();
    } else {
      navigate(`/admin/lecture/${lectureId}`);
    }
  };

  const handleParsedContent = (parsedQuestionText: string, parsedOptions: { id: string; text: string }[]) => {
    setQuestionText(parsedQuestionText);
    if (parsedOptions.length >= 2) {
      setOptions(parsedOptions);
    }
  };

  return (
    <Card className={onComplete ? "w-full border-0 shadow-none" : "w-full max-w-3xl mx-auto"}>
      {!onComplete && (
        <CardHeader>
          <CardTitle>{editQuestionId ? 'Edit Question' : 'Create New Question'}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <QuestionTypeSelect 
            questionType={questionType} 
            setQuestionType={setQuestionType} 
          />
          
          {questionType === 'mcq' && !editQuestionId && (
            <AutoParseInput onParsedContent={handleParsedContent} />
          )}
          
          <QuestionFields 
            questionText={questionText}
            setQuestionText={setQuestionText}
            explanation={explanation}
            setExplanation={setExplanation}
            questionType={questionType}
          />
          
          {questionType === 'mcq' && (
            <McqOptionsSection
              options={options}
              setOptions={setOptions}
              correctAnswers={correctAnswers}
              setCorrectAnswers={setCorrectAnswers}
            />
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : (editQuestionId ? "Update Question" : "Create Question")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
