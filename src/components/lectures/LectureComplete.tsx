
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ListOrdered } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LectureCompleteProps {
  onRestart: () => void;
  onBackToSpecialty: () => void;
}

export function LectureComplete({
  onRestart,
  onBackToSpecialty
}: LectureCompleteProps) {
  const { t } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border rounded-lg p-6 shadow-sm"
    >
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ListOrdered className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">{t('lectures.lectureComplete')}</h3>
        <p className="text-muted-foreground mb-6">
          {t('lectures.completionMessage')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button onClick={onRestart} variant="outline">
            {t('lectures.restartLecture')}
          </Button>
          <Button onClick={onBackToSpecialty}>
            {t('lectures.backToSpecialty')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
