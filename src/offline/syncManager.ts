/**
 * @file src/offline/syncManager.ts
 * @description Network state synchronization, pending offline queue, and conflict resolution.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface PendingSyncItem {
  id: string;
  action: 'UPDATE_ITINERARY' | 'RECORD_LOG' | 'SAVE_PREFERENCE';
  payload: Record<string, unknown>;
  enqueuedAt: string;
}

export class SyncManager {
  private isOnlineStatus: boolean;
  private pendingQueue: PendingSyncItem[] = [];
  private syncListeners: Array<(isOnline: boolean) => void> = [];

  constructor() {
    this.isOnlineStatus = typeof navigator !== 'undefined' ? navigator.onLine : true;
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange(true));
      window.addEventListener('offline', () => this.handleNetworkChange(false));
    }
  }

  public isOnline(): boolean {
    return this.isOnlineStatus;
  }

  public subscribe(listener: (isOnline: boolean) => void): () => void {
    this.syncListeners.push(listener);
    return () => {
      this.syncListeners = this.syncListeners.filter((l) => l !== listener);
    };
  }

  public enqueueOfflineAction(action: PendingSyncItem['action'], payload: Record<string, unknown>) {
    this.pendingQueue.push({
      id: `sync-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      payload,
      enqueuedAt: new Date().toISOString(),
    });
  }

  public getPendingQueue(): PendingSyncItem[] {
    return [...this.pendingQueue];
  }

  public clearQueue() {
    this.pendingQueue = [];
  }

  private handleNetworkChange(isOnline: boolean) {
    this.isOnlineStatus = isOnline;
    this.syncListeners.forEach((l) => l(isOnline));
  }
}
