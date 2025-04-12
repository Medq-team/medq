
import { useNavigate } from 'react-router-dom';
import { useLectureState } from './use-lecture-state';
import { useLectureData } from './use-lecture-data';
import { useLectureActions } from './use-lecture-actions';
import { useLectureDialog } from './use-lecture-dialog';
import { useCallback, useEffect } from 'react';

export function useLecture(lectureId: string | undefined) {
  const navigate = useNavigate();
  
  // Get lecture state
  const state = useLectureState(lectureId);
  
  // Get lecture data and fetch functions
  const { fetchQuestionByIndex } = useLectureData(lectureId, state, navigate);
  
  // Get lecture actions
  const actions = useLectureActions(state);
  
  // Handle dialog interactions
  useLectureDialog(lectureId, state, fetchQuestionByIndex);
  
  // Prefetch adjacent questions for smoother navigation
  useEffect(() => {
    if (!state.isLoading && !state.isComplete && lectureId) {
      // Prefetch next question
      if (state.currentQuestionIndex < state.totalQuestions - 1) {
        fetchQuestionByIndex(state.currentQuestionIndex + 1);
      }
      
      // Prefetch previous question
      if (state.currentQuestionIndex > 0) {
        fetchQuestionByIndex(state.currentQuestionIndex - 1);
      }
    }
  }, [
    state.currentQuestionIndex, 
    fetchQuestionByIndex, 
    state.isComplete, 
    state.isLoading, 
    lectureId, 
    state.totalQuestions
  ]);

  // Computed properties
  const currentQuestion = state.questions[state.currentQuestionIndex];
  const answeredCount = Object.keys(state.answers).length;
  const progress = state.totalQuestions > 0 
    ? (answeredCount / state.totalQuestions) * 100
    : 0;

  return {
    // State
    lecture: state.lecture,
    questions: state.questions,
    totalQuestions: state.totalQuestions,
    currentQuestionIndex: state.currentQuestionIndex,
    setCurrentQuestionIndex: state.setCurrentQuestionIndex,
    answers: state.answers,
    isLoading: state.isLoading,
    isLoadingQuestions: state.isLoadingQuestions,
    isComplete: state.isComplete,
    isAddQuestionOpen: state.isAddQuestionOpen,
    setIsAddQuestionOpen: state.setIsAddQuestionOpen,
    
    // Computed values
    currentQuestion,
    progress,
    answeredCount,
    
    // Actions
    ...actions,
    
    // Data functions
    fetchQuestionByIndex
  };
}
