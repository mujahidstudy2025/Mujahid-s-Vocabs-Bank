import React from 'react';
import { ArrowRightLeft, ShieldX, ShieldCheck, Layers, GitFork } from 'lucide-react';

interface SynAntProps {
  synonyms: string[];
  antonyms: string[];
}

const SynonymsAntonyms: React.FC<SynAntProps> = ({ synonyms, antonyms }) => {
  if ((!synonyms || synonyms.length === 0) && (!antonyms || antonyms.length === 0)) return null;

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 relative overflow-hidden group hover:shadow-pink-500/20 transition-all duration-500 h-full shadow-3d border-t border-white/10 border-b-4 border-slate-900 transform hover:-translate-y-1">
      <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-pink-500/20 rounded-bl-full -mr-5 sm:-mr-10 -mt-5 sm:-mt-10 transition-transform group-hover:scale-110 duration-700"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-2.5 bg-pink-500/20 text-pink-400 rounded-lg sm:rounded-xl border-t border-pink-400/30 border-b-4 border-pink-900 shadow-md">
            <GitFork className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-sm" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow-md">Relations</h3>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {synonyms && synonyms.length > 0 && (
            <div className="p-4 bg-slate-900/40 rounded-2xl shadow-inner-3d border border-slate-700/50">
              <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 sm:mb-4 flex items-center gap-2 drop-shadow-sm">
                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                Synonyms
              </h4>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {synonyms.map((syn) => (
                  <span key={syn} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800/80 border-t border-slate-600/50 border-b-2 border-slate-900 text-slate-200 rounded-xl text-xs sm:text-sm font-medium hover:bg-green-500/20 hover:border-green-400/30 hover:text-green-300 transition-all hover:-translate-y-0.5 shadow-sm cursor-default">
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          )}

          {antonyms && antonyms.length > 0 && (
            <div className="p-4 bg-slate-900/40 rounded-2xl shadow-inner-3d border border-slate-700/50">
              <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 sm:mb-4 flex items-center gap-2 drop-shadow-sm">
                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]"></span>
                Antonyms
              </h4>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {antonyms.map((ant) => (
                  <span key={ant} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800/80 border-t border-slate-600/50 border-b-2 border-slate-900 text-slate-200 rounded-xl text-xs sm:text-sm font-medium hover:bg-red-500/20 hover:border-red-400/30 hover:text-red-300 transition-all hover:-translate-y-0.5 shadow-sm cursor-default">
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