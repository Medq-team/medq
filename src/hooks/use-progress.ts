import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useProgress() {
  const { user } = useAuth();

  const trackQuestionProgress = useCallback(async (
    lectureId: string, 
    questionId: string, 
    isCorrect: boolean,
    score?: number
  ) => {
    if (!user) return;

    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lectureId,
          questionId,
          completed: true,
          score: isCorrect ? (score || 1) : 0
        }),
      });
    } catch (error) {
      console.error('Error tracking progress:', error);
    }
  }, [user]);

  const trackLectureProgress = useCallback(async (
    lectureId: string,
    completed: boolean = true
  ) => {
    if (!user) return;

    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lectureId,
          completed
        }),
      });
    } catch (error) {
      console.error('Error tracking lecture progress:', error);
    }
  }, [user]);

  const getProgress = useCallback(async (lectureId?: string, specialtyId?: string) => {
    if (!user) return null;

    try {
      const params = new URLSearchParams();
      if (lectureId) params.append('lectureId', lectureId);
      if (specialtyId) params.append('specialtyId', specialtyId);

      const response = await fetch(`/api/progress?${params.toString()}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
    return null;
  }, [user]);

  return {
    trackQuestionProgress,
    trackLectureProgress,
    getProgress
  };
} 