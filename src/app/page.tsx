'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

// Disable static generation to prevent SSR issues with useAuth
export const dynamic = 'force-dynamic';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    // Only redirect if not loading and user is logged in
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, router, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            MedQ
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            {t('landing.tagline')}
          </p>
        </div>
        <div className="space-x-4">
          <button
            onClick={() => router.push('/auth')}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            {t('landing.getStarted')}
          </button>
        </div>
      </div>
    </div>
  );
} 