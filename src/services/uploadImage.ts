
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { ensureBucketExists, setBucketPolicy } from './supabaseStorage';

const BUCKET_NAME = 'apartment-photos';

export async function uploadImage(imageUri: string, userId: string) {
  try {
    console.log('Starting image upload process');
    
    // Ensure the bucket exists before uploading
    await ensureBucketExists(BUCKET_NAME);
    
    // For data URIs (from file inputs), we need to handle them differently
    let blob: Blob;
    
    if (imageUri.startsWith('data:')) {
      // Handle data URI (from file input)
      console.log('Handling data URI');
      const base64Data = imageUri.split(',')[1];
      const mimeType = imageUri.split(';')[0].split(':')[1];
      blob = await fetch(`data:${mimeType};base64,${base64Data}`).then(res => res.blob());
    } else {
      // Handle URL (from image picker or other sources)
      console.log('Handling image URL');
      const response = await fetch(imageUri);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      blob = await response.blob();
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
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    console.log('Public URL:', publicUrl);
    
    return publicUrl;
  } catch (error) {
    console.error('Unexpected error in uploadImage:', error);
    throw error;
  }
}
