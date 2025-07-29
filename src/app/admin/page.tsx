'use client';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { AdminStats } from '@/components/admin/AdminStats';
import { SpecialtiesTab } from '@/components/admin/SpecialtiesTab';
import { LecturesTab } from '@/components/admin/LecturesTab';
import { ReportsTab } from '@/components/admin/ReportsTab';
import { UsersTab } from '@/components/admin/UsersTab';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function AdminPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'dashboard';
  const { t } = useTranslation();
  
  const renderContent = () => {
    switch (tab) {
      case 'specialties':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('admin.specialties')}</h1>
              <p className="text-muted-foreground">
                Manage specialties and their content
              </p>
            </div>
            <SpecialtiesTab />
          </div>
        );
      case 'lectures':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('admin.lectures')}</h1>
              <p className="text-muted-foreground">
                Manage lectures and their questions
              </p>
            </div>
            <LecturesTab />
          </div>
        );
      case 'users':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('admin.users')}</h1>
              <p className="text-muted-foreground">
                Manage user accounts and roles
              </p>
            </div>
            <UsersTab />
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('admin.reports')}</h1>
              <p className="text-muted-foreground">
                View and manage user reports
              </p>
            </div>
            <ReportsTab />
          </div>
        );
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('admin.adminDashboard')}</h1>
              <p className="text-muted-foreground">
                {t('admin.manageContent')}
              </p>
            </div>
            <AdminStats />
          </div>
        );
    }
  };
  
  return (
    <ProtectedRoute requireAdmin>
      <AdminRoute>
        <AdminLayout>
          {renderContent()}
        </AdminLayout>
      </AdminRoute>
    </ProtectedRoute>
  );
} 