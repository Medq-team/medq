
import { useState, useMemo } from 'react';
import { Lecture } from '@/types';
import { LecturesListView } from '@/components/specialties/LecturesListView';
import { LectureSearch } from '@/components/specialties/LectureSearch';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

interface LecturesListProps {
  lectures: Lecture[];
  isLoading: boolean;
}

export function LecturesList({ lectures, isLoading }: LecturesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();
  
  // Filter lectures based on search term
  const filteredLectures = useMemo(() => {
    if (!searchTerm.trim()) return lectures;
    
    const term = searchTerm.toLowerCase();
    return lectures.filter(
      lecture => 
        lecture.title.toLowerCase().includes(term) || 
        (lecture.description && lecture.description.toLowerCase().includes(term))
    );
  }, [lectures, searchTerm]);
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
    }
    
    if (filteredLectures.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-fade-in">
          <h3 className="text-lg font-semibold">
            {searchTerm 
              ? t('lectures.noSearchResults') 
              : t('lectures.noLecturesAvailable')}
          </h3>
          <p className="text-muted-foreground mt-2">
            {searchTerm 
              ? t('lectures.tryDifferentSearch')
              : t('lectures.noLecturesDescription')}
          </p>
        </div>
      );
    }
    
    return <LecturesListView lectures={filteredLectures} isLoading={false} />;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <LectureSearch onSearch={setSearchTerm} />
      </div>
      
      {renderContent()}
    </div>
  );
}
