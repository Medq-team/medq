
import { motion } from 'framer-motion';

interface MCQExplanationProps {
  courseReminder?: string;
  explanation?: string;
}

export function MCQExplanation({ courseReminder, explanation }: MCQExplanationProps) {
  if (!courseReminder && !explanation) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="space-y-4"
    >          
      {courseReminder && (
        <div className="p-4 rounded-lg bg-blue-50 text-blue-800">
          <h4 className="font-medium mb-1">Rappel du cours:</h4>
          <p>{courseReminder}</p>
        </div>
      )}
      
      {/* Fallback to explanation field for backward compatibility */}
      {!courseReminder && explanation && (
        <div className="p-4 rounded-lg bg-blue-50 text-blue-800">
          <h4 className="font-medium mb-1">Rappel du cours:</h4>
          <p>{explanation}</p>
        </div>
      )}
    </motion.div>
  );
}
