
// Re-export all the lecture hooks from their respective modules
import { useLectureCore } from './use-lecture-core';

// Export the main hook as useLecture
export function useLecture(lectureId: string | undefined) {
  return useLectureCore(lectureId);
}

// Re-export types
export * from './types';
