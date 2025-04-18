
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Home, MessageSquare, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import confetti from 'canvas-confetti';

const MatchScreen = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [matchDetails, setMatchDetails] = useState<{
    userId: string;
    userName: string;
    userAvatar?: string;
    apartmentId: string;
    apartmentName: string;
    apartmentImage: string;
  } | null>(null);
  
  useEffect(() => {
    // Trigger confetti when component mounts
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Mock data loading - would be replaced with Supabase query
    setTimeout(() => {
      setMatchDetails({
        userId: '123',
        userName: 'Jessica Thompson',
        userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        apartmentId: 'apt1',
        apartmentName: 'Modern Downtown Loft',
        apartmentImage: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80'
      });
      setLoading(false);
    }, 1000);
  }, [id]);
  
  const handleMessageMatch = () => {
    // In a real app, this would create a chat room in Supabase
    navigate(`/messages/${matchDetails?.userId}`);
  };
  
  const handleViewApartment = () => {
    // Navigate to the apartment details page
    navigate(`/feed/${matchDetails?.apartmentId}`);
  };
  
  const handleDismiss = () => {
    navigate('/feed');
    toast({
      title: "Match saved",
      description: "You can find this match in your messages.",
    });
  };
  
  if (loading || !matchDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 p-4">
        <div className="animate-pulse flex flex-col items-center text-center">
          <div className="h-24 w-24 rounded-full bg-primary/30 mb-4" />
          <div className="h-8 w-48 bg-primary/30 rounded mb-2" />
          <div className="h-4 w-64 bg-primary/20 rounded" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-xl shadow-xl p-8 max-w-md w-full text-center relative"
      >
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-4 top-4" 
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold mb-2">It's a Match!</h1>
          <p className="text-muted-foreground mb-8">
            You and {matchDetails.userName} both liked the same apartment
          </p>
        </motion.div>
        
        <motion.div 
          className="flex justify-center items-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={user?.name ? user.name.charAt(0) : 'U'} />
              <AvatarFallback>
                {user?.name ? user.name.charAt(0) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center">
              <Home className="h-4 w-4" />
            </div>
          </div>
          
          <div 
            className="relative mx-4 w-28 h-28 rounded-lg overflow-hidden border-4 border-background"
            style={{
              backgroundImage: `url(${matchDetails.apartmentImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={matchDetails.userAvatar} />
              <AvatarFallback>{matchDetails.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="absolute -top-2 -right-2 bg-secondary text-white rounded-full h-8 w-8 flex items-center justify-center">
              <Home className="h-4 w-4" />
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="bg-accent/50 p-4 rounded-lg mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <h3 className="font-medium">{matchDetails.apartmentName}</h3>
          <p className="text-sm text-muted-foreground">
            You've both shown interest in this apartment
          </p>
        </motion.div>
        
        <motion.div
          className="space-y-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <Button 
            onClick={handleMessageMatch}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Message {matchDetails.userName.split(' ')[0]}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleViewApartment}
            className="w-full"
          >
            <Home className="mr-2 h-4 w-4" />
            View Apartment
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MatchScreen;
