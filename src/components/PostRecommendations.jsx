import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Music2 } from 'lucide-react';
import TrackCard from '@/components/TrackCard';

const PostRecommendations = ({ posts = [], authorName }) => {
  if (!posts || posts.length === 0) return null;

  // Split logic: 2 from author, 1 random "Next Story"
  const authorPosts = posts.slice(0, 2);
  const nextStory = posts.length > 2 ? posts[2] : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-800/50">
      
      {/* Author Recommendations */}
      <div className="md:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Music2 className="w-5 h-5 text-[#FF8C42]" />
            Más de {authorName || 'este autor'}
          </h3>
          <Link to={`/u/${authorName}`} className="text-sm text-gray-400 hover:text-[#FF8C42] flex items-center gap-1 transition-colors">
            Ver perfil <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {authorPosts.map(post => (
            <TrackCard key={post.id} post={post} compact />
          ))}
          {authorPosts.length === 0 && (
            <p className="text-gray-500 text-sm italic col-span-2">No hay más historias de este autor por ahora.</p>
          )}
        </div>
      </div>

      {/* Next Story Recommendation */}
      <div className="md:col-span-1 space-y-6">
         <h3 className="text-xl font-bold text-white">Siguiente historia</h3>
         {nextStory ? (
           <motion.div 
             whileHover={{ y: -4 }}
             transition={{ duration: 0.2 }}
             className="h-full"
           >
             <TrackCard post={nextStory} />
           </motion.div>
         ) : (
           <div className="h-40 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 text-sm">
             Explora el feed para más
           </div>
         )}
      </div>
    </div>
  );
};

export default PostRecommendations;