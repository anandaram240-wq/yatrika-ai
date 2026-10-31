/**
 * @file src/offline/offlineCoordinator.ts
 * @description Master coordinator for offline data caching, sync, and emergency protocols.
 * @theme Code. Create. Celebrate Kannada.
 */

import { CachePlanner, StorageBudgetPlan, YATRIKA_OFFLINE_CACHE_VERSION } from './cachePlanner';
import { SyncManager } from './syncManager';
import { EmergencyCoordinator, PrivacyPreservingSosPayload } from './emergencyCoordinator';

export interface OfflinePackSnapshot {
  cacheVersion: string;
  itineraryId: string;
  savedTimestamp: string;
  data: Record<string, unknown>;
  emergencyPayload: PrivacyPreservingSosPayload;
}

export class OfflineCoordinator {
  private syncManager: SyncManager;
  private static memoryStore = new Map<string, OfflinePackSnapshot>();

  constructor() {
    this.syncManager = new SyncManager();
  }

  public getSyncManager(): SyncManager {
    return this.syncManager;
  }

  /**
   * Evaluates storage footprint before saving an offline pack.
   */
  public evaluateStorage(itineraryId: string, stopCount: number, coordCount: number): StorageBudgetPlan {
    return CachePlanner.calculateStoragePlan({
      itineraryId,
      stopCount,
      routeCoordinatesCount: coordCount,
      hasElevationData: true,
    });
  }

  /**
   * Prepares and persists an offline pack snapshot into local storage.
   */
  public saveOfflinePack(params: {
    itineraryId: string;
    originHub: string;
    currentDestination: string;
    itineraryData: Record<string, unknown>;
    lastKnownCoordinates?: [number, number];
  }): OfflinePackSnapshot {
    const sosPayload = EmergencyCoordinator.createPrivacySafeSosPayload({
      itineraryId: params.itineraryId,
      originHub: params.originHub,
      currentDestination: params.currentDestination,
      coordinates: params.lastKnownCoordinates,
    });

    const snapshot: OfflinePackSnapshot = {
      cacheVersion: YATRIKA_OFFLINE_CACHE_VERSION,
      itineraryId: params.itineraryId,
      savedTimestamp: new Date().toISOString(),
      data: params.itineraryData,
      emergencyPayload: sosPayload,
    };

    OfflineCoordinator.memoryStore.set(params.itineraryId, snapshot);

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(`yatrika_offline_${params.itineraryId}`, JSON.stringify(snapshot));
      } catch (e) {
        console.warn('LocalStorage write failed, fallback in-memory', e);
      }
    }

    return snapshot;
  }

  /**
   * Retrieves an existing cached offline pack.
   */
  public loadOfflinePack(itineraryId: string): OfflinePackSnapshot | null {
    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(`yatrika_offline_${itineraryId}`);
        if (raw) return JSON.parse(raw) as OfflinePackSnapshot;
      } catch {
        // Fallback to memoryStore
      }
    }
    return OfflineCoordinator.memoryStore.get(itineraryId) ?? null;
  }
}
