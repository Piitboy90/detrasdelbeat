import React from 'react';
import { Music, Share2, Users } from 'lucide-react';
import { motion } from 'framer-motion';

function HowItWorks() {
  const steps = [
    {
      icon: Music,
      title: "1. Crea tu tema",
      description: "Usa Suno AI o tu herramienta favorita para generar una canción única que exprese lo que sientes."
    },
    {
      icon: Share2,
      title: "2. Publica tu historia",
      description: "Sube el link de tu canción y escribe la historia real detrás de ella. ¿Qué te inspiró? ¿Qué significa para ti?"
    },
    {
      icon: Users,
      title: "3. Conecta",
      description: "Recibe feedback, descubre otros creadores y forma parte de una comunidad que valora el fondo, no solo la forma."
    }
  ];

  return (
    <section className="hero-seam-fix py-24 bg-[#0F172A] relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-50 z-0"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 relative z-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Cómo funciona BeatStory?</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Tres simples pasos para dar vida a tus creaciones musicales.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative z-20">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-[#1E293B] p-8 rounded-2xl border border-gray-700 shadow-lg hover:shadow-xl hover:shadow-[#FF6B35]/5 hover:border-[#FF6B35]/40 transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#0F172A] border border-gray-700 flex items-center justify-center mb-6 group-hover:border-[#FF6B35] transition-colors">
                  <Icon className="h-8 w-8 text-[#FF6B35]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;