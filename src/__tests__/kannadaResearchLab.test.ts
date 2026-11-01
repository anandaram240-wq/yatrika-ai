/**
 * @file src/__tests__/kannadaResearchLab.test.ts
 * @description Unit tests for Kannada Language Research Lab V2 & NammaVani Linguistic Benchmark.
 */

import { describe, it, expect } from 'vitest';
import { KannadaBenchmarkRunner } from '../research/kannadaBenchmark';
import { DialectConfidenceEvaluator } from '../nlp/dialectConfidence';
import { PhoneticEntityRanking } from '../nlp/phoneticEntityRanking';
import { ConversationEvaluationEngine } from '../nlp/conversationEvaluation';

describe('Kannada Language Research Lab V2 (Phase 6)', () => {
  it('runs the structured linguistic benchmark and achieves >= 80% accuracy across metrics', () => {
    const metrics = KannadaBenchmarkRunner.runEvaluation();

    expect(metrics.totalSentences).toBe(8);
    expect(metrics.dialectAccuracyPercent).toBeGreaterThanOrEqual(80.0);
    expect(metrics.originAccuracyPercent).toBeGreaterThanOrEqual(80.0);
    expect(metrics.destinationAccuracyPercent).toBeGreaterThanOrEqual(80.0);
    expect(metrics.intentAccuracyPercent).toBeGreaterThanOrEqual(85.0);
    expect(metrics.overallPrecision).toBeGreaterThanOrEqual(0.85);
  });

  it('correctly classifies distinctive regional dialects using authentic syntactic particles', () => {
    // Kundagannada marker: 'ಮಾರ್ರೆ', 'ಕಾಣಿ'
    const kunda = DialectConfidenceEvaluator.classifyDialect('ಮಾರ್ರೆ, ಕುಂದಾಪುರದಿಂದ ಶೃಂಗೇರಿ ಬಸ್ ಯಾವಾಗ ಕಾಣಿ?');
    expect(kunda.detectedDialect).toBe('Kundagannada');
    expect(kunda.confidence).toBeGreaterThan(0.70);

    // Kalyana Karnataka marker: 'ಆಯಿತ್ರಿ', 'ಜಲ್ದಿ'
    const kalyana = DialectConfidenceEvaluator.classifyDialect('ಕಲ್ಬುರ್ಗಿಯಿಂದ ಜಲ್ದಿ ಹೊರಡಬೇಕ್ರಿ, ಆಯಿತ್ರಿ.');
    expect(kalyana.detectedDialect).toBe('Kalyana');

    // Kittur Karnataka marker: 'ಯಾಕ್ರಿ', 'ಚಲೋ ಐತಿ'
    const kittur = DialectConfidenceEvaluator.classifyDialect('ಯಾಕ್ರಿ, ಹುಬ್ಬಳ್ಳಿಯಿಂದ ರಸ್ತೆ ಚಲೋ ಐತಿ?');
    expect(kittur.detectedDialect).toBe('Kittur');

    // Bengaluru Urban marker: 'ಗುರು', 'ಮೆಟ್ರೋ'
    const blr = DialectConfidenceEvaluator.classifyDialect('ಗುರು, ಮೆಟ್ರೋ ಸ್ಟೇಷನ್ ಹತ್ತಿರ ಇದೆಯಾ?');
    expect(blr.detectedDialect).toBe('Bengaluru');
  });

  it('ranks phonetic place names with Dravidian transliteration tolerance', () => {
    const candidates = [
      { name: 'Chennakeshava Temple Belur', nameKannada: 'ಚನ್ನಕೇಶವ ದೇವಾಲಯ ಬೇಲೂರು' },
      { name: 'Hoysaleswara Temple Halebidu', nameKannada: 'ಹೊಯ್ಸಳೇಶ್ವರ ದೇವಾಲಯ ಹಳೇಬೀಡು' },
      { name: 'Mullayanagiri Peak', nameKannada: 'ಮುಳ್ಳಯ್ಯನಗಿರಿ ಶಿಖರ' },
    ];

    // Historical Velapura / Beluru search
    const results = PhoneticEntityRanking.rankCandidates('Velapura Beluru', candidates);
    expect(results[0].item.name).toBe('Chennakeshava Temple Belur');
    expect(results[0].score).toBeGreaterThan(0.7);

    // Kannada script fuzzy match
    const knResults = PhoneticEntityRanking.rankCandidates('ಬೇಲೂರು', candidates);
    expect(knResults[0].item.name).toBe('Chennakeshava Temple Belur');
  });

  it('handles user corrections in multi-turn conversation and updates intent while retaining context', () => {
    const isCorr = ConversationEvaluationEngine.isUserCorrection('ಅಲ್ಲ ಗುರು, ಮೈಸೂರು ಅಲ್ಲ, ಹಾಸನದಿಂದ ಪ್ಲಾನ್ ಮಾಡು');
    expect(isCorr).toBe(true);

    const prev = { origin: 'Mysuru', destination: 'Belur', stops: [] };
    const updated = ConversationEvaluationEngine.applyCorrection(prev, 'ಅಲ್ಲ ಗುರು, ಹಾಸನದಿಂದ ಹೊರಡೋದು');

    expect(updated.correctionApplied).toBe(true);
    expect(updated.fieldCorrected).toBe('origin');
    expect(updated.updatedOrigin).toBe('Hassan');
    expect(updated.updatedDestination).toBe('Belur'); // Preserved destination!
  });
});
