import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { bookmarkService } from '@/services/bookmarkService';
import { getPageTitle } from '@/lib/seo';
import PostCard from '@/components/PostCard';
import { Loader2, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import EmptyState from '@/components/EmptyState';
import { useNavigate } from 'react-router-dom';

function SavedPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const data = await bookmarkService.getBookmarkedPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching saved posts', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

  return (
    <>
      <Helmet><title>Historias Guardadas | BeatStory</title></Helmet>
      
      <div className="min-h-screen bg-[#0F172A] py-8 px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-6">
            <div className="bg-[#FF8C42]/10 p-3 rounded-full">
               <Bookmark className="w-8 h-8 text-[#FF8C42]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Mis historias guardadas</h1>
              <p className="text-gray-400 text-sm">Tu colección personal de sonidos favoritos.</p>
            </div>
          </div>

          {loading ? (
             <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#FF8C42] animate-spin" />
             </div>
          ) : posts.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))}
             </div>
          ) : (
             <EmptyState 
                type="saved"
                onAction={() => navigate('/feed')}
             />
          )}
        </div>
      </div>
    </>
  );
}

export default SavedPostsPage;