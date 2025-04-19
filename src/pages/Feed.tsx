import { useState, useEffect } from 'react';
import { Loader2, Search, SlidersHorizontal, X } from 'lucide-react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([500, 5000]);
  const [bedroomCount, setBedroomCount] = useState("any");
  const [bathroomCount, setBathroomCount] = useState("any");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFiltered, setShowFiltered] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    setTimeout(() => {
      setApartments(mockApartments);
      setFilteredApartments(mockApartments);
      setLoading(false);
    }, 1500);
  }, []);
  
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredApartments(apartments);
      setShowFiltered(false);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = apartments.filter(apt => 
      apt.city.toLowerCase().includes(query) || 
      apt.location.toLowerCase().includes(query) || 
      apt.title.toLowerCase().includes(query)
    );
    
    setFilteredApartments(filtered);
    setShowFiltered(true);
  }, [searchQuery, apartments]);
  
  const applyFilters = () => {
    let filtered = [...apartments];
    
    filtered = filtered.filter(apt => apt.price >= priceRange[0] && apt.price <= priceRange[1]);
    
    if (bedroomCount !== "any") {
      if (bedroomCount === "studio") {
        filtered = filtered.filter(apt => apt.bedrooms === 0);
      } else {
        const bedrooms = parseInt(bedroomCount);
        if (bedrooms === 3) {
          filtered = filtered.filter(apt => apt.bedrooms >= 3);
        } else {
          filtered = filtered.filter(apt => apt.bedrooms === bedrooms);
        }
      }
    }
    
    if (bathroomCount !== "any") {
      const bathrooms = parseInt(bathroomCount);
      if (bathrooms === 3) {
        filtered = filtered.filter(apt => apt.bathrooms >= 3);
      } else {
        filtered = filtered.filter(apt => apt.bathrooms === bathrooms);
      }
    }
    
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(apt => 
        selectedAmenities.every(amenity => apt.amenities.includes(amenity))
      );
    }
    
    if (location) {
      const locationLower = location.toLowerCase();
      filtered = filtered.filter(apt => 
        apt.city.toLowerCase().includes(locationLower) || 
        apt.location.toLowerCase().includes(locationLower)
      );
    }
    
    setFilteredApartments(filtered);
    setShowFiltered(true);
    toast({
      title: "Filters applied",
      description: `Found ${filtered.length} apartments matching your criteria.`,
    });
  };
  
  const resetFilters = () => {
    setPriceRange([500, 5000]);
    setBedroomCount("any");
    setBathroomCount("any");
    setSelectedAmenities([]);
    setLocation("");
    setFilteredApartments(apartments);
    setShowFiltered(false);
    toast({
      title: "Filters reset",
      description: "All filters have been cleared.",
    });
  };
  
  const handleSwipe = (direction: 'left' | 'right', apartmentId: string) => {
    console.log(`Swiped ${direction} on apartment ${apartmentId}`);
    if (showFiltered) {
      setFilteredApartments(prev => prev.filter(apt => apt.id !== apartmentId));
    } else {
      setApartments(prev => prev.filter(apt => apt.id !== apartmentId));
    }
  };
  
  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };
  
  const viewApartmentDetails = (apartment: Apartment) => {
    setSelectedApartment(apartment);
    setIsDetailsOpen(true);
  };
  
  const startConversation = () => {
    if (selectedApartment) {
      toast({
        title: "Starting conversation",
        description: `You can now chat about ${selectedApartment.title}`,
      });
      navigate(`/messages/${selectedApartment.id}`);
    }
  };
  
  const renderApartmentDetails = () => {
    if (!selectedApartment) return null;
    
    return (
      <div className="space-y-4">
        <div className="relative rounded-lg overflow-hidden h-56 md:h-80 bg-gray-200">
          <div 
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${selectedApartment.images[0]})` }}
          />
          <div className="absolute bottom-2 right-2 flex gap-1">
            {selectedApartment.images.map((_, idx) => (
              <span 
                key={idx} 
                className="w-2 h-2 rounded-full bg-white/80"
              />
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold">{selectedApartment.title}</h2>
          <p className="text-muted-foreground text-sm">
            {selectedApartment.location}, {selectedApartment.city}
          </p>
          <p className="text-lg font-semibold">${selectedApartment.price.toLocaleString()}/month</p>
        </div>
        
        <div className="grid grid-cols-3 gap-2 py-2">
          <div className="text-center p-2 bg-muted rounded-md">
            <p className="text-sm font-medium">{selectedApartment.bedrooms}</p>
            <p className="text-xs text-muted-foreground">Beds</p>
          </div>
          <div className="text-center p-2 bg-muted rounded-md">
            <p className="text-sm font-medium">{selectedApartment.bathrooms}</p>
            <p className="text-xs text-muted-foreground">Baths</p>
          </div>
          <div className="text-center p-2 bg-muted rounded-md">
            <p className="text-sm font-medium">{selectedApartment.size}</p>
            <p className="text-xs text-muted-foreground">Sq Ft</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-1">Description</h3>
          <p className="text-sm text-muted-foreground">{selectedApartment.description}</p>
        </div>
        
        <div>
          <h3 className="font-medium mb-1">Amenities</h3>
          <div className="flex flex-wrap gap-1">
            {selectedApartment.amenities.map((amenity) => (
              <Badge key={amenity} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button onClick={startConversation} className="w-full">
            Message
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsDetailsOpen(false)} 
            className="w-full"
          >
            Close
          </Button>
        </div>
      </div>
    );
  };
  
  const allAmenities = [
    "Wifi", "Gym", "Pool", "Laundry", "Parking", 
    "AC", "Furnished", "Pet Friendly", "Balcony", "Dishwasher"
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b p-3 md:p-4 dark:bg-gray-900/80">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Discover
          </h1>
          
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search location..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
              {searchQuery && (
                <button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto max-h-screen">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input 
                      placeholder="City or neighborhood" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Price Range ($/month)</Label>
                    <div className="pt-4">
                      <Slider 
                        value={priceRange} 
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
                  
                  <div className="space-y-2">
                    <Label>Bedrooms</Label>
                    <Select 
                      value={bedroomCount}
                      onValueChange={setBedroomCount}
                    >
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
                  
                  <div className="space-y-2">
                    <Label>Bathrooms</Label>
                    <Select 
                      value={bathroomCount}
                      onValueChange={setBathroomCount}
                    >
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
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={resetFilters}
                    >
                      Reset
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={applyFilters}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-6 px-4 flex justify-center items-start min-h-[calc(100vh-4rem)]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Finding your next home...</p>
          </div>
        ) : filteredApartments.length > 0 ? (
          <div className="relative w-full max-w-lg mx-auto">
            {filteredApartments.map((apartment, index) => (
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
                  <div>
                    <SwipeCard 
                      apartment={apartment} 
                      onSwipe={(direction) => handleSwipe(direction, apartment.id)} 
                    />
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => viewApartmentDetails(apartment)}
                        className="w-full"
                      >
                        View Apartment
                      </Button>
                      <Button 
                        onClick={() => {
                          setSelectedApartment(apartment);
                          startConversation();
                        }}
                        className="w-full"
                      >
                        Message
                      </Button>
                    </div>
                  </div>
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
          <div className="flex flex-col items-center justify-center text-center h-[60vh] max-w-sm">
            <div className="bg-primary/10 p-3 md:p-4 rounded-full mb-3 md:mb-4">
              <Search className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2">No apartments found</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
              {showFiltered ? 
                "No apartments match your search criteria. Try adjusting your filters or search terms." :
                "You've seen all available apartments. Try adjusting your filters or check back later."
              }
            </p>
            <Button 
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              onClick={() => {
                setShowFiltered(false);
                setSearchQuery("");
                resetFilters();
                setApartments(mockApartments);
                setFilteredApartments(mockApartments);
              }}
            >
              Refresh
            </Button>
          </div>
        )}
      </main>
      
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md w-[90vw] sm:w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apartment Details</DialogTitle>
            <DialogDescription>
              View the details of this apartment
            </DialogDescription>
          </DialogHeader>
          {renderApartmentDetails()}
        </DialogContent>
      </Dialog>
      
      <NavBar />
    </div>
  );
};

export default Feed;
