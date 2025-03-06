
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lecture } from '@/types';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface LectureCardProps {
  lecture: Lecture;
}

export function LectureCard({ lecture }: LectureCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/lecture/${lecture.id}`);
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
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">{lecture.title}</h3>
              <p className="text-muted-foreground text-sm">
                {lecture.description || 'No description available'}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button onClick={handleClick} className="w-full">
            Start Lecture
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
