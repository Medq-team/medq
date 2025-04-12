
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Lecture } from '@/types';

export type ProgressStatus = 'not-started' | 'in-progress' | 'completed';

export interface LectureProgress {
  lectureId: string;
  answeredCount: number;
  totalQuestions: number;
  progress: number;
  status: ProgressStatus;
  lastUpdated: number; // timestamp
}

export function useLectureProgress() {
  const [progressData, setProgressData] = useLocalStorage<Record<string, LectureProgress>>('lecture-progress-data', {});
  
  // Update progress for a specific lecture
  const updateProgress = (
    lectureId: string, 
    answeredCount: number, 
    totalQuestions: number
  ) => {
    if (!lectureId) return;
    
    const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
    
    let status: ProgressStatus = 'not-started';
    if (progress >= 100) {
      status = 'completed';
    } else if (answeredCount > 0) {
      status = 'in-progress';
    }
    
    // Create a new progress object
    const newProgressItem: LectureProgress = {
      lectureId,
      answeredCount,
      totalQuestions,
      progress,
      status,
      lastUpdated: Date.now()
    };
    
    // Update the state with the new progress object
    setProgressData({
      ...progressData,
      [lectureId]: newProgressItem
    });
  };
  
  // Get progress for a specific lecture
  const getLectureProgress = (lectureId: string): LectureProgress | null => {
    if (!lectureId || !progressData[lectureId]) return null;
    return progressData[lectureId];
  };
  
  // Filter lectures based on progress status
  const filterLecturesByStatus = (lectures: Lecture[], status?: ProgressStatus): Lecture[] => {
    if (!status) return lectures;
    
    return lectures.filter(lecture => {
      const progress = progressData[lecture.id];
      if (!progress) return status === 'not-started';
      return progress.status === status;
    });
  };
  
  // Clear progress for a specific lecture
  const clearLectureProgress = (lectureId: string) => {
    const newData = { ...progressData };
    delete newData[lectureId];
    setProgressData(newData);
  };
  
  // Clear all progress data
  const clearAllProgress = () => {
    setProgressData({});
  };
  
  return {
    progressData,
    updateProgress,
    getLectureProgress,
    filterLecturesByStatus,
    clearLectureProgress,
    clearAllProgress
  };
}
