/**
 * @file src/intelligence/confidenceScoring.ts
 * @description Non-misleading, multidimensional confidence and evidence scoring for YatriKa AI.
 * @theme Code. Create. Celebrate Kannada.
 */

export type EvidenceTier =
  | 'verified'              // Physically verified, statutory gazette, or primary inscription
  | 'officially_published'  // Direct publication from Government department / official portal
  | 'api_retrieved'         // Programmatic API response from reputable scientific/transit service
  | 'estimated'             // Calibrated mathematical model (e.g., OSRM road geometry, Wf gradient model)
  | 'inferred'              // Contextual / NLP semantic deduction requiring traveler confirmation
  | 'unknown';              // Missing, contradictory, or unverified data

export interface MultidimensionalConfidence {
  evidenceTier: EvidenceTier;
  evidenceWeight: number; // 0.0 - 1.0 calibrated to the specific tier
  freshnessScore: number; // 0.0 - 1.0 based on elapsed time vs validity period
  contradictionDetected: boolean;
  contradictionNote?: string;
  isStale: boolean;
  requiresTravelerConfirmation: boolean;
  humanReadableRationale: string;
}

const TIER_BASE_WEIGHTS: Record<EvidenceTier, number> = {
  verified: 1.0,
  officially_published: 0.95,
  api_retrieved: 0.85,
  estimated: 0.70,
  inferred: 0.50,
  unknown: 0.10,
};

export function evaluateMultidimensionalConfidence(params: {
  tier: EvidenceTier;
  retrievedAt: string;
  validityMinutes: number;
  conflictingSourcesCount?: number;
  unresolvedTokensCount?: number;
  customExplanation?: string;
}): MultidimensionalConfidence {
  const {
    tier,
    retrievedAt,
    validityMinutes,
    conflictingSourcesCount = 0,
    unresolvedTokensCount = 0,
    customExplanation,
  } = params;

  const now = Date.now();
  const retrievedTime = new Date(retrievedAt).getTime();
  const ageMinutes = Math.max(0, (now - retrievedTime) / 60000);
  const isStale = ageMinutes > validityMinutes;

  // Freshness score decays smoothly after validity threshold
  const freshnessRatio = Math.max(0, 1 - ageMinutes / (validityMinutes * 1.5));
  const freshnessScore = Number(freshnessRatio.toFixed(2));

  const contradictionDetected = conflictingSourcesCount > 1;
  const requiresTravelerConfirmation =
    tier === 'inferred' || tier === 'unknown' || isStale || contradictionDetected || unresolvedTokensCount > 0;

  let rationale = customExplanation ?? '';
  if (!rationale) {
    if (tier === 'verified') {
      rationale = 'Physically verified record with primary documentation.';
    } else if (tier === 'officially_published') {
      rationale = 'Sourced directly from published government or transport authority timetable.';
    } else if (tier === 'api_retrieved') {
      rationale = `Retrieved via live external API (${Math.round(ageMinutes)}m ago; fresh within ${validityMinutes}m).`;
    } else if (tier === 'estimated') {
      rationale = 'Computed via geospatial road-network and topographic speed model.';
    } else if (tier === 'inferred') {
      rationale = 'Syntactically inferred from conversational context; please verify before proceeding.';
    } else {
      rationale = 'Data unavailable or unverified. Do not rely on automated estimate without local check.';
    }
  }

  if (isStale) {
    rationale += ` ⚠️ Data is stale (last refreshed ${Math.round(ageMinutes)}m ago, validity is ${validityMinutes}m).`;
  }
  if (contradictionDetected) {
    rationale += ` ⚠️ Contradictory reports detected across ${conflictingSourcesCount} sources.`;
  }

  return {
    evidenceTier: tier,
    evidenceWeight: TIER_BASE_WEIGHTS[tier],
    freshnessScore,
    contradictionDetected,
    ...(contradictionDetected ? { contradictionNote: `Conflicting feeds detected across ${conflictingSourcesCount} sources` } : {}),
    isStale,
    requiresTravelerConfirmation,
    humanReadableRationale: rationale,
  };
}
