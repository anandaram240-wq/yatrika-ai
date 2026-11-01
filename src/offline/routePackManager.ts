/**
 * @file src/offline/routePackManager.ts
 * @description Bundles, validates, and stores self-contained offline Route Packs for Karnataka circuits.
 * @theme Code. Create. Celebrate Kannada.
 */

import { StorageIntegrityManager } from './storageIntegrity';
import { KarnatakaPOI } from '../types/nammatrip';

export interface RoutePackPayload {
  packId: string;
  circuitName: string;
  version: string;
  createdAt: string;
  routeGeometry: [number, number][];
  destinations: KarnatakaPOI[];
  turnByTurnInstructions: string[];
  emergencyContacts: Array<{ agency: string; phone: string; district: string }>;
  elevationPoints: Array<{ distanceKm: number; elevationMeters: number }>;
}

export interface RoutePackEnvelope {
  checksum: string;
  sizeKb: number;
  payload: RoutePackPayload;
}

export class RoutePackManager {
  private inMemoryStore = new Map<string, RoutePackEnvelope>();

  public createRoutePack(payload: RoutePackPayload): RoutePackEnvelope {
    const checksum = StorageIntegrityManager.computeChecksum(payload);
    const sizeKb = StorageIntegrityManager.estimateSizeKb(payload);

    const envelope: RoutePackEnvelope = {
      checksum,
      sizeKb,
      payload,
    };

    this.inMemoryStore.set(payload.packId, envelope);
    return envelope;
  }

  public getRoutePack(packId: string): RoutePackEnvelope | undefined {
    const envelope = this.inMemoryStore.get(packId);
    if (!envelope) return undefined;

    // Verify integrity before returning
    const isValid = StorageIntegrityManager.verifyIntegrity(envelope.payload, envelope.checksum);
    if (!isValid) {
      throw new Error(`Corrupted Route Pack detected for packId: ${packId}`);
    }
    return envelope;
  }

  public listDownloadedPacks(): Array<{ packId: string; circuitName: string; sizeKb: number; checksum: string }> {
    return Array.from(this.inMemoryStore.values()).map((env) => ({
      packId: env.payload.packId,
      circuitName: env.payload.circuitName,
      sizeKb: env.sizeKb,
      checksum: env.checksum,
    }));
  }
}
