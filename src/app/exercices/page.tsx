'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Specialty } from '@/types';
import { toast } from '@/hooks/use-toast';
import { AddSpecialtyDialog } from '@/components/specialties/AddSpecialtyDialog';
import { SpecialtiesList } from '@/components/specialties/SpecialtiesList';
import { useTranslation } from 'react-i18next';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Disable static generation to prevent SSR issues with useAuth
export const dynamic = 'force-dynamic';

// Cache for specialties data
let specialtiesCache: Specialty[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function ExercicesPage() {
  const { user, isAdmin } = useAuth();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { t } = useTranslation();

  const fetchSpecialties = useCallback(async (forceRefresh = false) => {
    try {
      // Check cache first
      const now = Date.now();
      if (!forceRefresh && specialtiesCache && (now - cacheTimestamp) < CACHE_DURATION) {
        setSpecialties(specialtiesCache);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const response = await fetch('/api/specialties', {
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch specialties');
      }

      const data = await response.json();
      setSpecialties(data || []);
      
      // Update cache
      specialtiesCache = data || [];
      cacheTimestamp = now;
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
  }, [t]);

  useEffect(() => {
    if (user) {
      fetchSpecialties();
    }
  }, [user, fetchSpecialties]);

  const handleAddSpecialty = useCallback(async (name: string, description: string) => {
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
      
      // Invalidate cache
      specialtiesCache = null;
      
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
  }, [t]);

  // Memoize the specialties list to prevent unnecessary re-renders
  const memoizedSpecialties = useMemo(() => specialties, [specialties]);

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Exercices</h1>
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
            specialties={memoizedSpecialties} 
            isLoading={isLoading} 
          />

          <AddSpecialtyDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onSpecialtyAdded={() => fetchSpecialties(true)}
          />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
} 