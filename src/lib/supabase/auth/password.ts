
import { supabase } from '../client';
import { toast } from '../../../hooks/use-toast';

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
