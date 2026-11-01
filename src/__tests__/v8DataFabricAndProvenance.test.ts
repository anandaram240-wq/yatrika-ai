/**
 * @file src/__tests__/v8DataFabricAndProvenance.test.ts
 * @description Unit tests for YatriKa AI V8 Authoritative Data Intelligence Fabric.
 * @theme Code. Create. Celebrate Kannada.
 */

import { describe, it, expect } from 'vitest';
import { AUTHORITATIVE_SOURCE_REGISTRY } from '../data-fabric/sourceRegistry';
import { getTrustClassificationMeta } from '../data-fabric/verificationStatus';
import { FreshnessManager } from '../data-fabric/freshnessManager';
import { getMasterLicense } from '../data-fabric/licenceRegistry';

describe('YatriKa AI V8 — Data Intelligence Fabric Suite', () => {
  it('1. verifies that all 15 external authoritative sources are correctly registered with provenance metadata', () => {
    const sources = Object.values(AUTHORITATIVE_SOURCE_REGISTRY);
    expect(sources.length).toBeGreaterThanOrEqual(15);

    for (const src of sources) {
      expect(src.sourceId).toBeDefined();
      expect(src.sourceOrganization.length).toBeGreaterThan(5);
      expect(src.sourceOrganizationKannada.length).toBeGreaterThan(3);
      expect(src.sourceUrl.startsWith('https://')).toBe(true);
      expect(src.trustClassification).toBeDefined();
      expect(src.lastIndependentlyVerifiedTimestamp).toBeDefined();
      expect(src.expiryConditions.length).toBeGreaterThan(10);
    }
  });

  it('2. verifies that trust classifications strictly distinguish statutory/official from unverified or community data', () => {
    const officialLive = getTrustClassificationMeta('OFFICIAL_LIVE');
    expect(officialLive.isStatutoryOrOfficial).toBe(true);

    const operatorConfirmed = getTrustClassificationMeta('OPERATOR_CONFIRMED');
    expect(operatorConfirmed.isStatutoryOrOfficial).toBe(true);

    const community = getTrustClassificationMeta('COMMUNITY_MAPPED');
    expect(community.isStatutoryOrOfficial).toBe(false);

    const unverified = getTrustClassificationMeta('UNVERIFIED');
    expect(unverified.isStatutoryOrOfficial).toBe(false);
  });

  it('3. evaluates data freshness correctly across real-time, stale, and expired boundaries', () => {
    const now = new Date('2026-11-01T12:00:00Z');

    // 10 minutes ago -> Fresh
    const freshMeta = FreshnessManager.evaluate('2026-11-01T11:50:00Z', 'weather', now);
    expect(freshMeta.state).toBe('Fresh');
    expect(freshMeta.isStaleOrExpired).toBe(false);

    // 200 minutes ago for weather (staleThreshold: 180 min) -> Stale
    const staleMeta = FreshnessManager.evaluate('2026-11-01T08:00:00Z', 'weather', now);
    expect(staleMeta.state).toBe('Stale');
    expect(staleMeta.isStaleOrExpired).toBe(true);
    expect(staleMeta.noticeText).toBeDefined();

    // 10 hours ago for weather (hardExpiry: 360 min) -> Expired
    const expiredMeta = FreshnessManager.evaluate('2026-11-01T01:00:00Z', 'weather', now);
    expect(expiredMeta.state).toBe('Expired');
    expect(expiredMeta.isStaleOrExpired).toBe(true);
  });

  it('4. verifies explicit licensing entries for all major external data regimes', () => {
    const ogd = getMasterLicense('ogd-india');
    expect(ogd.shortCode).toBe('GODL-India');
    expect(ogd.commercialUsePermitted).toBe(true);

    const asi = getMasterLicense('asi-public-statutory');
    expect(asi.legalEntity).toContain('Archaeological Survey of India');

    const ksrtc = getMasterLicense('ksrtc-published-schedule');
    expect(ksrtc.legalEntity).toContain('KSRTC');
  });
});
