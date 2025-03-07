
import { Question } from '@/types';
import { QuestionItem } from './QuestionItem';
import { EmptyQuestionsState } from './EmptyQuestionsState';

interface QuestionsListProps {
  questions: Question[];
  isLoading: boolean;
  onEdit: (questionId: string) => void;
  onDelete: (questionId: string) => void;
  onAddQuestion: () => void;
}

export function QuestionsList({ 
  questions, 
  isLoading, 
  onEdit, 
  onDelete, 
  onAddQuestion 
}: QuestionsListProps) {
  if (!isLoading && questions.length === 0) {
    return <EmptyQuestionsState onAddQuestion={onAddQuestion} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {questions.map((question) => (
        <QuestionItem 
          key={question.id}
          question={question}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
