/**
 * @file src/__tests__/offlineReadiness.test.ts
 * @description Unit tests for Operational Offline Intelligence V2 & Readiness Scoring.
 */

import { describe, it, expect } from 'vitest';
import { RoutePackManager, RoutePackPayload } from '../offline/routePackManager';
import { StorageIntegrityManager } from '../offline/storageIntegrity';
import { SyncConflictResolver, SyncRecord } from '../offline/syncConflictResolver';
import { OfflineReadinessCalculator, CachedAssetCheck } from '../offline/offlineReadiness';
import { KARNATAKA_POIS } from '../data/karnatakaTravelRegistry';

describe('Operational Offline Intelligence V2 (Phase 8)', () => {
  it('bundles route packs with cryptographic checksums and detects corruption', () => {
    const packManager = new RoutePackManager();
    const payload: RoutePackPayload = {
      packId: 'pack-shiradi-mangalore-v1',
      circuitName: 'Bengaluru to Mangaluru via Shiradi Ghat',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      routeGeometry: [
        [77.59, 12.97],
        [76.10, 13.00],
        [75.78, 12.89],
        [74.85, 12.91],
      ],
      destinations: KARNATAKA_POIS.slice(0, 5),
      turnByTurnInstructions: ['Exit Bengaluru via Nelamangala', 'Take NH-75 to Sakleshpur', 'Enter Shiradi Ghat'],
      emergencyContacts: [{ agency: 'Hassan District Disaster Control', phone: '1077', district: 'Hassan' }],
      elevationPoints: [{ distanceKm: 0, elevationMeters: 920 }, { distanceKm: 180, elevationMeters: 950 }],
    };

    const envelope = packManager.createRoutePack(payload);
    expect(envelope.checksum).toBeDefined();
    expect(envelope.checksum.length).toBe(8);
    expect(envelope.sizeKb).toBeGreaterThan(0);

    // Retrieve and verify integrity
    const retrieved = packManager.getRoutePack('pack-shiradi-mangalore-v1');
    expect(retrieved?.checksum).toBe(envelope.checksum);

    // Simulated payload corruption
    const tamperedPayload = { ...payload, circuitName: 'TAMPERED_CIRCUIT' };
    const isValid = StorageIntegrityManager.verifyIntegrity(tamperedPayload, envelope.checksum);
    expect(isValid).toBe(false);
  });

  it('strictly refuses to score 100% offline readiness when only app shell is cached', () => {
    // Only app shell cached (e.g. ServiceWorker precache of index.html)
    const shellOnly: CachedAssetCheck = {
      hasAppShellCached: true,
      hasRouteGeometryCached: false,
      hasDestinationMetadataCached: false,
      hasNavigationStepsCached: false,
      hasEmergencyDirectoryCached: false,
      hasElevationProfileCached: false,
      hasDialectPhrasesCached: false,
    };

    const report = OfflineReadinessCalculator.calculateScore(shellOnly);
    expect(report.readinessScore).toBe(10); // Exactly 10%
    expect(report.isReadyForDisconnectedGhatTravel).toBe(false);
    expect(report.missingCrucialAssets).toContain('hasRouteGeometryCached');
    expect(report.missingCrucialAssets).toContain('hasEmergencyDirectoryCached');

    // Fully cached pack
    const fullyCached: CachedAssetCheck = {
      hasAppShellCached: true,
      hasRouteGeometryCached: true,
      hasDestinationMetadataCached: true,
      hasNavigationStepsCached: true,
      hasEmergencyDirectoryCached: true,
      hasElevationProfileCached: true,
      hasDialectPhrasesCached: true,
    };

    const readyReport = OfflineReadinessCalculator.calculateScore(fullyCached);
    expect(readyReport.readinessScore).toBe(100);
    expect(readyReport.isReadyForDisconnectedGhatTravel).toBe(true);
    expect(readyReport.missingCrucialAssets).toHaveLength(0);
  });

  it('resolves offline synchronization conflicts using version vectors and timestamps', () => {
    const localRecord: SyncRecord<{ favoritePois: string[] }> = {
      id: 'rec-user-favs',
      version: 2,
      updatedAtMs: 1000,
      data: { favoritePois: ['poi-hampi', 'poi-belur'] },
      clientDeviceId: 'phone-android-kannada',
    };

    const remoteRecord: SyncRecord<{ favoritePois: string[] }> = {
      id: 'rec-user-favs',
      version: 1,
      updatedAtMs: 500,
      data: { favoritePois: ['poi-hampi'] },
      clientDeviceId: 'laptop-web',
    };

    const res = SyncConflictResolver.resolve(localRecord, remoteRecord);
    expect(res.conflictDetected).toBe(true);
    expect(res.strategyApplied).toBe('LOCAL_WINS');
    expect(res.resolvedRecord.data.favoritePois).toHaveLength(2);
  });
});
