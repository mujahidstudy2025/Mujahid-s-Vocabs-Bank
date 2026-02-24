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
    <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:shadow-cyan-500/10 transition-all duration-500">
      <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-blue-500/10 rounded-full blur-3xl -mr-10 sm:-mr-20 -mt-10 sm:-mt-20 transition-transform group-hover:scale-110 duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 mb-1 sm:mb-2">
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight capitalize truncate">{data.word}</h1>
              <span className="text-sm sm:text-lg font-mono text-cyan-400 italic">{data.partOfSpeech}</span>
            </div>
            {data.bengaliDefinition && (
              <p className="text-xl sm:text-2xl font-bengali text-slate-300 mt-0.5 sm:mt-1">{data.bengaliDefinition}</p>
            )}
          </div>
          <button
            onClick={speakWord}
            className="p-2 sm:p-3 bg-blue-500/20 rounded-xl sm:rounded-2xl text-blue-400 backdrop-blur-sm border border-blue-500/20 hover:bg-blue-500/30 transition-colors flex-shrink-0 ml-2"
            title="Listen to pronunciation"
          >
            <Volume2 className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </div>

        <div className="prose prose-sm sm:prose-lg prose-invert max-w-none">
          <div className="flex items-center gap-2 mb-1 sm:mb-2 text-blue-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
            Definition
          </div>
          <p className="text-slate-200 leading-relaxed text-base sm:text-xl font-medium">
            {data.definition}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WordDisplay;