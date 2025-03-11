
import { Question } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuestionContentTab } from './QuestionContentTab';
import { AnswersExplanationsTab } from './AnswersExplanationsTab';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface QuestionEditContentProps {
  question: Question;
  questionText: string;
  setQuestionText: (text: string) => void;
  courseReminder: string;
  setCourseReminder: (text: string) => void;
  options: { id: string; text: string; explanation?: string }[];
  updateOptionText: (id: string, text: string) => void;
  updateOptionExplanation: (id: string, explanation: string) => void;
  correctAnswers: string[];
  toggleCorrectAnswer: (id: string) => void;
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function QuestionEditContent({
  question,
  questionText,
  setQuestionText,
  courseReminder,
  setCourseReminder,
  options,
  updateOptionText,
  updateOptionExplanation,
  correctAnswers,
  toggleCorrectAnswer,
  isLoading,
  onCancel,
  onSubmit
}: QuestionEditContentProps) {
  const [activeTab, setActiveTab] = useState<string>("content");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full">
        <TabsTrigger value="content" className="flex-1">Question Content</TabsTrigger>
        {question.type === 'mcq' && (
          <TabsTrigger value="answers" className="flex-1">Answers & Explanations</TabsTrigger>
        )}
      </TabsList>
      
      <form onSubmit={onSubmit} className="space-y-4 mt-4">
        <TabsContent value="content" className="space-y-4">
          <QuestionContentTab
            questionText={questionText}
            setQuestionText={setQuestionText}
            courseReminder={courseReminder}
            setCourseReminder={setCourseReminder}
            questionType={question.type}
          />
        </TabsContent>
        
        {question.type === 'mcq' && (
          <TabsContent value="answers" className="space-y-4">
            <AnswersExplanationsTab
              options={options}
              correctAnswers={correctAnswers}
              updateOptionText={updateOptionText}
              updateOptionExplanation={updateOptionExplanation}
              toggleCorrectAnswer={toggleCorrectAnswer}
            />
          </TabsContent>
        )}
        
        <div className="flex justify-end pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Tabs>
  );
}
