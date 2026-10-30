/**
 * src/features/voice-agent/domain/types.ts
 * Type-Safe Domain Contracts for YatriKa Kannada Multimodal Agent
 */

export type TravelIntent =
  | 'destination_search'
  | 'route_search'
  | 'budget_query'
  | 'weather_season_query'
  | 'food_khanavali_query'
  | 'transport_transit_query'
  | 'corridor_advice_query'
  | 'itinerary_modify'
  | 'emergency_query'
  | 'unknown';

export type RegionalDialectZone =
  | 'mysuru_mandya'
  | 'malnad_coorg'
  | 'karavali_coastal'
  | 'kalyana_karnataka'
  | 'kittur_belagavi'
  | 'standard_bengaluru';

export interface ExtractedTravelEntities {
  origin?: string;
  destination?: string;
  budgetInr?: number;
  durationDays?: number;
  travelSeason?: 'winter_oct_feb' | 'monsoon_jun_sep' | 'summer_mar_may';
  preferences?: string[];
  excludedConditions?: string[];
  passengerCount?: number;
  isFemalePassenger?: boolean; // For Shakti Free Travel scheme
}

export interface VoiceIntentResult {
  rawTranscript: string;
  normalizedText: string;
  detectedDialect: RegionalDialectZone;
  language: 'kn' | 'en' | 'mixed';
  intent: TravelIntent;
  confidence: number;
  entities: ExtractedTravelEntities;
  requiresClarification: boolean;
  clarificationPromptKannada?: string;
  suggestedAction?: 'LOAD_CIRCUIT' | 'FILTER_STOPS' | 'CHANGE_ORIGIN' | 'OPTIMIZE_ROUTE' | 'SHOW_BUDGET';
  targetCircuitId?: string;
}

export interface VoiceAgentResponse {
  spokenKannada: string;
  englishExplanation: string;
  confidence: number;
  answerSource: 'deterministic' | 'verified_registry' | 'historical_seasonal';
  appliedActions: string[];
}
