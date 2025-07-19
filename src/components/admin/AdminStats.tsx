
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, Users, HelpCircle } from 'lucide-react';
import { Lecture, Specialty } from '@/types';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';

export function AdminStats() {
  const { t } = useTranslation();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [questionsCount, setQuestionsCount] = useState<number>(0);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      
      try {
        // Fetch specialties
        const specialtiesResponse = await fetch('/api/specialties');
        if (specialtiesResponse.ok) {
          const specialtiesData = await specialtiesResponse.json();
          setSpecialties(specialtiesData || []);
        }

        // Fetch lectures
        const lecturesResponse = await fetch('/api/lectures');
        if (lecturesResponse.ok) {
          const lecturesData = await lecturesResponse.json();
          setLectures(lecturesData || []);
        }
        
        // Fetch questions count
        const questionsResponse = await fetch('/api/questions');
        if (questionsResponse.ok) {
          const questionsData = await questionsResponse.json();
          setQuestionsCount(questionsData?.length || 0);
        }
        
        // For now, we'll set a default user count since we don't have a users API yet
        setUsersCount(0);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        toast({
          title: t('common.error'),
          description: t('common.tryAgain'),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [t]);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-12"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            {t('admin.totalSpecialties')}
          </CardTitle>
          <BookOpen className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{specialties.length}</div>
        </CardContent>
      </Card>
      
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            {t('admin.totalLectures')}
          </CardTitle>
          <FileText className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lectures.length}</div>
        </CardContent>
      </Card>
      
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            {t('admin.totalQuestions')}
          </CardTitle>
          <HelpCircle className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{questionsCount}</div>
        </CardContent>
      </Card>
      
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            {t('admin.registeredUsers')}
          </CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{usersCount}</div>
        </CardContent>
      </Card>
    </div>
  );
}
