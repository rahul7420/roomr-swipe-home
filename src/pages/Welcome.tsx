
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-accent overflow-x-hidden">
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 text-center">
        {/* Logo */}
        <div className="mb-8 sm:mb-10 md:mb-12 animate-float">
          <Logo size="lg" />
        </div>

        {/* Hero Text */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 max-w-[20ch] mx-auto">
          Find your perfect 
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent px-2">
            home 
          </span>
          and 
          <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent px-2">
            roommates
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-md mx-auto">
          Swipe, match, and connect with potential roommates for your next apartment.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 sm:mb-10 w-full max-w-md sm:max-w-2xl mx-auto">
          <div className="flex flex-col items-center p-4 bg-white/80 rounded-lg shadow-md dark:bg-gray-800/80 transform transition-transform hover:scale-105">
            <Building className="h-8 w-8 text-primary mb-2" />
            <span className="text-sm sm:text-base font-medium">Beautiful Apartments</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/80 rounded-lg shadow-md dark:bg-gray-800/80 transform transition-transform hover:scale-105">
            <Users className="h-8 w-8 text-secondary mb-2" />
            <span className="text-sm sm:text-base font-medium">Match Roommates</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/80 rounded-lg shadow-md dark:bg-gray-800/80 transform transition-transform hover:scale-105">
            <MessageSquare className="h-8 w-8 text-primary mb-2" />
            <span className="text-sm sm:text-base font-medium">Chat & Connect</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button 
            size="lg" 
            onClick={() => navigate('/login')}
            variant="outline"
            className="w-full sm:w-auto min-w-[150px]"
          >
            Login
          </Button>
          <Button 
            size="lg" 
            onClick={() => navigate('/signup')}
            className="w-full sm:w-auto min-w-[150px] bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            Sign Up
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Roomr. All rights reserved.
      </footer>
    </div>
  );
};

export default Welcome;
