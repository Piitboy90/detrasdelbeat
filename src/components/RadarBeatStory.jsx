import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Music, Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RadarBeatStory = ({ posts }) => {
  const navigate = useNavigate();

  // Filter for posts with Youtube source
  const youtubePost = posts.find(p => 
    (p.source === 'youtube' || (p.youtube_url && p.youtube_url.length > 0))
  );

  if (!youtubePost) {
    return (
      <div className="bg-[#1E293B]/30 rounded-xl border border-dashed border-gray-800 p-8 text-center">
         <p className="text-gray-500 mb-4">No hay destacados de YouTube esta semana.</p>
         <Button onClick={() => navigate('/feed')} variant="outline" className="border-[#FF8C42] text-[#FF8C42]">Explorar Feed</Button>
      </div>
    );
  }

  // Extract video ID safely
  let videoId = null;
  if (youtubePost.youtube_url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = youtubePost.youtube_url.match(regExp);
    videoId = (match && match[2].length === 11) ? match[2] : null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-2xl p-6 sm:p-8 border border-gray-800 shadow-2xl relative overflow-hidden group">
       {/* Background Glow */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF8C42] blur-[120px] opacity-10 group-hover:opacity-15 transition-opacity pointer-events-none" />

       {/* Video Content */}
       <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-700 bg-black">
          {videoId ? (
            <iframe 
              src={`https://www.youtube.com/embed/${videoId}`}
              title={youtubePost.title}
              className="w-full h-full absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
               <ExternalLink className="w-8 h-8" />
            </div>
          )}
       </div>

       {/* Info Content */}
       <div className="relative z-10 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#FF0000] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Play className="w-3 h-3 fill-white" /> YouTube
            </span>
            <span className="text-gray-400 text-[11px] flex items-center gap-1">
              <Music className="w-3 h-3"/> {youtubePost.ai_tool || 'AI Music'}
            </span>
          </div>
          
          <h3 
            onClick={() => navigate(`/post/${youtubePost.id}`)}
            className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight hover:text-[#FF8C42] transition-colors cursor-pointer"
          >
             {youtubePost.title}
          </h3>
          
          <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3 italic opacity-90 border-l-2 border-[#FF8C42] pl-4">
             "{youtubePost.story}"
          </p>

          <div className="flex items-center gap-4">
            <Button 
               onClick={() => navigate(`/post/${youtubePost.id}`)}
               className="bg-[#FF8C42] hover:bg-[#ff7a1f] text-white shadow-lg shadow-[#FF8C42]/20"
            >
               Ver historia completa <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
       </div>
    </div>
  );
};

export default RadarBeatStory;