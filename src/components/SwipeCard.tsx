
import { useState, useRef } from 'react';
import { motion, PanInfo, useMotionValue, useTransform, useDragControls } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import ApartmentCard, { Apartment } from './ApartmentCard';

interface SwipeCardProps {
  apartment: Apartment;
  onSwipe: (direction: 'left' | 'right') => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ apartment, onSwipe }) => {
  const [exitX, setExitX] = useState<number | null>(null);
  const dragControls = useDragControls();
  
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
  
  return (
    <motion.div
      style={{ 
        x,
        rotate,
        position: 'relative',
        width: '100%',
        maxWidth: '24rem',
        margin: '0 auto',
      }}
      drag="x"
      dragControls={dragControls}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={exitX !== null ? { x: exitX } : undefined}
      transition={exitX !== null ? { duration: 0.2 } : undefined}
      whileTap={{ scale: 0.98 }}
    >
      {/* Left swipe action indicator */}
      <motion.div 
        className="swipe-action-left"
        style={{ opacity: leftActionOpacity }}
      >
        <X size={24} />
        PASS
      </motion.div>
      
      {/* Right swipe action indicator */}
      <motion.div 
        className="swipe-action-right"
        style={{ opacity: rightActionOpacity }}
      >
        <Heart size={24} />
        LIKE
      </motion.div>
      
      {/* Apartment Card */}
      <ApartmentCard apartment={apartment} />
    </motion.div>
  );
};

export default SwipeCard;
