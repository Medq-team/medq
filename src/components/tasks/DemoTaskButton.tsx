
import React from 'react';
import { Button } from '@/components/ui/button';
import { LightbulbIcon } from 'lucide-react';
import { useBackgroundTasksContext } from '@/contexts/BackgroundTasksContext';
import { toast } from '@/hooks/use-toast';

export function DemoTaskButton() {
  const { createTask, isReady } = useBackgroundTasksContext();

  const startDemoTask = () => {
    if (!isReady) {
      toast({
        title: "Task system not ready",
        description: "Please wait a moment and try again.",
        variant: "destructive",
      });
      return;
    }

    const taskId = createTask('demo-task', { message: 'This is a test task' });
    
    if (taskId) {
      toast({
        title: "Demo task started",
        description: "Check the task indicator to see progress.",
      });
    }
  };

  return (
    <Button 
      onClick={startDemoTask} 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-1"
    >
      <LightbulbIcon className="h-4 w-4" />
      Demo Task
    </Button>
  );
}
