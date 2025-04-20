
import { supabase } from '@/lib/supabaseClient';

// Check if the bucket exists and create it if it doesn't
export async function ensureBucketExists(bucketName: string): Promise<void> {
  // Check if bucket exists
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Error checking buckets:', listError);
    throw listError;
  }
  
  // If bucket doesn't exist, create it
  const bucketExists = buckets.some(bucket => bucket.name === bucketName);
  if (!bucketExists) {
    const { error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true, // Make it publicly accessible
      fileSizeLimit: 5242880, // 5MB limit
    });
    
    if (createError) {
      console.error('Error creating bucket:', createError);
      throw createError;
    }
    console.log(`Created bucket: ${bucketName}`);
  }
}

// Set appropriate bucket policies if needed
export async function setBucketPolicy(bucketName: string): Promise<void> {
  try {
    await supabase.storage.from(bucketName).setPublic(); 
    console.log(`Set public policy for bucket: ${bucketName}`);
  } catch (error) {
    console.error('Error setting bucket policy:', error);
    // Policy might already be set, so we don't throw here
  }
}
