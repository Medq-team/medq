
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Lecture } from '@/types';
import { LectureItem } from './LectureItem';
import { useTranslation } from 'react-i18next';

interface LecturesTabProps {
  lectures: Lecture[];
  isLoading: boolean;
  onDeleteLecture: (id: string) => void;
}

export function LecturesTab({ 
  lectures, 
  isLoading, 
  onDeleteLecture 
}: LecturesTabProps) {
  const router = useRouter();
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('admin.manageLectures')}</h3>
        <Button 
          onClick={() => router.push('/admin/lecture/new')}
          className="btn-hover"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          {t('admin.addLecture')}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse border rounded-lg p-4">
              <div className="h-5 w-3/4 bg-muted rounded mb-2"></div>
              <div className="h-3 w-full bg-muted rounded mb-4"></div>
              <div className="h-9 w-32 bg-muted rounded"></div>
            </div>
          ))
        ) : lectures.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="text-lg font-semibold">{t('admin.noLecturesAvailable')}</h3>
            <p className="text-muted-foreground mt-2">
              {t('admin.addLecture')}
            </p>
          </div>
        ) : lectures.map((lecture) => (
          <LectureItem
            key={lecture.id}
            lecture={lecture}
            onDelete={onDeleteLecture}
          />
        ))}
      </div>
    </div>
  );
}
