import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const GENRES = [
  'Todos',
  'Rap',
  'Neo-soul',
  'R&B',
  'Pop',
  'Indie',
  'Rock',
  'Electrónica',
  'Lo-fi',
  'Otro'
];

function SessionsSelector({ selectedGenre, onSelectGenre }) {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-2 min-w-max">
        {GENRES.map((genre) => {
          const isSelected = selectedGenre === genre;
          return (
            <button
              key={genre}
              onClick={() => onSelectGenre(genre)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border whitespace-nowrap",
                isSelected 
                  ? "bg-[#FF8C42] border-[#FF8C42] text-white shadow-[0_0_15px_rgba(255,140,66,0.4)] scale-105" 
                  : "bg-transparent border-white/10 text-gray-400 hover:border-[#FF8C42]/50 hover:text-[#FF8C42]"
              )}
            >
              {genre}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SessionsSelector;