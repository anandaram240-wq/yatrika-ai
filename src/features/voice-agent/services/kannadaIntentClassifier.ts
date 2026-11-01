/**
 * src/features/voice-agent/services/kannadaIntentClassifier.ts
 * Deterministic Kannada intent classification and entity extraction engine.
 * Priority-driven intent mapping with zero hallucination.
 * Morphological vibhakti declension parsing for Kannada travel queries.
 */

import { VoiceIntentResult, TravelIntent, ExtractedTravelEntities } from '../domain/types';
import { normalizeKannadaVoiceText } from './kannadaTextNormalizer';

/**
 * Verified Geographic entity patterns for canonical Karnataka destinations
 */
export const KARNATAKA_CANONICAL_PLACES = [
  { canonical: 'ಬೆಂಗಳೂರು', patterns: [/ಬೆಂಗಳೂರು/i, /bangalore/i, /bengaluru/i] },
  { canonical: 'ಮೈಸೂರು ಅರಮನೆ', patterns: [/ಮೈಸೂರು ಅರಮನೆ/i, /mysore palace/i] },
  { canonical: 'ಮೈಸೂರು', patterns: [/ಮೈಸೂರು/i, /mysore/i, /mysuru/i, /ಮೈಸೂರ್/i] },
  { canonical: 'ಬೇಲೂರು', patterns: [/ಬೇಲೂರು/i, /belur/i] },
  { canonical: 'ಹಾಸನ', patterns: [/ಹಾಸನ/i, /hassan/i] },
  { canonical: 'ಮುಳ್ಳಯ್ಯನಗಿರಿ', patterns: [/ಮುಳ್ಳಯ್ಯನಗಿರಿ/i, /mullayanagiri/i] },
  { canonical: 'ಚಿಕ್ಕಮಗಳೂರು', patterns: [/ಚಿಕ್ಕಮಗಳೂರು/i, /chikmagalur/i, /chikkamagaluru/i] },
  { canonical: 'ಹಂಪಿ', patterns: [/ಹಂಪಿ/i, /hampi/i] },
  { canonical: 'ಬಾದಾಮಿ', patterns: [/ಬಾದಾಮಿ/i, /badami/i] },
  { canonical: 'ಪಟ್ಟದಕಲ್ಲು', patterns: [/ಪಟ್ಟದಕಲ್ಲು/i, /pattadakal/i] },
  { canonical: 'ಐಹೊಳೆ', patterns: [/ಐಹೊಳೆ/i, /aihole/i] },
  { canonical: 'ಜೋಗ ಜಲಪಾತ', patterns: [/ಜೋಗ/i, /jog/i] },
  { canonical: 'ಗೋಕರ್ಣ', patterns: [/ಗೋಕರ್ಣ/i, /gokarna/i] },
  { canonical: 'ಉಡುಪಿ', patterns: [/ಉಡುಪಿ/i, /udupi/i] },
  { canonical: 'ಮಂಗಳೂರು', patterns: [/ಮಂಗಳೂರು/i, /mangalore/i, /mangaluru/i] },
  { canonical: 'ಮುರುಡೇಶ್ವರ', patterns: [/ಮುರುಡೇಶ್ವರ/i, /murudeshwar/i] },
  { canonical: 'ಮಡಿಕೇರಿ', patterns: [/ಮಡಿಕೇರಿ/i, /madikeri/i] },
  { canonical: 'ಕೊಡಗು', patterns: [/ಕೊಡಗು/i, /coorg/i, /kodagu/i] },
  { canonical: 'ಕಬಿನಿ', patterns: [/ಕಬಿನಿ/i, /kabini/i] },
  { canonical: 'ನಾಗರಹೊಳೆ', patterns: [/ನಾಗರಹೊಳೆ/i, /nagarhole/i] },
  { canonical: 'ವಿಜಯಪುರ', patterns: [/ವಿಜಯಪುರ/i, /ಬಿಜಾಪುರ/i, /vijayapura/i, /bijapur/i] },
  { canonical: 'ನಂದಿ ಬೆಟ್ಟ', patterns: [/ನಂದಿ\s*(?:ಬೆಟ್ಟ|ಹಿಲ್ಸ್)/i, /nandi\s*hills/i] },
  { canonical: 'ಮೇಕೆದಾಟು', patterns: [/ಮೇಕೆದಾಟು/i, /mekedatu/i] },
  { canonical: 'ಬನ್ನೇರುಘಟ್ಟ', patterns: [/ಬನ್ನೇರುಘಟ್ಟ/i, /bannerghatta/i] },
  { canonical: 'ಚನ್ನಪಟ್ಟಣ', patterns: [/ಚನ್ನಪಟ್ಟಣ/i, /channapatna/i] },
  { canonical: 'ಶಿವನಸಮುದ್ರ', patterns: [/ಶಿವನಸಮುದ್ರ/i, /shivanasamudra/i] },
  { canonical: 'ಸಾವನದುರ್ಗ', patterns: [/ಸಾವನದುರ್ಗ/i, /savanadurga/i] },
  { canonical: 'ರಾಮನಗರ', patterns: [/ರಾಮನಗರ/i, /ramanagara/i] },
  { canonical: 'ಹೊಸಕೋಟೆ', patterns: [/ಹೊಸಕೋಟೆ/i, /hoskote/i] },
  { canonical: 'ದೊಡ್ಡ ಆಲದ ಮರ', patterns: [/ದೊಡ್ಡ ಆಲದ ಮರ/i, /big banyan tree/i] },
  { canonical: 'ಶ್ರೀರಂಗಪಟ್ಟಣ', patterns: [/ಶ್ರೀರಂಗಪಟ್ಟಣ/i, /srirangapatna/i] },
  { canonical: 'ತಲಕಾಡು', patterns: [/ತಲಕಾಡು/i, /talakadu/i] },
  { canonical: 'ಸೋಮನಾಥಪುರ', patterns: [/ಸೋಮನಾಥಪುರ/i, /somnathpur/i] },
  { canonical: 'ಮೇಲುಕೋಟೆ', patterns: [/ಮೇಲುಕೋಟೆ/i, /melukote/i] },
  { canonical: 'ಗೋಪಾಲಸ್ವಾಮಿ ಬೆಟ್ಟ', patterns: [/ಗೋಪಾಲಸ್ವಾಮಿ/i, /gopalaswamy/i] },
  { canonical: 'ಬಂಡೀಪುರ', patterns: [/ಬಂಡೀಪುರ/i, /bandipur/i] },
  { canonical: 'ರಂಗನತಿಟ್ಟು', patterns: [/ರಂಗನತಿಟ್ಟು/i, /ranganathittu/i] },
  { canonical: 'ಶ್ರವಣಬೆಳಗೊಳ', patterns: [/ಶ್ರವಣಬೆಳಗೊಳ/i, /shravanabelagola/i] },
  { canonical: 'ನಂಜನಗೂಡು', patterns: [/ನಂಜನಗೂಡು/i, /nanjangud/i] },
  { canonical: 'ಎಂಎಂ ಹಿಲ್ಸ್', patterns: [/ಮಲೆ ಮಹದೇಶ್ವರ/i, /ಎಂಎಂ ಹಿಲ್ಸ್/i, /mm hills/i] },
  { canonical: 'ಕೊಲ್ಲೂರು', patterns: [/ಕೊಲ್ಲೂರು/i, /kollur/i] },
  { canonical: 'ಮರವಂತೆ', patterns: [/ಮರವಂತೆ/i, /maravanthe/i] },
  { canonical: 'ಆನೆಗುಡ್ಡೆ', patterns: [/ಆನೆಗುಡ್ಡೆ/i, /anegudde/i] },
  { canonical: 'ಸೈಂಟ್ ಮೇರಿಸ್', patterns: [/ಸೈಂಟ್ ಮೇರಿಸ್/i, /st mary/i] },
  { canonical: 'ಬೈಂದೂರು', patterns: [/ಬೈಂದೂರು/i, /ಒಟ್ಟಿನೆಣೆ/i, /baindur/i] },
  { canonical: 'ಮೂಡುಬಿದಿರೆ', patterns: [/ಮೂಡುಬಿದಿರೆ/i, /moodabidri/i] },
  { canonical: 'ಧರ್ಮಸ್ಥಳ', patterns: [/ಧರ್ಮಸ್ಥಳ/i, /dharmasthala/i] },
  { canonical: 'ಕುಕ್ಕೆ ಸುಬ್ರಹ್ಮಣ್ಯ', patterns: [/ಕುಕ್ಕೆ/i, /ಸುಬ್ರಹ್ಮಣ್ಯ/i, /subramanya/i] },
  { canonical: 'ಕಾಪು ಬೀಚ್', patterns: [/ಕಾಪು/i, /kapu/i] },
  { canonical: 'ಯಾಣ', patterns: [/ಯಾಣ/i, /yana/i] },
  { canonical: 'ಅಗುಂಬೆ', patterns: [/ಅಗುಂಬೆ/i, /agumbe/i] },
  { canonical: 'ಇಕ್ಕೇರಿ', patterns: [/ಇಕ್ಕೇರಿ/i, /ikkeri/i] },
  { canonical: 'ಶೃಂಗೇರಿ', patterns: [/ಶೃಂಗೇರಿ/i, /sringeri/i] },
  { canonical: 'ಕುದುರೆಮುಖ', patterns: [/ಕುದುರೆಮುಖ/i, /kudremukh/i] },
  { canonical: 'ಹೊನ್ನಾವರ', patterns: [/ಹೊನ್ನಾವರ/i, /honnavar/i] },
  { canonical: 'ಕವಲೇದುರ್ಗ', patterns: [/ಕವಲೇದುರ್ಗ/i, /kavaledurga/i] },
  { canonical: 'ಬನವಾಸಿ', patterns: [/ಬನವಾಸಿ/i, /banavasi/i] },
  { canonical: 'ಉಂಚಳ್ಳಿ ಫಾಲ್ಸ್', patterns: [/ಉಂಚಳ್ಳಿ/i, /unchalli/i] },
  { canonical: 'ಕುಪ್ಪಳ್ಳಿ', patterns: [/ಕುಪ್ಪಳ್ಳಿ/i, /kuppalli/i] },
  { canonical: 'ಹೊರನಾಡು', patterns: [/ಹೊರನಾಡು/i, /horanadu/i] },
  { canonical: 'ಕಲಬುರಗಿ', patterns: [/ಕಲಬುರಗಿ/i, /gulbarga/i] },
  { canonical: 'ಬೀದರ್', patterns: [/ಬೀದರ್/i, /bidar/i] },
  { canonical: 'ಬಸವಕಲ್ಯಾಣ', patterns: [/ಬಸವಕಲ್ಯಾಣ/i, /basavakalyan/i] },
  { canonical: 'ಸನ್ನತಿ', patterns: [/ಸನ್ನತಿ/i, /sannati/i] },
  { canonical: 'ರಾಯಚೂರು', patterns: [/ರಾಯಚೂರು/i, /raichur/i] },
  { canonical: 'ಯಾದಗಿರಿ', patterns: [/ಯಾದಗಿರಿ/i, /yadgir/i] },
  { canonical: 'ಕೊಪ್ಪಳ', patterns: [/ಕೊಪ್ಪಳ/i, /koppal/i] },
  { canonical: 'ಬಳ್ಳಾರಿ', patterns: [/ಬಳ್ಳಾರಿ/i, /ballari/i, /bellary/i] },
  { canonical: 'ಕೊಟ್ಟೂರು', patterns: [/ಕೊಟ್ಟೂರು/i, /kotturu/i] },
  { canonical: 'ಗಾಣಗಾಪುರ', patterns: [/ಗಾಣಗಾಪುರ/i, /ganagapura/i] },
  { canonical: 'ಕಿತ್ತೂರು', patterns: [/ಕಿತ್ತೂರು/i, /kittur/i] },
  { canonical: 'ಬೆಳಗಾವಿ', patterns: [/ಬೆಳಗಾವಿ/i, /belagavi/i, /belgaum/i] },
  { canonical: 'ಧಾರವಾಡ', patterns: [/ಧಾರವಾಡ/i, /dharwad/i] },
  { canonical: 'ಹುಬ್ಬಳ್ಳಿ', patterns: [/ಹುಬ್ಬಳ್ಳಿ/i, /hubballi/i, /hubli/i] },
  { canonical: 'ಗೋಕಾಕ್ ಜಲಪಾತ', patterns: [/ಗೋಕಾಕ್/i, /gokak/i] },
  { canonical: 'ಸವದತ್ತಿ', patterns: [/ಸವದತ್ತಿ/i, /savadatti/i] },
  { canonical: 'ಗದಗ', patterns: [/ಗದಗ/i, /gadag/i] },
  { canonical: 'ಹಾವೇರಿ', patterns: [/ಹಾವೇರಿ/i, /haveri/i] },
  { canonical: 'ದಾವಣಗೆರೆ', patterns: [/ದಾವಣಗೆರೆ/i, /davanagere/i] },
  { canonical: 'ಚಿತ್ರದುರ್ಗ', patterns: [/ಚಿತ್ರದುರ್ಗ/i, /chitradurga/i] },
  { canonical: 'ದಾಂಡೇಲಿ', patterns: [/ದಾಂಡೇಲಿ/i, /dandeli/i] },
];

