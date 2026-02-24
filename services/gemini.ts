import { GoogleGenAI, Type } from "@google/genai";
import { WordData } from "../types";

// We initialize the client lazily inside functions to prevent the application from crashing
// immediately on load if the API key is missing or invalid.
const getClient = () => {
  // process.env.GEMINI_API_KEY is replaced by Vite at build time
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const fetchEnrichmentData = async (word: string): Promise<Partial<WordData>> => {
  try {
    const ai = getClient();
    const model = "gemini-3-flash-preview";
    
    const response = await ai.models.generateContent({
      model,
      contents: `For the word "${word}", provide the meaning in Bengali (Bangla) and its derivative forms (base, noun, verb, adjective, adverb). If a form doesn't exist, use "N/A".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bengaliDefinition: { type: Type.STRING, description: "The meaning of the word in Bengali language script" },
            derivatives: {
              type: Type.OBJECT,
              properties: {
                base: { type: Type.STRING },
                noun: { type: Type.STRING },
                verb: { type: Type.STRING },
                adjective: { type: Type.STRING },
                adverb: { type: Type.STRING }
              },
              required: ["base", "noun", "verb", "adjective", "adverb"]
            }
          },
          required: ["bengaliDefinition", "derivatives"],
        }
      }
    });

    let text = response.text;
    if (!text) {
      return {};
    }
    
    // Clean up potential Markdown code blocks (e.g., ```json ... ```)
    text = text.replace(/```json\n?|```/g, '').trim();
    
    return JSON.parse(text) as Partial<WordData>;
  } catch (error) {
    console.error("Gemini Enrichment Error:", error);
    return {}; // Gracefully return empty object on error
  }
};

