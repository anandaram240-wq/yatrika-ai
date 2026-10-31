/**
 * @file src/transit/transferOptimizer.ts
 * @description Transfer optimization, missed-connection risk scoring, and carbon estimation.
 * @theme Code. Create. Celebrate Kannada.
 */

import { TransitServiceSchedule } from './transportDataAdapter';
import { IntermodalGraph } from './intermodalGraph';

export interface IntermodalConnectionPlan {
  firstLeg: TransitServiceSchedule;
  secondLeg: TransitServiceSchedule;
  transferHubId: string;
  transferBufferMinutes: number;
  minimumTransferRequiredMinutes: number;
  missedConnectionRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  totalFareInr: number;
  estimatedCarbonSavedKg: number; // vs private car
  feasibilityExplanation: string;
}

export class TransferOptimizer {
  /**
   * Evaluates if two transit services can be connected safely without risking a missed connection.
   */
  public static optimizeTransfer(
    leg1: TransitServiceSchedule,
    leg2: TransitServiceSchedule,
    totalDistanceKm: number
  ): IntermodalConnectionPlan | null {
    // Check if destination of leg1 matches origin of leg2 or if they are in the same transfer hub cluster
    let transferRequiredMins = 10;
    if (leg1.destinationHubId !== leg2.originHubId) {
      const edge = IntermodalGraph.getTransferDetails(leg1.destinationHubId, leg2.originHubId);
      if (!edge) {
        return null; // No known intermodal transfer route
      }
      transferRequiredMins = edge.averageTransferMinutes + 10; // 10 min safety buffer
    }

    // Parse times
    const [arrH, arrM] = leg1.arrivalTime.split(':').map(Number);
    const [depH, depM] = leg2.departureTime.split(':').map(Number);

    let arrMinutesTotal = arrH * 60 + arrM;
    let depMinutesTotal = depH * 60 + depM;

    // Handle overnight arrivals
    if (depMinutesTotal < arrMinutesTotal) {
      depMinutesTotal += 24 * 60;
    }

    const bufferMinutes = depMinutesTotal - arrMinutesTotal;
    if (bufferMinutes < 0) return null; // Leg 2 departs before Leg 1 arrives

    let risk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (bufferMinutes < transferRequiredMins) {
      risk = 'HIGH';
    } else if (bufferMinutes < transferRequiredMins + 15) {
      risk = 'MEDIUM';
    }

    const totalFare = leg1.baseFareInr + leg2.baseFareInr;

    // Carbon estimation:
    // Private car: 171 g/km. Public intermodal: ~22 g/km.
    // Saved: 149 g/km = 0.149 kg/km
    const carbonSavedKg = Number((totalDistanceKm * 0.149).toFixed(2));

    const explanation =
      risk === 'HIGH'
        ? `⚠️ Tight transfer window: only ${bufferMinutes} min buffer at ${leg1.destinationHubName} (requires ~${transferRequiredMins}m). High risk of missed departure.`
        : risk === 'MEDIUM'
        ? `Feasible transfer: ${bufferMinutes} min buffer at ${leg1.destinationHubName}. Proceed directly upon arrival.`
        : `Comfortable transfer: ${bufferMinutes} min buffer at ${leg1.destinationHubName}. Ample time to change platforms.`;

    return {
      firstLeg: leg1,
      secondLeg: leg2,
      transferHubId: leg1.destinationHubId,
      transferBufferMinutes: bufferMinutes,
      minimumTransferRequiredMinutes: transferRequiredMins,
      missedConnectionRisk: risk,
      totalFareInr: totalFare,
      estimatedCarbonSavedKg: carbonSavedKg,
      feasibilityExplanation: explanation,
    };
  }
}
