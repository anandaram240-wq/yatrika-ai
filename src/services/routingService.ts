// src/services/routingService.ts

import { MAP_PROVIDER_CONFIG } from '../config/mapProviders';
import { ComputedTripRoute, KarnatakaPOI, RouteLegSummary, RouteManeuverStep } from '../types/nammatrip';

/**
 * Computes Great-Circle Haversine distance in kilometers between two [lng, lat] coordinates.
 */
export function computeHaversineKm(coordA: [number, number], coordB: [number, number]): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius km
  const dLat = toRad(coordB[1] - coordA[1]);
  const dLng = toRad(coordB[0] - coordA[0]);
  const lat1 = toRad(coordA[1]);
  const lat2 = toRad(coordB[1]);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

/**
 * Nearest-Neighbor heuristic anchored at the first stop to eliminate highway backtracking.
 */
export function optimizeStopSequence(stops: KarnatakaPOI[]): KarnatakaPOI[] {
  if (stops.length <= 2) return [...stops];

  const remaining = stops.slice(1);
  const ordered: KarnatakaPOI[] = [stops[0]];

  while (remaining.length > 0) {
    const current = ordered[ordered.length - 1];
    let bestIdx = 0;
    let bestDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const d = computeHaversineKm(current.coordinates, remaining[i].coordinates);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }

    ordered.push(remaining.splice(bestIdx, 1)[0]);
  }

  return ordered;
}

/**
 * Generates curved intermediate highway corridor coordinates + realistic road distance/time
 * when the live routing API is offline or rate-limited.
 */
export function buildFallbackRoadCorridor(stops: KarnatakaPOI[]): ComputedTripRoute {
  if (stops.length < 2) {
    return {
      provenance: 'fallback_geodesic_corridor',
      provenanceLabel: 'Select at least 2 stops to compute route',
      totalDistanceKm: 0,
      totalDurationMinutes: 0,
      primaryGeometry: { type: 'LineString', coordinates: stops.map((s) => s.coordinates) },
      legs: [],
    };
  }

  const primaryCoords: [number, number][] = [];
  const altCoords: [number, number][] = [];
  const legs: RouteLegSummary[] = [];
  let totalDistanceKm = 0;
  let totalDurationMinutes = 0;

  for (let i = 0; i < stops.length - 1; i++) {
    const from = stops[i];
    const to = stops[i + 1];
    const airKm = computeHaversineKm(from.coordinates, to.coordinates);

    // Apply realistic terrain winding multiplier (1.42x for Western Ghats/Coastal, 1.26x for plains)
    const isGhatLeg =
      from.macroRegion === 'Malnad & Western Ghats' ||
      to.macroRegion === 'Malnad & Western Ghats' ||
      from.macroRegion === 'Karavali Coastal' ||
      to.macroRegion === 'Karavali Coastal';

    const windingFactor = isGhatLeg ? 1.42 : 1.26;
    const avgSpeedKmh = isGhatLeg ? 42 : 58;

    const roadKm = Math.max(1.5, Number((airKm * windingFactor).toFixed(1)));
    const durationMins = Math.max(5, Math.round((roadKm / avgSpeedKmh) * 60));

    totalDistanceKm += roadKm;
    totalDurationMinutes += durationMins;

    // Generate smooth 12-segment spline curve approximating highway curvature
    const numSegments = 12;
    for (let s = 0; s <= numSegments; s++) {
      if (i > 0 && s === 0) continue;
      const t = s / numSegments;
      const lng = from.coordinates[0] + (to.coordinates[0] - from.coordinates[0]) * t;
      const lat = from.coordinates[1] + (to.coordinates[1] - from.coordinates[1]) * t;

      // Slight lateral arc proportional to leg distance
      const arcOffset = Math.sin(t * Math.PI) * 0.045 * (i % 2 === 0 ? 1 : -1);
      primaryCoords.push([Number((lng + arcOffset).toFixed(5)), Number((lat - arcOffset * 0.5).toFixed(5))]);
      altCoords.push([Number((lng - arcOffset * 0.9).toFixed(5)), Number((lat + arcOffset * 0.7).toFixed(5))]);
    }

    const steps: RouteManeuverStep[] = [
      {
        instruction: `Depart ${from.name} (${from.district}) via State/National Highway corridor`,
        distanceKm: Number((roadKm * 0.35).toFixed(1)),
        durationMinutes: Math.round(durationMins * 0.35),
        roadName: isGhatLeg ? 'NH-66 / Western Ghats State Highway' : 'NH-48 / NH-275',
        maneuverType: 'depart',
      },
      {
        instruction: `Continue toward ${to.district} district (${isGhatLeg ? 'Ghat curves — drive cautiously' : 'Expressway corridor'})`,
        distanceKm: Number((roadKm * 0.55).toFixed(1)),
        durationMinutes: Math.round(durationMins * 0.55),
        roadName: `${from.district}–${to.district} Highway`,
        maneuverType: 'continue',
      },
      {
        instruction: `Arrive at ${to.name}`,
        distanceKm: Number((roadKm * 0.1).toFixed(1)),
        durationMinutes: Math.max(2, Math.round(durationMins * 0.1)),
        roadName: to.name,
        maneuverType: 'arrive',
      },
    ];

    legs.push({
      fromStopId: from.id,
      fromStopName: from.name,
      toStopId: to.id,
      toStopName: to.name,
      distanceKm: roadKm,
      durationMinutes: durationMins,
      steps,
    });
  }

  return {
    provenance: 'fallback_geodesic_corridor',
    provenanceLabel: 'Karnataka Highway Corridor Estimate (Offline-Safe Mode)',
    totalDistanceKm: Number(totalDistanceKm.toFixed(1)),
    totalDurationMinutes,
    primaryGeometry: { type: 'LineString', coordinates: primaryCoords },
    alternativeGeometry: { type: 'LineString', coordinates: altCoords },
    legs,
  };
}

