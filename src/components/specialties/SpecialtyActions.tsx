
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface SpecialtyActionsProps {
  onAddLectureClick: () => void;
  onAddQuestionClick: () => void;
  hasLectures: boolean;
}

export function SpecialtyActions({ 
  onAddLectureClick, 
  onAddQuestionClick, 
  hasLectures 
}: SpecialtyActionsProps) {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  return (
    <div className="flex justify-between items-center">
      <Button 
        variant="ghost" 
        className="group flex items-center" 
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Dashboard
      </Button>
      
      <div className="flex space-x-2">
        {user && hasLectures && (
          <Button variant="outline" onClick={onAddQuestionClick}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        )}
        
        {isAdmin && (
          <Button onClick={onAddLectureClick}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Lecture
          </Button>
        )}
      </div>
    </div>
  );
}
