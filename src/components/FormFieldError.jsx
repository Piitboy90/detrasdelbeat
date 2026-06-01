import React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const FormFieldError = ({ error, show, className }) => {
  return (
    <AnimatePresence>
      {show && error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className={cn("flex items-center gap-1.5 text-red-400 text-xs mt-1.5 font-medium", className)}
        >
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FormFieldError;