import { Music, Video, Disc, Mic2, Smartphone, Link as LinkIcon, Instagram as InstagramIcon, PlayCircle } from 'lucide-react';

export const getProviderInfo = (url) => {
  if (!url) return { name: 'Desconocido', icon: LinkIcon, color: '#64748b', allowsEmbed: false, isAI: false, id: 'unknown' };
  
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    return { name: 'YouTube', icon: Video, color: '#FF0000', allowsEmbed: true, isAI: false, id: 'youtube' };
  }
  if (lowerUrl.includes('vimeo.com')) {
    return { name: 'Vimeo', icon: Video, color: '#1AB7EA', allowsEmbed: true, isAI: false, id: 'vimeo' };
  }
  if (lowerUrl.includes('soundcloud.com')) {
    return { name: 'SoundCloud', icon: Disc, color: '#FF5500', allowsEmbed: true, isAI: false, id: 'soundcloud' };
  }
  if (lowerUrl.includes('spotify.com')) {
    return { name: 'Spotify', icon: Music, color: '#1DB954', allowsEmbed: true, isAI: false, id: 'spotify' };
  }
  if (lowerUrl.includes('suno.com')) {
    return { name: 'Suno', icon: Mic2, color: '#FF8C42', allowsEmbed: true, isAI: true, id: 'suno' }; // Treating Suno as embeddable via iframe if supported, or fallback if blocked
  }
  if (lowerUrl.includes('udio.com')) {
    return { name: 'Udio', icon: Mic2, color: '#7C3AED', allowsEmbed: false, isAI: true, id: 'udio' };
  }
  
  return { name: 'Enlace externo', icon: LinkIcon, color: '#64748b', allowsEmbed: false, isAI: false, id: 'unknown' };
};

export const getProviderIcon = (providerId) => {
  switch (providerId) {
    case 'youtube': return Video;
    case 'vimeo': return Video;
    case 'soundcloud': return Disc;
    case 'spotify': return Music;
    case 'suno': return Mic2;
    case 'udio': return Mic2;
    default: return LinkIcon;
  }
};

export const getProviderColor = (providerId) => {
  switch (providerId) {
    case 'youtube': return '#FF0000';
    case 'vimeo': return '#1AB7EA';
    case 'soundcloud': return '#FF5500';
    case 'spotify': return '#1DB954';
    case 'suno': return '#FF8C42';
    case 'udio': return '#7C3AED';
    default: return '#64748b';
  }
};

export const openInNewTab = (url) => {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};