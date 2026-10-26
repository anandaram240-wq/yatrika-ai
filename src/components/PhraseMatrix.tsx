import React, { useState } from 'react';
import { CONCEPTS, REGION_SLOT_DEFINITIONS, getEntryById, RECONCILED_METRICS } from '../data/dataset';
import { AtlasEntry, RegionMatrixSlotId, RegionId } from '../types';
import { speechService } from '../utils/speech';
import { Volume2, Search, Mic, Sparkles, BookOpen, AlertCircle, ChevronDown, ChevronUp, Filter, ShieldAlert } from 'lucide-react';

interface PhraseMatrixProps {
  initialRegionId?: RegionId;
  onOpenVoicePractice: (kannada: string, transliteration: string, meaning: string) => void;
}

export const PhraseMatrix: React.FC<PhraseMatrixProps> = ({
  initialRegionId,
  onOpenVoicePractice,
}) => {
  const [selectedConceptId, setSelectedConceptId] = useState<string>(CONCEPTS[0].concept_id);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingEntryId, setPlayingEntryId] = useState<string | null>(null);
  const [audioErrorNotice, setAudioErrorNotice] = useState<string | null>(null);
  const [expandedLimitations, setExpandedLimitations] = useState<Record<string, boolean>>({});
  const [evidenceFilter, setEvidenceFilter] = useState<'all' | 'verified_only'>('all');

  const filteredConcepts = CONCEPTS.filter((c) => {
    const matchesSearch =
      c.concept_label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.documented_entry_ids.some((id) => {
        const entry = getEntryById(id);
        if (!entry) return false;
        return (
          entry.kannada_script.includes(searchQuery) ||
          (entry.transliteration && entry.transliteration.toLowerCase().includes(searchQuery.toLowerCase())) ||
          entry.meaning_en.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    return matchesSearch;
  });

  const activeConcept = 
    filteredConcepts.find((c) => c.concept_id === selectedConceptId) || 
    filteredConcepts[0] || 
    CONCEPTS[0];

  const handlePlayAudio = (entry: AtlasEntry) => {
    setPlayingEntryId(entry.id);
    setAudioErrorNotice(null);
    speechService.speak({
      kannadaText: entry.kannada_script,
      transliteration: entry.transliteration || undefined,
      onEnd: () => setPlayingEntryId(null),
      onError: (err) => {
        setPlayingEntryId(null);
        setAudioErrorNotice(err);
      },
    });
  };

  const toggleLimitations = (id: string) => {
    setExpandedLimitations((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const slotKeys: RegionMatrixSlotId[] = [
    'old_mysuru_southern',
    'kittur_karnataka',
    'kalyana_karnataka',
    'karavali_coastal',
    'malnad',
    'central_border_cluster',
  ];

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title & Reconciled Metrics */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-100 text-red-900 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-red-700" />
              <span>Evidence-Graded Cross-Dialect Matrix (Argon Phase 2.5)</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-mono font-medium border border-stone-200">
              Reconciled: {RECONCILED_METRICS.conceptCount} Concepts • {RECONCILED_METRICS.entryCount} Documented Candidates
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-stone-900">
            Compare Regional Expressions Side-by-Side
          </h2>
          <p className="text-stone-600 mt-1 max-w-3xl text-sm sm:text-base">
            Every candidate variation is grounded in comparative Dravidian dialectology. Where no distinct regional variant is attested in primary literature, an explicit empty state is preserved to prevent synthetic dialect fabrication.
          </p>
        </div>

        {/* Filter and Concept Selector Bar */}
        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Evidence Tier Toggle */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Evidence Filter:</span>
              </span>
              <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200 text-xs font-semibold">
                <button
                  onClick={() => setEvidenceFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    evidenceFilter === 'all'
                      ? 'bg-white text-stone-900 shadow-xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All Active Tiers (13 Provisional / E2 Pattern)
                </button>
                <button
                  onClick={() => setEvidenceFilter('verified_only')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    evidenceFilter === 'verified_only'
                      ? 'bg-emerald-700 text-white shadow-xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Verified Only (E1 Physical Locators)
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search concept or Kannada text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Filter Notice when 'Verified Only' is active */}
          {evidenceFilter === 'verified_only' && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Academic Provenance Notice:</strong> All 13 seed entries currently hold <strong>provisional (E4 phrase / E2 pattern)</strong> status because physical book page numbers are pending inspection. In strict "Verified Only" mode, entries require logged <code>citation.locator</code> page numbers or live native-speaker reviews (E3).
              </span>
            </div>
          )}

          {/* Audio Error Alert if TTS voice is missing */}
          {audioErrorNotice && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong>TTS Notice:</strong> {audioErrorNotice}
              </div>
              <button onClick={() => setAudioErrorNotice(null)} className="text-red-700 font-bold hover:underline">Dismiss</button>
            </div>
          )}

          {/* Concept Tabs */}
          <div className="flex gap-2 overflow-x-auto pt-2 pb-1">
            {filteredConcepts.map((concept, idx) => {
              const isSelected = concept.concept_id === activeConcept.concept_id;
              return (
                <button
                  key={concept.concept_id}
                  onClick={() => setSelectedConceptId(concept.concept_id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all text-left border cursor-pointer ${
                    isSelected
                      ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-2xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="block truncate max-w-xs">
                    {idx + 1}. {concept.concept_label.split(' (')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Concept Card Header */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-md p-6 sm:p-8 mb-8">
          <div className="pb-6 border-b border-stone-100">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              Communicative Concept: {activeConcept.concept_id}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
              {activeConcept.concept_label}
            </h3>
            <p className="text-stone-500 text-xs mt-1">
              Documented across {activeConcept.documented_entry_ids.length} distinct regional candidates with explicit multi-region and standard sharing states.
            </p>
          </div>

          {/* 6-Region Slot Matrix Grid */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Six-Region Matrix States (Isogloss & Variant Distribution)</span>
              </h4>
              <span className="text-3xs text-stone-400 italic">
                Verified candidate forms, shared baselines, and honest empty states
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {slotKeys.map((slotKey) => {
                const slotDef = REGION_SLOT_DEFINITIONS[slotKey];
                const slotState = activeConcept.region_matrix_states[slotKey];
                const entry = getEntryById(slotState.entry_id);
                const isPlaying = entry ? playingEntryId === entry.id : false;
                const isLimitationsOpen = entry ? expandedLimitations[entry.id] : false;

                // State 1: Honest Empty State (No verified distinct variant)
                if (slotState.status === 'no_verified_distinct_variant' || !entry) {
                  return (
                    <div
                      key={slotKey}
                      className="rounded-3xl border-2 border-dashed border-stone-200 bg-stone-50/50 p-6 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-extrabold text-stone-700">
                            {slotDef.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-3xs font-bold uppercase tracking-wider bg-stone-200 text-stone-600">
                            Empty State
                          </span>
                        </div>
                        <div className="text-2xs text-stone-400 font-kannada mb-3" lang="kn">
                          {slotDef.kannadaName}
                        </div>
                        <div className="text-xs text-stone-500 italic mt-3 p-3 bg-white/70 rounded-2xl border border-stone-200/60 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="block text-stone-700 font-semibold mb-0.5">
                              No Verified Distinct Regional Variant
                            </strong>
                            <span>{slotState.note}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-stone-200/50 text-3xs text-stone-400 font-mono">
                        Status: Awaiting speaker-reviewed field entry
                      </div>
                    </div>
                  );
                }

                // If filter is "verified_only" and entry is provisional: show notice card
                if (evidenceFilter === 'verified_only' && entry.evidence_status === 'provisional') {
                  return (
                    <div
                      key={slotKey}
                      className="rounded-3xl border border-dashed border-amber-300 bg-amber-50/40 p-6 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-amber-900">{slotDef.name}</span>
                          <span className="px-2 py-0.5 rounded-md text-3xs font-bold bg-amber-200 text-amber-900">
                            Provisional Hidden
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-2">
                          Candidate <code>{entry.id}</code> is pattern-supported (E2) but pending physical page locator verification (E1).
                        </p>
                      </div>
                      <button
                        onClick={() => setEvidenceFilter('all')}
                        className="mt-4 text-xs font-bold text-amber-800 hover:underline text-left cursor-pointer"
                      >
                        Switch to "All Active Tiers" to inspect
                      </button>
                    </div>
                  );
                }

                const isSharedWithStandard = slotState.status === 'shared_with_standard';
                const isDocumentedMultiRegion = slotState.status === 'documented_multi_region';

                return (
                  <div
                    key={slotKey}
                    className={`rounded-3xl border p-6 flex flex-col justify-between transition-all ${
                      initialRegionId === slotDef.id
                        ? 'ring-2 ring-red-500 bg-red-50/20 shadow-md border-red-200'
                        : isSharedWithStandard
                        ? 'bg-stone-50/70 border-stone-200'
                        : 'bg-white border-stone-200 hover:border-amber-400 hover:shadow-md'
                    }`}
                  >
                    <div>
                      {/* Region & Variant State Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold text-stone-800">
                          {slotDef.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-3xs font-bold uppercase tracking-wider ${
                          isSharedWithStandard
                            ? 'bg-stone-200 text-stone-700'
                            : isDocumentedMultiRegion
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isSharedWithStandard ? 'Standard Baseline' : isDocumentedMultiRegion ? 'Multi-Region' : 'Distinct Variant'}
                        </span>
                      </div>

                      {/* Sub-variety & Locality */}
                      <div className="text-2xs text-stone-500 font-medium mb-2">
                        Sub-variety: <strong className="text-stone-700">{entry.sub_variety}</strong>
                      </div>

                      {/* Kannada Script with Strict Leading-Loose to Prevent Ottakshara Clipping */}
                      <div
                        className="font-kannada font-black text-2xl text-stone-900 leading-loose"
                        lang="kn"
                      >
                        {entry.kannada_script}
                      </div>

                      {/* Transliteration & Phonetic Guide */}
                      <div className="text-xs font-semibold text-red-700 mt-1">
                        ISO 15919: /{entry.transliteration}/
                      </div>
                      <div className="text-2xs text-stone-500 italic mt-0.5">
                        Phonetic: [{entry.learner_phonetic_guide}]
                      </div>

                      {/* Sharing / Matrix State Note */}
                      <div className="mt-3 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70 text-2xs text-amber-950">
                        <span className="font-bold">Matrix Context: </span>
                        <span>{slotState.note}</span>
                      </div>

                      {/* Morphological Note */}
                      {entry.morphological_note && (
                        <div className="mt-2 text-2xs text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200/80 leading-relaxed">
                          <span className="font-bold text-stone-900 block mb-0.5">Grammatical Mechanism:</span>
                          <span>{entry.morphological_note}</span>
                        </div>
                      )}

                      {/* Provenance Badge & Citation */}
                      <div className="mt-3 pt-2.5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-1 text-2xs">
                        <span className="px-2 py-0.5 rounded-md text-3xs font-bold bg-indigo-100 text-indigo-900 uppercase">
                          {entry.evidence_status} ({entry.evidence_level})
                        </span>
                        <div className="text-stone-500 font-mono text-3xs flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-stone-400" />
                          <span title={`${entry.citation.source_title} (${entry.citation.author_or_publisher})`}>
                            {entry.citation.source_id}
                          </span>
                        </div>
                      </div>

                      {/* Limitations & Caveats Accordion */}
                      {entry.limitations && entry.limitations.length > 0 && (
                        <div className="mt-2.5">
                          <button
                            onClick={() => toggleLimitations(entry.id)}
                            className="flex items-center justify-between w-full text-3xs font-bold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                          >
                            <span>Linguistic Limitations ({entry.limitations.length})</span>
                            {isLimitationsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                          {isLimitationsOpen && (
                            <ul className="mt-1.5 p-2 rounded-xl bg-stone-100/80 border border-stone-200 text-3xs text-stone-600 space-y-1 list-disc list-inside">
                              {entry.limitations.map((lim, lIdx) => (
                                <li key={lIdx} className="leading-normal">{lim}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handlePlayAudio(entry)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isPlaying
                            ? 'bg-amber-500 text-stone-950 animate-pulse'
                            : 'bg-white text-stone-800 border border-stone-300 hover:bg-amber-50'
                        }`}
                        title="Listen (Synthetic Standard kn-IN Script Readout — Not a Native Regional Recording)"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>{isPlaying ? 'Speaking...' : 'Synthetic kn-IN'}</span>
                      </button>

                      <button
                        onClick={() =>
                          onOpenVoicePractice(
                            entry.kannada_script,
                            entry.transliteration || '',
                            entry.meaning_en
                          )
                        }
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-stone-600 hover:text-red-700 hover:bg-red-50 border border-stone-200 transition-colors cursor-pointer"
                        title="Practice Spoken Recall against Standard ASR"
                      >
                        <Mic className="w-3.5 h-3.5 text-red-600" />
                        <span>Recall Check</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
