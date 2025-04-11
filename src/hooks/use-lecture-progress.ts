
import { useState, useEffect } from 'react';
import { useLocalStorage } from './use-local-storage';

export interface LectureProgressData {
  [lectureId: string]: {
    totalQuestions: number;
    answeredCount: number;
    progress: number;
    isComplete: boolean;
    answers: Record<string, any>;
    lastUpdated: number;
  };
}

export function useLectureProgress(lectureId: string | undefined) {
  const [progressData, setProgressData] = useLocalStorage<LectureProgressData>('lecture-progress-data', {});
  const [progress, setProgress] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  
  useEffect(() => {
    if (!lectureId) return;
    
    // Get lecture progress from storage
    const lectureProgress = progressData[lectureId];
    
    if (lectureProgress) {
      setProgress(lectureProgress.progress);
      setIsComplete(lectureProgress.isComplete);
    } else {
      setProgress(0);
      setIsComplete(false);
    }
  }, [lectureId, progressData]);
  
  // Function to update progress for a lecture
  const updateProgress = (
    totalQuestions: number, 
    answeredCount: number, 
    answers: Record<string, any> = {}
  ) => {
    if (!lectureId || totalQuestions === 0) return;
    
    const calculatedProgress = (answeredCount / totalQuestions) * 100;
    const newIsComplete = answeredCount === totalQuestions;
    
    setProgress(calculatedProgress);
    setIsComplete(newIsComplete);
    
    // Update storage - fixed by explicitly typing the function return type
    setProgressData((prev: LectureProgressData): LectureProgressData => ({
      ...prev,
      [lectureId]: {
        totalQuestions,
        answeredCount,
        progress: calculatedProgress,
        isComplete: newIsComplete,
        answers,
        lastUpdated: Date.now()
      }
    }));
  };
  
  // Function to clear progress for a lecture
  const clearProgress = () => {
    if (!lectureId) return;
    
    setProgress(0);
    setIsComplete(false);
    
    // Remove from storage - fixed by explicitly typing the function return type
    setProgressData((prev: LectureProgressData): LectureProgressData => {
      const newData = { ...prev };
      if (newData[lectureId]) {
        delete newData[lectureId];
      }
      return newData;
    });
  };
  
  return {
    progress,
    isComplete,
    updateProgress,
    clearProgress
  };
}
