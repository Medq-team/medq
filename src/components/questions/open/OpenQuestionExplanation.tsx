
import { motion } from 'framer-motion';

interface OpenQuestionExplanationProps {
  explanation?: string;
  courseReminder?: string;
}

export function OpenQuestionExplanation({ explanation, courseReminder }: OpenQuestionExplanationProps) {
  if (!explanation && !courseReminder) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="space-y-4"
    >
      {explanation && (
        <div className="p-4 rounded-lg bg-purple-50 text-purple-800">
          <h4 className="font-medium mb-1">Reference Answer:</h4>
          <p>{explanation}</p>
        </div>
      )}
      
      {courseReminder && (
        <div className="p-4 rounded-lg bg-purple-50 text-purple-800">
          <h4 className="font-medium mb-1">Additional Information:</h4>
          <p>{courseReminder}</p>
        </div>
      )}
    </motion.div>
  );
}
