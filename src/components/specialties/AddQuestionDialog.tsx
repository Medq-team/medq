
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QuestionForm } from '@/components/admin/QuestionForm';
import { Lecture } from '@/types';

interface AddQuestionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLectureId: string | null;
  setSelectedLectureId: (id: string) => void;
  lectures: Lecture[];
}

export function AddQuestionDialog({ 
  isOpen, 
  onOpenChange, 
  selectedLectureId, 
  setSelectedLectureId,
  lectures
}: AddQuestionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
        </DialogHeader>
        {selectedLectureId && (
          <div className="mb-4">
            <label className="text-sm font-medium">Select Lecture:</label>
            <select 
              className="w-full p-2 mt-1 border rounded-md bg-background"
              value={selectedLectureId}
              onChange={(e) => setSelectedLectureId(e.target.value)}
            >
              {lectures.map((lecture) => (
                <option key={lecture.id} value={lecture.id}>
                  {lecture.title}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedLectureId && (
          <QuestionForm 
            lectureId={selectedLectureId} 
            onComplete={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
