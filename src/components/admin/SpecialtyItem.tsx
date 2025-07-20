
import { Specialty } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

interface SpecialtyItemProps {
  specialty: Specialty;
  onDelete: (id: string) => void;
}

export function SpecialtyItem({ specialty, onDelete }: SpecialtyItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Check if specialty has lectures associated with it
      const lecturesResponse = await fetch(`/api/lectures?specialtyId=${specialty.id}`);
      if (!lecturesResponse.ok) throw new Error('Failed to check lectures');
      const lectures = await lecturesResponse.json();
      
      if (lectures && lectures.length > 0) {
        toast({
          title: "Cannot delete specialty",
          description: "This specialty has lectures associated with it. Delete those first.",
          variant: "destructive",
        });
        return;
      }
      
      // Delete the specialty
      const deleteResponse = await fetch(`/api/specialties/${specialty.id}`, {
        method: 'DELETE',
      });
      
      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json();
        throw new Error(errorData.error || 'Failed to delete specialty');
      }
      
      toast({
        title: "Specialty deleted",
        description: "The specialty has been successfully removed",
      });
      
      onDelete(specialty.id);
    } catch (error) {
      console.error('Error deleting specialty:', error);
      toast({
        title: "Error",
        description: "Failed to delete specialty. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2" onClick={() => router.push(`/admin/specialty/${specialty.id}`)}>
        <CardTitle>{specialty.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {specialty.description || 'No description available'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
                      onClick={() => router.push(`/admin/specialty/${specialty.id}`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Manage
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
              <AlertDialogTitle>Delete Specialty</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{specialty.name}"? This action cannot be undone.
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
