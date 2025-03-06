
import { useState } from 'react';
import { Question, Option } from '@/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MCQQuestionProps {
  question: Question;
  onSubmit: (selectedOptionId: string) => void;
  onNext: () => void;
}

export function MCQQuestion({ question, onSubmit, onNext }: MCQQuestionProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (!selectedOptionId || submitted) return;
    
    setSubmitted(true);
    
    // Check if answer is correct
    const correct = question.correctAnswers?.includes(selectedOptionId) || false;
    setIsCorrect(correct);
    
    onSubmit(selectedOptionId);
  };

  const getOptionColor = (optionId: string) => {
    if (!submitted) return '';
    
    const isOptionCorrect = question.correctAnswers?.includes(optionId) || false;
    
    if (selectedOptionId === optionId) {
      return isOptionCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
    }
    
    return isOptionCorrect ? 'bg-green-50 border-green-200' : '';
  };
  
  const getOptionIcon = (optionId: string) => {
    if (!submitted) return null;
    
    const isOptionCorrect = question.correctAnswers?.includes(optionId) || false;
    
    if (selectedOptionId === optionId) {
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
      </div>

      <RadioGroup 
        value={selectedOptionId} 
        onValueChange={setSelectedOptionId}
        className="space-y-3"
        disabled={submitted}
      >
        {question.options?.map((option: Option) => (
          <div
            key={option.id}
            className={cn(
              "flex items-center space-x-3 rounded-lg border p-4 transition-colors",
              getOptionColor(option.id),
              submitted ? "" : "hover:bg-muted/50 cursor-pointer"
            )}
          >
            <RadioGroupItem value={option.id} id={option.id} disabled={submitted} />
            <Label 
              htmlFor={option.id} 
              className="flex-grow cursor-pointer font-normal"
            >
              {option.text}
            </Label>
            {getOptionIcon(option.id)}
          </div>
        ))}
      </RadioGroup>

      {submitted && question.explanation && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 rounded-lg bg-blue-50 text-blue-800"
        >
          <h4 className="font-medium mb-1">Explanation:</h4>
          <p>{question.explanation}</p>
        </motion.div>
      )}

      <div className="flex justify-between pt-4">
        {!submitted ? (
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedOptionId}
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
            <Button onClick={onNext}>Next Question</Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
