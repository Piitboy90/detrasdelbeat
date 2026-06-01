import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Music } from 'lucide-react';
import { postsService } from '@/services/postsService';
import { Button } from '@/components/ui/button';
import TrackCard from '@/components/TrackCard';
import FloatingActionButton from '@/components/FloatingActionButton';
import { motion } from 'framer-motion';

function SessionsPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const data = await postsService.getSessionPosts(null); // Fetch all posts
        setSessions(data);
      } catch (err) {
        console.error("Failed to load sessions page", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  return (
    <>
      <Helmet>
        <title>Sesiones | BeatStory</title>
        <meta name="description" content="Canciones creadas con IA, elegidas con intención. Sesiones de piitboy90." />
      </Helmet>

      <div className="min-h-screen bg-[#1a1f3a] pb-24">
        {/* Header Section */}
        <div className="pt-8 pb-8 px-4 sm:px-6 relative">
          <Button 
             variant="ghost" 
             onClick={() => navigate('/')}
             className="absolute top-6 left-4 text-gray-400 hover:text-white hover:bg-white/10 p-2 h-auto"
          >
             <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="max-w-4xl mx-auto text-center mt-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-[28px] sm:text-[36px] md:text-[40px] font-bold text-white mb-2 leading-tight">
                Sesiones de piitboy90
              </h1>
              <p className="text-[14px] text-gray-300 opacity-80 max-w-lg mx-auto leading-relaxed">
                Canciones creadas con IA, elegidas con intención.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1,2,3,4,5,6].map(i => (
                   <div key={i} className="aspect-[3/4] rounded-lg bg-white/5 animate-pulse border border-white/5" />
                ))}
             </div>
          ) : error ? (
             <div className="text-center py-20">
                <p className="text-red-400">No se pudieron cargar las sesiones.</p>
             </div>
          ) : sessions.length === 0 ? (
             <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
                <Music className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Próximamente</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              
              {/* Desktop/Tablet: Grid of Cards */}
              {sessions.map((post) => (
                <div key={post.id} className="hidden sm:block">
                  <TrackCard post={post} />
                </div>
              ))}

              {/* Mobile View: List Items */}
              <div className="sm:hidden space-y-4">
                {sessions.map((post) => {
                   const hook = post.community_question || post.story || "Escucha esta historia";
                   const truncatedHook = hook.length > 50 ? hook.substring(0, 50) + "..." : hook;

                   return (
                     <motion.div 
                        key={post.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/post/${post.id}`)}
                        className="flex items-center gap-3 bg-white/5 border border-[#FF8C42]/20 p-3 rounded-lg backdrop-blur-md active:bg-white/10 transition-colors"
                     >
                        {/* Small Cover */}
                        <div className="w-[60px] h-[60px] flex-shrink-0 rounded-md overflow-hidden bg-black/30">
                           {post.cover_url ? (
                              <img src={post.cover_url} className="w-full h-full object-cover" alt={post.title} />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-800"><Music className="w-5 h-5 text-gray-500" /></div>
                           )}
                        </div>
                        
                        {/* Text Info */}
                        <div className="flex-1 min-w-0">
                           <h4 className="text-white font-bold text-[14px] truncate">{post.title}</h4>
                           <p className="text-gray-400 text-[12px] line-clamp-1">{truncatedHook}</p>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-col gap-1 items-end">
                           <Button size="icon" className="w-8 h-8 rounded-full bg-[#FF8C42] text-white hover:bg-[#ff7a1f]" onClick={(e) => { e.stopPropagation(); navigate(`/post/${post.id}`); }}>
                              <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                           </Button>
                        </div>
                     </motion.div>
                   )
                })}
              </div>

            </div>
          )}
        </div>

        <FloatingActionButton />
      </div>
    </>
  );
}

export default SessionsPage;