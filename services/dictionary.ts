import { WordData } from "../types";

interface DictionaryAPIEntry {
  word: string;
  phonetic?: string;
  phonetics: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms: string[];
      antonyms: string[];
    }>;
    synonyms: string[];
    antonyms: string[];
  }>;
  license: {
    name: string;
    url: string;
  };
  sourceUrls: string[];
}

export const fetchWordDetails = async (word: string): Promise<WordData> => {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Word "${word}" not found.`);
      }
      throw new Error("Failed to fetch word data.");
    }

    const data: DictionaryAPIEntry[] = await response.json();
    const entry = data[0];

    // Aggregate data
    const synonyms = new Set<string>();
    const antonyms = new Set<string>();
    const examples = new Set<string>();
    let definition = "";
    let partOfSpeech = "";

    entry.meanings.forEach((meaning, index) => {
      if (index === 0) {
        partOfSpeech = meaning.partOfSpeech;
        definition = meaning.definitions[0]?.definition || "";
      }
      
      meaning.synonyms.forEach(s => synonyms.add(s));
      meaning.antonyms.forEach(a => antonyms.add(a));
      
      meaning.definitions.forEach(def => {
        def.synonyms.forEach(s => synonyms.add(s));
        def.antonyms.forEach(a => antonyms.add(a));
        if (def.example) examples.add(def.example);
      });
    });

    // Bengali definition and derivatives are not available in this free API
    // We'll try to fetch them from the user-provided APIs as initial fallbacks
    let bengaliDefinition = undefined;
    let derivatives = undefined;

    try {
      // 1. Try MyMemory for Bengali
      const bnResp = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|bn`);
      if (bnResp.ok) {
        const bnData = await bnResp.json();
        bengaliDefinition = bnData.responseData.translatedText;
      }

      // 2. Try Datamuse for some related words as derivatives fallback
      const derivResp = await fetch(`https://api.datamuse.com/words?rel_jja=${encodeURIComponent(word)}`);
      if (derivResp.ok) {
        const derivData = await derivResp.json();
        if (derivData.length > 0) {
          derivatives = {
            base: word,
            noun: "N/A",
            verb: "N/A",
            adjective: derivData[0]?.word || "N/A",
            adverb: "N/A"
          };
        }
      }
    } catch (e) {
      console.warn("Secondary API fetch failed, will rely on Gemini:", e);
    }

    return {
      word: entry.word,
      partOfSpeech,
      definition,
      synonyms: Array.from(synonyms).slice(0, 5),
      antonyms: Array.from(antonyms).slice(0, 5),
      examples: Array.from(examples).slice(0, 3),
      bengaliDefinition,
      derivatives
    };

  } catch (error: any) {
    console.error("Dictionary API Error:", error);
    throw error;
  }
};
