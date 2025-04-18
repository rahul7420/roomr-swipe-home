
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Wifi, 
  BedDouble, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export interface Apartment {
  id: string;
  title: string;
  location: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  amenities: string[];
  images: string[];
  description: string;
}

interface ApartmentCardProps {
  apartment: Apartment;
  onSwipe?: (direction: 'left' | 'right') => void;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment, onSwipe }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Minimum swipe distance required
  const minSwipeDistance = 50;
  
  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentImageIndex < apartment.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };
  
  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };
  
  // Touch handlers for swiping images
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  // Format price with commas
  const formattedPrice = apartment.price.toLocaleString();

  return (
    <Card className="swipe-card w-full max-w-sm mx-auto overflow-hidden">
      <div 
        className="relative h-64 bg-gray-200"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-300" style={{ backgroundImage: `url(${apartment.images[currentImageIndex]})` }} />
        
        {/* Image navigation buttons */}
        {apartment.images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full"
              disabled={currentImageIndex === 0}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full"
              disabled={currentImageIndex === apartment.images.length - 1}
            >
              <ChevronRight size={20} />
            </button>
            
            {/* Image pagination dots */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {apartment.images.map((_, index) => (
                <span 
                  key={index} 
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Price badge */}
        <div className="absolute top-2 right-2">
          <Badge className="bg-primary text-primary-foreground font-semibold px-2 py-1 text-sm">
            <DollarSign className="h-3.5 w-3.5 mr-1" />
            {formattedPrice}/mo
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{apartment.title}</h3>
        
        <div className="flex items-center text-muted-foreground text-sm mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{apartment.location}, {apartment.city}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="flex items-center text-sm">
            <BedDouble className="h-4 w-4 mr-1 text-primary" />
            <span>{apartment.bedrooms} {apartment.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
          </div>
          <div className="flex items-center text-sm">
            <Home className="h-4 w-4 mr-1 text-primary" />
            <span>{apartment.bathrooms} {apartment.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="font-medium text-primary mr-1">{apartment.size}</span>
            <span>sq ft</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {apartment.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {amenity === 'Wifi' && <Wifi className="h-3 w-3 mr-1" />}
              {amenity}
            </Badge>
          ))}
          {apartment.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{apartment.amenities.length - 3} more
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">{apartment.description}</p>
      </CardContent>
    </Card>
  );
};

export default ApartmentCard;
