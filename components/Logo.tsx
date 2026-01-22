
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ className = "h-12" }) => {
  // URL da imagem exata enviada pelo usuário para o logo
  const logoUrl = "https://i.postimg.cc/P5N8C0Yx/me-pilates-logo.png";

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={logoUrl} 
        alt="me pilates logo" 
        className="h-full w-auto object-contain"
        style={{ minHeight: '40px' }}
      />
    </div>
  );
};
