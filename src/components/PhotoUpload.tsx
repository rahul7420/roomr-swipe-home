
import { useState, useRef } from 'react';
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';
import { uploadImage } from '@/services/uploadImage';

interface PhotoUploadProps {
  existingPhotos?: string[];
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

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  existingPhotos = [],
  onPhotosChange,
  maxPhotos = 10,
  disabled = false,
}) => {
  const [photoUploads, setPhotoUploads] = useState<PhotoPreview[]>([]);
  const [existingPhotosList, setExistingPhotosList] = useState<string[]>(existingPhotos);
  const [isUploading, setIsUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Room type options - updated for Indian context
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
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    const totalPhotos = photoUploads.length + existingPhotosList.length;
    const remainingSlots = maxPhotos - totalPhotos;
    
    if (remainingSlots <= 0) {
      toast({
        variant: "destructive",
        title: "Maximum photos reached",
        description: `You can upload a maximum of ${maxPhotos} photos.`,
      });
      return;
    }
    
    // Convert FileList to array and limit to remaining slots
    const filesToAdd = Array.from(selectedFiles).slice(0, remainingSlots);
    
    // Add new photos to the photoUploads array
    const newPhotoUploads = filesToAdd.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      room: undefined,
    }));
    
    setPhotoUploads(prev => [...prev, ...newPhotoUploads]);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleRemovePhoto = (id: string) => {
    setPhotoUploads(prev => {
      const updatedUploads = prev.filter(photo => photo.id !== id);
      return updatedUploads;
    });
  };
  
  const handleRemoveExistingPhoto = (url: string) => {
    setExistingPhotosList(prev => {
      const updatedPhotos = prev.filter(photo => photo !== url);
      return updatedPhotos;
    });
    
    // If onPhotosChange is provided, call it with the updated photos
    if (onPhotosChange) {
      onPhotosChange(existingPhotosList.filter(photo => photo !== url));
    }
  };
  
  const handleRoomTypeChange = (id: string, roomType: string) => {
    setPhotoUploads(prev => 
      prev.map(photo => 
        photo.id === id ? { ...photo, room: roomType } : photo
      )
    );
  };
  
  const handleUploadPhotos = async () => {
    if (!photoUploads.length) return;
    
    setIsUploading(true);
    
    try {
      // Get the user ID from localStorage or your auth context
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || 'anonymous';
      
      // Upload each photo to Supabase storage
      const uploadPromises = photoUploads.map(async (photo) => {
        try {
          // Convert File to data URL for our upload function
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(photo.file);
          });
          
          // Upload to Supabase
          const publicUrl = await uploadImage(dataUrl, userId);
          return publicUrl;
        } catch (error) {
          console.error(`Error uploading ${photo.name}:`, error);
          toast({
            variant: "destructive",
            title: "Upload failed",
            description: `Failed to upload ${photo.name}.`,
          });
          return null;
        }
      });
      
      const uploadedUrls = (await Promise.all(uploadPromises)).filter(Boolean) as string[];
      
      // Combine existing and new photos
      const allPhotos = [...existingPhotosList, ...uploadedUrls];
      
      // Call onPhotosChange with the updated photo list
      if (onPhotosChange) {
        onPhotosChange(allPhotos);
      }
      
      toast({
        title: `${uploadedUrls.length} ${uploadedUrls.length === 1 ? 'Photo' : 'Photos'} uploaded`,
        description: "Your apartment photos have been uploaded successfully.",
      });
      
      setPhotoUploads([]);
      setExistingPhotosList(allPhotos);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error in handleUploadPhotos:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was a problem uploading your photos.",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const totalPhotos = photoUploads.length + existingPhotosList.length;
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
      
      {/* Display existing photos */}
      {existingPhotosList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {existingPhotosList.map((photoUrl, index) => (
            <div key={`existing-${index}`} className="relative aspect-square group rounded-md overflow-hidden border">
              <img 
                src={photoUrl} 
                alt={`Apartment photo ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button 
                  variant="destructive" 
                  size="icon"
                  className="h-8 w-8" 
                  onClick={() => handleRemoveExistingPhoto(photoUrl)}
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
