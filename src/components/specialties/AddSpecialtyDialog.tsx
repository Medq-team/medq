
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AddSpecialtyDialogProps {
  onSpecialtyAdded: () => void;
  userId: string | undefined;
}

export function AddSpecialtyDialog({ onSpecialtyAdded, userId }: AddSpecialtyDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAdmin, user } = useAuth();
  
  useEffect(() => {
    // For debugging
    console.log('AddSpecialtyDialog - Current auth state:', { 
      isAdmin, 
      userId, 
      userEmail: user?.email,
      userRole: user?.role
    });
  }, [isAdmin, userId, user]);

  const handleAddSpecialty = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create specialties.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only administrators can create specialties.",
        variant: "destructive",
      });
      return;
    }
    
    if (!newSpecialty.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Specialty name is required.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('specialties')
        .insert([
          {
            name: newSpecialty.name,
            description: newSpecialty.description || null,
            imageurl: newSpecialty.imageUrl || null,
            created_by: userId
          }
        ])
        .select();
      
      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Specialty has been created successfully.",
      });
      
      // Reset form and close dialog
      setNewSpecialty({
        name: '',
        description: '',
        imageUrl: ''
      });
      setIsOpen(false);
      
      // Inform parent component to refresh the list
      onSpecialtyAdded();
      
    } catch (error: any) {
      console.error('Error creating specialty:', error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error creating specialty",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="relative" disabled={!isAdmin}>
          {!isAdmin && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
              <span className="text-xs text-white">Admin only</span>
            </div>
          )}
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Specialty
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Specialty</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleAddSpecialty} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name"
              value={newSpecialty.name}
              onChange={(e) => setNewSpecialty({...newSpecialty, name: e.target.value})}
              placeholder="Specialty name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description"
              value={newSpecialty.description}
              onChange={(e) => setNewSpecialty({...newSpecialty, description: e.target.value})}
              placeholder="Brief description"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input 
              id="imageUrl"
              value={newSpecialty.imageUrl}
              onChange={(e) => setNewSpecialty({...newSpecialty, imageUrl: e.target.value})}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Specialty"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
