
import { Label } from '@/components/ui/label';
import { HelpCircle, PenLine } from 'lucide-react';
import { QuestionType } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface QuestionTypeSelectProps {
  questionType: QuestionType;
  setQuestionType: (type: QuestionType) => void;
}

export function QuestionTypeSelect({ questionType, setQuestionType }: QuestionTypeSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="question-type">Question Type</Label>
      <Select 
        value={questionType} 
        onValueChange={(value: QuestionType) => setQuestionType(value)}
      >
        <SelectTrigger id="question-type" className="w-full">
          <SelectValue placeholder="Select question type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mcq">
            <div className="flex items-center">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Multiple Choice</span>
            </div>
          </SelectItem>
          <SelectItem value="open">
            <div className="flex items-center">
              <PenLine className="mr-2 h-4 w-4" />
              <span>Open Question</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
