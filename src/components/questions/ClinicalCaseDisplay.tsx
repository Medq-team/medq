import { Stethoscope } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface ClinicalCaseDisplayProps {
  caseNumber?: number;
  caseText?: string;
  caseQuestionNumber?: number;
}

export function ClinicalCaseDisplay({ caseNumber, caseText, caseQuestionNumber }: ClinicalCaseDisplayProps) {
  const { t } = useTranslation();
  
  if (!caseText) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800"
    >
      <div className="flex items-center gap-2 mb-3">
        <Stethoscope className="h-4 w-4 text-blue-600" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
            {t('questions.clinicalCase')}
          </span>
          {caseNumber && (
            <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
              #{caseNumber}
            </span>
          )}
          {caseQuestionNumber && (
            <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
              {t('questions.question')} #{caseQuestionNumber}
            </span>
          )}
        </div>
      </div>
      
      <div className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed break-words">
        {caseText}
      </div>
    </motion.div>
  );
} 