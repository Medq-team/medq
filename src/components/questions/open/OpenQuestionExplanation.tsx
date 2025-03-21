
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface OpenQuestionExplanationProps {
  explanation?: string;
  courseReminder?: string;
}

export function OpenQuestionExplanation({ explanation, courseReminder }: OpenQuestionExplanationProps) {
  const { t } = useTranslation();
  
  if (!explanation && !courseReminder) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="space-y-4"
    >
      {explanation && (
        <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300">
          <h4 className="font-medium mb-1">{t('questions.referenceAnswer')}</h4>
          <p className="text-purple-700 dark:text-purple-300">{explanation}</p>
        </div>
      )}
      
      {courseReminder && (
        <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300">
          <h4 className="font-medium mb-1">{t('questions.additionalInfo')}</h4>
          <p className="text-purple-700 dark:text-purple-300">{courseReminder}</p>
        </div>
      )}
    </motion.div>
  );
}
