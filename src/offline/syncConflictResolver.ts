/**
 * @file src/offline/syncConflictResolver.ts
 * @description Conflict detection and version resolution for offline-to-online state synchronization.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface SyncRecord<T = unknown> {
  id: string;
  version: number;
  updatedAtMs: number;
  data: T;
  clientDeviceId: string;
}

export class SyncConflictResolver {
  public static resolve<T>(
    localRecord: SyncRecord<T>,
    remoteRecord: SyncRecord<T>
  ): { resolvedRecord: SyncRecord<T>; conflictDetected: boolean; strategyApplied: 'LOCAL_WINS' | 'REMOTE_WINS' | 'IDENTICAL' } {
    if (localRecord.version === remoteRecord.version && localRecord.updatedAtMs === remoteRecord.updatedAtMs) {
      return { resolvedRecord: localRecord, conflictDetected: false, strategyApplied: 'IDENTICAL' };
    }

    // Version number comparison
    if (localRecord.version > remoteRecord.version) {
      return { resolvedRecord: localRecord, conflictDetected: true, strategyApplied: 'LOCAL_WINS' };
    }
    if (remoteRecord.version > localRecord.version) {
      return { resolvedRecord: remoteRecord, conflictDetected: true, strategyApplied: 'REMOTE_WINS' };
    }

    // Timestamp tie-breaker (last write wins)
    if (localRecord.updatedAtMs >= remoteRecord.updatedAtMs) {
      return { resolvedRecord: localRecord, conflictDetected: true, strategyApplied: 'LOCAL_WINS' };
    }
    return { resolvedRecord: remoteRecord, conflictDetected: true, strategyApplied: 'REMOTE_WINS' };
  }
}
