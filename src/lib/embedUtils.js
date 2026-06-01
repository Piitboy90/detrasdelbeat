import { Music, Play, Link as LinkIcon, Video, Disc, Mic2, Smartphone, Instagram as InstagramIcon } from 'lucide-react';

export const detectProvider = (url) => {
  if (!url) return 'unknown';
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube';
  if (lowerUrl.includes('vimeo.com')) return 'vimeo';
  if (lowerUrl.includes('soundcloud.com')) return 'soundcloud';
  if (lowerUrl.includes('spotify.com')) return 'spotify';
  if (lowerUrl.includes('tiktok.com')) return 'tiktok';
  if (lowerUrl.includes('instagram.com')) return 'instagram';
  if (lowerUrl.includes('suno.com')) return 'suno';

  return 'unknown';
};

export const extractVideoId = (url, provider) => {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);

    switch (provider) {
      case 'youtube': {
        if (url.includes('youtu.be')) {
          return urlObj.pathname.slice(1);
        }
        return urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
      }
      case 'vimeo':
        return urlObj.pathname.split('/').pop();
      case 'suno': {
        // Handle suno.com/song/ID or suno.com/embed/ID
        const pathParts = urlObj.pathname.split('/');
        // Search for UUID-like pattern
        const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
        
        for (const part of pathParts) {
          if (uuidRegex.test(part)) return part;
        }
        return null;
      }
      case 'spotify': {
        // open.spotify.com/track/ID
        const parts = urlObj.pathname.split('/');
        return parts[parts.length - 1];
      }
      default:
        return null;
    }
  } catch (e) {
    console.error("Error extracting ID:", e);
    return null;
  }
};

export const getEmbedUrl = (url, provider) => {
  const id = extractVideoId(url, provider);
  
  switch (provider) {
    case 'youtube':
      return id ? `https://www.youtube.com/embed/${id}` : null;
    case 'vimeo':
      return id ? `https://player.vimeo.com/video/${id}` : null;
    case 'suno':
      return id ? `https://suno.com/embed/${id}` : null;
    case 'spotify':
      return id ? `https://open.spotify.com/embed/track/${id}` : null;
    case 'soundcloud':
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
    default:
      return null;
  }
};

export const getProviderIcon = (provider) => {
  switch (provider) {
    case 'youtube': return Video;
    case 'vimeo': return Video;
    case 'soundcloud': return Disc;
    case 'spotify': return Music;
    case 'tiktok': return Smartphone;
    case 'instagram': return InstagramIcon;
    case 'suno': return Mic2;
    default: return LinkIcon;
  }
};

export const getProviderName = (provider) => {
  switch (provider) {
    case 'youtube': return 'YouTube';
    case 'vimeo': return 'Vimeo';
    case 'soundcloud': return 'SoundCloud';
    case 'spotify': return 'Spotify';
    case 'tiktok': return 'TikTok';
    case 'instagram': return 'Instagram';
    case 'suno': return 'Suno';
    default: return 'Enlace externo';
  }
};

export const isEmbeddable = (provider) => {
  const embeddableProviders = ['youtube', 'vimeo', 'suno', 'spotify', 'soundcloud'];
  return embeddableProviders.includes(provider);
};