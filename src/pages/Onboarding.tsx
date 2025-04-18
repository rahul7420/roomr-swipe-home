
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowRight, ArrowLeft, Home, Users, MessageSquare } from 'lucide-react';
import Logo from '@/components/Logo';

const OnboardingSteps = [
  {
    title: "Find Your Perfect Home",
    description: "Browse through curated apartments with detailed information including amenities, location, and price.",
    icon: Home,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Match With Roommates",
    description: "Like apartments and get matched with others who like the same places. Find compatible roommates.",
    icon: Users,
    image: "https://images.unsplash.com/photo-1527576539890-dfa815648363?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Chat & Connect",
    description: "Message potential roommates directly through the app. Plan viewings and make arrangements together.",
    icon: MessageSquare,
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80"
  }
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateProfile } = useAuth();
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < OnboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeOnboarding = async () => {
    setIsSubmitting(true);
    
    try {
      await updateProfile({ profileComplete: true });
      navigate('/home');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const step = OnboardingSteps[currentStep];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-accent">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>
        
        <Card className="overflow-hidden mb-6 animate-fade-in">
          <div 
            className="h-48 bg-center bg-cover" 
            style={{ backgroundImage: `url(${step.image})` }}
          />
          <CardContent className="p-6">
            <div className="mb-4 flex items-center text-primary">
              <step.icon className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-bold">{step.title}</h2>
            </div>
            <p className="text-muted-foreground">{step.description}</p>
          </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex space-x-1">
            {OnboardingSteps.map((_, index) => (
              <span 
                key={index}
                className={`block h-2 w-2 rounded-full ${
                  index === currentStep ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <Button 
            onClick={handleNext}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading
              </>
            ) : currentStep === OnboardingSteps.length - 1 ? (
              <>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
