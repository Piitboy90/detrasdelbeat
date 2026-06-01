import React from 'react';
import { Star, CheckCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

function ReviewCard({ review, className }) {
  const { rating, text, created_at, username, avatar_url } = review;
  
  return (
    <div className={cn(
      "bg-[#0F172A]/80 backdrop-blur-sm border border-gray-800 rounded-xl p-6 flex flex-col h-full hover:border-[#FF8C42]/30 transition-colors group",
      className
    )}>
      {/* Header with User Info and Rating */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center shrink-0 border border-gray-600 group-hover:border-[#FF8C42]/50 transition-colors">
            {avatar_url ? (
              <img src={avatar_url} alt={username} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">
                {username || "Usuario BeatStory"}
              </span>
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#FF8C42]/10 border border-[#FF8C42]/20">
                 <CheckCircle className="w-3 h-3 text-[#FF8C42]" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
               <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "w-3 h-3", 
                      i < rating ? "text-[#FF8C42] fill-[#FF8C42]" : "text-gray-600"
                    )} 
                  />
                ))}
              </div>
              <span className="text-[10px] text-gray-500">•</span>
              <span className="text-[10px] text-gray-500">
                {created_at && formatDistanceToNow(new Date(created_at), { addSuffix: true, locale: es })}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Review Text */}
      <div className="relative">
        <p className="text-gray-300 text-sm leading-relaxed italic">
          "{text && text.length > 220 ? `${text.substring(0, 220)}...` : text}"
        </p>
      </div>
    </div>
  );
}

export default ReviewCard;