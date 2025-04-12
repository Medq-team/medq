
import { Question } from '@/types';

/**
 * Sort questions by type and number
 */
export const sortQuestions = (questions: Question[]): Question[] => {
  return [...questions].sort((a, b) => {
    // First sort by type (MCQ first)
    if (a.type !== b.type) {
      return a.type === 'mcq' ? -1 : 1;
    }
    
    // If numbers are present, sort by number
    if (a.number !== undefined && b.number !== undefined) {
      return a.number - b.number;
    }
    
    // If one has a number and the other doesn't, prioritize the one with a number
    if (a.number !== undefined) return -1;
    if (b.number !== undefined) return 1;
    
    // Default sort by id
    return a.id.localeCompare(b.id);
  });
};
