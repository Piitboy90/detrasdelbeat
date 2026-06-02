import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { postsService } from '@/services/postsService';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getMetaDescription } from '@/lib/seo';
import PostCard from '@/components/PostCard'; 
import EmptyState from '@/components/EmptyState';
import FloatingActionButton from '@/components/FloatingActionButton';
import EditorialCard from '@/components/EditorialCard';
import { cn } from '@/lib/utils';
import { useNavigate, useSearchParams } from 'react-router-dom';

function FeedPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeMood, setActiveMood] = useState(null);
  
  const moods = [
    "Nostalgia", "Esperanza", "Rabia", "Calma", "Motivación", "Amor", "Tristeza", "Euforia", "Reflexión"
  ];

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await postsService.getPosts();
      setPosts(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      post.title?.toLowerCase().includes(query) || 
      post.story?.toLowerCase().includes(query) ||
      post.tags?.some(tag => tag.toLowerCase().includes(query));
      
    const matchesMood = !activeMood || post.mood === activeMood;
    return matchesSearch && matchesMood;
  });

  // Magazine Segmentation
  const radarPosts = filteredPosts.slice(0, 1);
  const restPosts = filteredPosts.slice(1);

  const hasFilters = searchQuery || activeMood;

  return (
    <>
      <Helmet>
        <title>Feed | BeatStory</title>
        <meta name="description" content={getMetaDescription("Explora historias de música generada por IA.")} />
      </Helmet>

      <div className="min-h-screen bg-[#0F172A] py-8 px-4 sm:px-6 lg:px-8 pb-32">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header & Controls - sticky bajo el navbar */}
          <div className="sticky top-16 z-40 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 border-b border-[var(--accent-soft)] py-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-[rgba(15,23,42,0.82)] backdrop-blur-md supports-[backdrop-filter]:bg-[rgba(15,23,42,0.6)]">

            <div className="w-full md:w-auto flex-1 max-w-2xl">
               <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF8C42] transition-colors h-5 w-5 pointer-events-none" />
                  <Input
                    placeholder="Buscar por título, historia, género..."
                    className="pl-12 bg-[#1E293B] border-gray-700 text-white focus-visible-orange h-12 rounded-full shadow-inner text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Buscar publicaciones"
                  />
               </div>
            </div>

            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
               {moods.map(mood => (
                  <button
                     key={mood}
                     onClick={() => setActiveMood(activeMood === mood ? null : mood)}
                     className={cn(
                        "px-4 py-2 rounded-full text-xs font-medium transition-all border whitespace-nowrap",
                        activeMood === mood 
                           ? `bg-opacity-20 border-opacity-40 badge-mood-${mood.toLowerCase()} text-white border-white/20`
                           : "bg-[#1E293B] border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"
                     )}
                  >
                     {mood}
                  </button>
               ))}
               {hasFilters && (
                 <button onClick={() => { setSearchQuery(''); setActiveMood(null); }} className="text-xs text-[#FF8C42] hover:text-white underline ml-2 whitespace-nowrap px-2">Limpiar</button>
               )}
            </div>
          </div>

          {/* Content */}
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[...Array(6)].map((_, i) => <div key={i} className="bg-[#1E293B] aspect-[4/3] rounded-xl animate-pulse" />)}
             </div>
          ) : filteredPosts.length === 0 ? (
             <EmptyState 
               type="feed" 
               onAction={() => navigate('/create')} 
               className="mt-12"
             />
          ) : (
             <div className="space-y-12">
                
                {/* Radar Section */}
                {!hasFilters && radarPosts.length > 0 && (
                   <section>
                      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#FF8C42] animate-pulse"></span>
                        Destacado
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {radarPosts.map((post, index) => (
                           <PostCard key={post.id} post={post} index={index} />
                         ))}
                         {/* Removed 'Tu historia aqui' block per requirements */}
                      </div>
                   </section>
                )}

                {/* Editorial Card Insertion */}
                {!hasFilters && <EditorialCard />}

                {/* Main Feed Grid */}
                <section>
                   <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-gray-600 pl-4">{hasFilters ? `Resultados (${filteredPosts.length})` : "Descubrimientos Recientes"}</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {hasFilters ? filteredPosts.map((post, index) => (
                        <PostCard key={post.id} post={post} index={index} />
                      )) : restPosts.map((post, index) => (
                        <PostCard key={post.id} post={post} index={index} />
                      ))}
                   </div>
                </section>
             </div>
          )}
        </div>
        
        <FloatingActionButton />
      </div>
    </>
  );
}

export default FeedPage;