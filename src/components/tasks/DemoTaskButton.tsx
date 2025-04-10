
import React from 'react';
import { Button } from '@/components/ui/button';
import { useBackgroundTasksContext } from '@/contexts/BackgroundTasksContext';
import { PlayCircle } from 'lucide-react';

export function DemoTaskButton() {
  const { createTask, isReady } = useBackgroundTasksContext();

  const handleStartTask = () => {
    if (!isReady) {
      console.error('Background task system is not ready');
      return;
    }

    // Create a sample background task
    createTask('Demo Task', {
      description: 'This is a demo background task',
      timestamp: Date.now()
    });
  };

  return (
    <Button onClick={handleStartTask} variant="outline" disabled={!isReady}>
      <PlayCircle className="h-4 w-4 mr-2" />
      Start Demo Background Task
    </Button>
  );
}
