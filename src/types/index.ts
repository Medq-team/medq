
export type User = {
  id: string;
  email: string;
  role: 'student' | 'admin';
  name?: string;
  image?: string;
  password?: string;
  passwordUpdatedAt?: string;
};

export type Specialty = {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  progress?: SpecialtyProgress;
};

export type SpecialtyProgress = {
  totalLectures: number;
  completedLectures: number;
  totalQuestions: number;
  completedQuestions: number;
  lectureProgress: number;
  questionProgress: number;
  averageScore: number;
  // Additional fields for detailed progress
  correctQuestions: number;
  incorrectQuestions: number;
  partialQuestions: number;
  incompleteQuestions: number;
};

export type Lecture = {
  id: string;
  specialtyId: string;
  title: string;
  description?: string;
  progress?: LectureProgress;
};

export type LectureProgress = {
  totalQuestions: number;
  completedQuestions: number;
  percentage: number;
  lastAccessed?: Date;
};

export type QuestionType = 'mcq' | 'open' | 'qroc' | 'clinic_mcq' | 'clinic_croq';

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
  // Clinical case fields
  case_number?: number; // Case number for clinical cases
  case_text?: string; // Case description text
  case_question_number?: number; // Question number within the case
};

export type Answer = {
  id: string;
  userId: string;
  questionId: string;
  selectedOptions?: string[]; // For MCQ
  textAnswer?: string; // For open questions
  isCorrect?: boolean;
};

export type UserProgress = {
  id: string;
  userId: string;
  lectureId: string;
  questionId?: string;
  completed: boolean;
  score?: number;
  lastAccessed: Date;
  createdAt: Date;
  updatedAt: Date;
};
