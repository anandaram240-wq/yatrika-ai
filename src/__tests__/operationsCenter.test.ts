/**
 * @file src/__tests__/operationsCenter.test.ts
 * @description Unit tests for YatriKa AI V4 Live Operations Center.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { YatrikaOperationsCenter } from '../operations/operationsCenter';
import { DataFreshnessMonitor } from '../operations/dataFreshnessMonitor';
import { ServiceHealthMonitor } from '../operations/serviceHealth';
import { IncidentManager } from '../operations/incidentManager';
import { RecoveryCoordinator } from '../operations/recoveryCoordinator';

describe('YatrikaOperationsCenter (Phase 1)', () => {
  let opsCenter: YatrikaOperationsCenter;

  beforeEach(() => {
    opsCenter = YatrikaOperationsCenter.getInstance();
  });

  it('initializes with all registered services and healthy baseline status', () => {
    const overview = opsCenter.getOverview();
    expect(overview.services.length).toBeGreaterThanOrEqual(7);
    expect(overview.services.every((s) => !s.circuitBreakerOpen)).toBe(true);
    expect(overview.services.map((s) => s.serviceId)).toContain('weather_api');
    expect(overview.services.map((s) => s.serviceId)).toContain('poi_registry');
  });

  it('tracks data freshness and detects stale or expired datasets', () => {
    const monitor = new DataFreshnessMonitor();
    const freshReport = monitor.checkFreshness('weather');
    expect(freshReport.isStale).toBe(false);
    expect(freshReport.recommendation).toBe('FRESH');

    // Simulate 45 mins old weather data (TTL is 30m)
    monitor.setSimulatedAge('weather', 45);
    const staleReport = monitor.checkFreshness('weather');
    expect(staleReport.isStale).toBe(true);
    expect(staleReport.recommendation).toBe('REFRESH_SOON');

    // Simulate 180 mins old weather data (critical TTL is 120m)
    monitor.setSimulatedAge('weather', 180);
    const expiredReport = monitor.checkFreshness('weather');
    expect(expiredReport.isExpired).toBe(true);
    expect(expiredReport.recommendation).toBe('FORCE_REFRESH');
  });

  it('strictly separates operational software warnings from physical road hazards', () => {
    const manager = new IncidentManager();

    // 1. Report an API timeout (operational)
    manager.createIncident({
      severity: 'WARNING',
      domain: 'OPERATIONAL_SOFTWARE',
      serviceId: 'weather_api',
      title: 'Open-Meteo Gateway Timeout 504',
      titleKannada: 'ಹವಾಮಾನ ಎಪಿಐ ಸಂಪರ್ಕ ವಿಳಂಬ',
      description: 'Request timed out after 3000ms. Fallback to climate model cache.',
      sourceAuthority: 'Telemetry System',
    });

    // 2. Report a real road hazard
    manager.createIncident({
      severity: 'CRITICAL',
      domain: 'PHYSICAL_TRAVEL_HAZARD',
      title: 'Shiradi Ghat NH-75 Single Lane Movement near Donigal',
      titleKannada: 'ದೋಣಿಗಲ್ ಬಳಿ ಶಿರಾಡಿ ಘಾಟ್ ಏಕಮುಖ ಸಂಚಾರ',
      description: 'Mudslip cleared; heavy vehicles restricted. Drive cautiously.',
      sourceAuthority: 'Karnataka PWD NH-Division Hassan',
    });

    expect(manager.getOperationalWarnings()).toHaveLength(1);
    expect(manager.getPhysicalTravelHazards()).toHaveLength(1);
    expect(manager.verifyDomainSeparation()).toBe(true);

    const hazards = manager.getPhysicalTravelHazards();
    expect(hazards[0].sourceAuthority).toBe('Karnataka PWD NH-Division Hassan');
  });

  it('executes retry with exponential backoff and trips circuit breaker after 3 failures', async () => {
    const health = new ServiceHealthMonitor();
    const recovery = new RecoveryCoordinator(health);

    let attempts = 0;
    const failingOp = async () => {
      attempts++;
      throw new Error('Connection refused');
    };

    const fallback = () => 'OFFLINE_CACHED_PAYLOAD';

    const result = await recovery.executeWithRecovery(
      'weather_api',
      'req-weather-test-1',
      failingOp,
      fallback,
      { maxRetries: 2, initialDelayMs: 10, backoffFactor: 1.5, timeoutMs: 100 }
    );

    expect(result.source).toBe('FALLBACK');
    expect(result.data).toBe('OFFLINE_CACHED_PAYLOAD');
    expect(attempts).toBe(3); // 1 initial + 2 retries
    expect(health.isCircuitOpen('weather_api')).toBe(true);

    // Immediate fallback when circuit is open
    const fastFallback = await recovery.executeWithRecovery(
      'weather_api',
      'req-weather-test-2',
      failingOp,
      fallback
    );
    expect(fastFallback.source).toBe('FALLBACK');
    expect(fastFallback.attempts).toBe(0); // Not executed because circuit is open
  });
});
