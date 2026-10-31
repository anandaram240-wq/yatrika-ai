/**
 * @file src/intelligence/dataProvenance.ts
 * @description Provenance record encapsulation for all external data items in YatriKa AI.
 * @theme Code. Create. Celebrate Kannada.
 */

import { DataReliabilityClass, DataSourceMetadata, getSourceMetadata } from './sourceRegistry';

export interface ProvenanceRecord<T> {
  data: T;
  sourceId: string;
  sourceOrganization: string;
  retrievedAt: string; // ISO 8601
  lastUpdatedAt?: string; // ISO 8601 when provided by source
  validityMinutes: number;
  expiresAt: string; // ISO 8601
  geographicScope: string;
  reliabilityClass: DataReliabilityClass;
  attributionStatement: string;
  isStale: boolean;
  stalenessReason?: string;
}

export function wrapWithProvenance<T>(
  data: T,
  sourceId: string,
  geographicScope: string,
  options?: {
    customRetrievedAt?: string;
    lastUpdatedAt?: string;
    overrideValidityMinutes?: number;
  }
): ProvenanceRecord<T> {
  const meta: DataSourceMetadata = getSourceMetadata(sourceId);
  const retrievedDate = options?.customRetrievedAt ? new Date(options.customRetrievedAt) : new Date();
  const validityMinutes = options?.overrideValidityMinutes ?? meta.defaultValidityMinutes;
  const expiresDate = new Date(retrievedDate.getTime() + validityMinutes * 60 * 1000);
  const now = new Date();
  const isStale = now.getTime() > expiresDate.getTime();

  return {
    data,
    sourceId: meta.sourceId,
    sourceOrganization: meta.organization,
    retrievedAt: retrievedDate.toISOString(),
    ...(options?.lastUpdatedAt ? { lastUpdatedAt: options.lastUpdatedAt } : {}),
    validityMinutes,
    expiresAt: expiresDate.toISOString(),
    geographicScope,
    reliabilityClass: meta.reliabilityClass,
    attributionStatement: meta.attributionText,
    isStale,
    ...(isStale
      ? { stalenessReason: `Data passed validity threshold (${validityMinutes}m) at ${expiresDate.toISOString()}` }
      : {}),
  };
}

export function checkProvenanceFreshness<T>(record: ProvenanceRecord<T>): {
  isFresh: boolean;
  ageMinutes: number;
  remainingMinutes: number;
} {
  const now = Date.now();
  const retrievedTime = new Date(record.retrievedAt).getTime();
  const expiresTime = new Date(record.expiresAt).getTime();
  const ageMinutes = Math.max(0, Math.round((now - retrievedTime) / 60000));
  const remainingMinutes = Math.round((expiresTime - now) / 60000);

  return {
    isFresh: remainingMinutes > 0,
    ageMinutes,
    remainingMinutes,
  };
}
