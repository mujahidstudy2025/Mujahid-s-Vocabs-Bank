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
      
      // 2. Fetch Enrichment Data (Bengali + Derivatives) from Gemini API
      // NOTE: We now fetch Bengali and Derivatives directly in the dictionary service using Datamuse/MyMemory.
      // We can still use Gemini for EXTRA synonyms/antonyms if the API key is present, but it's not critical.
      setData(dictionaryData);
      setLoading(false);
      
      // Optional: Check if we have an API key before trying Gemini
      // This prevents errors in environments without the key
      // @ts-ignore - import.meta.env is available in Vite
      const hasApiKey = (import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) || (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY);
      
      if (hasApiKey) {
        setEnrichmentLoading(true);
        fetchEnrichmentData(term).then((enrichmentData) => {
          setData(prevData => {
            if (!prevData) return null;
            
            // Merge synonyms and antonyms
            const combinedSynonyms = Array.from(new Set([...prevData.synonyms, ...(enrichmentData.synonyms || [])])).slice(0, 10);
            const combinedAntonyms = Array.from(new Set([...prevData.antonyms, ...(enrichmentData.antonyms || [])])).slice(0, 10);

            return { 
              ...prevData, 
              // We do NOT overwrite derivatives or bengaliDefinition from Gemini anymore, 
              // unless they were missing from the primary source.
              bengaliDefinition: prevData.bengaliDefinition || enrichmentData.bengaliDefinition,
              derivatives: {
                 ...prevData.derivatives!, // Keep existing (Datamuse) derivatives
                 // Only update if Datamuse failed (value is N/A) and Gemini has a value
                 noun: prevData.derivatives?.noun === "N/A" && enrichmentData.derivatives?.noun !== "N/A" ? enrichmentData.derivatives!.noun : prevData.derivatives!.noun,
                 verb: prevData.derivatives?.verb === "N/A" && enrichmentData.derivatives?.verb !== "N/A" ? enrichmentData.derivatives!.verb : prevData.derivatives!.verb,
                 adjective: prevData.derivatives?.adjective === "N/A" && enrichmentData.derivatives?.adjective !== "N/A" ? enrichmentData.derivatives!.adjective : prevData.derivatives!.adjective,
                 adverb: prevData.derivatives?.adverb === "N/A" && enrichmentData.derivatives?.adverb !== "N/A" ? enrichmentData.derivatives!.adverb : prevData.derivatives!.adverb,
              },
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
        <div className="max-w-7xl mx-auto glass-card rounded-2xl px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row items-center justify-between relative overflow-hidden gap-3 md:gap-0">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 z-10 w-full md:w-auto justify-center md:justify-start">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 border-b-4 border-blue-700 transform hover:-translate-y-0.5 transition-transform duration-300">
              <BrainCircuit className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-lg md:text-xl font-extrabold text-white tracking-tight leading-tight">Mujahid's Vocabs Bank</h1>
              <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-cyan-400 font-bold">Smart Dictionary</p>
            </div>
          </div>

          {/* Center Animated Dedication */}
          <div className="relative md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 perspective-1000 glass-panel px-6 py-1.5 md:px-8 md:py-2 w-full md:w-auto">
            <div className="text-center">
              <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Dedicated to</p>
              <p className="text-sm md:text-base font-black text-electric-flow whitespace-nowrap tracking-wide">
                Souad Anam Himel
              </p>
            </div>
          </div>

          {/* Version Badge */}
          <div className="hidden md:block z-10">
            <span className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-lg text-xs font-mono text-slate-400">v2.3 SaaS-Edition</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        {/* Search Section */}
        <div className="text-center mb-12 relative">
           {/* Decorative blobs */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl -z-10 translate-x-20 -translate-y-20"></div>

          <h2 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
            Master <span className="text-gradient-blue">Any Word</span>
          </h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto text-lg font-medium leading-relaxed">
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
              {enrichmentLoading && !data.bengaliDefinition && (
                 <div className="text-xs text-cyan-400 animate-pulse flex items-center gap-2">
                   <Sparkles className="w-3 h-3" />
                   <span>AI is analyzing Bengali meaning and derivatives...</span>
                 </div>
              )}
              <Examples examples={data.examples} />
            </div>

            {/* Right Column: Synonyms, Antonyms & Derivatives */}
            <div className="space-y-6">
              <Derivatives derivatives={data.derivatives} />
              <SynonymsAntonyms synonyms={data.synonyms} antonyms={data.antonyms} />
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