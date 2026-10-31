/**
 * @file src/geo/terrainIntelligence.ts
 * @description Western Ghats terrain intelligence and strict hazard condition separation.
 * @theme Code. Create. Celebrate Kannada.
 */

export type GhatConditionClassification =
  | 'HEAVY_RAINFALL'           // High precipitation observed via meteorological sensors
  | 'WEATHER_RELATED_RISK'     // Micro-climate squall, thick fog, or high wind gusts
  | 'OFFICIALLY_REPORTED_LANDSLIDE' // Physical landslide obstruction notified by PWD / District Police
  | 'CONFIRMED_ROAD_CLOSURE'   // Statutory gazette or administrative ban on vehicular traffic
  | 'UNKNOWN_ROAD_CONDITION'   // Lack of recent sensor or authority confirmation
  | 'NORMAL_PASSABLE';         // Passable under standard caution

export interface GhatPassIntelligence {
  passName: 'Shiradi' | 'Charmadi' | 'Agumbe' | 'Bisle' | 'Sampaje';
  connectingHighway: string;
  startTown: string;
  endTown: string;
  hairpinCount: number;
  highestElevationM: number;
  lowestElevationM: number;
  averageGradePercent: number;
  vulnerableMonsoonMonths: string[];
  safeBypassAlternatives: string[];
}

export const WESTERN_GHATS_PASS_REGISTRY: Record<string, GhatPassIntelligence> = {
  Shiradi: {
    passName: 'Shiradi',
    connectingHighway: 'NH-75',
    startTown: 'Maranahalli (Sakleshpur)',
    endTown: 'Gundya (Dakshina Kannada)',
    hairpinCount: 12,
    highestElevationM: 956,
    lowestElevationM: 110,
    averageGradePercent: 6.2,
    vulnerableMonsoonMonths: ['July', 'August', 'September'],
    safeBypassAlternatives: ['Sampaje Ghat via Madikeri (NH-275)', 'Charmadi Ghat (NH-73)'],
  },
  Charmadi: {
    passName: 'Charmadi',
    connectingHighway: 'NH-73',
    startTown: 'Kottigehara (Mudigere)',
    endTown: 'Charmadi Village (Belthangady)',
    hairpinCount: 11,
    highestElevationM: 1040,
    lowestElevationM: 85,
    averageGradePercent: 7.4,
    vulnerableMonsoonMonths: ['June', 'July', 'August'],
    safeBypassAlternatives: ['Shiradi Ghat (NH-75)', 'Sampaje Ghat (NH-275)'],
  },
  Agumbe: {
    passName: 'Agumbe',
    connectingHighway: 'NH-169A / SH-8',
    startTown: 'Agumbe (Shivamogga)',
    endTown: 'Someshwara (Udupi)',
    hairpinCount: 14,
    highestElevationM: 825,
    lowestElevationM: 35,
    averageGradePercent: 8.8,
    vulnerableMonsoonMonths: ['June', 'July', 'August', 'September'],
    safeBypassAlternatives: ['Hulikal Ghat via Hosanagara', 'Charmadi Ghat (NH-73)'],
  },
  Bisle: {
    passName: 'Bisle',
    connectingHighway: 'State Forest Road',
    startTown: 'Heggadde (Hassan)',
    endTown: 'Kukke Subrahmanya (Dakshina Kannada)',
    hairpinCount: 16,
    highestElevationM: 920,
    lowestElevationM: 90,
    averageGradePercent: 8.1,
    vulnerableMonsoonMonths: ['July', 'August'],
    safeBypassAlternatives: ['Shiradi Ghat (NH-75)', 'Sampaje Ghat (NH-275)'],
  },
  Sampaje: {
    passName: 'Sampaje',
    connectingHighway: 'NH-275',
    startTown: 'Madikeri (Kodagu)',
    endTown: 'Sullia (Dakshina Kannada)',
    hairpinCount: 8,
    highestElevationM: 1150,
    lowestElevationM: 80,
    averageGradePercent: 5.2,
    vulnerableMonsoonMonths: ['August', 'September'],
    safeBypassAlternatives: ['Shiradi Ghat (NH-75)'],
  },
};

export class TerrainIntelligence {
  /**
   * Evaluates Ghat conditions with strict separation of weather observations vs verified closures.
   * NON-NEGOTIABLE: Rainfall alone must NEVER be labeled as proof of closure.
   */
  public static classifyGhatCondition(params: {
    precipitationMmPerHour: number;
    windSpeedKmh: number;
    hasOfficialLandslideNotice?: boolean;
    hasOfficialClosureNotice?: boolean;
    lastSensorReportAgeMinutes?: number;
  }): {
    classification: GhatConditionClassification;
    requiresDetour: boolean;
    advisoryText: string;
    evidenceProofNote: string;
  } {
    const {
      precipitationMmPerHour,
      windSpeedKmh,
      hasOfficialLandslideNotice = false,
      hasOfficialClosureNotice = false,
      lastSensorReportAgeMinutes = 15,
    } = params;

    if (hasOfficialClosureNotice) {
      return {
        classification: 'CONFIRMED_ROAD_CLOSURE',
        requiresDetour: true,
        advisoryText: 'Statutory road closure in force by District Administration / Police.',
        evidenceProofNote: 'Confirmed via official district notification. Travel prohibited on this pass.',
      };
    }

    if (hasOfficialLandslideNotice) {
      return {
        classification: 'OFFICIALLY_REPORTED_LANDSLIDE',
        requiresDetour: true,
        advisoryText: 'Active rockfall/mudslide clearance underway by PWD / NHAI heavy machinery.',
        evidenceProofNote: 'Confirmed physical obstruction reported by maintenance crews.',
      };
    }

    if (lastSensorReportAgeMinutes > 180) {
      return {
        classification: 'UNKNOWN_ROAD_CONDITION',
        requiresDetour: false,
        advisoryText: 'Sensor observations are stale (>3 hours). Verify with local police before entry.',
        evidenceProofNote: 'Lack of recent data; no conclusion can be drawn about pass safety.',
      };
    }

    if (precipitationMmPerHour >= 15.0) {
      return {
        classification: 'HEAVY_RAINFALL',
        requiresDetour: false, // NOT closed automatically without authority notification
        advisoryText: `Intense precipitation (${precipitationMmPerHour.toFixed(1)} mm/h) observed. Road is NOT confirmed closed, but extreme caution required.`,
        evidenceProofNote: 'Sensor data indicates high rainfall. Not proof of physical blockage.',
      };
    }

    if (windSpeedKmh >= 45.0 || precipitationMmPerHour >= 6.0) {
      return {
        classification: 'WEATHER_RELATED_RISK',
        requiresDetour: false,
        advisoryText: `Ghat squalls and low visibility reported (${windSpeedKmh.toFixed(0)} km/h wind). Drive with fog lamps.`,
        evidenceProofNote: 'Atmospheric risk observation; pass remains open to traffic.',
      };
    }

    return {
      classification: 'NORMAL_PASSABLE',
      requiresDetour: false,
      advisoryText: 'Pass is operating under normal seasonal conditions. Observe hairpin speed limits.',
      evidenceProofNote: 'Clear conditions with no active adverse advisories.',
    };
  }
}
