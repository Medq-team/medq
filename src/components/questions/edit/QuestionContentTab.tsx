
import { QuestionType } from '@/types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface QuestionContentTabProps {
  questionText: string;
  setQuestionText: (text: string) => void;
  courseReminder: string;
  setCourseReminder: (text: string) => void;
  questionType: QuestionType;
  questionNumber: number | undefined;
  setQuestionNumber: (number: number | undefined) => void;
  session: string;
  setSession: (session: string) => void;
}

export function QuestionContentTab({
  questionText,
  setQuestionText,
  courseReminder,
  setCourseReminder,
  questionType,
  questionNumber,
  setQuestionNumber,
  session,
  setSession
}: QuestionContentTabProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="question-number">Question Number</Label>
          <Input 
            id="question-number"
            type="number"
            placeholder="Enter question number"
            value={questionNumber === undefined ? '' : questionNumber}
            onChange={(e) => {
              const value = e.target.value;
              setQuestionNumber(value === '' ? undefined : parseInt(value, 10));
            }}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="session">Session</Label>
          <Input 
            id="session"
            placeholder="e.g., Session 2022"
            value={session}
            onChange={(e) => setSession(e.target.value)}
          />
        </div>
      </div>
      
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
