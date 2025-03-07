
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { MCQQuestion } from '@/components/questions/MCQQuestion';
import { OpenQuestion } from '@/components/questions/OpenQuestion';
import { Lecture, Question, QuestionType } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ListOrdered, PlusCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QuestionForm } from '@/components/admin/QuestionForm';

export default function LecturePage() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);

  useEffect(() => {
    async function fetchLectureAndQuestions() {
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

        // Fetch questions for this lecture
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('lecture_id', lectureId)
          .order('id');

        if (questionsError) {
          throw questionsError;
        }

        setQuestions(questionsData || []);
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
  }, [lectureId, navigate, isAddQuestionOpen]);

  const handleAnswerSubmit = (questionId: string, answer: any) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
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
    if (lecture) {
      navigate(`/specialty/${lecture.specialtyId}`);
    } else {
      navigate('/dashboard');
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 
    ? ((currentQuestionIndex + (Object.keys(answers).includes(currentQuestion?.id) ? 1 : 0)) / questions.length) * 100
    : 0;

  return (
    <AppLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            className="group flex items-center" 
            onClick={handleBackToSpecialty}
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Specialty
          </Button>
          
          <Dialog open={isAddQuestionOpen} onOpenChange={setIsAddQuestionOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Add New Question</DialogTitle>
              </DialogHeader>
              {lectureId && (
                <QuestionForm 
                  lectureId={lectureId} 
                  onComplete={() => setIsAddQuestionOpen(false)}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-2/3 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        ) : lecture && questions.length > 0 ? (
          <>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{lecture.title}</h2>
              <div className="mt-4 mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>{currentQuestionIndex + 1} of {questions.length}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            {isComplete ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border rounded-lg p-6 shadow-sm"
              >
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ListOrdered className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Lecture Complete!</h3>
                  <p className="text-muted-foreground mb-6">
                    You've completed all questions in this lecture.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Button onClick={handleRestart} variant="outline">
                      Restart Lecture
                    </Button>
                    <Button onClick={handleBackToSpecialty}>
                      Back to Specialty
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : currentQuestion ? (
              <AnimatePresence mode="wait">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  {currentQuestion.type === 'mcq' ? (
                    <MCQQuestion
                      key={currentQuestion.id}
                      question={currentQuestion}
                      onSubmit={(answer) => handleAnswerSubmit(currentQuestion.id, answer)}
                      onNext={handleNext}
                    />
                  ) : (
                    <OpenQuestion
                      key={currentQuestion.id}
                      question={currentQuestion}
                      onSubmit={(answer) => handleAnswerSubmit(currentQuestion.id, answer)}
                      onNext={handleNext}
                    />
                  )}
                </div>
              </AnimatePresence>
            ) : null}
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">No questions available</h2>
            <p className="text-muted-foreground mt-2 mb-6">
              This lecture doesn't have any questions yet. Be the first to add one!
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={() => setIsAddQuestionOpen(true)}
                size="lg"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add First Question
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
