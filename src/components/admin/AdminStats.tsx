
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, Users, HelpCircle, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';
import { RecentActivity } from './RecentActivity';
import { QuickActions } from './QuickActions';
import { EngagementMetrics } from './EngagementMetrics';

interface AdminStatsData {
  // Basic counts
  specialties: number;
  lectures: number;
  questions: number;
  users: number;
  pendingReports: number;
  
  // Recent activity
  recentUsers: Array<{
    id: string;
    email: string;
    name?: string;
    createdAt: string;
    role: string;
  }>;
  recentQuestions: Array<{
    id: string;
    text: string;
    type: string;
    createdAt: string;
    lecture: {
      id: string;
      title: string;
      specialty: {
        id: string;
        name: string;
      };
    };
  }>;
  recentLectures: Array<{
    id: string;
    title: string;
    createdAt: string;
    specialty: {
      id: string;
      name: string;
    };
    _count: {
      questions: number;
    };
  }>;
  recentReports: Array<{
    id: string;
    message: string;
    status: string;
    createdAt: string;
    question: {
      id: string;
      text: string;
    };
    lecture: {
      id: string;
      title: string;
    };
    user: {
      id: string;
      email: string;
    };
  }>;
  
  // Engagement metrics
  totalProgressEntries: number;
  recentProgressEntries: number;
  averageCompletionRate: number;
  
  // Time-based metrics
  usersThisWeek: number;
  questionsThisWeek: number;
  lecturesThisWeek: number;
  reportsThisWeek: number;
}

export function AdminStats() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          throw new Error('Failed to fetch admin stats');
        }
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

    fetchStats();
  }, [t]);
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-32"></div>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t('common.error')}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Basic Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.totalSpecialties')}
            </CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.specialties}</div>
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
            <div className="text-2xl font-bold">{stats.lectures}</div>
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
            <div className="text-2xl font-bold">{stats.questions}</div>
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
            <div className="text-2xl font-bold">{stats.users}</div>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.pendingReports')}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReports}</div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <EngagementMetrics
        totalProgressEntries={stats.totalProgressEntries}
        recentProgressEntries={stats.recentProgressEntries}
        averageCompletionRate={stats.averageCompletionRate}
        usersThisWeek={stats.usersThisWeek}
        questionsThisWeek={stats.questionsThisWeek}
        lecturesThisWeek={stats.lecturesThisWeek}
        reportsThisWeek={stats.reportsThisWeek}
      />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <RecentActivity
        recentUsers={stats.recentUsers}
        recentQuestions={stats.recentQuestions}
        recentLectures={stats.recentLectures}
        recentReports={stats.recentReports}
      />
    </div>
  );
}
