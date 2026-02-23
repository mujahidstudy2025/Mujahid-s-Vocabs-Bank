import React from 'react';
import { ArrowRightLeft, ShieldX, ShieldCheck, Layers } from 'lucide-react';

interface SynAntProps {
  synonyms: string[];
  antonyms: string[];
}

const SynonymsAntonyms: React.FC<SynAntProps> = ({ synonyms, antonyms }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
      {/* Synonyms */}
      <div className="bg-white rounded-[2rem] p-8 border-2 border-slate-100 border-b-[6px] border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Layers className="w-24 h-24 text-green-900" />
        </div>
        
        <h3 className="text-green-700 font-extrabold text-xl mb-6 flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg text-green-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          Synonyms
        </h3>
        <div className="flex flex-wrap gap-3">
          {synonyms && synonyms.length > 0 ? (
            synonyms.map((syn, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-green-50 text-green-800 rounded-xl text-sm font-bold border-b-4 border-green-200 hover:-translate-y-1 hover:border-b-green-300 transition-all cursor-default"
              >
                {syn}
              </span>
            ))
          ) : (
            <span className="text-slate-400 text-sm font-mono p-2">No synonyms found</span>
          )}
        </div>
      </div>

      {/* Antonyms */}
      <div className="bg-white rounded-[2rem] p-8 border-2 border-slate-100 border-b-[6px] border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <ArrowRightLeft className="w-24 h-24 text-rose-900" />
        </div>

        <h3 className="text-rose-700 font-extrabold text-xl mb-6 flex items-center gap-3">
          <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
            <ShieldX className="w-5 h-5" />
          </div>
          Antonyms
        </h3>
        <div className="flex flex-wrap gap-3">
          {antonyms && antonyms.length > 0 ? (
            antonyms.map((ant, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-rose-50 text-rose-800 rounded-xl text-sm font-bold border-b-4 border-rose-200 hover:-translate-y-1 hover:border-b-rose-300 transition-all cursor-default"
              >
                {ant}
              </span>
            ))
          ) : (
            <span className="text-slate-400 text-sm font-mono p-2">No antonyms found</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SynonymsAntonyms;