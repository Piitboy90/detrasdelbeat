import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { bookmarkService } from '@/services/bookmarkService';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const BookmarkButton = ({ postId, onToggle, className }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    
    const checkStatus = async () => {
      if (!postId || !user?.id) return;
      
      try {
        const status = await bookmarkService.hasUserBookmarked(postId, user.id);
        if (mounted) {
          setIsBookmarked(!!status);
        }
      } catch (error) {
        console.error("Failed to check bookmark status:", error);
        if (mounted) setIsBookmarked(false);
      }
    };

    checkStatus();
    
    return () => { mounted = false; };
  }, [postId, user?.id]);

  const handleToggle = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para guardar historias",
        variant: "destructive"
      });
      return;
    }
    
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (!isBookmarked) {
        await bookmarkService.addBookmark(postId, user.id);
        setIsBookmarked(true);
        if (onToggle) onToggle(true);
        toast({
          title: "Guardado",
          className: "bg-[#0F172A] border-[#FF8C42] text-white"
        });
      } else {
        await bookmarkService.removeBookmark(postId, user.id);
        setIsBookmarked(false);
        if (onToggle) onToggle(false);
        toast({
          title: "Eliminado de guardados",
          className: "bg-[#0F172A] border-[#FF8C42] text-white"
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el marcador",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      disabled={isLoading}
      aria-label={isBookmarked ? "Eliminar de guardados" : "Guardar historia"}
      className={cn(
        "p-2 rounded-full transition-all duration-200",
        isBookmarked 
          ? "text-[#FF8C42] drop-shadow-[0_0_8px_rgba(255,140,66,0.4)]" 
          : "text-gray-400 hover:text-[#FF8C42]",
        isLoading ? "opacity-50 cursor-not-allowed" : "",
        className
      )}
    >
      <Bookmark className={cn("w-5 h-5", isBookmarked ? "fill-current" : "")} />
    </motion.button>
  );
};

export default BookmarkButton;