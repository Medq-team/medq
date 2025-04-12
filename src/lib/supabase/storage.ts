
import { supabase } from './client';

// Function to create the storage bucket if it doesn't exist
export async function ensureQuestionMediaBucket() {
  try {
    // Check if the bucket exists
    const { data: buckets, error: fetchError } = await supabase
      .storage
      .listBuckets();
      
    if (fetchError) throw fetchError;
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'question-media');
    
    if (!bucketExists) {
      // Create the bucket
      const { error: createError } = await supabase
        .storage
        .createBucket('question-media', {
          public: true, // Make it public so files can be accessed without authentication
          fileSizeLimit: 5 * 1024 * 1024, // 5MB limit
        });
        
      if (createError) throw createError;
      
      console.log('Created question-media bucket');
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring question media bucket exists:', error);
    return false;
  }
}

// Call this function when the app starts
ensureQuestionMediaBucket();
