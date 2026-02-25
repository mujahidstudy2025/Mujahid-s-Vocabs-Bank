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
    // Use gemini-2.5-flash for speed and reliability.
    // It is sufficient for this JSON extraction task.
    const model = "gemini-2.5-flash"; 
    
    console.log(`Fetching enrichment data for "${word}" using model ${model}...`);

    const response = await ai.models.generateContent({
      model,
      contents: `For the word "${word}", provide a JSON object with the following structure:
      {
        "bengaliDefinition": "The meaning of the word in Bengali (Bangla) script",
        "synonyms": ["synonym1", "synonym2", "synonym3", "synonym4", "synonym5"],
        "antonyms": ["antonym1", "antonym2", "antonym3", "antonym4", "antonym5"],
        "derivatives": {
          "base": "base form",
          "noun": "noun form or N/A",
          "verb": "verb form or N/A",
          "adjective": "adjective form or N/A",
          "adverb": "adverb form or N/A"
        }
      }
      Return ONLY the JSON object. Do not include any markdown formatting or explanations. Provide up to 5 synonyms and 5 antonyms. If none exist, return empty arrays.`,
      config: {
        // We remove strict schema validation to be more robust against model variations
        // responseMimeType: "application/json", 
      }
    });

    let text = response.text;
    console.log("Raw Gemini response:", text);

    if (!text) {
      console.warn("Gemini returned empty text.");
      return {};
    }
    
    // Clean up potential Markdown code blocks (e.g., ```json ... ```)
    text = text.replace(/```json\n?|```/g, '').trim();
    
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

