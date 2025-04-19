import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ApartmentCard, { Apartment } from '@/components/ApartmentCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Trash2 } from 'lucide-react';
import NavBar from '@/components/NavBar';

const Favorites = () => {
  const { user } = useAuth();
  const [savedApartments, setSavedApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mock data loading - would be replaced with Supabase query
  useEffect(() => {
    const fetchSavedApartments = () => {
      setTimeout(() => {
        setSavedApartments([
          {
            id: "1",
            title: "Modern Downtown Loft",
            location: "123 Main St",
            city: "San Francisco",
            price: 208500, // Converted from $2800
            bedrooms: 1,
            bathrooms: 1,
            size: 750,
            amenities: ["Wifi", "Gym", "Furnished", "Pet Friendly"],
            images: [
              "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Beautiful downtown loft with high ceilings, exposed brick, and amazing city views."
          },
          {
            id: "3",
            title: "Luxury 2BR with Balcony",
            location: "789 Ocean Ave",
            city: "Santa Monica",
            price: 262500, // Converted from $3500
            bedrooms: 2,
            bathrooms: 2,
            size: 1100,
            amenities: ["Wifi", "Pool", "Gym", "Parking", "Balcony"],
            images: [
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=800&q=80"
            ],
            description: "Stunning 2-bedroom apartment with ocean views from a private balcony."
          }
        ]);
        setLoading(false);
      }, 1500);
    };
    
    fetchSavedApartments();
  }, []);

  const removeFromFavorites = (apartmentId: string) => {
    // In a real app, this would remove from Supabase
    setSavedApartments(prev => prev.filter(apt => apt.id !== apartmentId));
  };
  
  return (
    <div className="min-h-screen pb-16">
      <header className="bg-white border-b shadow-sm p-4 dark:bg-gray-900 dark:border-gray-800">
        <div className="max-w-screen-lg mx-auto">
          <h1 className="text-2xl font-bold">Saved Apartments</h1>
        </div>
      </header>
      
      <main className="p-4 max-w-screen-lg mx-auto">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Saved</TabsTrigger>
            <TabsTrigger value="pending">Pending Matches</TabsTrigger>
            <TabsTrigger value="matched">Matched</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-md" />
                ))}
              </div>
            ) : savedApartments.length > 0 ? (
              <div className="space-y-6">
                {savedApartments.map((apartment) => (
                  <div key={apartment.id} className="relative">
                    <Button 
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 z-10 opacity-90"
                      onClick={() => removeFromFavorites(apartment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <ApartmentCard apartment={apartment} />
                    <p className="text-lg font-semibold">
                      {apartment.price.toLocaleString('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      })}/month
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No saved apartments</h3>
                <p className="text-muted-foreground mb-4">You haven't saved any apartments yet.</p>
                <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  Discover Apartments
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pending">
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No pending matches</h3>
              <p className="text-muted-foreground">
                When you like an apartment, it will appear here until you match with a roommate.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="matched">
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No matched apartments</h3>
              <p className="text-muted-foreground">
                When you and another user both like the same apartment, it will appear here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <NavBar />
    </div>
  );
};

export default Favorites;
