/**
 * src/features/offline-travel/storage/offlineStorageRepository.ts
 * Robust, production-grade IndexedDB persistence repository for Offline Trip Survival Packs.
 * Includes in-memory fallback for headless test runners and private browsing modes.
 */

import { OfflineTripPack, StorageQuotaInfo } from '../domain/types';

const DB_NAME = 'yatrika_offline_survival_db';
const STORE_NAME = 'trip_packs';
const DB_VERSION = 1;

export class OfflineStorageRepository {
  private inMemoryStore = new Map<string, OfflineTripPack>();
  private dbPromise: Promise<IDBDatabase | null> | null = null;

  constructor() {
    this.dbPromise = this.initDB();
  }

  private async initDB(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return null;
    }

    return new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event: any) => {
          const db = event.target.result as IDBDatabase;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        };

        request.onsuccess = (event: any) => {
          resolve(event.target.result as IDBDatabase);
        };

        request.onerror = () => {
          resolve(null);
        };
      } catch {
        resolve(null);
      }
    });
  }

  public async saveTripPack(pack: OfflineTripPack): Promise<boolean> {
    // Save to in-memory store
    this.inMemoryStore.set(pack.id, pack);

    const db = await this.dbPromise;
    if (!db) return true; // Gracefully handled via memory fallback

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(pack);

        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }

  public async getTripPack(id: string): Promise<OfflineTripPack | null> {
    if (this.inMemoryStore.has(id)) {
      return this.inMemoryStore.get(id) || null;
    }

    const db = await this.dbPromise;
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);

        req.onsuccess = () => resolve((req.result as OfflineTripPack) || null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  public async listTripPacks(): Promise<OfflineTripPack[]> {
    const db = await this.dbPromise;
    if (!db) {
      return Array.from(this.inMemoryStore.values());
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();

        req.onsuccess = () => {
          const idbResults = (req.result as OfflineTripPack[]) || [];
          if (idbResults.length === 0 && this.inMemoryStore.size > 0) {
            resolve(Array.from(this.inMemoryStore.values()));
          } else {
            resolve(idbResults);
          }
        };
        req.onerror = () => resolve(Array.from(this.inMemoryStore.values()));
      } catch {
        resolve(Array.from(this.inMemoryStore.values()));
      }
    });
  }

  public async deleteTripPack(id: string): Promise<boolean> {
    this.inMemoryStore.delete(id);

    const db = await this.dbPromise;
    if (!db) return true;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);

        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }

  public async estimateStorageQuota(): Promise<StorageQuotaInfo> {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
      try {
        const est = await navigator.storage.estimate();
        const used = est.usage || 0;
        const quota = est.quota || 1024 * 1024 * 100; // 100MB fallback
        return {
          usedBytes: used,
          quotaBytes: quota,
          percentageUsed: Math.min(100, Math.round((used / quota) * 100)),
        };
      } catch {
        // Fallback
      }
    }

    return {
      usedBytes: 1024 * 64, // 64 KB nominal
      quotaBytes: 1024 * 1024 * 50,
      percentageUsed: 0.1,
    };
  }
}

export const offlineStorage = new OfflineStorageRepository();
