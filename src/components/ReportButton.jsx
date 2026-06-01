import React, { useState } from 'react';
import { Flag, X, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ReportButton = ({ postId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('Spam');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleOpen = (e) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
         toast({ title: "Inicia sesión", description: "Debes estar logueado para reportar.", variant: "destructive" });
         return;
      }

      const { error } = await supabase.from('reports').insert({
        post_id: postId,
        reported_by: user.id,
        reason,
        description
      });

      if (error) throw error;

      toast({
        title: "Reporte enviado",
        description: "Gracias por ayudarnos a mantener SoundShare seguro.",
        className: "bg-[#0F172A] border-[#FF8C42] text-white"
      });
      setIsOpen(false);
      setDescription('');
      setReason('Spam');
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "No se pudo enviar el reporte.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={handleOpen}
        className="p-2 text-gray-500 hover:text-red-400 transition-colors rounded-full hover:bg-white/5"
        aria-label="Reportar contenido"
      >
        <Flag className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0F172A] border border-gray-700 w-full max-w-md rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="text-[#FF8C42]" /> Reportar contenido
                  </h3>
                  <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Motivo</label>
                    <select 
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full bg-[#1E293B] border border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-[#FF8C42] focus:outline-none"
                    >
                      <option value="Spam">Spam o engañoso</option>
                      <option value="Contenido de odio">Contenido de odio o abusivo</option>
                      <option value="Sexual">Contenido sexual explícito</option>
                      <option value="Violencia">Violencia o autolesión</option>
                      <option value="Otro">Otro motivo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Descripción (opcional)</label>
                    <Textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Danos más detalles..."
                      className="bg-[#1E293B] border-gray-600 text-white min-h-[100px]"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-[#FF8C42] hover:bg-[#ff7a1f] text-white"
                    >
                      {isSubmitting ? "Enviando..." : "Enviar reporte"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ReportButton;