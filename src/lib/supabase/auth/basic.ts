
import { supabase } from '../client';
import { toast } from '../../../hooks/use-toast';

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
