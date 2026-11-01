/**
 * @file src/__tests__/v8_1UserJourneys.test.ts
 * @description End-to-end reality proof tests for YatriKa AI V8.1.
 * Validates Journeys A, B, C, authentic Wikimedia Commons photography,
 * SWR railway directionality (16592 Northbound vs 16591 Southbound),
 * KSRTC bus intelligence & Shakti scheme audits, and road routing maneuvers.
 * @theme Code. Create. Celebrate Kannada.
 */

import { describe, it, expect } from 'vitest';
import { TrainSearchService } from '../transit/railways/trainSearchService';
import { BusSearchService } from '../transit/buses/busSearchService';
import { calculateMultiStopRoadRoute, buildFallbackRoadCorridor } from '../services/routingService';
import { KARNATAKA_POIS, getPoiById } from '../data/karnatakaTravelRegistry';
import { KarnatakaPOI } from '../types/nammatrip';
import { KARNATAKA_AUTHENTIC_PHOTOS } from '../data/karnatakaPhotoRegistry';
import { VERIFIED_KARNATAKA_MEDIA_COLLECTION } from '../data/media/karnatakaPhotoRegistry';
import { InterchangeGraph } from '../mobility/interchangeGraph';
import { DestinationRegistryV8 } from '../data/destinations/destinationRegistry';

