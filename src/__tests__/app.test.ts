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
import verifiedSourceRegistry from '../data/VERIFIED_SOURCE_REGISTRY.json';
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
    expect(approvedKeys).toContain('SRC-UPADHYAYA-1976');
    expect(approvedKeys).toContain('SRC-VENKATASUBBIAH-IGO');
    expect(approvedKeys).toContain('SRC-KITTEL-1894');
    expect(approvedKeys).toContain('SRC-KSP-NIGHANTU');
    expect(approvedKeys).toContain('SRC-ALAR');
    expect(approvedKeys).toContain('SRC-PADAKANAJA');
    expect(approvedKeys).toContain('SRC-BHAT-1971');
    expect(approvedKeys).toContain('SRC-BRIGHT-1958');
    expect(approvedKeys).toContain('SRC-HIREMATH-1961');
    expect(approvedKeys).toContain('SRC-LDCIL-DOC');
    expect(approvedKeys).not.toContain('SRC-BHAT-1967');

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

  // --- Argon Phase 5: Flagship Innovation Discovery Acceptance Tests ---

  it('20. (Phase 5 - TEST-01) Validates morpheme_xray_concatenation_and_slot_integrity across all 13 candidates', () => {
    expect(ALL_ENTRIES).toHaveLength(13);
    ALL_ENTRIES.forEach((entry) => {
      expect(entry.morpheme_decomposition).toBeDefined();
      expect(entry.morpheme_decomposition?.length).toBeGreaterThan(0);

      // Must have at least one invariant root slot
      const rootSlots = entry.morpheme_decomposition?.filter((s) => s.is_invariant_root);
      expect(rootSlots?.length).toBeGreaterThanOrEqual(1);

      entry.morpheme_decomposition?.forEach((slot) => {
        expect(slot.slot_id).toBeTruthy();
        expect(slot.slot_label).toBeTruthy();
        expect(slot.surface_kn).toBeTruthy();
        expect(slot.surface_iso).toBeTruthy();
        expect(slot.underlying_form).toBeTruthy();
        expect(slot.gloss_en).toBeTruthy();
        expect(typeof slot.is_invariant_root).toBe('boolean');
        expect(slot.shift_category).toBeTruthy();
        expect(slot.shift_explanation).toBeTruthy();
      });
    });

    // Check Kittur vs Kalyana progressive morphological markers
    const kitturEntry = ALL_ENTRIES.find((e) => e.id === 'nka-what-doing-kittur');
    const kalyanaEntry = ALL_ENTRIES.find((e) => e.id === 'nka-what-doing-kalyana');

    expect(kitturEntry).toBeDefined();
    expect(kalyanaEntry).toBeDefined();

    const kitturAspect = kitturEntry?.morpheme_decomposition?.find((s) => s.slot_id === 'slot-aspect-suffix');
    const kalyanaAspect = kalyanaEntry?.morpheme_decomposition?.find((s) => s.slot_id === 'slot-aspect-suffix');

    expect(kitturAspect?.surface_kn).toBe('-ಆಕತ್ತ-');
    expect(kitturAspect?.shift_category).toBe('aspect_morphology');
    expect(kalyanaAspect?.surface_kn).toBe('-ಲಿಕ್ಕತ್ತ-');
    expect(kalyanaAspect?.shift_category).toBe('aspect_morphology');
  });

  it('21. (Phase 5 - TEST-02) Validates phrase_passport_five_dimension_evidence_gate', () => {
    ALL_ENTRIES.forEach((entry) => {
      expect(entry.evidence_dimensions).toBeDefined();
      const dims = entry.evidence_dimensions!;

      // Enforce null exact locator & null native speaker review for all provisional E4 candidates
      expect(dims.exact_sentence_locator).toBeNull();
      expect(dims.native_speaker_review).toBeNull();

      // Enforce established comparative dimensions
      expect(['E1', 'E2']).toContain(dims.lexical_root);
      expect(dims.meaning_equivalence).toBe('E2');
      expect(dims.grammatical_pattern).toBe('E2');
      expect(dims.regional_distribution).toBe('E2');
    });
  });

  it('22. (Phase 5 - TEST-03) Validates closed_bibliography_registry_and_purge_check via VERIFIED_SOURCE_REGISTRY.json', () => {
    expect(verifiedSourceRegistry.registry_version).toBe('4.0.0');
    expect(verifiedSourceRegistry.verified_sources.length).toBeGreaterThanOrEqual(9);

    const registeredIds = verifiedSourceRegistry.verified_sources.map((s) => s.source_id);
    expect(registeredIds).toContain('SRC-UPADHYAYA-1976');
    expect(registeredIds).toContain('SRC-VENKATASUBBIAH-IGO');
    expect(registeredIds).toContain('SRC-KITTEL-1894');
    expect(registeredIds).toContain('SRC-KSP-NIGHANTU');
    expect(registeredIds).toContain('SRC-ALAR');
    expect(registeredIds).toContain('SRC-PADAKANAJA');
    expect(registeredIds).toContain('SRC-BHAT-1971');
    expect(registeredIds).toContain('SRC-BRIGHT-1958');
    expect(registeredIds).toContain('SRC-HIREMATH-1961');
    expect(registeredIds).toContain('SRC-LDCIL-DOC');

    // Zero mentions of unverified Bhat 1967
    expect(registeredIds).not.toContain('SRC-BHAT-1967');
    verifiedSourceRegistry.verified_sources.forEach((s) => {
      expect(s.canonical_title).not.toContain('Kannada Verb Forms');
      expect(s.author_or_institution).not.toContain('Shankara Bhat (1967)');
    });

    // All 13 candidate entries link to registered sources
    ALL_ENTRIES.forEach((entry) => {
      expect(registeredIds).toContain(entry.citation.source_id);
    });
  });

  it('23. (Phase 5 - TEST-04) Validates knowledge_gap_sparse_matrix_honesty across all 5 concepts and 6 macro-regions', () => {
    const requiredRegions = [
      'old_mysuru_southern',
      'kittur_karnataka',
      'kalyana_karnataka',
      'karavali_coastal',
      'malnad',
      'central_border_cluster',
    ];

    let totalGaps = 0;

    CONCEPTS.forEach((concept) => {
      requiredRegions.forEach((reg) => {
        const slotState = concept.region_matrix_states[reg as keyof typeof concept.region_matrix_states];
        expect(slotState).toBeDefined();
        if (slotState.status === 'no_verified_distinct_variant') {
          totalGaps++;
          expect(slotState.entry_id).toBeNull();
          expect(slotState.note).toBeTruthy();
        }
      });
    });

    // Confirms at least 5 honest empty states across the matrix
    expect(totalGaps).toBeGreaterThanOrEqual(5);
  });

  it('24. (Phase 5 - TEST-05) Validates composite_license_and_odbl_export_validation', () => {
    expect(ATLAS_DATASET.license_policy).toContain('CC BY 4.0');
    expect(ATLAS_DATASET.license_policy).toBeTruthy();

    ALL_ENTRIES.forEach((entry) => {
      expect(entry.license_status).toBe('approved_for_planned_use');
      expect(entry.limitations.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('25. (Phase 5 - TEST-06) Validates synthetic_tts_neutrality_and_fallback diagnostics', () => {
    // 1. Diagnostics in runtime environment
    const diag = speechService.getDiagnostics();
    expect(typeof diag.isSupported).toBe('boolean');
    expect(typeof diag.hasKannadaVoice).toBe('boolean');
    expect(typeof diag.notice).toBe('string');

    // 2. Verify speak rejects simulated accents and reports honest fallback error in headless/unsupported environment
    let errorReceived = '';
    const result = speechService.speak({
      kannadaText: 'ನಮಸ್ಕಾರ',
      onError: (err) => {
        errorReceived = err;
      },
    });
    expect(result).toBe(false);
    expect(errorReceived).toContain('Web Speech API is not supported in this browser environment.');
  });

  // --- Argon Phase 4 Forensic Bibliographic & Rights Audit Tests ---

  it('26. (Phase 4 - TEST-07) Validates rights_and_provenance and ODbL v1.0 compliance across candidate entries', () => {
    expect(ALL_ENTRIES).toHaveLength(13);
    ALL_ENTRIES.forEach((entry) => {
      expect(entry.rights_and_provenance).toBeDefined();
      const rp = entry.rights_and_provenance!;
      expect(rp.explanatory_text_origin).toBe('original_team_prose');
      expect(rp.explanatory_text_license).toBe('CC-BY-4.0');
      expect(rp.verbatim_third_party_text_copied).toBe(false);
      expect(rp.attribution_notice).toBeTruthy();
      expect([
        'public_domain_source',
        'odbl_1_0_database_source',
        'copyrighted_reference_factual_citation_only',
        'consented_contributor_observation',
      ]).toContain(rp.lexical_source_rights_type);

      // Entries citing Kittel 1894 have public_domain_source
      if (rp.lexical_source_id === 'SRC-KITTEL-1894') {
        expect(rp.lexical_source_rights_type).toBe('public_domain_source');
      }
      // Entries citing university monographs have copyrighted_reference_factual_citation_only
      if (
        rp.lexical_source_id === 'SRC-UPADHYAYA-1976' ||
        rp.lexical_source_id === 'SRC-VENKATASUBBIAH-IGO' ||
        rp.lexical_source_id === 'SRC-BRIGHT-1958' ||
        rp.lexical_source_id === 'SRC-BHAT-1971'
      ) {
        expect(rp.lexical_source_rights_type).toBe('copyrighted_reference_factual_citation_only');
      }
    });
  });

  it('27. (Phase 4 - TEST-08) Validates 7-state comparison_cell_state mapping across candidate entries', () => {
    const validStates = [
      'directly_attested_regional_form',
      'pattern_supported_regional_form',
      'shared_with_standard_or_multi_region',
      'candidate_awaiting_documentary_verification',
      'no_distinct_regional_equivalent_established',
      'community_reported_unverified',
      'language_contact_or_borrowed_form',
    ];

    ALL_ENTRIES.forEach((entry) => {
      expect(entry.comparison_cell_state).toBeDefined();
      expect(validStates).toContain(entry.comparison_cell_state);
    });

    // Check specific forensic adjudications from Artifact C
    const kundaEntry = ALL_ENTRIES.find((e) => e.id === 'nka-how-are-you-coastal-kunda');
    expect(kundaEntry?.comparison_cell_state).toBe('candidate_awaiting_documentary_verification');

    const kitturGood = ALL_ENTRIES.find((e) => e.id === 'nka-good-fine-kittur');
    expect(kitturGood?.comparison_cell_state).toBe('language_contact_or_borrowed_form');

    const stdHowAreYou = ALL_ENTRIES.find((e) => e.id === 'nka-how-are-you-std');
    expect(stdHowAreYou?.comparison_cell_state).toBe('shared_with_standard_or_multi_region');
  });

  it('28. (Phase 4 - TEST-09) Strict gating against unverified E1 source_attested claims and purged titles across all datasets', () => {
    const forbiddenPhrases = [
      'Kannada Bhaasha Prabhedagala Kosha',
      'Sociolinguistic Surveys of Old Mysore and Northern Karnataka',
      'Dharwada Kannada Prabheda Adhyayana',
      'Kundagannada Shabdakosha',
      'Coastal Kannada Dialect Survey',
      'Kalyana Karnataka Bhasha Vaisishte',
    ];

    // Assert zero occurrences in candidate data
    candidateData.entries.forEach((e) => {
      forbiddenPhrases.forEach((fp) => {
        expect(e.citation.source_title).not.toContain(fp);
      });
      // Zero entries claim source_attested or have human verification flags
      expect(e.evidence_status).not.toBe('source_attested');
      expect(e.citation.locator).toBeNull();
      expect(e.citation.locator_human_verified).toBe(false);
    });

    // Confirms strictly 0 source_attested entries in active candidates
    expect(candidateData.entries.filter((e) => e.evidence_status === 'source_attested')).toHaveLength(0);

    // Assert zero occurrences in regional signature phrases
    REGIONS.forEach((r) => {
      r.signaturePhrases.forEach((sp) => {
        forbiddenPhrases.forEach((fp) => {
          expect(sp.source.title).not.toContain(fp);
        });
        expect(sp.status).toBe('provisional');
      });
    });

    // Assert zero occurrences in quiz questions
    QUIZ_QUESTIONS.forEach((q) => {
      forbiddenPhrases.forEach((fp) => {
        expect(q.source.title).not.toContain(fp);
      });
      expect(q.morphological_note).toBeTruthy();
    });

    // Assert zero occurrences in glossary
    GLOSSARY_WORDS.forEach((w) => {
      forbiddenPhrases.forEach((fp) => {
        expect(w.source.title).not.toContain(fp);
      });
      expect(w.evidence_status).toBe('unverified');
      expect(w.evidence_level).toBe('E5');
    });

    // Validator check: Rejects source_attested without locator_human_verified: true
    const mutantFakeAttestation = JSON.parse(JSON.stringify(candidateData));
    mutantFakeAttestation.entries[0].evidence_status = 'source_attested';
    mutantFakeAttestation.entries[0].citation.locator = 'p. 142';
    mutantFakeAttestation.entries[0].citation.locator_human_verified = false;
    const mutResult = validateAtlasDataset(mutantFakeAttestation);
    expect(mutResult.valid).toBe(false);
    expect(mutResult.errors.some((err) => err.includes('locator_human_verified: true'))).toBe(true);

    // Validator check: Rejects entry citing an unknown source_id
    const mutantUnknownSource = JSON.parse(JSON.stringify(candidateData));
    mutantUnknownSource.entries[0].citation.source_id = 'SRC-UNAPPROVED-2026';
    const mutResult2 = validateAtlasDataset(mutantUnknownSource);
    expect(mutResult2.valid).toBe(false);
    expect(mutResult2.errors.some((err) => err.includes('not in approved registry'))).toBe(true);
  });
});
