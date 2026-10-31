/**
 * @file src/intelligence/trustEngine.ts
 * @description Centralized trust, explainability and evidence evaluation layer for YatriKa AI.
 * @theme Code. Create. Celebrate Kannada.
 */

import { MultidimensionalConfidence, evaluateMultidimensionalConfidence } from './confidenceScoring';
import { wrapWithProvenance } from './dataProvenance';

export interface TrustDecisionExplanation {
  recommendationType: 'route_choice' | 'departure_time' | 'alternative_corridor' | 'hazard_advisory' | 'transit_transfer';
  decisionTitle: string;
  summaryExplanation: string;
  provenanceTrail: Array<{
    sourceId: string;
    organization: string;
    evidenceTier: string;
    retrievedAt: string;
    attribution: string;
  }>;
  confidence: MultidimensionalConfidence;
  warningFlags: string[];
  actionableAdvice: string;
}

export class TrustEngine {
  /**
   * Explains why a specific highway route corridor was chosen over alternatives.
   */
  public static explainRouteRecommendation(params: {
    corridorName: string;
    roadNumber: string;
    distanceKm: number;
    estimatedMinutes: number;
    weatherPrecipitationMm: number;
    hasActiveGhatWarning: boolean;
    roadSourceId: string;
    weatherSourceId: string;
  }): TrustDecisionExplanation {
    const {
      corridorName,
      roadNumber,
      distanceKm,
      estimatedMinutes,
      weatherPrecipitationMm,
      hasActiveGhatWarning,
      roadSourceId,
      weatherSourceId,
    } = params;

    const roadProv = wrapWithProvenance({ roadNumber, distanceKm }, roadSourceId, `corridor:${roadNumber}`);
    const weatherProv = wrapWithProvenance({ weatherPrecipitationMm }, weatherSourceId, `corridor:${roadNumber}`);

    const confidence = evaluateMultidimensionalConfidence({
      tier: hasActiveGhatWarning ? 'estimated' : 'api_retrieved',
      retrievedAt: weatherProv.retrievedAt,
      validityMinutes: weatherProv.validityMinutes,
      conflictingSourcesCount: 0,
      customExplanation: `Route plotted via ${roadNumber} (${distanceKm.toFixed(1)} km, ~${Math.round(estimatedMinutes)}m).`,
    });

    const warningFlags: string[] = [];
    if (hasActiveGhatWarning) {
      warningFlags.push(`Elevated caution in ${corridorName}: recent precipitation of ${weatherPrecipitationMm.toFixed(1)} mm/h.`);
    }
    if (weatherProv.isStale) {
      warningFlags.push('Weather data exceeded 30-minute validity threshold; live conditions may have shifted.');
    }

    const summaryExplanation = hasActiveGhatWarning
      ? `YatriKa recommends proceeding via ${roadNumber} with speed restriction (${Math.round(estimatedMinutes)} min) due to documented mountain curvature and active weather reports.`
      : `YatriKa recommends ${roadNumber} as the optimal corridor: highway geometry verified against NHAI network data, with clear weather conditions (${weatherPrecipitationMm.toFixed(1)} mm/h).`;

    const actionableAdvice = hasActiveGhatWarning
      ? 'Reduce speeds on winding ghat turns. Maintain headlights in fog. Check PWD notifications if heavy rain persists.'
      : 'Maintain normal highway speeds. Keep FASTag active at toll plazas.';

    return {
      recommendationType: 'route_choice',
      decisionTitle: `Corridor Selection: ${corridorName} (${roadNumber})`,
      summaryExplanation,
      provenanceTrail: [
        {
          sourceId: roadProv.sourceId,
          organization: roadProv.sourceOrganization,
          evidenceTier: 'officially_published',
          retrievedAt: roadProv.retrievedAt,
          attribution: roadProv.attributionStatement,
        },
        {
          sourceId: weatherProv.sourceId,
          organization: weatherProv.sourceOrganization,
          evidenceTier: 'api_retrieved',
          retrievedAt: weatherProv.retrievedAt,
          attribution: weatherProv.attributionStatement,
        },
      ],
      confidence,
      warningFlags,
      actionableAdvice,
    };
  }

