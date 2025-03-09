
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { QuestionType } from '@/types';

interface QuestionFieldsProps {
  questionText: string;
  setQuestionText: (text: string) => void;
  courseReminder: string;
  setCourseReminder: (text: string) => void;
  questionType: QuestionType;
}

export function QuestionFields({ 
  questionText, 
  setQuestionText, 
  courseReminder, 
  setCourseReminder,
  questionType
}: QuestionFieldsProps) {
  return (
    <>
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
      
      <div className="space-y-2">
        <Label htmlFor="course-reminder">
          {questionType === 'mcq' ? 'Rappel du cours' : 'Reference Answer'}
        </Label>
        <Textarea
          id="course-reminder"
          placeholder={questionType === 'mcq' 
            ? "Enter educational reminder or background information..." 
            : "Enter reference answer for evaluation..."}
          value={courseReminder}
          onChange={(e) => setCourseReminder(e.target.value)}
          className="min-h-32"
        />
      </div>
    </>
  );
}
