
import { createClient } from '@supabase/supabase-js';
import { toast } from '../hooks/use-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Authentication error",
        description: error.message,
        variant: "destructive",
      });
      return { user: null, error };
    }

    return { user: data.user, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    toast({
      title: "Authentication failed",
      description: "An unexpected error occurred during sign in",
      variant: "destructive",
    });
    return { user: null, error };
  }
}

export async function signUp(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'student', // Default role
        },
      },
    });

    if (error) {
      toast({
        title: "Registration error",
        description: error.message,
        variant: "destructive",
      });
      return { user: null, error };
    }

    toast({
      title: "Registration successful",
      description: "Please check your email for verification",
    });
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    toast({
      title: "Registration failed",
      description: "An unexpected error occurred during sign up",
      variant: "destructive",
    });
    return { user: null, error };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Sign out error",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    toast({
      title: "Sign out failed",
      description: "An unexpected error occurred during sign out",
      variant: "destructive",
    });
    return { error };
  }
}

export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Get current user error:', error);
      return null;
    }
    
    return data?.user || null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export async function getUserRole() {
  const user = await getCurrentUser();
  if (!user) return null;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Get user role error:', error);
      return 'student'; // Default to student on error
    }
    
    return data?.role || 'student';
  } catch (error) {
    console.error('Get user role error:', error);
    return 'student'; // Default to student on error
  }
}
