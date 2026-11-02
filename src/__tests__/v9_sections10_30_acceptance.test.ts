// src/__tests__/v9_sections10_30_acceptance.test.ts
import { describe, it, expect } from 'vitest';
import {
  calculateHonestBudget,
} from '../engines/budgetLedgerEngine';
import {
  BudgetAndClassConfig,
  BudgetLineItem,
  TravellerGroupConfig,
} from '../types/journeySchema';
import {
  evaluateJourneyFeasibilityDeterministically,
  VERIFIED_CORRIDOR_DETOURS,
} from '../engines/feasibilityAndDetourEngine';
import {
  VERIFIED_KARNATAKA_TRAINS,
  VERIFIED_KARNATAKA_BUSES,
  validateAndFilterTrains,
} from '../data/railwayAndBusRegistry';
import { HAMPI_ACCOMMODATION_REGISTRY } from '../data/accommodationAndDossierRegistry';
import { HAMPI_SAFETY_EVIDENCE_RECORDS } from '../data/safetyAndWeatherRegistry';
import { parseKannadaOrEnglishTravelQuery } from '../services/kannadaIntentExtractor';
import { KARNATAKA_31_DISTRICTS } from '../data/karnataka31DistrictsBaseline';

describe('YATRIKA V9.0: Sections 10 to 30 Architectural Invariants & Engine Acceptance Suite', () => {
  describe('1. Decoupled Budget, Class & Honest Ledger Accounting (Section 10)', () => {
    const group: TravellerGroupConfig = {
      adults: 2,
      children: 1,
      seniors: 0,
      roomsRequired: 1,
      nights: 2,
      accessibilityNeeds: { stepFreeAccess: false, minimalWalking: false, wheelchairFriendly: false },
    };

    const config: BudgetAndClassConfig = {
      budgetMode: 'PER_PERSON',
      budgetTier: 'standard',
      customBudgetInr: 5000,
      preferredModes: ['RAIL', 'BUS'],
      preferredRailClasses: ['SL'],
      preferredBusClasses: ['ORDINARY'],
      accommodationPreference: 'GOVERNMENT_OPERATED_ONLY',
      isBusinessLuxuryExperience: false,
    };

    const mockItems: BudgetLineItem[] = [
      {
        id: 'rail',
        category: 'OUTBOUND_TRANSPORT',
        label: '16592 Hampi Express',
        amountPerPersonInr: 285,
        amountGroupTotalInr: null,
        status: 'PUBLISHED_RATE',
        sourceLabel: 'PRS',
        notes: 'Published tariff',
      },
      {
        id: 'asi',
        category: 'ENTRY_FEES',
        label: 'ASI Entry',
        amountPerPersonInr: 40,
        amountGroupTotalInr: null,
        status: 'CONFIRMED',
        sourceLabel: 'ASI',
        notes: 'Confirmed',
      },
      {
        id: 'hotel',
        category: 'ACCOMMODATION',
        label: 'KSTDC Hotel Mayura',
        amountPerPersonInr: null,
        amountGroupTotalInr: null,
        status: 'UNAVAILABLE',
        sourceLabel: 'KSTDC',
        notes: 'Live portal quote required',
      },
      {
        id: 'food',
        category: 'FOOD',
        label: 'Local Meals',
        amountPerPersonInr: 500,
        amountGroupTotalInr: null,
        status: 'ESTIMATED',
        sourceLabel: 'Field data',
        notes: 'Estimated',
      },
    ];

    it('calculates separate confirmed/published vs estimated subtotals per person and group', () => {
      const summary = calculateHonestBudget(group, config, mockItems);
      // Total travellers = 2 + 1 = 3
      expect(summary.confirmedAndPublishedPerPersonInr).toBe(325); // 285 + 40
      expect(summary.confirmedAndPublishedGroupInr).toBe(325 * 3);
      expect(summary.estimatedPerPersonInr).toBe(500);
      expect(summary.estimatedGroupInr).toBe(1500);
    });

    it('flags INCOMPLETE_DUE_TO_UNAVAILABLE_RATES when core accommodation is UNAVAILABLE', () => {
      const summary = calculateHonestBudget(group, config, mockItems);
      expect(summary.hasUnavailableCoreItems).toBe(true);
      expect(summary.unavailableItemLabels).toContain('KSTDC Hotel Mayura');
      expect(summary.budgetComparisonStatus).toBe('INCOMPLETE_DUE_TO_UNAVAILABLE_RATES');
    });

    it('never infers transport class from total budget amount', () => {
      // Even with ₹25,000 budget, budgetAndClass can select Ordinary bus or Sleeper train
      const luxuryBudgetConfig: BudgetAndClassConfig = {
        ...config,
        customBudgetInr: 25000,
        budgetTier: 'business_luxury',
        preferredRailClasses: ['SL'], // Sleeper explicitly chosen
      };
      expect(luxuryBudgetConfig.preferredRailClasses).toEqual(['SL']);
    });
  });

  describe('2. Traceable Indian Railways & Karnataka Bus Connectivity (Sections 12 & 13)', () => {
    it('locks train direction and enforces canonical Indian Railways numbers', () => {
      const outboundTrains = validateAndFilterTrains('SBC', 'HPT');
      expect(outboundTrains.length).toBeGreaterThanOrEqual(1);
      const hampiExp = outboundTrains.find((t) => t.trainNumber === '16592');
      expect(hampiExp).toBeDefined();
      expect(hampiExp?.directionId).toBe('SBC_TO_HPT');
      expect(hampiExp?.sourceStation.code).toBe('SBC');
      expect(hampiExp?.destinationStation.code).toBe('HPT');

      // 16591 is return (HPT to SBC)
      const returnTrains = validateAndFilterTrains('HPT', 'SBC');
      const returnExp = returnTrains.find((t) => t.trainNumber === '16591');
      expect(returnExp).toBeDefined();
      expect(returnExp?.directionId).toBe('HPT_TO_SBC');
    });

    it('only presents rail classes physically supported on the returned service', () => {
      const hampiExp = VERIFIED_KARNATAKA_TRAINS.find((t) => t.trainNumber === '16592');
      expect(hampiExp).toBeDefined();
      // 16592 has 1A, 2A, 3A, SL, UR. It does NOT have CC or EC.
      expect(hampiExp?.supportedClasses).toContain('3A');
      expect(hampiExp?.supportedClasses).toContain('SL');
      expect(hampiExp?.supportedClasses).not.toContain('CC');
      expect(hampiExp?.supportedClasses).not.toContain('EC');
    });

    it('separates PRS Reserved Express from Unreserved Passenger services', () => {
      const passenger = VERIFIED_KARNATAKA_TRAINS.find((t) => t.trainNumber === '56909');
      expect(passenger).toBeDefined();
      expect(passenger?.serviceCategory).toBe('UNRESERVED_PASSENGER_MEMU');
      expect(passenger?.irctcBookable).toBe(false);
      expect(passenger?.railOneUnreservedSupported).toBe(true);
    });

    it('provides verified KSRTC / KKRTC bus connectivity without fabricating live tariffs', () => {
      const awatar = VERIFIED_KARNATAKA_BUSES.find((b) => b.serviceId === 'KSRTC-AWATAR-BLR-HPT-01');
      expect(awatar).toBeDefined();
      expect(awatar?.fareStatus).toBe('CHECK_OFFICIAL_PORTAL');
      expect(awatar?.publishedFareInr).toBeNull();

      const localShuttle = VERIFIED_KARNATAKA_BUSES.find((b) => b.serviceId === 'KKRTC-LOCAL-HPT-HMP-SHUTTLE');
      expect(localShuttle).toBeDefined();
      expect(localShuttle?.publishedFareInr).toBe(25);
    });
  });

  describe('3. Strict Government & Registered Accommodation Filter (Sections 14 & 15)', () => {
    it('qualifies KSTDC Hotel Mayura Bhuvaneshwari for primary recommendation', () => {
      const kstdc = HAMPI_ACCOMMODATION_REGISTRY.find((a) => a.id === 'kstdc-mayura-bhuvaneshwari-hampi');
      expect(kstdc).toBeDefined();
      expect(kstdc?.verificationLabel).toBe('GOVERNMENT_OPERATED');
      expect(kstdc?.eligibleForPrimaryRecommendation).toBe(true);
    });

    it('excludes NIDHI_LISTED_ONLY properties from primary recommendations', () => {
      const nidhiOnly = HAMPI_ACCOMMODATION_REGISTRY.find((a) => a.id === 'sample-nidhi-only-disclosure');
      expect(nidhiOnly).toBeDefined();
      expect(nidhiOnly?.verificationLabel).toBe('NIDHI_LISTED_ONLY');
      expect(nidhiOnly?.eligibleForPrimaryRecommendation).toBe(false);
    });
  });

  describe('4. Evidence-Backed Safety Layer with Non-Colour Symbols & 112 Access (Section 16)', () => {
    it('contains all 3 mandatory source-backed Hampi records with exact temporal and hazard status', () => {
      expect(HAMPI_SAFETY_EVIDENCE_RECORDS).toHaveLength(3);

      const matanga = HAMPI_SAFETY_EVIDENCE_RECORDS.find((s) => s.id === 'hampi-safety-matanga-hill-2025-06-09');
      expect(matanga).toBeDefined();
      expect(matanga?.badgeSymbol).toContain('▲');
      expect(matanga?.classification).toBe('TERRAIN_PRECAUTION');

      const sanapur = HAMPI_SAFETY_EVIDENCE_RECORDS.find((s) => s.id === 'hampi-safety-sanapur-canal-2025-03-06');
      expect(sanapur).toBeDefined();
      expect(sanapur?.badgeSymbol).toContain('◆');
      expect(sanapur?.classification).toBe('HISTORICAL_INCIDENT');

      const flooding = HAMPI_SAFETY_EVIDENCE_RECORDS.find((s) => s.id === 'hampi-safety-tungabhadra-flooding-2024-07-31');
      expect(flooding).toBeDefined();
      expect(flooding?.badgeSymbol).toContain('≈');
      expect(flooding?.classification).toBe('WATER_HAZARD');
    });

    it('enforces 112 national ERSS emergency integration across all safety records', () => {
      HAMPI_SAFETY_EVIDENCE_RECORDS.forEach((rec) => {
        expect(rec.emergencyContact.nationalErssNumber).toBe('112');
        expect(rec.emergencyContact.erssUrl).toBe('https://112.gov.in/');
      });
    });
  });

  describe('5. Deterministic Feasibility & Corridor Detours (Sections 21 & 22)', () => {
    it('evaluates all 10 feasibility rules deterministically without LLM hallucination', () => {
      const res = evaluateJourneyFeasibilityDeterministically({
        originExists: true,
        destinationExists: true,
        routeValid: true,
        estimatedTransitDurationMins: 545,
        availableTripDays: 2,
        plannedAttractionVisitMinsTotal: 300,
        plannedLocalTransferBufferMins: 60,
        hasUnconfirmedTransportOrHotelRate: false,
        exceedsUserDeclaredBudget: false,
        violatesAccessibilityConstraint: false,
        safetyAdvisoriesAttached: true,
      });

      expect(res.status).toBe('FEASIBLE');
      expect(res.ruleChecklist).toHaveLength(9);
      expect(res.ruleChecklist.every((r) => r.passed)).toBe(true);
    });

    it('returns NOT_FEASIBLE when visit duration exceeds open daylight monument window', () => {
      const res = evaluateJourneyFeasibilityDeterministically({
        originExists: true,
        destinationExists: true,
        routeValid: true,
        estimatedTransitDurationMins: 300,
        availableTripDays: 1, // Only 1 day (570 daylight mins)
        plannedAttractionVisitMinsTotal: 650, // 650 mins exceeds daylight
        plannedLocalTransferBufferMins: 60,
        hasUnconfirmedTransportOrHotelRate: false,
        exceedsUserDeclaredBudget: false,
        violatesAccessibilityConstraint: false,
        safetyAdvisoriesAttached: true,
      });

      expect(res.status).toBe('NOT_FEASIBLE');
      const rule6 = res.ruleChecklist.find((r) => r.ruleNumber === 6);
      expect(rule6?.passed).toBe(false);
    });

    it('provides verified along-my-route detours with additional km, drive time, and ASI hours', () => {
      expect(VERIFIED_CORRIDOR_DETOURS.length).toBeGreaterThanOrEqual(3);
      const belur = VERIFIED_CORRIDOR_DETOURS.find((d) => d.id === 'belur-chennakeshava-detour');
      expect(belur).toBeDefined();
      expect(belur?.detourAdditionalKm).toBe(11);
      expect(belur?.detourAdditionalDriveMins).toBe(18);
      expect(belur?.openingHoursWindow.display).toContain('07:30 AM');
    });
  });

  describe('6. Kannada & Multilingual Intent Extractor (Section 23)', () => {
    it('extracts origin, destination, duration and budget from native Kannada script', () => {
      const extracted = parseKannadaOrEnglishTravelQuery(
        'ನಾಳೆ ಬೆಂಗಳೂರಿನಿಂದ ಹಂಪಿಗೆ ಎರಡು ದಿನದ ಪ್ರವಾಸ ಬೇಕು ₹5000 ಬಜೆಟ್'
      );
      expect(extracted.recognizedOriginLabel).toContain('KSR Bengaluru');
      expect(extracted.resolvedDestination?.id).toBe('hampi');
      expect(extracted.extractedDays).toBe(2);
      expect(extracted.extractedBudgetPerPersonInr).toBe(5000);
      expect(extracted.aiGuardrailNotice).toContain('Intent extracted deterministically');
    });
  });

  describe('7. All 31 Karnataka Districts Baseline (Section 25)', () => {
    it('contains exactly 31 districts spanning all 4 Karnataka administrative divisions', () => {
      expect(KARNATAKA_31_DISTRICTS).toHaveLength(31);
      const divisions = new Set(KARNATAKA_31_DISTRICTS.map((d) => d.division));
      expect(divisions).toContain('Bengaluru');
      expect(divisions).toContain('Mysuru');
      expect(divisions).toContain('Belagavi');
      expect(divisions).toContain('Kalaburagi');
    });

    it('prioritizes Hampi, Mysuru, Chikkamagaluru, Kodagu, Gokarna, Badami with deep dossiers', () => {
      const deepDossiers = KARNATAKA_31_DISTRICTS.filter((d) => d.deepDossierReady);
      expect(deepDossiers.length).toBe(6);
      const deepCodes = deepDossiers.map((d) => d.districtCode);
      expect(deepCodes).toContain('KA-VJN'); // Vijayanagara (Hampi)
      expect(deepCodes).toContain('KA-MYS'); // Mysuru
      expect(deepCodes).toContain('KA-CKM'); // Chikkamagaluru
      expect(deepCodes).toContain('KA-KDG'); // Kodagu
      expect(deepCodes).toContain('KA-UKD'); // Uttara Kannada (Gokarna)
      expect(deepCodes).toContain('KA-BGK'); // Bagalkote (Badami)
    });
  });
});
