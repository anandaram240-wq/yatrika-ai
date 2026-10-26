export type RegionId = 
  | 'uttara-karnataka'
  | 'karavali'
  | 'mysuru-mandya'
  | 'kalyana-karnataka'
  | 'malenadu'
  | 'bengaluru-urban';

export type RegionMatrixSlotId = 
  | 'old_mysuru_southern'
  | 'kittur_karnataka'
  | 'kalyana_karnataka'
  | 'karavali_coastal'
  | 'malnad'
  | 'central_border_cluster';

export type EvidenceLevel = 'E1' | 'E2' | 'E3' | 'E4' | 'E5';

export type EvidenceStatus = 
  | 'source_attested'          // E1: Verified against physical page/volume or dictionary headword
  | 'speaker_reviewed'         // E3: Reviewed with recorded consent by native speaker from target locality
  | 'contributor_pending'       // E3/E4: Submitted by community member, pending formal peer verification
  | 'provisional'              // E4: Pattern-supported by scholarly dialectology (E2), exact locator pending human lookup
  | 'unverified';              // E5: Legacy backlog or unreviewed draft; quarantined from default views

export type VerificationStatus = EvidenceStatus | 'source-attested' | 'native-speaker-reviewed' | 'contributor-submitted';

export type LicenseStatus = 
  | 'approved_for_planned_use'
  | 'restricted_or_permission_required'
  | 'license_unclear_do_not_redistribute';

export type VariantSlotType = 
  | 'distinct_regional_variant'
  | 'documented_multi_region'
  | 'shared_with_standard'
  | 'no_verified_distinct_variant'
  | 'provisional_candidate'
  | 'unverified_or_excluded';

export interface RegionSlotState {
  status: VariantSlotType;
  entry_id: string | null;
  note: string;
}

export interface ConceptCoverage {
  concept_id: string;
  concept_label: string;
  documented_entry_ids: string[];
  region_matrix_states: Record<RegionMatrixSlotId, RegionSlotState>;
}

export interface CitationRecord {
  source_id: string | null;
  source_title: string | null;
  author_or_publisher: string | null;
  publication_year: number | null;
  locator: string | null;
  url: string | null;
}

export interface SpeakerReviewRecord {
  reviewer_role_or_alias: string;
  reviewer_locality: string;
  reviewer_sub_variety: string;
  review_date: string;
  consent_recorded: boolean;
  review_notes: string;
}

export interface AtlasEntry {
  id: string;
  concept_id: string;
  concept: string;
  meaning_en: string;
  language_code: 'kn';
  kannada_script: string;
  transliteration: string | null;
  learner_phonetic_guide: string | null;
  context: string | null;
  register: string | null;
  region_or_locality: string | null;
  sub_variety: string | null;
  variant_type: string | null;
  variation_type: string | null;
  morphological_note: string | null;
  pattern_evidence_level: EvidenceLevel;
  evidence_level: EvidenceLevel;
  evidence_status: EvidenceStatus;
  citation: CitationRecord;
  review_record: SpeakerReviewRecord | null;
  license_status: LicenseStatus;
  limitations: string[];
}

export interface AtlasDataset {
  schema_version: string;
  dataset_id: string;
  generated_at?: string;
  license_policy: string;
  concept_coverage_summary: ConceptCoverage[];
  entries: AtlasEntry[];
}

export interface LinguisticSource {
  title: string;
  authorOrInstitution: string;
  year?: string;
  sourceLocation?: string;
  url?: string;
  license?: string;
}

export interface Region {
  id: RegionId;
  slotKey: RegionMatrixSlotId;
  name: string;
  kannadaName: string;
  taxonomyNote: string;
  description: string;
  districtsAssociated: string[];
  isoglossNotes: string;
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
    cadenceDescription: string;
    pronouns: string;
    notableSuffixes: string;
  };
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
  evidence_status?: EvidenceStatus;
  evidence_level?: EvidenceLevel;
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
  evidence_status?: EvidenceStatus;
  evidence_level?: EvidenceLevel;
  morphological_note?: string;
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
  licenseConsent: boolean;
  license_status?: LicenseStatus;
  timestamp: string;
  status: VerificationStatus;
  evidence_status?: EvidenceStatus;
  evidence_level?: EvidenceLevel;
  localNotes?: string;
}
