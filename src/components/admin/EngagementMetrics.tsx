import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EngagementMetricsProps {
  totalProgressEntries: number;
  recentProgressEntries: number;
  averageCompletionRate: number;
  usersThisWeek: number;
  questionsThisWeek: number;
  lecturesThisWeek: number;
  reportsThisWeek: number;
}

export function EngagementMetrics({
  totalProgressEntries,
  recentProgressEntries,
  averageCompletionRate,
  usersThisWeek,
  questionsThisWeek,
  lecturesThisWeek,
  reportsThisWeek
}: EngagementMetricsProps) {
  const { t } = useTranslation();

  const metrics = [
    {
      title: t('admin.completionRate'),
      value: `${averageCompletionRate}%`,
      description: t('admin.completionRateDesc'),
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      progress: averageCompletionRate
    },
    {
      title: t('admin.totalProgress'),
      value: totalProgressEntries.toLocaleString(),
      description: t('admin.totalProgressDesc'),
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      progress: null
    },
    {
      title: t('admin.recentActivity'),
      value: recentProgressEntries.toLocaleString(),
      description: t('admin.recentActivityDesc'),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      progress: null
    }
  ];

  const weeklyStats = [
    {
      label: t('admin.newUsers'),
      value: usersThisWeek,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      label: t('admin.newQuestions'),
      value: questionsThisWeek,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      label: t('admin.newLectures'),
      value: lecturesThisWeek,
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      label: t('admin.newReports'),
      value: reportsThisWeek,
      icon: AlertCircle,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
              {metric.progress !== null && (
                <div className="mt-3">
                  <Progress value={metric.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {metric.progress}% {t('admin.complete')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{t('admin.weeklyActivity')}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('admin.weeklyActivityDesc')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {weeklyStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-2`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 