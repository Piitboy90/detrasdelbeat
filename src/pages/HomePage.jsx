import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Sparkles, Play } from 'lucide-react';
import { postsService } from '@/services/postsService';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import MicroRitual from '@/components/MicroRitual';
import RadarBeatStory from '@/components/RadarBeatStory';
import RequestsSongSection from '@/components/RequestsSongSection';
import SessionsCarousel from '@/components/SessionsCarousel';
import CoverArt from '@/components/CoverArt';
import VoicesSection from '@/components/VoicesSection';
import { handleSupabaseError } from '@/lib/supabaseErrorHandler';
import { toHttps } from '@/utils/urlSecurity.js';

function HomePage() {
  const [data, setData] = useState({
    recentPosts: [],
    weeklyFeature: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [recentResult, weeklyResult] = await Promise.allSettled([
          postsService.getRecentPosts(20),
          postsService.getWeeklyFeature()
        ]);

        if (mounted) {
           const recent = recentResult.status === 'fulfilled' ? recentResult.value : [];
           let weekly = weeklyResult.status === 'fulfilled' ? weeklyResult.value : null;
           
           if (!weekly && recent && recent.length > 0) {
             weekly = recent[0];
           }
           
           setData({
             recentPosts: recent || [],
             weeklyFeature: weekly
           });

           if (recentResult.status === 'rejected') {
             console.error("Failed to load recent posts:", handleSupabaseError(recentResult.reason));
             setError("Algunos datos no pudieron cargarse completamente.");
           }
        }
      } catch (err) {
        if (mounted) {
          setError(handleSupabaseError(err));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();
    return () => { mounted = false; };
  }, []);

  const SectionHeader = ({ title, subtitle, microcopy }) => (
    <div className="flex flex-col mb-4 md:mb-6 pl-4 border-l-4 border-[#FF8C42] relative z-20">
      <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight">
        {title}
      </h3>
      {subtitle && (
        <p className="text-gray-400 text-sm md:text-base opacity-90 mt-1.5 font-light">
          {subtitle}
        </p>
      )}
      {microcopy && (
        <p className="text-gray-500 text-xs mt-1 italic font-light">
          {microcopy}
        </p>
      )}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>BeatStory — Historias que suenan.</title>
        <meta name="description" content="La IA pone el sonido. Tú pones el motivo. Comparte música generada por IA y el contexto humano detrás." />
      </Helmet>

      <div>
        <div className="hero-seam-fix relative flex flex-col justify-center overflow-hidden min-h-[85vh] bg-black">
          <div className="absolute inset-0 z-0">
             {/* Video loop premium. Si el usuario tiene prefers-reduced-motion,
                 el CSS lo oculta y deja solo el poster (mismo encuadre). */}
             <video
               className="hero-video w-full h-full object-cover opacity-60"
               src="/hero.mp4"
               poster={toHttps("https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000&auto=format&fit=crop")}
               autoPlay
               loop
               muted
               playsInline
               preload="metadata"
               disablePictureInPicture
               aria-hidden="true"
             />
             {/* Fallback estatico para usuarios con reduce-motion (controlado por CSS) */}
             <img
               className="hero-poster absolute inset-0 w-full h-full object-cover opacity-60"
               src={toHttps("https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000&auto=format&fit=crop")}
               alt=""
               aria-hidden="true"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-black/40 to-black/60" />
             <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
          </div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 py-16"
          >
            <div className="max-w-3xl">
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white leading-[1.1] tracking-tighter mb-5">
                  Historias <br/>
                  <span className="text-[#FF8C42]">que suenan</span>.
                </h1>

                <h2 className="text-gray-300 text-lg sm:text-xl lg:text-2xl font-light leading-relaxed max-w-xl mb-8">
                  La IA pone el sonido. Tú pones el motivo. <br />
                  <span className="text-[#FF8C42]/80 font-medium">BeatStory</span> es donde la tecnología encuentra su alma.
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8">
                   <Button 
                     onClick={() => navigate('/solicitar')}
                     className="bg-[#FF8C42] hover:bg-[#ff7a1f] text-white px-8 py-7 text-lg rounded-full shadow-[0_4px_20px_rgba(255,140,66,0.3)] hover:shadow-[0_6px_24px_rgba(255,140,66,0.4)] transition-all duration-300 group"
                   >
                     Encargar mi canción <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                   </Button>

                   <Button 
                     onClick={() => navigate('/feed')}
                     variant="outline"
                     className="border-white/20 text-white hover:bg-white/10 px-8 py-7 text-lg rounded-full backdrop-blur-sm transition-all duration-300"
                   >
                     Explorar historias
                   </Button>
                </div>
            </div>
          </motion.div>
        </div>

        {error && (
          <div className="bg-red-500/10 border-b border-red-500/20 py-2 px-4 text-center">
             <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        <RequestsSongSection />

        {data.weeklyFeature && (
          <div className="relative py-6 md:py-10 px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#111c33] to-[#0F172A]" />
            <div className="max-w-7xl mx-auto relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative hidden md:block h-full min-h-[400px]">
                     <CoverArt 
                        title={data.weeklyFeature.title}
                        tags={data.weeklyFeature.tags}
                        coverUrl={toHttps(data.weeklyFeature.cover_url)}
                        creator={data.weeklyFeature.profiles?.username}
                        className="w-full h-full absolute inset-0"
                     />
                  </div>
                  
                  <div className="p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center h-full">
                    <div className="mb-4">
                       <span className="inline-block px-3 py-1 rounded-full bg-[#FF8C42]/20 text-[#FF8C42] text-[10px] md:text-xs font-bold uppercase tracking-widest">
                         RADAR BEATSTORY · SEMANAL
                       </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                      {data.weeklyFeature.title}
                    </h2>

                    <h3 className="text-lg md:text-xl text-gray-300 font-light mb-4">
                      Una historia. Un pulso. Un tema que se queda.
                    </h3>

                    <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 line-clamp-2 md:line-clamp-none whitespace-pre-line">
                      {data.weeklyFeature.story || "Cada semana dejo una nueva pieza aquí. Si te toca, vuelve: la siguiente ya viene de camino."}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6">
                      <Button 
                         onClick={() => navigate(`/post/${data.weeklyFeature.id}`)}
                         className="bg-[#FF8C42] hover:bg-[#ff7a1f] text-white px-6 md:px-8 py-5 md:py-6 rounded-full shadow-lg shadow-[#FF8C42]/20 w-full sm:w-auto"
                      >
                         <Play className="w-4 h-4 md:w-5 md:h-5 mr-2 fill-current" /> Escuchar
                      </Button>
                      <Button 
                         onClick={() => navigate(`/post/${data.weeklyFeature.id}`)}
                         variant="ghost" 
                         className="text-white hover:bg-white/10 px-6 md:px-8 py-5 md:py-6 rounded-full border border-white/10 w-full sm:w-auto"
                      >
                         Leer la historia
                      </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-auto pt-4 border-t border-white/10 gap-3">
                       <Link to="/feed" className="text-sm text-[#FF8C42] hover:text-white transition-colors order-1 sm:order-2 flex items-center">
                        Sigue explorando <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                      <span className="text-xs text-gray-500 italic order-2 sm:order-1 opacity-70">
                        La canción pasa… y la historia se queda.
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 relative z-10">
           <motion.section 
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-50px" }}
             transition={{ duration: 0.4 }}
           >
              <SectionHeader title="Radar BeatStory" subtitle="Lo que suena esta semana en nuestra comunidad" />
              <RadarBeatStory posts={data.recentPosts} />
           </motion.section>
        </div>

        <div className="bg-[#0F172A] py-6 md:py-10 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
             <motion.section
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-50px" }}
               transition={{ duration: 0.4 }}
             >
               <div className="flex items-center justify-between mb-6">
                  <SectionHeader 
                    title="Sesiones BeatStory" 
                    subtitle="Selecciona tu mood."
                    microcopy="Aquí suenan mis propias historias. Música hecha con intención, no por casualidad."
                  />
                  <Link 
                     to="/sesiones" 
                     className="text-[#FF8C42] hover:text-white font-medium text-xs sm:text-sm flex items-center gap-1 transition-colors"
                   >
                      Ver todas <ArrowRight className="w-3 h-3" />
                   </Link>
               </div>
               <SessionsCarousel />
             </motion.section>
          </div>
        </div>
        
        <VoicesSection />
        
        <div className="py-8 border-t border-gray-800 relative z-20 bg-[#0A0F1D]">
           <MicroRitual variant="home" />
        </div>
      </div>
    </>
  );
}

export default HomePage;