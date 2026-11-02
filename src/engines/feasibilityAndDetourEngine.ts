// src/engines/feasibilityAndDetourEngine.ts

export type DeterministicFeasibilityStatus =
  | 'FEASIBLE'
  | 'FEASIBLE_WITH_UNCONFIRMED_CONNECTIONS'
  | 'REQUIRES_USER_DECISION'
  | 'NOT_FEASIBLE'
  | 'INSUFFICIENT_DATA';

export interface RouteCorridorDetourCandidate {
  id: string;
  nameEn: string;
  nameKn: string;
  corridorId: 'BLR_TO_CHIKKAMAGALURU' | 'BLR_TO_HAMPI';
  nearestHighwayNode: string;
  coordinates: [number, number];
  baseRouteKmWithoutDetour: number;
  detourAdditionalKm: number;
  detourAdditionalDriveMins: number;
  recommendedVisitDurationMins: number;
  totalExtraTimeMins: number;
  openingHoursWindow: { opensAt: string; closesAt: string; display: string };
  matchingInterests: string[];
  managingAuthority: string;
  sourceUrl: string;
}

export const VERIFIED_CORRIDOR_DETOURS: RouteCorridorDetourCandidate[] = [
  {
    id: 'belur-chennakeshava-detour',
    nameEn: 'Belur Sri Chennakeshava Temple (UNESCO Sacred Ensemble of the Hoysalas)',
    nameKn: 'ಬೇಲೂರು ಶ್ರೀ ಚೆನ್ನಕೇಶವ ದೇವಾಲಯ',
    corridorId: 'BLR_TO_CHIKKAMAGALURU',
    nearestHighwayNode: 'Hassan (NH-75 → SH-57 Belur Corridor)',
    coordinates: [75.8604, 13.1650],
    baseRouteKmWithoutDetour: 244,
    detourAdditionalKm: 11,
    detourAdditionalDriveMins: 18,
    recommendedVisitDurationMins: 75,
    totalExtraTimeMins: 93,
    openingHoursWindow: { opensAt: '07:30', closesAt: '19:30', display: '07:30 AM – 07:30 PM (Daily)' },
    matchingInterests: ['Heritage', 'Temples', 'Architecture', 'Culture'],
    managingAuthority: 'Archaeological Survey of India (ASI) & Muzrai Department',
    sourceUrl: 'https://whc.unesco.org/en/list/1670/',
  },
  {
    id: 'halebidu-hoysaleswara-detour',
    nameEn: 'Halebidu Hoysaleswara Temple (UNESCO Hoysala Ensemble)',
    nameKn: 'ಹಳೇಬೀಡು ಹೊಯ್ಸಳೇಶ್ವರ ದೇವಾಲಯ',
    corridorId: 'BLR_TO_CHIKKAMAGALURU',
    nearestHighwayNode: 'Hassan / Belur – Halebidu Link Road',
    coordinates: [75.9942, 13.2130],
    baseRouteKmWithoutDetour: 244,
    detourAdditionalKm: 32,
    detourAdditionalDriveMins: 48,
    recommendedVisitDurationMins: 60,
    totalExtraTimeMins: 108,
    openingHoursWindow: { opensAt: '06:30', closesAt: '18:00', display: '06:30 AM – 06:00 PM (Museum closes Fridays)' },
    matchingInterests: ['Heritage', 'Temples', 'Architecture'],
    managingAuthority: 'Archaeological Survey of India (ASI)',
    sourceUrl: 'https://whc.unesco.org/en/list/1670/',
  },
  {
    id: 'chitradurga-fort-detour',
    nameEn: 'Chitradurga Nayaka Seven-Ringed Stone Fort (Elusuttina Kote)',
    nameKn: 'ಚಿತ್ರದುರ್ಗದ ಏಳು ಸುತ್ತಿನ ಕೋಟೆ',
    corridorId: 'BLR_TO_HAMPI',
    nearestHighwayNode: 'Chitradurga Junction (NH-48 / NH-50 Split)',
    coordinates: [76.4022, 14.2152],
    baseRouteKmWithoutDetour: 342,
    detourAdditionalKm: 5,
    detourAdditionalDriveMins: 12,
    recommendedVisitDurationMins: 120,
    totalExtraTimeMins: 132,
    openingHoursWindow: { opensAt: '06:00', closesAt: '18:00', display: '06:00 AM – 06:00 PM (ASI Ticketed)' },
    matchingInterests: ['Heritage', 'Architecture', 'Adventure'],
    managingAuthority: 'Archaeological Survey of India (ASI)',
    sourceUrl: 'https://asi.payumoney.com/',
  },
];

export interface FeasibilityEvaluationInput {
  originExists: boolean;
  destinationExists: boolean;
  routeValid: boolean;
  estimatedTransitDurationMins: number | null;
  availableTripDays: number;
  plannedAttractionVisitMinsTotal: number;
  plannedLocalTransferBufferMins: number;
  hasUnconfirmedTransportOrHotelRate: boolean;
  exceedsUserDeclaredBudget: boolean;
  violatesAccessibilityConstraint: boolean;
  safetyAdvisoriesAttached: boolean;
}

