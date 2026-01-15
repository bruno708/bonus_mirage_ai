import { GoogleGenAI } from "@google/genai";
import { ModelType, GenerationConfig } from "../types";

// Helper to map UI model names to actual Gemini Model IDs
const getGeminiModelId = (uiModel: ModelType): string => {
  switch (uiModel) {
    case ModelType.BANANA_PRO:
      return 'gemini-3-pro-image-preview'; // High quality
    case ModelType.NANO_BANANA_FLASH:
      return 'gemini-2.5-flash-image'; // Fast/Lite equivalent
    case ModelType.NANO:
    default:
      return 'gemini-2.5-flash-image'; // Default standard
  }
};

export const improvePrompt = async (originalPrompt: string, apiKey: string): Promise<string> => {
  if (!apiKey) throw new Error("Chave de API ausente. Por favor, insira sua chave na barra lateral.");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Use a text model for reasoning
      contents: `You are an expert prompt engineer for AI image generation models (specifically Gemini and Imagen). 
      Your task is to take the user's raw input and rewrite it into a detailed, high-quality prompt that maximizes visual impact.
      
      Focus on:
      1. Lighting (e.g., cinematic, natural, studio, golden hour).
      2. Texture and Material (e.g., highly detailed, realistic, 8k).
      3. Composition and Camera (e.g., wide angle, macro, depth of field).
      4. Artistic Style (maintain the user's intent, whether photorealistic or stylized).
      
      Input: "${originalPrompt}"
      
      Output ONLY the improved prompt text, in English (as it yields better results), without quotes or explanations.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 200,
      }
    });

    return response.text?.trim() || originalPrompt;
  } catch (error) {
    console.error("Prompt improvement failed:", error);
    return originalPrompt;
  }
};

export const generateImage = async (config: GenerationConfig, apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("Chave de API ausente. Por favor, insira sua chave na barra lateral.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelId = getGeminiModelId(config.model);
  
  try {
    // Construct parts
    const parts: any[] = [];

    // Add input image if present
    if (config.image) {
      // Remove data URI prefix if present (e.g. "data:image/png;base64,")
      const base64Data = config.image.split(',')[1] || config.image;
      
      // Determine mime type from data URI or default to png
      let mimeType = 'image/png';
      if (config.image.includes('data:')) {
        const match = config.image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
        if (match && match[1]) {
          mimeType = match[1];
        }
      }

      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
    }

    // Add text prompt
    parts.push({ text: config.prompt });

    // Prepare config
    // Note: aspect ratio and resolution are primarily supported well in the pro-image models
    // For flash-image, aspect ratio works.
    
    // GoogleGenAI SDK structure for image generation
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: parts
      },
      config: {
        imageConfig: {
            aspectRatio: config.aspectRatio,
            // Only set imageSize (resolution) if using the Pro model, otherwise it might throw or be ignored
            ...(modelId === 'gemini-3-pro-image-preview' ? { imageSize: config.resolution } : {})
        }
      }
    });

    // Extract image
    // The SDK returns candidates. For images, we look for inlineData in the parts.
    const partsResponse = response.candidates?.[0]?.content?.parts;
    
    if (!partsResponse) {
      throw new Error("No content generated.");
    }

    // Find the part that has inlineData (the image)
    const imagePart = partsResponse.find(p => p.inlineData);

    if (imagePart && imagePart.inlineData && imagePart.inlineData.data) {
      return `data:image/png;base64,${imagePart.inlineData.data}`;
    }

    throw new Error("Image data not found in response.");

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};