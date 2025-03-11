
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MCQOptionItemProps {
  option: {
    id: string;
    text: string;
    explanation?: string;
  };
  index: number;
  isSelected: boolean;
  isSubmitted: boolean;
  isCorrect: boolean;
  explanation?: string;
  onSelect: (id: string) => void;
  expandedExplanations: string[];
  toggleExplanation: (id: string) => void;
}

export function MCQOptionItem({
  option,
  index,
  isSelected,
  isSubmitted,
  isCorrect,
  explanation,
  onSelect,
  expandedExplanations,
  toggleExplanation
}: MCQOptionItemProps) {
  // Get expanded state from parent component
  const isExpanded = expandedExplanations.includes(option.id);
  
  // Determine option letter (A, B, C, D, etc.)
  const optionLetter = String.fromCharCode(65 + index);
  
  // Background color based on state
  let bgColorClass = 'bg-white';
  let borderColorClass = 'border-gray-200';
  let textColorClass = 'text-foreground';
  
  if (isSubmitted) {
    if (isSelected && isCorrect) {
      bgColorClass = 'bg-green-50';
      borderColorClass = 'border-green-300';
    } else if (isSelected && !isCorrect) {
      bgColorClass = 'bg-red-50';
      borderColorClass = 'border-red-300';
    } else if (!isSelected && isCorrect) {
      bgColorClass = 'bg-amber-50';
      borderColorClass = 'border-amber-300';
      textColorClass = 'text-amber-700';
    }
  } else if (isSelected) {
    bgColorClass = 'bg-primary-50';
    borderColorClass = 'border-primary-200';
  }
  
  return (
    <div 
      className={`rounded-lg border ${borderColorClass} p-4 ${bgColorClass} transition-colors duration-200`}
      onClick={() => !isSubmitted && onSelect(option.id)}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center 
          ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
        >
          {optionLetter}
        </div>
        
        <div className="flex-grow">
          <p className={`${textColorClass}`}>{option.text}</p>
          
          {isSubmitted && option.explanation && (
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExplanation(option.id);
                  }}
                  className="text-sm text-muted-foreground flex items-center hover:text-primary transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Hide explanation
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Show explanation
                    </>
                  )}
                </button>
              </div>
              
              {isExpanded && (
                <div className="mt-2 text-sm pl-2 border-l-2 border-muted py-2">
                  {option.explanation}
                </div>
              )}
            </div>
          )}
        </div>
        
        {!isSubmitted && (
          <div className={`flex-shrink-0 h-5 w-5 rounded border ${isSelected ? 'border-primary bg-primary' : 'border-muted bg-background'} flex items-center justify-center`}>
            {isSelected && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-white">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
