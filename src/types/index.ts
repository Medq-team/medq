
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
  explanation?: string;
};

export type Question = {
  id: string;
  lectureId: string;
  lecture_id: string;
  type: QuestionType;
  text: string;
  options?: Option[];
  correct_answers?: string[]; // Array of option IDs for MCQ
  correctAnswers?: string[]; // Keep for backward compatibility
  explanation?: string; // Keep for backward compatibility
  course_reminder?: string; // Field for "Rappel du cours"
  number?: number; // Question number
  session?: string; // Exam session (e.g., "Session 2022")
  media_url?: string; // URL to the media file
  media_type?: 'image' | 'video'; // Type of media
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
