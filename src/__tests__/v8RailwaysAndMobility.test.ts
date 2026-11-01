/**
 * @file src/__tests__/v8RailwaysAndMobility.test.ts
 * @description Unit tests for YatriKa AI V8 Indian Railways Intelligence & Last-Mile Interchange.
 * @theme Code. Create. Celebrate Kannada.
 */

import { describe, it, expect } from 'vitest';
import { getStation } from '../transit/railways/stationRegistry';
import { TrainSearchService } from '../transit/railways/trainSearchService';
import { InterchangeGraph } from '../mobility/interchangeGraph';
import { LastMilePlanner } from '../mobility/lastMilePlanner';

describe('YatriKa AI V8 — Railways & Last-Mile Mobility Suite', () => {
  it('1. verifies Karnataka railway station registry with amenities and last-mile transfers', () => {
    const sbc = getStation('SBC');
    expect(sbc).toBeDefined();
    expect(sbc?.district).toBe('Bengaluru Urban');
    expect(sbc?.division).toBe('SBC');
    expect(sbc?.amenities).toContain('Pre-paid Auto');

    const hpt = getStation('HPT');
    expect(hpt).toBeDefined();
    expect(hpt?.servesDestinations.some((d) => d.destinationName.includes('Hampi'))).toBe(true);
  });

  it('2. verifies train schedule search for key tourist routes', () => {
    // Bengaluru to Hampi (Hosapete)
    const hampiTrainSearch = TrainSearchService.search({
      fromStationCodeOrCity: 'SBC',
      toStationCodeOrCity: 'HPT',
    });

    expect(hampiTrainSearch.directTrains.length).toBeGreaterThanOrEqual(1);
    const hampiExp = hampiTrainSearch.directTrains.find((t) => t.train.trainNumber.includes('16592'));
    expect(hampiExp).toBeDefined();
    expect(hampiExp?.train.departureTime).toBe('21:50');
    expect(hampiExp?.irctcBookingUrl).toContain('irctc.co.in');
  });

  it('3. verifies intermodal journey planning uniting Train -> Station -> Bus -> Monument', () => {
    const plan = InterchangeGraph.planInterchange('Bengaluru', 'Hampi', 'train');
    expect(plan.chainSteps.length).toBe(3);
    expect(plan.chainSteps[0].mode).toBe('train');
    expect(plan.chainSteps[1].mode).toBe('local_transfer');
    expect(plan.chainSteps[2].mode).toBe('walk');
    expect(plan.totalDurationMinutes).toBe(590);
  });

  it('4. verifies local fare estimation with transparent regulatory formulas', () => {
    // 5 km auto ride
    const autoFare = LastMilePlanner.estimateLocalFare(5, 'auto');
    expect(autoFare.min).toBe(75); // ₹30 for first 2km + 3km * 15 = ₹75
    expect(autoFare.calculationFormula).toContain('Karnataka RTO regulated meter rate');

    // 10 km bus ride
    const busFare = LastMilePlanner.estimateLocalFare(10, 'bus');
    expect(busFare.min).toBe(15);
    expect(busFare.calculationFormula).toContain('Shakti Scheme');
  });
});
