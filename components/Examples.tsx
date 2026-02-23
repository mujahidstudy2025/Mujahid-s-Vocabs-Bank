import React from 'react';
import { Quote, Sparkle } from 'lucide-react';

interface ExamplesProps {
  examples: string[];
}

const Examples: React.FC<ExamplesProps> = ({ examples }) => {
  if (!examples || examples.length === 0) return null;

  return (
    <div className="bg-white rounded-[2rem] p-8 md:p-10 border-2 border-slate-100 border-b-[8px] border-slate-200">
      <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
           <Quote className="w-5 h-5" />
        </div>
        Real-World Context
      </h3>
      
      <div className="grid grid-cols-1 gap-4">
        {examples.map((example, index) => (
          <div 
            key={index} 
            className="group flex gap-5 p-6 bg-slate-50 hover:bg-green-50 rounded-2xl border-2 border-slate-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex-shrink-0">
               <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border-2 border-slate-200 text-slate-400 font-bold text-sm font-mono group-hover:border-green-300 group-hover:text-green-600 transition-colors">
                  {index + 1}
               </span>
            </div>
            <p className="text-slate-600 group-hover:text-slate-800 text-lg leading-relaxed font-medium">
              "{example}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Examples;