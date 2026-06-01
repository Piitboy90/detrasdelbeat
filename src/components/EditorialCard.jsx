import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const EditorialCard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 md:p-12 text-center my-12 group"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#FF8C42]/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full translate-x-1/2 translate-y-1/2" />
      
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF8C42]/10 border border-[#FF8C42]/20 text-[#FF8C42] text-xs font-medium uppercase tracking-widest">
          <Sparkles className="w-3 h-3" />
          Editorial
        </div>

        <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-white leading-relaxed italic opacity-90">
          "Entre datos y latidos, la IA encuentra sonidos. <br className="hidden md:block" />
          Pero el alma no se programa: <br className="hidden md:block" />
          se nombra en tu historia… y se transforma."
        </h3>

        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#FF8C42]/50 to-transparent" />

        <p className="text-sm text-gray-400 font-medium tracking-wide uppercase">
          Sigue explorando
        </p>
      </div>
    </motion.div>
  );
};

export default EditorialCard;