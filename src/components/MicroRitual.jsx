import React from 'react';
import { Music, RotateCcw, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const MicroRitual = ({ variant = 'home' }) => {
  const isDetail = variant === 'detail';
  
  const steps = [
    { icon: Music, label: "Escucha", color: "text-[#FF8C42]" },
    { icon: RotateCcw, label: "Vuelve", color: "text-white" },
    { icon: BookOpen, label: "Lee", color: "text-[#FF8C42]" }
  ];

  return (
    <div className={cn(
      "flex items-center justify-center p-6 w-full",
      isDetail ? "py-8 border-t border-b border-gray-800/50 my-6 bg-[#0B1221]/50 rounded-xl" : "py-10"
    )}>
      <div className={cn(
        "flex items-center",
        isDetail ? "gap-6 md:gap-10" : "flex-col md:flex-row gap-4 md:gap-16"
      )}>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="flex flex-col items-center gap-3 group"
            >
              <div className={cn(
                "rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,140,66,0.2)]",
                isDetail ? "w-12 h-12 bg-[#1E293B] border border-gray-700" : "w-16 h-16 bg-[#1E293B]/50 border border-[#FF8C42]/20"
              )}>
                <step.icon className={cn(
                  "transition-colors duration-300",
                  isDetail ? "w-5 h-5" : "w-8 h-8",
                  step.color
                )} />
              </div>
              <span className="text-gray-400 font-medium tracking-wide text-xs uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                {step.label}
              </span>
            </motion.div>
            
            {index < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 0.3, scale: 1 }}
                transition={{ delay: index * 0.2 + 0.1 }}
                className={cn(
                   "text-gray-600",
                   isDetail ? "hidden md:block" : "hidden md:block transform rotate-90 md:rotate-0"
                )}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MicroRitual;