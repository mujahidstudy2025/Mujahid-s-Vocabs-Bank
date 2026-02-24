import React, { useState } from 'react';
import { Search, Loader2, Command } from 'lucide-react';

interface SearchInputProps {
  onSearch: (term: string) => void;
  isLoading: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <form onSubmit={handleSubmit} className="relative group transform transition-all duration-300 hover:scale-[1.01]">
        {/* Glass Container for Input */}
        <div className="absolute inset-0 bg-slate-800/40 backdrop-blur-xl rounded-2xl sm:rounded-full border border-white/10 shadow-2xl"></div>
        
        <div className="absolute inset-y-0 left-0 pl-4 sm:pl-6 flex items-center pointer-events-none z-10">
          {isLoading ? (
            <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
          )}
        </div>
        
        {/* Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search for a word..."
          className="block w-full pl-12 sm:pl-16 pr-28 sm:pr-40 py-4 sm:py-5 bg-transparent relative z-0 text-base sm:text-xl font-bold text-white placeholder-slate-500 focus:outline-none rounded-2xl sm:rounded-full"
          disabled={isLoading}
        />
        
        {/* 3D Button */}
        <div className="absolute inset-y-1.5 right-1.5 flex items-center z-10">
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="glossy-button-blue h-full px-4 sm:px-8 text-white text-xs sm:text-sm tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px] sm:min-w-[120px]"
          >
            {isLoading ? '...' : 'Search'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchInput;