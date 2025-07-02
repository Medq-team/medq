
import { Lecture } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
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
  const router = useRouter();
  const { t } = useTranslation();
  
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
        title: t('lectures.deleteLecture'),
        description: t('admin.questionDeleted'),
      });
      
      onDelete(lecture.id);
    } catch (error) {
      console.error('Error deleting lecture:', error);
      toast({
        title: t('common.error'),
        description: t('common.tryAgain'),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2" onClick={() => router.push(`/admin/lecture/${lecture.id}`)}>
        <CardTitle>{lecture.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {lecture.description || t('lectures.noDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
                      onClick={() => router.push(`/admin/lecture/${lecture.id}`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          {t('common.manage')}
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
              {t('common.delete')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('lectures.deleteLecture')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('lectures.deleteConfirmation')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDelete}
              >
                {t('common.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
