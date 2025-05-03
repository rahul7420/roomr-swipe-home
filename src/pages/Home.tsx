
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Building, Users, MessageSquare, Plus, Star, Image } from 'lucide-react';
import NavBar from '@/components/NavBar';
import { Apartment } from '@/components/ApartmentCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';

// Updated mock data for Indian student apartments
const mockApartments: Apartment[] = [
  {
    id: "1",
    title: "Modern PG in Koramangala",
    location: "8th Block",
    city: "Bengaluru",
    price: 15000,
    bedrooms: 1,
    bathrooms: 1,
    size: 250,
    amenities: ["Wifi", "Mess", "Furnished"],
    images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80"],
    description: "Well-maintained PG with quality furniture, high-speed internet, and delicious mess food included."
  },
  {
    id: "2",
    title: "Student Hostel near Campus",
    location: "Yelahanka",
    city: "Bengaluru",
    price: 8000,
    bedrooms: 1,
    bathrooms: 1,
    size: 150,
    amenities: ["Wifi", "Laundry", "Mess"],
    images: ["https://images.unsplash.com/photo-1626885930974-1cf561b13b27?auto=format&fit=crop&w=800&q=80"],
    description: "Perfect hostel for students, just 10 minutes from college campus. All utilities included."
  },
  {
    id: "3",
    title: "2BHK Apartment for Sharing",
    location: "HSR Layout",
    city: "Bengaluru",
    price: 12000,
    bedrooms: 2,
    bathrooms: 2,
    size: 800,
    amenities: ["Wifi", "AC", "Gym", "Security"],
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"],
    description: "Fully furnished 2BHK flat ideal for sharing. Society has gym, security and backup power."
  }
];

interface Match {
  id: string;
  user: {
    name: string;
    image: string;
  };
  apartment: Apartment;
  timestamp: string;
  unreadMessages: number;
}

