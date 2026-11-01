/**
 * src/features/voice-agent/services/kannadaTextNormalizer.ts
 * Rigorous Kannada text and dialect normalizer for speech-to-intent pipeline
 */

import { RegionalDialectZone } from '../domain/types';

// Common geographical alias mapping (Kannada & English transliterations -> canonical Kannada)
const GEOGRAPHIC_ENTITY_ALIASES: Record<string, string> = {
  // Chikkamagaluru & Mullayanagiri
  'chikmagalur': 'ಚಿಕ್ಕಮಗಳೂರು',
  'chikkamagaluru': 'ಚಿಕ್ಕಮಗಳೂರು',
  'chikmaglur': 'ಚಿಕ್ಕಮಗಳೂರು',
  'ಚಿಕ್ಕಮಗಳೂರಿಗೆ': 'ಚಿಕ್ಕಮಗಳೂರು',
  'ಚಿಕ್ಕಮಗಳೂರಿನಿಂದ': 'ಚಿಕ್ಕಮಗಳೂರು',
  'ಚಿಕ್ಕಮಗಳೂರು': 'ಚಿಕ್ಕಮಗಳೂರು',
  'mullayanagiri': 'ಮುಳ್ಳಯ್ಯನಗಿರಿ',
  'mullayangiri': 'ಮುಳ್ಳಯ್ಯನಗಿರಿ',
  'ಮುಳ್ಳಯ್ಯನಗಿರಿಗೆ': 'ಮುಳ್ಳಯ್ಯನಗಿರಿ',
  'ಮುಳ್ಳಯ್ಯನಗಿರಿ': 'ಮುಳ್ಳಯ್ಯನಗಿರಿ',
  'bababudan': 'ಬಾಬಾಬುಡನ್',
  'bababudangiri': 'ಬಾಬಾಬುಡನ್‌ಗಿರಿ',

  // Mysuru
  'mysore': 'ಮೈಸೂರು',
  'mysuru': 'ಮೈಸೂರು',
  'ಮೈಸೂರಿಗೆ': 'ಮೈಸೂರು',
  'ಮೈಸೂರಿನಿಂದ': 'ಮೈಸೂರು',
  'ಮೈಸೂರು': 'ಮೈಸೂರು',
  'chamundi': 'ಚಾಮುಂಡಿ',

  // Hampi & UNESCO
  'hampi': 'ಹಂಪಿ',
  'ಹಂಪಿಗೆ': 'ಹಂಪಿ',
  'ಹಂಪಿಯಿಂದ': 'ಹಂಪಿ',
  'vijayanagara': 'ವಿಜಯನಗರ',
  'badami': 'ಬಾದಾಮಿ',
  'ಬಾದಾಮಿಗೆ': 'ಬಾದಾಮಿ',
  'pattadakal': 'ಪಟ್ಟದಕಲ್ಲು',
  'aihole': 'ಐಹೊಳೆ',

  // Coastal / Karavali
  'gokarna': 'ಗೋಕರ್ಣ',
  'udupi': 'ಉಡುಪಿ',
  'mangalore': 'ಮಂಗಳೂರು',
  'mangaluru': 'ಮಂಗಳೂರು',
  'murudeshwar': 'ಮುರುಡೇಶ್ವರ',

  // Malnad Waterfalls & Hassan Heritage
  'jog': 'ಜೋಗ ಜಲಪಾತ',
  'jog falls': 'ಜೋಗ ಜಲಪಾತ',
  'coorg': 'ಕೊಡಗು',
  'madikeri': 'ಮಡಿಕೇರಿ',
  'kodagu': 'ಕೊಡಗು',
  'belur': 'ಬೇಲೂರು',
  'ಬೇಲೂರು': 'ಬೇಲೂರು',
  'ಬೇಲೂರಿಗೆ': 'ಬೇಲೂರು',
  'hassan': 'ಹಾಸನ',
  'ಹಾಸನ': 'ಹಾಸನ',
  'ಹಾಸನದ': 'ಹಾಸನ',
  'ಹಾಸನದಿಂದ': 'ಹಾಸನ',
  'ಹಾಸನಕ್ಕೆ': 'ಹಾಸನ',
  'shravanabelagola': 'ಶ್ರವಣಬೆಳಗೊಳ',
  'ಶ್ರವಣಬೆಳಗೊಳ': 'ಶ್ರವಣಬೆಳಗೊಳ',
  'bengaluru': 'ಬೆಂಗಳೂರು',
  'bangalore': 'ಬೆಂಗಳೂರು',
  'ಬೆಂಗಳೂರು': 'ಬೆಂಗಳೂರು',
  'ಬೆಂಗಳೂರಿನಿಂದ': 'ಬೆಂಗಳೂರು',
  'ಬೆಂಗಳೂರಿಗೆ': 'ಬೆಂಗಳೂರು',
  'bidar': 'ಬೀದರ್',
  'ಬೀದರ್': 'ಬೀದರ್',
  'ಬೀದರ್‌ಗೆ': 'ಬೀದರ್',
  'kalaburagi': 'ಕಲಬುರಗಿ',
  'gulbarga': 'ಕಲಬುರಗಿ',
  'ಕಲಬುರಗಿ': 'ಕಲಬುರಗಿ',
  'belagavi': 'ಬೆಳಗಾವಿ',
  'belgaum': 'ಬೆಳಗಾವಿ',
  'ಬೆಳಗಾವಿ': 'ಬೆಳಗಾವಿ',
  'hubli': 'ಹುಬ್ಬಳ್ಳಿ',
  'hubballi': 'ಹುಬ್ಬಳ್ಳಿ',
  'ಹುಬ್ಬಳ್ಳಿ': 'ಹುಬ್ಬಳ್ಳಿ',
  'dharwad': 'ಧಾರವಾಡ',
  'ಧಾರವಾಡ': 'ಧಾರವಾಡ',
  'kollur': 'ಕೊಲ್ಲೂರು',
  'ಕೊಲ್ಲೂರು': 'ಕೊಲ್ಲೂರು',
  'dharmasthala': 'ಧರ್ಮಸ್ಥಳ',
  'ಧರ್ಮಸ್ಥಳ': 'ಧರ್ಮಸ್ಥಳ',
  'subramanya': 'ಕುಕ್ಕೆ ಸುಬ್ರಹ್ಮಣ್ಯ',
  'ಕುಕ್ಕೆ ಸುಬ್ರಹ್ಮಣ್ಯ': 'ಕುಕ್ಕೆ ಸುಬ್ರಹ್ಮಣ್ಯ',
  'sringeri': 'ಶೃಂಗೇರಿ',
  'ಶೃಂಗೇರಿ': 'ಶೃಂಗೇರಿ',
  'horanadu': 'ಹೊರನಾಡು',
  'ಹೊರನಾಡು': 'ಹೊರನಾಡು',
  'chitradurga': 'ಚಿತ್ರದುರ್ಗ',
  'ಚಿತ್ರದುರ್ಗ': 'ಚಿತ್ರದುರ್ಗ',
  'dandeli': 'ದಾಂಡೇಲಿ',
  'ದಾಂಡೇಲಿ': 'ದಾಂಡೇಲಿ',
  'gokak': 'ಗೋಕಾಕ್ ಜಲಪಾತ',
  'ಗೋಕಾಕ್ ಜಲಪಾತ': 'ಗೋಕಾಕ್ ಜಲಪಾತ',
  'nandi hills': 'ನಂದಿ ಬೆಟ್ಟ',
  'ನಂದಿ ಬೆಟ್ಟ': 'ನಂದಿ ಬೆಟ್ಟ',
  'ನಂದಿ ಹಿಲ್ಸ್': 'ನಂದಿ ಬೆಟ್ಟ',
  'maravanthe': 'ಮರವಂತೆ',
  'ಮರವಂತೆ': 'ಮರವಂತೆ',
  'somnathpur': 'ಸೋಮನಾಥಪುರ',
  'ಸೋಮನಾಥಪುರ': 'ಸೋಮನಾಥಪುರ',
  'melukote': 'ಮೇಲುಕೋಟೆ',
  'ಮೇಲುಕೋಟೆ': 'ಮೇಲುಕೋಟೆ',
  'talakadu': 'ತಲಕಾಡು',
  'ತಲಕಾಡು': 'ತಲಕಾಡು',
  'bandipur': 'ಬಂಡೀಪುರ',
  'ಬಂಡೀಪುರ': 'ಬಂಡೀಪುರ',
  'kabini': 'ಕಬಿನಿ',
  'ಕಬಿನಿ': 'ಕಬಿನಿ',
  'nagarhole': 'ನಾಗರಹೊಳೆ',
  'ನಾಗರಹೊಳೆ': 'ನಾಗರಹೊಳೆ',
  'shivamogga': 'ಶಿವಮೊಗ್ಗ',
  'ಶಿವಮೊಗ್ಗ': 'ಶಿವಮೊಗ್ಗ',
  'agumbe': 'ಅಗುಂಬೆ',
  'ಅಗುಂಬೆ': 'ಅಗುಂಬೆ',
  'kudremukh': 'ಕುದುರೆಮುಖ',
  'ಕುದುರೆಮುಖ': 'ಕುದುರೆಮುಖ',
  'yana': 'ಯಾಣ',
  'ಯಾಣ': 'ಯಾಣ',
};

