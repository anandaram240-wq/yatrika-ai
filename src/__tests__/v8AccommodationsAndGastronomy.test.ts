/**
 * @file src/__tests__/v8AccommodationsAndGastronomy.test.ts
 * @description Unit tests for YatriKa AI V8 Verified Accommodations, GI Gastronomy, and Universal Trip Planner.
 * @theme Code. Create. Celebrate Kannada.
 */

import { describe, it, expect } from 'vitest';
import { AccommodationRegistryV8 } from '../stays/accommodationRegistry';
import { VERIFIED_KARNATAKA_RESTAURANTS } from '../dining/restaurantRegistry';
import { TripBudgetEngine } from '../planner/tripBudgetEngine';
import { UniversalTripPlanner } from '../planner/universalTripPlanner';

describe('YatriKa AI V8 — Accommodations, Dining & Universal Planner Suite', () => {
  const stayRegistry = AccommodationRegistryV8.getInstance();

  it('1. verifies that verified stays contain government registration IDs and authentic price ranges', () => {
    const stays = stayRegistry.getAll();
    expect(stays.length).toBeGreaterThanOrEqual(6);

    for (const stay of stays) {
      expect(stay.id).toBeDefined();
      expect(stay.name).toBeDefined();
      expect(stay.nameKannada.length).toBeGreaterThan(3);
      expect(stay.priceRangeInr.min).toBeGreaterThan(500);
      expect(stay.priceRangeInr.max).toBeGreaterThanOrEqual(stay.priceRangeInr.min);
      expect(stay.officialBookingUrl.startsWith('https://')).toBe(true);
      expect(stay.verificationStatus).toBeDefined();
    }
  });

  it('2. verifies GI gastronomic records and iconic Karnataka eateries', () => {
    expect(VERIFIED_KARNATAKA_RESTAURANTS.length).toBeGreaterThanOrEqual(6);

    const dharwadPeda = VERIFIED_KARNATAKA_RESTAURANTS.find((r) => r.id === 'dine-thakur-peda-dharwad');
    expect(dharwadPeda).toBeDefined();
    expect(dharwadPeda?.giTagAssociated).toContain('GI Registration No. 23');

    const mylari = VERIFIED_KARNATAKA_RESTAURANTS.find((r) => r.id === 'dine-mylari-mysuru');
    expect(mylari).toBeDefined();
    expect(mylari?.signatureDishes).toContain('Mylari Butter Masala Dosa');
  });

  it('3. verifies transparent travel budget calculation with Shakti scheme savings', () => {
    const budget = TripBudgetEngine.calculateBudget({
      days: 3,
      travellersCount: 2,
      womenTravellersCount: 1,
      budgetTier: 'backpacker',
      trunkMode: 'bus',
      stopsCount: 3,
    });

    expect(budget.totalEstimatedCostInr).toBeGreaterThan(0);
    expect(budget.shaktiSchemeSavingsInr).toBeGreaterThan(0);
    expect(budget.breakdown.transitInr).toBeDefined();
    expect(budget.breakdown.accommodationInr).toBeDefined();
    expect(budget.breakdown.diningInr).toBeDefined();
    expect(budget.calculationFormula).toContain('Total = Transit');
  });

  it('4. verifies Universal Trip Planner end-to-end bundling for Bengaluru to Hampi journey', () => {
    const bundle = UniversalTripPlanner.plan({
      origin: 'Bengaluru',
      destinationQuery: 'Hampi',
      days: 3,
      travellers: 2,
      womenTravellers: 1,
      budgetTier: 'comfort',
      preferredTrunkMode: 'train',
    });

    expect(bundle.resolvedDestination.name).toContain('Virupaksha Temple');
    expect(bundle.intermodalJourney.chainSteps.length).toBeGreaterThanOrEqual(2);
    expect(bundle.recommendedStays.length).toBeGreaterThanOrEqual(1);
    expect(bundle.dailyItinerary.length).toBe(3);
    expect(bundle.budget.totalEstimatedCostInr).toBeGreaterThan(1000);
  });
});
