import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Play, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { likesService } from '@/services/likesService';
import { bookmarkService } from '@/services/bookmarkService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { handleSupabaseError } from '@/lib/supabaseErrorHandler';
import { toHttps } from '@/utils/urlSecurity.js';

function PostCard({ post, className }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [likes, setLikes] = useState(post.likes?.[0]?.count || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const commentsCount = post.comments?.[0]?.count || 0;
  const profile = post.profiles || {};
  const username = profile.username || 'Anon';
  
  const storyExcerpt = post.story?.length > 100
    ? post.story.substring(0, 100) + '...'
    : post.story;

  useEffect(() => {
    let mounted = true;

    const checkStatus = async () => {
      if (!user || !post?.id) return;

      try {
        const [liked, bookmarked] = await Promise.all([
          likesService.hasUserLiked(post.id, user.id).catch(() => false),
          bookmarkService.hasUserBookmarked(post.id, user.id).catch(() => false)
        ]);
        
        if (mounted) {
          setIsLiked(!!liked);
          setIsBookmarked(!!bookmarked);
        }
      } catch (error) {
        console.error("Failed to check status", error);
      }
    };

    checkStatus();

    return () => { mounted = false; };
  }, [user, post?.id]);

  const handleToggleLike = async (e) => {
    e.stopPropagation();
    if (!user) return toast({ title: "Inicia sesión", description: "Debes iniciar sesión para dar like", variant: "destructive" });
    
    const prevLiked = isLiked;
    const prevLikesCount = likes;

    setIsLiked(!prevLiked);
    setLikes(prev => !prevLiked ? prev + 1 : Math.max(0, prev - 1));

    try {
      await likesService.toggleLike(post.id, user.id);
    } catch (error) {
      setIsLiked(prevLiked);
      setLikes(prevLikesCount);
      toast({ title: "Error", description: handleSupabaseError(error), variant: "destructive" });
    }
  };

  const handleToggleBookmark = async (e) => {
    e.stopPropagation();
    if (!user) return toast({ title: "Inicia sesión", description: "Debes iniciar sesión para guardar", variant: "destructive" });
    
    const prevBookmarked = isBookmarked;
    setIsBookmarked(!prevBookmarked);

    try {
      if (!prevBookmarked) {
        await bookmarkService.addBookmark(post.id, user.id);
        toast({ title: "Guardado", description: "Post guardado en tu biblioteca" });
      } else {
        await bookmarkService.removeBookmark(post.id, user.id);
        toast({ title: "Eliminado", description: "Post eliminado de tu biblioteca" });
      }
    } catch (error) {
      setIsBookmarked(prevBookmarked);
      toast({ title: "Error", description: handleSupabaseError(error), variant: "destructive" });
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${toHttps(window.location.origin)}/post/${post.id}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Enlace copiado", description: "El enlace ha sido copiado al portapapeles" });
  };

  const displayTags = post.tags ? post.tags.slice(0, 2) : [];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        "group relative flex flex-col bg-[#0F172A] rounded-xl overflow-hidden border border-white/5 hover:border-[#FF8C42]/30 transition-all duration-300 shadow-lg hover:shadow-[#FF8C42]/5 cursor-pointer w-full h-[320px] sm:h-[340px]",
        className
      )}
      onClick={() => navigate(`/post/${post.id}`)}
    >
      <div className="relative h-[55%] w-full overflow-hidden bg-gray-900">
        {post.cover_url ? (
          <img 
            src={toHttps(post.cover_url)} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full editorial-fallback-gradient relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white/10 text-6xl font-black italic tracking-tighter">BS</span>
             </div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-90" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
          <div className="w-12 h-12 rounded-full bg-[#FF8C42]/90 text-white flex items-center justify-center backdrop-blur-sm shadow-[0_0_20px_rgba(255,140,66,0.4)]">
             <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap max-w-[80%]">
          {displayTags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-medium text-white uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4 relative z-10">
        <div className="flex items-center gap-1.5 mb-2">
           <div className="w-4 h-4 rounded-full bg-[#FF8C42] flex items-center justify-center text-[8px] font-bold text-white">
              {username.charAt(0).toUpperCase()}
           </div>
           <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
              {username}
           </span>
        </div>

        <h3 className="text-lg font-bold text-white leading-tight mb-2 line-clamp-1 group-hover:text-[#FF8C42] transition-colors">
          {post.title}
        </h3>
        
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3 h-[2.5em]">
          {storyExcerpt}
        </p>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-3">
             <button onClick={handleToggleLike} className="group/btn flex items-center gap-1">
                <Heart className={cn("w-3.5 h-3.5 transition-colors", isLiked ? "fill-red-500 text-red-500" : "text-gray-500 group-hover/btn:text-white")} />
                <span className="text-[10px] text-gray-500 font-medium">{likes}</span>
             </button>
             
             <div className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[10px] text-gray-500 font-medium">{commentsCount}</span>
             </div>
          </div>

          <div className="flex items-center gap-2">
             <button onClick={handleToggleBookmark} className="text-gray-500 hover:text-[#FF8C42] transition-colors">
                <Bookmark className={cn("w-3.5 h-3.5", isBookmarked && "fill-[#FF8C42] text-[#FF8C42]")} />
             </button>
             <button onClick={handleShare} className="text-gray-500 hover:text-white transition-colors">
                <Share2 className="w-3.5 h-3.5" />
             </button>
             <span className="text-[10px] font-bold text-[#FF8C42] uppercase tracking-wider ml-1 group-hover:underline">
               Leer
             </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default PostCard;