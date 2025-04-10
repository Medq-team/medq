
// This worker handles background tasks even when the tab is inactive
// It communicates with the main thread through messages

// Store active tasks
interface Task {
  id: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  data: any;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
}

let tasks: Record<string, Task> = {};

// Process tasks in the background
function processTask(taskId: string) {
  const task = tasks[taskId];
  if (!task || task.status === 'completed' || task.status === 'failed') return;

  // Mark task as running
  task.status = 'running';
  task.updatedAt = Date.now();
  updateTaskInStorage(task);
  
  // Simulate task progress (replace with actual task logic)
  let progress = 0;
  const interval = setInterval(() => {
    progress += 5;
    task.progress = progress;
    task.updatedAt = Date.now();
    
    // Send progress update to main thread
    self.postMessage({
      type: 'TASK_PROGRESS',
      payload: { taskId, progress, status: task.status }
    });
    
    updateTaskInStorage(task);
    
    if (progress >= 100) {
      clearInterval(interval);
      task.status = 'completed';
      task.progress = 100;
      task.completedAt = Date.now();
      task.updatedAt = Date.now();
      
      // Send completion update
      self.postMessage({
        type: 'TASK_COMPLETED',
        payload: { taskId, status: task.status }
      });
      
      updateTaskInStorage(task);
    }
  }, 1000); // Update every second
}

// Save task to localStorage (via main thread)
function updateTaskInStorage(task: Task) {
  self.postMessage({
    type: 'UPDATE_STORAGE',
    payload: { task }
  });
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'CREATE_TASK':
      const newTask: Task = {
        id: payload.id,
        type: payload.type,
        status: 'pending',
        progress: 0,
        data: payload.data,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      tasks[newTask.id] = newTask;
      updateTaskInStorage(newTask);
      processTask(newTask.id);
      break;
      
    case 'CANCEL_TASK':
      if (tasks[payload.taskId]) {
        tasks[payload.taskId].status = 'failed';
        tasks[payload.taskId].updatedAt = Date.now();
        updateTaskInStorage(tasks[payload.taskId]);
      }
      break;
      
    case 'SYNC_TASKS':
      tasks = payload.tasks;
      // Resume any running tasks
      Object.keys(tasks).forEach(taskId => {
        if (tasks[taskId].status === 'running') {
          processTask(taskId);
        }
      });
      break;
      
    default:
      break;
  }
});

// Let the main thread know we're ready
self.postMessage({ type: 'WORKER_READY' });

