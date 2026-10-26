import { AtlasDataset, AtlasEntry } from '../types';

export interface SemanticValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  reconciledCounts: {
    concepts: number;
    entries: number;
    provisionalEntries: number;
    sourceAttestedEntries: number;
    speakerReviewedEntries: number;
  };
}

export const APPROVED_BIBLIOGRAPHY_REGISTRY: Record<string, { title: string; author: string }> = {
  'SRC-UPADHYAYA-1976': {
    title: 'A Comparative Study of Kannada Dialects',
    author: 'U. Padmanabha Upadhyaya / Prasaranga, University of Mysore',
  },
  'SRC-VENKATASUBBIAH-IGO': {
    title: 'Igo Kannada (ಇಗೋ ಕನ್ನಡ)',
    author: 'G. Venkatasubbiah / Navakarnataka Publications',
  },
  'SRC-KITTEL-1894': {
    title: 'A Kannada-English Dictionary',
    author: 'Rev. Ferdinand Kittel / Basel Mission, Mangalore',
  },
};

export const ALLOWED_REGISTERS = [
  'formal_and_polite_spoken',
  'formal_and_everyday_standard',
  'polite_everyday_spoken',
  'everyday_spoken',
  'everyday_regional_and_community_spoken',
  'informal_colloquial',
  'agrarian_or_traditional',
  'archaic_or_literary',
] as const;

/**
 * Executes the 6 Semantic Validation Rules defined in the Argon Phase 2.5 Protocol
 */