/**
 * Queries live road geometry from OSRM via Vite dev proxy (/osrm-api → router.project-osrm.org)
 * with an 8 second timeout and automatic fallback to buildFallbackRoadCorridor.
 *
 * Priority: Vite proxy → direct OSRM → geodesic fallback
 */
export async function calculateMultiStopRoadRoute(
  stops: KarnatakaPOI[],
  signal?: AbortSignal
): Promise<ComputedTripRoute> {
  if (stops.length < 2) {
    return buildFallbackRoadCorridor(stops);
  }

  const coordsParam = stops.map((s) => `${s.coordinates[0]},${s.coordinates[1]}`).join(';');
  const qs = 'overview=full&geometries=geojson&steps=true&alternatives=true';

  // Try Vite dev-server proxy first (avoids browser SNI / timeout issues in dev)
  // In production build, falls back directly to OSRM public endpoint
  const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const primaryUrl = isDev
    ? `/osrm-api/route/v1/driving/${coordsParam}?${qs}`
    : `${MAP_PROVIDER_CONFIG.osrmBaseUrl}/route/v1/driving/${coordsParam}?${qs}`;
  const fallbackUrl = `${MAP_PROVIDER_CONFIG.osrmBaseUrl}/route/v1/driving/${coordsParam}?${qs}`;

  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), 8000);

  try {
    // Try primary URL (dev proxy or direct)
    let response: Response;
    try {
      response = await fetch(primaryUrl, {
        signal: signal || timeoutController.signal,
      });
    } catch {
      // If proxy fails or we're in prod, try direct OSRM
      if (primaryUrl !== fallbackUrl) {
        response = await fetch(fallbackUrl, {
          signal: signal || timeoutController.signal,
        });
      } else {
        throw new Error('OSRM unreachable');
      }
    }
    clearTimeout(timeoutId);

    if (!response.ok) {
      return buildFallbackRoadCorridor(stops);
    }

    const data = await response.json();
    if (data.code !== 'Ok' || !Array.isArray(data.routes) || data.routes.length === 0) {
      return buildFallbackRoadCorridor(stops);
    }

    const primaryRoute = data.routes[0];
    const altRoute = data.routes.length > 1 ? data.routes[1] : undefined;

    const legs: RouteLegSummary[] = (primaryRoute.legs || []).map(
      (
        leg: {
          distance: number;
          duration: number;
          steps?: Array<{
            distance: number;
            duration: number;
            name?: string;
            maneuver?: { type?: string; modifier?: string };
          }>;
        },
        idx: number
      ) => {
        const fromStop = stops[idx];
        const toStop = stops[idx + 1];

        const steps: RouteManeuverStep[] = (leg.steps || [])
          .filter((st) => st.distance > 50)
          .slice(0, 8)
          .map((st) => {
            const mType = st.maneuver?.type || 'continue';
            const mod = st.maneuver?.modifier ? ` (${st.maneuver.modifier})` : '';
            const road = st.name && st.name.trim().length > 0 ? st.name : 'Regional Highway';
            return {
              instruction: `${mType.charAt(0).toUpperCase() + mType.slice(1)}${mod} onto ${road}`,
              distanceKm: Number((st.distance / 1000).toFixed(1)),
              durationMinutes: Math.max(1, Math.round(st.duration / 60)),
              roadName: road,
              maneuverType: mType,
            };
          });

        return {
          fromStopId: fromStop?.id || `stop-${idx}`,
          fromStopName: fromStop?.name || `Stop ${idx + 1}`,
          toStopId: toStop?.id || `stop-${idx + 1}`,
          toStopName: toStop?.name || `Stop ${idx + 2}`,
          distanceKm: Number((leg.distance / 1000).toFixed(1)),
          durationMinutes: Math.max(1, Math.round(leg.duration / 60)),
          steps,
        };
      }
    );

    return {
      provenance: 'live_osrm',
      provenanceLabel: 'Live OSRM Street & Highway Geometry',
      totalDistanceKm: Number((primaryRoute.distance / 1000).toFixed(1)),
      totalDurationMinutes: Math.max(1, Math.round(primaryRoute.duration / 60)),
      primaryGeometry: primaryRoute.geometry,
      alternativeGeometry: altRoute?.geometry,
      legs,
    };
  } catch {
    clearTimeout(timeoutId);
    return buildFallbackRoadCorridor(stops);
  }
}
