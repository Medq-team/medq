
import { useLectureState } from './state/use-lecture-state';
import { useLectureData } from './data/use-lecture-data';
import { useLectureActions } from './actions/use-lecture-actions';

export function useLectureCore(lectureId: string | undefined) {
  // Initialize with zero questions, will be updated after data is fetched
  const state = useLectureState(lectureId, 0);
  const { fetchQuestionByIndex } = useLectureData(lectureId, state);
  const actions = useLectureActions(lectureId, state);
  
  // Compute derived state
  const totalQuestions = state.questions.length;
  const currentQuestion = state.questions[state.currentQuestionIndex];
  
  return {
    // State
    lecture: state.lecture,
    questions: state.questions,
    totalQuestions,
    currentQuestionIndex: state.currentQuestionIndex,
    setCurrentQuestionIndex: state.setCurrentQuestionIndex,
    answers: state.answers,
    isLoading: state.isLoading,
    isLoadingQuestions: state.isLoadingQuestions,
    isComplete: state.isComplete,
    isAddQuestionOpen: state.isAddQuestionOpen,
    setIsAddQuestionOpen: state.setIsAddQuestionOpen,
    currentQuestion,
    progress: state.progress,
    answeredCount: state.answeredCount,
    questionCache: state.questionCache,
    
    // Actions
    ...actions,
    
    // Data fetching
    fetchQuestionByIndex
  };
}
