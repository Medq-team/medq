
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalStorage } from './use-local-storage';
import { v4 as uuidv4 } from 'uuid';

export interface Task {
  id: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  data: any;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
}

export function useBackgroundTasks() {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isWorkerReady, setIsWorkerReady] = useState(false);
  const [tasks, setTasks] = useLocalStorage<Record<string, Task>>('background-tasks', {});
  const [activeTasks, setActiveTasks] = useState<Record<string, Task>>({});
  const [visibilityState, setVisibilityState] = useState(document.visibilityState);
  const workerRef = useRef<Worker | null>(null);

  // Initialize the worker
  useEffect(() => {
    if (typeof Worker === 'undefined') {
      console.error('Web Workers are not supported in this browser');
      return;
    }
    
    const newWorker = new Worker(new URL('../workers/backgroundWorker.ts', import.meta.url), { type: 'module' });
    workerRef.current = newWorker;
    setWorker(newWorker);

    newWorker.addEventListener('message', handleWorkerMessage);
    
    // Track visibility changes
    const handleVisibilityChange = () => {
      setVisibilityState(document.visibilityState);
      
      // If becoming visible again, sync with worker
      if (document.visibilityState === 'visible') {
        syncTasksWithWorker();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      newWorker.terminate();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Sync tasks with worker when it's ready
  useEffect(() => {
    if (isWorkerReady && worker) {
      syncTasksWithWorker();
    }
  }, [isWorkerReady, worker]);

  // Update local active tasks when tasks change
  useEffect(() => {
    setActiveTasks(tasks);
  }, [tasks]);

  // Handle messages from the worker
  const handleWorkerMessage = useCallback((event: MessageEvent) => {
    const { type, payload } = event.data;
    
    switch (type) {
      case 'WORKER_READY':
        setIsWorkerReady(true);
        break;
        
      case 'TASK_PROGRESS':
        setTasks(prev => ({
          ...prev,
          [payload.taskId]: {
            ...prev[payload.taskId],
            status: payload.status,
            progress: payload.progress,
            updatedAt: Date.now()
          }
        }));
        break;
        
      case 'TASK_COMPLETED':
        setTasks(prev => ({
          ...prev,
          [payload.taskId]: {
            ...prev[payload.taskId],
            status: 'completed',
            progress: 100,
            completedAt: Date.now(),
            updatedAt: Date.now()
          }
        }));
        break;
        
      case 'UPDATE_STORAGE':
        setTasks(prev => ({
          ...prev,
          [payload.task.id]: payload.task
        }));
        break;
        
      default:
        break;
    }
  }, [setTasks]);

  // Sync tasks with the worker
  const syncTasksWithWorker = useCallback(() => {
    if (worker && tasks) {
      worker.postMessage({
        type: 'SYNC_TASKS',
        payload: { tasks }
      });
    }
  }, [worker, tasks]);

  // Create a new background task
  const createTask = useCallback((type: string, data: any) => {
    if (!worker || !isWorkerReady) {
      console.error('Worker is not ready');
      return null;
    }
    
    const taskId = uuidv4();
    
    worker.postMessage({
      type: 'CREATE_TASK',
      payload: { id: taskId, type, data }
    });
    
    return taskId;
  }, [worker, isWorkerReady]);

  // Cancel a task
  const cancelTask = useCallback((taskId: string) => {
    if (!worker || !isWorkerReady) {
      console.error('Worker is not ready');
      return;
    }
    
    worker.postMessage({
      type: 'CANCEL_TASK',
      payload: { taskId }
    });
  }, [worker, isWorkerReady]);

  // Clear completed tasks
  const clearCompletedTasks = useCallback(() => {
    setTasks(prev => {
      const newTasks = { ...prev };
      Object.keys(newTasks).forEach(taskId => {
        if (newTasks[taskId].status === 'completed' || newTasks[taskId].status === 'failed') {
          delete newTasks[taskId];
        }
      });
      return newTasks;
    });
  }, [setTasks]);

  return {
    tasks: activeTasks,
    createTask,
    cancelTask,
    clearCompletedTasks,
    isReady: isWorkerReady,
    isVisible: visibilityState === 'visible'
  };
}
