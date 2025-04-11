
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lecture } from '@/types';
import { BookOpen, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Progress } from '@/components/ui/progress';
import { useLectureProgress } from '@/hooks/use-lecture-progress';
import { Badge } from '@/components/ui/badge';

interface LectureCardProps {
  lecture: Lecture;
}

export function LectureCard({ lecture }: LectureCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { progress, isComplete } = useLectureProgress(lecture.id);

  const handleClick = () => {
    navigate(`/lecture/${lecture.id}`);
  };

  // Determine progress bar color based on completion percentage
  const getProgressColor = (percentage: number) => {
    if (percentage === 0) return "bg-red-500";
    if (percentage < 25) return "bg-red-400";
    if (percentage < 50) return "bg-orange-400";
    if (percentage < 75) return "bg-yellow-400";
    if (percentage < 100) return "bg-lime-400";
    return "bg-green-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col">
        <CardContent className="flex-grow pt-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              {isComplete ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <BookOpen className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-lg">{lecture.title}</h3>
                {isComplete && (
                  <Badge variant="default" className="bg-green-500 text-xs">
                    {t('lectures.completed')}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                {lecture.description || t('lectures.noDescription')}
              </p>
              
              {/* Progress bar */}
              {progress > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{Math.round(progress)}% {t('common.complete')}</span>
                  </div>
                  <Progress 
                    value={progress} 
                    colorClass={getProgressColor(progress)} 
                    className="h-1.5 transition-all duration-500" 
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button onClick={handleClick} className="w-full">
            {isComplete ? t('lectures.review') : t('lectures.startLecture')}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
