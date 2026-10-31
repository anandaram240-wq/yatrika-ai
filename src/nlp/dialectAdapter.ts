/**
 * @file src/nlp/dialectAdapter.ts
 * @description Dialect identification, transliteration, and code-switching normalizer.
 * @theme Code. Create. Celebrate Kannada.
 */

export type KannadaDialect =
  | 'Standard_OldMysuru'
  | 'Kundagannada_Coastal'
  | 'Havyaka_Malnad'
  | 'Kalyana_NorthEast'
  | 'Kittur_NorthWest'
  | 'CodeSwitched_Kanglish';

export interface DialectClassification {
  detectedDialect: KannadaDialect;
  confidence: number;
  matchedFeatures: string[];
  normalizedKannadaText: string;
}

const DIALECT_MARKERS: Record<KannadaDialect, string[]> = {
  Kundagannada_Coastal: ['ಹೆಂಗಿದ್ದೀರಿ', 'ಎಲ್ಲಿಗ್', 'ಆಪ್ದು', 'ಕಾಸು', 'ಬತ್ತಿನಿ', 'ಮರ್ಗೆ', 'ಕುಂದಾಪ್ರ'],
  Havyaka_Malnad: ['ಎಲ್ಲೆ', 'ಹೊರೆಟ್ಟಿರಾ', 'ಕೂಳಿ', 'ಉಂಬೋಣ', 'ಹಾಂಗೆ', 'ಹಿಂಗೇ', 'ಸಿರ್ಸಿ'],
  Kalyana_NorthEast: ['ಎತ್ತ', 'ಹೋಂಟಿರಿ', 'ಬರೂಣ್ರಿ', 'ಚೊಲೋ', 'ಖಾನಾವಳಿ', 'ಹೊಂಟೇವಿ', 'ಗುಲ್ಬರ್ಗ'],
  Kittur_NorthWest: ['ಹ್ಯಾಂಗಿದ್ದೀರಿ', 'ಹ್ಯಾಂಗೆ', 'ಹೊಂಟ್ರಿ', 'ಧಾರವಾಡ', 'ಬೆಳಗಾವಿ', 'ಪ್ಯಾಡಾ'],
  CodeSwitched_Kanglish: ['plan', 'trip', 'budget', 'resort', 'hotel', 'route', 'darshan', 'viewpoint'],
  Standard_OldMysuru: ['ಹೇಗಿದ್ದೀರಾ', 'ಎಲ್ಲಿಗೆ', 'ಹೋಗಬೇಕು', 'ನೋಡಬೇಕು', 'ತಿಂಡಿ', 'ಬೆಂಗಳೂರು', 'ಮೈಸೂರು'],
};

export class DialectAdapter {
  /**
   * Classifies input text into one of Karnataka's regional dialects.
   */
  public static classifyDialect(rawText: string): DialectClassification {
    const lower = rawText.toLowerCase().trim();
    let bestDialect: KannadaDialect = 'Standard_OldMysuru';
    let maxMatches = 0;
    const matchedFeatures: string[] = [];

    // Check code switching first if English characters predominate
    const hasEnglishWords = /[a-z]/i.test(rawText);
    const hasKannadaChars = /[\u0C80-\u0CFF]/.test(rawText);

    if (hasEnglishWords && hasKannadaChars) {
      bestDialect = 'CodeSwitched_Kanglish';
      matchedFeatures.push('Kannada-English code switching detected');
      maxMatches = 2;
    } else if (hasEnglishWords && !hasKannadaChars) {
      bestDialect = 'CodeSwitched_Kanglish';
      matchedFeatures.push('Transliterated Latin Kannada (Kanglish)');
      maxMatches = 1;
    }

    // Check regional markers
    for (const [dialect, markers] of Object.entries(DIALECT_MARKERS)) {
      let count = 0;
      markers.forEach((marker) => {
        if (lower.includes(marker.toLowerCase())) {
          count++;
          matchedFeatures.push(marker);
        }
      });
      if (count > maxMatches) {
        maxMatches = count;
        bestDialect = dialect as KannadaDialect;
      }
    }

    // Normalization
    let normalized = rawText
      .replace(/from bangalore|from bengaluru/gi, 'ಬೆಂಗಳೂರಿನಿಂದ')
      .replace(/to chikmagalur|to chikkamagaluru/gi, 'ಚಿಕ್ಕಮಗಳೂರಿಗೆ')
      .replace(/to hampi/gi, 'ಹಂಪಿಗೆ')
      .replace(/to mysore|to mysuru/gi, 'ಮೈಸೂರಿಗೆ');

    return {
      detectedDialect: bestDialect,
      confidence: maxMatches > 0 ? Math.min(0.96, 0.65 + maxMatches * 0.1) : 0.5,
      matchedFeatures,
      normalizedKannadaText: normalized,
    };
  }

  /**
   * Generates a culturally authentic greeting in the traveler's detected dialect.
   */
  public static getDialectGreeting(dialect: KannadaDialect): string {
    switch (dialect) {
      case 'Kundagannada_Coastal':
        return 'ನಮಸ್ಕಾರ ಮಾರ್ರೆ! ಕರಾವಳಿ ಪ್ರವಾಸಕ್ಕೆ ಎಲ್ಲಿಗ್ ಹೊರಟಿರಿ?';
      case 'Havyaka_Malnad':
        return 'ನಮಸ್ಕಾರ! ಮಲೆನಾಡಿನ ಚಂದದ ತಾಣಗಳಿಗೆ ಎಲ್ಲೆ ಹೊರೆಟ್ಟಿರಾ?';
      case 'Kalyana_NorthEast':
        return 'ಶರಣು ಶರಣಾರ್ಥಿ! ಕಲ್ಯಾಣ ಕರ್ನಾಟಕದ ಪ್ರವಾಸಕ್ಕೆ ಎತ್ತ ಹೋಂಟಿರಿ?';
      case 'Kittur_NorthWest':
        return 'ನಮಸ್ಕಾರ್ರೀ! ಕಿತ್ತೂರು ನಾಡಿನ ಪ್ರವಾಸಕ್ಕೆ ಹ್ಯಾಂಗೆ ಪ್ಲಾನ್ ಮಾಡೋಣ?';
      case 'CodeSwitched_Kanglish':
        return 'ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಕರ್ನಾಟಕ ಟ್ರಿಪ್ ಪ್ಲಾನ್ ಮಾಡಲು ನಾನು ಸಿದ್ಧ. Where would you like to travel?';
      case 'Standard_OldMysuru':
      default:
        return 'ನಮಸ್ಕಾರ! ಯಾತ್ರಿಕ AI ಗೆ ಸುಸ್ವಾಗತ. ನೀವು ಯಾವ ಸ್ಥಳಗಳಿಗೆ ಭೇಟಿ ನೀಡಲು ಇಷ್ಟಪಡುತ್ತೀರಿ?';
    }
  }
}
