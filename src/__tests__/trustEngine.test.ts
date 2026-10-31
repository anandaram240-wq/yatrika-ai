import { describe, expect, it } from 'vitest';
import { getSourceMetadata } from '../intelligence/sourceRegistry';
import { wrapWithProvenance, checkProvenanceFreshness } from '../intelligence/dataProvenance';
import { evaluateMultidimensionalConfidence } from '../intelligence/confidenceScoring';
import { TrustEngine } from '../intelligence/trustEngine';

describe('Phase 1: YatriKa Trust Intelligence Engine', () => {
  it('1. Provides complete source metadata for official and open data sources', () => {
    const openMeteo = getSourceMetadata('src-open-meteo');
    expect(openMeteo.reliabilityClass).toBe('open_scientific_api');
    expect(openMeteo.defaultValidityMinutes).toBe(30);

    const pwd = getSourceMetadata('src-karnataka-pwd');
    expect(pwd.reliabilityClass).toBe('official_government');

    const unknown = getSourceMetadata('src-non-existent');
    expect(unknown.reliabilityClass).toBe('inferred_model');
  });

  it('2. Wraps external data with strict provenance and accurately tracks staleness', () => {
    const pastDate = new Date(Date.now() - 45 * 60 * 1000).toISOString(); // 45m ago
    const record = wrapWithProvenance({ tempC: 22 }, 'src-open-meteo', 'district:Kodagu', {
      customRetrievedAt: pastDate,
      overrideValidityMinutes: 30,
    });

    expect(record.isStale).toBe(true);
    expect(record.stalenessReason).toContain('passed validity threshold');

    const freshness = checkProvenanceFreshness(record);
    expect(freshness.isFresh).toBe(false);
    expect(freshness.ageMinutes).toBeGreaterThanOrEqual(44);
  });

  it('3. Evaluates multidimensional confidence without combining tiers into a single percentage', () => {
    const verifiedConf = evaluateMultidimensionalConfidence({
      tier: 'verified',
      retrievedAt: new Date().toISOString(),
      validityMinutes: 1440,
    });
    expect(verifiedConf.evidenceTier).toBe('verified');
    expect(verifiedConf.evidenceWeight).toBe(1.0);
    expect(verifiedConf.requiresTravelerConfirmation).toBe(false);

    const inferredConf = evaluateMultidimensionalConfidence({
      tier: 'inferred',
      retrievedAt: new Date().toISOString(),
      validityMinutes: 60,
      unresolvedTokensCount: 2,
    });
    expect(inferredConf.evidenceTier).toBe('inferred');
    expect(inferredConf.requiresTravelerConfirmation).toBe(true);
    expect(inferredConf.humanReadableRationale).toContain('verify before proceeding');
  });

  it('4. Produces explainable trust decisions for route choices and ghat detours', () => {
    const routeExplanation = TrustEngine.explainRouteRecommendation({
      corridorName: 'NH-75 Hassan-Sakleshpur Corridor',
      roadNumber: 'NH-75',
      distanceKm: 220,
      estimatedMinutes: 240,
      weatherPrecipitationMm: 18.5,
      hasActiveGhatWarning: true,
      roadSourceId: 'src-nhai-karnataka',
      weatherSourceId: 'src-open-meteo',
    });

    expect(routeExplanation.recommendationType).toBe('route_choice');
    expect(routeExplanation.warningFlags.length).toBeGreaterThan(0);
    expect(routeExplanation.provenanceTrail.length).toBe(2);
    expect(routeExplanation.actionableAdvice).toContain('winding ghat turns');

    const detourExplanation = TrustEngine.explainGhatDetour({
      primaryCorridor: 'Shiradi Ghat NH-75',
      suggestedDetourCorridor: 'Sampaje Ghat NH-275',
      hazardReason: 'Reported landslide clearance between Maranahalli and Gundya',
      isOfficialClosure: true,
      etaDeltaMinutes: 45,
      distanceDeltaKm: 38,
      reportingSourceId: 'src-karnataka-pwd',
    });

    expect(detourExplanation.confidence.evidenceTier).toBe('officially_published');
    expect(detourExplanation.summaryExplanation).toContain('reported closed by Public Works Department');
  });
});