// Dialect marker keywords
const DIALECT_MARKERS: Array<{ marker: RegExp; dialect: RegionalDialectZone }> = [
  { marker: /(ಹೋಪುದು|ಬಪ್ಪದು|ಎಂತಾ|ಮಾರೆ|ಮರ್ಲೆ|ಕಡಲತೀರ|ಸಾರಂಗ)/i, dialect: 'karavali_coastal' },
  { marker: /(ಹೋಗತೀರಿ|ಬರತೀರಿ|ಯಾಕ್ರೀ|ಖರೆ|ಮಂದಿ|ಅವ್ವ|ಹೌದೇನು|ಖಾನಾವಳಿ)/i, dialect: 'kalyana_karnataka' },
  { marker: /(ಬರ್ತೀವಿ|ಹೋಗ್ತೀವಿ|ಕಣ್ರೀ|ಮಚ್ಚಾ|ಬ್ರೋ|ಸೂಪರ್)/i, dialect: 'standard_bengaluru' },
  { marker: /(ಮೈಸೂರ್|ಅರಮನೆ|ಬೆಟ್ಟ|ಚಾಮುಂಡಿ|ದೋಸೆ)/i, dialect: 'mysuru_mandya' },
  { marker: /(ಕಾಫಿ|ತೋಟ|ಮಲೆನಾಡು|ಘಾಟ್|ಮಂಜು|ಮಳೆ)/i, dialect: 'malnad_coorg' },
  { marker: /(ಬೆಳಗಾವಿ|ಕುಂದಾ|ಸವದತ್ತಿ|ಗೋಕಾಕ್)/i, dialect: 'kittur_belagavi' },
];

