/**
 * @file src/__tests__/releaseGovernance.test.ts
 * @description Unit tests for Release Readiness, Feature Flags, and Rollback Procedures (Phase 13).
 */

import { describe, it, expect } from 'vitest';
import { ReleaseReadinessEvaluator } from '../release/releaseReadiness';
import { FeatureFlagController } from '../release/featureFlags';
import { EnvironmentValidator } from '../release/environmentValidation';
import { YATRIKA_ROLLBACK_PROCEDURES } from '../release/rollbackPlan';

describe('Production Deployment & Release Governance (Phase 13)', () => {
  it('passes all 14 engineering gates in final release readiness audit', () => {
    const report = ReleaseReadinessEvaluator.evaluateAllGates();

    expect(report.totalGates).toBe(14);
    expect(report.passedGates).toBe(14);
    expect(report.isReleaseReady).toBe(true);

    report.gates.forEach((gate) => {
      expect(gate.passed).toBe(true);
      expect(gate.evidence.length).toBeGreaterThan(10);
    });
  });

  it('manages feature flags with defensive kill-switches', () => {
    expect(FeatureFlagController.isEnabled('enableParetoOptimizer')).toBe(true);

    FeatureFlagController.setFlag('enableParetoOptimizer', false);
    expect(FeatureFlagController.isEnabled('enableParetoOptimizer')).toBe(false);

    // Reset back to true
    FeatureFlagController.setFlag('enableParetoOptimizer', true);
    expect(FeatureFlagController.isEnabled('enableParetoOptimizer')).toBe(true);
  });

  it('validates production environment without secret or localhost exposure', () => {
    const devCheck = EnvironmentValidator.validateEnvironment(false);
    expect(devCheck.isValid).toBe(true);

    const prodCheck = EnvironmentValidator.validateEnvironment(true);
    expect(prodCheck.isValid).toBe(true);
    expect(prodCheck.errors).toHaveLength(0);
  });

  it('provides a 3-step actionable rollback plan with verification steps', () => {
    expect(YATRIKA_ROLLBACK_PROCEDURES).toHaveLength(3);
    expect(YATRIKA_ROLLBACK_PROCEDURES[0].actionTitle).toContain('Feature Flag Kill-Switch');
    expect(YATRIKA_ROLLBACK_PROCEDURES[1].actionTitle).toContain('Offline LocalStorage Cache');
    expect(YATRIKA_ROLLBACK_PROCEDURES[2].actionTitle).toContain('Git Deployment');
  });
});
