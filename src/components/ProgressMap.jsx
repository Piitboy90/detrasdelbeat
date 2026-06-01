import React from 'react';
import { motion } from 'framer-motion';
import { Map, Bookmark, MessageSquare, Music } from 'lucide-react';

const ProgressMap = ({ stats }) => {
  const hasData = stats && (stats.postsCount > 0 || stats.bookmarksCount > 0 || stats.repliesCount > 0);

  return (
    <div className="bg-[#0B1221] border border-[#FF8C42]/30 rounded-xl p-6 relative overflow-hidden group hover:border-[#FF8C42]/50 transition-colors duration-300">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Map className="w-32 h-32 text-[#FF8C42]" />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-1 h-5 bg-[#FF8C42] rounded-full block"></span>
          {hasData ? "Tu mapa de historias está creciendo." : "Tu biblioteca empieza con una historia."}
        </h3>

        {hasData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ y: -2 }}
              className="bg-[#1E293B]/50 p-4 rounded-lg border border-gray-800 text-center"
            >
              <div className="text-3xl font-bold text-white mb-1">{stats.postsCount || 0}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Music className="w-3 h-3 text-[#FF8C42]" /> Historias
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -2 }}
              className="bg-[#1E293B]/50 p-4 rounded-lg border border-gray-800 text-center"
            >
              <div className="text-3xl font-bold text-white mb-1">{stats.bookmarksCount || 0}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Bookmark className="w-3 h-3 text-[#FF8C42]" /> Guardadas
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -2 }}
              className="bg-[#1E293B]/50 p-4 rounded-lg border border-gray-800 text-center"
            >
              <div className="text-3xl font-bold text-white mb-1">{stats.repliesCount || 0}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <MessageSquare className="w-3 h-3 text-[#FF8C42]" /> Respuestas
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-6 px-4">
             <p className="text-gray-400 italic mb-2">"Cada canción es un mundo por descubrir."</p>
             <p className="text-sm text-gray-500">Interactúa con la comunidad para construir tu mapa.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressMap;