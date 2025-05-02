
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';

const BUCKET_NAME = 'apartment-photos';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// We now need supabase from /integrations/supabase/client for DB actions
import { supabase as supabaseClient } from '@/integrations/supabase/client';

export async function uploadImage(imageUri: string, userId: string | undefined): Promise<string | null> {
  try {
    console.log('Starting image upload process');
    
    // Validate userId is a valid UUID
    if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId)) {
      throw new Error('Invalid or missing user ID. Please make sure you are properly logged in.');
    }

    let blob: Blob;

    if (imageUri.startsWith('data:')) {
      const base64Data = imageUri.split(',')[1];
      const mimeType = imageUri.split(';')[0].split(':')[1];

      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(mimeType)) {
        throw new Error(`Unsupported file type: ${mimeType}. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
      }

      blob = await fetch(`data:${mimeType};base64,${base64Data}`).then(res => res.blob());

      // Validate file size
      if (blob.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
      }
    } else {
      const response = await fetch(imageUri);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }

      blob = await response.blob();

      // Validate file type and size for URL-based uploads
      if (!ALLOWED_FILE_TYPES.includes(blob.type)) {
        throw new Error(`Unsupported file type: ${blob.type}. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
      }

      if (blob.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
      }
    }

    // Generate a unique filename
    const fileExt = blob.type.split('/')[1] || 'jpg';
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;

    console.log(`Uploading to ${BUCKET_NAME}/${fileName}`);

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: false,
        contentType: blob.type
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    console.log('Upload successful, getting public URL');

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    // Insert a row into apartment_photos table with userId + publicUrl
    if (publicUrl) {
      const { error: dbError } = await supabaseClient
        .from('apartment_photos')
        .insert({
          user_id: userId,
          photo_url: publicUrl,
        });

      if (dbError) {
        console.error("Failed to insert photo into DB:", dbError.message);
        // Delete storage object if db write fails for consistency (optional)
        // await supabase.storage.from(BUCKET_NAME).remove([fileName]);
        throw new Error("Uploaded file but failed to save to database: " + dbError.message);
      }
    }

    console.log('Public URL:', publicUrl);

    return publicUrl;
  } catch (error) {
    console.error('Unexpected error in uploadImage:', error);

    if (error instanceof Error) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message
      });
    }

    throw error;
  }
}
