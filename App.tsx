import React, { useState } from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';
import SearchInput from './components/SearchInput';
import WordDisplay from './components/WordDisplay';
import ImageVisualizer from './components/ImageVisualizer';
import SynonymsAntonyms from './components/SynonymsAntonyms';
import Examples from './components/Examples';
import { fetchWordDetails, generateWordImage } from './services/gemini';
import { WordData } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [data, setData] = useState<WordData | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchedWord, setSearchedWord] = useState<string>('');

  const handleSearch = async (term: string) => {
    setLoading(true);
    setImageLoading(true);
    setError(null);
    setData(null);
    setImageUrl(null);
    setSearchedWord(term);

    try {
      // 1. Fetch Text Data
      const wordData = await fetchWordDetails(term);
      setData(wordData);
      setLoading(false);

      // 2. Fetch Image Data (Parallel-ish but dependent on word meaning for better prompt)
      if (wordData) {
        const generatedImage = await generateWordImage(wordData.word, wordData.definition);
        setImageUrl(generatedImage);
      }
    } catch (err: any) {
      console.error(err);
      // Show the specific error message (like "API Key is missing")
      setError(err.message || "Failed to fetch word details. Please try again.");
      setLoading(false);
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      {/* 3D Floating Header */}
      <div className="sticky top-4 z-50 px-4 mb-8">
        <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md border-2 border-slate-100 border-b-4 border-slate-200 rounded-2xl shadow-xl shadow-green-900/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/30 border-b-4 border-green-700 transform hover:-translate-y-0.5 transition-transform duration-300">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Mujahid's Vocabs Bank</h1>
              <p className="text-[10px] uppercase tracking-widest text-green-600 font-bold">Smart Dictionary</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-500">v2.0 3D-Edition</span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        {/* Search Section */}
        <div className="text-center mb-16 relative">
           {/* Decorative blobs */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-400/20 rounded-full blur-3xl -z-10 opacity-50 mix-blend-multiply filter"></div>

          <h2 className="text-4xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight drop-shadow-sm">
            Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Any Word</span>
          </h2>
          <p className="text-slate-600 mb-10 max-w-xl mx-auto text-lg font-medium leading-relaxed">
            Unlock deep meanings, visuals, and contexts with our smart AI engine.
          </p>
          <SearchInput onSearch={handleSearch} isLoading={loading} />
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-6 bg-red-50 text-red-600 rounded-2xl border-2 border-red-100 border-b-4 text-center font-bold shadow-sm">
            {error}
            {error.includes("API Key") && (
              <p className="text-xs text-red-400 mt-2 font-mono">
                Hint: Check Netlify Site Settings &gt; Environment Variables
              </p>
            )}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
            <div className="lg:col-span-7 h-80 bg-slate-200 rounded-3xl"></div>
            <div className="lg:col-span-5 h-80 bg-slate-200 rounded-3xl"></div>
            <div className="lg:col-span-12 h-48 bg-slate-200 rounded-3xl"></div>
          </div>
        )}

        {/* Results View */}
        {!loading && data && (
          <div className="space-y-8">
            {/* Top Row: Definition & Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-7 flex flex-col">
                <WordDisplay data={data} />
              </div>
              <div className="lg:col-span-5 flex flex-col">
                <ImageVisualizer 
                  imageUrl={imageUrl} 
                  isLoading={imageLoading} 
                  word={data.word} 
                />
              </div>
            </div>

            {/* Middle Row: Synonyms & Antonyms */}
            <div className="w-full">
              <SynonymsAntonyms synonyms={data.synonyms} antonyms={data.antonyms} />
            </div>

            {/* Bottom Row: Examples */}
            <div className="w-full">
              <Examples examples={data.examples} />
            </div>
          </div>
        )}
        
        {/* Empty State / Welcome */}
        {!loading && !data && !error && (
          <div className="text-center py-24 opacity-60">
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white border-2 border-slate-200 border-b-8 mb-6 shadow-xl transform rotate-3">
                <Sparkles className="w-10 h-10 text-green-500" />
             </div>
             <p className="text-slate-500 font-medium text-lg">Type a word to launch the engine.</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;