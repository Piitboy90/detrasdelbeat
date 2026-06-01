import React, { useState, useEffect } from 'react';
import { postsService } from '@/services/postsService';
import SessionsSelector from '@/components/SessionsSelector';
import MiniSessionCard from '@/components/MiniSessionCard';
import { Loader2 } from 'lucide-react';

function SessionsCarousel() {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        // Fetch a larger batch to allow client-side filtering
        const data = await postsService.getRecentPosts(30); 
        setAllPosts(data || []);
        setFilteredPosts(data ? data.slice(0, 3) : []);
      } catch (err) {
        console.error("Failed to load sessions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  useEffect(() => {
    if (!allPosts.length) return;

    if (selectedGenre === 'Todos') {
      setFilteredPosts(allPosts.slice(0, 3));
    } else {
      const filtered = allPosts.filter(post => {
        const tags = post.tags || [];
        // Check if any tag includes the genre string (case insensitive)
        return tags.some(tag => tag.toLowerCase().includes(selectedGenre.toLowerCase()));
      });
      setFilteredPosts(filtered.slice(0, 3));
    }
  }, [selectedGenre, allPosts]);

  const handleSelectGenre = (genre) => {
    setSelectedGenre(genre);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-[#FF8C42] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <SessionsSelector 
        selectedGenre={selectedGenre} 
        onSelectGenre={handleSelectGenre} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <MiniSessionCard key={post.id} post={post} />
          ))
        ) : (
          <div className="col-span-full py-8 text-center bg-white/5 rounded-lg border border-dashed border-white/10">
            <p className="text-sm text-gray-500">No hay sesiones en este género aún.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SessionsCarousel;