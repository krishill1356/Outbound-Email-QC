
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'medium' }) => {
  const dimensions = {
    small: 'h-8',
    medium: 'h-10',
    large: 'h-12'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/logo.png" 
        alt="Company Logo" 
        className={`${dimensions[size]} w-auto object-contain`}
      />
    </div>
  );
};

export default Logo;
