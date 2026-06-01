import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, PlayCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { formatTimeAgo } from '@/lib/utils';

function PostCardImproved({ post }) {
  const profile = post.profiles || {};
  const username = profile.username || 'Usuario';
  const avatarUrl = profile.avatar_url;
  const likesCount = post.likes?.[0]?.count || 0;
  
  const hasCover = !!post.cover_url;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-[#1E293B] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-800 flex flex-col h-full"
    >
      <Link to={`/post/${post.id}`} className="block relative aspect-video overflow-hidden">
        {hasCover ? (
          <>
            <img 
              src={post.cover_url} 
              alt={post.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] to-transparent opacity-80" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0F172A] to-[#334155] flex items-center justify-center relative">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             <PlayCircle className="w-16 h-16 text-white/10 group-hover:text-[#FF8C42] transition-colors duration-300" />
          </div>
        )}
        
        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pt-12 bg-gradient-to-t from-[#1E293B] via-[#1E293B]/80 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-orange-500 overflow-hidden ring-1 ring-white/20">
              {avatarUrl ? (
                 <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
              ) : (
                 <div className="w-full h-full flex items-center justify-center text-[10px] text-white font-bold">
                   {username.charAt(0).toUpperCase()}
                 </div>
              )}
            </div>
            <span className="text-xs font-medium text-gray-300 shadow-black drop-shadow-md">@{username}</span>
          </div>
          <h3 className="text-lg font-bold text-white leading-tight line-clamp-1 group-hover:text-[#FF8C42] transition-colors">
            {post.title}
          </h3>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/post/${post.id}`} className="block flex-grow">
          <p className="text-sm text-gray-400 line-clamp-3 mb-4 leading-relaxed">
            {post.story}
          </p>
        </Link>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700/50">
           <div className="flex items-center gap-1 text-xs text-gray-500">
             <Clock className="w-3 h-3" />
             {formatTimeAgo(post.created_at)}
           </div>

           <div className="flex items-center gap-3">
             <div className="flex items-center gap-1 text-red-400">
               <Heart className="w-4 h-4" />
               <span className="text-xs font-semibold">{likesCount}</span>
             </div>
             {post.tags?.[0] && (
               <span className="px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 text-[10px] uppercase tracking-wider border border-gray-700">
                 #{post.tags[0]}
               </span>
             )}
           </div>
        </div>
      </div>
    </motion.div>
  );
}

export default PostCardImproved;