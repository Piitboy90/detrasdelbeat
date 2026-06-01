import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { likesService } from '@/services/likesService';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

function LikeButton({ postId }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchLikes = async () => {
      try {
        const count = await likesService.getLikes(postId);
        if (mounted) setLikesCount(count || 0);

        if (user) {
          const liked = await likesService.hasUserLiked(postId, user.id);
          if (mounted) setIsLiked(liked);
        }
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };
    fetchLikes();
    return () => { mounted = false; };
  }, [postId, user]);

  const handleToggleLike = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para dar me gusta.",
        variant: "destructive"
      });
      return;
    }

    if (loading) return;
    setLoading(true);

    // Optimistic UI update
    const previousLiked = isLiked;
    const previousCount = likesCount;
    
    setIsLiked(!previousLiked);
    setLikesCount(previousLiked ? previousCount - 1 : previousCount + 1);

    try {
      if (previousLiked) {
        await likesService.removeLike(postId, user.id);
      } else {
        await likesService.addLike(postId, user.id);
      }
    } catch (error) {
      // Revert if error
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      toast({ title: "Error", description: "No se pudo actualizar el me gusta.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleToggleLike}
      className={cn(
        "group flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300",
        isLiked ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "hover:bg-gray-800 text-gray-400 hover:text-red-400"
      )}
    >
      <motion.div
        whileTap={{ scale: 0.8 }}
        animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
      >
        <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
      </motion.div>
      <span className="font-medium text-sm">{likesCount}</span>
    </Button>
  );
}

export default LikeButton;