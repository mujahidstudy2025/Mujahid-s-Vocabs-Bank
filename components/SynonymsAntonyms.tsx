import React from 'react';
import { ArrowRightLeft, ShieldX, ShieldCheck, Layers, GitFork } from 'lucide-react';

interface SynAntProps {
  synonyms: string[];
  antonyms: string[];
}

const SynonymsAntonyms: React.FC<SynAntProps> = ({ synonyms, antonyms }) => {
  if ((!synonyms || synonyms.length === 0) && (!antonyms || antonyms.length === 0)) return null;

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 relative overflow-hidden group hover:shadow-pink-500/10 transition-all duration-500 h-full">
      <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-pink-500/10 rounded-bl-full -mr-5 sm:-mr-10 -mt-5 sm:-mt-10 transition-transform group-hover:scale-110 duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-2.5 bg-pink-500/20 text-pink-400 rounded-lg sm:rounded-xl border border-pink-500/20">
            <GitFork className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">Relations</h3>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {synonyms && synonyms.length > 0 && (
            <div>
              <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 sm:mb-3 flex items-center gap-2">
                <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-green-400"></span>
                Synonyms
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {synonyms.map((syn) => (
                  <span key={syn} className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-500/20 hover:border-green-500/30 hover:text-green-300 transition-colors cursor-default">
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          )}

          {antonyms && antonyms.length > 0 && (
            <div>
              <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 sm:mb-3 flex items-center gap-2">
                <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-red-400"></span>
                Antonyms
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {antonyms.map((ant) => (
                  <span key={ant} className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-lg text-xs sm:text-sm font-medium hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-300 transition-colors cursor-default">
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