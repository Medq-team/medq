
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Specialty, Lecture } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { BookOpen, PlusCircle, Users, FileText } from 'lucide-react';

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

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }

    async function fetchAdminData() {
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
    }

    fetchAdminData();
  }, [isAdmin, navigate]);

  const goToSpecialty = (specialtyId: string) => {
    navigate(`/admin/specialty/${specialtyId}`);
  };

  const goToLecture = (lectureId: string) => {
    navigate(`/admin/lecture/${lectureId}`);
  };

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Manage specialties, lectures, and questions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Specialties
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData.specialtiesCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Lectures
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData.lecturesCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Questions
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData.questionsCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Registered Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData.usersCount}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="specialties" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="specialties">Specialties</TabsTrigger>
            <TabsTrigger value="lectures">Lectures</TabsTrigger>
          </TabsList>
          
          <TabsContent value="specialties" className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">Manage Specialties</h3>
              <Button onClick={() => navigate('/admin/specialty/new')}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Specialty
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specialties.map((specialty) => (
                <Card key={specialty.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2" onClick={() => goToSpecialty(specialty.id)}>
                    <CardTitle>{specialty.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {specialty.description || 'No description available'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => goToSpecialty(specialty.id)}
                    >
                      Manage
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="lectures" className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">Manage Lectures</h3>
              <Button onClick={() => navigate('/admin/lecture/new')}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Lecture
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lectures.map((lecture) => (
                <Card key={lecture.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2" onClick={() => goToLecture(lecture.id)}>
                    <CardTitle>{lecture.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {lecture.description || 'No description available'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => goToLecture(lecture.id)}
                    >
                      Manage Questions
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
