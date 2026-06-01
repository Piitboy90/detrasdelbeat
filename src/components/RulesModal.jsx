import React from 'react';
import { X, ShieldCheck, AlertCircle, MessageSquare, Copyright } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const RulesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const rules = [
    {
      icon: ShieldCheck,
      title: "Solo música generada por IA",
      desc: "BeatStory es un espacio para creaciones de IA (Suno, Udio, etc.). Queremos explorar esta nueva frontera."
    },
    {
      icon: MessageSquare,
      title: "Contexto humano obligatorio",
      desc: "No publiques solo un link. Cuéntanos qué sentías, qué buscabas o qué significa para ti la letra."
    },
    {
      icon: Copyright,
      title: "Respeto al copyright",
      desc: "No subas contenido con derechos de autor de terceros sin autorización. Sé original."
    },
    {
      icon: AlertCircle,
      title: "Comunidad segura",
      desc: "Sé respetuoso. Si ves contenido ofensivo o spam, repórtalo inmediatamente."
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#0F172A] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
        >
           <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#FF8C42] to-orange-600" />
           
           <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-white">Normas de la comunidad</h2>
                 <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="space-y-4">
                 {rules.map((rule, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-xl bg-[#1E293B]/50 border border-gray-800 hover:border-[#FF8C42]/30 transition-colors">
                       <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF8C42]/10 flex items-center justify-center">
                          <rule.icon className="w-5 h-5 text-[#FF8C42]" />
                       </div>
                       <div>
                          <h3 className="font-semibold text-white mb-1">{rule.title}</h3>
                          <p className="text-sm text-gray-400 leading-relaxed">{rule.desc}</p>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="mt-8 pt-4 border-t border-gray-800 flex justify-end">
                 <Button onClick={onClose} className="bg-[#FF8C42] hover:bg-[#ff7a1f] text-white">
                    Entendido
                 </Button>
              </div>
           </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RulesModal;