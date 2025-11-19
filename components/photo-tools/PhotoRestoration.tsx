import React, { useState } from 'react';
import { FileUploader } from '../ui/FileUploader';
import { Wand2, Palette, Zap, Eraser, ArrowRight, Loader2, Download, Paintbrush } from 'lucide-react';
import { editImage } from '../../services/geminiService';

type ToolMode = 'restore' | 'colorize' | 'enhance' | 'object-edit';

interface ColorStyle {
  id: string;
  label: string;
  promptSuffix: string;
  color: string;
}

export const PhotoRestoration: React.FC = () => {
  const [mode, setMode] = useState<ToolMode>('restore');
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedColorStyle, setSelectedColorStyle] = useState<string>('realistic');

  const modes = [
    { id: 'restore', label: 'Restoration', icon: Wand2, desc: 'Remove scratches & fix tears' },
    { id: 'colorize', label: 'Colorize', icon: Palette, desc: 'Turn B&W photos to color' },
    { id: 'enhance', label: 'Enhance', icon: Zap, desc: 'Upscale & improve quality' },
    { id: 'object-edit', label: 'Magic Edit', icon: Eraser, desc: 'Nano Banana Smart Edits' },
  ];

  const colorStyles: ColorStyle[] = [
    { 
      id: 'realistic', 
      label: 'Realistic', 
      promptSuffix: 'Use strictly realistic colors, natural skin tones, and historically accurate colors.', 
      color: 'bg-green-500' 
    },
    { 
      id: 'vintage', 
      label: 'Vintage', 
      promptSuffix: 'Use a warm, slightly muted, nostalgic palette reminiscent of 1970s photography.', 
      color: 'bg-yellow-600' 
    },
    { 
      id: 'vibrant', 
      label: 'Vibrant', 
      promptSuffix: 'Use highly saturated, vibrant colors with high contrast for a modern cinematic look.', 
      color: 'bg-purple-500' 
    },
    { 
      id: 'pastel', 
      label: 'Pastel', 
      promptSuffix: 'Use a soft, dreamy, pastel color palette with low contrast.', 
      color: 'bg-pink-300' 
    },
    { 
      id: 'dramatic', 
      label: 'Dramatic', 
      promptSuffix: 'Use deep, moody lighting with strong shadows and rich colors.', 
      color: 'bg-red-700' 
    },
  ];

  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleContinueToColorize = () => {
    if (resultImage) {
      const file = dataURLtoFile(resultImage, "restored-image.png");
      setImage(file);
      setResultImage(null);
      setMode('colorize');
      setError(null);
    }
  };

  const handleProcess = async () => {
    if (!image) return;
    
    setIsLoading(true);
    setError(null);
    setResultImage(null);

    let finalPrompt = "";
    switch (mode) {
      case 'restore':
        finalPrompt = "Restore this old photograph. Remove scratches, tears, dust, and noise. Fix the damage and make it look like a high-quality new photo while preserving the original content.";
        break;
      case 'colorize':
        const style = colorStyles.find(s => s.id === selectedColorStyle);
        finalPrompt = `Colorize this black and white image. ${style?.promptSuffix || ''}`;
        break;
      case 'enhance':
        finalPrompt = "Enhance this image. Sharpen details, improve lighting and contrast, and increase perceived resolution. Make it look high-definition.";
        break;
      case 'object-edit':
        finalPrompt = `Edit this image using Nano Banana capabilities: ${prompt}. Maintain the style and lighting of the original image.`;
        break;
    }

    try {
      const result = await editImage(image, finalPrompt);
      setResultImage(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 pt-24 pb-20 min-h-screen">
      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-tight mb-4">
          Photo <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Restoration Suite</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Advanced AI tools to bring your memories back to life. Choose a module below.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id as ToolMode); setResultImage(null); setError(null); }}
            className={`flex flex-col items-center p-6 rounded-xl border transition-all duration-300 ${
              mode === m.id
                ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-lg transform scale-105'
                : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-white/30'
            }`}
          >
            <m.icon className={`w-6 h-6 mb-3 ${mode === m.id ? 'text-current' : 'text-gray-400 dark:text-gray-500'}`} />
            <span className="font-bold text-sm uppercase tracking-wide">{m.label}</span>
            <span className="text-[10px] opacity-70 mt-1 font-normal">{m.desc}</span>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 lg:p-12 shadow-xl">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-16 items-start">
          
          {/* Input Section */}
          <div className="space-y-8">
            <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl border border-gray-100 dark:border-white/5">
                <FileUploader 
                  label={`Upload Image for ${modes.find(m => m.id === mode)?.label}`} 
                  onFileSelect={(f) => { setImage(f); setResultImage(null); }}
                  selectedFile={image}
                />
            </div>

            {mode === 'colorize' && (
              <div className="animate-fade-in space-y-3">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  Select Color Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {colorStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedColorStyle(style.id)}
                      className={`relative px-3 py-4 rounded-lg border text-left transition-all ${
                        selectedColorStyle === style.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500'
                          : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full mb-2 ${style.color}`}></div>
                      <span className={`block text-xs font-bold ${selectedColorStyle === style.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        {style.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'object-edit' && (
              <div className="space-y-3 animate-fade-in">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  Nano Banana Instructions
                </label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., 'Add a retro filter', 'Remove the person in the background', 'Change the sky to sunset'..."
                  className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg p-4 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors min-h-[120px]"
                />
                <p className="text-[10px] text-gray-400">Powered by Gemini 2.5 Flash Image (Nano Banana)</p>
              </div>
            )}

            <button 
              onClick={handleProcess}
              disabled={!image || isLoading || (mode === 'object-edit' && !prompt.trim())}
              className={`w-full py-5 rounded-lg font-bold uppercase tracking-widest text-sm flex items-center justify-center space-x-2 transition-all ${
                (!image || isLoading || (mode === 'object-edit' && !prompt.trim()))
                  ? 'bg-gray-200 dark:bg-white/10 text-gray-400 cursor-not-allowed'
                  : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90 shadow-lg' 
              }`}
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
              <span>{isLoading ? 'Processing...' : 'Start Processing'}</span>
            </button>
            
            {error && (
              <div className="text-red-500 text-xs text-center bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-900/50">
                {error}
              </div>
            )}
          </div>

          {/* Result Section */}
          <div className="h-full min-h-[500px] bg-gray-100 dark:bg-black/40 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            {resultImage ? (
               <div className="relative w-full h-full flex flex-col items-center justify-center animate-fade-in z-10">
                 <img src={resultImage} alt="Processed" className="max-w-full max-h-[500px] object-contain shadow-2xl rounded-lg mb-8" />
                 
                 <div className="flex flex-wrap justify-center gap-4 w-full">
                   <a 
                    href={resultImage} 
                    download={`gohary-ai-${mode}.png`}
                    className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-full text-xs font-bold uppercase hover:bg-blue-700 transition-colors shadow-lg"
                   >
                     <Download size={14} className="mr-2" /> Download
                   </a>

                   {mode === 'restore' && (
                     <button 
                       onClick={handleContinueToColorize}
                       className="flex items-center px-8 py-3 bg-purple-600 text-white rounded-full text-xs font-bold uppercase hover:bg-purple-700 transition-colors shadow-lg"
                     >
                       <Palette size={14} className="mr-2" /> Colorize This
                     </button>
                   )}
                 </div>
               </div>
            ) : (
              <div className="relative z-10 max-w-xs">
                {isLoading ? (
                   <div className="flex flex-col items-center">
                     <Loader2 className="animate-spin text-blue-600 dark:text-blue-400 mb-4" size={48} />
                     <p className="text-sm font-bold animate-pulse">AI is working magic...</p>
                   </div>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-white dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <ArrowRight className="text-gray-300 dark:text-white/30" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">AI Processing Area</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      Your processed image will appear here.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};