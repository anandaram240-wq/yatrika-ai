/**
 * @file src/geo/routeReliability.ts
 * @description Route reliability scoring and ETA uncertainty bounds estimation.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface RouteReliabilityAnalysis {
  reliabilityScore: number; // 0 - 100
  reliabilityGrade: 'A_EXCELLENT' | 'B_GOOD' | 'C_MODERATE' | 'D_VOLATILE' | 'F_CRITICAL';
  estimatedDriveMinutes: number;
  uncertaintyRangeMinutes: [number, number]; // [minExpected, maxExpected]
  potentialBottlenecks: string[];
  factors: {
    terrainPenalty: number;
    weatherPenalty: number;
    staleDataPenalty: number;
  };
}

export class RouteReliability {
  /**
   * Computes reliability score and ETA uncertainty interval.
   */
  public static evaluateRoute(params: {
    nominalDriveMinutes: number;
    windingFactor: number;
    precipitationMm: number;
    isGhatPass: boolean;
    dataAgeMinutes: number;
  }): RouteReliabilityAnalysis {
    const { nominalDriveMinutes, windingFactor, precipitationMm, isGhatPass, dataAgeMinutes } = params;

    let score = 100;
    const bottlenecks: string[] = [];

    // Terrain impact
    let terrainPenalty = 0;
    if (isGhatPass) {
      terrainPenalty += 18;
      bottlenecks.push('Ghat hairpin bends reduce average transit pace');
    }
    if (windingFactor > 1.35) {
      terrainPenalty += 10;
      bottlenecks.push(`High road curvature (Winding factor: ${windingFactor})`);
    }
    score -= terrainPenalty;

    // Weather impact
    let weatherPenalty = 0;
    if (precipitationMm > 15.0) {
      weatherPenalty += 25;
      bottlenecks.push(`Heavy rainfall (${precipitationMm.toFixed(1)} mm/h) slows traffic`);
    } else if (precipitationMm > 5.0) {
      weatherPenalty += 10;
      bottlenecks.push(`Moderate wet surface conditions (${precipitationMm.toFixed(1)} mm/h)`);
    }
    score -= weatherPenalty;

    // Staleness
    let staleDataPenalty = 0;
    if (dataAgeMinutes > 60) {
      staleDataPenalty += 8;
    }
    score -= staleDataPenalty;

    score = Math.max(10, Math.min(100, score));

    let reliabilityGrade: RouteReliabilityAnalysis['reliabilityGrade'] = 'A_EXCELLENT';
    if (score < 40) reliabilityGrade = 'F_CRITICAL';
    else if (score < 60) reliabilityGrade = 'D_VOLATILE';
    else if (score < 75) reliabilityGrade = 'C_MODERATE';
    else if (score < 90) reliabilityGrade = 'B_GOOD';

    // Uncertainty range in minutes
    const volatilityFactor = (100 - score) / 100;
    const deltaMin = Math.round(nominalDriveMinutes * 0.05);
    const deltaMax = Math.round(nominalDriveMinutes * (0.10 + volatilityFactor * 0.40));

    const minExpected = Math.max(1, nominalDriveMinutes - deltaMin);
    const maxExpected = nominalDriveMinutes + deltaMax;

    return {
      reliabilityScore: score,
      reliabilityGrade,
      estimatedDriveMinutes: nominalDriveMinutes,
      uncertaintyRangeMinutes: [minExpected, maxExpected],
      potentialBottlenecks: bottlenecks,
      factors: {
        terrainPenalty,
        weatherPenalty,
        staleDataPenalty,
      },
    };
  }
}
