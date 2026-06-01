import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="hero-seam-fix relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax-like effect */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1675292310383-0f4ef53fa3ab" 
          alt="Studio vibes" 
          className="w-full h-full object-cover object-center"
        />
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/80 via-[#0F172A]/60 to-[#0F172A]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-transparent to-[#0F172A]/90"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-white leading-tight drop-shadow-lg relative z-20">
            Música original. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-orange-400">
              Historias reales.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-10 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md relative z-20">
            Comparte tu tema creado en Suno y la historia detrás. 
            Descubre a gente que vibra como tú.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-20">
            <Link to="/feed">
              <Button className="h-14 px-8 text-lg rounded-full bg-[#FF6B35] hover:bg-[#FF8C42] text-white shadow-lg shadow-orange-500/20 hover:scale-105 transition-all duration-300">
                Explorar feed
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link to={user ? "/create" : "/register"}>
              <Button variant="outline" className="h-14 px-8 text-lg rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300">
                <PlusCircle className="mr-2 h-5 w-5" />
                Crear post
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-3 bg-white/50 rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
}

export default HeroSection;