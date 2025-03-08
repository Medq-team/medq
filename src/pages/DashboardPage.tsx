
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { SpecialtyCard } from '@/components/specialties/SpecialtyCard';
import { Specialty } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function DashboardPage() {
  const { user } = useAuth();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddSpecialtyOpen, setIsAddSpecialtyOpen] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSpecialties();
  }, []);

  async function fetchSpecialties() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('specialties')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setSpecialties(data || []);
    } catch (error) {
      console.error('Error fetching specialties:', error);
      toast({
        title: "Error",
        description: "Failed to load specialties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddSpecialty = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create specialties.",
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
            imageurl: newSpecialty.imageUrl || null
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
      setIsAddSpecialtyOpen(false);
      
      // Refresh the list of specialties
      fetchSpecialties();
      
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
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome {user?.email}. Select a specialty to get started.
            </p>
          </div>
          
          <Dialog open={isAddSpecialtyOpen} onOpenChange={setIsAddSpecialtyOpen}>
            <DialogTrigger asChild>
              <Button>
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
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-2/3 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : specialties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialties.map((specialty) => (
              <SpecialtyCard key={specialty.id} specialty={specialty} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-fade-in">
            <h3 className="text-lg font-semibold">No specialties available</h3>
            <p className="text-muted-foreground mt-2">
              Please check back later or contact an administrator.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
