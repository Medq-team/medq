
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AddLectureDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  specialtyId: string;
  onLectureAdded: () => void;
}

export function AddLectureDialog({ 
  isOpen, 
  onOpenChange, 
  specialtyId, 
  onLectureAdded 
}: AddLectureDialogProps) {
  const [newLecture, setNewLecture] = useState({
    title: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!specialtyId) return;
    
    if (!newLecture.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Lecture title is required.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('lectures')
        .insert([
          {
            title: newLecture.title,
            description: newLecture.description || null,
            specialty_id: specialtyId
          }
        ])
        .select();
      
      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Lecture has been created successfully.",
      });
      
      // Reset form and close dialog
      setNewLecture({
        title: '',
        description: ''
      });
      onOpenChange(false);
      
      // Refresh the lectures list
      onLectureAdded();
      
    } catch (error: any) {
      console.error('Error creating lecture:', error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error creating lecture",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Lecture</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleAddLecture} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title"
              value={newLecture.title}
              onChange={(e) => setNewLecture({...newLecture, title: e.target.value})}
              placeholder="Lecture title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description"
              value={newLecture.description}
              onChange={(e) => setNewLecture({...newLecture, description: e.target.value})}
              placeholder="Brief description"
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Lecture"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
