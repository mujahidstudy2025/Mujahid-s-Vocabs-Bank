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

    return {
      word: entry.word,
      partOfSpeech,
      definition,
      synonyms: Array.from(synonyms).slice(0, 5),
      antonyms: Array.from(antonyms).slice(0, 5),
      examples: Array.from(examples).slice(0, 3),
      // Bengali definition and derivatives are not available in this free API
      bengaliDefinition: undefined,
      derivatives: undefined
    };

  } catch (error: any) {
    console.error("Dictionary API Error:", error);
    throw error;
  }
};
