
import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  // Check for password reset parameter in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('reset') === 'true') {
      setView('resetPassword');
    }
  }, [location]);

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-blue-50 to-white">
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
