import React from 'react';
import { Tag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function TagFilter({ allTags, selectedTags, onTagToggle }) {
  if (!allTags || allTags.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Temas Populares
        </h3>
        
        <AnimatePresence>
          {selectedTags.length > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => selectedTags.forEach(tag => onTagToggle(tag))}
              className="text-xs text-sound-orange hover:text-white transition-colors underline decoration-dotted underline-offset-4"
            >
              Limpiar filtros ({selectedTags.length})
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-2">
        {allTags.slice(0, 15).map((tag) => { // Limit displayed tags
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`
                relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                border focus-visible:ring-2 focus-visible:ring-sound-orange focus:outline-none
                ${isSelected 
                  ? 'bg-sound-orange/10 border-sound-orange text-sound-orange shadow-[0_0_10px_rgba(255,140,66,0.2)]' 
                  : 'bg-sound-slate border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                }
              `}
              aria-pressed={isSelected}
            >
              <span className="flex items-center gap-1.5">
                #{tag}
                {isSelected && <X className="h-3 w-3" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TagFilter;