import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, Minus } from 'lucide-react';

interface DetailedProgressData {
  totalQuestions: number;
  correct: number;
  incorrect: number;
  partial: number;
  incomplete: number;
}

interface DetailedProgressBarProps {
  data: DetailedProgressData;
  title?: string;
  showIcons?: boolean;
  compact?: boolean;
}

export function DetailedProgressBar({ 
  data, 
  title = "Progress", 
  showIcons = true, 
  compact = false 
}: DetailedProgressBarProps) {
  const { totalQuestions, correct, incorrect, partial, incomplete } = data;
  
  // Calculate percentages
  const correctPercent = totalQuestions > 0 ? (correct / totalQuestions) * 100 : 0;
  const incorrectPercent = totalQuestions > 0 ? (incorrect / totalQuestions) * 100 : 0;
  const partialPercent = totalQuestions > 0 ? (partial / totalQuestions) * 100 : 0;
  const incompletePercent = totalQuestions > 0 ? (incomplete / totalQuestions) * 100 : 0;

  // Calculate total completion percentage
  const totalCompleted = correct + incorrect + partial;
  const totalCompletedPercent = totalQuestions > 0 ? (totalCompleted / totalQuestions) * 100 : 0;

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{title}</span>
          <span className="text-sm text-muted-foreground">
            {totalCompleted}/{totalQuestions} completed
          </span>
        </div>
        
        {/* Compact Progress Bar */}
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          {/* Correct (Green) */}
          {correctPercent > 0 && (
            <div 
              className="absolute h-full bg-green-500 transition-all duration-300"
              style={{ 
                left: '0%', 
                width: `${correctPercent}%` 
              }}
            />
          )}
          {/* Partial (Yellow) */}
          {partialPercent > 0 && (
            <div 
              className="absolute h-full bg-yellow-500 transition-all duration-300"
              style={{ 
                left: `${correctPercent}%`, 
                width: `${partialPercent}%` 
              }}
            />
          )}
          {/* Incorrect (Red) */}
          {incorrectPercent > 0 && (
            <div 
              className="absolute h-full bg-red-500 transition-all duration-300"
              style={{ 
                left: `${correctPercent + partialPercent}%`, 
                width: `${incorrectPercent}%` 
              }}
            />
          )}
          {/* Incomplete (Gray) */}
          {incompletePercent > 0 && (
            <div 
              className="absolute h-full bg-gray-400 transition-all duration-300"
              style={{ 
                left: `${correctPercent + partialPercent + incorrectPercent}%`, 
                width: `${incompletePercent}%` 
              }}
            />
          )}
        </div>

        {/* Compact Legend */}
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded"></div>
            <span className="text-muted-foreground">Correct</span>
            <span className="font-medium">{correct}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded"></div>
            <span className="text-muted-foreground">Partial</span>
            <span className="font-medium">{partial}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded"></div>
            <span className="text-muted-foreground">Wrong</span>
            <span className="font-medium">{incorrect}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded"></div>
            <span className="text-muted-foreground">Left</span>
            <span className="font-medium">{incomplete}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {title}
          <span className="text-sm font-normal text-muted-foreground">
            ({totalCompleted}/{totalQuestions} completed)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{Math.round(totalCompletedPercent)}%</span>
          </div>
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            {/* Correct (Green) */}
            {correctPercent > 0 && (
              <div 
                className="absolute h-full bg-green-500 transition-all duration-300"
                style={{ 
                  left: '0%', 
                  width: `${correctPercent}%` 
                }}
              />
            )}
            {/* Partial (Yellow) */}
            {partialPercent > 0 && (
              <div 
                className="absolute h-full bg-yellow-500 transition-all duration-300"
                style={{ 
                  left: `${correctPercent}%`, 
                  width: `${partialPercent}%` 
                }}
              />
            )}
            {/* Incorrect (Red) */}
            {incorrectPercent > 0 && (
              <div 
                className="absolute h-full bg-red-500 transition-all duration-300"
                style={{ 
                  left: `${correctPercent + partialPercent}%`, 
                  width: `${incorrectPercent}%` 
                }}
              />
            )}
            {/* Incomplete (Gray) */}
            {incompletePercent > 0 && (
              <div 
                className="absolute h-full bg-gray-400 transition-all duration-300"
                style={{ 
                  left: `${correctPercent + partialPercent + incorrectPercent}%`, 
                  width: `${incompletePercent}%` 
                }}
              />
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Correct</span>
            {showIcons && <CheckCircle className="w-4 h-4 text-green-500" />}
            <span className="ml-auto font-medium">{correct}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Partial</span>
            {showIcons && <Clock className="w-4 h-4 text-yellow-500" />}
            <span className="ml-auto font-medium">{partial}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Incorrect</span>
            {showIcons && <XCircle className="w-4 h-4 text-red-500" />}
            <span className="ml-auto font-medium">{incorrect}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
            <span>Incomplete</span>
            {showIcons && <Minus className="w-4 h-4 text-gray-400" />}
            <span className="ml-auto font-medium">{incomplete}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 