import React from 'react';
import { cn } from '@/lib/utils';

const Slider = React.forwardRef(({ className, value, min = 0, max = 100, step = 1, onValueChange, ...props }, ref) => {
  const handleChange = (e) => {
    const newValue = [parseFloat(e.target.value)];
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  const val = value ? value[0] : min;
  // Avoid division by zero
  const percentage = max > min ? ((val - min) / (max - min)) * 100 : 0;

  return (
    <div className={cn("relative flex w-full touch-none select-none items-center", className)} {...props} ref={ref}>
      {/* Track */}
      <div className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-700">
        {/* Range */}
        <div 
          className="absolute h-full bg-[#FF8C42]" 
          style={{ width: `${percentage}%` }} 
        />
      </div>
      {/* Input (Invisible but interactive) */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
      />
      {/* Thumb (Visual only) */}
      <div 
        className="block h-4 w-4 rounded-full border-2 border-[#FF8C42] bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 pointer-events-none absolute z-10 shadow-md"
        style={{ left: `calc(${percentage}% - 8px)` }}
      />
    </div>
  );
});

Slider.displayName = "Slider";

export { Slider };