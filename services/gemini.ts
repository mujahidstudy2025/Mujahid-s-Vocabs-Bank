import { GoogleGenAI, Type } from "@google/genai";
import { WordData } from "../types";

// We initialize the client lazily inside functions to prevent the application from crashing
// immediately on load if the API key is missing or invalid.
const getClient = () => {
  // process.env.API_KEY is replaced by Vite at build time
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const fetchWordDetails = async (word: string): Promise<WordData> => {
  const ai = getClient();
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: `Analyze the word "${word}" thoroughly. 
    Provide the part of speech, a clear English definition, the meaning in Bengali (Bangla), 
    a list of synonyms (max 5), a list of antonyms (max 5, if applicable), 
    and 3 distinct sentence examples showing how the word is used in context.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          partOfSpeech: { type: Type.STRING },
          definition: { type: Type.STRING },
          bengaliDefinition: { type: Type.STRING, description: "The meaning of the word in Bengali language script" },
          synonyms: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          antonyms: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          examples: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          }
        },
        required: ["word", "partOfSpeech", "definition", "bengaliDefinition", "synonyms", "examples"],
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No data received from Gemini.");
  }
  
  return JSON.parse(text) as WordData;
};

export const generateWordImage = async (word: string, definition: string): Promise<string | null> => {
  try {
    const ai = getClient();
    const model = "gemini-2.5-flash-image";
    const prompt = `A creative, minimalist, and educational vector-style illustration representing the concept of the word: "${word}". 
    Context: ${definition}. 
    Style: Modern, flat design, colorful but professional, suitable for a dictionary app. No text inside the image.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        // No responseMimeType for image generation models usually, but we check parts
      }
    });

    // Iterate through parts to find the image
    const candidates = response.candidates;
    if (candidates && candidates.length > 0 && candidates[0].content && candidates[0].content.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to generate image:", error);
    return null;
  }
};