import React from 'react';
import { Play, FileText, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

function MiniSessionCard({ post, className }) {
  const navigate = useNavigate();

  const handlePlay = (e) => {
    e.stopPropagation();
    navigate(`/post/${post.id}`);
  };

  const CoverContent = () => {
    if (post.cover_url) {
      return (
        <img 
          src={post.cover_url} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      );
    }
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <Music className="w-4 h-4 text-gray-600" />
      </div>
    );
  };

  return (
    <div 
      onClick={() => navigate(`/post/${post.id}`)}
      className={cn(
        "group flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#FF8C42]/30 transition-all cursor-pointer w-full h-[60px]",
        className
      )}
    >
      {/* Mini Cover */}
      <div className="relative w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-black/20">
        <CoverContent />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <Play className="w-4 h-4 text-white fill-current" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h4 className="text-sm font-medium text-white leading-tight truncate pr-2 group-hover:text-[#FF8C42] transition-colors">
          {post.title}
        </h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider truncate">
             {post.profiles?.username || 'Artista'}
          </span>
        </div>
      </div>

      {/* Action */}
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity px-2">
         <span className="text-[10px] font-bold text-[#FF8C42] uppercase tracking-wider flex items-center gap-1">
            Leer <FileText className="w-3 h-3" />
         </span>
      </div>
    </div>
  );
}

export default MiniSessionCard;