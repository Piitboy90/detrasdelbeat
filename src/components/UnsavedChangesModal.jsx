import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function UnsavedChangesModal({ isOpen, onContinueEditing, onDiscard }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#1E293B] border border-gray-700 rounded-xl p-6 max-w-sm w-full shadow-2xl"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-[#FF8C42]/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-[#FF8C42]" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">
              ¿Salir sin guardar?
            </h3>
            
            <p className="text-gray-400 text-sm mb-6">
              Tienes cambios sin guardar. Si sales ahora, perderás tu progreso.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button 
                onClick={onDiscard}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Salir
              </Button>
              <Button 
                onClick={onContinueEditing}
                className="w-full bg-[#FF8C42] hover:bg-[#ff7a1f] text-white"
              >
                Seguir editando
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default UnsavedChangesModal;