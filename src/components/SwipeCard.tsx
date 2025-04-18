
import { useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform, useDragControls } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import ApartmentCard, { Apartment } from './ApartmentCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface SwipeCardProps {
  apartment: Apartment;
  onSwipe: (direction: 'left' | 'right') => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ apartment, onSwipe }) => {
  const [exitX, setExitX] = useState<number | null>(null);
  const dragControls = useDragControls();
  const isMobile = useIsMobile();
  
  // Motion values for the drag
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Calculate background opacity for the swipe indicators
  const leftActionOpacity = useTransform(x, [-200, -100, 0], [1, 0.5, 0]);
  const rightActionOpacity = useTransform(x, [0, 100, 200], [0, 0.5, 1]);
  
  // Handle drag end
  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100; // minimum distance to trigger swipe
    
    if (info.offset.x > threshold) {
      setExitX(200);
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      setExitX(-200);
      onSwipe('left');
    }
  };

  // Determine icon size based on device
  const iconSize = isMobile ? 24 : 32;
  
  return (
    <motion.div
      style={{ 
        x,
        rotate,
        position: 'relative',
        width: '100%',
        maxWidth: isMobile ? '20rem' : '24rem',
        margin: '0 auto',
      }}
      drag="x"
      dragControls={dragControls}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={exitX !== null ? { x: exitX } : undefined}
      transition={exitX !== null ? { duration: 0.2 } : undefined}
      whileTap={{ scale: 0.98 }}
      className="touch-manipulation"
    >
      {/* Left swipe action indicator */}
      <motion.div 
        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-destructive font-bold z-10"
        style={{ opacity: leftActionOpacity }}
      >
        <div className="bg-white/90 rounded-full p-2 md:p-3 shadow-lg">
          <X size={iconSize} className="text-destructive" />
        </div>
        <span className="mt-1 md:mt-2 bg-white/90 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md shadow-md text-xs md:text-sm">PASS</span>
      </motion.div>
      
      {/* Right swipe action indicator */}
      <motion.div 
        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-primary font-bold z-10"
        style={{ opacity: rightActionOpacity }}
      >
        <div className="bg-white/90 rounded-full p-2 md:p-3 shadow-lg">
          <Heart size={iconSize} className="text-primary" />
        </div>
        <span className="mt-1 md:mt-2 bg-white/90 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md shadow-md text-xs md:text-sm">LIKE</span>
      </motion.div>
      
      {/* Apartment Card */}
      <ApartmentCard apartment={apartment} />
    </motion.div>
  );
};

export default SwipeCard;
