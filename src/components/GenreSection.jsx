import React from 'react';
import { motion } from 'framer-motion';
import TrackCard from '@/components/TrackCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const GENRE_MAPPING = {
  'rap': 'Rap',
  'hiphop': 'Rap',
  'neosoul': 'Neo-soul',
  'neo-soul': 'Neo-soul',
  'rnb': 'R&B',
  'r&b': 'R&B',
  'lofi': 'Lo-fi / Chill',
  'chill': 'Lo-fi / Chill',
  'lo-fi': 'Lo-fi / Chill',
  'pop': 'Pop',
  'rock': 'Rock',
  'electronic': 'Electrónica',
  'electronica': 'Electrónica'
};

const GenreSection = ({ posts }) => {
  // Group posts by mapped genre
  const groupedPosts = posts.reduce((acc, post) => {
    // Get first tag or default to Others
    const rawTag = post.tags && post.tags.length > 0 ? post.tags[0].toLowerCase() : 'otros';
    
    // Map raw tag to display genre title
    let genreTitle = 'Otros';
    
    // Check if tag matches any key in mapping (partial match allowed for simplicity or direct key match)
    const matchedKey = Object.keys(GENRE_MAPPING).find(key => rawTag.includes(key));
    if (matchedKey) {
      genreTitle = GENRE_MAPPING[matchedKey];
    } else {
      // Capitalize if not mapped
      genreTitle = rawTag.charAt(0).toUpperCase() + rawTag.slice(1);
    }

    if (!acc[genreTitle]) {
      acc[genreTitle] = [];
    }
    
    // Avoid duplicates if same post has multiple tags mapping to same genre (though we only take first tag here)
    if (!acc[genreTitle].find(p => p.id === post.id)) {
      acc[genreTitle].push(post);
    }
    return acc;
  }, {});

  // Sort genres to put "Otros" last and specific ones first if desired
  const genres = Object.keys(groupedPosts).sort((a, b) => {
    if (a === 'Otros') return 1;
    if (b === 'Otros') return -1;
    return a.localeCompare(b);
  });

  if (genres.length === 0) return null;

  return (
    <div className="space-y-12 md:space-y-16">
      {genres.map((genre) => (
        <motion.div 
          key={genre}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Section Title */}
          <div className="flex items-center justify-between mb-6 px-4 sm:px-0 border-b border-gray-800/50 pb-4">
            <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-6 bg-[#FF8C42] rounded-full shadow-[0_0_10px_#FF8C42]"></span>
              {genre}
            </h3>
            <Link 
              to={`/feed?search=${genre.toLowerCase()}`} 
              className="text-xs font-medium text-[#FF8C42] hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider"
            >
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* New Carousel Structure with Utility Classes */}
          <div className="relative group">
            <div className="carousel-container">
              {groupedPosts[genre].map((post) => (
                <div 
                  key={post.id} 
                  className="carousel-item"
                >
                  <TrackCard post={post} />
                </div>
              ))}
            </div>
            
            {/* Fade Gradients for desktop */}
            <div className="hidden sm:block absolute top-0 right-0 bottom-6 w-24 bg-gradient-to-l from-[#0F172A] to-transparent pointer-events-none z-10" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GenreSection;