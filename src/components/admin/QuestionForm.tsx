
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Plus, X, HelpCircle, PenLine, Trash } from 'lucide-react';
import { QuestionType } from '@/types';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface QuestionFormProps {
  lectureId: string;
  editQuestionId?: string;
}

export function QuestionForm({ lectureId, editQuestionId }: QuestionFormProps) {
  const navigate = useNavigate();
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

  const addOption = () => {
    if (options.length >= 5) return;
    const newId = String(options.length + 1);
    setOptions([...options, { id: newId, text: '' }]);
  };

  const removeOption = (idToRemove: string) => {
    if (options.length <= 2) return;
    setOptions(options.filter(option => option.id !== idToRemove));
    setCorrectAnswers(correctAnswers.filter(id => id !== idToRemove));
  };

  const updateOptionText = (id: string, text: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, text } : option
    ));
  };

  const toggleCorrectAnswer = (id: string) => {
    if (correctAnswers.includes(id)) {
      setCorrectAnswers(correctAnswers.filter(answerId => answerId !== id));
    } else {
      setCorrectAnswers([...correctAnswers, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        throw result.error;
      }
      
      toast({
        title: `Question ${editQuestionId ? 'updated' : 'created'} successfully`,
        description: "The question has been saved to the database",
      });
      
      navigate(`/admin/lecture/${lectureId}`);
    } catch (error) {
      console.error('Error saving question:', error);
      toast({
        title: "Error saving question",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{editQuestionId ? 'Edit Question' : 'Create New Question'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question-type">Question Type</Label>
            <Select 
              value={questionType} 
              onValueChange={(value: QuestionType) => setQuestionType(value)}
            >
              <SelectTrigger id="question-type" className="w-full">
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mcq">
                  <div className="flex items-center">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Multiple Choice</span>
                  </div>
                </SelectItem>
                <SelectItem value="open">
                  <div className="flex items-center">
                    <PenLine className="mr-2 h-4 w-4" />
                    <span>Open Question</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="question-text">Question Text</Label>
            <Textarea
              id="question-text"
              placeholder="Enter the question text..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
              className="min-h-24"
            />
          </div>
          
          {questionType === 'mcq' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Answer Options (select correct answers)</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addOption}
                  disabled={options.length >= 5}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Option
                </Button>
              </div>
              
              <AnimatePresence>
                {options.map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start space-x-2"
                  >
                    <Button
                      type="button"
                      variant={correctAnswers.includes(option.id) ? "default" : "outline"}
                      size="icon"
                      className="h-10 w-10 shrink-0"
                      onClick={() => toggleCorrectAnswer(option.id)}
                    >
                      {correctAnswers.includes(option.id) ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-medium">{String.fromCharCode(65 + index)}</span>
                      )}
                    </Button>
                    
                    <Input
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      value={option.text}
                      onChange={(e) => updateOptionText(option.id, e.target.value)}
                      required
                      className="flex-grow"
                    />
                    
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(option.id)}
                        className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="explanation">
              {questionType === 'mcq' ? 'Explanation (shown after answering)' : 'Reference Answer'}
            </Label>
            <Textarea
              id="explanation"
              placeholder={questionType === 'mcq' 
                ? "Enter explanation for the correct answer..." 
                : "Enter reference answer for evaluation..."}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="min-h-32"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/admin/lecture/${lectureId}`)}
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
