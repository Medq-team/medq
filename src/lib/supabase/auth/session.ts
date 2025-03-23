
import { supabase } from '../client';

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
