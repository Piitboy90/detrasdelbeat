import React from 'react';

const SkeletonPlayer = ({ className = "" }) => {
  return (
    <div 
      className={`w-full aspect-video bg-[#0f172a] rounded-xl overflow-hidden relative ${className}`}
      role="status"
      aria-label="Cargando reproductor..."
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] animate-pulse" />
      
      {/* Play button placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[#334155]/50 animate-pulse" />
      </div>
      
      {/* Bottom bar placeholder */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#1e293b]/50 p-4 flex items-center gap-4">
        <div className="h-2 w-1/4 bg-[#334155]/50 rounded animate-pulse" />
        <div className="h-2 w-1/2 bg-[#334155]/50 rounded animate-pulse" />
      </div>
    </div>
  );
};

export default SkeletonPlayer;