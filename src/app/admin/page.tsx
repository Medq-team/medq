'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { AdminStats } from '@/components/admin/AdminStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LecturesTab } from '@/components/admin/LecturesTab';
import { SpecialtiesTab } from '@/components/admin/SpecialtiesTab';
import { ReportsTab } from '@/components/admin/ReportsTab';
import { useTranslation } from 'react-i18next';
import { Specialty, Lecture } from '@/types';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { toast } from '@/hooks/use-toast';

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoadingSpecialties, setIsLoadingSpecialties] = useState(false);
  const [isLoadingLectures, setIsLoadingLectures] = useState(false);
  const { t } = useTranslation();

  // Redirect non-admin users
  useEffect(() => {
    if (isAdmin === false) {
      window.location.href = '/dashboard';
    }
  }, [isAdmin]);

  // Fetch data when component mounts or when isAdmin changes
  useEffect(() => {
    if (isAdmin) {
      fetchSpecialties();
      fetchLectures();
    }
  }, [isAdmin]);

  const fetchSpecialties = async () => {
    try {
      setIsLoadingSpecialties(true);
      const response = await fetch('/api/specialties');
      if (response.ok) {
        const data = await response.json();
        setSpecialties(data);
      } else {
        console.error('Failed to fetch specialties');
        toast({
          title: t('common.error'),
          description: t('common.tryAgain'),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching specialties:', error);
      toast({
        title: t('common.error'),
        description: t('common.tryAgain'),
        variant: "destructive",
      });
    } finally {
      setIsLoadingSpecialties(false);
    }
  };

  const fetchLectures = async () => {
    try {
      setIsLoadingLectures(true);
      const response = await fetch('/api/lectures');
      if (response.ok) {
        const data = await response.json();
        setLectures(data);
      } else {
        console.error('Failed to fetch lectures');
        toast({
          title: t('common.error'),
          description: t('common.tryAgain'),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching lectures:', error);
      toast({
        title: t('common.error'),
        description: t('common.tryAgain'),
        variant: "destructive",
      });
    } finally {
      setIsLoadingLectures(false);
    }
  };

  const handleDeleteSpecialty = (id: string) => {
    setSpecialties(prev => prev.filter(s => s.id !== id));
  };

  const handleDeleteLecture = (id: string) => {
    setLectures(prev => prev.filter(l => l.id !== id));
  };

  if (isAdmin === false) {
    return null;
  }

  return (
    <AdminRoute>
      <AppLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t('admin.adminPanel')}</h2>
            <p className="text-muted-foreground">
              {t('admin.manageContent')}
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">{t('admin.overview')}</TabsTrigger>
              <TabsTrigger value="specialties">{t('admin.specialties')}</TabsTrigger>
              <TabsTrigger value="lectures">{t('admin.lectures')}</TabsTrigger>
              <TabsTrigger value="reports">{t('admin.reports')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <AdminStats />
            </TabsContent>

            <TabsContent value="specialties" className="space-y-4">
              <SpecialtiesTab 
                specialties={specialties}
                isLoading={isLoadingSpecialties}
                onDeleteSpecialty={handleDeleteSpecialty}
              />
            </TabsContent>

            <TabsContent value="lectures" className="space-y-4">
              <LecturesTab 
                lectures={lectures}
                isLoading={isLoadingLectures}
                onDeleteLecture={handleDeleteLecture}
              />
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <ReportsTab />
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>
    </AdminRoute>
  );
} 