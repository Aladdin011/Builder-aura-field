import React, { useState } from 'react';

interface SmartLogoProps {
  className?: string;
  alt?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SmartLogo: React.FC<SmartLogoProps> = ({ 
  className = '', 
  alt = 'JD Marc Limited Logo',
  variant = 'light',
  size = 'md'
}) => {
  const [hasWebpFailed, setHasWebpFailed] = useState(false);
  const [hasJpgFailed, setHasJpgFailed] = useState(false);

  // Size classes mapping
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  // Image sources priority: WebP → JPEG → CDN fallback
  const getImageSrc = () => {
    const baseLocal = `/images/brand/logo${variant === 'dark' ? '-dark' : ''}`;
    
    if (!hasWebpFailed) {
      return `${baseLocal}.webp`;
    } else if (!hasJpgFailed) {
      return `${baseLocal}.jpg`;
    } else {
      // CDN fallback
      return variant === 'dark' 
        ? 'https://cdn.builder.io/api/v1/image/assets%2F751ea84be0da437c8dd3f1bf04173189%2F6982878bae124d2589b95f89b1a5cf5b?format=webp&width=200'
        : 'https://cdn.builder.io/api/v1/image/assets%2Fbd53220f2be44e7b823f6284706cc662%2F74072840a2e04ede8037ff70b072ee1d?format=webp&width=200';
    }
  };

  const handleImageError = () => {
    if (!hasWebpFailed) {
      setHasWebpFailed(true);
    } else if (!hasJpgFailed) {
      setHasJpgFailed(true);
    }
  };

  return (
    <img
      src={getImageSrc()}
      alt={alt}
      className={`${sizeClasses[size]} object-contain rounded-lg ${className}`}
      onError={handleImageError}
      loading="lazy"
    />
  );
};

export default SmartLogo;
