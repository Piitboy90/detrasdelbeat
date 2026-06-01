import React from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink, Bot, Music } from 'lucide-react';
import { getProviderInfo } from '@/lib/providerUtils';
import { toHttps } from '@/utils/urlSecurity.js';

const MediaPreview = ({ coverUrl, mediaUrl, provider: explicitProvider, title, isAI }) => {
  const providerInfo = getProviderInfo(mediaUrl);
  const ProviderIcon = providerInfo.icon;
  
  const handlePlayClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (mediaUrl) {
      window.open(toHttps(mediaUrl), '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="relative w-full aspect-video brand-placeholder overflow-hidden group">
      {coverUrl ? (
        <img 
          src={toHttps(coverUrl)} 
          alt={title || "Media cover"} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent opacity-60" />
            <Music className="w-16 h-16 text-white/10 relative z-10" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/20 to-transparent" />

      <div className="absolute top-3 right-3 flex gap-2 z-10">
        {isAI && (
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 text-[10px] font-bold text-[#FF8C42] uppercase tracking-wider shadow-sm">
             <Bot className="w-3 h-3" />
             <span>AI</span>
          </div>
        )}
        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 text-xs font-medium text-white shadow-sm">
           <ProviderIcon className="w-3 h-3 text-gray-300" />
           <span>{providerInfo.name}</span>
        </div>
      </div>

      <button
        onClick={handlePlayClick}
        aria-label={`Reproducir ${title} en nueva pestaña`}
        className="absolute inset-0 w-full h-full flex items-center justify-center group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8C42] z-20 cursor-pointer tap-feedback"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-full bg-[#FF8C42] text-white flex items-center justify-center shadow-lg shadow-[#FF8C42]/30 group-hover/btn:shadow-[#FF8C42]/50 transition-all duration-300 relative overflow-hidden tap-glow"
        >
          <div className="absolute inset-0 bg-white/20 scale-0 group-hover/btn:scale-100 rounded-full transition-transform duration-500" />
          <Play className="w-6 h-6 ml-1 fill-current relative z-10" />
        </motion.div>
        
        <div className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 bg-black/80 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full items-center gap-1.5 whitespace-nowrap pointer-events-none transform translate-y-2 group-hover/btn:translate-y-0">
          <span>Abrir en {providerInfo.name}</span>
          <ExternalLink className="w-3 h-3" />
        </div>
      </button>
    </div>
  );
};

export default MediaPreview;