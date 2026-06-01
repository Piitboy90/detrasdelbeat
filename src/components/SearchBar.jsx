import React from 'react';
import { Search } from 'lucide-react';

function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative group w-full max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-500 group-focus-within:text-sound-orange transition-colors" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar historias, títulos o artistas..."
        className="block w-full pl-12 pr-4 py-4 bg-sound-slate border border-gray-700 rounded-xl leading-5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sound-orange focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-600"
        aria-label="Buscar publicaciones"
      />
    </div>
  );
}

export default SearchBar;