/**
 * @file src/geo/routeTemporalAnalyzer.ts
 * @description Time-dependent route traversal costs and departure-time corridor accessibility analyzer.
 * @theme Code. Create. Celebrate Kannada.
 */

import { GHAT_CORRIDOR_HISTORIES, GhatCorridorHistory } from './roadConditionHistory';

export interface RouteTemporalAssessment {
  corridorName: string;
  departureTimeHour: number;
  estimatedTransitHour: number;
  isNightGhatTransit: boolean;
  transitRiskMultiplier: number;
  speedRecommendationKmh: number;
  safetyAdvisoryKannada: string;
  safetyAdvisoryEnglish: string;
}

export class RouteTemporalAnalyzer {
  /**
   * Analyze corridor transit risk as a function of time of day and season.
   */
  public static analyzeCorridorTransit(
    passKey: 'shiradi' | 'charmadi' | 'agumbe' | 'bisle' | 'sampaje',
    departureHour: number,
    transitDelayHours: number = 2.5,
    isMonsoonMonth: boolean = false
  ): RouteTemporalAssessment {
    const history: GhatCorridorHistory = GHAT_CORRIDOR_HISTORIES[passKey] ?? GHAT_CORRIDOR_HISTORIES.shiradi;
    const estimatedTransitHour = (departureHour + transitDelayHours) % 24;

    const isNightGhatTransit = estimatedTransitHour >= history.typicalNightFogStartHour || estimatedTransitHour <= 5;

    let transitRiskMultiplier = 1.0;
    if (isNightGhatTransit) transitRiskMultiplier += 0.45;
    if (isMonsoonMonth) transitRiskMultiplier += 0.55;

    const baselineSpeed = isMonsoonMonth ? history.averageMonsoonSeasonSpeedKmh : history.averageDrySeasonSpeedKmh;
    const speedRecommendationKmh = Math.round(isNightGhatTransit ? baselineSpeed * 0.75 : baselineSpeed);

    let advisoryEn = `Transit during daylight hours is optimal for ${history.name}.`;
    let advisoryKn = `${history.name} ಮಾರ್ಗದಲ್ಲಿ ಹಗಲಿನ ಸಂಚಾರ ಸುರಕ್ಷಿತ.`;

    if (isNightGhatTransit && isMonsoonMonth) {
      advisoryEn = `Night ghat transit with monsoon dampness on ${history.name} (${history.hairpinBendsCount} hairpins). Exercise caution or consider morning departure.`;
      advisoryKn = `ರಾತ್ರಿ ವೇಳೆಯಲ್ಲಿ ${history.name} ಮಾರ್ಗದಲ್ಲಿ ಮಂಜು ಮತ್ತು ತೇವವಿರುತ್ತದೆ (${history.hairpinBendsCount} ಕಡಿದಾದ ತಿರುವುಗಳು). ಎಚ್ಚರಿಕೆ ವಹಿಸಿ.`;
    } else if (isNightGhatTransit) {
      advisoryEn = `Evening fog expected along ${history.name}. Keep low beam lights on.`;
      advisoryKn = `ಸಂಜೆ ${history.name} ಮಾರ್ಗದಲ್ಲಿ ಮಂಜು ಆವರಿಸುವ ಸಾಧ್ಯತೆ ಇದೆ. ಲೋ-ಬೀಮ್ ದೀಪಗಳನ್ನು ಬಳಸಿ.`;
    }

    return {
      corridorName: history.name,
      departureTimeHour: departureHour,
      estimatedTransitHour: Math.round(estimatedTransitHour * 10) / 10,
      isNightGhatTransit,
      transitRiskMultiplier: Math.round(transitRiskMultiplier * 100) / 100,
      speedRecommendationKmh,
      safetyAdvisoryEnglish: advisoryEn,
      safetyAdvisoryKannada: advisoryKn,
    };
  }
}
