
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Question, QuestionType } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';

interface QuestionEditDialogProps {
  question: Question | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onQuestionUpdated: () => void;
}

export function QuestionEditDialog({ 
  question, 
  isOpen, 
  onOpenChange,
  onQuestionUpdated
}: QuestionEditDialogProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [courseReminder, setCourseReminder] = useState('');
  const [options, setOptions] = useState<{ id: string; text: string; explanation?: string }[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [answerText, setAnswerText] = useState('');
  const [activeTab, setActiveTab] = useState<string>("content");

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

  if (!question) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="content" className="flex-1">Question Content</TabsTrigger>
            {question.type === 'mcq' && (
              <TabsTrigger value="answers" className="flex-1">Answers & Explanations</TabsTrigger>
            )}
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question-text">Question Text</Label>
                <Textarea
                  id="question-text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter question text..."
                  className="min-h-24"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="course-reminder">
                  {question.type === 'mcq' ? 'Course Reminder' : 'Reference Answer'}
                </Label>
                <Textarea
                  id="course-reminder"
                  value={courseReminder}
                  onChange={(e) => setCourseReminder(e.target.value)}
                  placeholder={question.type === 'mcq' 
                    ? "Enter educational reminder or background information..." 
                    : "Enter reference answer..."}
                  className="min-h-32"
                />
              </div>
            </TabsContent>
            
            {question.type === 'mcq' && (
              <TabsContent value="answers" className="space-y-4">
                <div className="space-y-4">
                  {options.map((option, index) => (
                    <div key={option.id} className="border rounded-md p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center font-medium bg-muted">
                          {String.fromCharCode(65 + index)}
                        </div>
                        
                        <div className="flex-grow space-y-3">
                          <div className="space-y-1">
                            <Label htmlFor={`option-text-${option.id}`}>Answer Text</Label>
                            <Input
                              id={`option-text-${option.id}`}
                              value={option.text}
                              onChange={(e) => updateOptionText(option.id, e.target.value)}
                              placeholder={`Option ${String.fromCharCode(65 + index)} text`}
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor={`option-explanation-${option.id}`}>Explanation</Label>
                            <Textarea
                              id={`option-explanation-${option.id}`}
                              value={option.explanation || ''}
                              onChange={(e) => updateOptionExplanation(option.id, e.target.value)}
                              placeholder="Why is this answer correct/incorrect?"
                              className="min-h-20"
                            />
                          </div>
                        </div>
                        
                        <Button
                          type="button"
                          variant={correctAnswers.includes(option.id) ? "default" : "outline"}
                          size="sm"
                          className="flex-shrink-0"
                          onClick={() => toggleCorrectAnswer(option.id)}
                        >
                          {correctAnswers.includes(option.id) ? "Correct" : "Mark as Correct"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}
            
            <div className="flex justify-end pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
