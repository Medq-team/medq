
import { Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash, HelpCircle, PenLine, ChevronDown, ChevronUp, Image, Video } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface QuestionItemProps {
  question: Question;
  onEdit: (questionId: string) => void;
  onDelete: (questionId: string) => void;
}

export function QuestionItem({ question, onEdit, onDelete }: QuestionItemProps) {
  const [expandedOption, setExpandedOption] = useState<string | null>(null);
  
  const toggleOption = (optionId: string) => {
    if (expandedOption === optionId) {
      setExpandedOption(null);
    } else {
      setExpandedOption(optionId);
    }
  };
  
  return (
    <Card key={question.id}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted">
                {question.type === 'mcq' ? (
                  <>
                    <HelpCircle className="h-3 w-3 mr-1" />
                    Multiple Choice
                  </>
                ) : (
                  <>
                    <PenLine className="h-3 w-3 mr-1" />
                    Open Question
                  </>
                )}
              </div>
              {question.number !== null && question.number !== undefined && (
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800">
                  #{question.number}
                </div>
              )}
              {question.session && (
                <div className="text-xs text-muted-foreground">
                  {question.session}
                </div>
              )}
              {question.media_type && (
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {question.media_type === 'image' ? (
                    <>
                      <Image className="h-3 w-3 mr-1" />
                      Image
                    </>
                  ) : (
                    <>
                      <Video className="h-3 w-3 mr-1" />
                      Video
                    </>
                  )}
                </div>
              )}
            </div>
            <CardTitle className="text-base">{question.text}</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onEdit(question.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive">
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Question</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this question? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => onDelete(question.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm">
        {question.media_url && (
          <div className="mb-4 border rounded overflow-hidden">
            {question.media_type === 'image' ? (
              <img 
                src={question.media_url} 
                alt="Question media" 
                className="w-full h-auto max-h-[200px] object-contain"
              />
            ) : question.media_type === 'video' ? (
              <video 
                src={question.media_url} 
                controls 
                className="w-full max-h-[200px]"
              />
            ) : null}
          </div>
        )}
      
        {question.type === 'mcq' && question.options && (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div key={option.id} className="border rounded-md p-2">
                <div className="flex items-start gap-2">
                  <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-xs 
                    ${(question.correct_answers?.includes(option.id)) 
                      ? 'bg-green-100 text-green-800 border border-green-300' 
                      : 'bg-muted text-muted-foreground'}`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-grow">{option.text}</span>
                  
                  {option.explanation && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      onClick={() => toggleOption(option.id)}
                    >
                      {expandedOption === option.id ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </div>
                
                {expandedOption === option.id && option.explanation && (
                  <div className="mt-2 pt-2 pl-7 text-xs text-muted-foreground border-t">
                    {option.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {(question.course_reminder || question.explanation) && (
          <div className="mt-3 pt-3 border-t">
            <strong>Rappel du cours:</strong> {question.course_reminder || question.explanation}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
