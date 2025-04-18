
import { useState, useEffect } from 'react';
import { Loader2, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SwipeCard from '@/components/SwipeCard';
import NavBar from '@/components/NavBar';
import { Apartment } from '@/components/ApartmentCard';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock apartment data
const mockApartments: Apartment[] = [
  {
    id: "1",
    title: "Modern Downtown Loft",
    location: "123 Main St",
    city: "San Francisco",
    price: 2800,
    bedrooms: 1,
    bathrooms: 1,
    size: 750,
    amenities: ["Wifi", "Gym", "Furnished", "Pet Friendly"],
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Beautiful downtown loft with high ceilings, exposed brick, and amazing city views. Walking distance to restaurants and shops."
  },
  {
    id: "2",
    title: "Cozy Studio Near Campus",
    location: "456 University Ave",
    city: "Berkeley",
    price: 1800,
    bedrooms: 0,
    bathrooms: 1,
    size: 450,
    amenities: ["Wifi", "Laundry", "AC"],
    images: [
      "https://images.unsplash.com/photo-1626885930974-1cf561b13b27?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Perfect studio for students, just a 10-minute walk to campus. Includes all utilities and high-speed internet."
  },
  {
    id: "3",
    title: "Luxury 2BR with Balcony",
    location: "789 Ocean Ave",
    city: "Santa Monica",
    price: 3500,
    bedrooms: 2,
    bathrooms: 2,
    size: 1100,
    amenities: ["Wifi", "Pool", "Gym", "Parking", "Balcony", "AC", "Dishwasher"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616593969747-4797dc75033e?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Stunning 2-bedroom apartment with ocean views from a private balcony. Includes access to building amenities like pool and fitness center."
  }
];

const Feed = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([500, 5000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const isMobile = useIsMobile();
  
  // Mock loading apartments
  useEffect(() => {
    setTimeout(() => {
      setApartments(mockApartments);
      setLoading(false);
    }, 1500);
  }, []);
  
  const handleSwipe = (direction: 'left' | 'right', apartmentId: string) => {
    console.log(`Swiped ${direction} on apartment ${apartmentId}`);
    // Remove the apartment from the stack
    setApartments(prev => prev.filter(apt => apt.id !== apartmentId));
  };
  
  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };
  
  const allAmenities = [
    "Wifi", "Gym", "Pool", "Laundry", "Parking", 
    "AC", "Furnished", "Pet Friendly", "Balcony", "Dishwasher"
  ];
  
  return (
    <div className="min-h-screen pb-16 md:pb-0 overflow-x-hidden">
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm p-3 md:p-4 dark:bg-gray-900">
        <div className="flex items-center justify-between max-w-screen-lg mx-auto">
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Discover
          </h1>
          
          <div className="flex items-center gap-2">
            <div className="relative w-full max-w-[140px] sm:max-w-xs md:max-w-sm">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3.5 w-3.5 md:h-4 md:w-4" />
              <Input 
                placeholder="Search location..." 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-7 md:pl-9 h-8 md:h-10 text-sm md:text-base"
              />
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                  <SlidersHorizontal className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto max-h-screen">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                
                <div className="space-y-6 py-4">
                  {/* Price Range */}
                  <div className="space-y-2">
                    <Label>Price Range ($/month)</Label>
                    <div className="pt-4">
                      <Slider 
                        defaultValue={priceRange} 
                        min={500} 
                        max={5000} 
                        step={100}
                        onValueChange={setPriceRange}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                  
                  {/* Bedrooms */}
                  <div className="space-y-2">
                    <Label>Bedrooms</Label>
                    <Select defaultValue="any">
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Bathrooms */}
                  <div className="space-y-2">
                    <Label>Bathrooms</Label>
                    <Select defaultValue="any">
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Amenities */}
                  <div className="space-y-2">
                    <Label>Amenities</Label>
                    <div className="flex flex-wrap gap-2">
                      {allAmenities.map(amenity => (
                        <Badge 
                          key={amenity}
                          variant={selectedAmenities.includes(amenity) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleAmenityToggle(amenity)}
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Reset and Apply Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1">
                      Reset
                    </Button>
                    <Button className="flex-1">
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <main className="py-4 md:py-6 px-3 md:px-4 flex flex-col items-center justify-center max-w-screen-xl mx-auto overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-60 md:h-80">
            <Loader2 className="h-10 w-10 md:h-12 md:w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Finding your next home...</p>
          </div>
        ) : apartments.length > 0 ? (
          <div className="relative w-full max-w-xs sm:max-w-sm">
            {apartments.map((apartment, index) => (
              <div 
                key={apartment.id} 
                className={`absolute w-full ${index === 0 ? 'z-20' : 'z-10'}`}
                style={{
                  top: index === 0 ? 0 : `${index * 8}px`,
                  left: 0,
                  right: 0,
                  opacity: index === 0 ? 1 : index > 2 ? 0 : 1 - index * 0.2
                }}
              >
                {index === 0 ? (
                  <SwipeCard 
                    apartment={apartment} 
                    onSwipe={(direction) => handleSwipe(direction, apartment.id)} 
                  />
                ) : (
                  <div className="pointer-events-none">
                    <SwipeCard 
                      apartment={apartment} 
                      onSwipe={() => {}} 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-60 md:h-80 max-w-sm">
            <div className="bg-primary/10 p-3 md:p-4 rounded-full mb-3 md:mb-4">
              <Search className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2">No more apartments</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
              You've seen all available apartments matching your criteria. Try adjusting your filters or check back later.
            </p>
            <Button 
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              onClick={() => setApartments(mockApartments)}
            >
              Refresh
            </Button>
          </div>
        )}
      </main>
      
      <NavBar />
    </div>
  );
};

export default Feed;
