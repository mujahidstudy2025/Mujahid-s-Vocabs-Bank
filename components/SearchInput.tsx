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
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group transform transition-all duration-300 hover:scale-[1.01]">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
          {isLoading ? (
            <Loader2 className="h-6 w-6 text-green-500 animate-spin" />
          ) : (
            <Search className="h-6 w-6 text-slate-400" />
          )}
        </div>
        
        {/* Recessed Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search for a word..."
          className="block w-full pl-16 pr-36 py-5 bg-slate-50 border-2 border-slate-200 border-t-slate-300 rounded-2xl shadow-inner text-xl font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:bg-white focus:ring-0 transition-all"
          disabled={isLoading}
        />
        
        {/* 3D Button */}
        <div className="absolute inset-y-2 right-2 flex items-center">
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-full px-6 bg-green-500 text-white rounded-xl font-bold text-sm tracking-wide uppercase shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-[4px] hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchInput;