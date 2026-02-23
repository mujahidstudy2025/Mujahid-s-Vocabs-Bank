export interface WordData {
  word: string;
  partOfSpeech: string;
  definition: string;
  bengaliDefinition: string;
  synonyms: string[];
  antonyms: string[];
  examples: string[];
}

export interface SearchState {
  term: string;
  data: WordData | null;
  imageUrl: string | null;
  loading: boolean;
  imageLoading: boolean;
  error: string | null;
}