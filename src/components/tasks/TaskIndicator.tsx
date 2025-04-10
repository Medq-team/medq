
import React, { useEffect, useState } from 'react';
import { useBackgroundTasks, Task } from '@/hooks/use-background-tasks';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { X, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function TaskIndicator() {
  const { tasks, cancelTask, clearCompletedTasks, isVisible } = useBackgroundTasks();
  const [showTasks, setShowTasks] = useState(false);
  const [hasNewUpdates, setHasNewUpdates] = useState(false);
  const [lastTaskCount, setLastTaskCount] = useState(0);

  // Check for updates when visibility changes
  useEffect(() => {
    if (isVisible && Object.keys(tasks).length !== lastTaskCount) {
      setHasNewUpdates(true);
    }
    setLastTaskCount(Object.keys(tasks).length);
  }, [tasks, isVisible, lastTaskCount]);

  // Reset updates flag when showing tasks
  useEffect(() => {
    if (showTasks) {
      setHasNewUpdates(false);
    }
  }, [showTasks]);

  // Sort tasks with running first, then pending, then completed/failed
  const sortedTasks = Object.values(tasks).sort((a, b) => {
    // First by status
    const statusOrder = { running: 0, pending: 1, completed: 2, failed: 3 };
    const statusDiff = statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
    if (statusDiff !== 0) return statusDiff;
    
    // Then by creation date (newest first)
    return b.createdAt - a.createdAt;
  });

  // If no tasks, don't show anything
  if (Object.keys(tasks).length === 0) {
    return null;
  }

  const runningTasks = Object.values(tasks).filter(task => task.status === 'running').length;
  const completedTasks = Object.values(tasks).filter(task => task.status === 'completed').length;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Task indicator button */}
      <Button
        onClick={() => setShowTasks(!showTasks)}
        variant="outline"
        size="sm"
        className={`rounded-full ${hasNewUpdates ? 'animate-pulse bg-primary text-primary-foreground' : ''} ${showTasks ? 'bg-secondary' : ''}`}
      >
        <Clock className="h-4 w-4 mr-2" />
        Tasks
        {runningTasks > 0 && (
          <Badge variant="secondary" className="ml-2 bg-blue-500 text-white">
            {runningTasks}
          </Badge>
        )}
        {completedTasks > 0 && !showTasks && (
          <Badge variant="outline" className="ml-1">
            +{completedTasks}
          </Badge>
        )}
      </Button>

      {/* Task panel */}
      {showTasks && (
        <div className="absolute bottom-12 right-0 w-80 bg-background border rounded-md shadow-lg p-4 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Background Tasks</h3>
            <div className="space-x-2">
              {Object.values(tasks).some(task => task.status === 'completed' || task.status === 'failed') && (
                <Button variant="outline" size="sm" onClick={clearCompletedTasks}>
                  Clear finished
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setShowTasks(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {sortedTasks.map((task) => (
              <TaskItem key={task.id} task={task} onCancel={cancelTask} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface TaskItemProps {
  task: Task;
  onCancel: (id: string) => void;
}

function TaskItem({ task, onCancel }: TaskItemProps) {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="border rounded-md p-3 bg-background/60">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <div>
            <p className="text-sm font-medium">{task.type}</p>
            <p className="text-xs text-muted-foreground">
              {task.status === 'completed' 
                ? `Completed in ${Math.round((task.completedAt! - task.createdAt) / 1000)}s` 
                : `Started ${Math.round((Date.now() - task.createdAt) / 1000)}s ago`}
            </p>
          </div>
        </div>
        
        {task.status === 'running' && (
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onCancel(task.id)}>
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      {(task.status === 'running' || task.status === 'pending') && (
        <Progress value={task.progress} className="h-2 mt-2" />
      )}
    </div>
  );
}
