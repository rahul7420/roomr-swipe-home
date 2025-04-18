
import { Home } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className={`flex items-center font-bold ${sizeClasses[size]} ${className}`}>
      <Home className="mr-2 text-primary" />
      <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Roomr
      </span>
    </div>
  );
};

export default Logo;
