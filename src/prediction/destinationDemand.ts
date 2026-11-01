/**
 * @file src/prediction/destinationDemand.ts
 * @description Seasonal and day-of-week visitor demand and crowd forecaster for Karnataka POIs.
 * @theme Code. Create. Celebrate Kannada.
 */

import { PredictionMetadata } from './uncertaintyEstimator';

export type CrowdLevel = 'LOW' | 'MODERATE' | 'PEAK' | 'EXTREME_SURGE';

export interface DestinationDemandForecast {
  poiId: string;
  crowdScore: number; // 0 to 100
  crowdLevel: CrowdLevel;
  estimatedDarshanWaitMinutes?: number;
  recommendedTimeWindow: string;
  isSpecialFestivalDay: boolean;
  festivalLabel?: string;
  metadata: PredictionMetadata;
}

export class DestinationDemandForecaster {
  private static readonly MODEL_ID = 'yatrika-karnataka-demand-v4.0';

  /**
   * Forecasts visitor crowd density based on date, day of week, POI category, and known Karnataka cultural cycles.
   */
  public static forecastDemand(
    poiId: string,
    category: string,
    date: Date = new Date(),
    macroRegion: string = 'Old Mysuru'
  ): DestinationDemandForecast {
    const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
    const month = date.getMonth() + 1; // 1-12
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let baseScore = 30; // Average baseline

    // Category baseline
    if (category === 'temple') {
      baseScore = isWeekend ? 75 : 45;
      // Tuesday, Friday, Sunday are special puja days in South India
      if (dayOfWeek === 2 || dayOfWeek === 5) baseScore += 15;
    } else if (category === 'heritage') {
      baseScore = isWeekend ? 65 : 35;
      // Winter months (Nov - Feb) are peak for Hampi, Badami, Mysuru
      if (month >= 11 || month <= 2) baseScore += 20;
    } else if (category === 'beach_coastal') {
      // Nov - Feb peak coastal season
      baseScore = (month >= 11 || month <= 2) ? 70 : 35;
      if (isWeekend) baseScore += 20;
    } else if (category === 'hill_trek') {
      // Monsoon / Post-monsoon lush season (Aug - Dec)
      baseScore = (month >= 8 && month <= 12) ? 65 : 40;
      if (isWeekend) baseScore += 25;
    }

    // Special Karnataka Cultural Festivals
    let isSpecialFestivalDay = false;
    let festivalLabel: string | undefined;

    // Mysuru Dasara season (typically October)
    if (month === 10 && (poiId.includes('mysuru') || poiId.includes('chamundi') || macroRegion === 'Old Mysuru')) {
      baseScore += 35;
      isSpecialFestivalDay = true;
      festivalLabel = 'ನಾಡಹಬ್ಬ ಮೈಸೂರು ದಸರಾ (Mysuru Dasara Festival Surge)';
    }

    // Hampi Utsav season (typically November/January)
    if ((month === 11 || month === 1) && (poiId.includes('hampi') || poiId.includes('virupaksha'))) {
      baseScore += 30;
      isSpecialFestivalDay = true;
      festivalLabel = 'ಹಂಪಿ ಉತ್ಸವ (Hampi Utsav Cultural Gathering)';
    }

    const crowdScore = Math.min(100, Math.max(10, baseScore));

    let crowdLevel: CrowdLevel = 'LOW';
    if (crowdScore >= 85) crowdLevel = 'EXTREME_SURGE';
    else if (crowdScore >= 65) crowdLevel = 'PEAK';
    else if (crowdScore >= 45) crowdLevel = 'MODERATE';

    // Wait time estimate for major sanctums
    let estimatedDarshanWaitMinutes: number | undefined;
    if (category === 'temple') {
      estimatedDarshanWaitMinutes = Math.round(crowdScore * 1.5);
    }

    // Window recommendations
    let recommendedTimeWindow = '08:30 - 11:00 (Standard morning window)';
    if (category === 'temple') {
      recommendedTimeWindow = '06:00 - 08:00 (Suprabhata & Early Darshan, avoid 12:30 PM noon closure)';
    } else if (category === 'hill_trek') {
      recommendedTimeWindow = '05:45 - 08:00 (Sunrise summit trek before cloud buildup and heat)';
    } else if (category === 'heritage') {
      recommendedTimeWindow = '08:00 - 10:30 or 15:30 - 17:30 (Cooler hours for stone monument photography)';
    }

    return {
      poiId,
      crowdScore,
      crowdLevel,
      estimatedDarshanWaitMinutes,
      recommendedTimeWindow,
      isSpecialFestivalDay,
      festivalLabel,
      metadata: {
        modelId: this.MODEL_ID,
        modelVersion: '4.0.0',
        generatedAt: new Date().toISOString(),
        dataWindowDays: 365,
        knownLimitations: [
          'VIP protocol movement or impromptu regional jatre (fairs) may temporarily double wait times',
        ],
      },
    };
  }
}
