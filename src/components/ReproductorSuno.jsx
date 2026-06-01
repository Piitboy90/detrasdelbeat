import React, { useState } from 'react';
import { ExternalLink, Music, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ReproductorSuno({ sunoUrl, title }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!sunoUrl) return null;

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Basic check to see if it looks like a valid URL
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (!isValidUrl(sunoUrl) || hasError) {
    return (
      <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-[#FF6B35]/10 rounded-full">
              <Music className="h-6 w-6 text-[#FF6B35]" />
           </div>
           <div>
              <h3 className="text-white font-medium">Escuchar en Suno</h3>
              <p className="text-gray-400 text-sm">El reproductor no se pudo cargar aquí.</p>
           </div>
        </div>
        <Button 
          onClick={() => window.open(sunoUrl, '_blank')}
          className="bg-[#FF6B35] hover:bg-[#E05A2B] text-white"
        >
           Abrir <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video md:aspect-[21/9] bg-black rounded-xl overflow-hidden border border-gray-700 shadow-xl">
       {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1E293B]">
             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF6B35]"></div>
          </div>
       )}
       
       <iframe 
         src={sunoUrl} // Assuming sunoUrl is the embed URL. If not, logic might be needed to convert song URL to embed URL.
         className="w-full h-full"
         allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
         onLoad={handleIframeLoad}
         onError={handleIframeError}
         title={`Suno Player - ${title}`}
       />
    </div>
  );
}

export default ReproductorSuno;