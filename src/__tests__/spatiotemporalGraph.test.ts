/**
 * @file src/__tests__/spatiotemporalGraph.test.ts
 * @description Unit tests for Spatiotemporal Travel Network & Western Ghats Pass Uncertainty.
 */

import { describe, it, expect } from 'vitest';
import { SpatiotemporalGraph } from '../geo/spatiotemporalGraph';
import { GeoUncertaintyClassifier, GhatHazardEvidence } from '../geo/geoUncertainty';
import { RouteTemporalAnalyzer } from '../geo/routeTemporalAnalyzer';
import { GHAT_CORRIDOR_HISTORIES } from '../geo/roadConditionHistory';

describe('Spatiotemporal Travel Intelligence (Phase 4)', () => {
  it('retrieves historical profiles for all 5 primary Western Ghats passes', () => {
    expect(GHAT_CORRIDOR_HISTORIES.shiradi.highwayCode).toBe('NH-75');
    expect(GHAT_CORRIDOR_HISTORIES.charmadi.highwayCode).toBe('NH-73');
    expect(GHAT_CORRIDOR_HISTORIES.agumbe.highwayCode).toBe('NH-169A');
    expect(GHAT_CORRIDOR_HISTORIES.bisle.passId).toBe('ghat-bisle');
    expect(GHAT_CORRIDOR_HISTORIES.sampaje.highwayCode).toBe('NH-275');

    expect(GHAT_CORRIDOR_HISTORIES.agumbe.hairpinBendsCount).toBe(14);
    expect(GHAT_CORRIDOR_HISTORIES.charmadi.hairpinBendsCount).toBe(11);
  });

  it('evaluates pass status and strictly refuses to mark road closed from rain alone', () => {
    const rainOnlyEvidence: GhatHazardEvidence = {
      passName: 'Shiradi',
      highwayCode: 'NH-75',
      historicalRainfallPattern: { annualMonsoonMm: 3800, highestRiskMonths: [6, 7, 8] },
      currentPrecipitationMm: 55, // Heavy torrential rain
      forecastPrecipitationMm: 80,
      confidence: 'WEATHER_INFERRED_RISK',
    };

    const status = GeoUncertaintyClassifier.evaluatePassStatus(rainOnlyEvidence);
    // Road remains OPEN with caution advisory! Never falsely marked closed!
    expect(status.isPassPhysicallyOpen).toBe(true);
    expect(status.travelRecommendation).toBe('PROCEED_WITH_CAUTION');
    expect(status.explanationEnglish).toContain('Pass is OPEN with Weather Advisory');
  });

  it('marks road closed when official PWD restriction or verified landslide occurs', () => {
    const officialClosureEvidence: GhatHazardEvidence = {
      passName: 'Shiradi',
      highwayCode: 'NH-75',
      historicalRainfallPattern: { annualMonsoonMm: 3800, highestRiskMonths: [6, 7, 8] },
      currentPrecipitationMm: 20,
      forecastPrecipitationMm: 30,
      officialPwdAdvisory: {
        issuingAuthority: 'Karnataka PWD Hassan Division',
        bulletinNumber: 'PWD-HAS-2026-081',
        restrictionType: 'FULLY_CLOSED',
        effectiveUntil: '2026-10-31T18:00:00Z',
      },
      confidence: 'CONFIRMED_OFFICIAL',
    };

    const status = GeoUncertaintyClassifier.evaluatePassStatus(officialClosureEvidence);
    expect(status.isPassPhysicallyOpen).toBe(false);
    expect(status.travelRecommendation).toBe('DO_NOT_TRAVEL');
    expect(status.explanationEnglish).toContain('Confirmed Official Closure');
    expect(status.explanationKannada).toContain('ಅಧಿಕೃತ ಆದೇಶ');
  });

  it('routes via Shiradi normally when open, but autonomously reroutes via Charmadi when Shiradi is officially closed', () => {
    const graph = new SpatiotemporalGraph();

    // 1. Normal route from Bengaluru to Mangaluru
    const normal = graph.findOptimalPath('Bengaluru', 'Mangaluru', 6);
    expect(normal).not.toBeNull();
    expect(normal!.path).toContain('Sakleshpur');
    expect(normal!.path).toContain('Gundya');
    expect(normal!.viaGhats).toContain('shiradi');

    // 2. Shiradi is officially closed by PWD
    graph.updateGhatStatus('shiradi', {
      passName: 'Shiradi',
      highwayCode: 'NH-75',
      historicalRainfallPattern: { annualMonsoonMm: 3800, highestRiskMonths: [6, 7, 8] },
      currentPrecipitationMm: 10,
      forecastPrecipitationMm: 15,
      officialPwdAdvisory: {
        issuingAuthority: 'Karnataka PWD Hassan Division',
        bulletinNumber: 'PWD-HAS-CLOSURE',
        restrictionType: 'FULLY_CLOSED',
        effectiveUntil: 'Tomorrow',
      },
      confidence: 'CONFIRMED_OFFICIAL',
    });

    // 3. System autonomously finds alternative route via Belur -> Chikkamagaluru -> Mudigere -> Charmadi
    const diverted = graph.findOptimalPath('Bengaluru', 'Mangaluru', 6);
    expect(diverted).not.toBeNull();
    expect(diverted!.path).not.toContain('Gundya');
    expect(diverted!.path).toContain('Mudigere');
    expect(diverted!.path).toContain('Belthangady');
    expect(diverted!.viaGhats).toContain('charmadi');
  });

  it('increases transit risk multiplier and slows speed during night ghat crossings', () => {
    // Departure at 17:00 (5 PM) reaches Shiradi at ~20:00 (Night fog window)
    const nightTransit = RouteTemporalAnalyzer.analyzeCorridorTransit('shiradi', 17, 3.0, true);
    expect(nightTransit.isNightGhatTransit).toBe(true);
    expect(nightTransit.transitRiskMultiplier).toBeGreaterThan(1.5);
    expect(nightTransit.speedRecommendationKmh).toBeLessThan(25);
    expect(nightTransit.safetyAdvisoryEnglish).toContain('Night ghat transit');
  });
});
