import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Loader2, Music } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { audioService } from '@/services/audioService';
import FallbackBlock from '@/components/FallbackBlock';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { toHttps } from '@/utils/urlSecurity.js';

const AudioPlayer = forwardRef(({ post, isCompact = false, onPlayStateChange, onAudioRef }, ref) => {
  const { media_type, audio_path, external_url, duration_sec, title } = post;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(duration_sec || 0);
  const [isLoading, setIsLoading] = useState(true);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [videoLoopFailed, setVideoLoopFailed] = useState(false);

  const internalAudioRef = useRef(null);
  const videoLoopRef = useRef(null);

  const coverUrl = toHttps(post.cover_url);
  const videoLoopUrl = !videoLoopFailed ? toHttps(post.video_loop_url) : '';
  const showTrackVisual = !!coverUrl;

  useImperativeHandle(ref, () => ({
    play: () => internalAudioRef.current?.play(),
    pause: () => internalAudioRef.current?.pause(),
    isPlaying,
    audioElement: internalAudioRef.current
  }));

  useEffect(() => {
    if (onAudioRef && internalAudioRef.current) {
      onAudioRef(internalAudioRef.current);
    }
  }, [internalAudioRef.current, onAudioRef]);

  useEffect(() => {
    if (onPlayStateChange) {
      onPlayStateChange(isPlaying);
    }
  }, [isPlaying, onPlayStateChange]);

  // Sincronizar el video loop visual con el estado del audio.
  // El video es decorativo: muted + loop + playsInline. No autoplay al cargar.
  useEffect(() => {
    const v = videoLoopRef.current;
    if (!v || !videoLoopUrl) return;

    if (isPlaying) {
      const p = v.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          // El navegador bloqueo el play (ej. data saver). Cae a portada.
          setVideoLoopFailed(true);
        });
      }
    } else {
      v.pause();
      // Volver al inicio para que la proxima reproduccion sea desde 0
      try { v.currentTime = 0; } catch (_) { /* algunos browsers tiran cuando metadata no esta lista */ }
    }
  }, [isPlaying, videoLoopUrl]);

  useEffect(() => {
    let mounted = true;
    
    const initAudio = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const url = post.audio_url || await audioService.getAudioUrl(audio_path);
        
        if (!url && mounted) {
          throw new Error('No se pudo generar el enlace de audio');
        }

        if (mounted) {
          setAudioUrl(toHttps(url));
        }
      } catch (err) {
        if (mounted) setError('Error cargando audio');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    if (media_type === 'upload' && audio_path) {
      initAudio();
    }

    return () => { mounted = false; };
  }, [audio_path, media_type, post.audio_url]);

  if (media_type === 'external') {
    return <FallbackBlock url={toHttps(external_url || post.media_url)} title={title} />;
  }

  const togglePlay = () => {
    if (internalAudioRef.current) {
      if (isPlaying) {
        internalAudioRef.current.pause();
      } else {
        internalAudioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (internalAudioRef.current) {
      setCurrentTime(internalAudioRef.current.currentTime);
      if (!duration_sec && internalAudioRef.current.duration) {
        setDuration(internalAudioRef.current.duration);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (internalAudioRef.current) {
      internalAudioRef.current.currentTime = 0;
    }
  };

  const handleSeek = (value) => {
    if (internalAudioRef.current) {
      internalAudioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time) => {
    if (!time) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRetry = async () => {
    setIsLoading(true);
    audioService.clearSignedUrlCache(audio_path);
    const url = await audioService.getAudioUrl(audio_path);
    if (url) {
      setAudioUrl(toHttps(url));
      setError(null);
    } else {
      setError('Falló reintento');
    }
    setIsLoading(false);
  };

  if (error) {
    return (
       <div className="w-full h-32 bg-[#050A16] rounded-xl border border-red-900/30 flex flex-col items-center justify-center gap-2 text-red-400">
          <p className="text-sm font-medium">{error}</p>
          <Button variant="outline" size="sm" onClick={handleRetry} className="border-red-900/50 hover:bg-red-900/20 text-red-300">
             <RotateCcw className="w-3 h-3 mr-2" /> Reintentar
          </Button>
       </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", isCompact ? "h-full" : "")}>

      {/* TRACK VISUAL (encima del player). Solo si hay cover.
          - Portada estatica por defecto.
          - Al pulsar Play en el audio, fundimos al video loop silencioso.
          - Si no hay video_loop_url, se queda la portada quieta. */}
      {showTrackVisual && (
        <div
          className={cn("track-visual", isPlaying && videoLoopUrl ? "is-playing" : "")}
          aria-hidden="true"
        >
          <img
            className="track-visual__media track-visual__cover"
            src={coverUrl}
            alt=""
            loading="lazy"
            decoding="async"
          />
          {videoLoopUrl && (
            <video
              ref={videoLoopRef}
              className="track-visual__media track-visual__video"
              src={videoLoopUrl}
              muted
              loop
              playsInline
              preload="metadata"
              disablePictureInPicture
              onError={() => setVideoLoopFailed(true)}
              aria-hidden="true"
            />
          )}
          <div className="track-visual__overlay" />
        </div>
      )}

      {/* PLAYER (intacto: gradiente + boton play + slider) */}
      <div className={cn(
        "relative overflow-hidden bg-[#050A16] border border-gray-800 flex flex-col justify-end group",
        isCompact ? "h-full min-h-[160px]" : "rounded-2xl shadow-xl"
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1E3A] to-[#1E293B] opacity-50 z-0" />
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#FF8C42] rounded-full filter blur-[60px] opacity-10 z-0" />

        {audioUrl && (
          <audio
            ref={internalAudioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || duration_sec)}
          />
        )}

        <div className={cn("relative z-10 w-full p-4 md:p-6", isCompact ? "pb-4" : "pb-8")}>
         <div className="flex justify-between items-start mb-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF8C42]/10 border border-[#FF8C42]/20 text-[#FF8C42] text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(255,140,66,0.1)]">
               <Music className="w-3 h-3" /> SoundShare Original
            </div>
            {!isCompact && duration > 0 && (
               <div className="text-xs text-gray-400 font-mono">
                  {formatTime(duration)}
               </div>
            )}
         </div>

         {isCompact && (
             <div className="mb-4">
                 <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                    <Music className="w-6 h-6 text-[#FF8C42]" />
                 </div>
             </div>
         )}

         <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              disabled={isLoading}
              className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-[#FF8C42] text-white shadow-lg shadow-[#FF8C42]/30 hover:bg-[#ff7a1f] hover:shadow-[#FF8C42]/50 transition-all flex-shrink-0 focus-visible-orange"
            >
               {isLoading ? (
                 <Loader2 className="w-6 h-6 animate-spin" />
               ) : isPlaying ? (
                 <Pause className="w-6 h-6 fill-current" />
               ) : (
                 <Play className="w-6 h-6 fill-current ml-1" />
               )}
            </motion.button>

            <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
               <div className="flex justify-between text-xs text-gray-400 font-medium font-mono px-0.5">
                  <span>{formatTime(currentTime)}</span>
                  <span className={isCompact ? "" : "md:hidden"}>{formatTime(duration)}</span>
               </div>
               
               <Slider
                 value={[currentTime]}
                 max={duration || 100}
                 step={1}
                 onValueChange={handleSeek}
                 className="cursor-pointer"
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

AudioPlayer.displayName = 'AudioPlayer';
export default AudioPlayer;