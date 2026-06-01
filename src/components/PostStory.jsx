import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function PostStory({ story }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 500;
  const shouldTruncate = story && story.length > maxLength;

  const displayContent = isExpanded ? story : (shouldTruncate ? story.slice(0, maxLength) + '...' : story);

  return (
    <div className="bg-[#0F172A] rounded-2xl p-1 my-6">
      <div className="prose prose-invert max-w-none">
        <p className="text-gray-300 text-lg leading-[1.8] whitespace-pre-wrap font-light tracking-wide">
          {displayContent}
        </p>
      </div>

      {shouldTruncate && (
        <div className="mt-4 flex justify-center">
          <Button 
            variant="ghost" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#FF6B35] hover:bg-[#FF6B35]/10 hover:text-[#FF6B35] flex items-center gap-2"
          >
            {isExpanded ? (
              <>Leer menos <ChevronUp className="h-4 w-4" /></>
            ) : (
              <>Leer historia completa <ChevronDown className="h-4 w-4" /></>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default PostStory;