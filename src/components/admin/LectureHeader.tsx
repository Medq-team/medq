
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { Lecture } from '@/types';
import { useTranslation } from 'react-i18next';

interface LectureHeaderProps {
  lecture: Lecture | null;
  onBack: () => void;
  onAddQuestion: () => void;
}

export function LectureHeader({ lecture, onBack, onAddQuestion }: LectureHeaderProps) {
  const { t } = useTranslation();
  
  return (
    <>
      <Button 
        variant="ghost" 
        className="group flex items-center" 
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        {t('admin.backToAdmin')}
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {lecture ? `${t('admin.manage')}: ${lecture.title}` : t('admin.createNewQuestion')}
          </h2>
          <p className="text-muted-foreground mt-1">
            {lecture ? t('admin.addOrEditQuestions') : t('admin.createNewQuestion')}
          </p>
        </div>
        
        <Button onClick={onAddQuestion}>
          <PlusCircle className="h-4 w-4 mr-2" />
          {t('questions.addQuestion')}
        </Button>
      </div>
    </>
  );
}
