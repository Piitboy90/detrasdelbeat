import React from 'react';
import { motion } from 'framer-motion';
import { Play, FileText, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

function TrackCard({ post, className }) {
  const navigate = useNavigate();

  // Determine hook content (question or story start)
  const hook = post.community_question || post.story || "Escucha esta historia";
  const truncatedHook = hook.length > 50 ? hook.substring(0, 50) + "..." : hook;

  const handlePlay = (e) => {
    e.stopPropagation();
    // Navigate to post detail for playback to ensure context
    navigate(`/post/${post.id}`);
  };

  const handleRead = (e) => {
    e.stopPropagation();
    navigate(`/post/${post.id}`);
  };

  // Determine cover image (use post cover or a fallback gradient)
  const CoverContent = () => {
    if (post.cover_url) {
      return (
        <img 
          src={post.cover_url} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      );
    }
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <Music className="w-8 h-8 text-gray-600" />
      </div>
    );
  };

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 0 15px rgba(255, 140, 66, 0.4)" }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "group relative flex-shrink-0 rounded-lg overflow-hidden border border-[#FF8C42]/20 bg-white/5 backdrop-blur-[10px] p-3 transition-all cursor-pointer w-full h-full",
        className
      )}
      onClick={() => navigate(`/post/${post.id}`)}
    >
      {/* Cover Image */}
      <div className="relative aspect-square rounded-md overflow-hidden mb-3 bg-black/20">
        <CoverContent />
        
        {/* Play Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <div className="bg-[#FF8C42] rounded-full p-2 text-white shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
              <Play className="w-5 h-5 fill-current ml-0.5" />
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col min-h-[110px]">
        <h4 className="text-[14px] font-bold text-white leading-tight mb-1 line-clamp-2 min-h-[2.5em]" title={post.title}>
          {post.title}
        </h4>
        
        <p className="text-[12px] text-gray-400 leading-snug mb-3 line-clamp-2 h-[2.5em]">
          {truncatedHook}
        </p>

        <div className="mt-auto flex flex-col gap-2">
          <Button 
            onClick={handlePlay}
            size="sm"
            className="w-full h-7 text-[11px] bg-[#FF8C42] hover:bg-[#ff7a1f] text-white rounded font-medium"
          >
            <Play className="w-3 h-3 mr-1 fill-current" /> Escuchar
          </Button>
          
          <button 
            onClick={handleRead}
            className="text-[11px] text-[#FF8C42] hover:text-white transition-colors flex items-center justify-center gap-1 opacity-80 hover:opacity-100"
          >
            <FileText className="w-3 h-3" /> Leer historia
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default TrackCard;