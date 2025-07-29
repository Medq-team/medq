import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  FileText, 
  BookOpen, 
  AlertTriangle, 
  ArrowRight,
  Clock,
  User,
  HelpCircle,
  GraduationCap,
  Flag
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

interface RecentActivityProps {
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
}

export function RecentActivity({ 
  recentUsers, 
  recentQuestions, 
  recentLectures, 
  recentReports 
}: RecentActivityProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-green-100 text-green-800';
      case 'dismissed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Users */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('admin.recentUsers')}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/admin?tab=users')}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {recentUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t('admin.noRecentUsers')}
              </p>
            ) : (
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.name || user.email}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Recent Questions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            {t('admin.recentQuestions')}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/admin?tab=questions')}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {recentQuestions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t('admin.noRecentQuestions')}
              </p>
            ) : (
              <div className="space-y-3">
                {recentQuestions.map((question) => (
                  <div key={question.id} className="p-2 rounded-lg border">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{question.text}</p>
                        <p className="text-xs text-muted-foreground">
                          {question.lecture.specialty.name} • {question.lecture.title}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {question.type}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(question.createdAt)}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => router.push(`/admin/lecture/${question.lecture.id}`)}
                        className="h-6 px-2 text-xs"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Recent Lectures */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            {t('admin.recentLectures')}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/admin?tab=lectures')}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {recentLectures.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t('admin.noRecentLectures')}
              </p>
            ) : (
              <div className="space-y-3">
                {recentLectures.map((lecture) => (
                  <div key={lecture.id} className="p-2 rounded-lg border">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{lecture.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {lecture.specialty.name}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {lecture._count.questions} questions
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(lecture.createdAt)}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => router.push(`/admin/lecture/${lecture.id}`)}
                        className="h-6 px-2 text-xs"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Flag className="h-4 w-4" />
            {t('admin.recentReports')}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/admin?tab=reports')}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {recentReports.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t('admin.noRecentReports')}
              </p>
            ) : (
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div key={report.id} className="p-2 rounded-lg border">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{report.question.text}</p>
                        <p className="text-xs text-muted-foreground">
                          {report.lecture.title} • {report.user?.email || 'Anonymous'}
                        </p>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(report.status)}`}>
                        {report.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(report.createdAt)}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => router.push(`/lecture/${report.lecture.id}`)}
                        className="h-6 px-2 text-xs"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
} 