
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(imageUri: string, userId: string) {
  try {
    // Fetch the image as a blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Generate a unique filename
    const fileExt = imageUri.split('.').pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('apartment-photos')
      .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('apartment-photos')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Unexpected error in uploadImage:', error);
    throw error;
  }
}
