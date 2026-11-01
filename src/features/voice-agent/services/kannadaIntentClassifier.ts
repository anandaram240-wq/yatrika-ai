/**
 * src/features/voice-agent/services/kannadaIntentClassifier.ts
 * Deterministic Kannada intent classification and entity extraction engine.
 * Priority-driven intent mapping with zero hallucination.
 */

import { VoiceIntentResult, TravelIntent, ExtractedTravelEntities } from '../domain/types';
import { normalizeKannadaVoiceText } from './kannadaTextNormalizer';

/**
 * Parses budget from numeric strings (e.g. "5000", "₹5,000", "5k") or Kannada words
 */
function extractBudget(text: string): number | undefined {
  const digitMatch = text.match(/(?:₹|rs\.?|inr)?\s*(\d+[\d,]*)(?:\s*k)?/i);
  if (digitMatch && digitMatch[1]) {
    const rawNum = parseInt(digitMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(rawNum) && rawNum > 50) {
      if (text.toLowerCase().includes('k') && rawNum < 100) {
        return rawNum * 1000;
      }
      return rawNum;
    }
  }

  if (text.includes('ಐದು ಸಾವಿರ') || text.includes('5000')) return 5000;
  if (text.includes('ಹತ್ತು ಸಾವಿರ') || text.includes('10000')) return 10000;
  if (text.includes('ಇಪ್ಪತ್ತು ಸಾವಿರ') || text.includes('20000')) return 20000;
  if (text.includes('ಮೂರು ಸಾವಿರ') || text.includes('3000')) return 3000;

  return undefined;
}

/**
 * Parses duration in days
 */
function extractDurationDays(text: string): number | undefined {
  const dayMatch = text.match(/(\d+)\s*(?:ದಿನ|days?|d)/i);
  if (dayMatch && dayMatch[1]) {
    return parseInt(dayMatch[1], 10);
  }
  if (text.includes('ಒಂದು ದಿನ')) return 1;
  if (text.includes('ಎರಡು ದಿನ')) return 2;
  if (text.includes('ಮೂರು ದಿನ')) return 3;
  if (text.includes('ನಾಲ್ಕು ದಿನ')) return 4;
  if (text.includes('ಐದು ದಿನ')) return 5;
  return undefined;
}

/**
 * Classifies intent and extracts travel entities with strict priority:
 * 1. Emergency (highest priority)
 * 2. Weather & Micro-climate query
 * 3. Food / Khanavali query
 * 4. Corridor / Road advice query
 * 5. Full Trip / Route Search (with or without budget)
 * 6. Pure Budget inquiry
 */
