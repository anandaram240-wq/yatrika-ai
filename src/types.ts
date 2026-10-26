export type RegionId = 
  | 'uttara-karnataka'
  | 'karavali'
  | 'mysuru-mandya'
  | 'kalyana-karnataka'
  | 'malenadu'
  | 'bengaluru-urban';

export interface Region {
  id: RegionId;
  name: string;
  kannadaName: string;
  tagline: string;
  description: string;
  districts: string[];
  themeColor: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    border: string;
  };
  characteristics: string[];
  signaturePhrases: {
    kannada: string;
    transliteration: string;
    meaning: string;
  }[];
  culturalHighlights: string;
  dialectFeatures: {
    cadence: string;
    pronouns: string;
    notableSuffixes: string;
  };
}

export type PhraseCategory = 'greetings' | 'daily-life' | 'food-dining' | 'travel-auto' | 'humor-slang';

export interface DialectTranslation {
  kannada: string;
  transliteration: string;
  nuance: string;
  audioPitch?: number;
  audioRate?: number;
}

export interface DialectPhrase {
  id: string;
  english: string;
  context: string;
  category: PhraseCategory;
  standardKannada: {
    kannada: string;
    transliteration: string;
  };
  variations: Record<RegionId, DialectTranslation>;
}

export interface GlossaryWord {
  id: string;
  wordKannada: string;
  wordEnglish: string;
  regionId: RegionId;
  meaning: string;
  usageKannada: string;
  usageTransliteration: string;
  usageEnglish: string;
  culturalOrigin: string;
  tags: string[];
  isCommunityContributed?: boolean;
  upvotes?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  phraseKannada: string;
  transliteration: string;
  englishMeaning: string;
  correctRegionId: RegionId;
  options: RegionId[];
  explanation: string;
  culturalTrivia: string;
}

export interface CommunityContribution {
  id: string;
  wordKannada: string;
  wordTransliteration: string;
  meaning: string;
  regionId: RegionId;
  district: string;
  usageExample: string;
  contributorName: string;
  timestamp: string;
  upvotes: number;
}
