import React from 'react';
import { ExternalLink, Copy, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getProviderInfo } from '@/lib/providerUtils';

const FallbackBlock = ({ url, title }) => {
  const { toast } = useToast();
  const providerInfo = getProviderInfo(url);
  const ProviderIcon = providerInfo.icon;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast({ 
      title: "Enlace copiado", 
      description: "Link copiado al portapapeles exitosamente.",
      className: "bg-[#0F172A] border-[#FF8C42] text-white" 
    });
  };

  return (
    <div className="relative w-full aspect-video bg-[#050A16] rounded-xl overflow-hidden border border-gray-800 flex flex-col items-center justify-center text-center p-6 md:p-10 group">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1E3A] to-[#1E293B] opacity-50 z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#FF8C42] rounded-full filter blur-[100px] opacity-5 z-0" />

      <div className="relative z-10 max-w-md w-full flex flex-col items-center">
        <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-lg backdrop-blur-sm">
           <ProviderIcon className="w-7 h-7 text-[#FF8C42]" />
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">
          Escúchalo en el reproductor original
        </h3>
        
        <p className="text-gray-400 text-sm md:text-base mb-8 leading-relaxed max-w-sm">
          Lo importante está aquí: la historia.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <a 
             href={url} 
             target="_blank" 
             rel="noopener noreferrer" 
             className="w-full sm:w-auto"
             tabIndex="-1" // Button handles focus
          >
            <Button 
              className="w-full sm:w-auto bg-[#FF8C42] hover:bg-[#ff7a1f] text-white h-11 px-6 shadow-lg shadow-[#FF8C42]/20 hover:shadow-[#FF8C42]/40 transition-all duration-300 font-medium group/btn"
              aria-label={`Abrir en ${providerInfo.name}`}
            >
              <span className="flex items-center gap-2">
                Abrir en {providerInfo.name}
                <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
              </span>
            </Button>
          </a>

          <Button 
            variant="outline" 
            onClick={handleCopyLink} 
            className="w-full sm:w-auto border-gray-700 text-gray-300 hover:text-white hover:bg-white/5 hover:border-gray-500 h-11 px-6 transition-all duration-300"
            aria-label="Copiar enlace al portapapeles"
          >
             <span className="flex items-center gap-2">
               <Copy className="w-4 h-4" />
               Copiar enlace
             </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FallbackBlock;