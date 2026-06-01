import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const MobileStickyCTA = ({ isVisible, onPublishClick }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-40 md:hidden",
            "bg-[#07122A]/85 backdrop-blur-md border-t border-[#FF8C42]/20 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]",
            "pb-[env(safe-area-inset-bottom)]" // Respect safe area on iOS
          )}
        >
          <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3">
            <span 
              className="text-[13px] text-white/90 font-medium leading-tight max-w-[150px] tracking-wide"
              id="sticky-cta-desc"
            >
              ¿Tienes una historia que suena?
            </span>
            
            <Button
              onClick={onPublishClick}
              className={cn(
                "bg-[#FF8C42] hover:bg-[#FF8C42]/90 text-white",
                "rounded-lg px-4 py-2 h-10 text-sm font-semibold shadow-lg shadow-[#FF8C42]/20",
                "active:scale-95 active:shadow-[0_0_15px_rgba(255,140,66,0.4)] transition-all duration-200",
                "flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#FF8C42] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07122A]"
              )}
              aria-label="Publicar mi historia"
              aria-describedby="sticky-cta-desc"
            >
              <Plus className="w-4 h-4" />
              Publicar
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileStickyCTA;