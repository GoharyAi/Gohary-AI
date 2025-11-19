import { GoogleGenAI, Modality } from "@google/genai";
import JSZip from "jszip";

const getClient = (): GoogleGenAI => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please configure your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(new Error("Failed to read file. Please try again."));
  });
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Robust helper to extract JSON array from mixed text response.
 * Fixes issues where AI adds "Here is the JSON..." preamble.
 */
const extractJson = (text: string): any => {
  try {
    // 1. Try direct parse
    return JSON.parse(text);
  } catch (e) {
    // 2. Try extracting [...] or {...} pattern
    const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e2) {
        console.warn("JSON Extraction failed on regex match", e2);
      }
    }
    // 3. Cleanup markdown
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
      return JSON.parse(cleanText);
    } catch (e3) {
      throw new Error("Failed to parse AI response. The model did not return valid structured data.");
    }
  }
};

/**
 * Centralized Error Formatter
 */
const formatGeminiError = (error: any): string => {
  const msg = (error?.message || JSON.stringify(error)).toLowerCase();
  const status = error?.status || '';

  if (msg.includes('429') || status === 'RESOURCE_EXHAUSTED' || msg.includes('quota')) {
    return "High traffic (Rate Limit). Auto-retrying...";
  }
  if (msg.includes('safety') || msg.includes('blocked')) {
    return "Generation blocked by safety filters. The AI detected sensitive content (face/identity/content policy). Try a simpler prompt.";
  }
  if (msg.includes('recitation')) {
    return "Blocked due to copyright recitation policy.";
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return "Network connection issue. Please check your internet.";
  }
  if (msg.includes('valid json')) {
    return "AI response structure error. Please try simplifying your script.";
  }
  return error.message || "An unexpected error occurred.";
};

