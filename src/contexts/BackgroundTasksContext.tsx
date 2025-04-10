
import React, { createContext, useContext, ReactNode } from 'react';
import { useBackgroundTasks } from '@/hooks/use-background-tasks';

interface BackgroundTasksContextType {
  createTask: (type: string, data: any) => string | null;
  cancelTask: (id: string) => void;
  clearCompletedTasks: () => void;
  tasks: Record<string, any>;
  isReady: boolean;
  isVisible: boolean;
}

const BackgroundTasksContext = createContext<BackgroundTasksContextType | undefined>(undefined);

export function BackgroundTasksProvider({ children }: { children: ReactNode }) {
  const taskManager = useBackgroundTasks();

  return (
    <BackgroundTasksContext.Provider value={taskManager}>
      {children}
      {/* Include the task indicator in the provider */}
    </BackgroundTasksContext.Provider>
  );
}

export function useBackgroundTasksContext() {
  const context = useContext(BackgroundTasksContext);
  if (context === undefined) {
    throw new Error('useBackgroundTasksContext must be used within a BackgroundTasksProvider');
  }
  return context;
}
