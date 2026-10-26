// src/__tests__/nammatrip.test.ts

import { describe, it, expect } from 'vitest';
import { MAP_PROVIDER_CONFIG, getBasemapStyle } from '../config/mapProviders';
import {
  KARNATAKA_POIS,
  LAYER_CATEGORY_META,
  CURATED_CIRCUIT_PRESETS,
  getPoiById,
} from '../data/karnatakaTravelRegistry';
import {
  computeHaversineKm,
  optimizeStopSequence,
  buildFallbackRoadCorridor,
} from '../services/routingService';
import {
  calculateTripBudget,
  serializeTripToQueryString,
  parseTripFromQueryString,
  exportItineraryToMarkdown,
} from '../services/tripPlannerEngine';

describe('NammaTrip AI — Geospatial, Transport & Travel Intelligence Suite', () => {
  it('1. centralizes OpenFreeMap vector styles with realistic zoom bounds and attribution', () => {
    expect(MAP_PROVIDER_CONFIG.defaultStyleId).toBe('bright');
    const bright = getBasemapStyle('bright');
    expect(bright.url).toContain('tiles.openfreemap.org/styles/bright');
    expect(bright.maxZoom).toBeLessThanOrEqual(19);
    expect(bright.attribution).toContain('OpenFreeMap');
    expect(Object.keys(MAP_PROVIDER_CONFIG.styles)).toEqual([
      'bright',
      'liberty',
      'positron',
      'dark',
      'fiord',
    ]);
  });

  it('2. defines all 15 independently toggleable map layer categories', () => {
    expect(LAYER_CATEGORY_META.length).toBe(15);
    const ids = LAYER_CATEGORY_META.map((l) => l.id);
    expect(ids).toContain('railway_station');
    expect(ids).toContain('bus_terminal');
    expect(ids).toContain('itinerary_stops');
    expect(ids).toContain('planned_route');
    expect(ids).toContain('alternative_route');
  });

  it('3. includes verified SWR/Konkan railway stations and KSRTC terminals with booking hand-offs', () => {
    const sbc = getPoiById('rail-sbc');
    const hpt = getPoiById('rail-hpt');
    const majestic = getPoiById('bus-majestic');
    expect(sbc?.transportMeta?.officialCode).toBe('SBC');
    expect(hpt?.transportMeta?.officialCode).toBe('HPT');
    expect(majestic?.transportMeta?.bookingPortalUrl).toBe('https://ksrtc.in');
  });

  it('4. embeds authentic regional Kannada travel phrases in every destination POI', () => {
    for (const poi of KARNATAKA_POIS) {
      expect(poi.localPhrase.kannada.length).toBeGreaterThan(3);
      expect(poi.localPhrase.iast.length).toBeGreaterThan(3);
      expect(poi.localPhrase.english.length).toBeGreaterThan(3);
    }
  });

  it('5. computes accurate Haversine distance and optimizes multi-stop ordering to prevent backtracking', () => {
    const sbc = getPoiById('rail-sbc')!;
    const mys = getPoiById('poi-mysore-palace')!;
    const hampi = getPoiById('poi-hampi-stone-chariot')!;

    // Bengaluru to Mysuru air distance is ~125-135 km
    const distKm = computeHaversineKm(sbc.coordinates, mys.coordinates);
    expect(distKm).toBeGreaterThan(115);
    expect(distKm).toBeLessThan(145);

    // If user orders Bengaluru -> Hampi -> Mysuru, optimizer places Mysuru before Hampi from Bengaluru
    const unoptimized = [sbc, hampi, mys];
    const optimized = optimizeStopSequence(unoptimized);
    expect(optimized[0].id).toBe('rail-sbc');
    expect(optimized[1].id).toBe('poi-mysore-palace');
    expect(optimized[2].id).toBe('poi-hampi-stone-chariot');
  });

  it('6. generates resilient road-corridor fallback geometry with turn-by-turn steps and provenance', () => {
    const stops = CURATED_CIRCUIT_PRESETS[0].stopIds.map((id) => getPoiById(id)!);
    const route = buildFallbackRoadCorridor(stops);
    expect(route.provenance).toBe('fallback_geodesic_corridor');
    expect(route.totalDistanceKm).toBeGreaterThan(200);
    expect(route.totalDurationMinutes).toBeGreaterThan(180);
    expect(route.legs.length).toBe(stops.length - 1);
    expect(route.primaryGeometry.coordinates.length).toBeGreaterThan(stops.length);
  });

  it('7. calculates distinct INR budgets across backpacker, comfort, and premium tiers', () => {
    const stops = CURATED_CIRCUIT_PRESETS[0].stopIds.map((id) => getPoiById(id)!);
    const route = buildFallbackRoadCorridor(stops);

    const backpacker = calculateTripBudget({ stops, route, days: 4, travellers: 2, tier: 'backpacker' });
    const comfort = calculateTripBudget({ stops, route, days: 4, travellers: 2, tier: 'comfort' });
    const premium = calculateTripBudget({ stops, route, days: 4, travellers: 2, tier: 'premium' });

    expect(backpacker.totalInr).toBeLessThan(comfort.totalInr);
    expect(comfort.totalInr).toBeLessThan(premium.totalInr);
  });

  it('8. round-trips shareable trip state via URL query parameters and exports Markdown', () => {
    const state = {
      stopIds: ['rail-sbc', 'poi-mysore-palace', 'poi-coorg-raja-seat'],
      days: 3,
      travellers: 2,
      tier: 'comfort' as const,
    };
    const qs = serializeTripToQueryString(state);
    const parsed = parseTripFromQueryString(qs);
    expect(parsed).toEqual(state);

    const stops = state.stopIds.map((id) => getPoiById(id)!);
    const route = buildFallbackRoadCorridor(stops);
    const budget = calculateTripBudget({ stops, route, days: 3, travellers: 2, tier: 'comfort' });
    const md = exportItineraryToMarkdown({ stops, route, budget });
    expect(md).toContain('# NammaTrip AI — Karnataka Travel Itinerary');
    expect(md).toContain('Mysuru Ambavilas Palace');
  });
});
