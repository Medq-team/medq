
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestionType } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface QuestionFormSubmitProps {
  lectureId: string;
  editQuestionId?: string;
  onComplete?: () => void;
  questionType: QuestionType;
  questionText: string;
  courseReminder: string;
  questionNumber: number | undefined;
  session: string;
  options: { id: string; text: string; explanation?: string }[];
  correctAnswers: string[];
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  setIsLoading: (loading: boolean) => void;
  children: React.ReactNode;
}

export function QuestionFormSubmit({
  lectureId,
  editQuestionId,
  onComplete,
  questionType,
  questionText,
  courseReminder,
  questionNumber,
  session,
  options,
  correctAnswers,
  mediaUrl,
  mediaType,
  setIsLoading,
  children
}: QuestionFormSubmitProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

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
        course_reminder: courseReminder,
        explanation: null, // Set old field to null when migrating to new field
        number: questionNumber,
        session: session,
        media_url: mediaUrl,
        media_type: mediaType
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {children}
    </form>
  );
}