/**
 * Normalizes raw speech transcription text:
 * 1. Cleans Unicode combining characters and zero-width spaces.
 * 2. Normalizes punctuation and casing.
 * 3. Detects language and regional dialect.
 * 4. Resolves transliterated entity names to canonical Kannada forms.
 */
export function normalizeKannadaVoiceText(rawText: string): {
  normalizedText: string;
  detectedDialect: RegionalDialectZone;
  detectedLanguage: 'kn' | 'en' | 'mixed';
  canonicalEntities: string[];
} {
  if (!rawText || typeof rawText !== 'string') {
    return {
      normalizedText: '',
      detectedDialect: 'standard_bengaluru',
      detectedLanguage: 'kn',
      canonicalEntities: [],
    };
  }

  // 1. Unicode normalization and whitespace sanitization
  let text = rawText
    .normalize('NFC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // strip invisible zero-width chars
    .trim()
    .replace(/\s+/g, ' ');

  // 2. Language detection (Kannada Unicode block: 0x0C80 to 0x0CFF)
  const kannadaCharMatches = text.match(/[\u0C80-\u0CFF]/g);
  const totalChars = text.replace(/\s/g, '').length;
  const kannadaRatio = kannadaCharMatches ? kannadaCharMatches.length / Math.max(1, totalChars) : 0;

  let detectedLanguage: 'kn' | 'en' | 'mixed' = 'en';
  if (kannadaRatio > 0.6) {
    detectedLanguage = 'kn';
  } else if (kannadaRatio > 0.15) {
    detectedLanguage = 'mixed';
  }

  // 3. Dialect detection based on lexical tokens
  let detectedDialect: RegionalDialectZone = 'standard_bengaluru';
  for (const item of DIALECT_MARKERS) {
    if (item.marker.test(text)) {
      detectedDialect = item.dialect;
      break;
    }
  }

  // 4. Extract canonical geographic entities
  const canonicalEntities: string[] = [];
  const lowerText = text.toLowerCase();

  for (const [alias, canonical] of Object.entries(GEOGRAPHIC_ENTITY_ALIASES)) {
    if (lowerText.includes(alias) || text.includes(canonical)) {
      if (!canonicalEntities.includes(canonical)) {
        canonicalEntities.push(canonical);
      }
    }
  }

  return {
    normalizedText: text,
    detectedDialect,
    detectedLanguage,
    canonicalEntities,
  };
}
