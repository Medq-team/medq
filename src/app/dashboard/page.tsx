'use client';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { useTranslation } from 'react-i18next';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProfileCompletionGuard } from '@/components/ProfileCompletionGuard';

// Disable static generation to prevent SSR issues with useAuth
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <ProtectedRoute>
      <ProfileCompletionGuard>
        <AppLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
              <p className="text-muted-foreground">
                {t('dashboard.welcome', { name: user?.name || user?.email })}
              </p>
            </div>
          </div>
        </AppLayout>
      </ProfileCompletionGuard>
    </ProtectedRoute>
  );
} 