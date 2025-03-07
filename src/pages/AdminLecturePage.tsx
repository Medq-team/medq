
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionForm } from '@/components/admin/QuestionForm';
import { Lecture, Question } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, PlusCircle, HelpCircle, PenLine, Edit, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminLecturePage() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
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
        navigate('/admin');
      } finally {
        setIsLoading(false);
      }
    }

    fetchLectureAndQuestions();
  }, [lectureId, isAdmin, navigate]);

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

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  if (showAddForm) {
    return (
      <AppLayout>
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => {
            setShowAddForm(false);
            setEditQuestionId(null);
          }}
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
        <Button 
          variant="ghost" 
          className="group flex items-center" 
          onClick={() => navigate('/admin')}
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Admin
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {lecture ? `Manage: ${lecture.title}` : 'Add New Question'}
            </h2>
            <p className="text-muted-foreground mt-1">
              {lecture ? 'Add or edit questions for this lecture' : 'Create a new question'}
            </p>
          </div>
          
          <Button onClick={() => setShowAddForm(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>

        {!isLoading && questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <HelpCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No questions yet</h3>
            <p className="text-muted-foreground mt-2">
              Add your first question to this lecture to help students learn.
            </p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => setShowAddForm(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {questions.map((question) => (
              <Card key={question.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted mb-2">
                        {question.type === 'mcq' ? (
                          <>
                            <HelpCircle className="h-3 w-3 mr-1" />
                            Multiple Choice
                          </>
                        ) : (
                          <>
                            <PenLine className="h-3 w-3 mr-1" />
                            Open Question
                          </>
                        )}
                      </div>
                      <CardTitle className="text-base">{question.text}</CardTitle>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditQuestion(question.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Question</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this question? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDeleteQuestion(question.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-sm">
                  {question.type === 'mcq' && question.options && (
                    <div className="space-y-1">
                      {question.options.map((option, index) => (
                        <div key={option.id} className="flex items-start gap-2">
                          <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-xs 
                            ${(question.correct_answers?.includes(option.id)) 
                              ? 'bg-green-100 text-green-800 border border-green-300' 
                              : 'bg-muted text-muted-foreground'}`}
                          >
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span>{option.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.explanation && (
                    <div className="mt-3 pt-3 border-t text-muted-foreground">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
