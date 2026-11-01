/**
 * @file src/__tests__/performanceAndCost.test.ts
 * @description Unit tests for Performance, Bundle Audit & Runtime Cost Optimization (Phase 10).
 */

import { describe, it, expect } from 'vitest';
import { BundleAnalyzer } from '../performance/bundleAnalyzer';
import { RuntimeProfiler } from '../performance/runtimeProfiler';
import { NetworkEfficiencyTracker } from '../performance/networkEfficiency';

describe('Performance & Cost Optimization (Phase 10)', () => {
  it('audits production bundle breakdown against 650 KB gzip budget', () => {
    const report = BundleAnalyzer.auditPerformanceBudget(650);

    expect(report.totalUncompressedKb).toBeCloseTo(1985.98, 0);
    expect(report.totalGzipKb).toBeCloseTo(566.85, 0);
    expect(report.isWithinBudget).toBe(true);

    // MapLibre is the largest chunk (~46%)
    const mapChunk = report.chunks.find((c) => c.category === 'MAP_ENGINE');
    expect(mapChunk).toBeDefined();
    expect(mapChunk?.percentageOfBundle).toBeGreaterThan(40);
  });

  it('verifies 60 FPS frame time budget (< 16.67ms per frame) for MapLibre rendering', () => {
    // 60 FPS requires frame execution <= 16.67ms
    expect(RuntimeProfiler.verify60FpsBudget(8.4)).toBe(true); // 120 FPS capable
    expect(RuntimeProfiler.verify60FpsBudget(16.0)).toBe(true); // 60 FPS capable
    expect(RuntimeProfiler.verify60FpsBudget(22.5)).toBe(false); // Dropped frame (44 FPS)

    const op = RuntimeProfiler.profileOperation('KANNADA_MORPHOLOGY_NLP', 20, () => {
      // Simulate regex parsing
      const tokens = 'ಬೆಂಗಳೂರಿನಿಂದ ಮೈಸೂರಿಗೆ ಹೋಗುವ ಮಾರ್ಗ'.split(' ');
      return tokens.map((t) => t.length);
    });

    expect(op.profile.isWithinBudget).toBe(true);
    expect(op.profile.measuredDurationMs).toBeLessThan(10);
  });

  it('tracks cache hit ratios and deduplication efficiency for network calls', () => {
    const tracker = new NetworkEfficiencyTracker();

    tracker.recordRequest(false, false); // Network hit
    tracker.recordRequest(true, false); // Cache hit
    tracker.recordRequest(true, false); // Cache hit
    tracker.recordRequest(false, true); // Deduplicated in-flight call

    const summary = tracker.getSummary();
    expect(summary.totalRequests).toBe(4);
    expect(summary.cacheHits).toBe(2);
    expect(summary.deduplicatedRequests).toBe(1);
    expect(summary.networkCallsAvoided).toBe(3);
    expect(summary.cacheHitRatioPercent).toBe(50);
  });
});
