import React, { useState } from 'react';
import { Box, MonitorPlay, Loader2, Download, Layers } from 'lucide-react';
import { generateCgiImage } from '../../services/geminiService';

export const CgiGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Photorealistic 3D');
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const styles = ['Photorealistic 3D', 'Octane Render', 'Unreal Engine 5', 'Isometric 3D', 'Cyberpunk', 'Abstract Fluid'];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const result = await generateCgiImage(prompt, style);
      setResultImage(result);
    } catch (err: any) {
      setError(err.message || "Failed to render CGI.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
      <div className="mb-12 text-center">
         <div className="w-20 h-20 mx-auto mb-6 bg-cyan-50 dark:bg-cyan-900/20 rounded-full flex items-center justify-center">
           <Box size={40} className="text-cyan-500" />
         </div>
         <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-tight mb-4">
           CGI <span className="text-cyan-500">Generator</span>
         </h2>
         <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
           Create high-fidelity 3D assets and backgrounds for your campaigns without 3D software.
         </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
         <div className="lg:col-span-4 space-y-6 bg-white dark:bg-white/5 p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg">
            <div>
               <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Visual Description</label>
               <textarea 
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 placeholder="Describe the object or scene. E.g. 'A futuristic glass perfume bottle on a floating rock'"
                 className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg p-4 text-sm min-h-[150px]"
               />
            </div>
            <div>
               <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Render Engine Style</label>
               <div className="grid grid-cols-2 gap-2">
                  {styles.map(s => (
                     <button 
                       key={s}
                       onClick={() => setStyle(s)}
                       className={`p-2 text-xs font-bold rounded border transition-colors ${style === s ? 'bg-cyan-500 text-white border-cyan-500' : 'border-gray-200 dark:border-white/10 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                     >
                        {s}
                     </button>
                  ))}
               </div>
            </div>
            <button 
               onClick={handleGenerate}
               disabled={!prompt || isLoading}
               className={`w-full py-5 rounded-lg font-bold uppercase tracking-widest text-sm flex items-center justify-center space-x-2 transition-all ${
                 (!prompt || isLoading)
                   ? 'bg-gray-200 dark:bg-white/10 text-gray-400 cursor-not-allowed'
                   : 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg' 
               }`}
             >
               {isLoading ? <Loader2 className="animate-spin" size={18} /> : <MonitorPlay size={18} />}
               <span>{isLoading ? 'Rendering...' : 'Render 3D Image'}</span>
             </button>
             {error && <p className="text-red-500 text-xs">{error}</p>}
         </div>

         <div className="lg:col-span-8 h-full min-h-[500px] bg-gray-100 dark:bg-black/40 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center relative overflow-hidden">
            {resultImage ? (
               <div className="relative w-full h-full flex flex-col items-center justify-center animate-fade-in">
                  <img src={resultImage} alt="CGI" className="w-full h-full object-cover" />
                  <a href={resultImage} download="gohary-cgi.png" className="absolute bottom-6 px-6 py-3 bg-black/80 text-white rounded-full backdrop-blur-md font-bold uppercase text-xs hover:bg-black">
                     <Download className="inline-block mr-2 w-4 h-4"/> Download Asset
                  </a>
               </div>
            ) : (
               <div className="text-center opacity-30">
                  <Layers size={64} className="mx-auto mb-4" />
                  <p className="text-2xl font-heading font-bold uppercase">Viewport</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};