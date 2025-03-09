
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuestionForm } from '@/hooks/use-question-form';
import { QuestionFormSubmit } from './QuestionFormSubmit';
import { QuestionTypeSelect } from './QuestionTypeSelect';
import { QuestionFields } from './QuestionFields';
import { McqOptionsSection } from './McqOptionsSection';
import { AutoParseInput } from './AutoParseInput';
import { FormActionButtons } from './FormActionButtons';

interface QuestionFormProps {
  lectureId: string;
  editQuestionId?: string;
  onComplete?: () => void;
}

export function QuestionForm({ lectureId, editQuestionId, onComplete }: QuestionFormProps) {
  const navigate = useNavigate();
  const {
    isLoading,
    setIsLoading,
    questionType,
    setQuestionType,
    questionText,
    setQuestionText,
    courseReminder,
    setCourseReminder,
    options,
    setOptions,
    correctAnswers,
    setCorrectAnswers,
    handleParsedContent
  } = useQuestionForm({ lectureId, editQuestionId, onComplete });

  const handleCancel = () => {
    if (onComplete) {
      onComplete();
    } else {
      navigate(`/admin/lecture/${lectureId}`);
    }
  };

  return (
    <Card className={onComplete ? "w-full border-0 shadow-none" : "w-full max-w-3xl mx-auto"}>
      {!onComplete && (
        <CardHeader>
          <CardTitle>{editQuestionId ? 'Edit Question' : 'Create New Question'}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <QuestionFormSubmit
          lectureId={lectureId}
          editQuestionId={editQuestionId}
          onComplete={onComplete}
          questionType={questionType}
          questionText={questionText}
          courseReminder={courseReminder}
          options={options}
          correctAnswers={correctAnswers}
          setIsLoading={setIsLoading}
        >
          <QuestionTypeSelect 
            questionType={questionType} 
            setQuestionType={setQuestionType} 
          />
          
          {questionType === 'mcq' && !editQuestionId && (
            <AutoParseInput onParsedContent={handleParsedContent} />
          )}
          
          <QuestionFields 
            questionText={questionText}
            setQuestionText={setQuestionText}
            courseReminder={courseReminder}
            setCourseReminder={setCourseReminder}
            questionType={questionType}
          />
          
          {questionType === 'mcq' && (
            <McqOptionsSection
              options={options}
              setOptions={setOptions}
              correctAnswers={correctAnswers}
              setCorrectAnswers={setCorrectAnswers}
            />
          )}
          
          <FormActionButtons 
            isLoading={isLoading} 
            onCancel={handleCancel} 
            isEdit={!!editQuestionId} 
          />
        </QuestionFormSubmit>
      </CardContent>
    </Card>
  );
}