function matchPlaceName(text: string): string | undefined {
  if (!text) return undefined;
  for (const p of KARNATAKA_CANONICAL_PLACES) {
    if (p.patterns.some((pat) => pat.test(text))) return p.canonical;
  }
  return undefined;
}

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
 * 4. Pure Budget inquiry / Shakti waiver
 * 5. Corridor / Road / Gate / Permit advice query
 * 6. Full Trip / Route Search
 */
export function classifyKannadaIntent(rawVoiceInput: string): VoiceIntentResult {
  const { normalizedText, detectedDialect, detectedLanguage } =
    normalizeKannadaVoiceText(rawVoiceInput);

  const lower = normalizedText.toLowerCase();
  const entities: ExtractedTravelEntities = {};

  // 1. Extract Budget
  const budget = extractBudget(lower);
  if (budget) entities.budgetInr = budget;

  // 2. Extract Duration
  const days = extractDurationDays(lower);
  if (days) entities.durationDays = days;

  // 3. Extract Shakti Scheme / Female Passenger
  if (
    lower.includes('ಶಕ್ತಿ') ||
    lower.includes('shakti') ||
    lower.includes('ಮಹಿಳೆ') ||
    lower.includes('free bus') ||
    lower.includes('free for women')
  ) {
    entities.isFemalePassenger = true;
  }

  // 4. Extract Origin via Kannada Ablative case (-ನಿಂದ, -ರಿನಿಂದ, -ರಿಂದ, etc.) or Kanglish
  let origin: string | undefined = undefined;
  if (
    lower.includes('ಬೆಂಗಳೂರಿನಿಂದ') ||
    /from\s+bangalore/i.test(lower) ||
    /bangalore\s+inda/i.test(lower) ||
    /bengaluru\s+inda/i.test(lower)
  ) {
    origin = 'ಬೆಂಗಳೂರು';
  } else if (
    lower.includes('ಮೈಸೂರಿನಿಂದ') ||
    /from\s+mysore/i.test(lower) ||
    /mysore\s+inda/i.test(lower) ||
    /mysore palace inda/i.test(lower)
  ) {
    origin = 'ಮೈಸೂರು';
  } else if (lower.includes('ಚಿಕ್ಕಮಗಳೂರಿನಿಂದ') || /from\s+chikmagalur/i.test(lower)) {
    origin = 'ಚಿಕ್ಕಮಗಳೂರು';
  }
  if (origin) entities.origin = origin;

  // 5. Extract Waypoints / Via connectors (ಮೂಲಕ, ಮುಖಾಂತರ, ಮಾರ್ಗವಾಗಿ, via)
  const waypoints: string[] = [];
  const viaMatch =
    normalizedText.match(/([^\s]+?)(?:ದ|ಯ)?\s*(?:ಮೂಲಕ|ಮುಖಾಂತರ|ಮಾರ್ಗವಾಗಿ)/u) ||
    normalizedText.match(/via\s+([a-zA-Z]+)/i);
  if (viaMatch && viaMatch[1]) {
    const viaPlace = matchPlaceName(viaMatch[1]);
    if (viaPlace) waypoints.push(viaPlace);
  }

  // 6. Extract Destination via Kannada Dative case (-ರಿಗೆ, -ಕ್ಕೆ, -ಗೆ, -ಇಗೆ) or Kanglish
  let destination: string | undefined = undefined;
  const words = normalizedText.split(/\s+/);
  for (const w of words) {
    const dativeSuffix = w.match(/(.+?)(?:ರಿಗೆ|ಕ್ಕೆ|ಗೆ|ಇಗೆ)$/u);
    if (dativeSuffix) {
      const stemWithRestore = dativeSuffix[1] + (w.endsWith('ರಿಗೆ') ? 'ರು' : '');
      const cand = matchPlaceName(stemWithRestore);
      if (cand && cand !== origin && !waypoints.includes(cand)) {
        destination = cand;
        break;
      }
    }
  }

  if (!destination) {
    const toMatch =
      normalizedText.match(/to\s+([a-zA-Z]+)/i) ||
      normalizedText.match(/([a-zA-Z]+)\s+ge\b/i);
    if (toMatch && toMatch[1]) {
      destination = matchPlaceName(toMatch[1]);
    }
  }

  if (!destination) {
    // Scan all place entities in sentence order, excluding origin and waypoints
    for (const p of KARNATAKA_CANONICAL_PLACES) {
      if (p.patterns.some((pat) => pat.test(normalizedText))) {
        if (p.canonical !== origin && !waypoints.includes(p.canonical)) {
          destination = p.canonical;
          break;
        }
      }
    }
  }
  if (destination) entities.destination = destination;

  // 7. Weather / Rain Exclusion
  if (lower.includes('ಮಳೆ ಬೇಡ') || lower.includes('no rain') || lower.includes('dry')) {
    entities.excludedConditions = ['heavy_rainfall'];
    entities.travelSeason = 'winter_oct_feb';
  } else if (lower.includes('ಮಳೆಗಾಲ') || lower.includes('monsoon') || lower.includes('waterfall')) {
    entities.travelSeason = 'monsoon_jun_sep';
  }

  // 8. Determine circuit matching if geographic markers are present
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

  // 9. Intent Classification Priority Order
  let intent: TravelIntent = 'route_search';
  let suggestedAction: VoiceIntentResult['suggestedAction'] = targetCircuitId ? 'LOAD_CIRCUIT' : 'OPTIMIZE_ROUTE';
  let confidence = 0.92;

  // PRIORITY 1: Emergency query
  if (
    lower.includes('ಅಪಘಾತ') ||
    lower.includes('help') ||
    lower.includes('emergency') ||
    lower.includes('ಪೊಲೀಸ್') ||
    lower.includes('ಆಸ್ಪತ್ರೆ') ||
    lower.includes('112') ||
    lower.includes('108') ||
    lower.includes('ಸಹಾಯವಾಣಿ')
  ) {
    intent = 'emergency_query';
    confidence = 0.98;
    suggestedAction = undefined;
  }
  // PRIORITY 2: Weather / Micro-climate query
  else if (
    lower.includes('ಹವಾಮಾನ') ||
    lower.includes('ಮಳೆ ಹೇಗಿದೆ') ||
    (lower.includes('ಮಂಜು') && !lower.includes('ಮಂಜುನಾಥ')) ||
    lower.includes('ಬಿಸಿಲು') ||
    lower.includes('weather') ||
    lower.includes('ಉಷ್ಣಾಂಶ') ||
    (lower.includes('ಮಳೆಗಾಲದಲ್ಲಿ') && lower.includes('ಬೆಸ್ಟ್ ಟೈಮ್')) ||
    lower.includes('ಮಳೆ ಗಾಳಿ') ||
    lower.includes('ಮಳೆ ಬರ್ತದಾ')
  ) {
    intent = 'weather_season_query';
    confidence = 0.94;
    suggestedAction = undefined;
  }
  // PRIORITY 3: Food / Khanavali query
  else if (
    lower.includes('ಊಟ') ||
    lower.includes('ಖಾನಾವಳಿ') ||
    lower.includes('ದೋಸೆ') ||
    lower.includes('food') ||
    lower.includes('ತಿಂಡಿ') ||
    lower.includes('ರೊಟ್ಟಿ') ||
    lower.includes('ಪೇಡಾ') ||
    lower.includes('ಪೇಡ') ||
    lower.includes('ಬಿರಿಯಾನಿ') ||
    lower.includes('ಪ್ರಸಾದ') ||
    lower.includes('ಮಿರ್ಚಿ ಬಜ್ಜಿ') ||
    lower.includes('ಮೀನಿನ ಊಟ') ||
    lower.includes('ಕಾಫಿ') ||
    lower.includes('ಬೊಂಬೆ ಅಂಗಡಿ') ||
    lower.includes('ಐಸ್ ಕ್ರೀಮ್ ತಿನ್ನಲು')
  ) {
    intent = 'food_khanavali_query';
    confidence = 0.94;
    suggestedAction = undefined;
  }
  // PRIORITY 4: Pure Budget query / Shakti fare waiver
  else if (
    lower.includes('ಬಜೆಟ್ ಎಷ್ಟು') ||
    lower.includes('ಎಷ್ಟು ಖರ್ಚು') ||
    lower.includes('ಖರ್ಚು ಬರತದ') ||
    lower.includes('ಟಿಕೆಟ್ ದರ ಎಷ್ಟು') ||
    lower.includes('ಉಚಿತವೇ') ||
    lower.includes('free for women') ||
    lower.includes('ಉಚಿತವಿದೆಯೇ') ||
    lower.includes('free bus') ||
    (lower.includes('ಬಜೆಟ್‌ನಲ್ಲಿ') && lower.includes('ಏನೆಲ್ಲಾ ಕವರ್'))
  ) {
    intent = 'budget_query';
    suggestedAction = 'SHOW_BUDGET';
    confidence = 0.93;
  }
  // PRIORITY 5: Corridor / Road condition / Gate / Permit query
  else if (
    (lower.includes('ಘಾಟ್') && !lower.includes('ಪ್ರವಾಸ')) ||
    lower.includes('ರಸ್ತೆ ಸ್ಥಿತಿ') ||
    lower.includes('road condition') ||
    lower.includes('safe ಇದೆಯಾ') ||
    (lower.includes('ದಾರಿ ಯಾವುದು') && !lower.includes('ನೋಡಲು')) ||
    lower.includes('ಸಮಯ ಯಾವಾಗ') ||
    lower.includes('ಟೈಮಿಂಗ್ಸ್') ||
    lower.includes('timings') ||
    lower.includes('ಕ್ಲೋಸ್ ಮಾಡ್ತಾರಾ') ||
    lower.includes('close ಆಗುತ್ತೆ') ||
    lower.includes('ಎಷ್ಟು ಹೊತ್ತು ಹಿಡೀತೈತಿ') ||
    lower.includes('ಪರ್ಮಿಷನ್ ಬೇಕಾ') ||
    lower.includes('permit') ||
    lower.includes('ticket booking online') ||
    lower.includes('ಅನುಮತಿ') ||
    lower.includes('ಹೊತ್ತು ಹಿಡೀತೈತಿ') ||
    lower.includes('ಯಾವಾಗ ಹೊರಡುತ್ತದೆ') ||
    lower.includes('ಮಾರ್ಗ ವಿವರ') ||
    lower.includes('ಯಾವಾಗ ಓಪನ್ ಆಗ್ತದೆ')
  ) {
    intent = 'corridor_advice_query';
    confidence = 0.91;
    suggestedAction = undefined;
  }
  // PRIORITY 6: Route Search (Default for trip, places, itineraries)
  else {
    intent = 'route_search';
    confidence = 0.95;
  }

  // Empty / Gibberish Fallback
  if (normalizedText.length < 3 || normalizedText === '..' || normalizedText === '...') {
    intent = 'unknown';
    confidence = 0.3;
    suggestedAction = undefined;
  }

  return {
    rawTranscript: rawVoiceInput,
    normalizedText,
    detectedDialect,
    language: detectedLanguage,
    intent,
    confidence,
    entities,
    requiresClarification:
      intent === 'unknown' || (intent === 'route_search' && !targetCircuitId && !entities.destination),
    clarificationPromptKannada:
      intent === 'unknown'
        ? 'ಕ್ಷಮಿಸಿ, ಮತ್ತೊಮ್ಮೆ ಸ್ಪಷ್ಟವಾಗಿ ಹೇಳಿ. ಉದಾಹರಣೆಗೆ: "ಮೈಸೂರಿನಿಂದ ಹಂಪಿಗೆ ಹೋಗಲು ಪ್ಲಾನ್ ಮಾಡಿ"'
        : undefined,
    suggestedAction,
    targetCircuitId,
  };
}
