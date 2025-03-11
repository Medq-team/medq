
import { QuestionType } from '@/types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface QuestionContentTabProps {
  questionText: string;
  setQuestionText: (text: string) => void;
  courseReminder: string;
  setCourseReminder: (text: string) => void;
  questionType: QuestionType;
}

export function QuestionContentTab({
  questionText,
  setQuestionText,
  courseReminder,
  setCourseReminder,
  questionType
}: QuestionContentTabProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="question-text">Question Text</Label>
        <Textarea
          id="question-text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter question text..."
          className="min-h-24"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="course-reminder">
          {questionType === 'mcq' ? 'Course Reminder' : 'Reference Answer'}
        </Label>
        <Textarea
          id="course-reminder"
          value={courseReminder}
          onChange={(e) => setCourseReminder(e.target.value)}
          placeholder={questionType === 'mcq' 
            ? "Enter educational reminder or background information..." 
            : "Enter reference answer..."}
          className="min-h-32"
        />
      </div>
    </>
  );
}
