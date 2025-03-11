
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Question } from '@/types';
import { useQuestionEdit } from './edit/useQuestionEdit';
import { QuestionEditContent } from './edit/QuestionEditContent';

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
  const {
    isLoading,
    questionText,
    setQuestionText,
    courseReminder,
    setCourseReminder,
    options,
    correctAnswers,
    updateOptionText,
    updateOptionExplanation,
    toggleCorrectAnswer,
    handleSubmit
  } = useQuestionEdit({
    question,
    onOpenChange,
    onQuestionUpdated
  });

  if (!question) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
        </DialogHeader>
        
        <QuestionEditContent
          question={question}
          questionText={questionText}
          setQuestionText={setQuestionText}
          courseReminder={courseReminder}
          setCourseReminder={setCourseReminder}
          options={options}
          updateOptionText={updateOptionText}
          updateOptionExplanation={updateOptionExplanation}
          correctAnswers={correctAnswers}
          toggleCorrectAnswer={toggleCorrectAnswer}
          isLoading={isLoading}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
