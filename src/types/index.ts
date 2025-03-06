
export type User = {
  id: string;
  email: string;
  role: 'student' | 'admin';
};

export type Specialty = {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
};

export type Lecture = {
  id: string;
  specialtyId: string;
  title: string;
  description?: string;
};

export type QuestionType = 'mcq' | 'open';

export type Option = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  lectureId: string;
  type: QuestionType;
  text: string;
  options?: Option[];
  correctAnswers?: string[]; // Array of option IDs for MCQ
  explanation?: string;
};

export type Answer = {
  id: string;
  userId: string;
  questionId: string;
  selectedOptions?: string[]; // For MCQ
  textAnswer?: string; // For open questions
  isCorrect?: boolean;
};

export type Progress = {
  userId: string;
  lectureId: string;
  completed: boolean;
  score?: number;
  lastAccessed: Date;
};
