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
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
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

  const priceInINR = Math.round(apartment.price * 75);
  const formattedPrice = priceInINR.toLocaleString('en-IN');

  const imageHeight = isMobile ? "h-[80vh]" : "h-[85vh]";

  return (
    <Card className="swipe-card w-full overflow-hidden">
      <div 
        className={`relative ${imageHeight} bg-gray-200`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300" 
          style={{ backgroundImage: `url(${apartment.images[currentImageIndex]})` }} 
        />
        
        <div className="absolute top-4 right-4">
          <Badge className="bg-primary/90 backdrop-blur-sm text-primary-foreground font-semibold px-3 py-1.5 text-sm">
            ₹{formattedPrice}/mo
          </Badge>
        </div>
        
        {apartment.images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full"
              disabled={currentImageIndex === 0}
            >
              <ChevronLeft size={isMobile ? 16 : 20} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full"
              disabled={currentImageIndex === apartment.images.length - 1}
            >
              <ChevronRight size={isMobile ? 16 : 20} />
            </button>
            
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {apartment.images.map((_, index) => (
                <span 
                  key={index} 
                  className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      <CardContent className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-4 md:p-6">
        <h3 className="font-bold text-lg md:text-xl mb-2">{apartment.title}</h3>
        
        <div className="flex items-center text-muted-foreground text-sm md:text-base mb-3">
          <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-1.5" />
          <span>{apartment.location}, {apartment.city}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center text-sm md:text-base">
            <BedDouble className="h-4 w-4 md:h-5 md:w-5 mr-1.5 text-primary" />
            <span>{apartment.bedrooms} {apartment.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
          </div>
          <div className="flex items-center text-sm md:text-base">
            <Home className="h-4 w-4 md:h-5 md:w-5 mr-1.5 text-primary" />
            <span>{apartment.bathrooms} {apartment.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
          </div>
          <div className="flex items-center text-sm md:text-base">
            <span className="font-medium text-primary mr-1.5">{apartment.size}</span>
            <span>sq ft</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {apartment.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="secondary" className="text-xs md:text-sm px-2 py-1">
              {amenity === 'Wifi' && <Wifi className="h-3 w-3 md:h-4 md:w-4 mr-1.5" />}
              {amenity}
            </Badge>
          ))}
          {apartment.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs md:text-sm">
              +{apartment.amenities.length - 3} more
            </Badge>
          )}
        </div>
        
        <p className="text-sm md:text-base text-muted-foreground line-clamp-2">
          {apartment.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default ApartmentCard;
