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
    <div className="glass-card rounded-3xl p-8 relative overflow-hidden group hover:shadow-cyan-500/10 transition-all duration-500">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110 duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-baseline gap-4 mb-2">
              <h1 className="text-5xl font-black text-white tracking-tight capitalize">{data.word}</h1>
              <span className="text-lg font-mono text-cyan-400 italic">{data.partOfSpeech}</span>
            </div>
            {data.bengaliDefinition && (
              <p className="text-2xl font-bengali text-slate-300 mt-1">{data.bengaliDefinition}</p>
            )}
          </div>
          <button
            onClick={speakWord}
            className="p-3 bg-blue-500/20 rounded-2xl text-blue-400 backdrop-blur-sm border border-blue-500/20 hover:bg-blue-500/30 transition-colors"
            title="Listen to pronunciation"
          >
            <Volume2 className="w-8 h-8" />
          </button>
        </div>

        <div className="prose prose-lg prose-invert max-w-none">
          <div className="flex items-center gap-2 mb-2 text-blue-400 font-bold uppercase tracking-widest text-xs">
            <BookOpen className="w-4 h-4" />
            Definition
          </div>
          <p className="text-slate-200 leading-relaxed text-xl font-medium">
            {data.definition}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WordDisplay;