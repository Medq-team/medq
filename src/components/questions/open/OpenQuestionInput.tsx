
import { Textarea } from '@/components/ui/textarea';

interface OpenQuestionInputProps {
  answer: string;
  setAnswer: (value: string) => void;
  isSubmitted: boolean;
}

export function OpenQuestionInput({ answer, setAnswer, isSubmitted }: OpenQuestionInputProps) {
  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Type your answer here..."
        className="min-h-32 transition-all"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={isSubmitted}
      />
    </div>
  );
}
