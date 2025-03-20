
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/contexts/TranslationContext';

interface QuestionContentTabProps {
  questionText: string;
  setQuestionText: (text: string) => void;
  courseReminder: string;
  setCourseReminder: (text: string) => void;
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
  questionNumber,
  setQuestionNumber,
  session,
  setSession
}: QuestionContentTabProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="question-text">{t('Question Text')}</Label>
        <Textarea
          id="question-text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder={t('Enter the question text...')}
          className="min-h-24"
          required
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="course-reminder">{t('Course Reminder/Explanation')}</Label>
        <Textarea
          id="course-reminder"
          value={courseReminder}
          onChange={(e) => setCourseReminder(e.target.value)}
          placeholder={t('Enter any course reminder or explanation...')}
          className="min-h-20"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="question-number">{t('Question Number')}</Label>
          <Input
            id="question-number"
            type="number"
            value={questionNumber || ''}
            onChange={(e) => {
              const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
              setQuestionNumber(value);
            }}
            placeholder={t('Question number...')}
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="session">{t('Session')}</Label>
          <Input
            id="session"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            placeholder={t('e.g., Session 2023')}
          />
        </div>
      </div>
    </div>
  );
}
