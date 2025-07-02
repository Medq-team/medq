'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

type AuthView = 'login' | 'register' | 'forgotPassword' | 'resetPassword';

export default function AuthPage() {
  const { user } = useAuth();
  const [view, setView] = useState<AuthView>('login');
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for password reset parameter in URL
  useEffect(() => {
    if (!searchParams) return;
    
    // Log URL parameters for debugging
    console.log('Auth page URL parameters:', {
      reset: searchParams.get('reset'),
      type: searchParams.get('type'),
      hasAccessToken: !!searchParams.get('access_token'),
      fullUrl: window.location.href
    });
    
    // Check for reset=true or if this is a recovery flow from Supabase
    if (searchParams.get('reset') === 'true' || searchParams.get('type') === 'recovery') {
      console.log('Showing reset password form');
      setView('resetPassword');
    }
  }, [searchParams]);

  // If user is already logged in, redirect to dashboard
  if (user) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-background to-muted/20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-primary">{t('app.name')}</h1>
        <p className="text-muted-foreground mt-2">{t('app.tagline')}</p>
      </motion.div>
      
      <AnimatePresence mode="wait">
        {view === 'login' && (
          <LoginForm 
            key="login" 
            onToggleForm={() => setView('register')}
            onForgotPassword={() => setView('forgotPassword')}
          />
        )}
        {view === 'register' && (
          <RegisterForm 
            key="register" 
            onToggleForm={() => setView('login')} 
          />
        )}
        {view === 'forgotPassword' && (
          <ForgotPasswordForm 
            key="forgotPassword"
            onBack={() => setView('login')}
          />
        )}
        {view === 'resetPassword' && (
          <ResetPasswordForm key="resetPassword" />
        )}
      </AnimatePresence>
    </div>
  );
}
