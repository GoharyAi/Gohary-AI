import React, { useState } from 'react';
import { FileUploader } from '../ui/FileUploader';
import { Users, Sparkles, Loader2, Download, ArrowRight, AlertCircle } from 'lucide-react';
import { generateFromCompositeImages } from '../../services/geminiService';

export const ImageCloning: React.FC = () => {
  const [refImage, setRefImage] = useState<File | null>(null);
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!refImage || !faceImage) return;
    
    setIsLoading(true);
    setError(null);
    setResultImage(null);

    // Improved prompt specifically for "Face Swap / Context Transfer" behavior
    const prompt = `
      Perform a high-fidelity Face Swap and Context Transfer.
      
      INPUTS:
      - Image 1 (First input provided): THE CONTEXT REFERENCE. Use this image's exact background, scenery, body pose, clothing, and lighting.
      - Image 2 (Second input provided): THE SUBJECT IDENTITY. Use this person's exact facial identity (eyes, nose, mouth, unique features).

      TASK:
      Generate a photorealistic image where the person from Image 2 is wearing the clothes and standing in the exact environment of Image 1.
      
      STRICT REQUIREMENTS:
      1. PRESERVE CONTEXT: The background, clothes, lighting, and pose MUST match Image 1 exactly.
      2. PRESERVE IDENTITY: The face MUST be clearly recognizable as the person in Image 2.
      3. SEAMLESS BLENDING: Blend the skin tones and lighting of the face from Image 2 naturally into the body/environment of Image 1.
      4. OUTPUT QUALITY: The result must be a realistic photograph.
    `;

    try {
      const result = await generateFromCompositeImages([refImage, faceImage], prompt);
      setResultImage(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate clone. Please ensure both images are clear.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">
      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-tight mb-4">
          AI <span className="text-green-600 dark:text-green-500">Cloning & Face Swap</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Transfer a person into a new scene or outfit while preserving their exact facial features.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid md:grid-cols-5 gap-8 items-center">
        
        {/* Step 1: Reference */}
        <div className="md:col-span-2 space-y-4">
           <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                 <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center font-bold text-sm">1</div>
                 <div>
                   <h3 className="font-bold uppercase text-sm">Context Reference</h3>
                   <p className="text-[10px] text-gray-500 uppercase">Clothes, Pose, Background</p>
                 </div>
              </div>
              <FileUploader 
                label="Upload Reference Image" 
                onFileSelect={setRefImage} 
                selectedFile={refImage}
              />
              <div className="mt-3 flex items-start p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-700 dark:text-blue-300">
                 <AlertCircle size={12} className="mt-0.5 mr-2 flex-shrink-0" />
                 <p>This image defines the <strong>body, outfit, and scene</strong>.</p>
              </div>
           </div>
        </div>

        {/* Separator / Icon */}
        <div className="md:col-span-1 flex justify-center">
           <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-green-500/30 animate-pulse-slow">
             <Sparkles size={20} />
           </div>
        </div>

        {/* Step 2: Face/Subject */}
        <div className="md:col-span-2 space-y-4">
           <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                 <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center font-bold text-sm">2</div>
                 <div>
                    <h3 className="font-bold uppercase text-sm">Subject Identity</h3>
                    <p className="text-[10px] text-gray-500 uppercase">Face, Features, Head</p>
                 </div>
              </div>
              <FileUploader 
                label="Upload Person Image" 
                onFileSelect={setFaceImage} 
                selectedFile={faceImage}
              />
              <div className="mt-3 flex items-start p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs text-green-700 dark:text-green-300">
                 <AlertCircle size={12} className="mt-0.5 mr-2 flex-shrink-0" />
                 <p>This person's <strong>face</strong> will be transferred.</p>
              </div>
           </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="mt-12 text-center">
        <button 
          onClick={handleGenerate}
          disabled={!refImage || !faceImage || isLoading}
          className={`px-12 py-5 rounded-full font-bold uppercase tracking-widest text-sm transition-all transform hover:scale-105 flex items-center justify-center mx-auto space-x-2 ${
            (refImage && faceImage && !isLoading)
              ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-xl shadow-green-600/30' 
              : 'bg-gray-200 dark:bg-white/10 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Users size={20} />}
          <span>{isLoading ? 'Processing Swap...' : 'Swap Face & Context'}</span>
        </button>
        <p className="text-xs text-gray-400 mt-4 uppercase tracking-wide">
          Powered by Gemini 2.5 Multimodal Vision
        </p>
        
        {error && (
          <div className="text-red-500 mt-4 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded max-w-md mx-auto">
            {error}
          </div>
        )}
      </div>

      {/* Result Display */}
      {resultImage && (
        <div className="mt-16 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-8 animate-fade-in">
           <h3 className="text-center text-xl font-bold uppercase tracking-widest mb-8">Generated Result</h3>
           <div className="flex flex-col items-center">
              <img src={resultImage} alt="Clone Result" className="max-w-full max-h-[500px] rounded-lg shadow-2xl mb-6" />
              <a 
                href={resultImage} 
                download="gohary-face-swap.png"
                className="flex items-center px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-bold uppercase hover:opacity-80 transition-opacity"
              >
                <Download size={16} className="mr-2" /> Download Result
              </a>
           </div>
        </div>
      )}
    </div>
  );
};
