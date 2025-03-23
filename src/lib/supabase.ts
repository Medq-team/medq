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

export async function signInWithGoogle() {
  try {
    console.log('Attempting Google sign-in');
    
    // Get the current site URL to use for redirects
    const redirectTo = `${window.location.origin}/dashboard`;
    console.log('Redirect URL:', redirectTo);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });

    if (error) {
      console.error('Google authentication error:', error);
      toast({
        title: "Google authentication error",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Google sign in error:', error);
    toast({
      title: "Google authentication failed",
      description: "An unexpected error occurred during Google sign in",
      variant: "destructive",
    });
    return { data: null, error };
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

export async function resetPassword(email: string) {
  try {
    // Define the full URL for password reset, ensuring it's correctly formatted
    const redirectTo = `${window.location.origin}/auth?reset=true`;
    console.log('Reset password redirect URL:', redirectTo);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo,
    });

    if (error) {
      console.error('Reset password error:', error);
      toast({
        title: "Reset password error",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    toast({
      title: "Password reset email sent",
      description: "Please check your email for password reset instructions",
    });
    return { error: null };
  } catch (error) {
    console.error('Reset password error:', error);
    toast({
      title: "Reset password failed",
      description: "An unexpected error occurred during password reset",
      variant: "destructive",
    });
    return { error };
  }
}

export async function updatePassword(newPassword: string) {
  try {
    console.log('Updating password');
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('Update password error:', error);
      toast({
        title: "Update password error",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    toast({
      title: "Password updated",
      description: "Your password has been updated successfully",
    });
    return { error: null };
  } catch (error) {
    console.error('Update password error:', error);
    toast({
      title: "Update password failed",
      description: "An unexpected error occurred during password update",
      variant: "destructive",
    });
    return { error };
  }
}

export async function getUserRole() {
  const user = await getCurrentUser();
  if (!user) {
    console.log('No user found, returning null role');
    return null;
  }
  
  try {
    console.log('Fetching role for user ID:', user.id);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Get user role error:', error);
      
      // Check if the error is because no rows were found
      if (error.code === 'PGRST116') {
        console.log('No profile found for user, creating one with default role');
        
        // Create a profile for this user with default student role
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            { id: user.id, email: user.email, role: 'student' }
          ]);
          
        if (insertError) {
          console.error('Error creating profile:', insertError);
        } else {
          console.log('Created new profile with student role');
        }
        
        return 'student';
      }
      
      return 'student'; // Default to student on error
    }
    
    console.log('Retrieved user role:', data?.role);
    return data?.role || 'student';
  } catch (error) {
    console.error('Get user role error:', error);
    return 'student'; // Default to student on error
  }
}

export { fetchReports, updateReportStatus } from './lib/supabase/reports';
