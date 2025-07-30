'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { useAuth } from '@/contexts/AuthContext';

// Disable static generation to prevent SSR issues with useAuth
export const dynamic = 'force-dynamic';

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, router, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <div className="animate-pulse-subtle">
            <div className="h-4 w-24 bg-muted rounded mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{t('app.name')}</h1>
          <p className="text-muted-foreground mt-2">{t('auth.signInToContinue')}</p>
        </div>

        {authMode === 'login' && (
          <LoginForm
            onToggleForm={() => setAuthMode('register')}
            onForgotPassword={() => setAuthMode('forgot')}
          />
        )}

        {authMode === 'register' && (
          <RegisterForm onToggleForm={() => setAuthMode('login')} />
        )}

        {authMode === 'forgot' && (
          <ForgotPasswordForm onBack={() => setAuthMode('login')} />
        )}

        {authMode === 'reset' && (
          <ResetPasswordForm />
        )}
      </div>
    </div>
  );
} 