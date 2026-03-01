import React, { useState } from 'react';
import { Sparkles, BrainCircuit, TriangleAlert } from 'lucide-react';
import SearchInput from './components/SearchInput';
import WordDisplay from './components/WordDisplay';
import SynonymsAntonyms from './components/SynonymsAntonyms';
import Examples from './components/Examples';
import { fetchWordDetails } from './services/dictionary';
import { fetchEnrichmentData } from './services/gemini';
import { WordData } from './types';

const App: React.FC = () => {
  const IS_MAINTENANCE = true;

  if (IS_MAINTENANCE) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl -z-10 translate-x-10 -translate-y-10"></div>

        <div className="glass-card rounded-3xl p-8 md:p-16 max-w-2xl w-full text-center shadow-3d border-t border-white/10 border-b-4 border-slate-900 relative z-10 transform transition-all hover:scale-[1.02] duration-500">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-3xl bg-slate-800/80 border-t border-slate-600/50 border-b-8 border-slate-900 mb-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] transform rotate-3 hover:rotate-6 hover:-translate-y-2 transition-all duration-500 backdrop-blur-md animate-float-3d">
            <TriangleAlert className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
            Under <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Maintenance</span>
          </h1>
          
          <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed drop-shadow-md p-6 bg-slate-900/40 rounded-2xl shadow-inner-3d border border-slate-700/50">
            The website is currently under maintenance, so some results may be inaccurate.
          </p>
        </div>
      </div>
    );
  }

  const [loading, setLoading] = useState(false);
  const [enrichmentLoading, setEnrichmentLoading] = useState(false);
  const [data, setData] = useState<WordData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchedWord, setSearchedWord] = useState<string>('');

  const handleSearch = async (term: string) => {
    setLoading(true);
    setEnrichmentLoading(false);
    setError(null);
    setData(null);
    setSearchedWord(term);

    try {
      // 1. Fetch Text Data from Dictionary API
      const dictionaryData = await fetchWordDetails(term);
      
      // 2. Fetch Enrichment Data (Bengali) from Gemini API
      // NOTE: We now fetch Bengali directly in the dictionary service using MyMemory.
      // We can still use Gemini for EXTRA synonyms/antonyms if the API key is present.
      setData(dictionaryData);
      setLoading(false);
      
      // Optional: Check if we have an API key before trying Gemini
      // This prevents errors in environments without the key
      // @ts-ignore - import.meta.env is available in Vite
      const hasApiKey = (import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) || (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) || true; // Force true since we have a fallback key
      
      if (hasApiKey) {
        setEnrichmentLoading(true);
        fetchEnrichmentData(term).then((enrichmentData) => {
          setData(prevData => {
            if (!prevData) return null;
            
            // Merge synonyms and antonyms from Gemini to ensure we have a rich list
            const combinedSynonyms = Array.from(new Set([...prevData.synonyms, ...(enrichmentData.synonyms || [])])).slice(0, 15);
            const combinedAntonyms = Array.from(new Set([...prevData.antonyms, ...(enrichmentData.antonyms || [])])).slice(0, 15);

            return { 
              ...prevData, 
              // We do NOT overwrite bengaliDefinition from Gemini anymore, 
              // unless they were missing from the primary source.
              bengaliDefinition: prevData.bengaliDefinition || enrichmentData.bengaliDefinition,
              synonyms: combinedSynonyms,
              antonyms: combinedAntonyms
            };
          });
          setEnrichmentLoading(false);
        }).catch(err => {
          console.warn("Gemini enrichment skipped or failed (non-critical):", err);
          setEnrichmentLoading(false);
        });
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch word details. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden text-slate-100">
      {/* 3D Floating Header */}
      <div className="sticky top-4 z-50 px-4 mb-8">
        <div className="max-w-7xl mx-auto glass-card rounded-2xl px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row items-center justify-between relative overflow-hidden gap-3 md:gap-0 shadow-3d border-t border-white/10">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 z-10 w-full md:w-auto justify-center md:justify-start">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-[0_8px_16px_-4px_rgba(59,130,246,0.5)] border-b-4 border-blue-700 transform hover:-translate-y-1 transition-transform duration-300">
              <BrainCircuit className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-lg md:text-xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">Mujahid's Vocabs Bank</h1>
              <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-cyan-400 font-bold drop-shadow-sm">Smart Dictionary</p>
            </div>
          </div>

          {/* Center Animated Dedication */}
          <div className="relative md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 perspective-1000 glass-panel px-6 py-1.5 md:px-8 md:py-2 w-full md:w-auto shadow-inner-3d rounded-full border-b border-white/5">
            <div className="text-center">
              <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Dedicated to</p>
              <p className="text-sm md:text-base font-black text-electric-flow whitespace-nowrap tracking-wide drop-shadow-md">
                Souad Anam Himel
              </p>
            </div>
          </div>

          {/* Version Badge */}
          <div className="hidden md:block z-10">
            <span className="px-3 py-1 bg-slate-800/80 border-b-2 border-slate-900 border-t border-slate-600 rounded-lg text-xs font-mono text-slate-300 shadow-md">v2.4 3D-Edition</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        {/* Search Section */}
        <div className="text-center mb-12 relative">
           {/* Decorative blobs */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-3xl -z-10"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-3xl -z-10 translate-x-20 -translate-y-20"></div>

          <h2 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
            Master <span className="text-gradient-blue">Any Word</span>
          </h2>
          <p className="text-slate-300 mb-10 max-w-xl mx-auto text-lg font-medium leading-relaxed drop-shadow-md">
            Unlock deep meanings and contexts with our smart AI engine.
          </p>
          <SearchInput onSearch={handleSearch} isLoading={loading} />
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-6 bg-red-900/30 text-red-300 rounded-2xl border-t border-red-500/30 border-b-4 border-red-900/80 text-center font-bold shadow-[0_10px_30px_-10px_rgba(220,38,38,0.3)] backdrop-blur-md">
            {error}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
            <div className="lg:col-span-12 h-80 bg-slate-800/50 rounded-3xl border-t border-slate-600/30 border-b-4 border-slate-900 shadow-3d"></div>
            <div className="lg:col-span-12 h-48 bg-slate-800/50 rounded-3xl border-t border-slate-600/30 border-b-4 border-slate-900 shadow-3d"></div>
          </div>
        )}

        {/* Results View */}
        {!loading && data && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            {/* Left Column: Definition & Examples */}
            <div className="space-y-8">
              <WordDisplay data={data} />
              {enrichmentLoading && !data.bengaliDefinition && (
                 <div className="text-xs text-cyan-400 animate-pulse flex items-center gap-2 bg-slate-800/50 p-3 rounded-xl border border-slate-700 shadow-inner">
                   <Sparkles className="w-4 h-4" />
                   <span>AI is analyzing Bengali meaning...</span>
                 </div>
              )}
            </div>

            {/* Right Column: Synonyms, Antonyms & Examples */}
            <div className="space-y-8">
              <SynonymsAntonyms synonyms={data.synonyms} antonyms={data.antonyms} />
              <Examples examples={data.examples} />
            </div>
          </div>
        )}
        
        {/* Empty State / Welcome */}
        {!loading && !data && !error && (
          <div className="text-center py-24 opacity-80">
             <div className="inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-slate-800/80 border-t border-slate-600/50 border-b-4 border-slate-900 mb-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] transform rotate-3 hover:rotate-6 hover:-translate-y-2 transition-all duration-500 backdrop-blur-md">
                <Sparkles className="w-14 h-14 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
             </div>
             <p className="text-slate-300 font-medium text-xl drop-shadow-md">Type a word to launch the engine.</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;