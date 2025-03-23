
import { supabase } from './client';
import { getCurrentUser } from './auth';

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
