/**
 * @file src/__tests__/v8TransitAndBuses.test.ts
 * @description Unit tests for YatriKa AI V8 Karnataka Bus Transport Intelligence.
 * @theme Code. Create. Celebrate Kannada.
 */

import { describe, it, expect } from 'vitest';
import { KARNATAKA_BUS_OPERATORS } from '../transit/buses/busOperatorRegistry';
import { BusSearchService } from '../transit/buses/busSearchService';
import { BusBookingHandoff } from '../transit/buses/bookingHandoff';

describe('YatriKa AI V8 — Bus Transport Intelligence Suite', () => {
  it('1. verifies that the 4 major state road transport corporations are fully defined with headquarters and helplines', () => {
    expect(KARNATAKA_BUS_OPERATORS.KSRTC).toBeDefined();
    expect(KARNATAKA_BUS_OPERATORS.BMTC).toBeDefined();
    expect(KARNATAKA_BUS_OPERATORS.NWKRTC).toBeDefined();
    expect(KARNATAKA_BUS_OPERATORS.KKRTC).toBeDefined();

    expect(KARNATAKA_BUS_OPERATORS.KSRTC.shaktiSchemeApplicable).toBe(true);
    expect(KARNATAKA_BUS_OPERATORS.NWKRTC.shaktiSchemeApplicable).toBe(true);
    expect(KARNATAKA_BUS_OPERATORS.KKRTC.shaktiSchemeApplicable).toBe(true);
    expect(KARNATAKA_BUS_OPERATORS.VRL.shaktiSchemeApplicable).toBe(false); // Private operator
  });

  it('2. verifies multi-operator bus search on key Karnataka corridors', () => {
    // Search Bengaluru to Belur
    const res = BusSearchService.search({
      origin: 'Bengaluru',
      destination: 'Belur',
      passengers: 2,
      womenPassengersCount: 1,
    });

    expect(res.results.length).toBeGreaterThanOrEqual(2);
    expect(res.shaktiSchemeAvailable).toBe(true);

    const rajahamsa = res.results.find((r) => r.schedule.serviceClass === 'rajahamsa_executive');
    expect(rajahamsa).toBeDefined();
    expect(rajahamsa?.schedule.departureTime).toBe('06:30');
    expect(rajahamsa?.shaktiSavingsInr).toBe(280); // 1 woman * ₹280 fare
  });

  it('3. verifies fallback notice when direct services are unavailable', () => {
    const fallbackSearch = BusSearchService.search({
      origin: 'Bengaluru',
      destination: 'UnknownNonExistentVillage',
    });

    expect(fallbackSearch.fallbackNotice).toBeDefined();
    expect(fallbackSearch.fallbackNotice).toContain('Live schedule is not available');
  });

  it('4. verifies authentic official booking handoff payload without pretending internal checkout', () => {
    const handoff = BusBookingHandoff.createHandoff('KSRTC', 'Bengaluru', 'Belur', '2026-11-05', true);
    expect(handoff.handoffUrl).toContain('ksrtc.in');
    expect(handoff.shaktiEligible).toBe(true);
    expect(handoff.disclaimer).toContain('does not handle payment processing');
    expect(handoff.instructionsKannada.length).toBeGreaterThan(10);
  });
});
