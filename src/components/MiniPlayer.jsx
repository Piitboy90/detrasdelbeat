import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X } from 'lucide-react';

const MiniPlayer = ({ track, isPlaying, onTogglePlay, onClose, progress }) => {
  if (!track) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#0F172A] border-t border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] pb-safe"
      >
        <div className="h-1 bg-gray-800 w-full">
           <div 
             className="h-full bg-[#FF8C42] transition-all duration-300 ease-linear"
             style={{ width: `${progress}%` }}
           />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
           <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded bg-gray-800 overflow-hidden flex-shrink-0 relative">
                 {track.cover_url ? (
                   <img src={track.cover_url} alt="" className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                     <span className="text-xs text-white">BS</span>
                   </div>
                 )}
                 {isPlaying && (
                   <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                     <div className="flex gap-0.5 items-end h-3">
                       <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-[#FF8C42]" />
                       <motion.div animate={{ height: [6, 12, 5] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-1 bg-[#FF8C42]" />
                       <motion.div animate={{ height: [3, 8, 3] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-[#FF8C42]" />
                     </div>
                   </div>
                 )}
              </div>
              <div className="overflow-hidden">
                 <h4 className="text-white text-sm font-medium truncate">{track.title}</h4>
                 <p className="text-gray-400 text-xs truncate">{track.profiles?.username || 'Artista'}</p>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <button 
                onClick={onTogglePlay}
                className="w-10 h-10 rounded-full bg-white text-[#0F172A] flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
              
              <button onClick={onClose} className="text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
           </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MiniPlayer;