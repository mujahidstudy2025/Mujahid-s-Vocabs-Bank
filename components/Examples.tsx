import React from 'react';
import { Quote } from 'lucide-react';

interface ExamplesProps {
  examples: string[];
}

const Examples: React.FC<ExamplesProps> = ({ examples }) => {
  if (!examples || examples.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 relative overflow-hidden group hover:shadow-orange-500/10 transition-all duration-500">
      <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-orange-500/10 rounded-bl-full -mr-5 sm:-mr-10 -mt-5 sm:-mt-10 transition-transform group-hover:scale-110 duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-2.5 bg-orange-500/20 text-orange-400 rounded-lg sm:rounded-xl border border-orange-500/20">
            <Quote className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">Context Examples</h3>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {examples.map((example, index) => (
            <div key={index} className="flex gap-3 sm:gap-4 group/item">
              <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-slate-800/50 text-slate-400 font-mono text-[10px] sm:text-xs border border-slate-700/50 group-hover/item:border-orange-500/50 group-hover/item:text-orange-400 transition-colors">
                {index + 1}
              </span>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed italic border-l-2 border-slate-700 pl-3 sm:pl-4 group-hover/item:border-orange-500/50 transition-colors">
                "{example}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Examples;