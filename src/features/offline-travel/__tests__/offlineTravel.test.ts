/**
 * src/features/offline-travel/__tests__/offlineTravel.test.ts
 * Vitest Unit Tests for YatriKa Offline Survival Mode
 */

import { describe, it, expect } from 'vitest';
import { offlineStorage } from '../storage/offlineStorageRepository';
import {
  createAndSaveOfflineTripPack,
  computePackChecksum,
  OFFICIAL_KARNATAKA_EMERGENCY_DIRECTORY,
  KANNAADA_SURVIVAL_PHRASES,
} from '../services/offlineTripPackService';

describe('System B: Offline Storage Repository', () => {
  it('correctly saves and retrieves an offline trip pack from storage', async () => {
    const mockPack = await createAndSaveOfflineTripPack({
      id: 'test-pack-mysuru-coorg',
      circuitTitle: 'Royal Mysuru & Coorg',
      circuitTitleKannada: 'ಮೈಸೂರು ಮತ್ತು ಕೊಡಗು',
      origin: {
        id: 'origin-bengaluru',
        name: 'Bengaluru',
        nameKannada: 'ಬೆಂಗಳೂರು',
        coordinates: [77.5946, 12.9716],
      },
      stops: [
        {
          id: 'poi-mysore-palace',
          name: 'Mysuru Ambavilas Palace',
          nameKannada: 'ಮೈಸೂರು ಅರಮನೆ',
          coordinates: [76.6552, 12.3051],
          entryFeeInr: 100,
          timing: '10:00 AM – 05:30 PM',
        },
      ],
      totalDistanceKm: 145,
      routeCoordinates: [
        [77.5946, 12.9716],
        [76.6552, 12.3051],
      ],
      netTotalInr: 3200,
      lodgingInr: 1500,
      fuelInr: 800,
      ticketsInr: 400,
      foodInr: 500,
    });

    expect(mockPack.id).toBe('test-pack-mysuru-coorg');
    expect(mockPack.status).toBe('ready');
    expect(mockPack.checksum).toMatch(/^crc32-[0-9a-f]+$/);

    const retrieved = await offlineStorage.getTripPack('test-pack-mysuru-coorg');
    expect(retrieved).not.toBeNull();
    expect(retrieved?.stops.length).toBe(1);
    expect(retrieved?.origin.name).toBe('Bengaluru');
  });

  it('lists and deletes offline trip packs cleanly', async () => {
    const list = await offlineStorage.listTripPacks();
    expect(list.length).toBeGreaterThanOrEqual(1);

    const deleted = await offlineStorage.deleteTripPack('test-pack-mysuru-coorg');
    expect(deleted).toBe(true);

    const recheck = await offlineStorage.getTripPack('test-pack-mysuru-coorg');
    expect(recheck).toBeNull();
  });

  it('computes consistent deterministic checksums for pack payloads', () => {
    const sum1 = computePackChecksum('{"stops":["poi-1","poi-2"],"dist":150}');
    const sum2 = computePackChecksum('{"stops":["poi-1","poi-2"],"dist":150}');
    const sum3 = computePackChecksum('{"stops":["poi-different"]}');

    expect(sum1).toBe(sum2);
    expect(sum1).not.toBe(sum3);
  });
});

describe('System B: Official Karnataka Emergency Directory & Survival Phrases', () => {
  it('contains mandatory Karnataka 112, 108, and 1077 disaster helplines', () => {
    const emergencyNumbers = OFFICIAL_KARNATAKA_EMERGENCY_DIRECTORY.map((c) => c.phoneNumber);
    expect(emergencyNumbers).toContain('112');
    expect(emergencyNumbers).toContain('108');
    expect(emergencyNumbers).toContain('1077');
    expect(emergencyNumbers).toContain('1926'); // Forest dept
  });

  it('contains essential safety, medical, and transport survival phrases', () => {
    expect(KANNAADA_SURVIVAL_PHRASES.length).toBeGreaterThanOrEqual(6);

    const safetyPhrase = KANNAADA_SURVIVAL_PHRASES.find((p) => p.category === 'safety');
    expect(safetyPhrase).toBeDefined();
    expect(safetyPhrase?.kannada).toContain('ಸಹಾಯ');

    const shaktiPhrase = KANNAADA_SURVIVAL_PHRASES.find((p) => p.english.includes('Shakti Scheme'));
    expect(shaktiPhrase).toBeDefined();
    expect(shaktiPhrase?.kannada).toContain('ಶಕ್ತಿ');
  });
});
