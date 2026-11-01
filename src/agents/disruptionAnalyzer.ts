/**
 * @file src/agents/disruptionAnalyzer.ts
 * @description Evaluates trip disruptions, information freshness, and source authority.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface DisruptionEvent {
  eventId: string;
  affectedCorridor: string; // e.g. "SH-57 Belur - Chikkamagaluru" or "Mullayanagiri Peak Access"
  interruptionType: 'ROAD_MAINTENANCE' | 'FLASH_FLOOD' | 'TEMPLE_DARSHAN_OVERFLOW' | 'VEHICLE_BREAKDOWN' | 'WEATHER_HAZARD';
  sourceAuthority: string;
  sourceReliabilityScore: number; // 0 to 1.0
  ageMinutes: number;
  expectedDelayMinutes: number;
  isHardBlock: boolean;
}

export class DisruptionAnalyzer {
  public static assessDisruption(event: DisruptionEvent): {
    isActionable: boolean;
    confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    requiresImmediateReroute: boolean;
    reasoning: string;
  } {
    // Freshness and authority gate
    const isStale = event.ageMinutes > 180;
    const isOfficialSource =
      event.sourceAuthority.toLowerCase().includes('pwd') ||
      event.sourceAuthority.toLowerCase().includes('police') ||
      event.sourceAuthority.toLowerCase().includes('kstdc');

    let confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (isOfficialSource && !isStale && event.sourceReliabilityScore >= 0.8) {
      confidenceLevel = 'HIGH';
    } else if (event.sourceReliabilityScore >= 0.5 && !isStale) {
      confidenceLevel = 'MEDIUM';
    }

    const requiresImmediateReroute = event.isHardBlock || event.expectedDelayMinutes >= 30;
    const isActionable = confidenceLevel !== 'LOW' && requiresImmediateReroute;

    return {
      isActionable,
      confidenceLevel,
      requiresImmediateReroute,
      reasoning: `Disruption on ${event.affectedCorridor} reported by ${event.sourceAuthority} (${event.ageMinutes}m ago). Reliability: ${(event.sourceReliabilityScore * 100).toFixed(0)}%. Delay: ${event.expectedDelayMinutes} mins.`,
    };
  }
}
