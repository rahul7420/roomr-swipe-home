
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  ImagePlus,
  Trash2,
  Loader2,
  Image as ImageIcon,
  X,
  Upload
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';
import { uploadImage } from '@/services/uploadImage';
// Import supabase client for DB reads and deletes
import { supabase as supabaseClient } from "@/integrations/supabase/client";

interface PhotoUploadProps {
  // Remove "existingPhotos", now fetch for the user
  userId?: string;
  onPhotosChange?: (photos: string[]) => void;
  maxPhotos?: number;
  disabled?: boolean;
}

interface PhotoPreview {
  id: string;
  file: File;
  preview: string;
  name: string;
  uploaded?: boolean;
  room?: string;
}

interface DBPhoto {
  id: string;
  photo_url: string;
  created_at: string;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  userId,
  onPhotosChange,
  maxPhotos = 10,
  disabled = false,
}) => {
  const [photoUploads, setPhotoUploads] = useState<PhotoPreview[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<DBPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const roomTypes = [
    "Living Room",
    "Bedroom",
    "Kitchen",
    "Bathroom",
    "Balcony",
    "PG Common Area",
    "Study Area",
    "Exterior View",
    "Hostel Room"
  ];

  // Fetch user's apartment photos from DB
  const fetchPhotos = async () => {
    if (!userId) return;
    const { data, error } = await supabaseClient
      .from("apartment_photos")
      .select("id, photo_url, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) {
      toast({
        variant: "destructive",
        title: "Error loading photos",
        description: error.message,
      });
      setUploadedPhotos([]);
    } else {
      setUploadedPhotos(data || []);
      if (onPhotosChange) {
        onPhotosChange(data?.map((p: DBPhoto) => p.photo_url) || []);
      }
    }
  };

  useEffect(() => {
    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // On dialog close, reset photoUploads and reload DB photos
  useEffect(() => {
    if (!dialogOpen) {
      setPhotoUploads([]);
      fetchPhotos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const totalPhotos = photoUploads.length + uploadedPhotos.length;
    const remainingSlots = maxPhotos - totalPhotos;

    if (remainingSlots <= 0) {
      toast({
        variant: "destructive",
        title: "Maximum photos reached",
        description: `You can upload a maximum of ${maxPhotos} photos.`,
      });
      return;
    }

    const filesToAdd = Array.from(selectedFiles).slice(0, remainingSlots);

    const newPhotoUploads = filesToAdd.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      room: undefined,
    }));

    setPhotoUploads(prev => [...prev, ...newPhotoUploads]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (id: string) => {
    setPhotoUploads(prev => prev.filter(photo => photo.id !== id));
  };

  // Remove a photo both from DB and storage
  const handleRemoveUploadedPhoto = async (photo: DBPhoto) => {
    if (!userId) return;
    setIsUploading(true);
    try {
      // First, delete DB row to enforce RLS
      const { error: dbErr } = await supabaseClient
        .from('apartment_photos')
        .delete()
        .eq('id', photo.id)
        .eq('user_id', userId);
      if (dbErr) throw dbErr;

      // Second, try deleting actual storage object
      // Extract storage path from URL: after /object/apartment-photos/
      const match = photo.photo_url.match(/apartment-photos\/(.+)$/);
      if (match?.[1]) {
        await supabaseClient.storage.from('apartment-photos').remove([match[1]]);
      }

      toast({ title: "Photo deleted", description: "Your photo was removed." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Delete failed", description: err.message || "Error deleting photo" });
    }
    setIsUploading(false);
    fetchPhotos();
  };

  const handleRoomTypeChange = (id: string, roomType: string) => {
    setPhotoUploads(prev =>
      prev.map(photo =>
        photo.id === id ? { ...photo, room: roomType } : photo
      )
    );
  };

  const handleUploadPhotos = async () => {
    if (!photoUploads.length || !userId) return;

    setIsUploading(true);
    let uploadedCount = 0;
    let failedCount = 0;

    for (const photo of photoUploads) {
      try {
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(photo.file);
        });

        await uploadImage(dataUrl, userId);
        uploadedCount++;
      } catch (error: any) {
        failedCount++;
        toast({
          variant: "destructive",
          title: `Failed: ${photo.name}`,
          description: error?.message || "Photo upload failed",
        });
      }
    }

    if (uploadedCount > 0) {
      toast({
        title: `${uploadedCount} ${uploadedCount === 1 ? 'Photo' : 'Photos'} uploaded`,
        description: "Your apartment photo(s) have been uploaded successfully.",
      });
    }

    setIsUploading(false);
    setPhotoUploads([]);
    setDialogOpen(false);
    fetchPhotos();
  };

  const totalPhotos = photoUploads.length + uploadedPhotos.length;
  const photosRemaining = maxPhotos - totalPhotos;

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap items-center justify-between mb-1">
        <Label className="text-sm md:text-base font-medium">Photos ({totalPhotos}/{maxPhotos})</Label>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size={isMobile ? "sm" : "default"}
              variant="outline"
              className="flex items-center gap-1"
              disabled={disabled || photosRemaining <= 0}
            >
              <ImagePlus className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} mr-1`} />
              Add Photos
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md w-[90vw] max-h-[90vh] overflow-y-auto p-4 md:p-6">
            <DialogHeader>
              <DialogTitle>Upload Photos</DialogTitle>
              <DialogDescription>
                Add photos of your apartment. You can upload up to {maxPhotos} photos.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photosRemaining <= 0}
                >
                  <ImagePlus className="h-4 w-4 mr-2" />
                  {photosRemaining <= 0 ? "Maximum photos reached" : "Select Photos"}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  disabled={photosRemaining <= 0}
                />
              </div>

              {photoUploads.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Photos ({photoUploads.length})</Label>
                  <ScrollArea className="h-[35vh] md:h-[40vh] rounded-md border p-2">
                    <div className="space-y-3">
                      {photoUploads.map((photo) => (
                        <div key={photo.id} className="flex items-start gap-2 pb-3 flex-col sm:flex-row">
                          <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border">
                            <img
                              src={photo.preview}
                              alt={photo.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-2 min-w-0 w-full sm:w-auto">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate max-w-[160px] sm:max-w-full">{photo.name}</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemovePhoto(photo.id)}
                                className="h-6 w-6"
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <Select
                              value={photo.room}
                              onValueChange={(value) => handleRoomTypeChange(photo.id, value)}
                            >
                              <SelectTrigger className="h-8 text-xs w-full">
                                <SelectValue placeholder="Select room type" />
                              </SelectTrigger>
                              <SelectContent>
                                {roomTypes.map((type) => (
                                  <SelectItem key={type} value={type} className="text-xs">
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              <div className="flex flex-col gap-2 mt-4">
                <Button
                  onClick={handleUploadPhotos}
                  disabled={photoUploads.length === 0 || isUploading}
                  className="w-full h-10 md:h-11"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload {photoUploads.length} {photoUploads.length === 1 ? 'Photo' : 'Photos'}
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="w-full h-10 md:h-11"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Display existing uploaded photos */}
      {uploadedPhotos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {uploadedPhotos.map((photo, index) => (
            <div key={photo.id} className="relative aspect-square group rounded-md overflow-hidden border">
              <img
                src={photo.photo_url}
                alt={`Apartment photo ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleRemoveUploadedPhoto(photo)}
                  disabled={isUploading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed rounded-md py-6 flex flex-col items-center justify-center text-muted-foreground">
          <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-sm">No photos yet</p>
          <p className="text-xs">Click "Add Photos" to upload images of your apartment</p>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
