/**
 * @file src/agents/travelDecisionEngine.ts
 * @description Context-aware travel decision engine for feasibility, hazard, and disruption assessment.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface TravelFeasibilityEvaluation {
  isFeasible: boolean;
  totalDistanceKm: number;
  totalEstimatedDriveMinutes: number;
  feasibleDayCount: number;
  isOverpacked: boolean;
  recommendedMaxStopsPerDay: number;
  darshanWindowViolations: Array<{
    poiId: string;
    poiName: string;
    arrivalTime: string;
    closureReason: string;
    suggestedAdjustment: string;
  }>;
  unreachableStops: string[];
  explanation: string;
}

export interface HazardEvaluationResult {
  hasCriticalDisruption: boolean;
  hazardSeverity: 'none' | 'advisory' | 'high_risk' | 'confirmed_closed';
  affectedCorridor?: string;
  hazardDescription?: string;
  suggestedAction: 'proceed_normal' | 'proceed_with_caution' | 'recommend_detour' | 'mandatory_detour';
  officialSourceAttributed?: string;
}

export class TravelDecisionEngine {
  /**
   * Assesses itinerary feasibility against physical driving speeds and visit durations.
   */
  public static evaluateFeasibility(params: {
    stopCount: number;
    allocatedDays: number;
    totalRoadDistanceKm: number;
    estimatedDriveHours: number;
    isGhatTerrain: boolean;
  }): TravelFeasibilityEvaluation {
    const { stopCount, allocatedDays, totalRoadDistanceKm, estimatedDriveHours, isGhatTerrain } = params;

    // In Western Ghats, safe max stops per day is 2-3 due to winding roads and dusk fog.
    // In plain expressways (NH-48, NH-50), max stops per day is 4-5.
    const recommendedMaxStopsPerDay = isGhatTerrain ? 3 : 4;
    const maxSafeStops = recommendedMaxStopsPerDay * allocatedDays;
    const isOverpacked = stopCount > maxSafeStops;

    const totalDriveMinutes = Math.round(estimatedDriveHours * 60);
    const driveHoursPerDay = estimatedDriveHours / Math.max(1, allocatedDays);

    let explanation = `Itinerary covers ${totalRoadDistanceKm.toFixed(1)} km across ${allocatedDays} day(s) (~${driveHoursPerDay.toFixed(1)}h driving/day).`;

    if (isOverpacked) {
      explanation += ` ⚠️ Overpacked schedule: ${stopCount} stops in ${allocatedDays} day(s) exceeds safe pacing (${recommendedMaxStopsPerDay} stops/day in ${isGhatTerrain ? 'Ghat' : 'Plain'} terrain). Risk of visiting after sunset or during sanctum closures.`;
    } else {
      explanation += ` Feasible and balanced schedule with comfortable dwell times.`;
    }

    return {
      isFeasible: !isOverpacked && driveHoursPerDay <= 7,
      totalDistanceKm: totalRoadDistanceKm,
      totalEstimatedDriveMinutes: totalDriveMinutes,
      feasibleDayCount: allocatedDays,
      isOverpacked,
      recommendedMaxStopsPerDay,
      darshanWindowViolations: [],
      unreachableStops: [],
      explanation,
    };
  }

  /**
   * Evaluates road conditions and weather reports to determine if an active trip is disrupted.
   */
  public static evaluateHazardDisruption(params: {
    corridorName: string;
    precipitationMmPerHour: number;
    windKmh: number;
    isOfficialRoadClosure: boolean;
    closureReason?: string;
    officialReportingSource?: string;
  }): HazardEvaluationResult {
    const {
      corridorName,
      precipitationMmPerHour,
      windKmh,
      isOfficialRoadClosure,
      closureReason,
      officialReportingSource,
    } = params;

    // Strict safety rule: Rainfall alone is NOT proof of road closure.
    if (isOfficialRoadClosure) {
      return {
        hasCriticalDisruption: true,
        hazardSeverity: 'confirmed_closed',
        affectedCorridor: corridorName,
        hazardDescription: closureReason ?? `Confirmed closure reported on ${corridorName}`,
        suggestedAction: 'mandatory_detour',
        officialSourceAttributed: officialReportingSource ?? 'District Police / PWD',
      };
    }

    if (precipitationMmPerHour >= 15.0 || windKmh >= 50.0) {
      return {
        hasCriticalDisruption: true,
        hazardSeverity: 'high_risk',
        affectedCorridor: corridorName,
        hazardDescription: `High weather alert: ${precipitationMmPerHour.toFixed(1)} mm/h precipitation and ${windKmh.toFixed(0)} km/h winds reported. Risk of mudslides and reduced visibility.`,
        suggestedAction: 'recommend_detour',
        officialSourceAttributed: officialReportingSource ?? 'Open-Meteo & IMD Bulletin',
      };
    }

    if (precipitationMmPerHour >= 5.0 || windKmh >= 35.0) {
      return {
        hasCriticalDisruption: false,
        hazardSeverity: 'advisory',
        affectedCorridor: corridorName,
        hazardDescription: `Moderate monsoon conditions (${precipitationMmPerHour.toFixed(1)} mm/h). Wet surfaces and light fog.`,
        suggestedAction: 'proceed_with_caution',
        officialSourceAttributed: officialReportingSource ?? 'Live Weather Service',
      };
    }

    return {
      hasCriticalDisruption: false,
      hazardSeverity: 'none',
      suggestedAction: 'proceed_normal',
    };
  }
}
