import React from 'react';
import { Volume2, BookOpen, Bookmark } from 'lucide-react';
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
    <div className="bg-white rounded-[2rem] p-8 md:p-10 border-2 border-slate-100 border-b-[8px] border-r-[4px] border-slate-200 h-full flex flex-col justify-center relative overflow-hidden group hover:border-green-200 hover:border-b-green-300 transition-colors duration-300">
      
      {/* Decorative background element */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-50 rounded-full blur-3xl opacity-50 group-hover:bg-green-100 transition-colors"></div>

      <div className="flex items-start justify-between mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <span className="inline-flex items-center px-3 py-1 bg-green-100 border-b-2 border-green-200 text-green-800 rounded-lg text-xs font-bold uppercase tracking-wider">
              {data.partOfSpeech}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tighter capitalize">
            {data.word}
          </h1>
        </div>
        
        <button
          onClick={speakWord}
          className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-200 border-b-[6px] text-slate-600 flex items-center justify-center hover:bg-green-50 hover:text-green-600 hover:border-green-200 hover:border-b-green-300 active:border-b-[2px] active:translate-y-[4px] transition-all"
          title="Listen to pronunciation"
        >
          <Volume2 className="w-7 h-7" />
        </button>
      </div>

      <div className="space-y-8 relative z-10">
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 border-l-4 border-l-green-400">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Definition
          </h3>
          <p className="text-xl md:text-2xl font-medium text-slate-700 leading-snug">
            {data.definition}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            Bangla Meaning
          </h3>
          <p className="text-3xl text-green-700 font-bengali font-bold">
            {data.bengaliDefinition}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WordDisplay;