
import { useState, useEffect } from 'react';
import { Lecture } from '@/types';
import { LectureCard } from '@/components/lectures/LectureCard';
import { LecturesListView } from '@/components/specialties/LecturesListView';
import { LectureViewToggle } from '@/components/specialties/LectureViewToggle';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface LecturesListProps {
  lectures: Lecture[];
  isLoading: boolean;
}

export function LecturesList({ lectures, isLoading }: LecturesListProps) {
  const [view, setView] = useLocalStorage<'grid' | 'list'>('lecture-view', 'grid');
  
  if (view === 'list') {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <LectureViewToggle onViewChange={setView} />
        </div>
        <LecturesListView lectures={lectures} isLoading={isLoading} />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <LectureViewToggle onViewChange={setView} />
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : lectures.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-fade-in">
          <h3 className="text-lg font-semibold">No lectures available</h3>
          <p className="text-muted-foreground mt-2">
            There are no lectures available for this specialty yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {lectures.map((lecture) => (
            <LectureCard key={lecture.id} lecture={lecture} />
          ))}
        </div>
      )}
    </div>
  );
}
