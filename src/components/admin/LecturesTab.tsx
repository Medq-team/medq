
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Lecture } from '@/types';
import { LectureItem } from './LectureItem';

interface LecturesTabProps {
  lectures: Lecture[];
  isLoading: boolean;
  onDeleteLecture: (id: string) => void;
}

export function LecturesTab({ 
  lectures, 
  isLoading, 
  onDeleteLecture 
}: LecturesTabProps) {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Manage Lectures</h3>
        <Button 
          onClick={() => navigate('/admin/lecture/new')}
          className="btn-hover"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Lecture
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse border rounded-lg p-4">
              <div className="h-5 w-3/4 bg-muted rounded mb-2"></div>
              <div className="h-3 w-full bg-muted rounded mb-4"></div>
              <div className="h-9 w-32 bg-muted rounded"></div>
            </div>
          ))
        ) : lectures.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="text-lg font-semibold">No lectures available</h3>
            <p className="text-muted-foreground mt-2">
              Click "Add Lecture" to create your first lecture.
            </p>
          </div>
        ) : lectures.map((lecture) => (
          <LectureItem
            key={lecture.id}
            lecture={lecture}
            onDelete={onDeleteLecture}
          />
        ))}
      </div>
    </div>
  );
}
