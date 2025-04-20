
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
    // The setPublic() method doesn't exist in the current Supabase SDK version
    // Instead, we'll use the bucket creation options to make it public
    // This function now just logs that the bucket is public
    console.log(`Bucket ${bucketName} is already set to public via its creation options`);
    
    // You can also update the bucket if needed with:
    // await supabase.storage.updateBucket(bucketName, {
    //   public: true
    // });
  } catch (error) {
    console.error('Error setting bucket policy:', error);
    // Policy might already be set, so we don't throw here
  }
}
