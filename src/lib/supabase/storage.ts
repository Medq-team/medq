
import { supabase } from './client';

// Function to check if the question media bucket exists and is accessible
export async function ensureQuestionMediaBucket() {
  try {
    // Verify we can access the bucket
    const { data, error } = await supabase
      .storage
      .from('question-media')
      .list('', { limit: 1 });
      
    if (error) {
      console.error('Error accessing question media bucket:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring question media bucket exists:', error);
    return false;
  }
}
