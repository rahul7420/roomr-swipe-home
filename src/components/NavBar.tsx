
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Search, 
  Heart, 
  MessageSquare, 
  User, 
  LogOut,
  Sun,
  Moon,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

const NavBar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/feed', icon: Search, label: 'Discover' },
    { path: '/favorites', icon: Heart, label: 'Favorites' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
      });
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real implementation, this would toggle a class on the html/body element
    // or use a dark mode context/store
    document.documentElement.classList.toggle('dark');
    toast({
      title: darkMode ? "Light mode activated" : "Dark mode activated",
      description: `The app theme has been switched to ${darkMode ? "light" : "dark"} mode`,
    });
  };

  if (!user) return null;

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 px-4 py-2 z-50 dark:bg-gray-900 dark:border-gray-700">
      <div className="flex items-center justify-between max-w-screen-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 px-3 ${
                isActive
                  ? 'text-primary font-medium'
                  : 'text-gray-500 dark:text-gray-400'
              } transition-colors duration-200 hover:text-primary`}
            >
              <item.icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-primary">
              <Settings size={24} />
              <span className="sr-only">Settings</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={toggleDarkMode} className="cursor-pointer">
              {darkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default NavBar;
