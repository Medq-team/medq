
import { useState, useEffect, useMemo } from 'react';
import { Lecture } from '@/types';
import { LectureCard } from '@/components/lectures/LectureCard';
import { LecturesListView } from '@/components/specialties/LecturesListView';
import { LectureViewToggle } from '@/components/specialties/LectureViewToggle';
import { LectureSearch } from '@/components/specialties/LectureSearch';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useTranslation } from 'react-i18next';
import { useLectureProgress, ProgressStatus } from '@/hooks/use-lecture-progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LecturesListProps {
  lectures: Lecture[];
  isLoading: boolean;
}

export function LecturesList({ lectures, isLoading }: LecturesListProps) {
  const [view, setView] = useLocalStorage<'grid' | 'list'>('lecture-view', 'grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useLocalStorage<ProgressStatus | 'all'>('lecture-status-filter', 'all');
  const { t } = useTranslation();
  const { filterLecturesByStatus, progressData } = useLectureProgress();
  
  // Filter lectures based on search term and status
  const filteredLectures = useMemo(() => {
    // First filter by search term
    let filtered = lectures;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = lectures.filter(
        lecture => 
          lecture.title.toLowerCase().includes(term) || 
          (lecture.description && lecture.description.toLowerCase().includes(term))
      );
    }
    
    // Then filter by status if not 'all'
    if (statusFilter !== 'all') {
      filtered = filterLecturesByStatus(filtered, statusFilter);
    }
    
    return filtered;
  }, [lectures, searchTerm, statusFilter, filterLecturesByStatus]);

  // Count lectures by status
  const counts = useMemo(() => {
    const completed = filterLecturesByStatus(lectures, 'completed').length;
    const inProgress = filterLecturesByStatus(lectures, 'in-progress').length;
    const notStarted = filterLecturesByStatus(lectures, 'not-started').length;
    
    return {
      all: lectures.length,
      completed,
      inProgress,
      notStarted
    };
  }, [lectures, filterLecturesByStatus]);
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
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
    
    return view === 'list' ? (
      <LecturesListView lectures={filteredLectures} isLoading={false} />
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {filteredLectures.map((lecture) => (
          <LectureCard key={lecture.id} lecture={lecture} />
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <LectureSearch onSearch={setSearchTerm} />
        <LectureViewToggle onViewChange={setView} />
      </div>
      
      <Tabs defaultValue={statusFilter} onValueChange={(value) => setStatusFilter(value as ProgressStatus | 'all')}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            {t('common.all')} ({counts.all})
          </TabsTrigger>
          <TabsTrigger value="completed">
            {t('lectures.completed')} ({counts.completed})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            {t('lectures.inProgress')} ({counts.inProgress})
          </TabsTrigger>
          <TabsTrigger value="not-started">
            {t('lectures.notStarted')} ({counts.notStarted})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">{renderContent()}</TabsContent>
        <TabsContent value="completed">{renderContent()}</TabsContent>
        <TabsContent value="in-progress">{renderContent()}</TabsContent>
        <TabsContent value="not-started">{renderContent()}</TabsContent>
      </Tabs>
    </div>
  );
}
