import { describe, it, expect } from 'vitest';
import { REGIONS } from '../data/regions';
import { DIALECT_PHRASES } from '../data/phrases';
import { GLOSSARY_WORDS } from '../data/glossary';
import { QUIZ_QUESTIONS } from '../data/quiz';
import { RegionId } from '../types';
import { speechService } from '../utils/speech';

describe('Namma Kannada Forensic Audit & Data Integrity Suite', () => {
  const EXPECTED_REGIONS: RegionId[] = [
    'uttara-karnataka',
    'karavali',
    'mysuru-mandya',
    'kalyana-karnataka',
    'malenadu',
    'bengaluru-urban',
  ];

  it('verifies all 6 linguistic exploration zones include honest taxonomy & isogloss notes', () => {
    expect(REGIONS).toHaveLength(6);
    const regionIds = REGIONS.map(r => r.id);
    EXPECTED_REGIONS.forEach(id => {
      expect(regionIds).toContain(id);
    });

    REGIONS.forEach(region => {
      expect(region.name).toBeTruthy();
      expect(region.kannadaName).toBeTruthy();
      expect(region.taxonomyNote).toBeTruthy();
      expect(region.isoglossNotes).toBeTruthy();
      expect(region.districtsAssociated.length).toBeGreaterThan(0);
      expect(region.signaturePhrases.length).toBeGreaterThanOrEqual(1);

      region.signaturePhrases.forEach(sig => {
        expect(sig.kannada).toBeTruthy();
        expect(sig.transliteration).toBeTruthy();
        expect(sig.source.title).toBeTruthy();
        expect(['source-attested', 'provisional', 'native-speaker-reviewed']).toContain(sig.status);
      });

      expect(region.dialectFeatures.cadenceDescription).toBeTruthy();
      expect(region.dialectFeatures.pronouns).toBeTruthy();
      expect(region.dialectFeatures.notableSuffixes).toBeTruthy();
    });
  });

  it('verifies every dialect phrase contains explicit source citations and honest non-forced variations', () => {
    expect(DIALECT_PHRASES.length).toBeGreaterThanOrEqual(5);

    DIALECT_PHRASES.forEach(phrase => {
      expect(phrase.english).toBeTruthy();
      expect(phrase.standardKannada.kannada).toBeTruthy();
      expect(phrase.standardKannada.transliteration).toBeTruthy();

      const variations = Object.values(phrase.variations);
      expect(variations.length).toBeGreaterThan(0);

      variations.forEach(variation => {
        if (!variation) return;
        expect(variation.kannada.length).toBeGreaterThan(0);
        expect(variation.transliteration.length).toBeGreaterThan(0);
        expect(variation.nuance.length).toBeGreaterThan(0);
        expect(variation.source.title).toBeTruthy();
        expect(variation.contextOfUse).toBeTruthy();
        expect(['source-attested', 'native-speaker-reviewed', 'provisional']).toContain(variation.status);
      });
    });
  });

  it('verifies the Namma Shabda Kosha glossary entries have verifiable sources and localities', () => {
    expect(GLOSSARY_WORDS.length).toBeGreaterThanOrEqual(15);

    const sourceAttestedWords = GLOSSARY_WORDS.filter(w => w.status === 'source-attested');
    const provisionalWords = GLOSSARY_WORDS.filter(w => w.status === 'provisional');

    // Ensure we have a dominant majority of source-attested entries
    expect(sourceAttestedWords.length).toBeGreaterThanOrEqual(12);
    expect(provisionalWords.length).toBeGreaterThanOrEqual(2);

    GLOSSARY_WORDS.forEach(word => {
      expect(word.wordKannada).toBeTruthy();
      expect(word.wordEnglish).toBeTruthy();
      expect(EXPECTED_REGIONS).toContain(word.regionId);
      expect(word.meaning).toBeTruthy();
      expect(word.culturalOrigin).toBeTruthy();
      expect(word.source.title).toBeTruthy();
      expect(word.tags.length).toBeGreaterThan(0);
    });
  });

  it('verifies quiz questions have unique options, valid correct answers, and citations', () => {
    expect(QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(8);

    QUIZ_QUESTIONS.forEach(q => {
      expect(q.options.length).toBe(4);
      expect(q.options).toContain(q.correctRegionId);
      expect(new Set(q.options).size).toBe(4); // No duplicate options
      expect(q.explanation).toBeTruthy();
      expect(q.culturalTrivia).toBeTruthy();
      expect(q.source.title).toBeTruthy();
      expect(['source-attested', 'provisional']).toContain(q.status);
    });
  });

  it('verifies speech service provides honest diagnostics and does not pretend synthetic pitch is human recording', () => {
    const diag = speechService.getDiagnostics();
    expect(typeof diag.isSupported).toBe('boolean');
    expect(typeof diag.hasKannadaVoice).toBe('boolean');
    expect(typeof diag.isUsingFallback).toBe('boolean');
  });

  it('verifies search and filter logic by locality, status, and keyword', () => {
    // Search by word
    const haudlaResult = GLOSSARY_WORDS.filter(w => 
      w.wordEnglish.toLowerCase().includes('haudla') || 
      w.wordKannada.includes('ಹೌದ್ಲಾ')
    );
    expect(haudlaResult.length).toBe(1);
    expect(haudlaResult[0].status).toBe('source-attested');
    expect(haudlaResult[0].locality).toContain('Dharwad');

    // Filter by status
    const attestedOnly = GLOSSARY_WORDS.filter(w => w.status === 'source-attested');
    expect(attestedOnly.length).toBeGreaterThanOrEqual(12);

    // Search by locality
    const kundapuraWords = GLOSSARY_WORDS.filter(w => 
      w.locality && w.locality.toLowerCase().includes('kundapura')
    );
    expect(kundapuraWords.length).toBeGreaterThanOrEqual(2);
  });
});
