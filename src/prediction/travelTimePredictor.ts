/**
 * @file src/prediction/travelTimePredictor.ts
 * @description Probabilistic travel duration and ETA predictor with uncertainty intervals for Karnataka highway & ghat corridors.
 * @theme Code. Create. Celebrate Kannada.
 */

import { UncertaintyEstimator, UncertaintyInterval, PredictionMetadata } from './uncertaintyEstimator';

export interface TravelTimePrediction {
  nominalDurationMinutes: number;
  expectedDurationMinutes: number;
  interval: UncertaintyInterval<number>;
  peakHourSurchargeMinutes: number;
  terrainSlowdownMinutes: number;
  recommendedDepartureWindow: string;
  metadata: PredictionMetadata;
}

export interface RouteConditionsInput {
  baseDistanceKm: number;
  isGhatSection: boolean;
  sinuosityFactor?: number; // W_f
  departureHour: number; // 0 - 23
  isWeekend: boolean;
  currentPrecipitationMm?: number;
}

export class TravelTimePredictor {
  private static readonly MODEL_ID = 'yatrika-probabilistic-eta-v4.1';

  /**
   * Predict travel duration with statistical confidence bounds.
   */
  public static predictDuration(input: RouteConditionsInput): TravelTimePrediction {
    const { baseDistanceKm, isGhatSection, sinuosityFactor = 1.0, departureHour, isWeekend, currentPrecipitationMm = 0 } = input;

    // Nominal speed baseline: 65 km/h for plains highways, 32 km/h for ghats
    const baseSpeed = isGhatSection ? 32 : 65;
    const nominalDurationMinutes = Math.round((baseDistanceKm / baseSpeed) * 60);

    // Peak hour analysis (e.g. 07:00-10:00 and 17:00-20:30 exit bottlenecks)
    let peakMultiplier = 1.0;
    if ((departureHour >= 7 && departureHour <= 10) || (departureHour >= 17 && departureHour <= 20)) {
      peakMultiplier = isWeekend ? 1.35 : 1.25;
    } else if (departureHour >= 22 || departureHour <= 5) {
      peakMultiplier = 0.92; // Night highway clearance
    }

    const peakHourSurchargeMinutes = Math.round(nominalDurationMinutes * (peakMultiplier - 1.0));

    // Terrain & curvature penalty (sinuosity > 1.15 adds heavy curve deceleration)
    let terrainSlowdownMinutes = 0;
    if (isGhatSection) {
      const curveFactor = Math.max(1.0, sinuosityFactor);
      terrainSlowdownMinutes = Math.round(nominalDurationMinutes * (curveFactor - 1.0) * 0.7);
    }

    // Weather impact penalty (monsoon rain reduces visibility and safe braking speed)
    let weatherPenaltyMinutes = 0;
    if (currentPrecipitationMm > 15) {
      weatherPenaltyMinutes = Math.round(nominalDurationMinutes * 0.25);
    } else if (currentPrecipitationMm > 5) {
      weatherPenaltyMinutes = Math.round(nominalDurationMinutes * 0.12);
    }

    const expectedDurationMinutes = Math.max(
      10,
      nominalDurationMinutes + peakHourSurchargeMinutes + terrainSlowdownMinutes + weatherPenaltyMinutes
    );

    // Standard deviation is wider on ghats and heavy rain
    const stdDevPercent = (isGhatSection ? 0.22 : 0.12) + (currentPrecipitationMm > 10 ? 0.08 : 0);
    const stdDev = expectedDurationMinutes * stdDevPercent;

    const interval = UncertaintyEstimator.calculateInterval(expectedDurationMinutes, stdDev, 0.90, 50);

    // Optimal departure suggestion
    let recommendedDepartureWindow = '06:00 - 07:30 (Early morning bypass avoid Nelamangala congestion)';
    if (departureHour >= 12 && departureHour <= 15) {
      recommendedDepartureWindow = '13:00 - 14:00 (Post-noon transit before evening ghat fog)';
    }

    return {
      nominalDurationMinutes,
      expectedDurationMinutes,
      interval,
      peakHourSurchargeMinutes,
      terrainSlowdownMinutes,
      recommendedDepartureWindow,
      metadata: {
        modelId: this.MODEL_ID,
        modelVersion: '4.1.0-karnataka',
        generatedAt: new Date().toISOString(),
        dataWindowDays: 90,
        knownLimitations: [
          'Does not account for unnotified sudden vehicular breakdowns in single-lane ghat culverts',
          'Toll booth FASTag delay variance may add ±10 mins during holiday weekends',
        ],
      },
    };
  }
}
