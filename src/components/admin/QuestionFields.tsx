
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { QuestionType } from '@/types';

interface QuestionFieldsProps {
  questionText: string;
  setQuestionText: (text: string) => void;
  explanation: string;
  setExplanation: (text: string) => void;
  questionType: QuestionType;
}

export function QuestionFields({ 
  questionText, 
  setQuestionText, 
  explanation, 
  setExplanation,
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
        <Label htmlFor="explanation">
          {questionType === 'mcq' ? 'Explanation (shown after answering)' : 'Reference Answer'}
        </Label>
        <Textarea
          id="explanation"
          placeholder={questionType === 'mcq' 
            ? "Enter explanation for the correct answer..." 
            : "Enter reference answer for evaluation..."}
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          className="min-h-32"
        />
      </div>
    </>
  );
}
