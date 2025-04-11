
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Hook to handle dialog interactions in the lecture
 */
export function useLectureDialog(
  lectureId: string | undefined,
  state: any,
  fetchQuestionByIndex: any
) {
  const {
    isAddQuestionOpen,
    setTotalQuestions,
    totalQuestions,
    setQuestionCache,
    currentQuestionIndex
  } = state;

  // Reset data when a new question is added
  useEffect(() => {
    if (isAddQuestionOpen === false) {
      // Refresh question count and data when the add question dialog is closed
      async function refreshData() {
        if (!lectureId) return;
        
        try {
          // Get updated total question count
          const { count, error: countError } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true })
            .eq('lecture_id', lectureId);

          if (countError) {
            throw countError;
          }

          if (count !== totalQuestions) {
            setTotalQuestions(count || 0);
            // Clear cache to ensure we fetch fresh data
            setQuestionCache({});
            await fetchQuestionByIndex(currentQuestionIndex);
          }
        } catch (error) {
          console.error('Error refreshing question data:', error);
        }
      }
      
      refreshData();
    }
  }, [isAddQuestionOpen, lectureId, currentQuestionIndex, totalQuestions, fetchQuestionByIndex, setQuestionCache, setTotalQuestions]);
}
