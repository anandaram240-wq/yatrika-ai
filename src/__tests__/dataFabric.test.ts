/**
 * @file src/__tests__/dataFabric.test.ts
 * @description Unit tests for YatriKa AI V4 Data Intelligence Fabric.
 */

import { describe, it, expect } from 'vitest';
import { DataIntelligenceFabric } from '../data/dataFabric';
import { SourceQualityValidator } from '../data/sourceQuality';
import { SchemaValidator } from '../data/schemaRegistry';
import { EntityReconciliationRegistry } from '../data/entityReconciliation';
import { DATA_LICENSE_REGISTRY } from '../data/licenseRegistry';

describe('Data Intelligence Fabric (Phase 3)', () => {
  const fabric = DataIntelligenceFabric.getInstance();

  it('validates 650 verified destinations in Karnataka destination registry with verified bounding box', () => {
    const total = fabric.getTotalPoiCount();
    expect(total).toBe(650);
    expect(total).toBeGreaterThanOrEqual(600);

    const audit = fabric.auditDatasetIntegrity();
    expect(audit.totalAudited).toBe(650);
    expect(audit.validCoordinatesPercent).toBeGreaterThanOrEqual(99.0);
    expect(audit.avgQualityScore).toBeGreaterThanOrEqual(90);
    expect(audit.duplicatesFound).toBe(0);
  });

  it('validates WGS84 Karnataka bounding box boundaries strictly', () => {
    // Bengaluru [77.59, 12.97] is in Karnataka
    expect(SourceQualityValidator.isWithinKarnataka([77.5946, 12.9716])).toBe(true);
    // Hampi [76.46, 15.33] is in Karnataka
    expect(SourceQualityValidator.isWithinKarnataka([76.4600, 15.3350])).toBe(true);
    // Chennai [80.27, 13.08] is NOT in Karnataka
    expect(SourceQualityValidator.isWithinKarnataka([80.2707, 13.0827])).toBe(false);
    // Mumbai [72.87, 19.07] is NOT in Karnataka
    expect(SourceQualityValidator.isWithinKarnataka([72.8777, 19.0760])).toBe(false);
  });

  it('enforces schema contracts and flags missing required fields', () => {
    const validPoi = {
      id: 'poi-test-1',
      canonicalName: 'Somnathpur Keshava',
      canonicalNameKannada: 'ಸೋಮನಾಥಪುರ ಕೇಶವ',
      category: 'heritage',
      district: 'Mysuru',
      macroRegion: 'Old Mysuru',
      coordinates: [76.904, 12.276],
      licenseId: 'gok-open-data',
    };

    const res = SchemaValidator.validate(validPoi, 'canonical-poi');
    expect(res.isValid).toBe(true);
    expect(res.missingFields).toHaveLength(0);

    const invalidPoi = {
      id: 'poi-test-2',
      category: 'temple',
      // Missing name, coordinates, district, etc.
    };
    const badRes = SchemaValidator.validate(invalidPoi, 'canonical-poi');
    expect(badRes.isValid).toBe(false);
    expect(badRes.missingFields).toContain('canonicalName');
    expect(badRes.missingFields).toContain('coordinates');
  });

  it('reconciles external aliases to single authoritative internal POI IDs', () => {
    const recon = new EntityReconciliationRegistry();

    // English aliases
    expect(recon.resolveToCanonicalId('Hampi')).toBe('poi-virupaksha-temple');
    expect(recon.resolveToCanonicalId('Hampe')).toBe('poi-virupaksha-temple');
    expect(recon.resolveToCanonicalId('Vijayanagara ruins')).toBe('poi-virupaksha-temple');

    // Kannada native script aliases
    expect(recon.resolveToCanonicalId('ಹಂಪಿ')).toBe('poi-virupaksha-temple');
    expect(recon.resolveToCanonicalId('ಬೇಲೂರು')).toBe('poi-chennakeshava-belur');
    expect(recon.resolveToCanonicalId('ಮುಳ್ಳಯ್ಯನಗಿರಿ')).toBe('poi-mullayanagiri-peak');

    // External identifiers (Wikidata / ASI)
    expect(recon.resolveToCanonicalId('Q2504826')).toBe('poi-virupaksha-temple');
    expect(recon.resolveToCanonicalId('ASI-N-KA-D7')).toBe('poi-chennakeshava-belur');
  });

  it('preserves distinct nearby heritage sites without false-positive deduplication', () => {
    // Belur Chennakeshava and Halebidu Hoysaleshwara are ~16 km apart
    const belur = { id: 'belur', name: 'Chennakeshava Temple', coordinates: [75.8601, 13.1627] as [number, number] };
    const halebidu = { id: 'halebidu', name: 'Hoysaleswara Temple', coordinates: [75.9937, 13.2136] as [number, number] };

    const dup = SourceQualityValidator.findDuplicate(belur, [halebidu]);
    expect(dup).toBeUndefined(); // Never merged!
  });

  it('provides open data licenses and legal attribution for all records', () => {
    expect(DATA_LICENSE_REGISTRY['gok-open-data'].shortCode).toBe('GoK-ODL');
    expect(DATA_LICENSE_REGISTRY['odbl-1.0'].attributionRequired).toBe(true);
    expect(DATA_LICENSE_REGISTRY['cc-by-4.0'].attributionTextEnglish).toContain('Open-Meteo');
  });
});
