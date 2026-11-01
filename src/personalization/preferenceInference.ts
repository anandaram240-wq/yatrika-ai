/**
 * @file src/personalization/preferenceInference.ts
 * @description Transparent preference weighting engine without dark patterns or demographic profiling.
 * @theme Code. Create. Celebrate Kannada.
 */

import { TravelInterestCategory } from './travelProfile';

export class PreferenceInferenceEngine {
  /**
   * Transparently adjusts travel interests based on explicitly chosen POIs or query topics.
   * Completely avoids sensitive or demographic inferences.
   */
  public static inferFromInteraction(
    currentInterests: Record<TravelInterestCategory, number>,
    poiCategory: string
  ): Record<TravelInterestCategory, number> {
    const updated = { ...currentInterests };

    switch (poiCategory) {
      case 'heritage':
        updated.heritage_archaeology = Math.min(1.0, updated.heritage_archaeology + 0.15);
        break;
      case 'hill_trek':
        updated.nature_trekking = Math.min(1.0, updated.nature_trekking + 0.15);
        updated.adventure_wildlife = Math.min(1.0, updated.adventure_wildlife + 0.10);
        break;
      case 'temple':
        updated.spiritual_temple = Math.min(1.0, updated.spiritual_temple + 0.15);
        break;
      case 'food_dining':
        updated.culinary_dialect = Math.min(1.0, updated.culinary_dialect + 0.20);
        break;
      case 'wildlife_nature':
        updated.nature_trekking = Math.min(1.0, updated.nature_trekking + 0.10);
        updated.adventure_wildlife = Math.min(1.0, updated.adventure_wildlife + 0.15);
        break;
      default:
        break;
    }

    return updated;
  }
}
