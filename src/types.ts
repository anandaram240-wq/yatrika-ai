export type RegionId = 
  | 'uttara-karnataka'
  | 'karavali'
  | 'mysuru-mandya'
  | 'kalyana-karnataka'
  | 'malenadu'
  | 'bengaluru-urban';

export type VerificationStatus = 
  | 'source-attested'          // Documented in published dictionary, academic study, or institutional corpus
  | 'native-speaker-reviewed'  // Reviewed and confirmed by authenticated regional speaker
  | 'contributor-submitted'    // Contributed by community member, pending formal peer verification
  | 'provisional'              // Colloquial/modern vernacular documented without classical academic citation
  | 'unverified';              // Requires further field verification

export interface LinguisticSource {
  title: string;
  authorOrInstitution: string;
  year?: string;
  sourceLocation?: string; // Specific volume, page, or dataset record
  url?: string;
  license?: string;
}

export interface Region {
  id: RegionId;
  name: string;
  kannadaName: string;
  taxonomyNote: string; // Explicit statement that this is an educational exploration grouping
  description: string;
  districtsAssociated: string[]; // Clarified as associated districts, not rigid dialect borders
  isoglossNotes: string; // Linguistic continuum, transition zones, and sub-dialects
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
    source: LinguisticSource;
    status: VerificationStatus;
  }[];
  culturalHighlights: string;
  dialectFeatures: {
    cadenceDescription: string; // Explicitly describes human vocal traits, not synthetic TTS
    pronouns: string;
    notableSuffixes: string;
  };
}

export type PhraseCategory = 'greetings' | 'daily-life' | 'food-dining' | 'travel-auto' | 'humor-slang';

export interface DialectTranslation {
  kannada: string;
  transliteration: string;
  nuance: string;
  status: VerificationStatus;
  source: LinguisticSource;
  locality?: string; // Specific town/sub-region (e.g. Kundapura, Dharwad, Mandya)
  contextOfUse: string;
  syntheticAudioPitch?: number; // Labeled clearly as synthetic browser modulation
  syntheticAudioRate?: number;
}

export interface DialectPhrase {
  id: string;
  english: string;
  context: string;
  category: PhraseCategory;
  standardKannada: {
    kannada: string;
    transliteration: string;
    grammaticalNote?: string;
  };
  variations: Partial<Record<RegionId, DialectTranslation>>;
}

export interface GlossaryWord {
  id: string;
  wordKannada: string;
  wordEnglish: string;
  regionId: RegionId;
  locality?: string;
  meaning: string;
  usageKannada: string;
  usageTransliteration: string;
  usageEnglish: string;
  culturalOrigin: string;
  tags: string[];
  status: VerificationStatus;
  source: LinguisticSource;
  isCommunityContributed?: boolean;
  attributionPreference?: string;
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
  source: LinguisticSource;
  status: VerificationStatus;
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
  attributionPreference: 'real-name' | 'pseudonym' | 'anonymous';
  licenseConsent: boolean; // Explicit CC-BY 4.0 / Open data consent
  timestamp: string;
  status: VerificationStatus;
  localNotes?: string;
}
