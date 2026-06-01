import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { getEmbedUrl, isEmbeddable } from '@/lib/embedUtils';
import FallbackBlock from '@/components/FallbackBlock';
import { getProviderInfo } from '@/lib/providerUtils';
import { toHttps } from '@/utils/urlSecurity.js';

const SmartEmbedPlayer = ({ 
  url, 
  title, 
  cover_url,
  provider: explicitProvider,
  className = ""
}) => {
  const [status, setStatus] = useState('loading');
  const [embedUrl, setEmbedUrl] = useState(null);
  const iframeRef = useRef(null);
  const timeoutRef = useRef(null);
  
  const providerInfo = getProviderInfo(url);
  
  useEffect(() => {
    if (!url) {
      setStatus('failed');
      return;
    }

    const detectedInfo = getProviderInfo(url);
    const canEmbed = detectedInfo.allowsEmbed;
    
    const computedEmbedUrl = getEmbedUrl(url, detectedInfo.id);

    if (!canEmbed || !computedEmbedUrl) {
      setStatus('fallback');
      setEmbedUrl(null);
      return;
    }

    setEmbedUrl(toHttps(computedEmbedUrl));
    setStatus('loading');

    timeoutRef.current = setTimeout(() => {
      setStatus(prev => prev === 'loading' ? 'fallback' : prev);
    }, 3000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [url]);

  const handleIframeLoad = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStatus('loaded');
  };

  const handleIframeError = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStatus('fallback');
  };

  if (status === 'fallback' || status === 'failed') {
    return <FallbackBlock url={toHttps(url)} title={title} />;
  }

  return (
    <div className={`relative w-full aspect-video bg-[#0f172a] rounded-xl overflow-hidden shadow-lg border border-gray-800 ${className}`}>
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1E293B] z-10">
          <Loader2 className="w-8 h-8 text-[#FF8C42] animate-spin" />
        </div>
      )}
      
      {embedUrl && (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={title || "Media Content"}
          className={`w-full h-full transition-opacity duration-500 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      )}
    </div>
  );
};

export default SmartEmbedPlayer;