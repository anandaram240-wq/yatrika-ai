/**
 * @file src/geo/roadSegmentAnalyzer.ts
 * @description Segment-level road geometry, winding factor, and curvature analysis.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface SegmentCurvatureAnalysis {
  roadDistanceKm: number;
  euclideanDistanceKm: number;
  windingFactor: number; // Wf = L_road / L_euclidean
  terrainType: 'expressway_plain' | 'rolling_foothills' | 'ghat_pass';
  estimatedHairpinCount: number;
  minimumRadiusEstimateM: number;
  effectiveSpeedKmH: number;
}

/**
 * Computes Haversine geodesic distance in km between two [lng, lat] coordinates.
 */
function haversineKm(c1: [number, number], c2: [number, number]): number {
  const R = 6371;
  const dLat = ((c2[1] - c1[1]) * Math.PI) / 180;
  const dLon = ((c2[0] - c1[0]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((c1[1] * Math.PI) / 180) *
      Math.cos((c2[1] * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export class RoadSegmentAnalyzer {
  /**
   * Analyzes an array of coordinate nodes representing a road segment polyline.
   */
  public static analyzeSegmentGeometry(coords: [number, number][], baselineNominalSpeed = 80): SegmentCurvatureAnalysis {
    if (coords.length < 2) {
      return {
        roadDistanceKm: 0,
        euclideanDistanceKm: 0,
        windingFactor: 1.0,
        terrainType: 'expressway_plain',
        estimatedHairpinCount: 0,
        minimumRadiusEstimateM: 100,
        effectiveSpeedKmH: baselineNominalSpeed,
      };
    }

    const start = coords[0];
    const end = coords[coords.length - 1];
    const euclideanDistanceKm = Math.max(0.01, haversineKm(start, end));

    let roadDistanceKm = 0;
    let sharpBendCount = 0;
    let minRadius = 100;

    for (let i = 0; i < coords.length - 1; i++) {
      const stepDist = haversineKm(coords[i], coords[i + 1]);
      roadDistanceKm += stepDist;

      // Check sharp turn angles
      if (i > 0 && i < coords.length - 1) {
        const p1 = coords[i - 1];
        const p2 = coords[i];
        const p3 = coords[i + 1];

        const b1 = Math.atan2(p2[0] - p1[0], p2[1] - p1[1]);
        const b2 = Math.atan2(p3[0] - p2[0], p3[1] - p2[1]);
        let diff = Math.abs(b2 - b1) * (180 / Math.PI);
        if (diff > 180) diff = 360 - diff;

        if (diff > 75) {
          sharpBendCount++;
          const approxRadius = Math.max(10, Math.round(stepDist * 1000 * Math.sin(diff / 2)));
          if (approxRadius < minRadius) {
            minRadius = approxRadius;
          }
        }
      }
    }

    const windingFactor = Number((roadDistanceKm / euclideanDistanceKm).toFixed(2));

    let terrainType: 'expressway_plain' | 'rolling_foothills' | 'ghat_pass' = 'expressway_plain';
    let speedPenalty = 1.0;

    if (windingFactor > 1.35 || sharpBendCount >= 6) {
      terrainType = 'ghat_pass';
      speedPenalty = 0.48; // Max 40 km/h in ghats
    } else if (windingFactor > 1.15 || sharpBendCount >= 2) {
      terrainType = 'rolling_foothills';
      speedPenalty = 0.75;
    }

    const effectiveSpeedKmH = Math.round(baselineNominalSpeed * speedPenalty);

    return {
      roadDistanceKm: Number(roadDistanceKm.toFixed(2)),
      euclideanDistanceKm: Number(euclideanDistanceKm.toFixed(2)),
      windingFactor,
      terrainType,
      estimatedHairpinCount: sharpBendCount,
      minimumRadiusEstimateM: sharpBendCount > 0 ? minRadius : 100,
      effectiveSpeedKmH,
    };
  }
}