export function classifyKannadaIntent(rawVoiceInput: string): VoiceIntentResult {
  const { normalizedText, detectedDialect, detectedLanguage, canonicalEntities } =
    normalizeKannadaVoiceText(rawVoiceInput);

  const lower = normalizedText.toLowerCase();
  const entities: ExtractedTravelEntities = {};

  // 1. Extract Budget
  const budget = extractBudget(lower);
  if (budget) entities.budgetInr = budget;

  // 2. Extract Duration
  const days = extractDurationDays(lower);
  if (days) entities.durationDays = days;

  // 3. Extract Destinations & Origins via Kannada grammatical case markers
  // Suffix '-ನಿಂದ' = Ablative case (From Origin)
  // Suffix '-ಗೆ' / '-ಕ್ಕೆ' = Dative case (To Destination)
  if (lower.includes('ಮೈಸೂರಿನಿಂದ') || lower.includes('from mysore') || lower.includes('from mysuru')) {
    entities.origin = 'ಮೈಸೂರು';
  } else if (lower.includes('ಬೆಂಗಳೂರಿನಿಂದ') || lower.includes('from bangalore') || lower.includes('from bengaluru')) {
    entities.origin = 'ಬೆಂಗಳೂರು';
  } else if (lower.includes('ಚಿಕ್ಕಮಗಳೂರಿನಿಂದ') || lower.includes('from chikmagalur')) {
    entities.origin = 'ಚಿಕ್ಕಮಗಳೂರು';
  }

  if (lower.includes('ಚಿಕ್ಕಮಗಳೂರಿಗೆ') || lower.includes('to chikmagalur') || lower.includes('to chikkamagaluru')) {
    entities.destination = 'ಚಿಕ್ಕಮಗಳೂರು';
  } else if (lower.includes('ಹಂಪಿಗೆ') || lower.includes('to hampi')) {
    entities.destination = 'ಹಂಪಿ';
  } else if (lower.includes('ಮೈಸೂರಿಗೆ') || lower.includes('to mysore') || lower.includes('to mysuru')) {
    entities.destination = 'ಮೈಸೂರು';
  } else if (lower.includes('ಉಡುಪಿಗೆ') || lower.includes('ಗೋಕರ್ಣಕ್ಕೆ') || lower.includes('ಗೋಕರ್ಣಗೆ')) {
    entities.destination = lower.includes('ಉಡುಪಿಗೆ') ? 'ಉಡುಪಿ' : 'ಗೋಕರ್ಣ';
  } else {
    // Fallback using canonicalEntities excluding origin
    const remaining = canonicalEntities.filter((e) => e !== entities.origin);
    if (remaining.length > 0) {
      entities.destination = remaining[0];
    }
  }

  // 4. Weather / Rain Exclusion
  if (lower.includes('ಮಳೆ ಬೇಡ') || lower.includes('no rain') || lower.includes('dry')) {
    entities.excludedConditions = ['heavy_rainfall'];
    entities.travelSeason = 'winter_oct_feb';
  } else if (lower.includes('ಮಳೆಗಾಲ') || lower.includes('monsoon') || lower.includes('waterfall')) {
    entities.travelSeason = 'monsoon_jun_sep';
  }

  // 5. Shakti Scheme / Female Passenger
  if (lower.includes('ಶಕ್ತಿ') || lower.includes('shakti') || lower.includes('ಮಹಿಳೆ') || lower.includes('free bus')) {
    entities.isFemalePassenger = true;
  }

  // Determine circuit matching if geographic markers are present (accounting for Kannada vibhakti declensions)
  let targetCircuitId: string | undefined = undefined;
  if (
    lower.includes('ಸುವರ್ಣ') ||
    lower.includes('golden') ||
    ((lower.includes('ಬೇಲೂರು') || lower.includes('belur') || lower.includes('ಹಾಸನ') || lower.includes('hassan')) &&
      (lower.includes('ಮುಳ್ಳಯ್ಯನಗಿರಿ') || lower.includes('ಚಿಕ್ಕಮಗಳೂರ') || lower.includes('mullayanagiri') || lower.includes('chikmagalur')))
  ) {
    targetCircuitId = 'circuit-golden-bengaluru-mullayanagiri';
  } else if (
    lower.includes('ಚಿಕ್ಕಮಗಳೂರ') ||
    lower.includes('ಚಿಕ್ಕಮಗಳೂರಿ') ||
    lower.includes('ಮುಳ್ಳಯ್ಯನಗಿರಿ') ||
    lower.includes('chikmagalur') ||
    lower.includes('mullayanagiri')
  ) {
    targetCircuitId = 'circuit-chikkamagaluru';
  } else if (lower.includes('ಹಂಪಿ') || lower.includes('hampi') || lower.includes('ಬಾದಾಮಿ') || lower.includes('badami')) {
    targetCircuitId = 'circuit-unesco';
  } else if (lower.includes('ಮೈಸೂರ') || lower.includes('mysore') || lower.includes('ಕೊಡಗು') || lower.includes('coorg')) {
    targetCircuitId = 'circuit-mysuru-coorg';
  } else if (
    lower.includes('ಕರಾವಳಿ') ||
    lower.includes('ಗೋಕರ್ಣ') ||
    lower.includes('ಉಡುಪಿ') ||
    lower.includes('gokarna') ||
    lower.includes('udupi')
  ) {
    targetCircuitId = 'circuit-karavali';
  }

  let intent: TravelIntent = 'destination_search';
  let suggestedAction: VoiceIntentResult['suggestedAction'] = undefined;
  let confidence = 0.88;

  // PRIORITY 1: Emergency query
  if (
    lower.includes('ಅಪಘಾತ') ||
    lower.includes('help') ||
    lower.includes('emergency') ||
    lower.includes('ಪೊಲೀಸ್') ||
    lower.includes('ಆಸ್ಪತ್ರೆ') ||
    lower.includes('112') ||
    lower.includes('108')
  ) {
    intent = 'emergency_query';
    confidence = 0.98;
  }
  // PRIORITY 2: Weather / Micro-climate query
  else if (
    lower.includes('ಹವಾಮಾನ') ||
    lower.includes('ಮಳೆ ಹೇಗಿದೆ') ||
    lower.includes('ಮಂಜು ಇದೆಯೇ') ||
    lower.includes('weather') ||
    (lower.includes('ಮಳೆ') && lower.includes('ಹೇಗಿದೆ'))
  ) {
    intent = 'weather_season_query';
    confidence = 0.94;
  }
  // PRIORITY 3: Food / Khanavali query
  else if (
    lower.includes('ಊಟ') ||
    lower.includes('ಖಾನಾವಳಿ') ||
    lower.includes('ದೋಸೆ') ||
    lower.includes('food') ||
    lower.includes('ತಿಂಡಿ') ||
    lower.includes('ರೊಟ್ಟಿ')
  ) {
    intent = 'food_khanavali_query';
    confidence = 0.94;
  }
  // PRIORITY 4: Route Search (Plan, Trip, Circuit keywords)
  else if (
    targetCircuitId ||
    lower.includes('ಪ್ಲಾನ್') ||
    lower.includes('ಪ್ರವಾಸ') ||
    lower.includes('ಹೋಗಲು') ||
    lower.includes('ತೋರಿಸಿ') ||
    lower.includes('plan') ||
    lower.includes('trip') ||
    lower.includes('itinerary')
  ) {
    intent = 'route_search';
    suggestedAction = targetCircuitId ? 'LOAD_CIRCUIT' : 'OPTIMIZE_ROUTE';
    confidence = 0.95;
  }
  // PRIORITY 5: Pure Budget query
  else if (lower.includes('ಬಜೆಟ್') || lower.includes('ಖರ್ಚು') || lower.includes('budget') || lower.includes('ದುಡ್ಡು')) {
    intent = 'budget_query';
    suggestedAction = 'SHOW_BUDGET';
    confidence = 0.93;
  }
  // PRIORITY 6: Corridor / Road condition query
  else if (lower.includes('ಘಾಟ್') || lower.includes('ರಸ್ತೆ') || lower.includes('corridor')) {
    intent = 'corridor_advice_query';
    confidence = 0.91;
  }

  // Fallback / Unknown
  if (normalizedText.length < 3) {
    intent = 'unknown';
    confidence = 0.3;
  }

  return {
    rawTranscript: rawVoiceInput,
    normalizedText,
    detectedDialect,
    language: detectedLanguage,
    intent,
    confidence,
    entities,
    requiresClarification: intent === 'unknown' || (intent === 'route_search' && !targetCircuitId && !entities.destination),
    clarificationPromptKannada:
      intent === 'unknown'
        ? 'ಕ್ಷಮಿಸಿ, ಮತ್ತೊಮ್ಮೆ ಸ್ಪಷ್ಟವಾಗಿ ಹೇಳಿ. ಉದಾಹರಣೆಗೆ: "ಮೈಸೂರಿನಿಂದ ಹಂಪಿಗೆ ಹೋಗಲು ಪ್ಲಾನ್ ಮಾಡಿ"'
        : undefined,
    suggestedAction,
    targetCircuitId,
  };
}
