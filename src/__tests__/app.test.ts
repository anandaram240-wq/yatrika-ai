import { describe, it, expect } from 'vitest';
import { REGIONS } from '../data/regions';
import { DIALECT_PHRASES } from '../data/phrases';
import { GLOSSARY_WORDS } from '../data/glossary';
import { QUIZ_QUESTIONS } from '../data/quiz';
import { RegionId } from '../types';

describe('Namma Kannada Data & Linguistic Integrity Suite', () => {
  const EXPECTED_REGIONS: RegionId[] = [
    'uttara-karnataka',
    'karavali',
    'mysuru-mandya',
    'kalyana-karnataka',
    'malenadu',
    'bengaluru-urban',
  ];

  it('verifies all 6 linguistic regions are defined with complete metadata', () => {
    expect(REGIONS).toHaveLength(6);
    const regionIds = REGIONS.map(r => r.id);
    EXPECTED_REGIONS.forEach(id => {
      expect(regionIds).toContain(id);
    });

    REGIONS.forEach(region => {
      expect(region.name).toBeTruthy();
      expect(region.kannadaName).toBeTruthy();
      expect(region.districts.length).toBeGreaterThan(0);
      expect(region.signaturePhrases.length).toBeGreaterThanOrEqual(2);
      expect(region.dialectFeatures.cadence).toBeTruthy();
      expect(region.dialectFeatures.pronouns).toBeTruthy();
      expect(region.dialectFeatures.notableSuffixes).toBeTruthy();
    });
  });

  it('verifies every dialect phrase provides authentic translations for all 6 regions', () => {
    expect(DIALECT_PHRASES.length).toBeGreaterThanOrEqual(7);

    DIALECT_PHRASES.forEach(phrase => {
      expect(phrase.english).toBeTruthy();
      expect(phrase.standardKannada.kannada).toBeTruthy();
      expect(phrase.standardKannada.transliteration).toBeTruthy();

      EXPECTED_REGIONS.forEach(regId => {
        const variation = phrase.variations[regId];
        expect(variation, `Missing variation for region ${regId} in phrase "${phrase.id}"`).toBeDefined();
        expect(variation.kannada.length).toBeGreaterThan(0);
        expect(variation.transliteration.length).toBeGreaterThan(0);
        expect(variation.nuance.length).toBeGreaterThan(0);
      });
    });
  });

  it('verifies the Namma Shabda Kosha glossary contains authentic entries and cultural origins', () => {
    expect(GLOSSARY_WORDS.length).toBeGreaterThanOrEqual(15);

    GLOSSARY_WORDS.forEach(word => {
      expect(word.wordKannada).toBeTruthy();
      expect(word.wordEnglish).toBeTruthy();
      expect(EXPECTED_REGIONS).toContain(word.regionId);
      expect(word.meaning).toBeTruthy();
      expect(word.culturalOrigin).toBeTruthy();
      expect(word.tags.length).toBeGreaterThan(0);
    });
  });

  it('verifies quiz questions have unique options and valid correct answers', () => {
    expect(QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(8);

    QUIZ_QUESTIONS.forEach(q => {
      expect(q.options.length).toBe(4);
      expect(q.options).toContain(q.correctRegionId);
      expect(new Set(q.options).size).toBe(4); // No duplicate options
      expect(q.explanation).toBeTruthy();
      expect(q.culturalTrivia).toBeTruthy();
    });
  });

  it('verifies search and filter logic across phrases and glossary', () => {
    const searchResult = GLOSSARY_WORDS.filter(w => 
      w.wordEnglish.toLowerCase().includes('haudla') || 
      w.wordKannada.includes('ಹೌದ್ಲಾ')
    );
    expect(searchResult.length).toBeGreaterThanOrEqual(1);
    expect(searchResult[0].regionId).toBe('uttara-karnataka');
  });
});
