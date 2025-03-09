
import { useState } from 'react';
import { Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PenLine, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface OpenQuestionProps {
  question: Question;
  onSubmit: (answer: string) => void;
  onNext: () => void;
}

export function OpenQuestion({ question, onSubmit, onNext }: OpenQuestionProps) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!answer.trim() || submitted) return;
    
    setSubmitted(true);
    onSubmit(answer);
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
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm font-medium">
          <PenLine className="h-4 w-4 mr-1" />
          Open Question
        </div>
        <h3 className="text-xl font-semibold">{question.text}</h3>
      </div>

      <div className="space-y-2">
        <Textarea
          placeholder="Type your answer here..."
          className="min-h-32 transition-all"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={submitted}
        />
      </div>

      {submitted && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4"
        >
          {question.explanation && (
            <div className="p-4 rounded-lg bg-purple-50 text-purple-800">
              <h4 className="font-medium mb-1">Reference Answer:</h4>
              <p>{question.explanation}</p>
            </div>
          )}
          
          {question.course_reminder && (
            <div className="p-4 rounded-lg bg-purple-50 text-purple-800">
              <h4 className="font-medium mb-1">Additional Information:</h4>
              <p>{question.course_reminder}</p>
            </div>
          )}
        </motion.div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        {!submitted ? (
          <Button 
            onClick={handleSubmit} 
            disabled={!answer.trim()}
          >
            Submit Answer
          </Button>
        ) : (
          <Button onClick={onNext} className="group">
            Next Question
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
