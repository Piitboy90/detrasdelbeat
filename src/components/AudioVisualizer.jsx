import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const AudioVisualizer = ({ isPlaying, audioElement }) => {
  const [heights, setHeights] = useState(Array(12).fill(10));

  useEffect(() => {
    let interval;

    if (isPlaying) {
      interval = setInterval(() => {
        setHeights(prev => prev.map(() => Math.max(10, Math.floor(Math.random() * 100))));
      }, 100);
    } else {
      // Reset to idle state
      setHeights(Array(12).fill(10));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  return (
    <div className="flex items-center justify-center gap-[4px] h-[50px] w-full max-w-[300px] mx-auto my-2">
      {heights.map((h, i) => (
        <div
          key={i}
          className="w-[3px] bg-gradient-to-t from-[#FF8C42] to-[#FF6B6B] rounded-[2px]"
          style={{
            height: `${h}%`,
            opacity: isPlaying ? 0.8 : 0.2,
            transition: 'height 0.2s ease, opacity 0.3s ease',
            boxShadow: isPlaying ? '0 0 8px rgba(255, 140, 66, 0.3)' : 'none'
          }}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;