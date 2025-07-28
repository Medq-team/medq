import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OpenQuestionSelfAssessmentProps {
  onAssessment: (rating: 'correct' | 'wrong' | 'partial') => void;
}

export function OpenQuestionSelfAssessment({ onAssessment }: OpenQuestionSelfAssessmentProps) {
  const { t } = useTranslation();
  const [selectedRating, setSelectedRating] = useState<'correct' | 'wrong' | 'partial' | null>(null);

  const handleRatingSelect = (rating: 'correct' | 'wrong' | 'partial') => {
    setSelectedRating(rating);
  };

  const handleConfirm = () => {
    if (selectedRating) {
      onAssessment(selectedRating);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 w-full max-w-full"
    >
      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium mb-3 text-blue-800 dark:text-blue-300">
          {t('questions.rateYourAnswer')}
        </h4>
        
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant={selectedRating === 'correct' ? 'default' : 'outline'}
              className={`flex items-center gap-2 ${
                selectedRating === 'correct' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'hover:bg-green-50 dark:hover:bg-green-950/30'
              }`}
              onClick={() => handleRatingSelect('correct')}
            >
              <CheckCircle className="h-4 w-4" />
              {t('questions.correct')}
            </Button>
            
            <Button
              variant={selectedRating === 'partial' ? 'default' : 'outline'}
              className={`flex items-center gap-2 ${
                selectedRating === 'partial' 
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                  : 'hover:bg-yellow-50 dark:hover:bg-yellow-950/30'
              }`}
              onClick={() => handleRatingSelect('partial')}
            >
              <MinusCircle className="h-4 w-4" />
              {t('questions.partiallyCorrect')}
            </Button>
            
            <Button
              variant={selectedRating === 'wrong' ? 'default' : 'outline'}
              className={`flex items-center gap-2 ${
                selectedRating === 'wrong' 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'hover:bg-red-50 dark:hover:bg-red-950/30'
              }`}
              onClick={() => handleRatingSelect('wrong')}
            >
              <XCircle className="h-4 w-4" />
              {t('questions.incorrect')}
            </Button>
          </div>
          
          {selectedRating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-2"
            >
              <Button 
                onClick={handleConfirm}
                className="w-full sm:w-auto"
              >
                {t('questions.confirmRating')}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 