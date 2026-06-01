import React from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toHttps } from '@/utils/urlSecurity.js';

const CoverArt = ({ title, tags, coverUrl, creator, className }) => {
  return (
    <div className={cn("relative w-full aspect-video overflow-hidden group", className)}>
      {coverUrl ? (
        <>
          <img 
            src={toHttps(coverUrl)} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
        </>
      ) : (
        <div className="w-full h-full cover-fallback flex flex-col justify-end p-5 relative z-0">
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 mb-2">
              {title}
            </h3>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 opacity-80">
                {tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] text-[#FF8C42] bg-[#FF8C42]/10 px-1.5 py-0.5 rounded border border-[#FF8C42]/20 uppercase tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {creator && (
              <p className="text-xs text-gray-400 mt-2 font-medium">
                por @{creator}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <button
          className="w-14 h-14 rounded-full bg-[#FF8C42]/90 hover:bg-[#FF8C42] text-white flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.4)] shadow-[#FF8C42]/20 transform group-hover:scale-110 transition-all duration-300 pointer-events-auto cursor-pointer border-2 border-white/10 backdrop-blur-sm"
          aria-label="Reproducir"
        >
          <Play className="w-6 h-6 fill-white ml-1" />
        </button>
      </div>
    </div>
  );
};

export default CoverArt;