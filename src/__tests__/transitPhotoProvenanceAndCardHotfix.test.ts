/**
 * @file src/__tests__/transitPhotoProvenanceAndCardHotfix.test.ts
 * @description Forensic automated regression suite for YatriKa AI V8.1.1 Hotfix.
 * Verifies photographic uniqueness, isolation of fallback pathways, honest missing asset reporting,
 * transit duration semantics, and URL/itinerary persistence.
 * @theme Code. Create. Celebrate Kannada.
 */

import { describe, it, expect } from 'vitest';
import {
  KARNATAKA_AUTHENTIC_PHOTOS,
  getAuthenticDestinationPhoto,
} from '../data/karnatakaPhotoRegistry';
import { VERIFIED_KARNATAKA_MEDIA_COLLECTION } from '../data/media/karnatakaPhotoRegistry';
import { KARNATAKA_TRANSPORT_FACILITIES } from '../components/TransportDirectoryWorkspace';
import {
  serializeTripToQueryString,
  parseTripFromQueryString,
} from '../services/tripPlannerEngine';
import { calculateMultiStopRoadRoute } from '../services/routingService';
import { getPoiById } from '../data/karnatakaTravelRegistry';

describe('YatriKa AI V8.1.1 — Transit Photography & Infrastructure Directory Hotfix', () => {
  const BELUR_IMAGE_SUBSTRING = 'Chennakeshava_temple_Belur_761.jpg';

  // ================= 1. PHOTO UNIQUENESS TEST =================
  describe('1. Facility Photo Uniqueness & Isolation', () => {
    const requiredFacilities = [
      'rail-sbc',
      'rail-mys',
      'rail-hpt',
      'rail-ud',
      'rail-ubl',
      'bus-majestic',
      'bus-mysuru',
      'bus-mangaluru',
    ];

    it('verifies that each required station/terminal has an authentic, distinct photograph URL', () => {
      const urls = new Set<string>();

      for (const id of requiredFacilities) {
        const photo = KARNATAKA_AUTHENTIC_PHOTOS[id];
        expect(photo, `Missing photographic record for facility: ${id}`).toBeDefined();
        expect(photo.imageUrl).toBeDefined();
        expect(photo.imageUrl).toContain('upload.wikimedia.org');

        // Crucial test: Ensure uniqueness — no two facilities share the same photo URL
        expect(urls.has(photo.imageUrl), `Duplicate photo URL detected for facility ${id}: ${photo.imageUrl}`).toBe(false);
        urls.add(photo.imageUrl);
      }

      expect(urls.size).toBe(requiredFacilities.length);
    });

    it('strictly guarantees that no railway station or bus terminal uses the Belur temple photo', () => {
      const allTransitIds = [
        'rail-sbc',
        'rail-mys',
        'rail-hpt',
        'rail-ud',
        'rail-ubl',
        'bus-majestic',
        'bus-mysuru',
        'bus-hosapete',
        'bus-mangaluru',
        'bus-hubballi',
      ];

      for (const id of allTransitIds) {
        const photo = getAuthenticDestinationPhoto(id);
        expect(
          photo.imageUrl.includes(BELUR_IMAGE_SUBSTRING),
          `Transit hub ${id} was contaminated with Belur temple photograph!`
        ).toBe(false);
        expect(
          photo.thumbnailUrl.includes(BELUR_IMAGE_SUBSTRING),
          `Transit hub ${id} thumbnail was contaminated with Belur temple photograph!`
        ).toBe(false);
      }
    });

    it('honestly reports missing photographic archives for secondary terminals without substituting unrelated places', () => {
      // Requirement: Hosapete KKRTC must show a neutral "Photograph unavailable" badge or transit terminal placeholder
      const hosapeteBus = getAuthenticDestinationPhoto('bus-hosapete');
      expect(hosapeteBus).toBeDefined();
      expect(hosapeteBus.isPlaceholder).toBe(true);
      expect(hosapeteBus.imageUrl).toContain('data:image/svg+xml');
      expect(decodeURIComponent(hosapeteBus.imageUrl)).toContain('BUS INTERCHANGE');
      expect(decodeURIComponent(hosapeteBus.imageUrl)).toContain('KKRTC-HPT');
      expect(hosapeteBus.caption).toContain('Photograph unavailable in open archives');

      const hubballiBus = getAuthenticDestinationPhoto('bus-hubballi');
      expect(hubballiBus.isPlaceholder).toBe(true);
      expect(hubballiBus.imageUrl).toContain('data:image/svg+xml');
      expect(decodeURIComponent(hubballiBus.imageUrl)).toContain('NWKRTC-UBL');
    });
  });

  // ================= 2. CATEGORY FALLBACK ISOLATION TEST =================
  describe('2. Strict Category-Isolated Fallback Pathway', () => {
    it('generates clean railway vector placeholder for unknown railway station', () => {
      const unknownRail = getAuthenticDestinationPhoto('rail-unknown-junction');
      expect(unknownRail.imageUrl).toContain('data:image/svg+xml');
      const decoded = decodeURIComponent(unknownRail.imageUrl);
      expect(decoded).toContain('RAILWAY INTERCHANGE');
      expect(decoded).toContain('South Western Railway');
      expect(decoded).not.toContain(BELUR_IMAGE_SUBSTRING);
    });

    it('generates clean bus vector placeholder for unknown bus terminal', () => {
      const unknownBus = getAuthenticDestinationPhoto('bus-unknown-stand');
      expect(unknownBus.imageUrl).toContain('data:image/svg+xml');
      const decoded = decodeURIComponent(unknownBus.imageUrl);
      expect(decoded).toContain('BUS INTERCHANGE');
      expect(decoded).toContain('KSRTC');
      expect(decoded).not.toContain(BELUR_IMAGE_SUBSTRING);
    });

    it('generates clean aviation placeholder for regional airports', () => {
      const airport = getAuthenticDestinationPhoto('air-mysuru');
      expect(airport.imageUrl).toContain('data:image/svg+xml');
      const decoded = decodeURIComponent(airport.imageUrl);
      expect(decoded).toContain('REGIONAL AIRPORT');
    });

    it('generates clean stay placeholder for accommodations', () => {
      const stay = getAuthenticDestinationPhoto('stay-coorg-resort');
      expect(stay.imageUrl).toContain('data:image/svg+xml');
      const decoded = decodeURIComponent(stay.imageUrl);
      expect(decoded).toContain('VERIFIED STAY');
    });

    it('generates clean culinary placeholder for iconic food locations', () => {
      const food = getAuthenticDestinationPhoto('food-vidyarthi-bhavan');
      expect(food.imageUrl).toContain('data:image/svg+xml');
      const decoded = decodeURIComponent(food.imageUrl);
      expect(decoded).toContain('KARNATAKA CUISINE');
    });

    it('never allows any unknown entity to default to Belur Chennakeshava temple photo', () => {
      const arbitraryEntity = getAuthenticDestinationPhoto('arbitrary-unregistered-poi-999');
      expect(arbitraryEntity.imageUrl).not.toContain(BELUR_IMAGE_SUBSTRING);
      expect(arbitraryEntity.imageUrl).toContain('data:image/svg+xml');
      const decoded = decodeURIComponent(arbitraryEntity.imageUrl);
      expect(decoded).toContain('KARNATAKA EXPLORER');
    });
  });

  // ================= 3. PROVENANCE & MEDIA COLLECTION AUDIT =================
  describe('3. Provenance & Media Collection Audit', () => {
    const verifiedFacilities = [
      'rail-sbc',
      'rail-mys',
      'rail-hpt',
      'rail-ud',
      'rail-ubl',
      'bus-majestic',
      'bus-mysuru',
      'bus-mangaluru',
    ];

    it('ensures each verified facility in VERIFIED_KARNATAKA_MEDIA_COLLECTION has non-AI CC provenance', () => {
      for (const id of verifiedFacilities) {
        const media = VERIFIED_KARNATAKA_MEDIA_COLLECTION[id];
        expect(media, `Missing media collection record for ${id}`).toBeDefined();
        expect(media.isAiGenerated).toBe(false);
        expect(media.exactLandmarkVerified).toBe(true);
        expect(media.rightsHolder).toBeDefined();
        expect(media.rightsHolder.length).toBeGreaterThan(3);
        expect(media.sourcePageUrl).toContain('commons.wikimedia.org');
        expect(media.originalMediaUrl).toContain('upload.wikimedia.org');
        expect(media.dateAcquired).toBe('2026-11-01');
        expect(media.geographicMatchNotes.length).toBeGreaterThan(15);
      }
    });
  });

  // ================= 4. TRANSPORT INFRASTRUCTURE DIRECTORY =================
  describe('4. Transport Infrastructure Directory Data Integrity', () => {
    it('contains all required railway stations and bus terminals with full specifications', () => {
      expect(KARNATAKA_TRANSPORT_FACILITIES.length).toBeGreaterThanOrEqual(8);

      const sbc = KARNATAKA_TRANSPORT_FACILITIES.find((f) => f.code === 'SBC');
      expect(sbc).toBeDefined();
      expect(sbc?.category).toBe('railway_station');
      expect(sbc?.operatorOrZone).toContain('South Western Railway');
      expect(sbc?.facilities).toContain('Luggage Cloakroom');
      expect(sbc?.facilities).toContain('Pre-paid Auto & Taxi Stand');
      expect(sbc?.topConnections.some((c) => c.includes('Mysuru'))).toBe(true);
      expect(sbc?.officialUrl).toContain('irctc.co.in');

      const majestic = KARNATAKA_TRANSPORT_FACILITIES.find((f) => f.code === 'KSRTC-MAJ');
      expect(majestic).toBeDefined();
      expect(majestic?.category).toBe('bus_terminal');
      expect(majestic?.facilities).toContain('30 Operational Long-Distance Bus Bays');
      expect(majestic?.supportedServices).toContain('Airavat Club Class Multi-Axle AC');
      expect(majestic?.officialUrl).toBe('https://ksrtc.in');

      const hosapeteBus = KARNATAKA_TRANSPORT_FACILITIES.find((f) => f.code === 'KKRTC-HPT');
      expect(hosapeteBus).toBeDefined();
      expect(hosapeteBus?.category).toBe('bus_terminal');
      expect(hosapeteBus?.topConnections.some((c) => c.includes('Hampi'))).toBe(true);
    });
  });

  // ================= 5. ITINERARY & URL QUERY FIDELITY =================
  describe('5. Itinerary State & URL Query Serialization Fidelity', () => {
    it('serializes and deserializes multi-stop trips including transit stations with 100% fidelity', () => {
      const state = {
        origin: 'origin-bengaluru',
        stopIds: ['rail-sbc', 'poi-shettihalli-church', 'poi-belur-halebidu', 'rail-mys'],
        days: 4,
        travellers: 3,
        tier: 'premium' as const,
      };

      const qs = serializeTripToQueryString(state);
      expect(qs).toContain('origin=origin-bengaluru');
      expect(qs).toContain('stops=rail-sbc%2Cpoi-shettihalli-church%2Cpoi-belur-halebidu%2Crail-mys');
      expect(qs).toContain('days=4');
      expect(qs).toContain('travellers=3');
      expect(qs).toContain('tier=premium');

      const parsed = parseTripFromQueryString(qs);
      expect(parsed.origin).toBe('origin-bengaluru');
      expect(parsed.stopIds).toEqual(state.stopIds);
      expect(parsed.days).toBe(4);
      expect(parsed.travellers).toBe(3);
      expect(parsed.tier).toBe('premium');
    });

    it('calculates road routing across multi-stop corridor including railway railheads', async () => {
      const originPoi = getPoiById('rail-sbc')!;
      const shettihalli = getPoiById('poi-shettihalli-church')!;
      const belur = getPoiById('poi-belur-halebidu')!;

      const route = await calculateMultiStopRoadRoute([originPoi, shettihalli, belur]);
      expect(route).toBeDefined();
      expect(route.legs.length).toBe(2);
      expect(route.totalDistanceKm).toBeGreaterThan(150);
      expect(route.totalDurationMinutes).toBeGreaterThan(120);
      expect(route.primaryGeometry.coordinates.length).toBeGreaterThan(10);
    });
  });
});
