
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Lecture, Question } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { QuestionForm } from '@/components/admin/QuestionForm';
import { QuestionsList } from '@/components/admin/QuestionsList';
import { LectureHeader } from '@/components/admin/LectureHeader';

interface AdminLecturePageProps {
  lectureId: string;
}

export default function AdminLecturePage({ lectureId }: AdminLecturePageProps) {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }

    async function fetchLectureAndQuestions() {
      if (!lectureId || lectureId === 'new') return;
      
      setIsLoading(true);
      
      try {
        // Fetch lecture
        const { data: lectureData, error: lectureError } = await supabase
          .from('lectures')
          .select('*')
          .eq('id', lectureId)
          .single();

        if (lectureError) throw lectureError;
        setLecture(lectureData);

        // Fetch questions
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('lecture_id', lectureId)
          .order('id');

        if (questionsError) throw questionsError;
        setQuestions(questionsData || []);
      } catch (error) {
        console.error('Error fetching lecture data:', error);
        toast({
          title: "Error",
          description: "Failed to load lecture data. Please try again.",
          variant: "destructive",
        });
        router.push('/admin');
      } finally {
        setIsLoading(false);
      }
    }

    fetchLectureAndQuestions();
  }, [lectureId, isAdmin, router]);

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);
      
      if (error) throw error;
      
      setQuestions(questions.filter(q => q.id !== questionId));
      
      toast({
        title: "Question deleted",
        description: "The question has been removed successfully",
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "Failed to delete question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditQuestion = (questionId: string) => {
    setEditQuestionId(questionId);
    setShowAddForm(true);
  };

  const handleAddQuestion = () => {
    setEditQuestionId(null);
    setShowAddForm(true);
  };

  const handleBackToQuestions = () => {
    setShowAddForm(false);
    setEditQuestionId(null);
  };

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  if (showAddForm) {
    return (
      <AppLayout>
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={handleBackToQuestions}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Questions
        </Button>
        
        <QuestionForm 
          lectureId={lectureId || ''} 
          editQuestionId={editQuestionId || undefined}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <LectureHeader 
          lecture={lecture}
          onBack={() => router.push('/admin')}
          onAddQuestion={handleAddQuestion}
        />

        <QuestionsList
          questions={questions}
          isLoading={isLoading}
          onEdit={handleEditQuestion}
          onDelete={handleDeleteQuestion}
          onAddQuestion={handleAddQuestion}
        />
      </div>
    </AppLayout>
  );
}