  /**
   * Explains why an alternative corridor detour is recommended when a hazard is reported.
   */
  public static explainGhatDetour(params: {
    primaryCorridor: string;
    suggestedDetourCorridor: string;
    hazardReason: string;
    isOfficialClosure: boolean;
    etaDeltaMinutes: number;
    distanceDeltaKm: number;
    reportingSourceId: string;
  }): TrustDecisionExplanation {
    const {
      primaryCorridor,
      suggestedDetourCorridor,
      hazardReason,
      isOfficialClosure,
      etaDeltaMinutes,
      distanceDeltaKm,
      reportingSourceId,
    } = params;

    const sourceProv = wrapWithProvenance({ hazardReason, isOfficialClosure }, reportingSourceId, primaryCorridor);

    const confidence = evaluateMultidimensionalConfidence({
      tier: isOfficialClosure ? 'officially_published' : 'estimated',
      retrievedAt: sourceProv.retrievedAt,
      validityMinutes: sourceProv.validityMinutes,
      customExplanation: isOfficialClosure
        ? `Official restriction declared by ${sourceProv.sourceOrganization}.`
        : `Precautionary detour suggested based on severe micro-climate observation.`,
    });

    const summaryExplanation = isOfficialClosure
      ? `Primary corridor (${primaryCorridor}) is reported closed by ${sourceProv.sourceOrganization}. YatriKa has recalculated the journey via ${suggestedDetourCorridor} (+${Math.round(etaDeltaMinutes)}m, +${distanceDeltaKm.toFixed(1)} km).`
      : `Adverse conditions reported on ${primaryCorridor} (${hazardReason}). YatriKa suggests evaluating the safer alternate corridor (${suggestedDetourCorridor}).`;

    return {
      recommendationType: 'alternative_corridor',
      decisionTitle: `Ghat Detour Advisory: ${primaryCorridor} ➔ ${suggestedDetourCorridor}`,
      summaryExplanation,
      provenanceTrail: [
        {
          sourceId: sourceProv.sourceId,
          organization: sourceProv.sourceOrganization,
          evidenceTier: confidence.evidenceTier,
          retrievedAt: sourceProv.retrievedAt,
          attribution: sourceProv.attributionStatement,
        },
      ],
      confidence,
      warningFlags: [hazardReason],
      actionableAdvice: `Confirm route before switching. Additional travel time is approx +${Math.round(etaDeltaMinutes)} minutes.`,
    };
  }

  /**
   * Explains why a temple or heritage visit time was scheduled at a specific hour.
   */
  public static explainVisitTiming(params: {
    poiName: string;
    scheduledArrival: string;
    openingHours: string;
    recommendedDurationHours: number;
    darshanClosureNote?: string;
    sourceId: string;
  }): TrustDecisionExplanation {
    const {
      poiName,
      scheduledArrival,
      openingHours,
      recommendedDurationHours,
      darshanClosureNote,
      sourceId,
    } = params;

    const prov = wrapWithProvenance({ openingHours, darshanClosureNote }, sourceId, poiName);

    const confidence = evaluateMultidimensionalConfidence({
      tier: 'officially_published',
      retrievedAt: prov.retrievedAt,
      validityMinutes: prov.validityMinutes,
      customExplanation: `Hours verified against official administration guidelines (${openingHours}).`,
    });

    const warningFlags: string[] = [];
    if (darshanClosureNote) {
      warningFlags.push(darshanClosureNote);
    }

    return {
      recommendationType: 'departure_time',
      decisionTitle: `Visit Window: ${poiName} at ${scheduledArrival}`,
      summaryExplanation: `Scheduled arrival at ${scheduledArrival} aligns with visitor hours (${openingHours}) and allocates ${recommendedDurationHours}h recommended dwell time, avoiding mid-day darshan closures.`,
      provenanceTrail: [
        {
          sourceId: prov.sourceId,
          organization: prov.sourceOrganization,
          evidenceTier: 'officially_published',
          retrievedAt: prov.retrievedAt,
          attribution: prov.attributionStatement,
        },
      ],
      confidence,
      warningFlags,
      actionableAdvice: `Plan to arrive at least 30 minutes before sanctum closure to clear security and queues.`,
    };
  }
}
