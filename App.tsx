import React, { useState } from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';
import SearchInput from './components/SearchInput';
import WordDisplay from './components/WordDisplay';
import SynonymsAntonyms from './components/SynonymsAntonyms';
import Derivatives from './components/Derivatives';
import Examples from './components/Examples';
import { fetchWordDetails } from './services/dictionary';
import { fetchEnrichmentData } from './services/gemini';
import { WordData } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<WordData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchedWord, setSearchedWord] = useState<string>('');

  const handleSearch = async (term: string) => {
    setLoading(true);
    setError(null);
    setData(null);
    setSearchedWord(term);

    try {
      // Parallelize both API calls for maximum speed
      const [dictionaryResult, enrichmentResult] = await Promise.allSettled([
        fetchWordDetails(term),
        fetchEnrichmentData(term)
      ]);
      
      let finalData: WordData | null = null;

      if (dictionaryResult.status === 'fulfilled') {
        finalData = dictionaryResult.value;
      } else {
        throw dictionaryResult.reason;
      }

      if (enrichmentResult.status === 'fulfilled') {
        finalData = { ...finalData, ...enrichmentResult.value };
      }

      setData(finalData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch word details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-10 overflow-x-hidden text-slate-100">
      {/* 3D Floating Header */}
      <div className="sticky top-2 sm:top-4 z-50 px-2 sm:px-4 mb-6 sm:mb-8">
        <div className="max-w-7xl mx-auto glass-card rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between relative overflow-hidden">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 sm:gap-3 z-10">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 border-b-2 sm:border-b-4 border-blue-700 transform hover:-translate-y-0.5 transition-transform duration-300">
              <BrainCircuit className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm sm:text-xl font-extrabold text-white tracking-tight leading-none">Vocabs Bank</h1>
              <p className="text-[8px] sm:text-[10px] uppercase tracking-widest text-cyan-400 font-bold mt-0.5 sm:mt-1">Smart Dictionary</p>
            </div>
          </div>

          {/* Center Animated Dedication - Visible on all screens but smaller on mobile */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center perspective-1000 glass-panel px-3 sm:px-8 py-1 sm:py-2">
            <div className="text-center">
              <p className="text-[6px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0 sm:mb-0.5">Dedicated to</p>
              <p className="text-[10px] sm:text-base font-black text-electric-flow whitespace-nowrap tracking-wide">
                Souad Anam Himel
              </p>
            </div>
          </div>

          {/* Version Badge - Hidden on very small screens */}
          <div className="hidden xs:block z-10">
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-slate-800/50 border border-slate-700 rounded-md sm:rounded-lg text-[8px] sm:text-xs font-mono text-slate-400">v2.3</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4">
        
        {/* Search Section */}
        <div className="text-center mb-8 sm:mb-12 relative">
           {/* Decorative blobs */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-cyan-500/10 rounded-full blur-3xl -z-10 translate-x-10 sm:translate-x-20 -translate-y-10 sm:-translate-y-20"></div>

          <h2 className="text-3xl sm:text-7xl font-black text-white mb-4 sm:mb-6 tracking-tight drop-shadow-lg leading-tight">
            Master <span className="text-gradient-blue">Any Word</span>
          </h2>
          <p className="text-slate-400 mb-6 sm:mb-10 max-w-xl mx-auto text-sm sm:text-lg font-medium leading-relaxed px-4">
            Unlock deep meanings and contexts with our smart AI engine.
          </p>
          <SearchInput onSearch={handleSearch} isLoading={loading} />
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-6 bg-red-900/20 text-red-400 rounded-2xl border border-red-900/50 text-center font-bold shadow-sm backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
            <div className="lg:col-span-12 h-80 bg-slate-800/50 rounded-3xl border border-slate-700/50"></div>
            <div className="lg:col-span-12 h-48 bg-slate-800/50 rounded-3xl border border-slate-700/50"></div>
          </div>
        )}

        {/* Results View */}
        {!loading && data && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            {/* Left Column: Definition & Examples */}
            <div className="space-y-6">
              <WordDisplay data={data} />
              <Examples examples={data.examples} />
            </div>

            {/* Right Column: Synonyms, Antonyms & Derivatives */}
            <div className="space-y-6">
              <SynonymsAntonyms synonyms={data.synonyms} antonyms={data.antonyms} />
              <Derivatives derivatives={data.derivatives} />
            </div>
          </div>
        )}
        
        {/* Empty State / Welcome */}
        {!loading && !data && !error && (
          <div className="text-center py-24 opacity-60">
             <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-slate-800/50 border border-slate-700 mb-6 shadow-2xl shadow-blue-900/20 transform rotate-3 backdrop-blur-sm">
                <Sparkles className="w-12 h-12 text-cyan-400" />
             </div>
             <p className="text-slate-400 font-medium text-lg">Type a word to launch the engine.</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;