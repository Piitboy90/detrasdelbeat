import React from 'react';

export const PostSkeleton = () => {
  return (
    <div className="bg-sound-slate rounded-xl p-6 border border-gray-800 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-700/50"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-700/50 rounded w-1/3"></div>
          <div className="h-2 bg-gray-700/50 rounded w-1/4"></div>
        </div>
      </div>
      <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-4"></div>
      <div className="space-y-2 mb-6">
        <div className="h-3 bg-gray-700/50 rounded w-full"></div>
        <div className="h-3 bg-gray-700/50 rounded w-full"></div>
        <div className="h-3 bg-gray-700/50 rounded w-2/3"></div>
      </div>
      <div className="flex gap-2 mb-6">
        <div className="h-6 w-16 bg-gray-700/50 rounded-full"></div>
        <div className="h-6 w-16 bg-gray-700/50 rounded-full"></div>
      </div>
      <div className="flex justify-between pt-4 border-t border-gray-800">
        <div className="h-4 w-12 bg-gray-700/50 rounded"></div>
        <div className="h-4 w-12 bg-gray-700/50 rounded"></div>
      </div>
    </div>
  );
};

export const CommentSkeleton = () => {
  return (
    <div className="flex gap-4 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-700/50 flex-shrink-0"></div>
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 bg-gray-700/50 rounded w-1/4"></div>
        <div className="h-3 bg-gray-700/50 rounded w-full"></div>
        <div className="h-3 bg-gray-700/50 rounded w-2/3"></div>
      </div>
    </div>
  );
};

export const FeedSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
};

export default {
  PostSkeleton,
  CommentSkeleton,
  FeedSkeleton,
};