
import { useLectureCore } from './use-lecture-core';
import { LectureHookResult } from './types';

export function useLecture(lectureId: string | undefined): LectureHookResult {
  return useLectureCore(lectureId);
}

// Re-export types
export * from './types';
