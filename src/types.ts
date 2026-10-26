export type RegionId = 
  | 'uttara-karnataka'
  | 'karavali'
  | 'mysuru-mandya'
  | 'kalyana-karnataka'
  | 'malenadu'
  | 'bengaluru-urban';

export type KarnatakaRegionId = RegionId;

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
  | 'unverified_or_excluded'
  | 'directly_attested_regional_form'
  | 'pattern_supported_regional_form'
  | 'shared_with_standard_or_multi_region'
  | 'candidate_awaiting_documentary_verification'
  | 'no_distinct_regional_equivalent_established'
  | 'community_reported_unverified'
  | 'language_contact_or_borrowed_form';

export type ComparisonCellState =
  | 'directly_attested_regional_form'
  | 'pattern_supported_regional_form'
  | 'shared_with_standard_or_multi_region'
  | 'candidate_awaiting_documentary_verification'
  | 'no_distinct_regional_equivalent_established'
  | 'community_reported_unverified'
  | 'language_contact_or_borrowed_form';

export type LexicalSourceRightsType =
  | 'public_domain_source'
  | 'odbl_1_0_database_source'
  | 'copyrighted_reference_factual_citation_only'
  | 'consented_contributor_observation';

export interface RightsAndProvenance {
  explanatory_text_origin: string;
  explanatory_text_license: string;
  lexical_source_id: string;
  lexical_source_rights_type: LexicalSourceRightsType;
  verbatim_third_party_text_copied: boolean;
  redistribution_tier: string;
  attribution_notice: string;
}

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
  locator_human_verified?: boolean;
}

export interface SpeakerReviewRecord {
  reviewer_role_or_alias: string;
  reviewer_locality: string;
  reviewer_sub_variety: string;
  review_date: string;
  consent_recorded: boolean;
  review_notes: string;
}

export interface MorphemeSlot {
  slot_id: string;
  slot_label: string;
  surface_kn: string;
  surface_iso: string;
  underlying_form: string;
  gloss_en: string;
  is_invariant_root: boolean;
  shift_category: string;
  shift_explanation: string;
}

export interface EvidenceDimensions {
  lexical_root: EvidenceLevel | null;
  meaning_equivalence: EvidenceLevel | null;
  grammatical_pattern: EvidenceLevel | null;
  regional_distribution: EvidenceLevel | null;
  exact_sentence_locator: EvidenceLevel | null;
  native_speaker_review: EvidenceLevel | null;
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
  morpheme_decomposition?: MorphemeSlot[];
  evidence_dimensions?: EvidenceDimensions;
  rights_and_provenance?: RightsAndProvenance;
  comparison_cell_state?: ComparisonCellState;
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

// ==========================================
// YATRIKA AI (PROBLEM STATEMENT 06) TYPES
// ==========================================

export type TripVibe = 
  | 'heritage'      // UNESCO, ancient temples, royal palaces
  | 'nature'        // Waterfalls, rainforests, hills, wildlife
  | 'coastal'       // Beaches, coastal temples, sea sports
  | 'coffee-hills'  // Coffee estates, hill stations, mist
  | 'spiritual'     // Sacred shrines, temple circuits
  | 'balanced';     // Mix of everything

export type BudgetTier = 'backpacker' | 'comfort' | 'luxury';

export type TravelStyle = 'solo' | 'couple' | 'family' | 'friends';

export type DestinationCategory = 
  | 'heritage'
  | 'waterfall'
  | 'beach'
  | 'hill-station'
  | 'temple'
  | 'wildlife'
  | 'viewpoint';

export interface TravelPhrase {
  id: string;
  situation: string;
  kannada: string;
  transliteration: string;
  englishMeaning: string;
  regionalNote?: string;
  category: 'greeting' | 'transit' | 'food' | 'temple' | 'shopping' | 'emergency';
  audioAvailable: boolean;
}

export interface Destination {
  id: string;
  name: string;
  nameKannada: string;
  region: KarnatakaRegionId;
  district: string;
  category: DestinationCategory;
  lat: number;
  lon: number;
  timings: string;
  entryFee: {
    indianAdult: number;
    indianChild?: number;
    foreignAdult?: number;
    parking?: number;
    notes?: string;
  };
  durationHours: number;
  bestSeason: string;
  description: string;
  highlights: string[];
  tips: string[];
  mustEatDishes: string[];
  restaurantSuggestion: string;
  relevantPhrases: TravelPhrase[];
  imageEmoji: string;
  accentColor: string;
  distanceFromBengaluruKm: number;
  drivingTimeFromBengaluruHours: number;
}

export interface TripInputs {
  startingCity: 'bengaluru' | 'mysuru' | 'mangaluru' | 'hubballi';
  vibe: TripVibe;
  durationDays: 1 | 2 | 3 | 5 | 7;
  budgetTier: BudgetTier;
  travelStyle: TravelStyle;
}

export interface ItinerarySlot {
  timeSlot: 'morning' | 'afternoon' | 'evening';
  timeLabel: string;
  destination: Destination;
  activityTitle: string;
  activityDescription: string;
  travelTimeFromPrev: string;
  travelDistanceKm: number;
  estimatedExpense: number;
  insiderTip: string;
  phraseToUse: TravelPhrase;
}

export interface ItineraryDay {
  dayNumber: number;
  dayTitle: string;
  routeOverview: string;
  slots: ItinerarySlot[];
  dayTravelDistanceKm: number;
  dayEstimatedCost: {
    stay: number;
    food: number;
    transport: number;
    tickets: number;
    total: number;
  };
  lunchRecommendation: {
    dishName: string;
    placeName: string;
    approxPrice: number;
  };
}

export interface FoodSpecialty {
  id: string;
  name: string;
  nameKannada: string;
  region: KarnatakaRegionId;
  regionName: string;
  description: string;
  famousPlace: string;
  avgPrice: string;
  tags: string[];
  emoji: string;
}

export interface GeneratedItinerary {
  tripId: string;
  title: string;
  inputs: TripInputs;
  summary: {
    totalDays: number;
    totalDistanceKm: number;
    totalBudgetEstimated: number;
    budgetPerPerson: number;
    regionsCovered: KarnatakaRegionId[];
    destinationsCount: number;
  };
  days: ItineraryDay[];
  smartAlerts: string[];
  kannadaCompanionPhrases: TravelPhrase[];
  suggestedFoodTrail: FoodSpecialty[];
  createdTimestamp: string;
}
