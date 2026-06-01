import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { postsService } from '@/services/postsService';
import { Button } from '@/components/ui/button';
import { PostSkeleton } from '@/components/LoadingSkeletons';

function FeaturedPost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        let data = null;
        
        // Attempt to fetch the weekly featured post
        try {
          data = await postsService.getWeeklyFeature();
        } catch (err) {
          console.warn("No weekly feature found or query error, attempting fallback to latest post.", err);
        }

        // Fallback: If no weekly feature exists, fetch the latest post
        if (!data) {
          try {
            data = await postsService.getLatestPost();
          } catch (fallbackErr) {
            console.error("Failed to fetch fallback post:", fallbackErr);
          }
        }

        setPost(data);
      } catch (error) {
        console.error("Failed to fetch featured post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="hero-seam-fix py-16 bg-[#0F172A] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-8">
            <div className="h-8 w-48 bg-gray-800 rounded-md animate-pulse"></div>
          </div>
          <PostSkeleton />
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="hero-seam-fix py-16 bg-[#0F172A] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="bg-[#1E293B] rounded-xl p-10 border border-gray-700 relative z-20">
            <h3 className="text-2xl font-bold text-white mb-2">No hay posts aún</h3>
            <p className="text-gray-400 mb-6">¡Sé el primero en compartir tu historia!</p>
            <Link to="/create">
               <Button className="bg-[#FF6B35] hover:bg-[#FF8C42] text-white">
                 Crear primer post
               </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-seam-fix py-16 bg-[#0F172A] border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center gap-3 mb-8 relative z-20">
          <div className="h-1 w-10 bg-[#FF6B35] rounded-full"></div>
          <h2 className="text-2xl font-bold text-white tracking-wide uppercase">Destacado</h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-2xl overflow-hidden shadow-2xl border border-gray-700 hover:border-[#FF6B35]/30 hover:shadow-[#FF6B35]/10 transition-all duration-300 group z-20"
        >
          <div className="grid md:grid-cols-2 gap-0 relative">
            {/* Left Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1 relative z-20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF6B35] to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden">
                   {post.profiles?.avatar_url ? (
                     <img src={post.profiles.avatar_url} alt={post.profiles.username} className="w-full h-full object-cover" />
                   ) : (
                     post.profiles?.username?.charAt(0).toUpperCase() || '?'
                   )}
                </div>
                <div>
                   <p className="text-white font-medium">{post.profiles?.username || 'Usuario Desconocido'}</p>
                   <p className="text-gray-500 text-xs flex items-center gap-1">
                     <Clock className="w-3 h-3" /> Publicado recientemente
                   </p>
                </div>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-[#FF6B35] transition-colors">
                {post.title}
              </h3>
              
              <p className="text-gray-400 text-lg mb-8 leading-relaxed line-clamp-3 md:line-clamp-4">
                {post.story}
              </p>

              <Link to={`/post/${post.id}`}>
                <Button className="bg-[#FF6B35] hover:bg-[#FF8C42] text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-orange-500/20 w-full sm:w-auto">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Escuchar / Leer
                </Button>
              </Link>
            </div>

            {/* Right Visual */}
            <div className="relative h-64 md:h-auto bg-[#000] order-1 md:order-2 overflow-hidden z-10">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-orange-900/40 mix-blend-overlay z-10"></div>
               <img 
                 src={post.cover_url || "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop"}
                 alt="Music vibes" 
                 className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
               />
               
               <div className="absolute top-6 right-6 z-20 flex gap-2">
                  {post.tags?.slice(0, 2).map(tag => (
                    <span key={tag} className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs rounded-full font-medium">
                      #{tag}
                    </span>
                  ))}
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedPost;