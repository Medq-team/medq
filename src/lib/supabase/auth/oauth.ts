
import { supabase } from '../client';
import { toast } from '../../../hooks/use-toast';

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

    // If successful, the user will be redirected to the Google authentication page
    // and then back to the redirectTo URL specified above
    console.log('Google authentication flow initiated', data);
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
