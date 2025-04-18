
import { useState } from 'react';
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
import { toast } from '@/components/ui/use-toast';
import { Loader2, Camera, DollarSign, User, Home, LogOut, PlusCircle, X } from 'lucide-react';
import NavBar from '@/components/NavBar';

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
  
  return (
    <div className="min-h-screen pb-16">
      <header className="bg-gradient-to-br from-primary to-secondary p-6 text-white">
        <div className="flex flex-col items-center justify-center">
          <div className="relative mb-4">
            <Avatar className="h-20 w-20 border-4 border-white">
              <AvatarImage src="/profile-placeholder.jpg" alt={name} />
              <AvatarFallback className="text-lg bg-secondary">
                {name ? getInitials(name) : <User />}
              </AvatarFallback>
            </Avatar>
            <Button 
              size="icon" 
              variant="secondary" 
              className="absolute -bottom-2 -right-2 rounded-full h-8 w-8"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <h1 className="text-xl font-bold">{name || 'Your Profile'}</h1>
          <p className="text-sm opacity-90">{user?.email}</p>
        </div>
      </header>
      
      <main className="p-4 max-w-screen-lg mx-auto">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Your name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  placeholder="Tell potential roommates about yourself..."
                  className="resize-none"
                  rows={4}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h2 className="text-lg font-medium mb-4">Roommate Preferences</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Monthly Budget Range</Label>
                <div className="pt-6 px-2">
                  <Slider 
                    value={budgetRange} 
                    min={500} 
                    max={5000} 
                    step={100}
                    onValueChange={setBudgetRange}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" />
                    <span>{budgetRange[0]}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" />
                    <span>{budgetRange[1]}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="moveInDate">Preferred Move-in Date</Label>
                <Input 
                  id="moveInDate" 
                  type="date" 
                  value={moveInDate} 
                  onChange={(e) => setMoveInDate(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Roommate Preferences</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {preferences.map(preference => (
                    <Badge key={preference} className="flex items-center gap-1 pl-2">
                      {preference}
                      <button 
                        onClick={() => handleRemovePreference(preference)}
                        className="ml-1 hover:bg-primary-foreground rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {preferenceOptions
                    .filter(option => !preferences.includes(option))
                    .map(option => (
                      <Badge 
                        key={option} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-secondary/10"
                        onClick={() => handleAddPreference(option)}
                      >
                        <PlusCircle className="h-3 w-3 mr-1" />
                        {option}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h2 className="text-lg font-medium mb-4">Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-sm text-muted-foreground">
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
          
          <div className="flex flex-col gap-3 pt-4">
            <Button 
              onClick={handleSaveProfile}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Home className="mr-2 h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </main>
      
      <NavBar />
    </div>
  );
};

export default Profile;
