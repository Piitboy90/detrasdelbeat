import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, Music, Mic2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getProviderName } from '@/lib/embedUtils';

const FeaturedPostCard = ({ post }) => {
  const navigate = useNavigate();
  
  if (!post) return null;

  const { 
    id, 
    title, 
    story, 
    cover_url, 
    media_url, 
    profiles, 
    ai_tool 
  } = post;

  const handlePlay = (e) => {
    e.stopPropagation();
    window.open(media_url, '_blank', 'noopener,noreferrer');
  };

  const handleRead = (e) => {
    e.stopPropagation();
    navigate(`/post/${id}`);
  };

  const providerName = getProviderName(media_url);
  const displayTool = ai_tool || providerName || "AI";

  return (
    <div 
      className="group relative w-full rounded-xl overflow-hidden bg-[#0F172A] border border-gray-800 shadow-xl premium-card-hover cursor-pointer"
      onClick={handleRead}
    >
      <div className="flex flex-col md:flex-row h-full">
        
        {/* Visual Side */}
        <div className="relative w-full md:w-2/5 aspect-video md:aspect-auto overflow-hidden">
          {cover_url ? (
            <>
              <img 
                src={cover_url} 
                alt={title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0F172A] via-[#0F172A]/40 to-transparent opacity-90 md:opacity-70" />
            </>
          ) : (
             <div className="w-full h-full bg-gradient-to-br from-[#0B1E3A] to-[#FF8C42]/20 flex items-center justify-center relative">
                 <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                 <Music className="w-16 h-16 text-white/20" />
                 <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0F172A] via-transparent to-transparent" />
             </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2 z-20">
             <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">
                <Sparkles className="w-3 h-3 text-[#FF8C42]" />
                <span className="text-gray-300">AI</span>
                <span className="text-white ml-1">{displayTool}</span>
             </div>
          </div>
          
          <div className="absolute top-4 right-4 z-20 md:hidden">
             <div className="bg-[#FF8C42] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg uppercase tracking-wider">
               Radar
             </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="relative flex-1 p-6 md:p-8 flex flex-col justify-center bg-gradient-to-b from-[#1E293B] to-[#0F172A] md:bg-none">
          <div className="hidden md:block absolute top-6 right-6">
             <div className="bg-[#FF8C42]/10 border border-[#FF8C42]/20 text-[#FF8C42] text-xs font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[#FF8C42] animate-pulse" />
               Hoy en Radar
             </div>
          </div>

          <div className="mb-4">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gray-700 overflow-hidden shrink-0 border border-gray-600">
                   {profiles?.avatar_url ? (
                      <img src={profiles.avatar_url} alt={profiles.username} className="w-full h-full object-cover" />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-600 text-[10px] text-white">
                         {profiles?.username?.charAt(0).toUpperCase()}
                      </div>
                   )}
                </div>
                <span className="text-sm text-gray-400 font-medium">@{profiles?.username}</span>
             </div>
             
             <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight tracking-tight group-hover:text-[#FF8C42] transition-colors">
               {title}
             </h3>
             
             <p className="text-gray-400 text-sm md:text-base line-clamp-2 md:line-clamp-3 leading-relaxed mb-6 font-light border-l-2 border-gray-700 pl-4">
               {story}
             </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
             <Button 
                onClick={handlePlay}
                className="w-full sm:w-auto bg-[#FF8C42] hover:bg-[#ff7a1f] text-white shadow-lg shadow-[#FF8C42]/20 border border-transparent hover:scale-105 transition-all"
             >
                <Play className="w-4 h-4 mr-2 fill-current" /> Escuchar
             </Button>
             
             <Button 
                onClick={handleRead}
                variant="outline"
                className="w-full sm:w-auto border-gray-700 text-gray-300 hover:text-white hover:bg-white/5 hover:border-gray-500"
             >
                <BookOpen className="w-4 h-4 mr-2" /> Leer historia
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPostCard;