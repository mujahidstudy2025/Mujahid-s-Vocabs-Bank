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
    // Use gemini-3-flash-preview with Google Search for accurate, up-to-date linguistic data
    const model = "gemini-3-flash-preview"; 
    
    console.log(`Fetching enrichment data for "${word}" using model ${model}...`);

    const response = await ai.models.generateContent({
      model,
      contents: `Search for the word "${word}" to find its meaning in Bengali and its complete word family (derivative forms).
      
      Provide a JSON object with this EXACT structure:
      {
        "bengaliDefinition": "The meaning of the word in Bengali (Bangla) script",
        "synonyms": ["synonym1", "synonym2", "synonym3", "synonym4", "synonym5"],
        "antonyms": ["antonym1", "antonym2", "antonym3", "antonym4", "antonym5"],
        "derivatives": {
          "base": "${word}",
          "noun": "noun form (e.g. friendship, friendliness) or N/A",
          "verb": "verb form (e.g. befriend) or N/A",
          "adjective": "adjective form (e.g. friendly) or N/A",
          "adverb": "adverb form (e.g. friendly) or N/A"
        }
      }
      
      IMPORTANT:
      - For 'derivatives', look for the most common morphological variations.
      - Example for 'friend': Noun: friend/friendship, Verb: befriend, Adj: friendly, Adv: friendly.
      - Return ONLY the JSON object. No markdown, no explanations.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });

    let text = response.text;
    console.log("Raw Gemini response:", text);

    if (!text) {
      console.warn("Gemini returned empty text.");
      return {};
    }
    
    // Robust JSON extraction: find the first '{' and last '}'
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    } else {
      // Fallback cleanup if braces aren't clear (unlikely with responseMimeType)
      text = text.replace(/```json\n?|```/g, '').trim();
    }
    
    // Attempt to parse JSON
    try {
      const data = JSON.parse(text);
      return data as Partial<WordData>;
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", parseError);
      console.log("Response text was:", text);
      return {};
    }

  } catch (error) {
    console.error("Gemini Enrichment Error:", error);
    return {}; // Gracefully return empty object on error
  }
};

