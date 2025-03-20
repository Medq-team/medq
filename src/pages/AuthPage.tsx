
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const toggleForm = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-primary">MedEd Navigator</h1>
        <p className="text-muted-foreground mt-2">{t('Your medical education, simplified')}</p>
      </motion.div>
      
      <AnimatePresence mode="wait">
        {isLoginView ? (
          <LoginForm key="login" onToggleForm={toggleForm} />
        ) : (
          <RegisterForm key="register" onToggleForm={toggleForm} />
        )}
      </AnimatePresence>
    </div>
  );
}
