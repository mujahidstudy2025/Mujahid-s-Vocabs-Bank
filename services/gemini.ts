import { GoogleGenAI, Type } from "@google/genai";
import { WordData } from "../types";

// We initialize the client lazily inside functions to prevent the application from crashing
// immediately on load if the API key is missing or invalid.
const getClient = () => {
  // process.env.GEMINI_API_KEY is replaced by Vite at build time
  // Using the user-provided key as a fallback if the environment variable is not set
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyAmdrkHDts6JCluVD7Q-OnDaEdl7q-ouG0";
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
      contents: `You are an expert lexicographer and dictionary editor. I need accurate, dictionary-grade data for the word "${word}".
      
      Provide a JSON object with this EXACT structure:
      {
        "bengaliDefinition": "The precise meaning of the word in Bengali (Bangla) script",
        "synonyms": ["synonym1", "synonym2", "synonym3", "synonym4", "synonym5"],
        "antonyms": ["antonym1", "antonym2", "antonym3", "antonym4", "antonym5"]
      }
      
      IMPORTANT:
      - For 'synonyms' and 'antonyms', ONLY provide words that are strictly synonymous or antonymous in standard English dictionaries. Do not hallucinate or provide loosely related words. If there are no direct antonyms, return an empty array [].
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

