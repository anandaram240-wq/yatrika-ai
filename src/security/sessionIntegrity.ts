/**
 * @file src/security/sessionIntegrity.ts
 * @description Tamper-evident itinerary hashes and state verification for YatriKa AI V4.
 * @theme Code. Create. Celebrate Kannada.
 */

import { StorageIntegrityManager } from '../offline/storageIntegrity';

export interface VerifiedSessionEnvelope<T = unknown> {
  sessionId: string;
  signature: string;
  issuedAt: string;
  data: T;
}

export class SessionIntegrityGuard {
  public static sealSession<T>(sessionId: string, payload: T): VerifiedSessionEnvelope<T> {
    const signature = StorageIntegrityManager.computeChecksum({ sessionId, payload });
    return {
      sessionId,
      signature,
      issuedAt: new Date().toISOString(),
      data: payload,
    };
  }

  public static verifySession<T>(envelope: VerifiedSessionEnvelope<T>): boolean {
    const expected = StorageIntegrityManager.computeChecksum({
      sessionId: envelope.sessionId,
      payload: envelope.data,
    });
    return envelope.signature === expected;
  }
}
