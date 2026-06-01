import React, { useState } from 'react';
import { ExternalLink, Music, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function SunoPlayer({ sunoUrl }) {
  const [loadError, setLoadError] = useState(false);

  if (!sunoUrl) return null;

  // Simple heuristic to extract embed ID or clean URL
  // Assuming suno.com/song/[id] format mainly
  const getEmbedUrl = (url) => {
    try {
      const urlObj = new URL(url);
      // If it's already an embed link, return as is
      if (url.includes('embed')) return url;
      
      // Try to convert standard song link to embed
      if (urlObj.hostname.includes('suno.com') && urlObj.pathname.includes('/song/')) {
        const songId = urlObj.pathname.split('/song/')[1];
        return `https://suno.com/embed/${songId}`;
      }
      // If we can't determine, return original (might fail in iframe but we catch error)
      return url;
    } catch (e) {
      return url;
    }
  };

  const embedUrl = getEmbedUrl(sunoUrl);

  if (loadError) {
    return (
      <div className="w-full bg-[#1E293B] border border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-4 my-6">
        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-orange-500">
          <Music className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-white font-medium mb-1">No se pudo cargar el reproductor</h3>
          <p className="text-sm text-gray-400 mb-4">
            La configuración de privacidad o el enlace pueden impedir la reproducción aquí.
          </p>
          <a href={sunoUrl} target="_blank" rel="noopener noreferrer">
            <Button className="bg-[#FF6B35] hover:bg-[#e05a2b] text-white">
              Abrir en Suno <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full my-8 rounded-xl overflow-hidden bg-black shadow-lg relative group">
      <div className="aspect-video md:aspect-[21/9] w-full relative">
        <iframe
          src={embedUrl}
          className="w-full h-full absolute inset-0"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          onError={() => setLoadError(true)}
          title="Suno Player"
        />
        {/* Overlay fallback link if iframe works but user prefers external */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <a href={sunoUrl} target="_blank" rel="noopener noreferrer" className="bg-black/70 hover:bg-black text-white p-2 rounded-full block" title="Abrir en pestaña nueva">
             <ExternalLink className="h-4 w-4" />
           </a>
        </div>
      </div>
      <div className="bg-[#1E293B] px-4 py-2 flex items-center gap-2 text-xs text-gray-400 border-t border-gray-800">
        <AlertCircle className="h-3 w-3" />
        Si no se reproduce, <a href={sunoUrl} target="_blank" rel="noopener noreferrer" className="text-[#FF6B35] hover:underline">ábrelo directamente en Suno</a>.
      </div>
    </div>
  );
}

export default SunoPlayer;