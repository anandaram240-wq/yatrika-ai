/**
 * @file src/prediction/weatherRiskForecast.ts
 * @description Weather-related travel disruption risk and scenic visibility forecasting.
 * @theme Code. Create. Celebrate Kannada.
 */

import { PredictionMetadata } from './uncertaintyEstimator';

export type WeatherRiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface WeatherRiskAssessment {
  disruptionProbability: number; // 0.0 to 1.0
  riskLevel: WeatherRiskLevel;
  scenicVisibilityScore: number; // 0 (dense fog/heavy rain) to 100 (crystal clear vista)
  monsoonAdvisoryLevel: 'NONE' | 'YELLOW' | 'ORANGE' | 'RED';
  isGhatMistLikely: boolean;
  travelGuidanceKannada: string;
  travelGuidanceEnglish: string;
  metadata: PredictionMetadata;
}

export interface WeatherInputs {
  precipMm: number;
  windKmh: number;
  elevationMeters?: number;
  isGhatCorridor: boolean;
  timeOfDayHour: number;
  month: number; // 1 - 12 (6-9 is SW Monsoon, 10-11 is NE Retreating Monsoon)
}

export class WeatherRiskForecast {
  private static readonly MODEL_ID = 'yatrika-ghat-weather-risk-v4.0';

  public static assessRisk(inputs: WeatherInputs): WeatherRiskAssessment {
    const { precipMm, windKmh, elevationMeters = 500, isGhatCorridor, timeOfDayHour, month } = inputs;

    // Monsoon month factor: July-August is peak Western Ghats rain (Agumbe/Bhagamandala)
    const isPeakMonsoon = month >= 6 && month <= 9;

    // Disruption probability calculation
    let disruptionProbability = 0.05; // Baseline road travel friction

    if (precipMm > 50) {
      disruptionProbability += 0.55;
    } else if (precipMm > 20) {
      disruptionProbability += 0.35;
    } else if (precipMm > 5) {
      disruptionProbability += 0.15;
    }

    if (windKmh > 55) {
      disruptionProbability += 0.25;
    } else if (windKmh > 35) {
      disruptionProbability += 0.10;
    }

    if (isGhatCorridor) {
      disruptionProbability *= 1.35;
    }

    disruptionProbability = Math.min(0.98, Math.max(0.02, Math.round(disruptionProbability * 100) / 100));

    let riskLevel: WeatherRiskLevel = 'LOW';
    let advisory: WeatherRiskAssessment['monsoonAdvisoryLevel'] = 'NONE';

    if (disruptionProbability >= 0.75) {
      riskLevel = 'CRITICAL';
      advisory = 'RED';
    } else if (disruptionProbability >= 0.50) {
      riskLevel = 'HIGH';
      advisory = 'ORANGE';
    } else if (disruptionProbability >= 0.25) {
      riskLevel = 'MODERATE';
      advisory = 'YELLOW';
    }

    // Scenic visibility (peak summits like Mullayanagiri, Agumbe, Kodachadri)
    const isSummit = elevationMeters > 1000;
    const isMorningFogWindow = timeOfDayHour >= 5 && timeOfDayHour <= 8;
    const isEveningFogWindow = timeOfDayHour >= 18 && timeOfDayHour <= 21;

    let visibility = 95;
    if (precipMm > 20) visibility -= 60;
    else if (precipMm > 5) visibility -= 30;

    if (isSummit && (isMorningFogWindow || isPeakMonsoon)) {
      visibility -= 40;
    }
    if (isGhatCorridor && isEveningFogWindow) {
      visibility -= 25;
    }
    visibility = Math.max(5, Math.min(100, visibility));

    const isGhatMistLikely = isGhatCorridor && (precipMm > 2 || isMorningFogWindow || isEveningFogWindow || isPeakMonsoon);

    // Contextual bilingual guidance
    let guidanceEn = 'Favorable weather for highway and mountain travel.';
    let guidanceKn = 'ಪ್ರಯಾಣಕ್ಕೆ ಸೂಕ್ತವಾದ ತಿಳಿಯಾದ ಹವಾಮಾನವಿದೆ.';

    if (riskLevel === 'CRITICAL') {
      guidanceEn = 'Torrential rain alert. Heavy water logging and reduced ghat visibility. Avoid non-essential ghat travel after sunset.';
      guidanceKn = 'ಭಾರೀ ಮಳೆ ಮುನ್ನೆಚ್ಚರಿಕೆ. ಘಾಟಿ ಮಾರ್ಗಗಳಲ್ಲಿ ಮಂಜು ಮತ್ತು ಜಾರುವ ರಸ್ತೆಗಳು. ಸೂರ್ಯಾಸ್ತದ ನಂತರ ಪ್ರಯಾಣ ತಪ್ಪಿಸಿ.';
    } else if (riskLevel === 'HIGH') {
      guidanceEn = 'Moderate-to-heavy rain and gusty winds. Keep headlights on in ghat bends.';
      guidanceKn = 'ಮಧ್ಯಮದಿಂದ ಭಾರೀ ಮಳೆ ಸಾಧ್ಯತೆ. ಘಾಟಿ ತಿರುವುಗಳಲ್ಲಿ ಮುಂಭಾಗದ ಬೆಳಕನ್ನು (fog lights) ಚಾಲನೆಯಲ್ಲಿಡಿ.';
    }

    return {
      disruptionProbability,
      riskLevel,
      scenicVisibilityScore: visibility,
      monsoonAdvisoryLevel: advisory,
      isGhatMistLikely,
      travelGuidanceEnglish: guidanceEn,
      travelGuidanceKannada: guidanceKn,
      metadata: {
        modelId: this.MODEL_ID,
        modelVersion: '4.0.0',
        generatedAt: new Date().toISOString(),
        dataWindowDays: 30,
        knownLimitations: [
          'Microclimate shifts in dense Western Ghats valleys can alter visibility in under 15 minutes',
          'Does not replace official district commissioner (DC) disaster alerts',
        ],
      },
    };
  }
}
