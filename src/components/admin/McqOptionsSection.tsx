
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Plus, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface McqOptionsSectionProps {
  options: { id: string; text: string }[];
  setOptions: (options: { id: string; text: string }[]) => void;
  correctAnswers: string[];
  setCorrectAnswers: (answers: string[]) => void;
}

export function McqOptionsSection({ 
  options, 
  setOptions, 
  correctAnswers, 
  setCorrectAnswers 
}: McqOptionsSectionProps) {
  
  const addOption = () => {
    if (options.length >= 5) return;
    const newId = String(options.length + 1);
    setOptions([...options, { id: newId, text: '' }]);
  };

  const removeOption = (idToRemove: string) => {
    if (options.length <= 2) return;
    setOptions(options.filter(option => option.id !== idToRemove));
    setCorrectAnswers(correctAnswers.filter(id => id !== idToRemove));
  };

  const updateOptionText = (id: string, text: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, text } : option
    ));
  };

  const toggleCorrectAnswer = (id: string) => {
    if (correctAnswers.includes(id)) {
      setCorrectAnswers(correctAnswers.filter(answerId => answerId !== id));
    } else {
      setCorrectAnswers([...correctAnswers, id]);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Answer Options (select correct answers)</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={addOption}
          disabled={options.length >= 5}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Option
        </Button>
      </div>
      
      <AnimatePresence>
        {options.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-start space-x-2"
          >
            <Button
              type="button"
              variant={correctAnswers.includes(option.id) ? "default" : "outline"}
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={() => toggleCorrectAnswer(option.id)}
            >
              {correctAnswers.includes(option.id) ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="text-sm font-medium">{String.fromCharCode(65 + index)}</span>
              )}
            </Button>
            
            <Input
              placeholder={`Option ${String.fromCharCode(65 + index)}`}
              value={option.text}
              onChange={(e) => updateOptionText(option.id, e.target.value)}
              required
              className="flex-grow"
            />
            
            {options.length > 2 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeOption(option.id)}
                className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
