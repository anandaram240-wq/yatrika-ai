import { describe, expect, it } from 'vitest';
import { KarnatakaNetworkGraph } from '../geo/karnatakaNetworkGraph';
import { RoadSegmentAnalyzer } from '../geo/roadSegmentAnalyzer';
import { TerrainIntelligence, WESTERN_GHATS_PASS_REGISTRY } from '../geo/terrainIntelligence';
import { RouteReliability } from '../geo/routeReliability';

describe('Phase 3: Geospatial Digital Twin & Western Ghats Intelligence', () => {
  it('1. Models Karnataka road graph and finds alternative Ghat passes', () => {
    const graph = new KarnatakaNetworkGraph();
    const blr = graph.getNode('node-bengaluru');
    expect(blr).toBeDefined();
    expect(blr?.district).toBe('Bengaluru Urban');

    const passes = graph.findAlternativeGhatPasses('node-bengaluru', 'node-mangaluru');
    expect(passes.length).toBeGreaterThanOrEqual(3);

    const passNames = passes.map((p) => p.passName);
    expect(passNames).toContain('Shiradi Ghat');
    expect(passNames).toContain('Charmadi Ghat');
    expect(passNames).toContain('Sampaje Ghat');
  });

  it('2. Evaluates segment curvature, calculates winding factor, and assigns speed penalties', () => {
    // Simulated straight expressway segment (Kunigal -> Hassan)
    const straightCoords: [number, number][] = [
      [77.0256, 13.0232],
      [76.5640, 13.0132],
      [76.1025, 13.0033],
    ];
    const plainAnalysis = RoadSegmentAnalyzer.analyzeSegmentGeometry(straightCoords, 85);
    expect(plainAnalysis.windingFactor).toBeLessThanOrEqual(1.15);
    expect(plainAnalysis.terrainType).toBe('expressway_plain');
    expect(plainAnalysis.effectiveSpeedKmH).toBeGreaterThanOrEqual(60);

    // Simulated winding Ghat pass with sharp hairpin angles (Agumbe style zig-zag)
    const ghatCoords: [number, number][] = [
      [75.0934, 13.5074],
      [75.1050, 13.5100],
      [75.0920, 13.5120], // zig
      [75.1040, 13.5140], // zag
      [75.0910, 13.5160], // zig
      [75.1030, 13.5180], // zag
      [75.0900, 13.5200], // zig
      [75.1020, 13.5220], // zag
      [75.0900, 13.5250],
      [75.0200, 13.5300],
    ];
    const ghatAnalysis = RoadSegmentAnalyzer.analyzeSegmentGeometry(ghatCoords, 80);
    expect(ghatAnalysis.windingFactor).toBeGreaterThan(1.20);
    expect(ghatAnalysis.estimatedHairpinCount).toBeGreaterThanOrEqual(4);
    expect(ghatAnalysis.effectiveSpeedKmH).toBeLessThanOrEqual(45);
  });

  it('3. Strictly separates heavy rainfall from confirmed road closure', () => {
    // 25 mm/h rain without closure notice: NOT closed, but flagged as HEAVY_RAINFALL
    const rainOnly = TerrainIntelligence.classifyGhatCondition({
      precipitationMmPerHour: 25.0,
      windSpeedKmh: 20.0,
      hasOfficialClosureNotice: false,
      hasOfficialLandslideNotice: false,
    });
    expect(rainOnly.classification).toBe('HEAVY_RAINFALL');
    expect(rainOnly.requiresDetour).toBe(false); // Rain alone is NOT proof of closure
    expect(rainOnly.evidenceProofNote).toContain('Not proof of physical blockage');

    // Official administrative closure notice: CONFIRMED_ROAD_CLOSURE
    const officialClosure = TerrainIntelligence.classifyGhatCondition({
      precipitationMmPerHour: 2.0,
      windSpeedKmh: 10.0,
      hasOfficialClosureNotice: true,
    });
    expect(officialClosure.classification).toBe('CONFIRMED_ROAD_CLOSURE');
    expect(officialClosure.requiresDetour).toBe(true);

    // Stale report: UNKNOWN_ROAD_CONDITION
    const staleReport = TerrainIntelligence.classifyGhatCondition({
      precipitationMmPerHour: 0.0,
      windSpeedKmh: 10.0,
      lastSensorReportAgeMinutes: 240, // 4 hours old
    });
    expect(staleReport.classification).toBe('UNKNOWN_ROAD_CONDITION');
    expect(staleReport.advisoryText).toContain('stale');
  });

  it('4. Asserts comprehensive knowledge for all 5 major Western Ghat passes', () => {
    const passes = ['Shiradi', 'Charmadi', 'Agumbe', 'Bisle', 'Sampaje'];
    passes.forEach((p) => {
      const info = WESTERN_GHATS_PASS_REGISTRY[p];
      expect(info).toBeDefined();
      expect(info.hairpinCount).toBeGreaterThan(0);
      expect(info.safeBypassAlternatives.length).toBeGreaterThan(0);
    });
  });

  it('5. Computes route reliability score and ETA uncertainty interval', () => {
    const analysis = RouteReliability.evaluateRoute({
      nominalDriveMinutes: 240,
      windingFactor: 1.45,
      precipitationMm: 18.0,
      isGhatPass: true,
      dataAgeMinutes: 10,
    });

    expect(analysis.reliabilityScore).toBeLessThan(75);
    expect(analysis.reliabilityGrade).toMatch(/C_MODERATE|D_VOLATILE/);
    expect(analysis.uncertaintyRangeMinutes[1]).toBeGreaterThan(240); // max bound > nominal
    expect(analysis.potentialBottlenecks.length).toBeGreaterThan(0);
  });
});
