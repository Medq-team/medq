
import { Lecture } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
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

interface LectureItemProps {
  lecture: Lecture;
  onDelete: (id: string) => void;
}

export function LectureItem({ lecture, onDelete }: LectureItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Check if lecture has questions associated with it
      const { data: questions, error: checkError } = await supabase
        .from('questions')
        .select('id')
        .eq('lecture_id', lecture.id);
        
      if (checkError) throw checkError;
      
      if (questions && questions.length > 0) {
        // First delete all the questions associated with this lecture
        const { error: deleteQuestionsError } = await supabase
          .from('questions')
          .delete()
          .eq('lecture_id', lecture.id);
          
        if (deleteQuestionsError) throw deleteQuestionsError;
      }
      
      // Delete the lecture
      const { error } = await supabase
        .from('lectures')
        .delete()
        .eq('id', lecture.id);
        
      if (error) throw error;
      
      toast({
        title: "Lecture deleted",
        description: "The lecture and its questions have been successfully removed",
      });
      
      onDelete(lecture.id);
    } catch (error) {
      console.error('Error deleting lecture:', error);
      toast({
        title: "Error",
        description: "Failed to delete lecture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-2" onClick={() => navigate(`/admin/lecture/${lecture.id}`)}>
        <CardTitle>{lecture.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {lecture.description || 'No description available'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/admin/lecture/${lecture.id}`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Manage Questions
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              disabled={isDeleting}
              onClick={(e) => e.stopPropagation()}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Lecture</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{lecture.title}"? This will also delete all questions associated with this lecture. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDelete}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
