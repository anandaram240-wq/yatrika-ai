/**
 * @file src/__tests__/paretoOptimizer.test.ts
 * @description Unit tests for Explainable Pareto Multi-Objective Journey Optimization (Phase 14).
 */

import { describe, it, expect } from 'vitest';
import { ParetoTravelOptimizer } from '../research/paretoOptimizer';

describe('Pareto Multi-Objective Decision Engine (Phase 14)', () => {
  it('generates 4 distinct non-dominated alternatives with transparent trade-offs', () => {
    const alternatives = ParetoTravelOptimizer.generateParetoAlternatives({
      origin: 'Bengaluru',
      destination: 'Chikkamagaluru',
      baseDurationMinutes: 300,
      baseCostInr: 1200,
      isShaktiEligibleUser: true,
      weatherRiskLevel: 'HIGH',
    });

    expect(alternatives).toHaveLength(4);

    const fastest = alternatives.find((a) => a.optionKey === 'FASTEST_ROUTE')!;
    const cheapShakti = alternatives.find((a) => a.optionKey === 'LOWEST_COST_SHAKTI')!;
    const heritage = alternatives.find((a) => a.optionKey === 'MAX_HERITAGE')!;
    const lowRisk = alternatives.find((a) => a.optionKey === 'LOWEST_DISRUPTION_RISK')!;

    // 1. Fastest option has strictly minimum duration
    expect(fastest.objectives.durationMinutes).toBeLessThan(cheapShakti.objectives.durationMinutes);
    expect(fastest.objectives.durationMinutes).toBeLessThan(heritage.objectives.durationMinutes);

    // 2. Shakti option has zero ticket cost for eligible female traveler
    expect(cheapShakti.objectives.travelCostInr).toBe(0);

    // 3. Heritage option has maximum heritage/culture score
    expect(heritage.objectives.heritageCultureScore).toBeGreaterThanOrEqual(95);

    // 4. Low risk option has lowest disruption score
    expect(lowRisk.objectives.disruptionRiskScore).toBeLessThanOrEqual(15);

    // 5. All alternatives provide bilingual explainable trade-offs
    alternatives.forEach((alt) => {
      expect(alt.tradeOffSummaryEnglish.length).toBeGreaterThan(10);
      expect(alt.tradeOffSummaryKannada.length).toBeGreaterThan(10);
      expect(alt.badgeTitleKannada.length).toBeGreaterThan(3);
    });
  });
});
