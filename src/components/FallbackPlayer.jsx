import React from 'react';
import { ExternalLink, Copy, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getProviderIcon, getProviderName } from '@/lib/embedUtils';

const FallbackPlayer = ({ url, cover_url, title, provider }) => {
  const { toast } = useToast();
  const Icon = getProviderIcon(provider);
  const providerName = getProviderName(provider);

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Enlace copiado",
      description: "La URL ha sido copiada al portapapeles.",
    });
  };

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden relative shadow-lg group">
      {/* Background */}
      {cover_url ? (
        <div className="absolute inset-0">
          <img 
            src={cover_url} 
            alt={title || "Cover"} 
            className="w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff8c42] to-[#0f172a] opacity-90" />
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 ring-1 ring-white/20">
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-white font-semibold text-lg mb-2">
          Contenido externo
        </h3>
        <p className="text-gray-200 text-sm max-w-sm mb-6">
          Este contenido de {providerName} no se puede reproducir directamente aquí.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Button 
            className="bg-[#FF8C42] hover:bg-[#ff7a1f] text-white gap-2"
            onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
          >
            <ExternalLink className="w-4 h-4" />
            Abrir en {providerName}
          </Button>
          
          <Button 
            variant="outline" 
            className="border-white/20 bg-black/20 text-white hover:bg-black/40 hover:text-white gap-2"
            onClick={copyLink}
          >
            <Copy className="w-4 h-4" />
            Copiar enlace
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FallbackPlayer;