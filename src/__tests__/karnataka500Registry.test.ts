import { describe, it, expect } from 'vitest';
import {
  KARNATAKA_500_POIS,
  DISTRICT_METADATA_MAP,
} from '../data/karnataka500Registry';
import { KARNATAKA_POIS } from '../data/karnatakaTravelRegistry';

describe('YatriKa AI — Karnataka 500+ Verified Tourism Registry Suite', () => {
  it('1. verifies that the dataset contains over 515 verified POIs', () => {
    expect(KARNATAKA_500_POIS.length).toBeGreaterThanOrEqual(515);
    expect(KARNATAKA_POIS.length).toBeGreaterThanOrEqual(600);
  });

  it('2. verifies 100% complete coverage across all 31 districts of Karnataka', () => {
    const districtsInMetadata = Object.keys(DISTRICT_METADATA_MAP);
    expect(districtsInMetadata.length).toBe(31);

    const representedDistricts = new Set(KARNATAKA_500_POIS.map((p) => p.district));
    expect(representedDistricts.size).toBe(31);

    for (const district of districtsInMetadata) {
      expect(representedDistricts.has(district)).toBe(true);
      const districtPois = KARNATAKA_500_POIS.filter((p) => p.district === district);
      // Every single district must have at least 12 verified spots
      expect(districtPois.length).toBeGreaterThanOrEqual(12);
    }
  });

  it('3. verifies all 6 Karnataka Cultural Macro-Regions are represented', () => {
    const regions = new Set(KARNATAKA_500_POIS.map((p) => p.macroRegion));
    expect(regions.has('Old Mysuru')).toBe(true);
    expect(regions.has('Malnad & Western Ghats')).toBe(true);
    expect(regions.has('Karavali Coastal')).toBe(true);
    expect(regions.has('Kittur Karnataka')).toBe(true);
    expect(regions.has('Kalyana Karnataka')).toBe(true);
    expect(regions.has('Bayaluseeme')).toBe(true);
  });

  it('4. verifies rigorous geospatial validity for all 515+ POIs within Karnataka boundaries', () => {
    for (const poi of KARNATAKA_500_POIS) {
      const [lng, lat] = poi.coordinates;
      // Karnataka bounding box: Lng [74.0, 78.6], Lat [11.5, 18.5]
      expect(lng).toBeGreaterThanOrEqual(74.0);
      expect(lng).toBeLessThanOrEqual(78.6);
      expect(lat).toBeGreaterThanOrEqual(11.5);
      expect(lat).toBeLessThanOrEqual(18.5);
    }
  });

  it('5. verifies rich cultural Kannada language, dialect phrases, and authentic photography', () => {
    for (const poi of KARNATAKA_500_POIS) {
      // Must have Kannada name
      expect(poi.nameKannada.length).toBeGreaterThan(2);
      // Must have summary
      expect(poi.summary.length).toBeGreaterThan(20);
      // Must have regional Kannada phrase
      expect(poi.localPhrase.kannada.length).toBeGreaterThan(3);
      expect(poi.localPhrase.english.length).toBeGreaterThan(3);
      // Must have photoUrl pointing to Wikimedia Commons
      expect(poi.photoUrl).toBeDefined();
      expect(poi.photoUrl).toContain('upload.wikimedia.org');
    }
  });

  it('6. verifies unique ID integrity across the entire registry', () => {
    const ids = KARNATAKA_500_POIS.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('7. verifies district metadata transit infrastructure (railway & bus terminals)', () => {
    for (const [, meta] of Object.entries(DISTRICT_METADATA_MAP)) {
      expect(meta.nearestRailwayId.length).toBeGreaterThan(2);
      expect(meta.nearestBusTerminalId.length).toBeGreaterThan(2);
      expect(meta.officialPortal).toMatch(/^https:\/\//);
      expect(meta.localPhrase.kannada.length).toBeGreaterThan(3);
    }
  });
});
