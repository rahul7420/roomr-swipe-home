
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { Building, Users, MessageSquare } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-accent">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-10 animate-float">
          <Logo size="lg" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          Find your perfect 
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent px-2">
            home 
          </span>
          and 
          <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent px-2">
            roommates
          </span>
        </h1>

        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          Swipe, match, and connect with potential roommates for your next apartment.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-10 w-full max-w-md">
          <div className="flex flex-col items-center p-4 bg-white/80 rounded-lg shadow-md dark:bg-gray-800/80">
            <Building className="h-8 w-8 text-primary mb-2" />
            <span className="text-sm font-medium">Beautiful Apartments</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/80 rounded-lg shadow-md dark:bg-gray-800/80">
            <Users className="h-8 w-8 text-secondary mb-2" />
            <span className="text-sm font-medium">Match Roommates</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/80 rounded-lg shadow-md dark:bg-gray-800/80">
            <MessageSquare className="h-8 w-8 text-primary mb-2" />
            <span className="text-sm font-medium">Chat & Connect</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            size="lg" 
            onClick={() => navigate('/login')}
            variant="outline"
          >
            Login
          </Button>
          <Button 
            size="lg" 
            onClick={() => navigate('/signup')}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            Sign Up
          </Button>
        </div>
      </div>

      <footer className="py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Roomr. All rights reserved.
      </footer>
    </div>
  );
};

export default Welcome;
