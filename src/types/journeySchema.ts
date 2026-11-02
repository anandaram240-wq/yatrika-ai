// src/types/journeySchema.ts

export type BudgetTierId = 'economy' | 'standard' | 'comfort' | 'premium' | 'business_luxury' | 'custom';

export type RailClassCode =
  | 'UR'   // Unreserved
  | '2S'   // Second Sitting
  | 'SL'   // Sleeper
  | '3A'   // AC 3 Tier
  | '2A'   // AC 2 Tier
  | '1A'   // AC First Class
  | 'CC'   // Chair Car
  | 'EC';  // Executive Chair Car

export type BusServiceClass =
  | 'ORDINARY'
  | 'EXPRESS'
  | 'NON_AC_SLEEPER'
  | 'AC_SLEEPER'
  | 'AC_SEATER'
  | 'PREMIUM_VOLVO'
  | 'ELECTRIC_EV';

export type PrivateTransportMode =
  | 'PERSONAL_CAR'
  | 'MOTORCYCLE'
  | 'RENTAL_CAR'
  | 'CHAUFFEUR_VEHICLE'
  | 'TAXI';

export type AccommodationFilterCategory =
  | 'GOVERNMENT_OPERATED_ONLY'
  | 'GOVERNMENT_CLASSIFIED_HOTELS'
  | 'REGISTERED_KARNATAKA_HOMESTAYS'
  | 'VALID_BUDGET_ACCOMMODATION'
  | 'NO_ACCOMMODATION_REQUIRED';

export type PriceVerificationStatus =
  | 'CONFIRMED'
  | 'PUBLISHED_RATE'
  | 'PROVIDER_QUOTE'
  | 'ESTIMATED'
  | 'UNAVAILABLE'
  | 'NOT_INCLUDED';

export type TravellerInterest =
  | 'Heritage'
  | 'Mountains'
  | 'Waterfalls'
  | 'Wildlife'
  | 'Beaches'
  | 'Food'
  | 'Culture'
  | 'Temples'
  | 'Architecture'
  | 'Adventure'
  | 'Family experiences'
  | 'Relaxation'
  | 'Accessible destinations';

export interface TravellerGroupConfig {
  adults: number;
  children: number;
  seniors: number;
  roomsRequired: number;
  nights: number;
  accessibilityNeeds: {
    stepFreeAccess: boolean;
    minimalWalking: boolean;
    wheelchairFriendly: boolean;
  };
}

export interface BudgetAndClassConfig {
  budgetMode: 'PER_PERSON' | 'TOTAL_GROUP';
  budgetTier: BudgetTierId;
  customBudgetInr: number; // User's explicit target in INR
  preferredModes: ('RAIL' | 'BUS' | 'PRIVATE' | 'FLIGHT')[];
  preferredRailClasses: RailClassCode[];
  preferredBusClasses: BusServiceClass[];
  preferredPrivateMode?: PrivateTransportMode;
  accommodationPreference: AccommodationFilterCategory;
  isBusinessLuxuryExperience: boolean; // Experience preference, never fabricates a transport class
}

export interface BudgetLineItem {
  id: string;
  category:
    | 'OUTBOUND_TRANSPORT'
    | 'RETURN_TRANSPORT'
    | 'LOCAL_TRANSPORT'
    | 'ACCOMMODATION'
    | 'ENTRY_FEES'
    | 'FOOD'
    | 'GUIDE_CHARGES'
    | 'PARKING_AND_TOLLS'
    | 'OTHER_DECLARED';
  label: string;
  amountPerPersonInr: number | null;
  amountGroupTotalInr: number | null;
  status: PriceVerificationStatus;
  sourceLabel: string;
  sourceUrl?: string;
  notes: string;
}

export interface HonestBudgetSummary {
  lineItems: BudgetLineItem[];
  confirmedAndPublishedGroupInr: number;
  estimatedGroupInr: number;
  confirmedAndPublishedPerPersonInr: number;
  estimatedPerPersonInr: number;
  hasUnavailableCoreItems: boolean;
  unavailableItemLabels: string[];
  budgetTargetGroupInr: number;
  budgetTargetPerPersonInr: number;
  budgetComparisonStatus: 'WITHIN_KNOWN_COSTS' | 'EXCEEDS_BUDGET' | 'INCOMPLETE_DUE_TO_UNAVAILABLE_RATES';
}
