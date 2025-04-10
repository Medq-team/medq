
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Specialty } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { AddSpecialtyDialog } from '@/components/specialties/AddSpecialtyDialog';
import { SpecialtiesList } from '@/components/specialties/SpecialtiesList';
import { useTranslation } from 'react-i18next';
import { DemoTaskButton } from '@/components/tasks/DemoTaskButton';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

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
        title: t('common.error'),
        description: t('common.tryAgain'),
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
            <h2 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h2>
            <p className="text-muted-foreground">
              {t('dashboard.welcome')} {user?.email}. {isAdmin ? `(${t('profile.administrator')})` : `(${t('profile.student')})`} {t('dashboard.selectSpecialty')}
            </p>
          </div>
          
          <div className="flex gap-2">
            <DemoTaskButton />
            <AddSpecialtyDialog 
              onSpecialtyAdded={fetchSpecialties} 
              userId={user?.id}
            />
          </div>
        </div>

        <SpecialtiesList 
          specialties={specialties}
          isLoading={isLoading}
        />
      </div>
    </AppLayout>
  );
}
