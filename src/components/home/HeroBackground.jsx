import React, { useState } from 'react';
import { motion } from 'framer-motion';

const HeroBackground = ({ 
  backgroundImage, 
  children,
  className = "" 
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Use the new premium studio setup image if no custom image is passed
  const bgImage = backgroundImage || "https://images.unsplash.com/photo-1695132316379-d220a2308fc8?q=80&w=1200&auto=format&fit=crop";

  return (
    <section className={`relative min-h-[85vh] w-full overflow-hidden flex items-center ${className}`}>
      
      {/* Layer 1: Base Gradient with Brand Colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050A16] via-[#07122A] to-[#0B1E3A] z-0" />
      
      {/* Layer 1b: Radial Orange Accent (Subtle) */}
      <div 
        className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#ff8c42] rounded-full mix-blend-screen filter blur-[120px] opacity-10 z-0 animate-pulse" 
        style={{ animationDuration: '8s' }}
      />

      {/* Layer 2: Background Image */}
      <div className="absolute inset-0 z-0">
          <img 
          src={bgImage} 
          alt="Hero Studio Background" 
          className={`
            w-full h-full object-cover transition-opacity duration-1000 ease-in-out blur-[1.5px]
            object-center md:object-right
            ${isImageLoaded ? 'opacity-20' : 'opacity-0'}
          `}
          onLoad={() => setIsImageLoaded(true)}
          loading="lazy"
        />
      </div>

      {/* Layer 3: Dark Overlay Gradient for Readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b md:bg-gradient-to-r from-[#050A16]/95 via-[#050A16]/80 to-[#050A16]/60" />

      {/* Layer 4: Grain Texture */}
      <div className="absolute inset-0 z-0 grain-texture mix-blend-overlay" />

      {/* Content Layer */}
      <div className="relative z-10 w-full">
        {children}
      </div>

    </section>
  );
};

export default HeroBackground;