/**
 * @file src/offline/cachePlanner.ts
 * @description Storage quota estimation, offline cache pruning, and compression planning.
 * @theme Code. Create. Celebrate Kannada.
 */

export const YATRIKA_OFFLINE_CACHE_VERSION = 'YATRIKA_CACHE_V3.1_2026';

export interface StorageBudgetPlan {
  estimatedPayloadBytes: number;
  estimatedPayloadKb: number;
  availableStorageMb: number;
  isWithinQuota: boolean;
  cacheKey: string;
  itemsIncludedCount: number;
}

export class CachePlanner {
  /**
   * Evaluates if the current itinerary data fits comfortably within browser storage limits.
   */
  public static calculateStoragePlan(params: {
    itineraryId: string;
    stopCount: number;
    routeCoordinatesCount: number;
    hasElevationData: boolean;
  }): StorageBudgetPlan {
    const { itineraryId, stopCount, routeCoordinatesCount, hasElevationData } = params;

    // Estimate byte sizes:
    // ~1.5 KB per POI metadata
    // ~24 bytes per [lng, lat] coordinate point
    // ~12 KB for baseline emergency directory & phrases
    const poiBytes = stopCount * 1536;
    const coordBytes = routeCoordinatesCount * 24;
    const elevationBytes = hasElevationData ? 8192 : 0;
    const emergencyBytes = 12288;

    const totalBytes = poiBytes + coordBytes + elevationBytes + emergencyBytes;
    const totalKb = Math.round(totalBytes / 1024);

    // Browser IndexedDB allows at least 50 MB on mobile without user prompt
    const safeMobileQuotaMb = 50;
    const isWithinQuota = totalBytes < safeMobileQuotaMb * 1024 * 1024;

    return {
      estimatedPayloadBytes: totalBytes,
      estimatedPayloadKb: totalKb,
      availableStorageMb: safeMobileQuotaMb,
      isWithinQuota,
      cacheKey: `${YATRIKA_OFFLINE_CACHE_VERSION}::${itineraryId}`,
      itemsIncludedCount: stopCount + 1,
    };
  }
}
