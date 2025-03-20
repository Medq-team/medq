
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Specialty, Lecture } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { AdminStats } from '@/components/admin/AdminStats';
import { SpecialtiesTab } from '@/components/admin/SpecialtiesTab';
import { LecturesTab } from '@/components/admin/LecturesTab';

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    specialtiesCount: 0,
    lecturesCount: 0,
    questionsCount: 0,
    usersCount: 0
  });

  const fetchAdminData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch specialties
      const { data: specialtiesData, error: specialtiesError } = await supabase
        .from('specialties')
        .select('*')
        .order('name');

      if (specialtiesError) throw specialtiesError;
      setSpecialties(specialtiesData || []);

      // Fetch lectures
      const { data: lecturesData, error: lecturesError } = await supabase
        .from('lectures')
        .select('*')
        .order('title');

      if (lecturesError) throw lecturesError;
      setLectures(lecturesData || []);

      // Fetch counts for stats
      const [specialtiesCount, lecturesCount, questionsCount, usersCount] = await Promise.all([
        supabase.from('specialties').select('id', { count: 'exact', head: true }),
        supabase.from('lectures').select('id', { count: 'exact', head: true }),
        supabase.from('questions').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true })
      ]);

      setStatsData({
        specialtiesCount: specialtiesCount.count || 0,
        lecturesCount: lecturesCount.count || 0,
        questionsCount: questionsCount.count || 0,
        usersCount: usersCount.count || 0
      });
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
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }

    fetchAdminData();
  }, [isAdmin, navigate]);

  const handleDeleteSpecialty = (specialtyId: string) => {
    setSpecialties(specialties.filter(s => s.id !== specialtyId));
    setStatsData(prev => ({
      ...prev,
      specialtiesCount: prev.specialtiesCount - 1
    }));
  };

  const handleDeleteLecture = (lectureId: string) => {
    setLectures(lectures.filter(l => l.id !== lectureId));
    setStatsData(prev => ({
      ...prev,
      lecturesCount: prev.lecturesCount - 1
    }));
  };

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Manage specialties, lectures, and questions
          </p>
        </div>

        <AdminStats {...statsData} />

        <Tabs defaultValue="specialties" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="specialties">Specialties</TabsTrigger>
            <TabsTrigger value="lectures">Lectures</TabsTrigger>
          </TabsList>
          
          <TabsContent value="specialties">
            <SpecialtiesTab 
              specialties={specialties} 
              isLoading={isLoading} 
              onDeleteSpecialty={handleDeleteSpecialty} 
            />
          </TabsContent>
          
          <TabsContent value="lectures">
            <LecturesTab 
              lectures={lectures} 
              isLoading={isLoading} 
              onDeleteLecture={handleDeleteLecture} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
