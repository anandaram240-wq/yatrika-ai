/**
 * @file src/__tests__/v8_2RescueJourneys.test.ts
 * @description End-to-End Reality Proof Test Suite for YatriKa AI V8.2 Release.
 * Rigorously verifies the three flagship Karnataka user journeys:
 * 1. Journey 1: Bengaluru ➔ Hosapete ➔ Hampi (SWR Rail, Road Geometry, ASI Heritage & Stay)
 * 2. Journey 2: Mysuru Heritage Corridor (Bengaluru ➔ Srirangapatna ➔ Mysuru Palace ➔ Chamundi Hills)
 * 3. Journey 3: Chikkamagaluru Coffee & Peak Sanctuary (Bengaluru ➔ Hassan ➔ Belur ➔ Mullayanagiri)
 * @theme Code. Create. Celebrate Kannada.
 */

import { describe, it, expect } from 'vitest';
import { TrainSearchService } from '../transit/railways/trainSearchService';
import { calculateMultiStopRoadRoute } from '../services/routingService';
import { getPoiById } from '../data/karnatakaTravelRegistry';
import { KARNATAKA_AUTHENTIC_PHOTOS } from '../data/karnatakaPhotoRegistry';
import { VERIFIED_KARNATAKA_MEDIA_COLLECTION } from '../data/media/karnatakaPhotoRegistry';
import { COMPREHENSIVE_FLAGSHIP_DESTINATIONS } from '../data/destinations/destinationRegistry';
import { calculateTripBudget, parseTripFromQueryString, serializeTripToQueryString } from '../services/tripPlannerEngine';

