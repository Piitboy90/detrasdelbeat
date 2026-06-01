import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

function FloatingActionButton() {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ y: -2, boxShadow: "0 6px 16px rgba(255, 140, 66, 0.4)" }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate('/create')}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#FF8C42] text-white font-bold text-[14px] px-5 py-3 rounded-full shadow-[0_4px_12px_rgba(255,140,66,0.3)] backdrop-blur-md sm:hidden outline-none border border-white/10"
    >
      <Plus className="w-5 h-5" />
      Publicar
    </motion.button>
  );
}

export default FloatingActionButton;