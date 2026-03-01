import React from 'react';
import { Volume2, BookOpen } from 'lucide-react';
import { WordData } from '../types';

interface WordDisplayProps {
  data: WordData;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ data }) => {
  const speakWord = () => {
    const utterance = new SpeechSynthesisUtterance(data.word);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="glass-card rounded-3xl p-8 relative overflow-hidden group hover:shadow-cyan-500/20 transition-all duration-500 shadow-3d border-t border-white/10 border-b-4 border-slate-900 transform hover:-translate-y-1">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110 duration-700"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-baseline gap-4 mb-2">
              <h1 className="text-5xl font-black text-white tracking-tight capitalize drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">{data.word}</h1>
              <span className="text-lg font-mono text-cyan-400 italic drop-shadow-sm">{data.partOfSpeech}</span>
            </div>
            {data.bengaliDefinition && (
              <p className="text-2xl font-bengali text-slate-300 mt-1 drop-shadow-sm">{data.bengaliDefinition}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <a 
              href={`https://www.merriam-webster.com/dictionary/${data.word}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-800/80 rounded-2xl text-slate-400 backdrop-blur-sm border-t border-slate-600/50 border-b-4 border-slate-900 hover:bg-slate-700 hover:text-white transition-all hover:-translate-y-1 active:translate-y-1 active:border-b-0 shadow-md"
              title="View on Merriam-Webster"
            >
              <BookOpen className="w-7 h-7" />
            </a>
            <button
              onClick={speakWord}
              className="p-3 bg-blue-600/30 rounded-2xl text-blue-300 backdrop-blur-sm border-t border-blue-400/30 border-b-4 border-blue-900 hover:bg-blue-500/40 hover:text-white transition-all hover:-translate-y-1 active:translate-y-1 active:border-b-0 shadow-md"
              title="Listen to pronunciation"
            >
              <Volume2 className="w-7 h-7" />
            </button>
          </div>
        </div>

        <div className="prose prose-lg prose-invert max-w-none mt-8 p-6 bg-slate-900/50 rounded-2xl shadow-inner-3d border border-slate-700/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-50"></div>
          <div className="flex items-center gap-2 mb-3 text-cyan-400 font-bold uppercase tracking-widest text-xs drop-shadow-sm">
            <BookOpen className="w-4 h-4" />
            Definition
          </div>
          <p className="text-slate-100 leading-relaxed text-xl font-medium drop-shadow-sm">
            {data.definition}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WordDisplay;