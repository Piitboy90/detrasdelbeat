import React from 'react';
import { FileQuestion, Bookmark, MessageSquare, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const EmptyState = ({ 
  type = 'feed', // 'feed' | 'saved' | 'comments' | 'external'
  onAction,
  className
}) => {
  
  const content = {
    feed: {
      icon: Sparkles,
      title: "Aquí aún no suena nada…",
      subtitle: "¿Quieres encender la primera chispa?",
      actionLabel: "Publicar historia",
      hasAction: true
    },
    saved: {
      icon: Bookmark,
      title: "Aún no has guardado nada…",
      subtitle: "Guarda una historia y vuelve cuando lo necesites.",
      actionLabel: "Explorar historias",
      hasAction: true
    },
    comments: {
      icon: MessageSquare,
      title: "Aún no hay respuestas…",
      subtitle: "Sé el primero en responder.",
      actionLabel: "Escribir comentario",
      hasAction: false // Usually just shows the form below
    },
    external: {
      icon: ExternalLink,
      title: "Enlace externo",
      subtitle: "Esta canción vive fuera, pero la historia vive aquí.",
      actionLabel: "Ir a la fuente",
      hasAction: true
    }
  };

  const current = content[type] || content.feed;
  const Icon = current.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex flex-col items-center justify-center py-12 px-6 text-center rounded-2xl border border-dashed border-gray-800 bg-[#0B1221]/50",
        className
      )}
    >
      <div className="w-16 h-16 bg-[#1E293B]/50 rounded-full flex items-center justify-center mb-6 ring-1 ring-[#FF8C42]/20">
        <Icon className="h-8 w-8 text-[#FF8C42] opacity-80" />
      </div>
      
      <h3 className="text-lg md:text-xl font-bold text-white mb-2">{current.title}</h3>
      <p className="text-gray-400 italic text-sm md:text-base mb-8 max-w-sm mx-auto leading-relaxed">
        {current.subtitle}
      </p>
      
      {current.hasAction && onAction && (
        <Button 
          onClick={onAction}
          className="bg-[#FF8C42] hover:bg-[#ff7a1f] text-white font-medium px-8 py-2 rounded-full shadow-[0_0_15px_rgba(255,140,66,0.3)] hover:shadow-[0_0_20px_rgba(255,140,66,0.5)] transition-all duration-300 hover:scale-105"
        >
          {current.actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;