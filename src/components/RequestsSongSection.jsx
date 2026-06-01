import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RequestsSongSection = () => {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden w-full bg-[#0F172A]">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1E293B]/40 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8C42]/10 border border-[#FF8C42]/20 text-[#FF8C42] text-xs font-bold uppercase tracking-widest"
          >
            <Mic2 className="w-3 h-3" />
            SOLICITUDES DE CANCIONES
          </motion.div>
          
          {/* Title */}
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight"
          >
            Cuéntame tu historia. <br />
            <span className="text-[#FF8C42]">
              Yo la convierto en música.
            </span>
          </motion.h2>
          
          {/* Paragraph */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            ¿Tienes una dedicatoria pendiente? ¿Un sentimiento que no sabes explicar?
            <br className="hidden md:block" />
            Déjamelo a mí. Crearé una canción única con IA basada en tu relato.
          </motion.p>

          {/* Steps */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, delay: 0.3 }}
            className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 pt-6 pb-4"
          >
            {/* Step 1 */}
            <div className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-sm font-bold text-gray-300">1</div>
              <span className="text-sm font-medium text-gray-300">Relatas</span>
            </div>
            
            <div className="hidden sm:block w-8 h-px bg-gray-700/50" />

            {/* Step 2 (Active/Orange) */}
            <div className="flex items-center gap-3 relative">
              <div className="absolute inset-0 bg-[#FF8C42]/20 blur-xl rounded-full" />
              <div className="w-8 h-8 rounded-full bg-[#FF8C42] flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-[#FF8C42]/25 relative z-10">2</div>
              <span className="text-sm font-bold text-[#FF8C42] relative z-10">Produzco</span>
            </div>

            <div className="hidden sm:block w-8 h-px bg-gray-700/50" />

            {/* Step 3 */}
            <div className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-sm font-bold text-gray-300">3</div>
              <span className="text-sm font-medium text-gray-300">Recibes</span>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, delay: 0.4 }}
            className="pt-4"
          >
            <Link to="/solicitar">
              <Button className="bg-[#FF8C42] hover:bg-[#ff7a1f] text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-[#FF8C42]/20 hover:shadow-[#FF8C42]/30 transition-all group">
                Encargar canción <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default RequestsSongSection;