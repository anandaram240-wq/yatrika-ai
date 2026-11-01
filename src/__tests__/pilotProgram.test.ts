/**
 * @file src/__tests__/pilotProgram.test.ts
 * @description Unit tests for Pilot Validation Protocol across 6 Karnataka circuits (Phase 12).
 */

import { describe, it, expect } from 'vitest';
import { PilotValidationProtocol, KARNATAKA_PILOT_CIRCUITS } from '../pilot/pilotValidationProtocol';

describe('Independent Pilot Program (Phase 12)', () => {
  it('covers all 6 required Karnataka travel circuits with structured field logs', () => {
    expect(KARNATAKA_PILOT_CIRCUITS).toHaveLength(6);

    const circuitIds = KARNATAKA_PILOT_CIRCUITS.map((c) => c.circuitId);
    expect(circuitIds).toContain('circuit-01-blr-ckm');
    expect(circuitIds).toContain('circuit-02-has-bel-hal');
    expect(circuitIds).toContain('circuit-03-blr-hampi');
    expect(circuitIds).toContain('circuit-04-mys-coorg');
    expect(circuitIds).toContain('circuit-05-hub-bad-pat');
    expect(circuitIds).toContain('circuit-06-mng-udp');
  });

  it('records planned distance, estimated duration, and observed duration for each route', () => {
    KARNATAKA_PILOT_CIRCUITS.forEach((circuit) => {
      expect(circuit.plannedDistanceKm).toBeGreaterThan(0);
      expect(circuit.estimatedTravelTimeMinutes).toBeGreaterThan(0);
      expect(circuit.observedTravelTimeMinutes).toBeGreaterThan(0);
      expect(circuit.destinationAccuracyScore).toBeGreaterThanOrEqual(95);
      expect(circuit.itineraryFeasibilityScore).toBeGreaterThanOrEqual(90);
      expect(circuit.offlineUsabilityVerified).toBe(true);
      expect(circuit.userFeedbackKannada.length).toBeGreaterThan(5);
      expect(circuit.userFeedbackEnglish.length).toBeGreaterThan(5);
    });
  });

  it('computes overall pilot summary with high destination accuracy and feasibility', () => {
    const summary = PilotValidationProtocol.getOverallPilotSummary();
    expect(summary.totalCircuitsAudited).toBe(6);
    expect(summary.averageDestinationAccuracyPercent).toBeGreaterThanOrEqual(95);
    expect(summary.averageFeasibilityScorePercent).toBeGreaterThanOrEqual(92);
    expect(summary.offlineVerifiedCircuitsPercent).toBe(100);
  });
});