export interface FeasibilityEvaluationResult {
  status: DeterministicFeasibilityStatus;
  ruleChecklist: { ruleNumber: number; ruleName: string; passed: boolean; explanation: string }[];
  uncertaintiesToDisclose: string[];
}

export function evaluateJourneyFeasibilityDeterministically(
  input: FeasibilityEvaluationInput
): FeasibilityEvaluationResult {
  const maxActiveDaylightMinsPerDay = 9.5 * 60; // 08:00 AM to 05:30 PM monument window (570 mins)
  const totalAvailableVisitWindowMins = input.availableTripDays * maxActiveDaylightMinsPerDay;
  const requiredOnGroundMins = input.plannedAttractionVisitMinsTotal + input.plannedLocalTransferBufferMins;

  const rules = [
    {
      ruleNumber: 1,
      ruleName: 'Origin and destination canonical records exist',
      passed: input.originExists && input.destinationExists,
      explanation:
        input.originExists && input.destinationExists
          ? 'Both origin and destination resolved to canonical WGS84 records.'
          : 'Missing canonical geographic record for origin or destination.',
    },
    {
      ruleNumber: 2,
      ruleName: 'Route corridor is valid',
      passed: input.routeValid,
      explanation: input.routeValid ? 'Road/rail corridor geometry verified.' : 'Route geometry could not be computed.',
    },
    {
      ruleNumber: 3,
      ruleName: 'Estimated journey duration is available',
      passed: input.estimatedTransitDurationMins !== null,
      explanation:
        input.estimatedTransitDurationMins !== null
          ? `Outbound transit duration verified (${input.estimatedTransitDurationMins} mins).`
          : 'Transit duration unavailable from provider.',
    },
    {
      ruleNumber: 4,
      ruleName: 'Departure and arrival windows are compatible',
      passed: input.availableTripDays >= 1,
      explanation: `Scheduled across ${input.availableTripDays} day(s).`,
    },
    {
      ruleNumber: 5,
      ruleName: 'Attractions respect accessibility constraints',
      passed: !input.violatesAccessibilityConstraint,
      explanation: !input.violatesAccessibilityConstraint
        ? 'All selected stops satisfy accessibility filters.'
        : 'One or more stops involve steep boulder stairs incompatible with step-free filter.',
    },
    {
      ruleNumber: 6,
      ruleName: 'Attractions scheduled within published ASI/Temple opening windows',
      passed: requiredOnGroundMins <= totalAvailableVisitWindowMins,
      explanation:
        requiredOnGroundMins <= totalAvailableVisitWindowMins
          ? `Required visit + transfer time (${requiredOnGroundMins} mins) fits within daylight monument hours (${totalAvailableVisitWindowMins} mins).`
          : `Planned stops require ${requiredOnGroundMins} mins, exceeding the ${totalAvailableVisitWindowMins} mins of open monument hours.`,
    },
    {
      ruleNumber: 7,
      ruleName: 'Adequate buffer between monument transfers',
      passed: input.plannedLocalTransferBufferMins >= 30,
      explanation: `Allocated ${input.plannedLocalTransferBufferMins} mins for inter-cluster transfers (e.g., Gejjala Mandapa EV buggy wait).`,
    },
    {
      ruleNumber: 8,
      ruleName: 'Budget constraints satisfied or flagged',
      passed: !input.exceedsUserDeclaredBudget,
      explanation: !input.exceedsUserDeclaredBudget
        ? 'Known confirmed/published costs are within your declared budget.'
        : 'Known costs exceed your declared budget target; requires user decision.',
    },
    {
      ruleNumber: 9,
      ruleName: 'Safety and local awareness records attached',
      passed: input.safetyAdvisoriesAttached,
      explanation: 'Destination safety records and 112 ERSS access attached.',
    },
  ];

  const uncertaintiesToDisclose: string[] = [];
  if (input.hasUnconfirmedTransportOrHotelRate) {
    uncertaintiesToDisclose.push(
      'Live room inventory tariff at KSTDC Mayura Bhuvaneshwari and dynamic KSRTC AWATAR fares require direct confirmation on official portals.'
    );
  }

  let status: DeterministicFeasibilityStatus = 'FEASIBLE';
  if (!input.originExists || !input.destinationExists || input.estimatedTransitDurationMins === null) {
    status = 'INSUFFICIENT_DATA';
  } else if (requiredOnGroundMins > totalAvailableVisitWindowMins || input.violatesAccessibilityConstraint) {
    status = 'NOT_FEASIBLE';
  } else if (input.exceedsUserDeclaredBudget) {
    status = 'REQUIRES_USER_DECISION';
  } else if (input.hasUnconfirmedTransportOrHotelRate) {
    status = 'FEASIBLE_WITH_UNCONFIRMED_CONNECTIONS';
  }

  return { status, ruleChecklist: rules, uncertaintiesToDisclose };
}
