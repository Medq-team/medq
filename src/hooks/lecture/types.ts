
import { Lecture, Question } from '@/types';

export interface LectureHookState {
  lecture: Lecture | null;
  questions: Question[];
  totalQuestions: number;
  currentQuestionIndex: number;
  answers: Record<string, any>;
  isLoading: boolean;
  isLoadingQuestions: boolean;
  isComplete: boolean;
  isAddQuestionOpen: boolean;
  questionCache: Record<number, Question>;
}

export interface LectureHookActions {
  setCurrentQuestionIndex: (index: number) => void;
  setIsAddQuestionOpen: (isOpen: boolean) => void;
  handleAnswerSubmit: (questionId: string, answer: any) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleRestart: () => void;
  handleBackToSpecialty: () => void;
  clearSessionData: () => void;
  fetchQuestionByIndex: (index: number) => Promise<Question | null>;
}

export interface LectureHookResult extends LectureHookState, LectureHookActions {
  currentQuestion: Question | null;
  progress: number;
  answeredCount: number;
}
