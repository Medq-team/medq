'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Specialty } from '@/types';
import { toast } from '@/hooks/use-toast';
import { AddSpecialtyDialog } from '@/components/specialties/AddSpecialtyDialog';
import { SpecialtiesList } from '@/components/specialties/SpecialtiesList';
import { useTranslation } from 'react-i18next';

// Disable static generation to prevent SSR issues with useAuth
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchSpecialties();
  }, [user, isAdmin]);

  async function fetchSpecialties() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/specialties');
      
      if (!response.ok) {
        throw new Error('Failed to fetch specialties');
      }

      const data = await response.json();
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

  const handleAddSpecialty = async (name: string, description: string) => {
    try {
      const response = await fetch('/api/specialties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to create specialty');
      }

      const newSpecialty = await response.json();
      setSpecialties(prev => [...prev, newSpecialty]);
      setIsAddDialogOpen(false);
      
      toast({
        title: t('specialties.created'),
        description: t('specialties.createdSuccess'),
      });
    } catch (error) {
      console.error('Error creating specialty:', error);
      toast({
        title: t('common.error'),
        description: t('common.tryAgain'),
        variant: "destructive",
      });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground">
              {t('dashboard.welcome', { name: user?.name || user?.email })}
            </p>
          </div>
          {isAdmin && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              {t('specialties.add')}
            </Button>
          )}
        </div>

        <SpecialtiesList 
          specialties={specialties} 
          isLoading={isLoading} 
        />

        <AddSpecialtyDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSpecialtyAdded={fetchSpecialties}
        />
      </div>
    </AppLayout>
  );
} 