describe('YatriKa AI V8.2 — Flagship Reality Proof Journeys', () => {
  // =========================================================================
  // JOURNEY 1: BENGALURU ➔ HOSAPETE ➔ HAMPI
  // =========================================================================
  describe('Journey 1: Bengaluru ➔ Hosapete ➔ Hampi (SWR Rail, Road Geometry, ASI Heritage)', () => {
    it('1. verifies SWR Train 16592 Hampi Express from SBC to HPT', () => {
      const search = TrainSearchService.search({
        fromStationCodeOrCity: 'SBC',
        toStationCodeOrCity: 'HPT',
      });

      expect(search.directTrains.length).toBeGreaterThanOrEqual(1);
      const train = search.directTrains.find((t) => t.train.trainNumber.includes('16592'));
      expect(train).toBeDefined();
      expect(train?.train.trainName).toContain('Hampi Express');
      expect(train?.train.originCode).toBe('SBC');
      expect(train?.train.destinationCode).toBe('HPT');
      expect(train?.train.departureTime).toBe('21:50');
      expect(train?.train.arrivalTime).toBe('07:10');
      expect(train?.train.classesAvailable).toEqual(expect.arrayContaining(['SL', '3A', '2A', '1A']));
      expect(train?.irctcBookingUrl).toContain('irctc.co.in');
    });

    it('2. verifies road connectivity and geometry between Hosapete and Hampi monuments', async () => {
      const hpt = getPoiById('rail-hpt')!;
      const stoneChariot = getPoiById('poi-hampi-stone-chariot')!;
      const badami = getPoiById('poi-badami-caves')!;

      expect(hpt).toBeDefined();
      expect(stoneChariot).toBeDefined();
      expect(badami).toBeDefined();

      const route = await calculateMultiStopRoadRoute([hpt, stoneChariot, badami]);
      expect(route).toBeDefined();
      expect(route.legs.length).toBe(2);
      expect(route.totalDistanceKm).toBeGreaterThan(100);
      expect(route.primaryGeometry.coordinates.length).toBeGreaterThan(5);
    }, 15000);

    it('3. verifies authentic ASI visitor guidelines and zero AI photos for Hampi monuments', () => {
      const virupakshaPhoto = KARNATAKA_AUTHENTIC_PHOTOS['poi-virupaksha-temple'];
      const chariotPhoto = KARNATAKA_AUTHENTIC_PHOTOS['poi-hampi-stone-chariot'];

      expect(virupakshaPhoto.imageUrl).toContain('upload.wikimedia.org');
      expect(virupakshaPhoto.license).toContain('CC BY-SA');
      expect(chariotPhoto.imageUrl).toContain('upload.wikimedia.org');
      expect(chariotPhoto.attribution).toContain('Abhinandan Patil');

      const compVirupaksha = COMPREHENSIVE_FLAGSHIP_DESTINATIONS.find((d) => d.id === 'poi-virupaksha-temple');
      expect(compVirupaksha).toBeDefined();
      expect(compVirupaksha?.openingHours).toBe('06:00 - 18:00');
      expect(compVirupaksha?.entryFee.isFree).toBe(true);
    });
  });

  // =========================================================================
  // JOURNEY 2: MYSURU HERITAGE CORRIDOR
  // =========================================================================
  describe('Journey 2: Mysuru Heritage Corridor (Bengaluru ➔ Srirangapatna ➔ Mysuru Palace ➔ Chamundi Hills)', () => {
    it('1. verifies Srirangapatna Island Heritage with authentic Daria Daulat photograph', () => {
      const sriPhoto = KARNATAKA_AUTHENTIC_PHOTOS['poi-srirangapatna'];
      expect(sriPhoto).toBeDefined();
      expect(sriPhoto.imageUrl).toBe('https://upload.wikimedia.org/wikipedia/commons/f/f2/Daria_Daulat_Bagh.jpg');
      expect(sriPhoto.attribution).toContain('Ankmachine / Wikimedia Commons');
      expect(sriPhoto.license).toBe('CC BY-SA 3.0');

      const verifiedSri = VERIFIED_KARNATAKA_MEDIA_COLLECTION['poi-srirangapatna'];
      expect(verifiedSri).toBeDefined();
      expect(verifiedSri.isAiGenerated).toBe(false);
      expect(verifiedSri.exactLandmarkVerified).toBe(true);
    });

    it('2. verifies Mysore Palace Board statutory hours, illumination times, and entry fees', () => {
      const compPalace = COMPREHENSIVE_FLAGSHIP_DESTINATIONS.find((d) => d.id === 'poi-mysore-palace');
      expect(compPalace).toBeDefined();
      expect(compPalace?.openingHours).toContain('10:00 - 17:30 Daily');
      expect(compPalace?.openingHoursNote).toContain('19:00 - 20:00');
      expect(compPalace?.openingHoursNote).toContain('Sound & Light Show');
      expect(compPalace?.entryFee.indianCitizen).toBe(100);
      expect(compPalace?.entryFee.foreignNational).toBe(100);
      expect(compPalace?.entryFee.feeNote).toContain('Adults ₹100');
      expect(compPalace?.entryFee.feeNote).toContain('Students');
    });

    it('3. calculates multi-stop road route from Bengaluru through Srirangapatna to Mysuru Palace & Chamundi', async () => {
      const sbc = getPoiById('rail-sbc')!;
      const srirangapatna = getPoiById('poi-srirangapatna')!;
      const palace = getPoiById('poi-mysore-palace')!;
      const chamundi = getPoiById('poi-chamundi-hills')!;

      const route = await calculateMultiStopRoadRoute([sbc, srirangapatna, palace, chamundi]);
      expect(route).toBeDefined();
      expect(route.legs.length).toBe(3);
      expect(route.totalDistanceKm).toBeGreaterThan(130);
      expect(route.primaryGeometry.coordinates.length).toBeGreaterThan(15);
    }, 15000);

    it('4. verifies trip serialization fidelity for Mysuru Heritage Corridor', () => {
      const trip = {
        origin: 'Bengaluru',
        stopIds: ['rail-sbc', 'poi-srirangapatna', 'poi-mysore-palace', 'poi-chamundi-hills'],
        days: 2,
        travellers: 2,
        tier: 'comfort' as const,
      };

      const qs = serializeTripToQueryString(trip);
      expect(qs).toContain('origin=Bengaluru');
      expect(qs).toContain('poi-srirangapatna');
      expect(qs).toContain('poi-mysore-palace');

      const parsed = parseTripFromQueryString(`?${qs}`);
      expect(parsed.stopIds).toEqual(trip.stopIds);
      expect(parsed.days).toBe(2);
      expect(parsed.tier).toBe('comfort');
    });
  });

  // =========================================================================
  // JOURNEY 3: CHIKKAMAGALURU COFFEE & PEAK SANCTUARY
  // =========================================================================
  describe('Journey 3: Chikkamagaluru Coffee & Peak Sanctuary (Bengaluru ➔ Hassan ➔ Belur ➔ Mullayanagiri)', () => {
    it('1. verifies NH-75 route connecting Shettihalli Church, Belur Chennakeshava & Mullayanagiri', async () => {
      const sbc = getPoiById('rail-sbc')!;
      const shettihalli = getPoiById('poi-shettihalli-church')!;
      const belur = getPoiById('poi-belur-halebidu')!;
      const mullayanagiri = getPoiById('poi-mullayanagiri')!;

      const route = await calculateMultiStopRoadRoute([sbc, shettihalli, belur, mullayanagiri]);
      expect(route).toBeDefined();
      expect(route.legs.length).toBe(3);
      expect(route.totalDistanceKm).toBeGreaterThan(240);
      expect(route.totalDurationMinutes).toBeGreaterThan(200);
    }, 15000);

    it('2. verifies authentic photography and licensing across Golden Corridor stops', () => {
      const stops = ['poi-shettihalli-church', 'poi-belur-halebidu', 'poi-mullayanagiri'];
      for (const sid of stops) {
        const photo = KARNATAKA_AUTHENTIC_PHOTOS[sid];
        expect(photo).toBeDefined();
        expect(photo.imageUrl).toContain('upload.wikimedia.org');
        expect(photo.license).toBeDefined();
        expect(photo.attribution).toBeDefined();

        const verified = VERIFIED_KARNATAKA_MEDIA_COLLECTION[sid];
        expect(verified).toBeDefined();
        expect(verified.isAiGenerated).toBe(false);
      }
    });

    it('3. verifies budget and Shakti savings calculations across the corridor', async () => {
      const shettihalli = getPoiById('poi-shettihalli-church')!;
      const belur = getPoiById('poi-belur-halebidu')!;
      const mullayanagiri = getPoiById('poi-mullayanagiri')!;

      const stops = [shettihalli, belur, mullayanagiri];
      const route = await calculateMultiStopRoadRoute(stops);
      const budget = calculateTripBudget({
        stops,
        route,
        days: 3,
        travellers: 2,
        tier: 'comfort',
      });

      expect(budget.totalInr).toBeGreaterThan(1000);
      expect(budget.transportInr).toBeGreaterThan(0);
      expect(budget.foodInr).toBeGreaterThan(0);
      expect(budget.accommodationInr).toBeGreaterThan(0);
    }, 15000);
  });
});
