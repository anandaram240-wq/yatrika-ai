import { describe, expect, it } from 'vitest';
import { EmergencyCoordinator } from '../offline/emergencyCoordinator';
import { CachePlanner, YATRIKA_OFFLINE_CACHE_VERSION } from '../offline/cachePlanner';
import { OfflineCoordinator } from '../offline/offlineCoordinator';
import { SyncManager } from '../offline/syncManager';

describe('Phase 7: Offline-First Reliability & Emergency Intelligence', () => {
  it('1. Provides verified statutory emergency directory (112, 108, 1077, 1926)', () => {
    const services = EmergencyCoordinator.getOfficialServices();
    expect(services.length).toBe(4);

    const codes = services.map((s) => s.serviceCode);
    expect(codes).toContain('112');  // Police
    expect(codes).toContain('108');  // Ambulance
    expect(codes).toContain('1077'); // DDMA
    expect(codes).toContain('1926'); // Forest Dept Rescue
  });

  it('2. Enforces data minimization in emergency SOS payload (no private keys or unprotected PII)', () => {
    const payload = EmergencyCoordinator.createPrivacySafeSosPayload({
      itineraryId: 'trip-chikkamagaluru-01',
      originHub: 'Bengaluru Majestic',
      currentDestination: 'Mullayanagiri Peak',
      coordinates: [75.72, 13.39],
    });

    expect(payload.itineraryId).toBe('trip-chikkamagaluru-01');
    expect(payload.lastKnownCoordinates).toEqual([75.72, 13.39]);
    expect(payload.emergencyDisclaimer).toContain('verified statutory numbers');

    // SECURITY CHECK: Must not contain sensitive personal fields
    const serialized = JSON.stringify(payload);
    expect(serialized).not.toContain('bloodGroup');
    expect(serialized).not.toContain('privateKey');
    expect(serialized).not.toContain('password');
    expect(serialized).not.toContain('aadhaar');
  });

  it('3. Calculates storage budget plan and enforces quota boundaries', () => {
    const budget = CachePlanner.calculateStoragePlan({
      itineraryId: 'trip-unesco-01',
      stopCount: 5,
      routeCoordinatesCount: 350,
      hasElevationData: true,
    });

    expect(budget.isWithinQuota).toBe(true);
    expect(budget.estimatedPayloadKb).toBeLessThan(100); // lightweight < 100 KB
    expect(budget.cacheKey).toContain(YATRIKA_OFFLINE_CACHE_VERSION);
  });

  it('4. Coordinates offline pack serialization and persistence', () => {
    const coordinator = new OfflineCoordinator();
    const plan = coordinator.evaluateStorage('trip-01', 3, 200);
    expect(plan.isWithinQuota).toBe(true);

    const snapshot = coordinator.saveOfflinePack({
      itineraryId: 'trip-01',
      originHub: 'Mysuru Junction',
      currentDestination: 'Madikeri Fort',
      itineraryData: { stops: ['poi-mysore-palace', 'poi-madikeri-fort'] },
      lastKnownCoordinates: [75.7382, 12.4244],
    });

    expect(snapshot.cacheVersion).toBe(YATRIKA_OFFLINE_CACHE_VERSION);
    expect(snapshot.emergencyPayload.currentDestination).toBe('Madikeri Fort');

    const loaded = coordinator.loadOfflinePack('trip-01');
    expect(loaded).toBeDefined();
    expect(loaded?.itineraryId).toBe('trip-01');
  });

  it('5. SyncManager queues offline actions and manages online recovery', () => {
    const sync = new SyncManager();
    sync.enqueueOfflineAction('UPDATE_ITINERARY', { stopId: 'poi-belur-temple' });
    sync.enqueueOfflineAction('RECORD_LOG', { event: 'checkpoint_reached' });

    expect(sync.getPendingQueue().length).toBe(2);

    sync.clearQueue();
    expect(sync.getPendingQueue().length).toBe(0);
  });
});