const mockMatches: Match[] = [
  {
    id: "1",
    user: {
      name: "Arjun Kumar",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    apartment: mockApartments[0],
    timestamp: "2 hours ago",
    unreadMessages: 3
  },
  {
    id: "2",
    user: {
      name: "Priya Singh",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    apartment: mockApartments[1],
    timestamp: "1 day ago",
    unreadMessages: 0
  }
];

interface ApartmentPhoto {
  id: string;
  photo_url: string;
  user_id: string;
  created_at: string;
  room_type?: string | null;
}

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Apartment[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [photos, setPhotos] = useState<ApartmentPhoto[]>([]);
  const [photosLoading, setPhotosLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setFavorites(mockApartments);
      setMatches(mockMatches);
      setLoading(false);
    }, 1500);
  }, []);
  
  useEffect(() => {
    const fetchUserPhotos = async () => {
      if (!user?.id) return;
      
      try {
        setPhotosLoading(true);
        const { data, error } = await supabase
          .from('apartment_photos')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching apartment photos:', error);
          return;
        }
        
        setPhotos(data || []);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setPhotosLoading(false);
      }
    };

    if (user?.id) {
      fetchUserPhotos();
    }
  }, [user?.id]);
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-16 md:pb-0 overflow-x-hidden">
      <div className="bg-gradient-to-br from-primary to-secondary p-4 md:p-6 pt-8 md:pt-10">
        <div className="max-w-screen-lg mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">
            Welcome back{user?.name ? `, ${user.name}` : ''}
          </h1>
          <p className="text-sm md:text-base text-white/90 mb-4 md:mb-6">
            Find your perfect PG and roommate match.
          </p>
          
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-3 md:p-4 flex items-center">
                <div className="bg-white/20 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-2 md:mr-3">
                  <Building className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-white/70">Saved Apartments</p>
                  <p className="text-lg md:text-xl font-bold text-white">{favorites.length}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-3 md:p-4 flex items-center">
                <div className="bg-white/20 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-2 md:mr-3">
                  <Users className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-white/70">Matches</p>
                  <p className="text-lg md:text-xl font-bold text-white">{matches.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Button 
            variant="secondary" 
            className="w-full mt-4 md:mt-6"
            onClick={() => navigate('/feed')}
          >
            <Plus className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
            Discover Apartments
          </Button>
        </div>
      </div>
      
      {/* My Apartment Photos Section */}
      <div className="px-3 md:px-4 pt-4 max-w-screen-lg mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg md:text-xl font-semibold">My Apartment Photos</h2>
        </div>
        
        {photosLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : photos.length > 0 ? (
          <Carousel className="w-full mb-6">
            <CarouselContent>
              {photos.map((photo) => (
                <CarouselItem key={photo.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0 relative">
                        <img 
                          src={photo.photo_url} 
                          alt={photo.room_type || "Apartment"} 
                          className="w-full h-[200px] object-cover"
                        />
                        {photo.room_type && (
                          <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/70 to-transparent">
                            <p className="text-white text-sm font-medium">{photo.room_type}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-2">
              <CarouselPrevious className="relative static translate-y-0 left-0 mr-2" />
              <CarouselNext className="relative static translate-y-0 right-0" />
            </div>
          </Carousel>
        ) : (
          <Card className="mb-6">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <Image className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No apartment photos uploaded yet.</p>
              <Button 
                variant="outline" 
                className="mt-3"
                onClick={() => navigate('/profile')}
              >
                Upload Photos
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="p-3 md:p-4 max-w-screen-lg mx-auto">
        <Tabs defaultValue="matches" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-3 md:mb-4">
            <TabsTrigger value="matches" className="data-[state=active]:bg-primary data-[state=active]:text-white text-xs md:text-sm py-1.5 md:py-2">
              <Users className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
              Matches
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-primary data-[state=active]:text-white text-xs md:text-sm py-1.5 md:py-2">
              <Star className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
              Favorites
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="matches" className="space-y-4">
            {matches.length > 0 ? (
              <ScrollArea className="h-[calc(100vh-300px)] md:h-[calc(100vh-280px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matches.map(match => (
                    <Card key={match.id} className="mb-4">
                      <CardContent className="p-3 md:p-4">
                        <div className="flex items-center">
                          <div className="relative mr-2 md:mr-3">
                            <img 
                              src={match.user.image} 
                              alt={match.user.name} 
                              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                            />
                            {match.unreadMessages > 0 && (
                              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] md:text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                                {match.unreadMessages}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm md:text-base font-medium">{match.user.name}</h3>
                            <p className="text-[10px] md:text-xs text-muted-foreground">
                              Matched for: {match.apartment.title}
                            </p>
                          </div>
                          <p className="text-[10px] md:text-xs text-muted-foreground">{match.timestamp}</p>
                        </div>

                        <div className="mt-2 md:mt-3 flex">
                          <div className="w-1/3">
                            <img 
                              src={match.apartment.images[0]} 
                              alt={match.apartment.title} 
                              className="w-full h-16 md:h-20 object-cover rounded-l-md"
                            />
                          </div>
                          <div className="w-2/3 bg-muted p-2 rounded-r-md">
                            <h4 className="text-xs md:text-sm font-medium line-clamp-1">{match.apartment.title}</h4>
                            <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-1">
                              {match.apartment.location}, {match.apartment.city}
                            </p>
                            <p className="text-[10px] md:text-xs font-medium">
                              ₹{match.apartment.price.toLocaleString('en-IN')}/month
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-2 md:mt-3 grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" className="text-[10px] md:text-xs h-7 md:h-8">
                            <Building className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                            View Apartment
                          </Button>
                          <Button size="sm" className="text-[10px] md:text-xs h-7 md:h-8">
                            <MessageSquare className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                            Message
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center">
                <Users className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-medium mb-1 md:mb-2">No matches yet</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6 max-w-xs">
                  Start discovering and liking PGs to get matched with potential roommates.
                </p>
                <Button onClick={() => navigate('/feed')}>
                  Find PGs
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="favorites" className="space-y-4">
            {favorites.length > 0 ? (
              <ScrollArea className="h-[calc(100vh-300px)] md:h-[calc(100vh-280px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map(apartment => (
                    <Card key={apartment.id} className="mb-4">
                      <CardContent className="p-3 md:p-4">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-1/3 mb-2 md:mb-0">
                            <img 
                              src={apartment.images[0]} 
                              alt={apartment.title} 
                              className="w-full h-32 md:h-24 object-cover rounded-md md:rounded-l-md md:rounded-r-none"
                            />
                          </div>
                          <div className="w-full md:w-2/3 md:pl-3">
                            <h3 className="font-medium text-sm md:text-base line-clamp-1">{apartment.title}</h3>
                            <p className="text-[10px] md:text-xs text-muted-foreground mb-1">
                              {apartment.location}, {apartment.city}
                            </p>
                            <p className="text-xs md:text-sm font-bold mb-1">
                              ₹{apartment.price.toLocaleString('en-IN')}/month
                            </p>
                            <div className="flex text-[10px] md:text-xs text-muted-foreground">
                              <span className="mr-2">{apartment.bedrooms} {apartment.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
                              <span className="mr-2">{apartment.bathrooms} {apartment.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
                              <span>{apartment.size} sq ft</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center">
                <Star className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-medium mb-1 md:mb-2">No saved PGs</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6 max-w-xs">
                  You haven't saved any PGs yet. Start swiping to find your perfect home.
                </p>
                <Button onClick={() => navigate('/feed')}>
                  Discover PGs
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <NavBar />
    </div>
  );
};

export default Home;
