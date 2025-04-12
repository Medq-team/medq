
import { useState, useEffect } from 'react';
import { Question } from '@/types';
import { motion } from 'framer-motion';
import { OpenQuestionHeader } from './open/OpenQuestionHeader';
import { OpenQuestionInput } from './open/OpenQuestionInput';
import { OpenQuestionExplanation } from './open/OpenQuestionExplanation';
import { OpenQuestionActions } from './open/OpenQuestionActions';
import { QuestionEditDialog } from './QuestionEditDialog';
import { ReportQuestionDialog } from './ReportQuestionDialog';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface OpenQuestionProps {
  question: Question;
  onSubmit: (answer: string) => void;
  onNext: () => void;
  onPrevious?: () => void;
  showPrevious?: boolean;
}

export function OpenQuestion({ 
  question, 
  onSubmit, 
  onNext,
  onPrevious,
  showPrevious = false 
}: OpenQuestionProps) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { t } = useTranslation();
  const { lectureId } = useParams<{ lectureId: string }>();

  const handleSubmit = () => {
    if (!answer.trim() || submitted) return;
    
    setSubmitted(true);
    onSubmit(answer);
  };

  const handleQuestionUpdated = () => {
    // Reload the page to refresh the question data
    window.location.reload();
  };

  // Add keyboard shortcut for submitting answer
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '1') {
        // Only trigger if not already submitted and there's text in the answer
        if (!submitted && answer.trim()) {
          handleSubmit();
        } else if (submitted) {
          // If already submitted, move to next question
          onNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [submitted, answer, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-start">
        <OpenQuestionHeader 
          questionText={question.text} 
          questionNumber={question.number}
          session={question.session}
        />
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <Pencil className="h-3.5 w-3.5" />
            {t('common.edit')}
          </Button>
          
          {lectureId && <ReportQuestionDialog question={question} lectureId={lectureId} />}
        </div>
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
        onPrevious={onPrevious}
        showPrevious={showPrevious}
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