describe('YatriKa AI V8.1 — End-to-End Reality Proof & User Journeys', () => {
  // =========================================================================
  // JOURNEY A: BENGALURU TO HAMPI BY RAIL
  // =========================================================================
  describe('Journey A: Bengaluru ➔ Hosapete (Hampi) Rail Corridor', () => {
    it('1. verifies that Northbound train SBC to HPT returns Train 16592 departing at 21:50', () => {
      const search = TrainSearchService.search({
        fromStationCodeOrCity: 'SBC',
        toStationCodeOrCity: 'HPT',
      });

      expect(search.directTrains.length).toBeGreaterThanOrEqual(1);
      const northTrain = search.directTrains.find((t) => t.train.trainNumber.includes('16592'));
      expect(northTrain).toBeDefined();
      expect(northTrain?.train.originCode).toBe('SBC');
      expect(northTrain?.train.destinationCode).toBe('HPT');
      expect(northTrain?.train.departureTime).toBe('21:50');
      expect(northTrain?.train.arrivalTime).toBe('07:10');
      expect(northTrain?.train.classesAvailable).toContain('SL');
      expect(northTrain?.train.classesAvailable).toContain('3A');
      expect(northTrain?.train.ntesRunningStatusUrl).toContain('trainNo=16592');
      expect(northTrain?.irctcBookingUrl).toContain('irctc.co.in');
    });

    it('2. verifies that Southbound return train HPT to SBC returns Train 16591 departing at 21:10', () => {
      const search = TrainSearchService.search({
        fromStationCodeOrCity: 'HPT',
        toStationCodeOrCity: 'SBC',
      });

      expect(search.directTrains.length).toBeGreaterThanOrEqual(1);
      const returnTrain = search.directTrains.find((t) => t.train.trainNumber.includes('16591'));
      expect(returnTrain).toBeDefined();
      expect(returnTrain?.train.originCode).toBe('HPT');
      expect(returnTrain?.train.destinationCode).toBe('SBC');
      expect(returnTrain?.train.departureTime).toBe('21:10');
      expect(returnTrain?.train.arrivalTime).toBe('06:10');
      expect(returnTrain?.train.ntesRunningStatusUrl).toContain('trainNo=16591');
    });

    it('3. verifies intermodal transfer from Hosapete station to Hampi monuments', () => {
      const plan = InterchangeGraph.planInterchange('Bengaluru', 'Hampi', 'train');
      expect(plan.chainSteps.length).toBe(3);
      expect(plan.chainSteps[0].mode).toBe('train');
      expect(plan.chainSteps[0].serviceName).toContain('Hampi Express');
      expect(plan.chainSteps[1].mode).toBe('local_transfer');
      expect(plan.chainSteps[1].fromLabel).toContain('Hosapete');
      expect(plan.chainSteps[1].instructions).toContain('Hampi');
    });
  });

  // =========================================================================
  // JOURNEY B: BENGALURU TO CHIKKAMAGALURU BY BUS & SHAKTI SCHEME
  // =========================================================================
  describe('Journey B: Bengaluru ➔ Chikkamagaluru Bus & Mountain Trail', () => {
    it('1. verifies authentic KSRTC bus schedules from Bengaluru to Chikkamagaluru', () => {
      const res = BusSearchService.search({
        origin: 'Bengaluru',
        destination: 'Chikkamagaluru',
        passengers: 2,
        womenPassengersCount: 1,
      });

      expect(res.results.length).toBeGreaterThanOrEqual(2);
      const sarige = res.results.find((r) => r.schedule.serviceClass === 'ordinary_sarige');
      expect(sarige).toBeDefined();
      expect(sarige?.schedule.departureTime).toBe('07:15');
      expect(sarige?.schedule.shaktiFree).toBe(true);
      expect(sarige?.shaktiSavingsInr).toBe(215); // ₹215 saved for 1 woman
    });

    it('2. verifies that luxury sleeper (Ambari Utsav) is properly excluded from Shakti zero-fare', () => {
      const res = BusSearchService.search({
        origin: 'Bengaluru',
        destination: 'Chikkamagaluru',
        passengers: 1,
        womenPassengersCount: 1,
      });

      const ambari = res.results.find((r) => r.schedule.serviceClass === 'ambari_utsav_sleeper');
      expect(ambari).toBeDefined();
      expect(ambari?.schedule.shaktiFree).toBe(false);
      expect(ambari?.shaktiSavingsInr).toBe(0); // Zero savings on AC sleeper
    });
  });

  // =========================================================================
  // JOURNEY C: HAMPI HISTORIC MONUMENTS ROAD ROUTING & DIRECTIONS
  // =========================================================================
  describe('Journey C: Hampi Monument Circuit Road Network Routing', () => {
    it('1. computes multi-stop road route between Hampi monuments with authentic road geometry', async () => {
      const stoneChariot = (getPoiById('poi-hampi-stone-chariot') || {
        id: 'poi-hampi-stone-chariot',
        name: 'Stone Chariot, Hampi',
        nameKannada: 'ಕಲ್ಲಿನ ರಥ',
        district: 'Vijayanagara',
        macroRegion: 'UNESCO World Heritage',
        category: 'heritage_unesco',
        coordinates: [76.4800, 15.3400] as [number, number],
        recommendedHours: 2,
        entryFeeInr: { indianCitizen: 40, foreignNational: 600 },
        summary: 'Garuda shrine in Vittala Temple',
        highlights: ['Stone wheels'],
      }) as KarnatakaPOI;

      const virupaksha = (getPoiById('poi-virupaksha-temple') || {
        id: 'poi-virupaksha-temple',
        name: 'Virupaksha Temple',
        nameKannada: 'ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯ',
        district: 'Vijayanagara',
        macroRegion: 'UNESCO World Heritage',
        category: 'heritage_unesco',
        coordinates: [76.4600, 15.3350] as [number, number],
        recommendedHours: 1.5,
        entryFeeInr: { indianCitizen: 0, foreignNational: 0 },
        summary: 'Active 7th-century temple',
        highlights: ['50m Gopura'],
      }) as KarnatakaPOI;

      const route = await calculateMultiStopRoadRoute([virupaksha, stoneChariot]);
      expect(route).toBeDefined();
      expect(route.totalDistanceKm).toBeGreaterThan(1);
      expect(route.totalDurationMinutes).toBeGreaterThan(2);
      expect(route.primaryGeometry.coordinates.length).toBeGreaterThanOrEqual(2);
      expect(route.legs.length).toBe(1);
      expect(route.legs[0].steps.length).toBeGreaterThanOrEqual(1);
    });

    it('2. verifies that fallback road corridor provides turn maneuvers and realistic curvature', () => {
      const p1 = KARNATAKA_POIS[0];
      const p2 = KARNATAKA_POIS[1];
      const fallback = buildFallbackRoadCorridor([p1, p2]);

      expect(fallback.provenance).toBe('fallback_geodesic_corridor');
      expect(fallback.totalDistanceKm).toBeGreaterThan(0);
      expect(fallback.primaryGeometry.coordinates.length).toBeGreaterThan(2);
      expect(fallback.legs[0].steps[0].maneuverType).toBe('depart');
      expect(fallback.legs[0].steps[fallback.legs[0].steps.length - 1].maneuverType).toBe('arrive');
    });
  });

  // =========================================================================
  // PHOTOGRAPHIC PROVENANCE: WIKIMEDIA COMMONS VERIFIED ASSETS
  // =========================================================================
  describe('Photographic Provenance & License Verification', () => {
    it('1. verifies that all flagship destinations use genuine Wikimedia Commons images with CC licenses', () => {
      const keys = [
        'poi-belur-halebidu',
        'poi-mullayanagiri',
        'poi-shettihalli-church',
        'poi-hampi-stone-chariot',
        'poi-virupaksha-temple',
        'poi-mysore-palace',
        'poi-badami-caves',
        'poi-om-beach-gokarna',
        'poi-jog-falls',
        'poi-shravanabelagola',
        'poi-coorg-raja-seat',
        'poi-udupi-krishna',
      ];

      for (const key of keys) {
        const photo = KARNATAKA_AUTHENTIC_PHOTOS[key];
        expect(photo, `Missing photo for ${key}`).toBeDefined();
        expect(photo.imageUrl).toContain('upload.wikimedia.org');
        expect(photo.attribution).toContain('Wikimedia Commons');
        expect(photo.license).toMatch(/CC|GFDL/);
      }
    });

    it('2. verifies that VERIFIED_KARNATAKA_MEDIA_COLLECTION strictly forbids AI-generated fakes', () => {
      for (const [key, record] of Object.entries(VERIFIED_KARNATAKA_MEDIA_COLLECTION)) {
        expect(record.isAiGenerated, `${key} must not be AI-generated`).toBe(false);
        expect(record.exactLandmarkVerified, `${key} must have exactLandmarkVerified`).toBe(true);
        expect(record.originalMediaUrl).toContain('upload.wikimedia.org');
        expect(record.geographicMatchNotes.length).toBeGreaterThan(20);
      }
    });

    it('3. verifies DestinationRegistryV8 photoMeta citations match Wikimedia Commons', () => {
      const hampi = DestinationRegistryV8.getInstance().getById('poi-virupaksha-temple');
      expect(hampi?.photoMeta?.imageUrl).toContain('upload.wikimedia.org');
      expect(hampi?.photoMeta?.attribution).toContain('Ingo Mehling');

      const belur = DestinationRegistryV8.getInstance().getById('poi-belur-halebidu');
      expect(belur?.photoMeta?.imageUrl).toContain('upload.wikimedia.org');
      expect(belur?.photoMeta?.attribution).toContain('Akshatha Inamdar');
    });
  });
});
