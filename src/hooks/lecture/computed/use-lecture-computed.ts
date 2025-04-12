
import { useMemo } from 'react';

/**
 * Hook for computing derived state from lecture state
 */
export function useLectureComputed(
  state: ReturnType<typeof import('../state/use-lecture-state').useLectureState>
) {
  // Compute total questions
  const totalQuestions = useMemo(() => state.questions.length, [state.questions]);
  
  // Compute current question
  const currentQuestion = useMemo(() => 
    state.questions[state.currentQuestionIndex] || null, 
    [state.questions, state.currentQuestionIndex]
  );
  
  // Compute progress percentage
  const progress = useMemo(() => 
    totalQuestions > 0 ? (state.answeredCount / totalQuestions) * 100 : 0,
    [totalQuestions, state.answeredCount]
  );
  
  // Compute answered count (this is now redundant but kept for API compatibility)
  const answeredCount = useMemo(() => 
    state.answeredCount,
    [state.answeredCount]
  );
  
  return {
    totalQuestions,
    currentQuestion,
    progress,
    answeredCount
  };
}
