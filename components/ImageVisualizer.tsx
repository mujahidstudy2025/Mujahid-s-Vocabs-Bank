import React from 'react';
import { ImageIcon, Loader2, Maximize2 } from 'lucide-react';

interface ImageVisualizerProps {
  imageUrl: string | null;
  isLoading: boolean;
  word: string;
}

const ImageVisualizer: React.FC<ImageVisualizerProps> = ({ imageUrl, isLoading, word }) => {
  return (
    <div className="h-full min-h-[350px] bg-slate-900 rounded-[2rem] border-4 border-slate-800 shadow-2xl relative overflow-hidden group ring-4 ring-slate-100 ring-offset-2">
      
      {/* Top Bar (Fake UI) */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-slate-800/80 backdrop-blur-sm z-20 flex items-center px-4 justify-between border-b border-white/10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
          AI-Vision-Engine
        </div>
      </div>

      {isLoading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 bg-slate-900">
          <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mb-6"></div>
          <p className="text-sm font-mono text-green-400 animate-pulse">GENERATING_VISUAL...</p>
        </div>
      ) : imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt={`Visualization of ${word}`}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
          
          <div className="absolute bottom-6 left-6 right-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-white/90 text-xs font-mono">
              <ImageIcon className="w-3 h-3" />
              <span>generated_by_gemini_2.5</span>
            </div>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white/20 bg-slate-900">
          <div className="text-center">
             <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center mx-auto mb-4">
               <ImageIcon className="w-8 h-8 opacity-50" />
             </div>
             <p className="text-xs font-mono">NO_IMAGE_DATA</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageVisualizer;