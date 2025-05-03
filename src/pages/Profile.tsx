import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Loader2, Camera, DollarSign, User, Home, LogOut, PlusCircle, X, ImagePlus } from 'lucide-react';
import NavBar from '@/components/NavBar';
import { useIsMobile } from '@/hooks/use-mobile';
import PhotoUpload from '@/components/PhotoUpload';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { uploadImage } from '@/services/uploadImage';
import { v4 as uuidv4 } from 'uuid';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@radix-ui/react-select';

const preferenceOptions = [
  "Non-smoker", 
  "Pet friendly", 
  "Clean", 
  "Quiet", 
  "Social", 
  "Early riser", 
  "Night owl", 
  "Student", 
  "Professional",
  "Vegan/Vegetarian",
  "LGBTQ+ friendly"
];

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  const [budgetRange, setBudgetRange] = useState([1000, 3000]);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [moveInDate, setMoveInDate] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [apartmentPhotos, setApartmentPhotos] = useState<string[]>([]);
  const isMobile = useIsMobile();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<string>("Room Photo");

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleAddPreference = (preference: string) => {
    if (!preferences.includes(preference)) {
      setPreferences([...preferences, preference]);
    }
  };
  
  const handleRemovePreference = (preference: string) => {
    setPreferences(preferences.filter(p => p !== preference));
  };
  
  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateProfile({
        name,
        // In a real app, you would update more profile fields
      });
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem updating your profile.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePhotosChange = (photos: string[]) => {
    setApartmentPhotos(photos);
    toast({
      title: "Photos updated",
      description: "Your apartment photos have been updated.",
    });
  };

  const handleImagePick = () => {
    // Mock image picking - in a real app, use react-native-image-picker
    const mockImageUri = 'https://example.com/mock-image.jpg';
    setSelectedImage(mockImageUri);
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No image selected'
      });
      return;
    }

    if (!user || !user.id) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to upload photos'
      });
      return;
    }

    try {
      // Pass the user ID and room type to the upload function
      const publicUrl = await uploadImage(selectedImage, user.id, selectedRoomType);
      
      toast({
        title: 'Image Uploaded',
        description: 'Your apartment photo has been uploaded successfully'
      });

      // Clear the selected image after upload
      setSelectedImage(null);
    } catch (error) {
      // Error is already handled in uploadImage function
      console.error('Upload error in component:', error);
    }
  };
  
  return (
    <div className="min-h-screen pb-16 md:pb-0 overflow-x-hidden">
      <header className="bg-gradient-to-br from-primary to-secondary p-4 md:p-6 text-white">
        <div className="flex flex-col items-center justify-center">
          <div className="relative mb-3 md:mb-4">
            <Avatar className="h-16 w-16 md:h-20 md:w-20 border-4 border-white">
              <AvatarImage src="/profile-placeholder.jpg" alt={name} />
              <AvatarFallback className="text-base md:text-lg bg-secondary">
                {name ? getInitials(name) : <User />}
              </AvatarFallback>
            </Avatar>
            <Button 
              size="icon" 
              variant="secondary" 
              className="absolute -bottom-1.5 -right-1.5 md:-bottom-2 md:-right-2 rounded-full h-6 w-6 md:h-8 md:w-8"
            >
              <Camera className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>
          <h1 className="text-lg md:text-xl font-bold">{name || 'Your Profile'}</h1>
          <p className="text-xs md:text-sm opacity-90">{user?.email}</p>
        </div>
      </header>
      
      <main className="p-3 md:p-4 max-w-screen-lg mx-auto overflow-y-auto">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="apartment">My Apartment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="space-y-5 md:space-y-6">
            <div>
              <h2 className="text-base md:text-lg font-medium mb-3 md:mb-4">Personal Information</h2>
              <div className="space-y-3 md:space-y-4">
                <div className="space-y-1.5 md:space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Your name"
                    className="text-sm md:text-base"
                  />
                </div>
                
                <div className="space-y-1.5 md:space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    placeholder="Tell potential roommates about yourself..."
                    className="resize-none text-sm md:text-base"
                    rows={4}
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-base md:text-lg font-medium mb-3 md:mb-4">Roommate Preferences</h2>
              <div className="space-y-3 md:space-y-4">
                <div className="space-y-1.5 md:space-y-2">
                  <Label>Monthly Budget Range</Label>
                  <div className="pt-5 md:pt-6 px-2">
                    <Slider 
                      value={budgetRange} 
                      min={500} 
                      max={5000} 
                      step={100}
                      onValueChange={setBudgetRange}
                    />
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <div className="flex items-center">
                      <span className="mr-0.5 md:mr-1">₹</span>
                      <span>{budgetRange[0]}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-0.5 md:mr-1">₹</span>
                      <span>{budgetRange[1]}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1.5 md:space-y-2">
                  <Label htmlFor="moveInDate">Preferred Move-in Date</Label>
                  <Input 
                    id="moveInDate" 
                    type="date" 
                    value={moveInDate} 
                    onChange={(e) => setMoveInDate(e.target.value)} 
                    className="text-sm md:text-base"
                  />
                </div>
                
                <div className="space-y-1.5 md:space-y-2">
                  <Label>Roommate Preferences</Label>
                  <div className="flex flex-wrap gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                    {preferences.map(preference => (
                      <Badge key={preference} className="flex items-center gap-1 pl-1.5 md:pl-2 text-[10px] md:text-xs">
                        {preference}
                        <button 
                          onClick={() => handleRemovePreference(preference)}
                          className="ml-1 hover:bg-primary-foreground rounded-full"
                        >
                          <X className="h-2.5 w-2.5 md:h-3 md:w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {preferenceOptions
                      .filter(option => !preferences.includes(option))
                      .map(option => (
                        <Badge 
                          key={option} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-secondary/10 text-[10px] md:text-xs"
                          onClick={() => handleAddPreference(option)}
                        >
                          <PlusCircle className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                          {option}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-base md:text-lg font-medium mb-3 md:mb-4">Settings</h2>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Notifications</Label>
                    <p className="text-[10px] md:text-sm text-muted-foreground">
                      Receive notifications for new matches and messages
                    </p>
                  </div>
                  <Switch 
                    id="notifications" 
                    checked={notifications} 
                    onCheckedChange={setNotifications} 
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="apartment" className="space-y-5 md:space-y-6">
            <div>
              <h2 className="text-base md:text-lg font-medium mb-3 md:mb-4">
                <div className="flex items-center">
                  <ImagePlus className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Apartment Photos
                </div>
              </h2>
              <PhotoUpload
                userId={user?.id}
                onPhotosChange={handlePhotosChange}
                maxPhotos={8}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-3 md:space-y-4">
              <h2 className="text-base md:text-lg font-medium mb-1 md:mb-2">Privacy Settings</h2>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="photo-privacy">Photo Privacy</Label>
                  <p className="text-[10px] md:text-sm text-muted-foreground">
                    Control who can see your apartment photos
                  </p>
                </div>
                <select
                  id="photo-privacy"
                  className="p-2 border rounded text-xs md:text-sm"
                  defaultValue="matches"
                >
                  <option value="public">Visible to everyone</option>
                  <option value="matches">Visible to matches only</option>
                  <option value="private">Private (only visible to me)</option>
                </select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      
        <div className="space-y-4">
          <Button onClick={handleImagePick} variant="outline">
            <ImagePlus className="mr-2 h-4 w-4" />
            Pick Image
          </Button>
          
          {selectedImage && (
            <div className="mt-4">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="max-w-full h-auto rounded-md"
              />
              <div className="mt-2 space-y-2">
                <Select 
                  value={selectedRoomType} 
                  onValueChange={setSelectedRoomType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Living Room">Living Room</SelectItem>
                    <SelectItem value="Bedroom">Bedroom</SelectItem>
                    <SelectItem value="Kitchen">Kitchen</SelectItem>
                    <SelectItem value="Bathroom">Bathroom</SelectItem>
                    <SelectItem value="Balcony">Balcony</SelectItem>
                    <SelectItem value="PG Common Area">PG Common Area</SelectItem>
                    <SelectItem value="Study Area">Study Area</SelectItem>
                    <SelectItem value="Exterior View">Exterior View</SelectItem>
                    <SelectItem value="Hostel Room">Hostel Room</SelectItem>
                    <SelectItem value="Room Photo">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleImageUpload} 
                  className="w-full"
                >
                  Upload Image
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-2 md:gap-3 pt-3 md:pt-4 mt-4">
          <Button 
            onClick={handleSaveProfile}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-9 md:h-10 text-sm md:text-base"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Home className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                Save Profile
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={logout}
            className="h-9 md:h-10 text-sm md:text-base"
          >
            <LogOut className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
            Logout
          </Button>
        </div>
      </main>
      
      <NavBar />
    </div>
  );
};

export default Profile;
