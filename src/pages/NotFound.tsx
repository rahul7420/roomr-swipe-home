
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Logo from "@/components/Logo";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-accent text-center">
      <Logo size="lg" className="mb-8" />
      
      <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        404
      </h1>
      
      <p className="text-xl text-foreground mb-6">
        Oops! It seems you've wandered into uncharted territory.
      </p>
      
      <p className="text-muted-foreground mb-8 max-w-md">
        We couldn't find the page you were looking for. It might have been moved, renamed, or never existed in the first place.
      </p>
      
      <Button
        onClick={() => navigate("/")}
        className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
      >
        <Home className="mr-2 h-4 w-4" />
        Return Home
      </Button>
    </div>
  );
};

export default NotFound;
