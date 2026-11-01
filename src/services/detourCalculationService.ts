/**
 * src/services/detourCalculationService.ts
 * Route-Aware Discovery: computes real road detours for POIs near a route.
 *
 * Uses OSRM to calculate actual detour distance and duration — never straight-line.
 * Falls back to haversine with an explicit ESTIMATED label when OSRM is unavailable.
 */

import { KarnatakaPOI } from '../types/nammatrip';
import { computeHaversineKm } from './routingService';
import { MAP_PROVIDER_CONFIG } from '../config/mapProviders';

export type DetourDataStatus = 'road_verified' | 'road_estimated' | 'haversine_fallback';

export interface DetourResult {
  poi: KarnatakaPOI;
  /** Haversine distance from midpoint of the route — used for initial filtering only */
  haversineFromMidpointKm: number;
  /** Additional road distance in km caused by the detour. NEVER haversine. */
  additionalRoadDistanceKm: number | null;
  /** Additional road duration in minutes caused by the detour. */
  additionalRoadDurationMinutes: number | null;
  /** Suggested dwell time at the POI */
  suggestedVisitDurationMinutes: number;
  /** Total additional time: drive to + visit at + drive back to route */
  totalAdditionalTimeMinutes: number | null;
  /** Data status label shown to the user */
  dataStatus: DetourDataStatus;
  /** Human-readable note about data quality */
  dataStatusNote: string;
}

/**
 * Find POIs near the midpoint of a route (Bengaluru→Destination).
 * Returns haversine-filtered candidates for display BEFORE OSRM detour computation.
 *
 * @param fromCoord - Origin [lng, lat]
 * @param toCoord - Destination [lng, lat]
 * @param allPois - Full Karnataka POI list
 * @param maxHaversineFromMidpointKm - Candidates within this radius of the route midpoint
 */
export function getCandidateDetours(
  fromCoord: [number, number],
  toCoord: [number, number],
  allPois: KarnatakaPOI[],
  maxHaversineFromMidpointKm = 55
): Array<{ poi: KarnatakaPOI; haversineFromMidpointKm: number }> {
  // Route midpoint
  const midLng = (fromCoord[0] + toCoord[0]) / 2;
  const midLat = (fromCoord[1] + toCoord[1]) / 2;
  const midCoord: [number, number] = [midLng, midLat];

  // Also check quarter-points to cover long routes
  const q1Coord: [number, number] = [
    (fromCoord[0] + midLng) / 2,
    (fromCoord[1] + midLat) / 2,
  ];
  const q3Coord: [number, number] = [
    (midLng + toCoord[0]) / 2,
    (midLat + toCoord[1]) / 2,
  ];

  const candidates: Array<{ poi: KarnatakaPOI; haversineFromMidpointKm: number }> = [];

  for (const poi of allPois) {
    // Skip transport hubs
    if (poi.category === 'railway_station' || poi.category === 'bus_terminal' || poi.category === 'airport') {
      continue;
    }

    const distFromMid = computeHaversineKm(midCoord, poi.coordinates);
    const distFromQ1 = computeHaversineKm(q1Coord, poi.coordinates);
    const distFromQ3 = computeHaversineKm(q3Coord, poi.coordinates);

    // Also ensure the POI is not too close to origin or destination (already on route)
    const distFromOrigin = computeHaversineKm(fromCoord, poi.coordinates);
    const distFromDest = computeHaversineKm(toCoord, poi.coordinates);
    if (distFromOrigin < 8 || distFromDest < 8) continue;

    const minDist = Math.min(distFromMid, distFromQ1, distFromQ3);

    if (minDist <= maxHaversineFromMidpointKm) {
      candidates.push({ poi, haversineFromMidpointKm: Number(minDist.toFixed(1)) });
    }
  }

  // Sort by proximity to route, limit to 12
  return candidates
    .sort((a, b) => a.haversineFromMidpointKm - b.haversineFromMidpointKm)
    .slice(0, 12);
}

/**
 * Compute the actual road detour for a single POI along a route A→B.
 *
 * Original route: A → B
 * Detour route:   A → POI → B
 * Detour cost:    (A→POI→B distance) - (A→B distance)
 *
 * Uses OSRM; falls back to haversine estimation (×1.35 road factor) with ESTIMATED label.
 */
