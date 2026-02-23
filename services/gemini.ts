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
    3 distinct sentence examples showing how the word is used in context,
    and the derivative forms of the word (base, noun, verb, adjective, adverb). If a form doesn't exist, use "N/A".`,
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
          },
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
        required: ["word", "partOfSpeech", "definition", "bengaliDefinition", "synonyms", "examples", "derivatives"],
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No data received from Gemini.");
  }
  
  return JSON.parse(text) as WordData;
};

