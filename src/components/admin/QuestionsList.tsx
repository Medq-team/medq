
import { Question } from '@/types';
import { QuestionItem } from './QuestionItem';
import { EmptyQuestionsState } from './EmptyQuestionsState';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

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
  // Show loading state if data is being fetched
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded-md w-3/4 mx-auto"></div>
          <div className="h-24 bg-muted rounded-md"></div>
          <div className="h-24 bg-muted rounded-md"></div>
        </div>
      </div>
    );
  }

  // Show empty state if no questions available
  if (questions.length === 0) {
    return <EmptyQuestionsState onAddQuestion={onAddQuestion} />;
  }

  // Render questions list
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-end mb-4">
        <Button onClick={onAddQuestion} className="btn-hover">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>
      
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
    </div>
  );
}
