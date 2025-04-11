
import React from 'react';
import { Clock } from 'lucide-react';

interface QuizTimerProps {
  timeSpent: number;
  className?: string;
}

export function QuizTimer({ timeSpent, className = '' }: QuizTimerProps) {
  // Format time as mm:ss
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Clock className="w-4 h-4 mr-1.5" />
      <span className="font-mono">{formatTime(timeSpent)}</span>
    </div>
  );
}
