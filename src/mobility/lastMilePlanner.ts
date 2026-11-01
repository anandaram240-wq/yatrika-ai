/**
 * @file src/mobility/lastMilePlanner.ts
 * @description Dedicated last-mile tourist transit calculator and connection solver.
 * @theme Code. Create. Celebrate Kannada.
 */

import { InterchangeGraph, IntermodalJourneyPlan } from './interchangeGraph';
import { KARNATAKA_LOCAL_TRANSFERS, LocalTransportOption } from './localTransportRegistry';

export class LastMilePlanner {
  public static planJourney(origin: string, destination: string, preferredTrunkMode: 'train' | 'bus' = 'train'): IntermodalJourneyPlan {
    return InterchangeGraph.planInterchange(origin, destination, preferredTrunkMode);
  }

  public static getOptionsForHub(hubNameOrCode: string): LocalTransportOption[] {
    const q = hubNameOrCode.toLowerCase();
    return KARNATAKA_LOCAL_TRANSFERS.filter(
      (t) => t.hubName.toLowerCase().includes(q) || t.hubType.toLowerCase().includes(q)
    );
  }

  public static estimateLocalFare(
    distanceKm: number,
    mode: 'auto' | 'taxi' | 'bus'
  ): { min: number; max: number; calculationFormula: string } {
    if (mode === 'bus') {
      const fare = Math.max(10, Math.round(distanceKm * 1.5));
      return {
        min: fare,
        max: fare,
        calculationFormula: 'KSRTC / BMTC government stage carriage rate (~₹1.5 per km, minimum ₹10). Free for eligible women under Shakti Scheme.',
      };
    }
    if (mode === 'auto') {
      // Regulated Karnataka auto slab: ₹30 first 2km, ₹15 each additional km
      const baseFare = 30;
      const extraKm = Math.max(0, distanceKm - 2);
      const standardFare = Math.round(baseFare + extraKm * 15);
      return {
        min: standardFare,
        max: Math.round(standardFare * 1.25),
        calculationFormula: 'Karnataka RTO regulated meter rate: ₹30 for first 2 km + ₹15 per subsequent km (Night fare +50% after 22:00).',
      };
    }
    // Taxi
    const baseTaxi = 120;
    const standardTaxi = Math.round(baseTaxi + distanceKm * 20);
    return {
      min: standardTaxi,
      max: Math.round(standardTaxi * 1.2),
      calculationFormula: 'Karnataka Tourist Taxi Association rate: ₹120 base fare + ₹20 per km + toll charges if applicable.',
    };
  }
}
