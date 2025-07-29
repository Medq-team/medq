import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Upload, 
  BookOpen, 
  FileText, 
  Users, 
  Settings,
  BarChart3,
  Download
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

export function QuickActions() {
  const { t } = useTranslation();
  const router = useRouter();

  const actions = [
    {
      title: t('admin.addSpecialty'),
      description: t('admin.addSpecialtyDesc'),
      icon: BookOpen,
      onClick: () => router.push('/admin?tab=specialties'),
      variant: 'outline' as const,
      color: 'text-blue-600'
    },
    {
      title: t('admin.addLecture'),
      description: t('admin.addLectureDesc'),
      icon: FileText,
      onClick: () => router.push('/admin?tab=lectures'),
      variant: 'outline' as const,
      color: 'text-green-600'
    },
    {
      title: t('admin.importQuestions'),
      description: t('admin.importQuestionsDesc'),
      icon: Upload,
      onClick: () => router.push('/admin/import'),
      variant: 'outline' as const,
      color: 'text-purple-600'
    },
    {
      title: t('admin.manageUsers'),
      description: t('admin.manageUsersDesc'),
      icon: Users,
      onClick: () => router.push('/admin?tab=users'),
      variant: 'outline' as const,
      color: 'text-orange-600'
    },
    {
      title: t('admin.viewReports'),
      description: t('admin.viewReportsDesc'),
      icon: BarChart3,
      onClick: () => router.push('/admin?tab=reports'),
      variant: 'outline' as const,
      color: 'text-red-600'
    },
    {
      title: t('admin.systemSettings'),
      description: t('admin.systemSettingsDesc'),
      icon: Settings,
      onClick: () => router.push('/settings'),
      variant: 'outline' as const,
      color: 'text-gray-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{t('admin.quickActions')}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('admin.quickActionsDesc')}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              onClick={action.onClick}
              className="h-auto p-4 flex flex-col items-start gap-2 text-left"
            >
              <div className="flex items-center gap-2 w-full">
                <action.icon className={`h-5 w-5 ${action.color}`} />
                <span className="font-medium">{action.title}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {action.description}
              </p>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 