/**
 * @file src/__tests__/trainValidatorAndLegRouting.test.ts
 * @description Comprehensive test suite for Train Identity Validator, Leg-by-Leg Intermodal Routing,
 * and Multi-Tier Basemap Resiliency.
 * Validates the core acceptance requirements of YatriKa AI V8.2.1.
 * @theme Code. Create. Celebrate Kannada.
 */

import { describe, it, expect } from 'vitest';
import {
  validateTrainIdentity,
  filterValidTrains,
  CANONICAL_VERIFIED_TRAINS,
} from '../transit/railways/trainValidator';
import {
  buildItineraryLegsTransit,
} from '../services/itineraryLegTransitService';
import {
  KARNATAKA_GATEWAY_ORIGINS,
  getPoiById,
} from '../data/karnatakaTravelRegistry';
import type { KarnatakaPOI } from '../types/nammatrip';
import {
  buildGoogleMapsRouteUrl,
  buildOpenStreetMapRouteUrl,
  getBasemapStyle,
} from '../config/mapProviders';

describe('YatriKa AI V8.2.1 — Train Integrity Validator & Leg-by-Leg Transit Architecture', () => {
  describe('Priority 0: Train Identity Integrity Validator', () => {
    it('verifies 20607 / 20608 is MGR Chennai Central to Mysuru Vande Bharat (calling at SBC)', () => {
      const train20607 = CANONICAL_VERIFIED_TRAINS['20607'];
      expect(train20607).toBeDefined();
      expect(train20607.trainName).toContain('MGR Chennai Central - Mysuru Vande Bharat Express');
      expect(train20607.originCode).toBe('MAS');
      expect(train20607.destinationCode).toBe('MYS');
      expect(train20607.category).toBe('vande_bharat');

      // Calling at KSR Bengaluru SBC
      const sbcStop = train20607.stops.find((s) => s.stationCode === 'SBC');
      expect(sbcStop).toBeDefined();

      const train20608 = CANONICAL_VERIFIED_TRAINS['20608'];
      expect(train20608).toBeDefined();
      expect(train20608.originCode).toBe('MYS');
      expect(train20608.destinationCode).toBe('MAS');

      // Validates that an incorrect standalone SBC-MYS mapping is rejected by validator
      const invalid20607 = validateTrainIdentity({
        trainNumber: '20607',
        trainName: 'Bengaluru to Mysuru Vande Bharat',
        originCode: 'SBC',
        destinationCode: 'MYS',
      });
      expect(invalid20607.isValid).toBe(false);
      expect(invalid20607.errors[0]).toContain('MGR Chennai Central to Mysuru Vande Bharat Express');
    });

    it('verifies 20661 / 20662 is KSR Bengaluru to Dharwad Vande Bharat (NOT Coimbatore or Mysuru)', () => {
      const train20661 = CANONICAL_VERIFIED_TRAINS['20661'];
      expect(train20661).toBeDefined();
      expect(train20661.trainName).toContain('KSR Bengaluru - Dharwad Vande Bharat Express');
      expect(train20661.originCode).toBe('SBC');
      expect(train20661.destinationCode).toBe('DWR');
      expect(train20661.category).toBe('vande_bharat');

      // Stops at Davanagere and SSS Hubballi
      const ublStop = train20661.stops.find((s) => s.stationCode === 'UBL');
      const dvgStop = train20661.stops.find((s) => s.stationCode === 'DVG');
      expect(ublStop).toBeDefined();
      expect(dvgStop).toBeDefined();

      // Validates rejection if accidentally mapped to Coimbatore or Mysuru
      const invalidCoimbatore = validateTrainIdentity({
        trainNumber: '20661',
        destinationName: 'Coimbatore',
        destinationCode: 'CBE',
      });
      expect(invalidCoimbatore.isValid).toBe(false);
      expect(invalidCoimbatore.errors[0]).toContain('Dharwad');

      const invalidMysuru = validateTrainIdentity({
        trainNumber: '20661',
        destinationName: 'Mysuru Junction',
        destinationCode: 'MYS',
      });
      expect(invalidMysuru.isValid).toBe(false);
      expect(invalidMysuru.errors[0]).toContain('North Karnataka');
    });

    it('verifies Rani Chennamma Express is designated as 16589/16590 (Express, NOT Vande Bharat)', () => {
      const train16589 = CANONICAL_VERIFIED_TRAINS['16589'];
      expect(train16589).toBeDefined();
      expect(train16589.trainName).toContain('Rani Chennamma Express');
      expect(train16589.originCode).toBe('SBC');
      expect(train16589.destinationCode).toBe('MRJ');
      expect(train16589.category).toBe('express'); // Must NOT be vande_bharat

      // Rejects bogus pairing of 20651 with Rani Chennamma
      const bogusChennammaNumber = validateTrainIdentity({
        trainNumber: '20651',
        trainName: 'Rani Chennamma Express',
        category: 'vande_bharat',
      });
      expect(bogusChennammaNumber.isValid).toBe(false);
      expect(bogusChennammaNumber.errors.some((e) => e.includes('16589/16590'))).toBe(true);
      expect(bogusChennammaNumber.errors.some((e) => e.includes('Superfast/Express'))).toBe(true);
    });

    it('verifies 20651 / 20652 is KSR Bengaluru to Talguppa Intercity Superfast Express', () => {
      const train20651 = CANONICAL_VERIFIED_TRAINS['20651'];
      expect(train20651).toBeDefined();
      expect(train20651.trainName).toContain('Talguppa Intercity Superfast Express');
      expect(train20651.originCode).toBe('SBC');
      expect(train20651.destinationCode).toBe('TLGP');
      expect(train20651.category).toBe('superfast_express');

      // Stops at Shivamogga Town and Birur Junction
      const smetStop = train20651.stops.find((s) => s.stationCode === 'SMET');
      const rrbStop = train20651.stops.find((s) => s.stationCode === 'RRB');
      expect(smetStop).toBeDefined();
      expect(rrbStop).toBeDefined();
    });

    it('filters out invalid or fabricated trains', () => {
      const testList = [
        { trainNumber: '20661', trainName: 'KSR Bengaluru - Dharwad Vande Bharat Express', originCode: 'SBC', destinationCode: 'DWR' },
        { trainNumber: '99999', trainName: 'Fabricated Express', originCode: 'XYZ', destinationCode: 'ABC' }, // Bogus!
        { trainNumber: '20651', trainName: 'Rani Chennamma Vande Bharat', originCode: 'SBC', destinationCode: 'UBL' }, // False!
      ];
      const validOnly = filterValidTrains(testList);
      expect(validOnly).toHaveLength(1);
      expect(validOnly[0].trainNumber).toBe('20661');
    });
  });

  describe('Priority 2 & 6: Leg-by-Leg Intermodal Routing for the Golden Itinerary', () => {
    // Exact itinerary from the screenshot: Bengaluru -> Hassan -> Belur -> Chikkamagaluru -> Mullayanagiri
    const bengaluruOrigin = KARNATAKA_GATEWAY_ORIGINS.find((o) => o.id === 'origin-bengaluru')!;
    const hassanPoi = getPoiById('poi-shettihalli-church') || {
      id: 'poi-hassan',
      name: 'Hassan Heritage & Shettihalli Rosary Church',
      nameKannada: 'ಹಾಸನ ಶೆಟ್ಟಿಹಳ್ಳಿ ಚರ್ಚ್',
      coordinates: [76.0378, 12.9367] as [number, number],
      category: 'heritage_site' as const,
      macroRegion: 'Malnad & Western Ghats',
      district: 'Hassan',
      rating: 4.7,
      bestSeason: 'Post-Monsoon',
      entryFeeInr: { indianCitizen: 0, foreignNational: 0 },
      timings: '06:00 AM - 06:00 PM',
      localPhrase: { kannada: 'ಹಾಸನ', english: 'Hassan' },
    };
    const belurPoi = getPoiById('poi-belur-halebidu')!;
    const chikkamagaluruPoi = getPoiById('poi-mullayanagiri-peak') || {
      id: 'poi-chikkamagaluru',
      name: 'Chikkamagaluru Coffee Plantations',
      nameKannada: 'ಚಿಕ್ಕಮಗಳೂರು ಕಾಫಿ ತೋಟಗಳು',
      coordinates: [75.7725, 13.3153] as [number, number],
      category: 'nature_wildlife' as const,
      macroRegion: 'Malnad & Western Ghats',
      district: 'Chikkamagaluru',
      rating: 4.8,
      bestSeason: 'Year Round',
      entryFeeInr: { indianCitizen: 0, foreignNational: 0 },
      timings: 'Open All Day',
      localPhrase: { kannada: 'ಚಿಕ್ಕಮಗಳೂರು', english: 'Chikkamagaluru' },
    };
    const mullayanagiriPoi = {
      id: 'poi-mullayanagiri-summit',
      name: 'Mullayanagiri Peak Sanctuary (1,930m)',
      nameKannada: 'ಮುಳ್ಳಯ್ಯನಗಿರಿ ಶಿಖರ (೧,೯೩೦ ಮೀ)',
      coordinates: [75.7214, 13.3911] as [number, number],
      category: 'nature_wildlife' as const,
      macroRegion: 'Malnad & Western Ghats',
      district: 'Chikkamagaluru',
      rating: 4.9,
      bestSeason: 'September - March',
      entryFeeInr: { indianCitizen: 0, foreignNational: 0 },
      timings: '06:00 AM - 05:30 PM',
      localPhrase: { kannada: 'ಕರ್ನಾಟಕದ ಅತ್ಯುನ್ನತ ಶಿಖರ', english: 'Highest peak in Karnataka' },
    };

    const stops = [hassanPoi, belurPoi, chikkamagaluruPoi, mullayanagiriPoi] as unknown as KarnatakaPOI[];
    const legs = buildItineraryLegsTransit(bengaluruOrigin, stops);

    it('breaks down the journey into exactly 4 distinct topological legs', () => {
      expect(legs).toHaveLength(4);
      expect(legs[0].legIndex).toBe(1);
      expect(legs[1].legIndex).toBe(2);
      expect(legs[2].legIndex).toBe(3);
      expect(legs[3].legIndex).toBe(4);
    });

    it('Leg 1 (Bengaluru -> Hassan): provides real SWR trains & KSRTC buses via NH-75', () => {
      const leg1 = legs[0];
      expect(leg1.fromName).toContain('Bengaluru');
      expect(leg1.toName.toLowerCase()).toMatch(/hassan|shettihalli/);
      expect(leg1.railheadStatus).toBe('direct_rail');
      expect(leg1.distanceKm).toBeGreaterThanOrEqual(175);

      // Real verified trains serving Hassan
      const vistadome = leg1.trains.find((t) => t.trainNumber.includes('16539'));
      const gomateshwara = leg1.trains.find((t) => t.trainNumber.includes('16575'));
      expect(vistadome).toBeDefined();
      expect(gomateshwara).toBeDefined();

      // Never shows Bengaluru-Mysuru Vande Bharat in Bengaluru-Hassan leg!
      const mysuruVb = leg1.trains.find((t) => t.destinationCode === 'MYS');
      expect(mysuruVb).toBeUndefined();

      // KSRTC buses via NH-75
      const sarige = leg1.buses.find((b) => b.serviceLabel.includes('Sarige'));
      expect(sarige).toBeDefined();
      expect(sarige?.shaktiFree).toBe(true);
    });

    it('Leg 2 (Hassan -> Belur): specifies NO railway station, with HAS 38km nearest railhead', () => {
      const leg2 = legs[1];
      expect(leg2.fromName.toLowerCase()).toMatch(/hassan|shettihalli/);
      expect(leg2.toName).toContain('Belur');
      expect(leg2.railheadStatus).toBe('road_only_near_railhead');
      expect(leg2.railheadNotice).toContain('Belur has NO railway station');
      expect(leg2.railheadNotice).toContain('Hassan Junction (HAS, 38 km)');

      // ZERO trains because Belur has no station
      expect(leg2.trains).toHaveLength(0);

      // KSRTC frequent non-stop local shuttle enquiry
      expect(leg2.buses.length).toBeGreaterThanOrEqual(1);
      const shuttle = leg2.buses[0];
      expect(shuttle.serviceLabel).toContain('Belur Non-Stop');
      expect(shuttle.shaktiFree).toBe(true);
      expect(shuttle.fareInr).toBeLessThanOrEqual(50);
    });

    it('Leg 3 (Belur -> Chikkamagaluru): 25 km road connection via SH-57', () => {
      const leg3 = legs[2];
      expect(leg3.fromName).toContain('Belur');
      expect(leg3.toName).toContain('Chikkamagaluru');
      expect(leg3.distanceKm).toBe(25);
      expect(leg3.roadAndTaxi.majorHighway).toContain('SH-57');
      expect(leg3.trains).toHaveLength(0);
      expect(leg3.buses.length).toBeGreaterThanOrEqual(1);
    });

    it('Leg 4 (Chikkamagaluru -> Mullayanagiri): mountain peak 1,930m requiring 4WD taxi/jeep', () => {
      const leg4 = legs[3];
      expect(leg4.toName).toContain('Mullayanagiri');
      expect(leg4.railheadStatus).toBe('ghat_4wd_required');
      expect(leg4.railheadNotice).toContain('Mullayanagiri Peak (1,930m)');
      expect(leg4.railheadNotice).toContain('Private 4WD jeep');
      expect(leg4.trains).toHaveLength(0);
      expect(leg4.roadAndTaxi.taxiFareEstimateInr).toBeGreaterThanOrEqual(1200);
      expect(leg4.roadAndTaxi.terrainType).toBe('ghat_hairpin_mountain');
    });
  });

  describe('Priority 1 & 4: Multi-Provider Basemap & External Navigation Handoff', () => {
    it('generates authentic, fully parameterized Google Maps Directions URL', () => {
      const origin: [number, number] = [77.5714, 12.9784]; // SBC
      const stops: [number, number][] = [
        [76.1042, 13.0069], // Hassan
        [75.8601, 13.1624], // Belur
        [75.7214, 13.3911], // Mullayanagiri
      ];
      const gmapsUrl = buildGoogleMapsRouteUrl(origin, stops);
      expect(gmapsUrl).toContain('https://www.google.com/maps/dir/');
      expect(gmapsUrl).toContain('origin=12.9784%2C77.5714');
      expect(gmapsUrl).toContain('destination=13.3911%2C75.7214');
      expect(gmapsUrl).toContain('travelmode=driving');
    });

    it('generates authentic OpenStreetMap Directions URL', () => {
      const origin: [number, number] = [77.5714, 12.9784];
      const stops: [number, number][] = [[75.7214, 13.3911]];
      const osmUrl = buildOpenStreetMapRouteUrl(origin, stops);
      expect(osmUrl).toContain('openstreetmap.org/directions');
      expect(osmUrl).toContain('route=12.9784%2C77.5714%3B13.3911%2C75.7214');
    });

    it('serves valid Carto GL vector styles for Day and Night', () => {
      const dayStyle = getBasemapStyle('bright');
      const nightStyle = getBasemapStyle('dark');
      expect(dayStyle.url).toContain('cartocdn.com');
      expect(nightStyle.url).toContain('cartocdn.com');
    });
  });
});
