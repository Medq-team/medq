
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Lecture, Specialty } from '@/types';
import { AdminStats } from '@/components/admin/AdminStats';
import { LecturesTab } from '@/components/admin/LecturesTab';
import { SpecialtiesTab } from '@/components/admin/SpecialtiesTab';
import { ReportsTab } from '@/components/admin/ReportsTab';
import { useTranslation } from 'react-i18next';

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [questionsCount, setQuestionsCount] = useState<number>(0);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('lectures');
  const { t } = useTranslation();
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      
      try {
        // Fetch lectures
        const { data: lecturesData, error: lecturesError } = await supabase
          .from('lectures')
          .select('*')
          .order('title');

        if (lecturesError) throw lecturesError;
        setLectures(lecturesData || []);

        // Fetch specialties
        const { data: specialtiesData, error: specialtiesError } = await supabase
          .from('specialties')
          .select('*')
          .order('name');

        if (specialtiesError) throw specialtiesError;
        setSpecialties(specialtiesData || []);
        
        // Fetch questions count
        const { count: questionsTotal, error: questionsError } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true });
          
        if (questionsError) throw questionsError;
        setQuestionsCount(questionsTotal || 0);
        
        // Fetch users count
        const { count: usersTotal, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        if (usersError) throw usersError;
        setUsersCount(usersTotal || 0);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast({
          title: "Error",
          description: "Failed to load admin data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [isAdmin, navigate]);

  const handleDeleteLecture = (id: string) => {
    setLectures(lectures.filter(lecture => lecture.id !== id));
  };

  const handleDeleteSpecialty = (id: string) => {
    setSpecialties(specialties.filter(specialty => specialty.id !== id));
  };

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('admin.adminPanel')}</h1>
        
        <AdminStats 
          lectures={lectures} 
          specialties={specialties} 
          questionsCount={questionsCount}
          usersCount={usersCount}
        />
        
        <Tabs defaultValue="lectures" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8 w-full sm:w-auto">
            <TabsTrigger value="lectures">{t('admin.lectures')}</TabsTrigger>
            <TabsTrigger value="specialties">{t('admin.specialties')}</TabsTrigger>
            <TabsTrigger value="reports">{t('admin.reports')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lectures">
            <LecturesTab 
              lectures={lectures} 
              isLoading={isLoading} 
              onDeleteLecture={handleDeleteLecture} 
            />
          </TabsContent>
          
          <TabsContent value="specialties">
            <SpecialtiesTab 
              specialties={specialties} 
              isLoading={isLoading}
              onDeleteSpecialty={handleDeleteSpecialty}
            />
          </TabsContent>
          
          <TabsContent value="reports">
            <ReportsTab />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
