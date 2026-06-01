import React from 'react';
import { Check, ShieldCheck, AlertCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const NormasCheckbox = ({ 
  title, 
  description, 
  checks = [], 
  checkedState = [], 
  onCheckChange,
  showError = false
}) => {
  const allChecked = checkedState.length > 0 && checkedState.every(Boolean);

  return (
    <div className={cn(
      "bg-[#0F172A]/50 border rounded-xl p-6 transition-colors duration-300",
      showError && !allChecked ? "border-red-500/50 bg-red-900/5" : "border-gray-800 hover:border-gray-700"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-3">
          <div className={cn(
            "mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
            allChecked ? "bg-green-500/10 text-green-500" : "bg-[#FF8C42]/10 text-[#FF8C42]"
          )}>
            {allChecked ? <ShieldCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{title}</h3>
            <p className="text-gray-400 text-sm mt-1 leading-relaxed max-w-xl">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 pl-0 md:pl-11">
        {checks.map((label, index) => (
          <label 
            key={index} 
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 group relative overflow-hidden",
              checkedState[index] 
                ? "bg-[#FF8C42]/5 border-[#FF8C42]/30" 
                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
            )}
          >
            <div className="relative flex items-center justify-center shrink-0 mt-0.5">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={checkedState[index] || false}
                onChange={() => onCheckChange(index, !checkedState[index])}
              />
              <div className={cn(
                "w-5 h-5 rounded border transition-all flex items-center justify-center",
                checkedState[index]
                  ? "bg-[#FF8C42] border-[#FF8C42] text-white"
                  : "bg-transparent border-gray-500 group-hover:border-gray-400"
              )}>
                <AnimatePresence>
                  {checkedState[index] && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <span className={cn(
              "text-sm select-none transition-colors",
              checkedState[index] ? "text-gray-200" : "text-gray-400 group-hover:text-gray-300"
            )}>
              {label}
            </span>
          </label>
        ))}
      </div>

      <div className="mt-4 pl-0 md:pl-11 flex items-center justify-between text-xs">
        <span className={cn("transition-colors", showError && !allChecked ? "text-red-400 font-medium" : "text-gray-500")}>
          {showError && !allChecked ? "Falta aceptar las normas para continuar." : "Al continuar, aceptas estas normas."}
        </span>
        <Link to="/normas" target="_blank" className="flex items-center gap-1 text-[#FF8C42] hover:text-[#ff7a1f] transition-colors group">
          Leer normas completas
          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default NormasCheckbox;