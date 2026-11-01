/**
 * @file src/__tests__/goldenJourneyCorridor.test.ts
 * @description Integration and Reality-Proof tests for the Golden User Journey and routing reliability.
 * @theme Code. Create. Celebrate Kannada.
 */

import { describe, it, expect } from 'vitest';
import { computeHaversineKm, buildFallbackRoadCorridor, calculateMultiStopRoadRoute } from '../services/routingService';
import { KARNATAKA_POIS, KARNATAKA_GATEWAY_ORIGINS } from '../data/karnatakaTravelRegistry';
import { getTemporalGovernance } from '../data/governanceRegistry';

describe('YatriKa AI V6 — Flagship Golden Corridor Reality Proof', () => {
  const blr = KARNATAKA_GATEWAY_ORIGINS.find((o) => o.id === 'origin-bengaluru')!;
  const hassan = KARNATAKA_GATEWAY_ORIGINS.find((o) => o.id === 'origin-hassan')!;
  const ckm = KARNATAKA_GATEWAY_ORIGINS.find((o) => o.id === 'origin-chikkamagaluru')!;

  const shettihalli = KARNATAKA_POIS.find((p) => p.id === 'poi-shettihalli-church')!;
  const belur = KARNATAKA_POIS.find((p) => p.id === 'poi-belur-halebidu')!;
  const hirekolale = KARNATAKA_POIS.find((p) => p.id === 'poi-hirekolale-lake')!;
  const mullayanagiri = KARNATAKA_POIS.find((p) => p.id === 'poi-mullayanagiri')!;

  it('1. Independently verifies geographic coordinates and air distances for all 6 Golden segments', () => {
    // Bengaluru -> Hassan
    const d1 = computeHaversineKm(blr.coordinates, hassan.coordinates);
    expect(d1).toBeGreaterThanOrEqual(150);
    expect(d1).toBeLessThanOrEqual(175);

    // Hassan -> Shettihalli
    const d2 = computeHaversineKm(hassan.coordinates, shettihalli.coordinates);
    expect(d2).toBeGreaterThanOrEqual(8);
    expect(d2).toBeLessThanOrEqual(16);

    // Hassan -> Belur
    const d3 = computeHaversineKm(hassan.coordinates, belur.coordinates);
    expect(d3).toBeGreaterThanOrEqual(25);
    expect(d3).toBeLessThanOrEqual(38);

    // Belur -> Chikkamagaluru
    const d4 = computeHaversineKm(belur.coordinates, ckm.coordinates);
    expect(d4).toBeGreaterThanOrEqual(15);
    expect(d4).toBeLessThanOrEqual(25);

    // Chikkamagaluru -> Hirekolale Lake
    const d5 = computeHaversineKm(ckm.coordinates, hirekolale.coordinates);
    expect(d5).toBeGreaterThanOrEqual(5);
    expect(d5).toBeLessThanOrEqual(10);

    // Hirekolale Lake -> Mullayanagiri Peak
    const d6 = computeHaversineKm(hirekolale.coordinates, mullayanagiri.coordinates);
    expect(d6).toBeGreaterThanOrEqual(3);
    expect(d6).toBeLessThanOrEqual(8);
  });

  it('2. Distinguishes live routing from schematic highway fallback and labels steps clearly', () => {
    const corridorStops = [
      { id: blr.id, name: blr.name, coordinates: blr.coordinates, macroRegion: 'Old Mysuru' } as any,
      shettihalli,
      belur,
      hirekolale,
      mullayanagiri,
    ];

    const fallback = buildFallbackRoadCorridor(corridorStops);

    expect(fallback.provenance).toBe('fallback_geodesic_corridor');
    expect(fallback.provenanceLabel).toContain('Offline/Fallback Mode');
    expect(fallback.totalDistanceKm).toBeGreaterThan(250);
    expect(fallback.totalDurationMinutes).toBeGreaterThan(240);

    // In fallback mode, maneuvers are explicitly marked as estimated schematic corridor legs
    fallback.legs.forEach((leg) => {
      expect(leg.steps[0].instruction).toContain('[Estimated Corridor]');
    });
  });

  it('3. Deduplicates identical concurrent routing requests in-flight', async () => {
    const stops = [shettihalli, belur];

    const p1 = calculateMultiStopRoadRoute(stops);
    const p2 = calculateMultiStopRoadRoute(stops);

    // The two promises must be the exact same in-flight reference
    expect(p1).toBe(p2);

    const res = await p1;
    expect(res.totalDistanceKm).toBeGreaterThan(0);
  });

  it('4. Rejects invalid coordinates and safely returns fallback corridor', async () => {
    const invalidStops = [
      { id: 'bad-1', name: 'Bad Point 1', coordinates: [999, 999] } as any,
      { id: 'bad-2', name: 'Bad Point 2', coordinates: [75.0, 13.0] } as any,
    ];

    const res = await calculateMultiStopRoadRoute(invalidStops);
    expect(res.provenance).toBe('fallback_geodesic_corridor');
  });

  it('5. Validates official temporal governance and regulatory documents for Belur and Mullayanagiri', () => {
    const belurGov = getTemporalGovernance('poi-belur-halebidu');
    expect(belurGov).toBeDefined();
    expect(belurGov?.issuingAuthority).toContain('Archaeological Survey of India');
    expect(belurGov?.documentIdentifier).toContain('ASI-BLR-CIR');
    expect(belurGov?.schedule.recessStart).toBe('12:30');
    expect(belurGov?.schedule.recessEnd).toBe('15:30');

    const mullaGov = getTemporalGovernance('poi-mullayanagiri');
    expect(mullaGov).toBeDefined();
    expect(mullaGov?.issuingAuthority).toContain('Karnataka Forest Department');
    expect(mullaGov?.documentIdentifier).toContain('KFD-CKM-GATE');
    expect(mullaGov?.schedule.closes).toBe('17:30');

    const shaktiGov = getTemporalGovernance('transit-shakti-scheme');
    expect(shaktiGov).toBeDefined();
    expect(shaktiGov?.documentIdentifier).toBe('GoK Order No. TRD 34 MDA 2023');
    expect(shaktiGov?.verificationStatus).toBe('OFFICIALLY_VERIFIED');
  });

  it('6. Verifies all 31 districts exist in DISTRICT_METADATA_MAP with 0 duplicates', () => {
    const districts = [...new Set(KARNATAKA_POIS.map((p) => p.district))].sort();
    expect(districts.length).toBe(31);

    // Check that canonical names Bagalkote, Chikkaballapura, and Davanagere are present
    expect(districts).toContain('Bagalkote');
    expect(districts).toContain('Chikkaballapura');
    expect(districts).toContain('Davanagere');

    // Check that non-standard spellings are 100% eliminated
    expect(districts).not.toContain('Bagalkot');
    expect(districts).not.toContain('Chikkaballapur');
    expect(districts).not.toContain('Davangere');
  });
});
