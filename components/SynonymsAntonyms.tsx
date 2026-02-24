import React from 'react';
import { ArrowRightLeft, ShieldX, ShieldCheck, Layers, GitFork } from 'lucide-react';

interface SynAntProps {
  synonyms: string[];
  antonyms: string[];
}

const SynonymsAntonyms: React.FC<SynAntProps> = ({ synonyms, antonyms }) => {
  if ((!synonyms || synonyms.length === 0) && (!antonyms || antonyms.length === 0)) return null;

  return (
    <div className="glass-card rounded-3xl p-6 relative overflow-hidden group hover:shadow-pink-500/10 transition-all duration-500 h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-pink-500/20 text-pink-400 rounded-xl border border-pink-500/20">
            <GitFork className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Relations</h3>
        </div>

        <div className="space-y-6">
          {synonyms && synonyms.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                Synonyms
              </h4>
              <div className="flex flex-wrap gap-2">
                {synonyms.map((syn) => (
                  <span key={syn} className="px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-lg text-sm font-medium hover:bg-green-500/20 hover:border-green-500/30 hover:text-green-300 transition-colors cursor-default">
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          )}

          {antonyms && antonyms.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                Antonyms
              </h4>
              <div className="flex flex-wrap gap-2">
                {antonyms.map((ant) => (
                  <span key={ant} className="px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-lg text-sm font-medium hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-300 transition-colors cursor-default">
                    {ant}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SynonymsAntonyms;