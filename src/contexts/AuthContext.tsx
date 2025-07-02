'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getCurrentUser, getUserRole } from '../lib/supabase';
import { User } from '../types';
import { Skeleton } from '@/components/ui/skeleton';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAdmin: false,
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const authUser = await getCurrentUser();
      
      if (!authUser) {
        setUser(null);
        setIsAdmin(false);
        return;
      }
      
      const role = await getUserRole();
      console.log('User role from database:', role);
      
      setUser({
        id: authUser.id,
        email: authUser.email || '',
        role: role as 'student' | 'admin',
      });
      
      setIsAdmin(role === 'admin');
      console.log('Is admin set to:', role === 'admin', 'for user:', authUser.email);
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only try to refresh user if we're not in a development environment with missing credentials
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      refreshUser();

      // Set up auth state change listener
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          refreshUser();
        } else {
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
        }
      });

      return () => {
        data.subscription.unsubscribe();
      };
    } else {
      // If we don't have Supabase credentials, just set loading to false
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-4 p-6">
          <Skeleton className="h-8 w-3/4 rounded-md" />
          <Skeleton className="h-32 w-full rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <Skeleton className="h-4 w-4/6 rounded-md" />
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
