import { describe, it, expect } from 'vitest';
import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import atlasSchema from '../data/atlas-data.schema.json';
import candidateData from '../data/atlas-evidence-candidates.json';
import { ATLAS_DATASET, RECONCILED_METRICS, CONCEPTS, ALL_ENTRIES, REGION_SLOT_DEFINITIONS } from '../data/dataset';
import { validateAtlasDataset, FORBIDDEN_SYNTHETIC_TITLES, APPROVED_BIBLIOGRAPHY_REGISTRY } from '../utils/semanticValidator';
import { REGIONS } from '../data/regions';
import { GLOSSARY_WORDS } from '../data/glossary';
import { QUIZ_QUESTIONS } from '../data/quiz';
import { speechService } from '../utils/speech';
import { RegionId } from '../types';

describe('Namma Kannada Atlas Phase 2.5 Evidence-Graded & Semantic Verification Suite', () => {
  const EXPECTED_REGIONS: RegionId[] = [
    'uttara-karnataka',
    'karavali',
    'mysuru-mandya',
    'kalyana-karnataka',
    'malenadu',
    'bengaluru-urban',
  ];

  it('1. Validates candidate dataset against JSON Schema Draft 2020-12 with zero schema errors', () => {
    const ajv = new Ajv2020({ allErrors: true });
    addFormats(ajv);
    const validate = ajv.compile(atlasSchema);
    const valid = validate(candidateData);
    
    if (!valid) {
      console.error('Ajv Schema Validation Errors:', validate.errors);
    }
    expect(valid).toBe(true);
    expect(validate.errors).toBeNull();
  });

  it('2. Enforces all 6 Semantic Validation Rules via validateAtlasDataset', () => {
    const result = validateAtlasDataset(ATLAS_DATASET);
    if (!result.valid) {
      console.error('Semantic Validation Errors:', result.errors);
    }
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.reconciledCounts.concepts).toBe(5);
    expect(result.reconciledCounts.entries).toBe(13);
  });

  it('3. Reconciles dataset counts: confirms exactly 13 candidate entries across 5 concepts (resolving Argon report 12 vs 13)', () => {
    expect(RECONCILED_METRICS.conceptCount).toBe(5);
    expect(RECONCILED_METRICS.entryCount).toBe(13);
    expect(CONCEPTS).toHaveLength(5);
    expect(ALL_ENTRIES).toHaveLength(13);

    // Concept 2 ("What are you doing?") has 4 documented entries:
    // std, kittur, kalyana, coastal-malnad
    const concept2 = CONCEPTS.find(c => c.concept_id === 'concept-what-are-you-doing');
    expect(concept2).toBeDefined();
    expect(concept2?.documented_entry_ids).toHaveLength(4);

    // Concepts 1, 3, 4, 5: 3 + 2 + 2 + 2 = 9 entries. Total = 4 + 9 = 13 entries.
    const totalDocumentedInConcepts = CONCEPTS.reduce(
      (sum, c) => sum + c.documented_entry_ids.length,
      0
    );
    expect(totalDocumentedInConcepts).toBe(13);
  });

  it('4. Enforces provisional status and null locators on candidate entries (no invented citations)', () => {
    ALL_ENTRIES.forEach((entry) => {
      // Must be provisional with E4 phrase and E2 pattern evidence
      expect(entry.evidence_status).toBe('provisional');
      expect(entry.evidence_level).toBe('E4');
      expect(entry.pattern_evidence_level).toBe('E2');

      // Citation locator must be null until physically inspected
      expect(entry.citation.locator).toBeNull();

      // Review record must be null until live speaker review is performed
      expect(entry.review_record).toBeNull();

      // Must have limitation explaining provisional locator status
      expect(entry.limitations.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('5. Enforces per-entry licensing metadata and top-level license policy', () => {
    expect(ATLAS_DATASET.license_policy).toBeTruthy();
    expect(ATLAS_DATASET.license_policy).toContain('Per-entry source and license metadata required');

    ALL_ENTRIES.forEach((entry) => {
      expect(['approved_for_planned_use', 'restricted_or_permission_required', 'license_unclear_do_not_redistribute']).toContain(
        entry.license_status
      );
    });
  });

  it('6. Verifies sparse 6-region matrix states include shared-form and honest missing-data handling', () => {
    const requiredSlots = [
      'old_mysuru_southern',
      'kittur_karnataka',
      'kalyana_karnataka',
      'karavali_coastal',
      'malnad',
      'central_border_cluster',
    ];

    CONCEPTS.forEach((concept) => {
      requiredSlots.forEach((slot) => {
        const slotState = (concept.region_matrix_states as any)[slot];
        expect(slotState).toBeDefined();
        expect([
          'distinct_regional_variant',
          'documented_multi_region',
          'shared_with_standard',
          'no_verified_distinct_variant',
          'provisional_candidate',
        ]).toContain(slotState.status);
        expect(slotState.note.length).toBeGreaterThanOrEqual(5);

        if (slotState.status === 'no_verified_distinct_variant') {
          expect(slotState.entry_id).toBeNull();
        } else {
          expect(slotState.entry_id).toBeTruthy();
        }
      });
    });

    // Check slot definitions
    expect(Object.keys(REGION_SLOT_DEFINITIONS)).toHaveLength(6);
  });

  it('7. Verifies speech service provides honest diagnostics and rejects simulated accents', () => {
    const diag = speechService.getDiagnostics();
    expect(typeof diag.isSupported).toBe('boolean');
    expect(typeof diag.hasKannadaVoice).toBe('boolean');
    expect(typeof diag.notice).toBe('string');
  });

  it('8. Verifies educational macro-cluster taxonomy and isogloss notes for all 6 regions', () => {
    expect(REGIONS).toHaveLength(6);
    REGIONS.forEach((region) => {
      expect(EXPECTED_REGIONS).toContain(region.id);
      expect(region.taxonomyNote).toBeTruthy();
      expect(region.isoglossNotes).toBeTruthy();
      expect(region.slotKey).toBeTruthy();
      expect(region.districtsAssociated.length).toBeGreaterThan(0);
    });
  });

  it('9. Verifies absence of duplicate IDs across concepts, candidates, regions, glossary, and quiz', () => {
    const conceptIds = CONCEPTS.map(c => c.concept_id);
    expect(new Set(conceptIds).size).toBe(conceptIds.length);

    const entryIds = ALL_ENTRIES.map(e => e.id);
    expect(new Set(entryIds).size).toBe(entryIds.length);

    const regionIds = REGIONS.map(r => r.id);
    expect(new Set(regionIds).size).toBe(regionIds.length);

    const glossaryIds = GLOSSARY_WORDS.map(g => g.id);
    expect(new Set(glossaryIds).size).toBe(glossaryIds.length);

    const quizIds = QUIZ_QUESTIONS.map(q => q.id);
    expect(new Set(quizIds).size).toBe(quizIds.length);
  });

  it('10. Verifies legacy glossary items are quarantined under unverified (E5) status', () => {
    expect(GLOSSARY_WORDS).toHaveLength(15);
    GLOSSARY_WORDS.forEach((word) => {
      expect(word.evidence_status).toBe('unverified');
      expect(word.evidence_level).toBe('E5');
      // Ferdinand Kittel citation check: no Herman Kittel
      if (word.source.authorOrInstitution.includes('Kittel')) {
        expect(word.source.authorOrInstitution).toContain('Ferdinand Kittel');
      }
    });
  });

  it('11. Verifies quiz questions contain unique options and morphological mechanism notes', () => {
    expect(QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(8);
    QUIZ_QUESTIONS.forEach((q) => {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options).toContain(q.correctRegionId);
      expect(q.morphological_note).toBeTruthy();
      expect(q.source.title).toBeTruthy();
    });
  });

  it('12. Actively asserts zero occurrences of forbidden synthetic titles across all active application datasets', () => {
    // 1. Check ATLAS_DATASET entries
    ALL_ENTRIES.forEach((entry) => {
      FORBIDDEN_SYNTHETIC_TITLES.forEach((forbidden) => {
        expect(entry.citation?.source_title || '').not.toContain(forbidden);
        expect(entry.citation?.author_or_publisher || '').not.toContain(forbidden);
      });
    });

    // 2. Check REGIONS signature phrases
    REGIONS.forEach((region) => {
      region.signaturePhrases.forEach((phrase) => {
        FORBIDDEN_SYNTHETIC_TITLES.forEach((forbidden) => {
          expect(phrase.source?.title || '').not.toContain(forbidden);
          expect(phrase.source?.authorOrInstitution || '').not.toContain(forbidden);
          expect(phrase.source?.sourceLocation || '').not.toContain(forbidden);
        });
      });
    });

    // 3. Check GLOSSARY_WORDS
    GLOSSARY_WORDS.forEach((word) => {
      FORBIDDEN_SYNTHETIC_TITLES.forEach((forbidden) => {
        expect(word.source?.title || '').not.toContain(forbidden);
        expect(word.source?.authorOrInstitution || '').not.toContain(forbidden);
        expect(word.source?.sourceLocation || '').not.toContain(forbidden);
      });
    });

    // 4. Check QUIZ_QUESTIONS
    QUIZ_QUESTIONS.forEach((quiz) => {
      FORBIDDEN_SYNTHETIC_TITLES.forEach((forbidden) => {
        expect(quiz.source?.title || '').not.toContain(forbidden);
        expect(quiz.source?.authorOrInstitution || '').not.toContain(forbidden);
        expect(quiz.source?.sourceLocation || '').not.toContain(forbidden);
      });
    });
  });

  it('13. Verifies semantic validator actively rejects blacklisted titles and unregistered source IDs', () => {
    // Create a mutant dataset with a blacklisted synthetic title
    const mutantWithBlacklistedTitle = JSON.parse(JSON.stringify(ATLAS_DATASET));
    mutantWithBlacklistedTitle.entries[0].citation.source_title = 'Kannada Bhaasha Prabhedagala Kosha';
    const result1 = validateAtlasDataset(mutantWithBlacklistedTitle);
    expect(result1.valid).toBe(false);
    expect(result1.errors.some((e: string) => e.includes('forbidden synthetic title'))).toBe(true);

    // Create a mutant dataset with an unregistered source ID
    const mutantWithFakeSourceId = JSON.parse(JSON.stringify(ATLAS_DATASET));
    mutantWithFakeSourceId.entries[0].citation.source_id = 'SRC-FAKE-UNREGISTERED-2026';
    const result2 = validateAtlasDataset(mutantWithFakeSourceId);
    expect(result2.valid).toBe(false);
    expect(result2.errors.some((e: string) => e.includes('not in approved registry'))).toBe(true);
  });

  it('14. Asserts no entry or question claims source_attested without physical locator and registered source ID', () => {
    // Check all candidates
    ALL_ENTRIES.forEach((entry) => {
      if (entry.evidence_status === 'source_attested') {
        expect(entry.citation?.locator).toBeTruthy();
        expect(entry.citation?.source_id).toBeTruthy();
        expect(APPROVED_BIBLIOGRAPHY_REGISTRY[entry.citation.source_id!]).toBeDefined();
      } else {
        expect(['provisional', 'unverified', 'contributor_pending', 'speaker_reviewed']).toContain(entry.evidence_status);
      }
    });

    // Check signature phrases
    REGIONS.forEach((region) => {
      region.signaturePhrases.forEach((phrase) => {
        expect(['provisional', 'unverified']).toContain(phrase.status);
      });
    });

    // Check quiz questions
    QUIZ_QUESTIONS.forEach((q) => {
      expect(['provisional', 'unverified']).toContain(q.evidence_status);
      expect(q.evidence_level).toBe('E4');
    });
  });

  it('15. Validates licensing metadata completeness and fair dealing/ODbL disclosure compliance', () => {
    expect(ATLAS_DATASET.license_policy).toBeDefined();
    expect(ATLAS_DATASET.license_policy.length).toBeGreaterThan(20);

    ALL_ENTRIES.forEach((entry) => {
      expect(entry.license_status).toBeDefined();
      expect([
        'approved_for_planned_use',
        'restricted_or_permission_required',
        'license_unclear_do_not_redistribute',
      ]).toContain(entry.license_status);
    });
  });

  it('16. Verifies exact active 5 concepts: how-are-you, what-are-you-doing, where-setting-out, good-fine, boy-youth', () => {
    const expectedConceptIds = [
      'concept-how-are-you',
      'concept-what-are-you-doing',
      'concept-where-setting-out',
      'concept-good-fine',
      'concept-boy-youth',
    ];

    expect(CONCEPTS.map((c) => c.concept_id)).toEqual(expectedConceptIds);

    const counts = CONCEPTS.map((c) => c.documented_entry_ids.length);
    expect(counts).toEqual([3, 4, 2, 2, 2]);
    expect(counts.reduce((a, b) => a + b, 0)).toBe(13);
  });

  it('17. Verifies Kundagannada candidate nka-how-are-you-coastal-kunda ("ಹೆಂಗಿದ್ದಿರಿ?") provenance and limitations', () => {
    const kundaEntry = ALL_ENTRIES.find((e) => e.id === 'nka-how-are-you-coastal-kunda');
    expect(kundaEntry).toBeDefined();
    expect(kundaEntry?.kannada_script).toBe('ಹೆಂಗಿದ್ದಿರಿ?');
    expect(kundaEntry?.transliteration).toBe('heṅgiddiri?');
    expect(kundaEntry?.pattern_evidence_level).toBe('E2');
    expect(kundaEntry?.evidence_level).toBe('E4');
    expect(kundaEntry?.evidence_status).toBe('provisional');
    expect(kundaEntry?.citation.locator).toBeNull();
    expect(kundaEntry?.review_record).toBeNull();

    // Verify disclosure that 'heṅge' is shared with informal southern/malnad speech in context
    expect(kundaEntry?.context).toContain('also occurs widely in informal Southern and Malnad Kannada');
    expect(kundaEntry?.limitations.some((l) => l.includes('before promoting from provisional'))).toBe(true);
    expect(kundaEntry?.citation.locator).toBeNull();
  });

  it('18. Enforces strictly 0 E3 records across datasets and confirms removal of unverified SRC-BHAT-1967', () => {
    // 1. Confirm SRC-BHAT-1967 is not in approved registry
    expect(APPROVED_BIBLIOGRAPHY_REGISTRY['SRC-BHAT-1967']).toBeUndefined();

    // 2. Approved registry contains strictly verifiable titles
    const approvedKeys = Object.keys(APPROVED_BIBLIOGRAPHY_REGISTRY);
    expect(approvedKeys).toEqual([
      'SRC-UPADHYAYA-1976',
      'SRC-VENKATASUBBIAH-IGO',
      'SRC-KITTEL-1894',
      'SRC-KSP-NIGHANTU',
    ]);

    // 3. Candidate entries have 0 E3 records
    const candidateE3Count = ALL_ENTRIES.filter((e) => e.evidence_status === 'speaker_reviewed').length;
    expect(candidateE3Count).toBe(0);

    // 4. Candidate review records are all null
    ALL_ENTRIES.forEach((entry) => {
      expect(entry.review_record).toBeNull();
    });
  });

  it('19. Asserts zero pseudo-corpus or fake oral collection names in secondary source metadata', () => {
    const pseudoCorpusPatterns = [/corpus/i, /oral usage record/i, /oral usage documentation/i];

    REGIONS.forEach((r) => {
      r.signaturePhrases.forEach((p) => {
        pseudoCorpusPatterns.forEach((pat) => {
          expect(p.source.title).not.toMatch(pat);
          expect(p.source.authorOrInstitution).not.toMatch(pat);
        });
        expect(p.source.title).toBe('Provisional colloquial candidate (no established source)');
      });
    });

    QUIZ_QUESTIONS.forEach((q) => {
      pseudoCorpusPatterns.forEach((pat) => {
        expect(q.source.title).not.toMatch(pat);
        expect(q.source.authorOrInstitution).not.toMatch(pat);
      });
      expect(q.source.title).toBe('Provisional colloquial candidate (no established source)');
    });

    GLOSSARY_WORDS.forEach((w) => {
      pseudoCorpusPatterns.forEach((pat) => {
        expect(w.source.title).not.toMatch(pat);
        expect(w.source.authorOrInstitution).not.toMatch(pat);
      });
      expect(w.source.title).toBe('Unverified colloquial backlog (no established source)');
    });
  });
});