export function validateAtlasDataset(dataset: AtlasDataset): SemanticValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!dataset.concept_coverage_summary || dataset.concept_coverage_summary.length === 0) {
    errors.push('Rule 3 Error: concept_coverage_summary must contain at least one concept.');
  }

  if (!dataset.entries || dataset.entries.length === 0) {
    errors.push('Rule 3 Error: entries array must contain at least one entry.');
  }

  const conceptIds = new Set(dataset.concept_coverage_summary.map((c) => c.concept_id));
  const entryIds = new Set<string>();

  let provisionalCount = 0;
  let sourceAttestedCount = 0;
  let speakerReviewedCount = 0;

  dataset.entries.forEach((entry: AtlasEntry, idx: number) => {
    const prefix = `Entry [${entry.id || idx}]`;

    // Duplicate check
    if (entry.id) {
      if (entryIds.has(entry.id)) {
        errors.push(`${prefix}: Duplicate entry ID found.`);
      }
      entryIds.add(entry.id);
    } else {
      errors.push(`${prefix}: Missing entry ID.`);
    }

    // Concept reference check
    if (!conceptIds.has(entry.concept_id)) {
      errors.push(`${prefix}: concept_id "${entry.concept_id}" is not in concept_coverage_summary.`);
    }

    // Rule 1: Bibliographic Verification
    if (entry.citation) {
      if (entry.citation.source_id && !APPROVED_BIBLIOGRAPHY_REGISTRY[entry.citation.source_id]) {
        warnings.push(`${prefix}: source_id "${entry.citation.source_id}" is not in approved registry.`);
      }
      if (entry.citation.publication_year !== null && entry.citation.publication_year !== undefined) {
        if (entry.citation.publication_year < 1800 || entry.citation.publication_year > 2026) {
          errors.push(`${prefix}: Publication year ${entry.citation.publication_year} outside valid range 1800-2026.`);
        }
      }
    } else {
      errors.push(`${prefix}: Missing citation object.`);
    }

    // Rule 2: Lexical Attestation & Locator Verification
    if (entry.evidence_status === 'source_attested') {
      sourceAttestedCount++;
      if (!entry.citation?.locator || entry.citation.locator.trim().length === 0) {
        errors.push(`${prefix}: evidence_status is "source_attested" but citation.locator is missing.`);
      } else if (/^https?:\/\/[^/]+\/?$/.test(entry.citation.locator)) {
        errors.push(`${prefix}: citation.locator must be an exact page/headword, not a bare domain URL.`);
      }
    } else if (entry.evidence_status === 'provisional') {
      provisionalCount++;
      // Honest check: provisional entries must have null locator
      if (entry.citation?.locator) {
        warnings.push(`${prefix}: provisional entry has non-null locator; verify whether eligible for promotion.`);
      }
    } else if (entry.evidence_status === 'speaker_reviewed') {
      speakerReviewedCount++;
    }

    // Rule 3: Regional Attribution
    if (!entry.region_or_locality || entry.region_or_locality.trim().length === 0) {
      errors.push(`${prefix}: region_or_locality is required.`);
    }
    if (!entry.sub_variety || entry.sub_variety.trim().length === 0) {
      errors.push(`${prefix}: sub_variety is required.`);
    }
    if (!entry.variant_type) {
      errors.push(`${prefix}: variant_type is required.`);
    }

    // Rule 4: Meaning & Context Validation
    if (!entry.meaning_en || entry.meaning_en.trim().length < 5) {
      errors.push(`${prefix}: meaning_en must be at least 5 characters.`);
    }
    if (!entry.context || entry.context.trim().length === 0) {
      errors.push(`${prefix}: context is required.`);
    }
    if (entry.register && !ALLOWED_REGISTERS.includes(entry.register as any)) {
      errors.push(`${prefix}: register "${entry.register}" is not in allowed registers enum.`);
    }

    // Rule 5: Transliteration & Script Alignment
    if (!entry.transliteration || entry.transliteration.trim().length === 0) {
      errors.push(`${prefix}: transliteration is required.`);
    }
    if (!entry.learner_phonetic_guide || entry.learner_phonetic_guide.trim().length === 0) {
      errors.push(`${prefix}: learner_phonetic_guide is required.`);
    }
    if (!entry.kannada_script || !/[\u0C80-\u0CFF]/.test(entry.kannada_script)) {
      errors.push(`${prefix}: kannada_script must contain Kannada Unicode characters (U+0C80-U+0CFF).`);
    }

    // Rule 6: Native-Speaker Review
    if (entry.evidence_status === 'speaker_reviewed') {
      if (!entry.review_record) {
        errors.push(`${prefix}: evidence_status is "speaker_reviewed" but review_record is null.`);
      } else if (!entry.review_record.consent_recorded) {
        errors.push(`${prefix}: review_record.consent_recorded must be true.`);
      }
    } else if (entry.evidence_status === 'contributor_pending') {
      if (entry.review_record !== null) {
        errors.push(`${prefix}: contributor_pending entry must have review_record: null.`);
      }
    }

    // License Policy Check
    if (!entry.license_status) {
      errors.push(`${prefix}: license_status is required.`);
    }
  });

  // Verify all documented_entry_ids exist in entries
  dataset.concept_coverage_summary.forEach((concept) => {
    concept.documented_entry_ids.forEach((id) => {
      if (!entryIds.has(id)) {
        errors.push(`Concept [${concept.concept_id}]: References missing documented entry ID "${id}".`);
      }
    });

    // Check all 6 slots in region_matrix_states
    const requiredSlots = [
      'old_mysuru_southern',
      'kittur_karnataka',
      'kalyana_karnataka',
      'karavali_coastal',
      'malnad',
      'central_border_cluster',
    ];
    requiredSlots.forEach((slot) => {
      const state = (concept.region_matrix_states as any)[slot];
      if (!state) {
        errors.push(`Concept [${concept.concept_id}]: Missing slot "${slot}" in region_matrix_states.`);
      } else {
        if (state.entry_id && !entryIds.has(state.entry_id)) {
          errors.push(`Concept [${concept.concept_id}] slot [${slot}]: Linked entry_id "${state.entry_id}" does not exist.`);
        }
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    reconciledCounts: {
      concepts: dataset.concept_coverage_summary.length,
      entries: dataset.entries.length,
      provisionalEntries: provisionalCount,
      sourceAttestedEntries: sourceAttestedCount,
      speakerReviewedEntries: speakerReviewedCount,
    },
  };
}
