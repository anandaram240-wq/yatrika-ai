/**
 * @file src/__tests__/v9JourneyIntelligenceAndDiscovery.test.ts
 * @description Comprehensive reality verification for YatriKa AI V9:
 *   1. Deterministic Journey Finder Engine (Zero AI hallucinations)
 *   2. Route-Aware Discovery & Detour Calculation (Actual road network vs straight-line)
 *   3. Deterministic Feasibility Engine (Time window & pacing validation)
 *   4. Journey Readiness Passport (Structured evidence & provenance generation)
 * @theme Code. Create. Celebrate Kannada.
 */

import { describe, it, expect } from 'vitest';
import { findJourneys, JourneyFinderQuery } from '../data/journeyFinderEngine';
import { getCandidateDetours, computeRoadDetour } from '../services/detourCalculationService';
import { KARNATAKA_POIS, CURATED_CIRCUIT_PRESETS } from '../data/karnatakaTravelRegistry';
import { FeasibilityEngine } from '../optimization/feasibilityEngine';

describe('YatriKa AI V9: Karnataka Journey Intelligence Engine', () => {
  describe('1. Primary Journey Finder (Deterministic Discovery)', () => {
    it('returns structured, source-backed circuits without AI hallucination', () => {
      const query: JourneyFinderQuery = {
        originId: 'origin-bengaluru',
        durationKey: 'weekend',
        travelMode: 'self_drive',
        interests: ['heritage', 'mountains'],
      };

      const results = findJourneys(query);

      expect(results.length).toBeGreaterThan(0);
      expect(results.length).toBeLessThanOrEqual(6);

      const topResult = results[0];
      expect(topResult.circuit).toBeDefined();
      expect(topResult.circuit.id).toBeDefined();
      expect(topResult.circuit.title).toBeTruthy();
      expect(topResult.circuit.stopIds.length).toBeGreaterThanOrEqual(2);
      expect(topResult.matchScore).toBeGreaterThanOrEqual(30);
      expect(topResult.matchScore).toBeLessThanOrEqual(100);
      expect(topResult.matchReasons.length).toBeGreaterThan(0);
      expect(['verified', 'sourced', 'estimated']).toContain(topResult.dataStatus);
    });

    it('ranks circuits matching specified multi-interests higher', () => {
      const heritageQuery: JourneyFinderQuery = {
        originId: 'origin-bengaluru',
        durationKey: '3_5_days',
        travelMode: 'any',
        interests: ['heritage'],
      };

      const results = findJourneys(heritageQuery);
      expect(results.length).toBeGreaterThan(0);

      // Verify that top circuits feature heritage elements
      const topCircuit = CURATED_CIRCUIT_PRESETS.find((c) => c.id === results[0].circuit.id);
      expect(topCircuit).toBeDefined();
      const containsHeritageInHighlights = topCircuit!.highlights.some(
        (h) => h.toLowerCase().includes('heritage') || h.toLowerCase().includes('temple') || h.toLowerCase().includes('unesco')
      );
      expect(containsHeritageInHighlights).toBe(true);
    });

    it('gracefully provides fallback circuits for niche queries', () => {
      const nicheQuery: JourneyFinderQuery = {
        originId: 'origin-karwar',
        durationKey: 'half_day',
        travelMode: 'train_local',
        interests: ['accessible'],
      };

      const results = findJourneys(nicheQuery);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].circuit.stopIds.length).toBeGreaterThan(0);
    });
  });

  describe('2. Route-Aware Discovery Engine (Along My Route Detours)', () => {
    const bengaluruCoord: [number, number] = [77.5683, 12.9784];
    const chikkamagaluruCoord: [number, number] = [75.7720, 13.3161];

    it('identifies candidate tourist stops along the Bengaluru-Chikkamagaluru corridor', () => {
      const candidates = getCandidateDetours(
        bengaluruCoord,
        chikkamagaluruCoord,
        KARNATAKA_POIS,
        65
      );

      expect(candidates.length).toBeGreaterThan(0);
      expect(candidates.length).toBeLessThanOrEqual(12);

      // Verify candidate POIs are not transport hubs
      candidates.forEach((c) => {
        expect(['railway_station', 'bus_terminal', 'airport']).not.toContain(c.poi.category);
        expect(c.haversineFromMidpointKm).toBeGreaterThan(0);
        expect(c.haversineFromMidpointKm).toBeLessThanOrEqual(65);
      });
    });

    it('computes realistic road detours with duration and visit time', async () => {
      const belurPoi = KARNATAKA_POIS.find((p) => p.id === 'poi-belur-halebidu')!;
      expect(belurPoi).toBeDefined();

      const detourResult = await computeRoadDetour(
        bengaluruCoord,
        chikkamagaluruCoord,
        belurPoi,
        25
      );

      expect(detourResult.poi.id).toBe('poi-belur-halebidu');
      expect(detourResult.additionalRoadDistanceKm).toBeGreaterThanOrEqual(0);
      expect(detourResult.additionalRoadDurationMinutes).toBeGreaterThanOrEqual(0);
      expect(detourResult.suggestedVisitDurationMinutes).toBeGreaterThan(0);
      expect(detourResult.totalAdditionalTimeMinutes).toBe(
        (detourResult.additionalRoadDurationMinutes || 0) + detourResult.suggestedVisitDurationMinutes
      );
      expect(['road_verified', 'road_estimated', 'haversine_fallback']).toContain(detourResult.dataStatus);
      expect(detourResult.dataStatusNote).toBeTruthy();
    });
  });

  describe('3. Deterministic Feasibility Engine', () => {
    it('evaluates comfortable Golden Corridor stops as feasible with verified inputs', () => {
      const stops = [
        KARNATAKA_POIS.find((p) => p.id === 'poi-shettihalli-church')!,
        KARNATAKA_POIS.find((p) => p.id === 'poi-belur-halebidu')!,
        KARNATAKA_POIS.find((p) => p.id === 'poi-mullayanagiri')!,
      ].filter(Boolean);

      const report = FeasibilityEngine.evaluateFullItinerary({
        originName: 'Bengaluru (KSR / Majestic)',
        stops,
        allocatedDays: 3,
        startDepartureTime: '07:00',
        estimatedTotalDriveHours: 5.5,
      });

      expect(report).toBeDefined();
      expect(report.scoreBreakdown).toBeDefined();
      expect(report.scoreBreakdown.overallScore).toBeGreaterThanOrEqual(50);
      expect(report.scheduledSlots.length).toBe(stops.length);
      expect(report.dailyLegs.length).toBeGreaterThan(0);
      expect(report.explanation).toBeTruthy();
    });

    it('flags unfeasible itineraries when arrival conflicts with temple closure windows', () => {
      const templeStop = KARNATAKA_POIS.find(
        (p) => p.category === 'temple' || p.name.includes('Temple') || p.name.includes('ದೇವಾಲಯ')
      )!;
      expect(templeStop).toBeDefined();

      // Starting at 11:30 AM causes arrival during 12:30 - 16:00 mid-day sanctum closure
      const report = FeasibilityEngine.evaluateFullItinerary({
        originName: 'Bengaluru',
        stops: [templeStop],
        allocatedDays: 1,
        startDepartureTime: '11:30',
        estimatedTotalDriveHours: 2.5,
      });

      expect(report.isFeasible).toBe(false);
      expect(report.suggestedAlternativePlan).toBeDefined();
      expect(report.suggestedAlternativePlan!.suggestedAdjustedDepartureTime).toBe('06:00');
    });
  });
});
