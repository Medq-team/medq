
import { useState } from 'react';
import { Question } from '@/types';
import { motion } from 'framer-motion';
import { OpenQuestionHeader } from './open/OpenQuestionHeader';
import { OpenQuestionInput } from './open/OpenQuestionInput';
import { OpenQuestionExplanation } from './open/OpenQuestionExplanation';
import { OpenQuestionActions } from './open/OpenQuestionActions';
import { QuestionEditDialog } from './QuestionEditDialog';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface OpenQuestionProps {
  question: Question;
  onSubmit: (answer: string) => void;
  onNext: () => void;
}

export function OpenQuestion({ question, onSubmit, onNext }: OpenQuestionProps) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleSubmit = () => {
    if (!answer.trim() || submitted) return;
    
    setSubmitted(true);
    onSubmit(answer);
  };

  const handleQuestionUpdated = () => {
    // Reload the page to refresh the question data
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-start">
        <OpenQuestionHeader questionText={question.text} />
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsEditDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
      </div>

      <OpenQuestionInput 
        answer={answer}
        setAnswer={setAnswer}
        isSubmitted={submitted}
      />

      {submitted && (
        <OpenQuestionExplanation
          explanation={question.explanation}
          courseReminder={question.course_reminder}
        />
      )}

      <OpenQuestionActions 
        isSubmitted={submitted}
        canSubmit={!!answer.trim()}
        onSubmit={handleSubmit}
        onNext={onNext}
      />
      
      <QuestionEditDialog
        question={question}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onQuestionUpdated={handleQuestionUpdated}
      />
    </motion.div>
  );
}
