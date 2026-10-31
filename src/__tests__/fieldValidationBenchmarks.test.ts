import { describe, expect, it } from 'vitest';
import { TravelOrchestrator } from '../agents/travelOrchestrator';
import { FeasibilityEngine } from '../optimization/feasibilityEngine';
import { KARNATAKA_POIS } from '../data/karnatakaTravelRegistry';
import { KarnatakaNetworkGraph } from '../geo/karnatakaNetworkGraph';
import { RoadSegmentAnalyzer } from '../geo/roadSegmentAnalyzer';

describe('Phase 9: Field Validation & Independent Benchmarking (6 Scenarios)', () => {
  const getPoi = (id: string) => KARNATAKA_POIS.find((p) => p.id === id);

  // SCENARIO 1: Bengaluru to Chikkamagaluru
  it('Scenario 1: Bengaluru to Chikkamagaluru (Mullayanagiri & Malnad Coffee Corridor)', () => {
    const t0 = performance.now();
    const ckmPoi = getPoi('poi-mullayanagiri');
    expect(ckmPoi).toBeDefined();

    const orchestrator = new TravelOrchestrator();
    const plan = orchestrator.orchestrateTrip({
      originId: 'origin-bengaluru',
      originName: 'Bengaluru Majestic',
      destinationIds: ['poi-mullayanagiri'],
      days: 2,
      totalRoadDistanceKm: 245,
      estimatedDriveHours: 4.8,
      isGhatTerrain: true,
    });

    const elapsedMs = performance.now() - t0;
    expect(plan.state).toBe('READY');
    expect(plan.feasibility.isFeasible).toBe(true);
    expect(elapsedMs).toBeLessThan(50); // fast execution < 50ms
  });

  // SCENARIO 2: Hassan to Belur and Halebidu
  it('Scenario 2: Hassan to Belur & Halebidu (UNESCO Hoysala Heritage & Darshan Windows)', () => {
    const hoysala = getPoi('poi-belur-halebidu');
    const bahubali = getPoi('poi-shravanabelagola');
    expect(hoysala).toBeDefined();
    expect(bahubali).toBeDefined();

    const report = FeasibilityEngine.evaluateFullItinerary({
      originName: 'Hassan Junction',
      stops: [hoysala!, bahubali!],
      allocatedDays: 1,
      startDepartureTime: '08:00',
      estimatedTotalDriveHours: 2.2,
    });

    expect(report.isFeasible).toBe(true);
    expect(report.scheduledSlots.length).toBe(2);
    expect(report.scheduledSlots[0].isDarshanClosureViolation).toBe(false);
  });

  // SCENARIO 3: Bengaluru to Hampi
  it('Scenario 3: Bengaluru to Hampi (Vijayanagara UNESCO Circuit & Rail Hand-off)', () => {
    const hampiStone = getPoi('poi-hampi-stone-chariot');
    expect(hampiStone).toBeDefined();

    const orchestrator = new TravelOrchestrator();
    const trip = orchestrator.orchestrateTrip({
      originId: 'origin-bengaluru',
      originName: 'Bengaluru Majestic',
      destinationIds: ['poi-hampi-stone-chariot'],
      days: 3,
      totalRoadDistanceKm: 345,
      estimatedDriveHours: 6.2,
      isGhatTerrain: false,
    });

    expect(trip.state).toBe('READY');
    expect(trip.feasibility.isFeasible).toBe(true);
  });

  // SCENARIO 4: Mysuru to Coorg (Madikeri)
  it('Scenario 4: Mysuru to Coorg (Madikeri Fort & Coffee Trail via NH-275)', () => {
    const graph = new KarnatakaNetworkGraph();
    const passes = graph.findAlternativeGhatPasses('node-bengaluru', 'node-mangaluru');
    const sampaje = passes.find((p) => p.passName === 'Sampaje Ghat');
    expect(sampaje).toBeDefined();
    expect(sampaje?.roadNumber).toBe('NH-275');
  });

  // SCENARIO 5: Hubballi to Badami & Pattadakal
  it('Scenario 5: Hubballi to Badami & Pattadakal (Chalukya Rock-Cut Architecture)', () => {
    const badami = getPoi('poi-badami-caves');
    const pattadakal = getPoi('poi-pattadakal-unesco');
    expect(badami).toBeDefined();
    expect(pattadakal).toBeDefined();

    const report = FeasibilityEngine.evaluateFullItinerary({
      originName: 'Hubballi Junction',
      stops: [badami!, pattadakal!],
      allocatedDays: 2,
      startDepartureTime: '08:30',
      estimatedTotalDriveHours: 3.5,
    });

    expect(report.isFeasible).toBe(true);
    expect(report.dailyLegs.length).toBe(2);
  });

  // SCENARIO 6: Mangaluru to Udupi
  it('Scenario 6: Mangaluru to Udupi (Coastal NH-66 & Culinary Corridor)', () => {
    const coastalCoords: [number, number][] = [
      [74.8430, 12.8698], // Mangaluru
      [74.7950, 13.1000], // Mulki
      [74.7473, 13.3409], // Udupi
    ];
    const analysis = RoadSegmentAnalyzer.analyzeSegmentGeometry(coastalCoords, 75);
    expect(analysis.windingFactor).toBeLessThanOrEqual(1.15);
    expect(analysis.terrainType).toBe('expressway_plain');
    expect(analysis.effectiveSpeedKmH).toBeGreaterThanOrEqual(60);
  });
});
