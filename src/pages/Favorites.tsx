
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ApartmentCard, { Apartment } from '@/components/ApartmentCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Trash2 } from 'lucide-react';
import NavBar from '@/components/NavBar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

type SavedApartmentRow = {
  id: string;
  created_at: string | null;
  apartment_id: string;
};

const Favorites = () => {
  const { user } = useAuth();
  const [savedApartments, setSavedApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Only fetch if user exists
    if (!user) return;

    const fetchSavedApartments = async () => {
      setLoading(true);
      setError(null);

      // 1. Get user's saved_apartments (just apartment IDs)
      const { data: savedRows, error: savedError } = await supabase
        .from('saved_apartments')
        .select('apartment_id')
        .eq('user_id', user.id);

      if (savedError) {
        setError('Could not load saved apartments.');
        setSavedApartments([]);
        setLoading(false);
        return;
      }

      // 2. If there are no saved, just finish
      if (!savedRows || savedRows.length === 0) {
        setSavedApartments([]);
        setLoading(false);
        return;
      }

      // 3. For those IDs, get the Apartment details
      const apartmentIds = savedRows.map(row => row.apartment_id);
      const { data: apartmentsData, error: apartmentsError } = await supabase
        .from('apartments')
        .select('*')
        .in('id', apartmentIds);

      if (apartmentsError) {
        setError('Error loading apartments.');
        setSavedApartments([]);
      } else {
        // 4. Adapt apartments shape to ApartmentCard
        const apartments: Apartment[] = (apartmentsData ?? []).map((apt: any) => ({
          id: apt.id,
          title: apt.apartment_name ?? "Unnamed Apartment",
          location: apt.location ?? '',
          city: '', // Not in schema, so leave blank for now
          price: apt.rent ?? 0,
          bedrooms: 1, // Not available - fallback
          bathrooms: 1,
          size: 0,
          amenities: [], // Could be customized if available
          images: apt.photo_url ? [apt.photo_url] : [],
          description: '', // Not available in schema
        }));
        setSavedApartments(apartments);
      }
      setLoading(false);
    };

    fetchSavedApartments();
  }, [user]);

  const removeFromFavorites = async (apartmentId: string) => {
    if (!user) return;

    // 1. Delete from Supabase
    const { error: deleteError } = await supabase
      .from('saved_apartments')
      .delete()
      .eq('user_id', user.id)
      .eq('apartment_id', apartmentId);

    if (deleteError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not remove from favorites.",
      });
      return;
    }

    // 2. Update State
    setSavedApartments(prev => prev.filter(apt => apt.id !== apartmentId));
    toast({
      title: "Removed from favorites",
      description: "This apartment was unsaved.",
    });
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
            ) : error ? (
              <div className="text-center text-destructive">{error}</div>
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
