
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { Lecture } from '@/types';

interface LectureHeaderProps {
  lecture: Lecture | null;
  onBack: () => void;
  onAddQuestion: () => void;
}

export function LectureHeader({ lecture, onBack, onAddQuestion }: LectureHeaderProps) {
  return (
    <>
      <Button 
        variant="ghost" 
        className="group flex items-center" 
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Admin
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {lecture ? `Manage: ${lecture.title}` : 'Add New Question'}
          </h2>
          <p className="text-muted-foreground mt-1">
            {lecture ? 'Add or edit questions for this lecture' : 'Create a new question'}
          </p>
        </div>
        
        <Button onClick={onAddQuestion}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>
    </>
  );
}
