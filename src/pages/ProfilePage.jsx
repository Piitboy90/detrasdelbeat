import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import { usersService } from '@/services/usersService';
import { postsService } from '@/services/postsService';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Music, Sparkles, BookOpen } from 'lucide-react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import PostCard from '@/components/PostCard';
import EmptyState from '@/components/EmptyState';
import ProgressMap from '@/components/ProgressMap';
import { motion } from 'framer-motion';
import { getPageTitle, getMetaDescription } from '@/lib/seo';
import { cn } from '@/lib/utils';

function ProfilePage() {
  const { username } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ postsCount: 0, likesCount: 0 });
  const [posts, setPosts] = useState([]);
  const [derivedStats, setDerivedStats] = useState({ topMoods: [], favoriteTool: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfileData();
    window.scrollTo(0, 0);
  }, [username]);

  const loadProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch User Profile
      const userProfile = await usersService.getUserByUsername(username);
      
      if (!userProfile) {
        setError("Usuario no encontrado");
        setLoading(false);
        return;
      }
      setProfile(userProfile);

      // 2. Fetch User Stats & Posts in parallel
      const [userStats, userPosts] = await Promise.all([
        usersService.getUserStats(userProfile.user_id),
        postsService.getPostsByUserId(userProfile.user_id)
      ]);

      setStats(userStats);
      setPosts(userPosts);
      
      // 3. Calculate Derived Stats (Moods/Tools)
      const computed = postsService.calculateUserStats(userPosts);
      setDerivedStats(computed);

    } catch (err) {
      console.error("Error loading profile:", err);
      setError("No se pudo cargar el perfil. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center items-center text-white px-4">
        <h2 className="text-2xl font-bold mb-4 text-red-500">Error</h2>
        <p className="text-gray-300 mb-6">{error}</p>
        <div className="flex gap-4">
          <Button onClick={() => navigate('/feed')} variant="ghost">Volver al Feed</Button>
          <Button onClick={loadProfileData}>Reintentar</Button>
        </div>
      </div>
    );
  }

  const isOwnProfile = user && profile && user.id === profile.user_id;

  return (
    <>
      <Helmet>
        <title>{getPageTitle(`${profile?.username} - Perfil`)}</title>
        <meta name="description" content={getMetaDescription(`Perfil de ${profile?.username} en BeatStory. Escucha sus historias y música.`)} />
      </Helmet>

      <div className="min-h-screen bg-[#0F172A] pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           <Button 
              onClick={() => navigate('/feed')} 
              variant="ghost" 
              className="mb-6 text-gray-400 hover:text-white pl-0"
            >
               <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Button>

          <ProfileHeader 
            profile={profile} 
            isOwnProfile={isOwnProfile} 
            stats={stats}
          />

          {/* Progress Map Section */}
          <div className="mt-8">
            <ProgressMap stats={{
               postsCount: stats.postsCount,
               bookmarksCount: 0, // Profile stats typically don't expose personal bookmarks, would need auth user context or different API
               repliesCount: 0 // Same here, would need enhancement in usersService to fetch reply count
            }} />
          </div>
          
          {/* Manifesto & Insight Stats */}
          {(profile.manifesto || derivedStats.topMoods.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
               {profile.manifesto && (
                  <div className="md:col-span-2 bg-[#1E293B] p-6 rounded-xl border border-gray-800">
                     <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#FF8C42]"/> Manifiesto
                     </h3>
                     <p className="text-gray-300 italic leading-relaxed">"{profile.manifesto}"</p>
                  </div>
               )}
               
               <div className="md:col-span-1 bg-[#1E293B] p-6 rounded-xl border border-gray-800 space-y-4">
                  {derivedStats.topMoods.length > 0 && (
                     <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Top Vibes</h3>
                        <div className="flex flex-wrap gap-2">
                           {derivedStats.topMoods.map(({mood, count}) => (
                              <span key={mood} className={cn("text-xs px-2 py-1 rounded-md border", `badge-mood-${mood.toLowerCase()}`)}>
                                 {mood} ({count})
                              </span>
                           ))}
                        </div>
                     </div>
                  )}
                  {derivedStats.favoriteTool && (
                     <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Herramienta Favorita</h3>
                        <div className="text-sm text-white font-medium">
                           {derivedStats.favoriteTool.name} <span className="text-gray-500 text-xs">({derivedStats.favoriteTool.count} posts)</span>
                        </div>
                     </div>
                  )}
               </div>
            </div>
          )}

          <div className="mt-12">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-4">
              Publicaciones Recientes
            </h3>
            
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState 
                type="feed"
                title="Sin publicaciones"
                subtitle={isOwnProfile ? "Aún no has compartido ninguna historia." : "Este usuario aún no ha publicado nada."}
                actionLabel={isOwnProfile ? "Crea tu primer post" : undefined}
                onAction={isOwnProfile ? () => navigate('/create') : undefined}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;