/**
 * src/features/voice-agent/__tests__/voiceAgent.test.ts
 * Vitest Unit Tests for Kannada Multimodal Agent
 */

import { describe, it, expect } from 'vitest';
import { normalizeKannadaVoiceText } from '../services/kannadaTextNormalizer';
import { classifyKannadaIntent } from '../services/kannadaIntentClassifier';

describe('System A: Kannada Text & Dialect Normalizer', () => {
  it('cleans Unicode zero-width characters and whitespace correctly', () => {
    const raw = '  \u200Bಚಿಕ್ಕಮಗಳೂರು  \uFEFF  ಪ್ರವಾಸ   ';
    const result = normalizeKannadaVoiceText(raw);
    expect(result.normalizedText).toBe('ಚಿಕ್ಕಮಗಳೂರು ಪ್ರವಾಸ');
    expect(result.detectedLanguage).toBe('kn');
  });

  it('detects Karavali / Coastal dialect markers', () => {
    const raw = 'ನಾಳೆ ಉಡುಪಿ ಕಡಲತೀರಕ್ಕೆ ಹೋಪುದು ಎಂತಾ ಮಾರೆ';
    const result = normalizeKannadaVoiceText(raw);
    expect(result.detectedDialect).toBe('karavali_coastal');
    expect(result.detectedLanguage).toBe('kn');
  });

  it('detects Kalyana Karnataka / North Karnataka dialect markers', () => {
    const raw = 'ಹಂಪಿಗೆ ಯಾವಾಗ ಹೋಗತೀರಿ ಖರೇ ಹೇಳ್ರಿ ಮಂದಿ';
    const result = normalizeKannadaVoiceText(raw);
    expect(result.detectedDialect).toBe('kalyana_karnataka');
  });

  it('resolves English transliterated names to canonical Kannada entities', () => {
    const raw = 'I want to travel from Mysore to Chikmagalur and visit Mullayanagiri';
    const result = normalizeKannadaVoiceText(raw);
    expect(result.detectedLanguage).toBe('en');
    expect(result.canonicalEntities).toContain('ಮೈಸೂರು');
    expect(result.canonicalEntities).toContain('ಚಿಕ್ಕಮಗಳೂರು');
    expect(result.canonicalEntities).toContain('ಮುಳ್ಳಯ್ಯನಗಿರಿ');
  });
});

describe('System A: Kannada Intent & Entity Classifier', () => {
  it('extracts budget, days, origin, destination and maps to circuit-chikkamagaluru', () => {
    const input = 'ಮೈಸೂರಿನಿಂದ ಚಿಕ್ಕಮಗಳೂರಿಗೆ 3 ದಿನ 5000 ಬಜೆಟ್‌ನಲ್ಲಿ ಪ್ಲಾನ್ ಕೊಡಿ';
    const result = classifyKannadaIntent(input);

    expect(result.intent).toBe('route_search');
    expect(result.targetCircuitId).toBe('circuit-chikkamagaluru');
    expect(result.entities.origin).toBe('ಮೈಸೂರು');
    expect(result.entities.destination).toBe('ಚಿಕ್ಕಮಗಳೂರು');
    expect(result.entities.durationDays).toBe(3);
    expect(result.entities.budgetInr).toBe(5000);
    expect(result.confidence).toBeGreaterThan(0.9);
  });

  it('correctly detects Shakti scheme female zero-fare eligibility', () => {
    const input = 'ಶಕ್ತಿ ಯೋಜನೆಯಡಿ ಮಹಿಳೆಯರಿಗೆ ಕೆಎಸ್ಆರ್ಟಿಸಿ ಬಸ್ ಉಚಿತವಿದೆಯೇ?';
    const result = classifyKannadaIntent(input);

    expect(result.entities.isFemalePassenger).toBe(true);
  });

  it('classifies weather and rain condition queries', () => {
    const input = 'ಮುಳ್ಳಯ್ಯನಗಿರಿ ಬೆಟ್ಟದ ಮೇಲೆ ಮಳೆ ಮತ್ತು ಹವಾಮಾನ ಹೇಗಿದೆ?';
    const result = classifyKannadaIntent(input);

    expect(result.intent).toBe('weather_season_query');
    expect(result.confidence).toBeGreaterThan(0.85);
  });

  it('classifies local food and khanavali queries', () => {
    const input = 'ಧಾರವಾಡ ಪೇಡ ಮತ್ತು ಉತ್ತರ ಕರ್ನಾಟಕ ರೊಟ್ಟಿ ಊಟ ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ?';
    const result = classifyKannadaIntent(input);

    expect(result.intent).toBe('food_khanavali_query');
  });

  it('classifies emergency 112 / 108 queries with high priority', () => {
    const input = 'ಅಪಘಾತವಾಗಿದೆ ತುರ್ತು ಆಸ್ಪತ್ರೆ ಮತ್ತು 112 ಪೊಲೀಸ್ ಹೆಲ್ಪ್‌ಲೈನ್ ಬೇಕು';
    const result = classifyKannadaIntent(input);

    expect(result.intent).toBe('emergency_query');
    expect(result.confidence).toBeGreaterThanOrEqual(0.95);
  });

  it('gracefully handles empty or gibberish input', () => {
    const result = classifyKannadaIntent('..');
    expect(result.intent).toBe('unknown');
    expect(result.requiresClarification).toBe(true);
    expect(result.clarificationPromptKannada).toBeDefined();
  });
});