/**
 * Wrapper to handle Retries for Rate Limits (429)
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const msg = (error?.message || '').toLowerCase();
    if (retries > 0 && (msg.includes('429') || msg.includes('quota') || msg.includes('resource_exhausted') || msg.includes('fetch'))) {
      console.warn(`API hit rate limit. Retrying in ${delay}ms... (${retries} left)`);
      await wait(delay);
      return withRetry(fn, retries - 1, delay * 2); // Exponential backoff
    }
    throw error;
  }
}

// --- Shared Image Tools ---

export const editImage = async (imageFile: File, prompt: string): Promise<string> => {
  return withRetry(async () => {
    const ai = getClient();
    const base64Data = await fileToBase64(imageFile);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { mimeType: imageFile.type, data: base64Data } },
            { text: prompt }
          ]
        },
        config: { responseModalities: [Modality.IMAGE] }
      });

      const candidate = response.candidates?.[0];
      if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
         throw new Error(`Generation stopped: ${candidate.finishReason}`);
      }

      const part = candidate?.content?.parts?.[0];
      if (part?.inlineData?.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
      throw new Error("The model processed the request but returned no image data.");
    } catch (error: any) {
      throw new Error(formatGeminiError(error));
    }
  });
};

export const generateFromCompositeImages = async (images: File[], prompt: string): Promise<string> => {
  return withRetry(async () => {
    const ai = getClient();
    const parts = [];
    for (const file of images) {
      const base64 = await fileToBase64(file);
      parts.push({ inlineData: { mimeType: file.type, data: base64 } });
    }
    parts.push({ text: prompt });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: { responseModalities: [Modality.IMAGE] }
      });
      
      const part = response.candidates?.[0]?.content?.parts?.[0];
      if (part?.inlineData?.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
      
      const finishReason = response.candidates?.[0]?.finishReason;
      if (finishReason === 'SAFETY' || finishReason === 'IMAGE_OTHER') {
        throw new Error(`Image blocked by safety filters (${finishReason}).`);
      }
      
      throw new Error("No image returned.");
    } catch (error: any) {
      throw new Error(formatGeminiError(error));
    }
  });
};

export const analyzeImage = async (imageFile: File): Promise<string> => {
  return withRetry(async () => {
    const ai = getClient();
    const base64Data = await fileToBase64(imageFile);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: imageFile.type, data: base64Data } },
          { text: "Analyze this image deeply. Describe the subject, lighting, colors, style, and composition in a way that can be used as a prompt to recreate it. LANGUAGE RULE: If the image contains Arabic text or elements, describe in Arabic. Otherwise, default to English." }
        ]
      }
    });
    return response.text || "Analysis failed to return text.";
  });
};

// --- Creative Professionals Tools ---

export const generateLogo = async (prompt: string, style: string, shape: 'square' | 'circle'): Promise<string> => {
    return withRetry(async () => {
      const ai = getClient();
      
      const shapeInstruction = shape === 'circle' 
        ? "Shape: The logo MUST be designed as a circular emblem/badge. All graphics must be contained within a circle."
        : "Shape: The logo MUST be designed as a balanced square composition.";

      const fullPrompt = `
        Design a PROFESSIONAL Vector Logo.
        Concept: ${prompt}.
        Style: ${style}.
        ${shapeInstruction}
        
        STRICT VISUAL REQUIREMENTS:
        - Output must look like an Adobe Illustrator Vector graphic.
        - Flat design, clean lines, minimalist.
        - SOLID WHITE background (easy to remove).
        - High contrast, distinct shapes.
        - NO photorealistic details, shadows, or 3D render effects. Keep it graphical and symbolic.
        - NO text gibberish. If the concept implies text, use abstract lines or very clear bold letters.
        - High Quality, 4k resolution.
      `;
  
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: fullPrompt }] },
          config: { responseModalities: [Modality.IMAGE] }
      });
  
      const part = response.candidates?.[0]?.content?.parts?.[0];
      if (part?.inlineData?.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
      }
      throw new Error("No logo returned.");
    });
  };

export const analyzeBrandIdentity = async (logoFile: File, companyName: string): Promise<any> => {
    return withRetry(async () => {
      const ai = getClient();
      const base64Data = await fileToBase64(logoFile);
      
      const prompt = `
        Analyze this logo for company "${companyName}".
        
        LANGUAGE RULE: Detect the language of the input company name. 
        - If the name is in Arabic, generate the Output JSON values (brand_voice, industry_fit, typography) in ARABIC.
        - If English, use English.

        Generate a Brand Identity Guide in JSON format containing:
        1. "colors": Array of hex codes extracted from the logo + complementary colors.
        2. "typography": Suggested font pairings (Headings, Body).
        3. "brand_voice": A short paragraph describing the personality/vibe of this brand (In detected language).
        4. "industry_fit": Predicted industry sector (In detected language).
  
        Output strict JSON.
      `;
  
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            { inlineData: { mimeType: logoFile.type, data: base64Data } },
            { text: prompt }
          ]
        },
        config: { responseMimeType: "application/json" }
      });
  
      return extractJson(response.text || "{}");
    });
  };

// --- Filmmaker Tools ---

export interface ScriptShot {
  slugline: string;
  action: string;
  visual_prompt: string;
}

export const generateCinematicScript = async (story: string): Promise<ScriptShot[]> => {
  return withRetry(async () => {
    const ai = getClient();
    const prompt = `
      Act as a Professional Screenwriter and Visual Director.
      Convert the following story into a SHOT-BY-SHOT breakdown.
      
      LANGUAGE RULE: Detect the language of the 'Story' input. 
      - If the input is ARABIC, the "slugline" and "action" MUST be in ARABIC.
      - The "visual_prompt" must ALWAYS remain in ENGLISH for the image generator.
      
      Story: ${story}
      
      Return a JSON ARRAY where each object contains:
      1. "slugline" (e.g., "EXT. CASTLE GATES - NIGHT" or "مشهد خارجي - بوابة القلعة - ليل")
      2. "action" (The dramatic action description for the script in input language)
      3. "visual_prompt" (Highly detailed AI image generation prompt describing this shot. ALWAYS ENGLISH).
      
      Output strict JSON only.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return extractJson(response.text || "[]");
  });
};

export const generateNovel = async (genre: string, idea: string, characters: string): Promise<string> => {
  return withRetry(async () => {
    const ai = getClient();
    const prompt = `
      Act as a world-class Best Selling Author.
      Write the first chapter based on:
      
      Genre/Style: ${genre}
      Core Idea: ${idea}
      Main Characters: ${characters}
      
      LANGUAGE RULE: Detect the language of the 'Core Idea' and 'Characters'. 
      - If the input is ARABIC, write the entire novel chapter in ARABIC.
      - If English, write in English.
      
      Requirements:
      - High-level literary quality.
      - Deep character development.
      - Vivid, cinematic imagery.
      - Proper formatting (paragraphs, dialogue).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    return response.text || "Failed to generate novel.";
  });
};

// --- Storyboard Specific Logic ---

export interface StoryboardScene {
  id: number;
  description: string;
  camera_movement: string;
}

export const optimizeScript = async (rawScript: string): Promise<string> => {
  return withRetry(async () => {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Act as a professional scriptwriter. Polish, format, and improve the following script to make it visually evocative.
        
        LANGUAGE RULE: Detect the language of the input script. The output MUST be in the SAME language (Arabic or English).
        
        Script: ${rawScript}
      `
    });
    return response.text || rawScript;
  });
};

export const generateStoryboardStructure = async (script: string, sceneCount: number | 'auto'): Promise<StoryboardScene[]> => {
  return withRetry(async () => {
    const ai = getClient();
    
    const countInstruction = sceneCount === 'auto' 
      ? "Break this down into a logical number of scenes (approx 4-8)." 
      : `Break this down into EXACTLY ${sceneCount} scenes.`;

    const prompt = `
      You are a Professional Storyboard Director.
      ${countInstruction}
      
      LANGUAGE RULE: Detect the language of the 'Script'. 
      - The "description" field MUST be in the SAME language as the input script (Arabic or English).
      - The "camera_movement" field can be in English or Arabic (standard film terms).
      
      Goal: Create a visually coherent sequence.
      Return a JSON ARRAY of objects.
      
      Each object must have: 
      - "id" (number)
      - "description" (Strict visual description of the frame. Mention lighting, lens type, and subject position. Ensure it flows from the previous scene).
      - "camera_movement" (Specific movement for a video editor).
      
      Do not include any markdown or explanation. Just the JSON array.
      
      Script: ${script}
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from AI.");
    
    return extractJson(text);
  });
};

export const generateSceneImage = async (
  scene: StoryboardScene,
  refImage: File | null,
  aspectRatio: '16:9' | '9:16' | '1:1'
): Promise<string> => {
  const ai = getClient();
  
  let arText = "";
  if (aspectRatio === '16:9') arText = "Cinematic 16:9 Widescreen";
  else if (aspectRatio === '9:16') arText = "Vertical 9:16 Social Media";
  else arText = "Square 1:1 Format";

  // Global visual consistency instructions
  const visualConsistency = "Unified Cinematic Style: Shot on 35mm film, master lighting, consistent color grading, hyper-realistic details. NO TEXT, NO WATERMARKS, NO TITLES.";

  // Helper function for the actual generation call to allow cleaner retries
  const attemptGeneration = async (useRef: boolean): Promise<string> => {
    return withRetry(async () => {
      // Note: Image models work best with English prompts, but Gemini is multimodal.
      // We pass the description as is. The model typically translates context internally for image features.
      const prompt = useRef 
        ? `Storyboard Frame ${scene.id}. Scene: ${scene.description}. Camera Action: ${scene.camera_movement}. Aspect: ${arText}. ${visualConsistency}. STRICT INSTRUCTION: Maintain exact character likeness from the reference image.`
        : `Storyboard Frame ${scene.id}. Scene: ${scene.description}. Camera Action: ${scene.camera_movement}. Aspect: ${arText}. ${visualConsistency}.`;

      const parts: any[] = useRef && refImage 
        ? [
            { inlineData: { mimeType: refImage.type, data: await fileToBase64(refImage) } },
            { text: prompt }
          ]
        : [{ text: prompt }];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: { responseModalities: [Modality.IMAGE] }
      });

      const part = response.candidates?.[0]?.content?.parts?.[0];
      
      // Check for refusal
      if (response.candidates?.[0]?.finishReason === 'SAFETY' || response.candidates?.[0]?.finishReason === 'IMAGE_OTHER') {
        throw new Error("SAFETY_BLOCK");
      }

      if (part?.inlineData?.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
      throw new Error("NO_DATA");
    }, 2, 2000); // 2 Retries specifically for image gen
  };

  // 1. Try with Reference Image (if available)
  if (refImage) {
    try {
      return await attemptGeneration(true);
    } catch (e: any) {
      console.warn(`Scene ${scene.id}: Ref image generation failed (${e.message}). Falling back to text-only.`);
      // Fallthrough to text-only
    }
  }

  // 2. Fallback to Text-Only (or if no ref image provided)
  try {
    return await attemptGeneration(false);
  } catch (e: any) {
    console.error(`Scene ${scene.id}: Text-only generation failed.`, e);
    throw new Error(formatGeminiError(e));
  }
};

// --- Advertising Agency Tools Logic ---

export const generateSwotAnalysis = async (companyName: string, description: string): Promise<any> => {
  return withRetry(async () => {
    const ai = getClient();
    const prompt = `
      Perform a professional SWOT Analysis for the following business:
      Name: ${companyName}
      Description: ${description}

      LANGUAGE RULE: Detect the language of the input description. The output values inside the JSON MUST be in the SAME language (Arabic or English).

      Output JSON format only:
      {
        "strengths": ["point 1", "point 2", "point 3"],
        "weaknesses": ["point 1", "point 2", "point 3"],
        "opportunities": ["point 1", "point 2", "point 3"],
        "threats": ["point 1", "point 2", "point 3"]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return extractJson(response.text || "{}");
  });
};

export const generateMarketingStrategy = async (details: { product: string, audience: string, goal: string }): Promise<string> => {
  return withRetry(async () => {
    const ai = getClient();
    const prompt = `
      Create a comprehensive, professional Marketing Strategy for:
      Product/Service: ${details.product}
      Target Audience: ${details.audience}
      Primary Goal: ${details.goal}

      LANGUAGE RULE: Detect the language of the inputs. The report MUST be written in the SAME language (Arabic or English).

      Use Markdown formatting. Include sections for:
      1. Executive Summary
      2. Audience Persona
      3. Key Messaging
      4. Channel Strategy (Social, Paid, Organic)
      5. Content Ideas
      6. KPI Metrics
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    return response.text || "Failed to generate strategy.";
  });
};

export const generateCgiImage = async (prompt: string, style: string): Promise<string> => {
  return withRetry(async () => {
    const ai = getClient();
    const fullPrompt = `Generate a High-End CGI Render. Style: ${style}. Description: ${prompt}. Quality: 8k, Octane Render, Ray Tracing, Hyper-realistic, Cinematic Lighting.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: fullPrompt }] },
        config: { responseModalities: [Modality.IMAGE] }
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData?.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No CGI image returned.");
  });
};

// --- Export Functions ---

export const createHtmlExport = (scenes: StoryboardScene[], images: {[key: number]: string}) => {
  const cardsHtml = scenes.map(scene => {
    const imgUrl = images[scene.id] || '';
    return `
      <div class="card">
        <div class="image-container">
          ${imgUrl ? `<img src="${imgUrl}" alt="Scene ${scene.id}" />` : '<div class="placeholder">No Image</div>'}
          <div class="badge">Scene ${scene.id}</div>
        </div>
        <div class="content">
          <p class="desc">${scene.description}</p>
          <div class="camera">
            <span class="icon">📹</span> ${scene.camera_movement}
          </div>
        </div>
      </div>
    `;
  }).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AI Storyboard Export</title>
      <style>
        body { background-color: #111827; color: #fff; font-family: sans-serif; margin: 0; padding: 40px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; max-width: 1200px; mx-auto; }
        .card { background: #1f2937; border-radius: 12px; overflow: hidden; border: 1px solid #374151; transition: transform 0.2s; }
        .card:hover { transform: translateY(-5px); }
        .image-container { position: relative; aspect-ratio: 16/9; background: #000; }
        img { width: 100%; height: 100%; object-fit: cover; }
        .badge { position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.8); padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 12px; text-transform: uppercase; }
        .content { padding: 16px; }
        .desc { font-size: 14px; line-height: 1.5; margin-bottom: 16px; color: #d1d5db; }
        .camera { font-size: 12px; color: #ef4444; font-weight: bold; text-transform: uppercase; background: rgba(239, 68, 68, 0.1); padding: 8px; border-radius: 6px; display: inline-block; }
      </style>
    </head>
    <body>
      <h1 style="text-align: center; margin-bottom: 40px; text-transform: uppercase; letter-spacing: 2px;">Storyboard Project</h1>
      <div class="grid">
        ${cardsHtml}
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'storyboard_project.html';
  link.click();
  URL.revokeObjectURL(url);
};

export const createZipExport = async (images: {[key: number]: string}) => {
  const zip = new JSZip();
  const imgFolder = zip.folder("images");

  for (const [id, dataUrl] of Object.entries(images)) {
    const base64Data = dataUrl.split(',')[1];
    imgFolder?.file(`scene_${id}.png`, base64Data, { base64: true });
  }

  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'storyboard_images.zip';
  link.click();
  URL.revokeObjectURL(url);
};

export const createSinglePanelExport = (scene: StoryboardScene, imageUrl: string, aspectRatio: '16:9'|'9:16'|'1:1') => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  img.onload = () => {
    if (aspectRatio === '16:9') {
      canvas.width = 1920;
      canvas.height = 1080;
    } else if (aspectRatio === '9:16') {
      canvas.width = 1080;
      canvas.height = 1920;
    } else {
      canvas.width = 1080;
      canvas.height = 1080;
    }

    if (!ctx) return;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw overlay
    ctx.fillStyle = 'rgba(17, 24, 39, 0.85)';
    ctx.strokeStyle = 'rgba(55, 65, 81, 0.5)';
    
    const boxHeight = canvas.height * 0.25;
    const boxY = canvas.height - boxHeight - 40;
    const boxX = 40;
    const boxWidth = canvas.width - 80;
    
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 20);
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.fillStyle = '#ffffff';
    const titleSize = aspectRatio === '1:1' ? 30 : 40;
    ctx.font = `bold ${titleSize}px sans-serif`;
    ctx.fillText(`SCENE ${scene.id}`, boxX + 40, boxY + 60);

    ctx.fillStyle = '#d1d5db';
    const descSize = aspectRatio === '1:1' ? 24 : 32;
    ctx.font = `${descSize}px sans-serif`;
    const desc = scene.description.length > 100 ? scene.description.substring(0, 100) + '...' : scene.description;
    ctx.fillText(desc, boxX + 40, boxY + 120);

    ctx.fillStyle = '#ef4444';
    const metaSize = aspectRatio === '1:1' ? 22 : 28;
    ctx.font = `bold ${metaSize}px monospace`;
    ctx.fillText(`CAM: ${scene.camera_movement}`, boxX + 40, boxY + boxHeight - 40);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `storyboard_scene_${scene.id}.jpg`;
    link.click();
  };
  img.src = imageUrl;
};