// src/data/journeyFinderEngine.ts
// Deterministic Journey Finder Engine for YatriKa AI V9.
// Queries the Karnataka POI dataset WITHOUT AI — transparent, explainable match scoring.

import { KARNATAKA_POIS, CURATED_CIRCUIT_PRESETS, KARNATAKA_GATEWAY_ORIGINS, getPoiById } from '../data/karnatakaTravelRegistry';
import { computeHaversineKm } from '../services/routingService';
import { KarnatakaPOI, CuratedCircuitPreset } from '../types/nammatrip';

// ─────────────────────────────────────────────────────────────────────────────
// Public Types
// ─────────────────────────────────────────────────────────────────────────────

export type InterestCategory =
  | 'heritage'
  | 'mountains'
  | 'waterfalls'
  | 'wildlife'
  | 'coast'
  | 'food_culture'
  | 'spiritual'
  | 'family'
  | 'accessible';

export interface JourneyFinderQuery {
  originId: string;
  durationKey: 'half_day' | 'one_day' | 'weekend' | '3_5_days' | 'longer';
  travelMode: 'self_drive' | 'bus' | 'train_local' | 'any';
  interests: InterestCategory[];
  maxBudgetInr?: number;
}

export interface JourneyFinderResult {
  circuit: {
    id: string;
    title: string;
    titleKannada: string;
    durationDays: number;
    totalDistanceKm: number; // haversine sum, NOT road distance
    stopIds: string[];
    highlights: string[];
    bestFor: InterestCategory[];
    travelModes: ('self_drive' | 'bus' | 'train_local')[];
  };
  matchScore: number;       // 0–100, transparent rule-based — NOT an AI score
  matchReasons: string[];   // plain English explanations
  dataStatus: 'verified' | 'sourced' | 'estimated';
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Duration bands: [minDays, maxDays, maxHaversineKmFromOrigin] */
const DURATION_CONFIG: Record<
  JourneyFinderQuery['durationKey'],
  { minDays: number; maxDays: number; maxDistKm: number; label: string }
> = {
  half_day:  { minDays: 0,   maxDays: 0.5, maxDistKm: 80,       label: 'Half Day'       },
  one_day:   { minDays: 0.5, maxDays: 1,   maxDistKm: 150,      label: 'One Day'        },
  weekend:   { minDays: 1,   maxDays: 2,   maxDistKm: 280,      label: 'Weekend'        },
  '3_5_days':{ minDays: 3,   maxDays: 5,   maxDistKm: 500,      label: '3–5 Days'       },
  longer:    { minDays: 5,   maxDays: 99,  maxDistKm: Infinity,  label: 'Longer Journey' },
};

/** Expected stop counts per duration band for scoring */
const DURATION_STOP_RANGE: Record<JourneyFinderQuery['durationKey'], [number, number]> = {
  half_day:   [1, 2],
  one_day:    [1, 3],
  weekend:    [2, 4],
  '3_5_days': [4, 7],
  longer:     [5, 15],
};

/** Interest → POI categories mapping */
const INTEREST_TO_CATEGORIES: Record<InterestCategory, string[]> = {
  heritage:     ['heritage', 'temple'],
  mountains:    ['hill_trek'],
  waterfalls:   ['attraction'],         // + name contains 'Falls' / 'fall' (checked separately)
  wildlife:     ['wildlife_nature'],
  coast:        ['beach_coastal'],
  food_culture: ['food_dining'],
  spiritual:    ['temple'],
  family:       ['heritage', 'attraction', 'wildlife_nature'],
  accessible:   ['heritage', 'attraction'],
};

/** Friendly labels for interests used in match reason text */
const INTEREST_LABELS: Record<InterestCategory, string> = {
  heritage:     'Heritage & history',
  mountains:    'Mountains & hill treks',
  waterfalls:   'Waterfalls',
  wildlife:     'Wildlife',
  coast:        'Coast & beaches',
  food_culture: 'Food & local culture',
  spiritual:    'Spiritual & pilgrimage',
  family:       'Family-friendly spots',
  accessible:   'Accessible travel',
};

// ─────────────────────────────────────────────────────────────────────────────
// Internal Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Determine if a POI matches an interest category */
function poiMatchesInterest(poi: KarnatakaPOI, interest: InterestCategory): boolean {
  const cats = INTEREST_TO_CATEGORIES[interest];
  if (cats.includes(poi.category)) {
    // Waterfall interest: additionally require name to contain 'Falls' or 'fall'
    if (interest === 'waterfalls') {
      return poi.name.toLowerCase().includes('fall') || poi.nameKannada.includes('ಜಲಪಾತ');
    }
    return true;
  }
  return false;
}

/** Compute haversine distance chain for a list of stop IDs (from → first stop) */
function computeCircuitDistanceKm(
  originCoords: [number, number],
  stopIds: string[]
): number {
  const stops = stopIds.map(getPoiById).filter(Boolean) as KarnatakaPOI[];
  if (stops.length === 0) return 0;

  let total = computeHaversineKm(originCoords, stops[0].coordinates);
  for (let i = 0; i < stops.length - 1; i++) {
    total += computeHaversineKm(stops[i].coordinates, stops[i + 1].coordinates);
  }
  return Math.round(total * 10) / 10;
}

/** Determine which interests a set of stops cover */
function deriveInterestsFromStops(stopIds: string[]): InterestCategory[] {
  const stops = stopIds.map(getPoiById).filter(Boolean) as KarnatakaPOI[];
  const found = new Set<InterestCategory>();
  const allInterests: InterestCategory[] = [
    'heritage', 'mountains', 'waterfalls', 'wildlife', 'coast',
    'food_culture', 'spiritual', 'family', 'accessible',
  ];
  for (const poi of stops) {
    for (const interest of allInterests) {
      if (poiMatchesInterest(poi, interest)) found.add(interest);
    }
  }
  return [...found];
}

/** Determine which travel modes a circuit supports based on its stops */
function deriveTravelModes(stopIds: string[]): ('self_drive' | 'bus' | 'train_local')[] {
  const stops = stopIds.map(getPoiById).filter(Boolean) as KarnatakaPOI[];
  const modes: Set<'self_drive' | 'bus' | 'train_local'> = new Set(['self_drive']);

  for (const poi of stops) {
    if (poi.category === 'railway_station') modes.add('train_local');
    if (poi.category === 'bus_terminal') modes.add('bus');
    // Check nearby transport links
    if (poi.nearestRailwayId && poi.nearestRailwayId !== '') modes.add('train_local');
    if (poi.nearestBusTerminalId && poi.nearestBusTerminalId !== '') modes.add('bus');
  }
  return [...modes];
}

/** Determine data status from the circuit's stops */
function deriveDataStatus(stopIds: string[]): 'verified' | 'sourced' | 'estimated' {
  const stops = stopIds.map(getPoiById).filter(Boolean) as KarnatakaPOI[];
  if (stops.length === 0) return 'estimated';

  // Heuristic: verified if all stops have a verifiedDate within the last 2 years
  const cutoff = new Date('2024-01-01');
  const allVerified = stops.every((s) => {
    try {
      return new Date(s.verifiedDate) >= cutoff;
    } catch {
      return false;
    }
  });
  if (allVerified) return 'verified';

  // sourced if all have an official URL
  const allSourced = stops.every((s) => s.officialUrl && s.officialUrl.length > 0);
  return allSourced ? 'sourced' : 'estimated';
}

// ─────────────────────────────────────────────────────────────────────────────
// Match Scoring (transparent rule-based, NOT AI-generated confidence)
// ─────────────────────────────────────────────────────────────────────────────

interface ScoredResult {
  preset: CuratedCircuitPreset;
  score: number;
  reasons: string[];
}

function scoreCircuit(
  preset: CuratedCircuitPreset,
  query: JourneyFinderQuery,
  originCoords: [number, number]
): ScoredResult {
  let score = 0;
  const reasons: string[] = [];
  const config = DURATION_CONFIG[query.durationKey];
  const [minStops, maxStops] = DURATION_STOP_RANGE[query.durationKey];

  // +30: Duration fit
  const durationFits = preset.days >= config.minDays && preset.days <= config.maxDays;
  if (durationFits) {
    score += 30;
    reasons.push(`Duration matches your ${config.label} window (${preset.days} day${preset.days !== 1 ? 's' : ''})`);
  } else {
    // Partial credit for near-miss durations
    const gap = Math.min(Math.abs(preset.days - config.minDays), Math.abs(preset.days - config.maxDays));
    if (gap <= 1) {
      score += 10;
      reasons.push(`Close duration match — circuit is ${preset.days} day${preset.days !== 1 ? 's' : ''} (you selected ${config.label})`);
    }
  }

  // +20: Stop count appropriate for duration
  if (preset.stopIds.length >= minStops && preset.stopIds.length <= maxStops) {
    score += 20;
    reasons.push(`${preset.stopIds.length} stops — well-paced for a ${config.label}`);
  } else if (preset.stopIds.length > maxStops) {
    score += 5;
    reasons.push(`${preset.stopIds.length} stops — slightly more than usual for a ${config.label}, but richly packed`);
  } else {
    score += 10;
    reasons.push(`${preset.stopIds.length} stops — a focused itinerary`);
  }

  // +30 (capped): Interest matches
  let interestScore = 0;
  const matchedInterests: string[] = [];
  const stops = preset.stopIds.map(getPoiById).filter(Boolean) as KarnatakaPOI[];

  for (const interest of query.interests) {
    const hasMatch = stops.some((poi) => poiMatchesInterest(poi, interest));
    if (hasMatch) {
      interestScore = Math.min(interestScore + 15, 30);
      matchedInterests.push(INTEREST_LABELS[interest]);
    }
  }
  if (interestScore > 0) {
    score += interestScore;
    reasons.push(`Includes ${matchedInterests.join(', ')}`);
  }

  // +10: Travel mode supported
  const supportedModes = deriveTravelModes(preset.stopIds);
  const travelModeSupported =
    query.travelMode === 'any' ||
    query.travelMode === 'self_drive' ||
    supportedModes.includes(query.travelMode as 'bus' | 'train_local');

  if (travelModeSupported) {
    score += 10;
    const modeLabel =
      query.travelMode === 'any' ? 'any travel mode' :
      query.travelMode === 'self_drive' ? 'self-drive' :
      query.travelMode === 'bus' ? 'bus' : 'train + local transport';
    reasons.push(`Accessible by ${modeLabel}`);
  }

  // +10: Origin proximity to first stop
  if (stops.length > 0) {
    const distToFirst = computeHaversineKm(originCoords, stops[0].coordinates);
    if (distToFirst <= config.maxDistKm) {
      score += 10;
      reasons.push(`First stop ~${Math.round(distToFirst)} km from your origin (haversine)`);
    }
  }

  return { preset, score: Math.min(score, 100), reasons };
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * findJourneys — deterministic Karnataka journey search.
 *
 * Returns up to 6 results sorted by matchScore descending.
 * Always returns at least 1 result (fallback: Golden Corridor pilot circuit).
 */
export function findJourneys(query: JourneyFinderQuery): JourneyFinderResult[] {
  // Resolve origin coordinates
  const origin = KARNATAKA_GATEWAY_ORIGINS.find((o) => o.id === query.originId);
  const originCoords: [number, number] = origin
    ? origin.coordinates
    : [77.5683, 12.9784]; // Default: Bengaluru

  // Score every preset
  const scored: ScoredResult[] = CURATED_CIRCUIT_PRESETS.map((preset) =>
    scoreCircuit(preset, query, originCoords)
  );

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Take top 6
  const top = scored.slice(0, 6);

  // If nothing scored > 0, force the fallback
  const FALLBACK_ID = 'circuit-golden-bengaluru-mullayanagiri';
  const hasMeaningful = top.some((r) => r.score > 0);
  if (!hasMeaningful) {
    const fallback = CURATED_CIRCUIT_PRESETS.find((p) => p.id === FALLBACK_ID);
    if (fallback) {
      const fallbackScored = scoreCircuit(fallback, query, originCoords);
      top.splice(0, top.length, { ...fallbackScored, score: 1, reasons: ['Suggested as a default Karnataka journey'] });
    }
  }

  // Convert to JourneyFinderResult
  return top.map(({ preset, score, reasons }): JourneyFinderResult => {
    const totalDistanceKm = computeCircuitDistanceKm(originCoords, preset.stopIds);
    const bestFor = deriveInterestsFromStops(preset.stopIds);
    const travelModes = deriveTravelModes(preset.stopIds);
    const dataStatus = deriveDataStatus(preset.stopIds);

    // Derive titleKannada from the subtitle (which may contain Kannada script)
    // If subtitle has Kannada unicode, use it; otherwise fall back to title
    const hasKannada = /[\u0C80-\u0CFF]/.test(preset.subtitle);
    const titleKannada = hasKannada ? preset.subtitle : preset.title;

    return {
      circuit: {
        id: preset.id,
        title: preset.title,
        titleKannada,
        durationDays: preset.days,
        totalDistanceKm,
        stopIds: preset.stopIds,
        highlights: preset.highlights,
        bestFor,
        travelModes,
      },
      matchScore: score,
      matchReasons: reasons.length > 0 ? reasons : ['Karnataka journey worth exploring'],
      dataStatus,
    };
  });
}

// Re-export KARNATAKA_POIS for convenience in components that import from this module
export { KARNATAKA_POIS, CURATED_CIRCUIT_PRESETS, KARNATAKA_GATEWAY_ORIGINS };
