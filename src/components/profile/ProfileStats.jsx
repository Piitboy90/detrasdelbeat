import React from 'react';
import { Music, Heart } from 'lucide-react';

function ProfileStats({ stats }) {
  return (
    <div className="flex gap-8 justify-center py-4 border-y border-gray-800/50 my-6 bg-black/20 rounded-lg">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-white flex items-center gap-2">
          <Music className="h-5 w-5 text-[#FF6B35]" />
          {stats?.postsCount || 0}
        </span>
        <span className="text-xs text-gray-400 uppercase tracking-wider font-medium mt-1">Posts</span>
      </div>
      <div className="w-px bg-gray-800" />
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-white flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          {stats?.likesCount || 0}
        </span>
        <span className="text-xs text-gray-400 uppercase tracking-wider font-medium mt-1">Likes Recibidos</span>
      </div>
    </div>
  );
}

export default ProfileStats;