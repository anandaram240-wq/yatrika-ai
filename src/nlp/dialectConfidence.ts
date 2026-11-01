/**
 * @file src/nlp/dialectConfidence.ts
 * @description Quantified dialect identification and confidence evaluator across 6 Karnataka macro-regions.
 * @theme Code. Create. Celebrate Kannada.
 */

export type KannadaDialect =
  | 'Kundagannada'
  | 'Arebhashe'
  | 'Kalyana'
  | 'Kittur'
  | 'Mysuru'
  | 'Bengaluru'
  | 'Havyaka'
  | 'Standard'
  | 'CodeSwitched';

export interface DialectClassificationResult {
  detectedDialect: KannadaDialect;
  confidence: number; // 0.0 to 1.0
  dialectMarkersFound: string[];
  secondaryDialectCandidate?: KannadaDialect;
}

export class DialectConfidenceEvaluator {
  private static readonly DIALECT_LEXICON: Record<KannadaDialect, string[]> = {
    Kundagannada: ['ಮಾರ್‍ರೆ', 'ಮಾರ್ರೆ', 'ಕಾಣಿ', 'ಏನ್ಲಾ', 'ಹೌದನ್ಲಾ', 'ಎಂಚ', 'ಬರ್‍ತಿರಾ', 'ಮಾರಾಯ್ರೆ'],
    Arebhashe: ['ಬಪ್ಪ', 'ಪೋಪ', 'ಎಲ್ಗೆ', 'ಹೊಳೆ', 'ಕುಡ್ಲ', 'ತಿಂಪ'],
    Kalyana: ['ಆಯಿತ್ರಿ', 'ಬರ್ತೇವ್ರಿ', 'ಹೌದ್ರಿ', 'ಜಲ್ದಿ', 'ಖರೇ', 'ಚಲೋ', 'ಖುಲ್ಲಾ', 'ಮಾಡ್ತೀರಿ'],
    Kittur: ['ಯಾಕ್ರಿ', 'ಏನ್ರಿಪಾ', 'ಹೋಗೂಣು', 'ಬರೂಣು', 'ದಂಡಿ', 'ಅಲ್ರೀ', 'ಚಲೋ ಐತಿ', 'ಹ್ಯಾಂಗ'],
    Mysuru: ['ಕಣ್ರೀ', 'ಮೇಷ್ಟ್ರೇ', 'ಹೋಗೋಣ', 'ಬಂದ್ವಿ', 'ಆಯ್ತು', 'ಅಲ್ವಾ', 'ಸ್ವಾಮಿ'],
    Bengaluru: ['ಗುರು', 'ಬಾ ಗುರು', 'ಮೆಟ್ರೋ', 'ಟ್ರಾಫಿಕ್', 'ಮಗಾ', 'ಬ್ರೋ', 'ಸೀನ್'],
    Havyaka: ['ಎಂತದು', 'ಕೂಳಿ', 'ಉಂಬೋಣ', 'ಹೊರೆಟ್ಟಿರಾ', 'ಹಾಂಗೆ', 'ಹಿಂಗೇ', 'ಎಲ್ಲೆ', 'ಅಪ್ಪಚ್ಚಿ'],
    Standard: ['ಹೇಗಿದ್ದೀರಾ', 'ನಮಸ್ಕಾರ', 'ಪ್ರವಾಸ', 'ಯೋಜನೆ', 'ದರ್ಶನ', 'ಮಾಹಿತಿ', 'ದಯವಿಟ್ಟು', 'ವೇಳಾಪಟ್ಟಿ'],
    CodeSwitched: ['plan', 'trip', 'weekend', 'budget', 'route', 'darshan', 'viewpoint', 'resort', 'hotel', 'drive'],
  };

  public static classifyDialect(utterance: string): DialectClassificationResult {
    const text = utterance.toLowerCase();
    const scores: Record<KannadaDialect, { count: number; markers: string[] }> = {
      Kundagannada: { count: 0, markers: [] },
      Arebhashe: { count: 0, markers: [] },
      Kalyana: { count: 0, markers: [] },
      Kittur: { count: 0, markers: [] },
      Mysuru: { count: 0, markers: [] },
      Bengaluru: { count: 0, markers: [] },
      Havyaka: { count: 0, markers: [] },
      Standard: { count: 0, markers: [] },
      CodeSwitched: { count: 0, markers: [] },
    };

    // Check code-switching regex
    const hasEnglishWords = /[a-z]/i.test(utterance);
    const hasKannadaChars = /[\u0C80-\u0CFF]/.test(utterance);
    if (hasEnglishWords && hasKannadaChars) {
      scores.CodeSwitched.count += 2;
      scores.CodeSwitched.markers.push('mixed_script_code_switch');
    }

    (Object.keys(this.DIALECT_LEXICON) as KannadaDialect[]).forEach((dialect) => {
      const markers = this.DIALECT_LEXICON[dialect];
      markers.forEach((marker) => {
        if (text.includes(marker.toLowerCase())) {
          scores[dialect].count += 1;
          scores[dialect].markers.push(marker);
        }
      });
    });

    const ranked = (Object.keys(scores) as KannadaDialect[])
      .map((d) => ({ dialect: d, count: scores[d].count, markers: scores[d].markers }))
      .sort((a, b) => b.count - a.count);

    const winner = ranked[0];
    if (winner.count === 0) {
      // Default to Standard baseline if no regional dialect particle found
      return {
        detectedDialect: 'Standard',
        confidence: 0.50,
        dialectMarkersFound: [],
      };
    }

    const totalMatches = ranked.reduce((sum, r) => sum + r.count, 0);
    const confidence = Math.min(0.98, Math.max(0.60, winner.count / totalMatches));

    return {
      detectedDialect: winner.dialect,
      confidence: Math.round(confidence * 100) / 100,
      dialectMarkersFound: winner.markers,
      secondaryDialectCandidate: ranked[1].count > 0 ? ranked[1].dialect : undefined,
    };
  }
}
