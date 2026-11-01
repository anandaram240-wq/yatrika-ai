/**
 * @file src/geo/roadConditionHistory.ts
 * @description Historical road condition patterns and seasonal vulnerability index for Western Ghats passes.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface GhatCorridorHistory {
  passId: string;
  name: string;
  highwayCode: string;
  lengthKm: number;
  hairpinBendsCount: number;
  averageDrySeasonSpeedKmh: number;
  averageMonsoonSeasonSpeedKmh: number;
  vulnerabilityIndex: number; // 0 (sturdy concrete) to 1.0 (fragile soil strata)
  historicalDisruptionsPerMonsoon: number;
  typicalNightFogStartHour: number; // 24-hr format
  pavementType: 'CONCRETE_RIGID' | 'ASPHALT_FLEXIBLE' | 'MIXED_BITUMEN';
}

export const GHAT_CORRIDOR_HISTORIES: Record<string, GhatCorridorHistory> = {
  shiradi: {
    passId: 'ghat-shiradi',
    name: 'Shiradi Ghat',
    highwayCode: 'NH-75',
    lengthKm: 26,
    hairpinBendsCount: 14,
    averageDrySeasonSpeedKmh: 42,
    averageMonsoonSeasonSpeedKmh: 24,
    vulnerabilityIndex: 0.65,
    historicalDisruptionsPerMonsoon: 3.2,
    typicalNightFogStartHour: 19,
    pavementType: 'CONCRETE_RIGID',
  },
  charmadi: {
    passId: 'ghat-charmadi',
    name: 'Charmadi Ghat',
    highwayCode: 'NH-73',
    lengthKm: 28,
    hairpinBendsCount: 11,
    averageDrySeasonSpeedKmh: 35,
    averageMonsoonSeasonSpeedKmh: 20,
    vulnerabilityIndex: 0.78,
    historicalDisruptionsPerMonsoon: 4.1,
    typicalNightFogStartHour: 18,
    pavementType: 'ASPHALT_FLEXIBLE',
  },
  agumbe: {
    passId: 'ghat-agumbe',
    name: 'Agumbe Ghat',
    highwayCode: 'NH-169A',
    lengthKm: 12,
    hairpinBendsCount: 14,
    averageDrySeasonSpeedKmh: 28,
    averageMonsoonSeasonSpeedKmh: 16,
    vulnerabilityIndex: 0.85,
    historicalDisruptionsPerMonsoon: 5.5,
    typicalNightFogStartHour: 17, // Dense afternoon mist
    pavementType: 'ASPHALT_FLEXIBLE',
  },
  bisle: {
    passId: 'ghat-bisle',
    name: 'Bisle Ghat',
    highwayCode: 'SH-85',
    lengthKm: 22,
    hairpinBendsCount: 18,
    averageDrySeasonSpeedKmh: 24,
    averageMonsoonSeasonSpeedKmh: 14,
    vulnerabilityIndex: 0.90,
    historicalDisruptionsPerMonsoon: 6.2,
    typicalNightFogStartHour: 18,
    pavementType: 'MIXED_BITUMEN',
  },
  sampaje: {
    passId: 'ghat-sampaje',
    name: 'Sampaje Ghat',
    highwayCode: 'NH-275',
    lengthKm: 32,
    hairpinBendsCount: 12,
    averageDrySeasonSpeedKmh: 45,
    averageMonsoonSeasonSpeedKmh: 28,
    vulnerabilityIndex: 0.50,
    historicalDisruptionsPerMonsoon: 1.8,
    typicalNightFogStartHour: 20,
    pavementType: 'ASPHALT_FLEXIBLE',
  },
};