export async function computeRoadDetour(
  fromCoord: [number, number],
  toCoord: [number, number],
  poi: KarnatakaPOI,
  haversineFromMidpointKm: number,
  signal?: AbortSignal
): Promise<DetourResult> {
  const suggestedVisitDurationMinutes = Math.round((poi.recommendedHours || 1.5) * 60);

  // Try OSRM for real road detour
  try {
    const coords = [fromCoord, poi.coordinates, toCoord]
      .map(c => `${c[0]},${c[1]}`)
      .join(';');

    const directCoords = `${fromCoord[0]},${fromCoord[1]};${toCoord[0]},${toCoord[1]}`;

    const qs = 'overview=false&steps=false';
    const baseUrl = MAP_PROVIDER_CONFIG.osrmBaseUrl;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    if (signal) {
      signal.addEventListener('abort', () => controller.abort(), { once: true });
    }

    try {
      const [detourResponse, directResponse] = await Promise.all([
        fetch(`${baseUrl}/route/v1/driving/${coords}?${qs}`, { signal: controller.signal }),
        fetch(`${baseUrl}/route/v1/driving/${directCoords}?${qs}`, { signal: controller.signal }),
      ]);
      clearTimeout(timeoutId);

      if (!detourResponse.ok || !directResponse.ok) throw new Error('OSRM response error');

      const [detourData, directData] = await Promise.all([
        detourResponse.json(),
        directResponse.json(),
      ]);

      if (
        detourData.code !== 'Ok' ||
        directData.code !== 'Ok' ||
        !detourData.routes?.[0] ||
        !directData.routes?.[0]
      ) {
        throw new Error('OSRM route invalid');
      }

      const detourDistKm = Number((detourData.routes[0].distance / 1000).toFixed(1));
      const directDistKm = Number((directData.routes[0].distance / 1000).toFixed(1));
      const detourDurMin = Math.round(detourData.routes[0].duration / 60);
      const directDurMin = Math.round(directData.routes[0].duration / 60);

      const additionalDistKm = Number(Math.max(0, detourDistKm - directDistKm).toFixed(1));
      const additionalDurMin = Math.max(0, detourDurMin - directDurMin);
      const totalAdditionalMin = additionalDurMin + suggestedVisitDurationMinutes;

      return {
        poi,
        haversineFromMidpointKm,
        additionalRoadDistanceKm: additionalDistKm,
        additionalRoadDurationMinutes: additionalDurMin,
        suggestedVisitDurationMinutes,
        totalAdditionalTimeMinutes: totalAdditionalMin,
        dataStatus: 'road_verified',
        dataStatusNote: 'Road detour calculated via OSRM street network.',
      };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch {
    // Haversine fallback with road factor
    // Apply 1.35× road winding factor — clearly labelled ESTIMATED
    const hav = computeHaversineKm(fromCoord, toCoord);
    const detourHav =
      computeHaversineKm(fromCoord, poi.coordinates) +
      computeHaversineKm(poi.coordinates, toCoord);
    const additionalHavKm = Math.max(0, detourHav - hav);
    const additionalEstimatedKm = Number((additionalHavKm * 1.35).toFixed(1));
    // Estimate 45 km/h average road speed through Karnataka hills
    const additionalEstimatedMin = Math.round((additionalEstimatedKm / 45) * 60);
    const totalAdditionalMin = additionalEstimatedMin + suggestedVisitDurationMinutes;

    return {
      poi,
      haversineFromMidpointKm,
      additionalRoadDistanceKm: additionalEstimatedKm,
      additionalRoadDurationMinutes: additionalEstimatedMin,
      suggestedVisitDurationMinutes,
      totalAdditionalTimeMinutes: totalAdditionalMin,
      dataStatus: 'haversine_fallback',
      dataStatusNote:
        '~ ESTIMATED: Road network unavailable. Straight-line distance × 1.35 road factor. Verify before adding to itinerary.',
    };
  }
}

/**
 * Batch compute detours for all candidates.
 * Returns results progressively — use with React state updates.
 */
export async function computeBatchDetours(
  fromCoord: [number, number],
  toCoord: [number, number],
  candidates: Array<{ poi: KarnatakaPOI; haversineFromMidpointKm: number }>,
  onProgress?: (result: DetourResult) => void,
  signal?: AbortSignal
): Promise<DetourResult[]> {
  const results: DetourResult[] = [];

  // Process in parallel batches of 3 to avoid rate limiting
  for (let i = 0; i < candidates.length; i += 3) {
    if (signal?.aborted) break;

    const batch = candidates.slice(i, i + 3);
    const batchResults = await Promise.all(
      batch.map(c => computeRoadDetour(fromCoord, toCoord, c.poi, c.haversineFromMidpointKm, signal))
    );

    for (const result of batchResults) {
      results.push(result);
      onProgress?.(result);
    }

    // Small delay between batches
    if (i + 3 < candidates.length) {
      await new Promise(r => setTimeout(r, 150));
    }
  }

  return results.sort((a, b) => (a.additionalRoadDistanceKm ?? 999) - (b.additionalRoadDistanceKm ?? 999));
}
