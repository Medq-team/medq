
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Option } from '@/types';
import { cn } from '@/lib/utils';

interface MCQOptionItemProps {
  option: Option;
  index: number;
  isSelected: boolean;
  isSubmitted: boolean;
  isCorrect: boolean;
  explanation?: string;
  onSelect: (optionId: string) => void;
  expandedExplanations: string[];
  toggleExplanation: (optionId: string) => void;
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
  const getOptionColor = () => {
    if (!isSubmitted) return '';
    
    if (isSelected) {
      return isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
    }
    
    return isCorrect ? 'bg-amber-50 border-amber-200' : '';
  };
  
  const getOptionIcon = () => {
    if (!isSubmitted) return null;
    
    if (isSelected) {
      return isCorrect ? 
        <CheckCircle className="h-5 w-5 text-green-500" /> : 
        <XCircle className="h-5 w-5 text-red-500" />;
    }
    
    return isCorrect ? <CheckCircle className="h-5 w-5 text-amber-700" /> : null;
  };

  const isExplanationExpanded = expandedExplanations.includes(option.id);

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "flex items-center rounded-lg border p-4 transition-colors",
          getOptionColor(),
          !isSubmitted && "hover:bg-muted/50 cursor-pointer",
        )}
        onClick={() => onSelect(option.id)}
      >
        <div className="mr-3">
          <Checkbox
            id={option.id}
            checked={isSelected}
            onCheckedChange={() => onSelect(option.id)}
            disabled={isSubmitted}
            className="pointer-events-none"
          />
        </div>
        <Label 
          htmlFor={option.id} 
          className="flex-grow cursor-pointer font-normal"
        >
          <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
          {option.text}
        </Label>
        {getOptionIcon()}
        
        {isSubmitted && explanation && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleExplanation(option.id);
            }}
            className="ml-2 h-6 w-6 p-0 rounded-full"
          >
            {isExplanationExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      
      {isSubmitted && isExplanationExpanded && explanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="ml-8 p-3 rounded-md bg-slate-50 text-sm"
        >
          <strong>Explanation:</strong> {explanation}
        </motion.div>
      )}
    </div>
  );
}
