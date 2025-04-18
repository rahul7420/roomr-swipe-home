
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";

// Types
interface User {
  id: string;
  email: string;
  name?: string;
  profileComplete: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<User>) => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    // Mock checking for user in localStorage
    const storedUser = localStorage.getItem('roomr_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // In real implementation, this would call Supabase auth.signIn
      
      // Mock successful login for demo
      const mockUser: User = {
        id: '123',
        email,
        profileComplete: false
      };
      
      // Save user to state and localStorage
      setUser(mockUser);
      localStorage.setItem('roomr_user', JSON.stringify(mockUser));
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock signup function
  const signup = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true);
      // In real implementation, this would call Supabase auth.signUp
      
      // Mock successful signup for demo
      const mockUser: User = {
        id: '123',
        email,
        name,
        profileComplete: false
      };
      
      // Save user to state and localStorage
      setUser(mockUser);
      localStorage.setItem('roomr_user', JSON.stringify(mockUser));
      
      toast({
        title: "Account created",
        description: "Welcome to Roomr!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: "Please try again with a different email.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock logout function
  const logout = async () => {
    try {
      // In real implementation, this would call Supabase auth.signOut
      
      // Clear user from state and localStorage
      setUser(null);
      localStorage.removeItem('roomr_user');
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "Please try again.",
      });
    }
  };

  // Mock update profile function
  const updateProfile = async (profile: Partial<User>) => {
    try {
      setLoading(true);
      
      // In real implementation, this would update the user profile in Supabase
      
      // Update user in state and localStorage
      const updatedUser = { ...user, ...profile };
      setUser(updatedUser as User);
      localStorage.setItem('roomr_user', JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Profile update failed",
        description: "Please try again.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
