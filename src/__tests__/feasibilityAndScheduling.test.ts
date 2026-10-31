import { describe, expect, it } from 'vitest';
import { TimeWindowSolver, TimeWindowConstraint } from '../optimization/timeWindowSolver';
import { MultiDayPlanner } from '../optimization/multiDayPlanner';
import { RouteScoring } from '../optimization/routeScoring';
import { FeasibilityEngine } from '../optimization/feasibilityEngine';
import { KarnatakaPOI } from '../types/nammatrip';

describe('Phase 6: Travel Feasibility & Predictive Scheduling', () => {
  it('1. Flags mid-day temple sanctum closure violations (12:30 PM - 4:00 PM)', () => {
    const templeConstraint: TimeWindowConstraint = {
      poiId: 'poi-belur-temple',
      poiName: 'Belur Chennakeshava Temple',
      category: 'temple',
      openingTime: '06:00',
      closingTime: '20:30',
      middayClosureStart: '12:30',
      middayClosureEnd: '16:00',
      recommendedDwellMinutes: 90,
      mustVisitInDaylight: false,
    };

    // Arriving at 13:15 (1:15 PM) -> Gates locked!
    const slot1 = TimeWindowSolver.evaluateVisitSlot(templeConstraint, '13:15');
    expect(slot1.isDarshanClosureViolation).toBe(true);
    expect(slot1.violationWarning).toContain('mid-day sanctum closure');

    // Arriving at 09:30 AM -> Gates open
    const slot2 = TimeWindowSolver.evaluateVisitSlot(templeConstraint, '09:30');
    expect(slot2.isDarshanClosureViolation).toBe(false);
  });

  it('2. Flags post-sunset arrivals for hazardous mountain viewpoints', () => {
    const trekConstraint: TimeWindowConstraint = {
      poiId: 'poi-mullayanagiri',
      poiName: 'Mullayanagiri Peak',
      category: 'hill_trek',
      openingTime: '06:00',
      closingTime: '18:00',
      recommendedDwellMinutes: 120,
      mustVisitInDaylight: true,
    };

    // Arriving at 19:15 (7:15 PM) -> Dangerous dark mountain trail
    const slot = TimeWindowSolver.evaluateVisitSlot(trekConstraint, '19:15');
    expect(slot.isAfterSunset).toBe(true);
    expect(slot.violationWarning).toContain('after sunset');
  });

  it('3. Partitions multi-day itineraries into daily legs with overnight hotel hubs and meal stops', () => {
    const mockStops: KarnatakaPOI[] = [
      {
        id: 'poi-1',
        name: 'Belur Temple',
        nameKannada: 'ಬೇಲೂರು',
        category: 'temple',
        district: 'Hassan',
        macroRegion: 'Malnad & Western Ghats',
        coordinates: [75.86, 13.16],
        summary: 'Hoysala capital',
        recommendedHours: 2,
        bestTimeOfDay: 'Morning',
        entryFeeInr: { indianCitizen: 0, feeNote: 'Free' },
        openingHours: '06:00 - 20:30',
        officialUrl: '',
        sourceAttribution: '',
        verifiedDate: '2026-10-01',
        nearestRailwayId: 'HAS',
        nearestBusTerminalId: 'KSRTC-HAS',
        localPhrase: { kannada: '', iast: '', english: '', dialectLabel: '', usageContext: '' },
      },
      {
        id: 'poi-2',
        name: 'Mullayanagiri',
        nameKannada: 'ಮುಳ್ಳಯ್ಯನಗಿರಿ',
        category: 'hill_trek',
        district: 'Chikkamagaluru',
        macroRegion: 'Malnad & Western Ghats',
        coordinates: [75.72, 13.39],
        summary: 'Highest peak',
        recommendedHours: 3,
        bestTimeOfDay: 'Sunrise',
        entryFeeInr: { indianCitizen: 0, feeNote: 'Free' },
        openingHours: '06:00 - 18:00',
        officialUrl: '',
        sourceAttribution: '',
        verifiedDate: '2026-10-01',
        nearestRailwayId: 'TKE',
        nearestBusTerminalId: 'KSRTC-CKM',
        localPhrase: { kannada: '', iast: '', english: '', dialectLabel: '', usageContext: '' },
      },
    ];

    const legs = MultiDayPlanner.partitionItinerary({
      originName: 'Bengaluru Majestic',
      stops: mockStops,
      allocatedDays: 2,
    });

    expect(legs.length).toBe(2);
    expect(legs[0].dayNumber).toBe(1);
    expect(legs[0].mealStops.length).toBe(3); // breakfast, lunch, dinner
    expect(legs[0].nightGhatDrivingForbidden).toBe(true);
  });

  it('4. Computes multi-objective itinerary score penalizing overpacked days and closed temples', () => {
    // Overpacked with 2 closed temple visits
    const badScore = RouteScoring.scoreItinerary({
      totalDriveHours: 16,
      allocatedDays: 2,
      stopsCount: 10,
      darshanViolationsCount: 2,
      nightGhatLegsCount: 1,
    });

    expect(badScore.overallScore).toBeLessThan(45);
    expect(badScore.penalties.darshanViolationPenalty).toBe(50);
    expect(badScore.verbalAssessment).toContain('Critical scheduling flaws');

    // Well-balanced trip
    const goodScore = RouteScoring.scoreItinerary({
      totalDriveHours: 6,
      allocatedDays: 2,
      stopsCount: 4,
      darshanViolationsCount: 0,
      nightGhatLegsCount: 0,
    });

    expect(goodScore.overallScore).toBeGreaterThanOrEqual(90);
  });

  it('5. Feasibility engine detects flawed schedules and recommends realistic alternatives', () => {
    const templeStop: KarnatakaPOI = {
      id: 'poi-temple',
      name: 'Kukke Subrahmanya Temple',
      nameKannada: 'ಕುಕ್ಕೆ ಸುಬ್ರಹ್ಮಣ್ಯ',
      category: 'temple',
      district: 'Dakshina Kannada',
      macroRegion: 'Karavali Coastal',
      coordinates: [75.61, 12.66],
      summary: 'Serpent temple',
      recommendedHours: 2,
      bestTimeOfDay: 'Morning',
      entryFeeInr: { indianCitizen: 0, feeNote: 'Free' },
      openingHours: '06:00 - 12:30, 16:00 - 20:30',
      officialUrl: '',
      sourceAttribution: '',
      verifiedDate: '2026-10-01',
      nearestRailwayId: 'KBPR',
      nearestBusTerminalId: 'KSRTC-KUKKE',
      localPhrase: { kannada: '', iast: '', english: '', dialectLabel: '', usageContext: '' },
    };

    // Starting at 11:30 AM means arriving during 12:30 - 16:00 closure
    const report = FeasibilityEngine.evaluateFullItinerary({
      originName: 'Hassan',
      stops: [templeStop],
      allocatedDays: 1,
      startDepartureTime: '11:30',
      estimatedTotalDriveHours: 3.5,
    });

    expect(report.isFeasible).toBe(false);
    expect(report.suggestedAlternativePlan).toBeDefined();
    expect(report.suggestedAlternativePlan?.suggestedAdjustedDepartureTime).toBe('06:00');
  });
});
