import React from 'react';
import { Layers } from 'lucide-react';

interface DerivativesProps {
  derivatives?: {
    base: string;
    noun: string;
    verb: string;
    adjective: string;
    adverb: string;
  };
}

const Derivatives: React.FC<DerivativesProps> = ({ derivatives }) => {
  if (!derivatives) return null;

  const forms = [
    { label: 'Base', value: derivatives.base },
    { label: 'Noun', value: derivatives.noun },
    { label: 'Verb', value: derivatives.verb },
    { label: 'Adj.', value: derivatives.adjective },
    { label: 'Adv.', value: derivatives.adverb },
  ];

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 relative overflow-hidden group hover:shadow-purple-500/10 transition-all duration-500 h-full">
      <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-purple-500/10 rounded-bl-full -mr-5 sm:-mr-10 -mt-5 sm:-mt-10 transition-transform group-hover:scale-110 duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-2.5 bg-purple-500/20 text-purple-400 rounded-lg sm:rounded-xl border border-purple-500/20">
            <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">Derivatives</h3>
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
          {forms.map((form) => (
            <div key={form.label} className="flex flex-col p-2 sm:p-3 bg-slate-800/50 rounded-lg sm:rounded-xl border border-slate-700/50 text-center hover:bg-purple-500/10 hover:border-purple-500/30 transition-colors duration-300">
              <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-1">{form.label}</span>
              <span className="text-xs sm:text-sm font-black text-slate-200 font-mono break-words leading-tight">
                {form.value !== 'N/A' ? (
                  form.value
                ) : (
                  <span className="text-slate-600 font-normal italic">N/A</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Derivatives;
