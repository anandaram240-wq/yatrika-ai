import { describe, expect, it } from 'vitest';
import { KannadaConversationEngine } from '../nlp/kannadaConversationEngine';
import { DialectAdapter, KannadaDialect } from '../nlp/dialectAdapter';
import { EntityResolver } from '../nlp/entityResolver';

describe('Phase 4: Advanced Kannada Conversational Intelligence & Benchmark Suite', () => {
  // 1. Regional Dialect Benchmark Dataset across 6 Regional Variants
  const REGIONAL_BENCHMARK_CORPUS: Array<{
    sentence: string;
    expectedDialect: KannadaDialect;
    expectedOriginOrDest?: string;
  }> = [
    {
      sentence: 'ನಮಸ್ಕಾರ ಮಾರ್ರೆ, ಕುಂದಾಪ್ರದಿಂದ ಉಡುಪಿಗೆ ಎಲ್ಲಿಗ್ ಹೊರಟಿರಿ?',
      expectedDialect: 'Kundagannada_Coastal',
      expectedOriginOrDest: 'ಉಡುಪಿ',
    },
    {
      sentence: 'ಸಿರ್ಸಿಯಿಂದ ಗೋಕರ್ಣಕ್ಕೆ ಎಲ್ಲೆ ಹೊರೆಟ್ಟಿರಾ? ಬನ್ನಿ ಕೂಳಿ ಉಂಬೋಣ',
      expectedDialect: 'Havyaka_Malnad',
      expectedOriginOrDest: 'ಗೋಕರ್ಣ',
    },
    {
      sentence: 'ಗುಲ್ಬರ್ಗದಿಂದ ಬೀದರ್‌ ಕೋಟೆಗೆ ಎತ್ತ ಹೋಂಟಿರಿ? ಚೊಲೋ ರೊಟ್ಟಿ ಖಾನಾವಳಿ ಅದಾವ',
      expectedDialect: 'Kalyana_NorthEast',
      expectedOriginOrDest: 'ಬೀದರ್',
    },
    {
      sentence: 'ಧಾರವಾಡದಿಂದ ಬಾದಾಮಿಗೆ ಹ್ಯಾಂಗಿದ್ದೀರಿ? ಹೊಂಟ್ರಿ',
      expectedDialect: 'Kittur_NorthWest',
      expectedOriginOrDest: 'ಬಾದಾಮಿ',
    },
    {
      sentence: 'Bangalore ninda Chikmagalur trip plan madi, resort bekku',
      expectedDialect: 'CodeSwitched_Kanglish',
      expectedOriginOrDest: 'Chikkamagaluru',
    },
    {
      sentence: 'ಬೆಂಗಳೂರಿನಿಂದ ಮೈಸೂರಿಗೆ ಹೋಗಬೇಕು, ಅರಮನೆ ನೋಡಬೇಕು',
      expectedDialect: 'Standard_OldMysuru',
      expectedOriginOrDest: 'ಮೈಸೂರು',
    },
  ];

  it('1. Benchmarks dialect classification across all regional macro-dialects', () => {
    let correctCount = 0;
    REGIONAL_BENCHMARK_CORPUS.forEach((sample) => {
      const result = DialectAdapter.classifyDialect(sample.sentence);
      if (result.detectedDialect === sample.expectedDialect) {
        correctCount++;
      }
    });

    const accuracy = correctCount / REGIONAL_BENCHMARK_CORPUS.length;
    expect(accuracy).toBeGreaterThanOrEqual(0.83); // At least 5/6 (>= 83%) measured benchmark accuracy
  });

  it('2. Resolves bilingual place entities in Kannada and Latin transliterations', () => {
    const r1 = EntityResolver.resolvePlace('ಚಿಕ್ಕಮಗಳೂರು');
    expect(r1).toBeDefined();
    expect(r1?.nameEnglish).toContain('Chikkamagaluru');

    const r2 = EntityResolver.resolvePlace('Hampi');
    expect(r2).toBeDefined();
    expect(r2?.nameKannada).toContain('ಹಂಪಿ');

    const r3 = EntityResolver.resolvePlace('Mullayanagiri');
    expect(r3).toBeDefined();
    expect(r3?.district).toBe('Chikkamagaluru');
  });

  it('3. Multi-turn dialogue maintains trip context across successive utterances', () => {
    const engine = new KannadaConversationEngine();

    // Turn 1: User says origin and destination
    const resp1 = engine.processUserMessage('ಬೆಂಗಳೂರಿನಿಂದ ಹಂಪಿಗೆ ಹೋಗಬೇಕು');
    expect(resp1.updatedContext.origin?.nameKannada).toBe('ಬೆಂಗಳೂರು');
    expect(resp1.updatedContext.destinations.length).toBe(1);
    expect(resp1.replyTextKannada).toContain('ಹಂಪಿ');

    // Turn 2: User requests intermediate waypoints on the way
    const resp2 = engine.processUserMessage('ಹೌದು, ದಾರಿಯಲ್ಲಿ ಬರುವ ಸ್ಥಳಗಳನ್ನೂ ಸೇರಿಸು');
    // Context must NOT reset! It must maintain Hampi and add via stops
    expect(resp2.updatedContext.origin?.nameKannada).toBe('ಬೆಂಗಳೂರು');
    expect(resp2.updatedContext.destinations.length).toBe(1);
    expect(resp2.updatedContext.viaStops.length).toBeGreaterThanOrEqual(1);
    expect(resp2.replyTextKannada).toContain('ಮಾರ್ಗದಲ್ಲಿರುವ');

    // Verify dialog history has recorded both turns
    expect(resp2.updatedContext.turns.length).toBe(4); // 2 user + 2 assistant
  });

  it('4. Handles user corrections cleanly without restarting trip planning', () => {
    const engine = new KannadaConversationEngine();
    engine.processUserMessage('ಬೆಂಗಳೂರಿನಿಂದ ಹಂಪಿಗೆ ಹೋಗಬೇಕು');

    // User corrects destination: "ಹಂಪಿ ಅಲ್ಲ, ಬಾದಾಮಿ"
    const correctionResp = engine.processUserMessage('ಹಂಪಿ ಅಲ್ಲ, ಬಾದಾಮಿ');
    expect(correctionResp.replyTextKannada).toContain('ಬಾದಾಮಿ');

    const ctx = engine.getContext();
    expect(ctx.destinations.some((d) => d.nameKannada.includes('ಬಾದಾಮಿ'))).toBe(true);
    expect(ctx.destinations.some((d) => d.nameKannada.includes('ಹಂಪಿ'))).toBe(false);
  });
});
