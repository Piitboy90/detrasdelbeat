import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MobileDrawerOverlay = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm md:hidden"
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  );
};

export default MobileDrawerOverlay;