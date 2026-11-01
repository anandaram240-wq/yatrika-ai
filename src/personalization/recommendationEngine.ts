/**
 * @file src/personalization/recommendationEngine.ts
 * @description Transparent multi-factor destination ranking and explainable recommendation engine.
 * @theme Code. Create. Celebrate Kannada.
 */

import { KarnatakaPOI } from '../types/nammatrip';
import { TravelerProfile } from './travelProfile';

export interface ScoredRecommendation {
  poi: KarnatakaPOI;
  totalScore: number; // 0 to 100
  factors: {
    interestMatch: number;
    budgetMatch: number;
    seasonalityMatch: number;
    proximityBonus: number;
  };
  explanationEnglish: string;
  explanationKannada: string;
}

export class PersonalizationRecommendationEngine {
  public static rankDestinations(
    candidates: KarnatakaPOI[],
    profile: TravelerProfile,
    currentLocation?: [number, number],
    month: number = new Date().getMonth() + 1
  ): ScoredRecommendation[] {
    const scored: ScoredRecommendation[] = candidates.map((poi) => {
      // 1. Interest Match
      let interestWeight = 0.5;
      if (poi.category === 'heritage') interestWeight = profile.interests.heritage_archaeology;
      else if (poi.category === 'hill_trek') interestWeight = profile.interests.nature_trekking;
      else if (poi.category === 'temple') interestWeight = profile.interests.spiritual_temple;
      else if (poi.category === 'food_dining') interestWeight = profile.interests.culinary_dialect;
      else if (poi.category === 'wildlife_nature') interestWeight = profile.interests.adventure_wildlife;

      const interestMatch = Math.round(interestWeight * 40); // Max 40 points

      // 2. Budget Match
      const fee = poi.entryFeeInr.indianCitizen;
      let budgetMatch = 25; // Max 25 points
      if (fee === 0) budgetMatch = 25;
      else if (fee > 500 && profile.interests.budget_conscious > 0.7) budgetMatch = 10;

      // 3. Seasonality Match
      let seasonalityMatch = 20; // Max 20 points
      if (poi.macroRegion === 'Karavali Coastal' && (month >= 11 || month <= 2)) {
        seasonalityMatch = 20;
      } else if (poi.category === 'hill_trek' && (month >= 8 && month <= 12)) {
        seasonalityMatch = 20;
      }

      // 4. Proximity Match
      let proximityBonus = 10; // Max 15 points
      if (currentLocation) {
        const dLon = poi.coordinates[0] - currentLocation[0];
        const dLat = poi.coordinates[1] - currentLocation[1];
        const distDeg = Math.sqrt(dLon * dLon + dLat * dLat);
        if (distDeg < 0.8) proximityBonus = 15;
        else if (distDeg > 2.5) proximityBonus = 5;
      }

      const totalScore = interestMatch + budgetMatch + seasonalityMatch + proximityBonus;

      // Explainability
      const explanationEnglish = `Recommended because you have high interest in ${poi.category.replace('_', ' ')} (${Math.round(interestWeight * 100)}% match), and entry fee is within budget (₹${fee}).`;
      const explanationKannada = `ನಿಮ್ಮ ಆದ್ಯತೆಯ ${poi.category} ವಿಭಾಗಕ್ಕೆ ಹೊಂದಿಕೆಯಾಗುವುದರಿಂದ (${Math.round(interestWeight * 100)}% ಹೊಂದಾಣಿಕೆ) ಮತ್ತು ಪ್ರವೇಶ ಶುಲ್ಕ ₹${fee} ಇರುವುದರಿಂದ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.`;

      return {
        poi,
        totalScore,
        factors: {
          interestMatch,
          budgetMatch,
          seasonalityMatch,
          proximityBonus,
        },
        explanationEnglish,
        explanationKannada,
      };
    });

    return scored.sort((a, b) => b.totalScore - a.totalScore);
  }
}
