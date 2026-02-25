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
    const partsOfSpeechFound = new Set<string>();
    let definition = "";
    let partOfSpeech = "";

    entry.meanings.forEach((meaning, index) => {
      partsOfSpeechFound.add(meaning.partOfSpeech.toLowerCase());
      
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

    // Initial derivatives based on what the word ITSELF is
    // e.g. if word is "run" and it has "noun" and "verb" meanings, we fill those.
    const derivatives: any = {
      base: word,
      noun: partsOfSpeechFound.has('noun') ? word : "N/A",
      verb: partsOfSpeechFound.has('verb') ? word : "N/A",
      adjective: partsOfSpeechFound.has('adjective') ? word : "N/A",
      adverb: partsOfSpeechFound.has('adverb') ? word : "N/A",
    };

    // Bengali definition and derivatives are not available in this free API
    // We'll try to fetch them from the user-provided APIs as initial fallbacks
    let bengaliDefinition = undefined;

    try {
      // 1. Try MyMemory for Bengali
      const bnResp = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|bn`);
      if (bnResp.ok) {
        const bnData = await bnResp.json();
        bengaliDefinition = bnData.responseData.translatedText;
      }

      // 2. Try Datamuse for some related words as derivatives fallback
      // We can try to find related words if our self-check failed
      // But Datamuse is weak for this specific "form" task. 
      // We'll rely on Gemini for the "other" forms.
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
