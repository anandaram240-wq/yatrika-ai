import React, { useState } from 'react';
import { AtlasEntry, EvidenceLevel } from '../types';
import verifiedRegistry from '../data/VERIFIED_SOURCE_REGISTRY.json';
import {
  X,
  ShieldCheck,
  BookOpen,
  Layers,
  HelpCircle,
  ExternalLink,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Compass,
} from 'lucide-react';

interface PhrasePassportDrawerProps {
  entry: AtlasEntry | null;
  onClose: () => void;
  onOpenContributeModal?: () => void;
}

export const PhrasePassportDrawer: React.FC<PhrasePassportDrawerProps> = ({
  entry,
  onClose,
  onOpenContributeModal,
}) => {
  const [showE3Guidelines, setShowE3Guidelines] = useState(false);

  if (!entry) return null;

  // Look up source in verified registry
  const sourceRecord = verifiedRegistry.sources.find(
    (s) => s.source_id === entry.citation.source_id
  );

  const getDimensionBadge = (level: EvidenceLevel | null) => {
    if (level === 'E1') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-3xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
          <span>E1: Source-Attested</span>
        </span>
      );
    }
    if (level === 'E2') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-3xs font-extrabold bg-blue-100 text-blue-900 border border-blue-300">
          <CheckCircle2 className="w-3 h-3 text-blue-700" />
          <span>E2: Comparative Scholarly Pattern</span>
        </span>
      );
    }
    if (level === 'E3') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-3xs font-extrabold bg-purple-100 text-purple-900 border border-purple-300">
          <UserCheck className="w-3 h-3 text-purple-700" />
          <span>E3: Speaker-Reviewed</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-3xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
        <AlertTriangle className="w-3 h-3 text-amber-700" />
        <span>Pending Human Review</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-stone-900 text-white p-5 sm:p-6 border-b border-stone-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-3xs font-black uppercase tracking-wider bg-amber-400 text-stone-950">
                Official Phrase Passport
              </span>
              <span className="font-mono text-3xs text-stone-400">
                ID: {entry.id}
              </span>
            </div>
            <h3
              className="text-2xl sm:text-3xl font-kannada font-black text-amber-300 mt-2 leading-loose"
              lang="kn"
            >
              {entry.kannada_script}
            </h3>
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-300 mt-0.5">
              <span>ISO 15919: /{entry.transliteration}/</span>
              <span>•</span>
              <span className="text-stone-400 font-normal">
                Phonetic: [{entry.learner_phonetic_guide}]
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Close Passport"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Passport Body: 8 Pillars */}
        <div className="p-5 sm:p-6 space-y-6 text-stone-800 flex-1">
          {/* Question 1: Meaning & Concept */}
          <div className="rounded-2xl p-4 bg-amber-50/60 border border-amber-200/80">
            <span className="text-3xs font-extrabold uppercase tracking-wider text-amber-800 block mb-1">
              1. Meaning & Semantic Function
            </span>
            <div className="text-base font-bold text-stone-900">
              {entry.meaning_en}
            </div>
            <div className="text-xs text-stone-600 mt-1 font-medium">
              Concept: <span className="font-bold text-stone-800">{entry.concept}</span>
            </div>
          </div>

          {/* Question 2: Context, Social Register & Sub-Variety */}
          <div className="rounded-2xl p-4 bg-stone-50 border border-stone-200">
            <span className="text-3xs font-extrabold uppercase tracking-wider text-stone-600 block mb-1">
              2. Pragmatic Context & Sociolinguistic Register
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs mb-2">
              <div>
                <span className="text-stone-500 block text-3xs">Register:</span>
                <strong className="text-stone-900 capitalize">
                  {entry.register?.replace(/_/g, ' ') || 'Everyday spoken'}
                </strong>
              </div>
              <div>
                <span className="text-stone-500 block text-3xs">Sub-Variety / Dialect:</span>
                <strong className="text-stone-900">{entry.sub_variety}</strong>
              </div>
              <div className="col-span-2">
                <span className="text-stone-500 block text-3xs">Target Locality / Distribution:</span>
                <strong className="text-stone-900">{entry.region_or_locality}</strong>
              </div>
            </div>
            {entry.context && (
              <p className="text-xs text-stone-700 leading-relaxed pt-2 border-t border-stone-200/70">
                {entry.context}
              </p>
            )}
          </div>

          {/* Question 3: Public Licensing & Legal Distribution */}
          <div className="rounded-2xl p-4 bg-stone-50 border border-stone-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-3xs font-extrabold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-stone-600" />
                <span>3. Public Legal Status & Reuse Rights</span>
              </span>
              <span className="px-2 py-0.5 rounded text-4xs font-black uppercase bg-emerald-100 text-emerald-900">
                {entry.license_status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed mt-1">
              Descriptive structural metadata and educational commentary are released under{' '}
              <strong>CC BY 4.0</strong>. Underlying lexical entries are referenced under{' '}
              <strong>Fair Dealing (Section 52(1)(a), Indian Copyright Act)</strong> strictly for non-commercial educational linguistics and cultural documentation.
            </p>
          </div>

          {/* Question 4: Source Provenance & Registry Verification */}
          <div className="rounded-2xl p-4 bg-blue-50/70 border border-blue-200">
            <span className="text-3xs font-extrabold uppercase tracking-wider text-blue-800 flex items-center gap-1.5 mb-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-700" />
              <span>4. Source Provenance & Bibliography Verification</span>
            </span>
            {sourceRecord ? (
              <div className="space-y-1.5 text-xs">
                <div>
                  <strong className="text-stone-900 text-sm block">
                    {sourceRecord.full_title}
                  </strong>
                  <span className="text-stone-600">
                    Author: {sourceRecord.author} • Publisher: {sourceRecord.publisher} ({sourceRecord.publication_year})
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white/80 border border-blue-100 text-2xs text-stone-700">
                  <span className="font-bold text-stone-900">Access Rationale: </span>
                  <span>{sourceRecord.license_or_access}</span>
                </div>
                {sourceRecord.url && (
                  <a
                    href={sourceRecord.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-700 hover:underline font-bold mt-1"
                  >
                    <span>View Primary Catalogue Record</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ) : (
              <div className="text-xs text-stone-700">
                Cited under source ID: <code>{entry.citation.source_id}</code> (
                {entry.citation.source_title})
              </div>
            )}
            <div className="mt-2 text-3xs text-stone-500 font-mono">
              Exact Page Locator: {entry.citation.locator || 'Pending physical audit lookup (E4 provisional)'}
            </div>
          </div>

          {/* Question 5: 5-Dimension Evidence Audit Radar */}
          <div className="rounded-2xl p-4 bg-white border border-stone-300 shadow-xs">
            <span className="text-3xs font-extrabold uppercase tracking-wider text-stone-600 flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>5. Five-Dimension Linguistic Evidence Audit</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
                <span className="text-3xs font-semibold text-stone-500">Lexical Root Invariance</span>
                <div className="mt-1">{getDimensionBadge(entry.evidence_dimensions?.lexical_root || null)}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
                <span className="text-3xs font-semibold text-stone-500">Meaning Equivalence</span>
                <div className="mt-1">{getDimensionBadge(entry.evidence_dimensions?.meaning_equivalence || null)}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
                <span className="text-3xs font-semibold text-stone-500">Grammatical Morpheme Pattern</span>
                <div className="mt-1">{getDimensionBadge(entry.evidence_dimensions?.grammatical_pattern || null)}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
                <span className="text-3xs font-semibold text-stone-500">Regional Isogloss Distribution</span>
                <div className="mt-1">{getDimensionBadge(entry.evidence_dimensions?.regional_distribution || null)}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
                <span className="text-3xs font-semibold text-stone-500">Exact Sentence Citation Locator</span>
                <div className="mt-1">{getDimensionBadge(entry.evidence_dimensions?.exact_sentence_locator || null)}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
                <span className="text-3xs font-semibold text-stone-500">Native Speaker Field Review</span>
                <div className="mt-1">{getDimensionBadge(entry.evidence_dimensions?.native_speaker_review || null)}</div>
              </div>
            </div>
          </div>

          {/* Question 6: Morpheme-Shift X-Ray */}
          {entry.morpheme_decomposition && entry.morpheme_decomposition.length > 0 && (
            <div className="rounded-2xl p-4 bg-stone-900 text-stone-100 shadow-md">
              <span className="text-3xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5 mb-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>6. Morpheme-Shift X-Ray (Underlying Form Analysis)</span>
              </span>
              <div className="space-y-2">
                {entry.morpheme_decomposition.map((slot) => (
                  <div
                    key={slot.slot_id}
                    className="p-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="font-kannada font-bold text-amber-200 text-sm"
                          lang="kn"
                        >
                          {slot.surface_kn}
                        </span>
                        <span className="font-mono text-3xs text-stone-300">
                          /{slot.surface_iso}/
                        </span>
                      </div>
                      <span
                        className={`text-4xs px-1.5 py-0.5 rounded font-black uppercase ${
                          slot.is_invariant_root
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-700 text-stone-300'
                        }`}
                      >
                        {slot.is_invariant_root ? 'INVARIANT ROOT' : slot.shift_category.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="mt-1 text-2xs text-stone-400">
                      Underlying Reconstruction: <code className="text-amber-300 font-mono">{slot.underlying_form}</code> • Gloss: <strong>{slot.gloss_en}</strong>
                    </div>
                    <p className="text-3xs text-stone-300 mt-1 leading-relaxed">
                      {slot.shift_explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Question 7: Shared Regions & Isogloss Distribution */}
          <div className="rounded-2xl p-4 bg-stone-50 border border-stone-200">
            <span className="text-3xs font-extrabold uppercase tracking-wider text-stone-600 flex items-center gap-1.5 mb-1.5">
              <Compass className="w-3.5 h-3.5 text-stone-700" />
              <span>7. Shared Regions & Isogloss Distribution</span>
            </span>
            <p className="text-xs text-stone-700 leading-relaxed">
              Variant Type: <strong className="text-stone-900 uppercase font-mono">{entry.variant_type?.replace(/_/g, ' ')}</strong>
            </p>
            <p className="text-2xs text-stone-600 mt-1">
              Phonological / Morphological Shift Category: <strong className="text-stone-900">{entry.variation_type?.replace(/_/g, ' ')}</strong>
            </p>
          </div>

          {/* Question 8: Known Limitations & Open Unknowns */}
          <div className="rounded-2xl p-4 bg-amber-50/70 border border-amber-200">
            <span className="text-3xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>8. Explicit Limitations & Epistemic Boundaries</span>
            </span>
            <ul className="text-xs text-stone-700 space-y-1 list-disc list-inside">
              {entry.limitations.map((lim, idx) => (
                <li key={idx} className="leading-relaxed">{lim}</li>
              ))}
            </ul>
          </div>

          {/* Citizen-Linguistics Action: Genuine Native-Speaker Review (E3) Protocol */}
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-purple-700" />
                <strong className="text-xs text-purple-950 font-bold">
                  Promote to E3 (Native-Speaker Review)
                </strong>
              </div>
              <button
                onClick={() => setShowE3Guidelines(!showE3Guidelines)}
                className="text-xs font-bold text-purple-700 hover:underline cursor-pointer"
              >
                {showE3Guidelines ? 'Hide Protocol' : 'Review Protocol'}
              </button>
            </div>
            {showE3Guidelines ? (
              <div className="mt-3 text-2xs text-purple-900 space-y-1.5 leading-relaxed pt-2 border-t border-purple-200">
                <p>
                  To elevate a provisional (E4) candidate to speaker-reviewed (E3), the Namma Kannada protocol requires:
                </p>
                <ol className="list-decimal list-inside space-y-1 font-medium">
                  <li>Informed oral or written consent from a native speaker born/raised in the target taluk/district.</li>
                  <li>Explicit recording of sub-variety (e.g. Kundagannada, Havyaka, Gulbarga rural).</li>
                  <li>Verification of whether the expression is active colloquial, generational (elders only), or obsolescent.</li>
                  <li>Recording reviewer alias and date of observation.</li>
                </ol>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenContributeModal) onOpenContributeModal();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-2xs cursor-pointer transition-colors"
                  >
                    Submit Speaker Observation for Peer Review
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-3xs text-purple-700 mt-1">
                Currently 0 seeded entries claim E3. Click to review how community members contribute genuine field reviews.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <span className="text-3xs text-stone-500 font-mono">
            Namma Kannada Atlas • Linguistic Passport Protocol v1.1
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close Passport
          </button>
        </div>
      </div>
    </div>
  );
};
