
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Specialty } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { AddSpecialtyDialog } from '@/components/specialties/AddSpecialtyDialog';
import { SpecialtiesList } from '@/components/specialties/SpecialtiesList';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSpecialties();
    
    // For debugging
    console.log('DashboardPage - Current auth state:', {
      userId: user?.id,
      userEmail: user?.email,
      userRole: user?.role,
      isAdmin
    });
  }, [user, isAdmin]);

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

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome {user?.email}. {isAdmin ? '(Admin)' : '(Student)'} Select a specialty to get started.
            </p>
          </div>
          
          <AddSpecialtyDialog 
            onSpecialtyAdded={fetchSpecialties} 
            userId={user?.id}
          />
        </div>

        <SpecialtiesList 
          specialties={specialties}
          isLoading={isLoading}
        />
      </div>
    </AppLayout>
  );
}
