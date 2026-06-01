import React from 'react';
import { Instagram, Youtube, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

function SocialLinks({ links }) {
  const { instagram_url, tiktok_url, youtube_url } = links || {};
  
  if (!instagram_url && !tiktok_url && !youtube_url) return null;

  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {instagram_url && (
        <a href={instagram_url} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon" className="hover:text-pink-500 hover:bg-pink-500/10 text-gray-400 rounded-full">
            <Instagram className="h-5 w-5" />
          </Button>
        </a>
      )}
      {tiktok_url && (
        <a href={tiktok_url} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon" className="hover:text-cyan-400 hover:bg-cyan-400/10 text-gray-400 rounded-full">
            <Music className="h-5 w-5" />
          </Button>
        </a>
      )}
      {youtube_url && (
        <a href={youtube_url} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon" className="hover:text-red-500 hover:bg-red-500/10 text-gray-400 rounded-full">
            <Youtube className="h-5 w-5" />
          </Button>
        </a>
      )}
    </div>
  );
}

export default SocialLinks;