
import { useState, useEffect } from 'react';
import { Question, Option } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, HelpCircle, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MCQQuestionProps {
  question: Question;
  onSubmit: (selectedOptionIds: string[]) => void;
  onNext: () => void;
}

export function MCQQuestion({ question, onSubmit, onNext }: MCQQuestionProps) {
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [expandedExplanations, setExpandedExplanations] = useState<string[]>([]);

  // Get correct answers array from question
  const correctAnswers = question.correctAnswers || question.correct_answers || [];

  // Handle checkbox change
  const handleOptionSelect = (optionId: string) => {
    if (submitted) return;
    
    setSelectedOptionIds(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  // Toggle explanation visibility
  const toggleExplanation = (optionId: string) => {
    setExpandedExplanations(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleSubmit = () => {
    if (selectedOptionIds.length === 0 || submitted) return;
    
    setSubmitted(true);
    
    // Check if answer is completely correct (all correct options selected and no incorrect ones)
    const allCorrectSelected = correctAnswers.every(id => selectedOptionIds.includes(id));
    const noIncorrectSelected = selectedOptionIds.every(id => correctAnswers.includes(id));
    setIsCorrect(allCorrectSelected && noIncorrectSelected);
    
    // Auto-expand explanations for incorrect answers and correct answers that weren't selected
    const autoExpandIds: string[] = [];
    
    // Add incorrect selections to auto-expand
    selectedOptionIds.forEach(id => {
      if (!correctAnswers.includes(id)) {
        autoExpandIds.push(id);
      }
    });
    
    // Add correct answers that weren't selected to auto-expand
    correctAnswers.forEach(id => {
      if (!selectedOptionIds.includes(id)) {
        autoExpandIds.push(id);
      }
    });
    
    setExpandedExplanations(autoExpandIds);
    
    onSubmit(selectedOptionIds);
  };

  const getOptionColor = (optionId: string) => {
    if (!submitted) return '';
    
    const isOptionCorrect = correctAnswers.includes(optionId);
    const isSelected = selectedOptionIds.includes(optionId);
    
    if (isSelected) {
      return isOptionCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
    }
    
    return isOptionCorrect ? 'bg-green-50 border-green-200' : '';
  };
  
  const getOptionIcon = (optionId: string) => {
    if (!submitted) return null;
    
    const isOptionCorrect = correctAnswers.includes(optionId);
    const isSelected = selectedOptionIds.includes(optionId);
    
    if (isSelected) {
      return isOptionCorrect ? 
        <CheckCircle className="h-5 w-5 text-green-500" /> : 
        <XCircle className="h-5 w-5 text-red-500" />;
    }
    
    return isOptionCorrect ? <CheckCircle className="h-5 w-5 text-green-500" /> : null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
          <HelpCircle className="h-4 w-4 mr-1" />
          Multiple Choice
        </div>
        <h3 className="text-xl font-semibold">{question.text}</h3>
        <p className="text-sm text-muted-foreground">
          {submitted ? "Review your answers below:" : "Select all correct answers:"}
        </p>
      </div>

      <div className="space-y-3">
        {question.options?.map((option: Option, index) => (
          <div key={option.id} className="space-y-2">
            <div
              className={cn(
                "flex items-center rounded-lg border p-4 transition-colors",
                getOptionColor(option.id),
                !submitted && "hover:bg-muted/50 cursor-pointer",
              )}
              onClick={() => handleOptionSelect(option.id)}
            >
              <div className="mr-3">
                <Checkbox
                  id={option.id}
                  checked={selectedOptionIds.includes(option.id)}
                  onCheckedChange={() => handleOptionSelect(option.id)}
                  disabled={submitted}
                  className="pointer-events-none"
                />
              </div>
              <Label 
                htmlFor={option.id} 
                className="flex-grow cursor-pointer font-normal"
              >
                {option.text}
              </Label>
              {getOptionIcon(option.id)}
              
              {submitted && option.explanation && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExplanation(option.id);
                  }}
                  className="ml-2 h-6 w-6 p-0 rounded-full"
                >
                  {expandedExplanations.includes(option.id) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
            
            {submitted && expandedExplanations.includes(option.id) && option.explanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-8 p-3 rounded-md bg-slate-50 text-sm"
              >
                <strong>Explanation:</strong> {option.explanation}
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {submitted && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4"
        >          
          {question.course_reminder && (
            <div className="p-4 rounded-lg bg-blue-50 text-blue-800">
              <h4 className="font-medium mb-1">Rappel du cours:</h4>
              <p>{question.course_reminder}</p>
            </div>
          )}
          
          {/* Fallback to explanation field for backward compatibility */}
          {!question.course_reminder && question.explanation && (
            <div className="p-4 rounded-lg bg-blue-50 text-blue-800">
              <h4 className="font-medium mb-1">Rappel du cours:</h4>
              <p>{question.explanation}</p>
            </div>
          )}
        </motion.div>
      )}

      <div className="flex justify-between pt-4">
        {!submitted ? (
          <Button 
            onClick={handleSubmit} 
            disabled={selectedOptionIds.length === 0}
            className="ml-auto"
          >
            Submit Answer
          </Button>
        ) : (
          <div className="flex items-center ml-auto gap-2">
            <div className="flex items-center mr-4">
              {isCorrect ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Correct!</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <XCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Incorrect</span>
                </div>
              )}
            </div>
            <Button onClick={onNext} className="group">
              Next Question
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
