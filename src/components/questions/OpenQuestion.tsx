
import { useState } from 'react';
import { Question } from '@/types';
import { motion } from 'framer-motion';
import { OpenQuestionHeader } from './open/OpenQuestionHeader';
import { OpenQuestionInput } from './open/OpenQuestionInput';
import { OpenQuestionExplanation } from './open/OpenQuestionExplanation';
import { OpenQuestionActions } from './open/OpenQuestionActions';

interface OpenQuestionProps {
  question: Question;
  onSubmit: (answer: string) => void;
  onNext: () => void;
}

export function OpenQuestion({ question, onSubmit, onNext }: OpenQuestionProps) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!answer.trim() || submitted) return;
    
    setSubmitted(true);
    onSubmit(answer);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <OpenQuestionHeader questionText={question.text} />

      <OpenQuestionInput 
        answer={answer}
        setAnswer={setAnswer}
        isSubmitted={submitted}
      />

      {submitted && (
        <OpenQuestionExplanation
          explanation={question.explanation}
          courseReminder={question.course_reminder}
        />
      )}

      <OpenQuestionActions 
        isSubmitted={submitted}
        canSubmit={!!answer.trim()}
        onSubmit={handleSubmit}
        onNext={onNext}
      />
    </motion.div>
  );
}
