import React, { useState } from 'react';
import { formatTimeAgo } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Flag, Share2, MoreHorizontal } from 'lucide-react'; 
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import ReportModal from '@/components/ReportModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function PostHeader({ post }) {
  const { toast } = useToast();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Enlace copiado",
        description: "El enlace al post ha sido copiado al portapapeles.",
      });
    });
  };

  const username = post.profiles?.username || 'Usuario';

  return (
    <div className="flex flex-col gap-6 animate-fade-in-down">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Link 
            to={`/u/${username}`}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-red-600 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-[#0F172A] hover:ring-[#FF6B35] transition-all overflow-hidden"
          >
            {post.profiles?.avatar_url ? (
              <img src={post.profiles.avatar_url} alt={username} className="w-full h-full rounded-full object-cover" />
            ) : (
              username.charAt(0).toUpperCase()
            )}
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{post.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
              <Link 
                to={`/u/${username}`}
                className="text-[#FF6B35] font-medium hover:underline cursor-pointer"
              >
                @{username}
              </Link>
              <span>•</span>
              <span>{formatTimeAgo(post.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={copyLink} 
            className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
            title="Copiar enlace"
          >
            <Share2 className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1E293B] border-gray-700 text-white">
              <DropdownMenuItem onClick={() => setIsReportModalOpen(true)} className="hover:bg-gray-700 cursor-pointer text-red-400 focus:text-red-400 focus:bg-gray-700">
                <Flag className="mr-2 h-4 w-4" /> Reportar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, i) => (
            <span 
              key={i} 
              className="px-3 py-1 bg-[#1E293B] hover:bg-[#2C3E50] text-[#FF6B35] rounded-full text-xs font-medium border border-[#FF6B35]/20 transition-colors cursor-default"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        postId={post.id} 
      />
    </div>
  );
}

export default PostHeader;