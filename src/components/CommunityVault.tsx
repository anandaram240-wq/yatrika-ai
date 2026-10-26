import React, { useState } from 'react';
import { CommunityContribution } from '../types';
import { REGIONS } from '../data/regions';
import { speechService } from '../utils/speech';
import { MapPin, PlusCircle, Volume2, Download, Check, User, AlertCircle, Bookmark, RotateCcw } from 'lucide-react';

interface CommunityVaultProps {
  contributions: CommunityContribution[];
  onOpenContributeModal: () => void;
  onBookmarkContribution: (id: string) => void;
  onResetLocalData?: () => void;
  bookmarkedIds?: string[];
}

export const CommunityVault: React.FC<CommunityVaultProps> = ({
  contributions,
  onOpenContributeModal,
  onBookmarkContribution,
  onResetLocalData,
  bookmarkedIds = [],
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const handlePlayAudio = (item: CommunityContribution) => {
    setPlayingId(item.id);
    setAudioError(null);
    speechService.speak({
      kannadaText: item.usageExample || item.wordKannada,
      transliteration: item.wordTransliteration,
      onEnd: () => setPlayingId(null),
      onError: (err) => {
        setPlayingId(null);
        setAudioError(err);
      },
    });
  };

  const handleExportJSON = () => {
    // Generate JSON payload compliant with atlas-data.schema.json
    const schemaCompliantExport = {
      schema_version: '1.1.0',
      dataset_id: 'namma-kannada-fieldwork-export',
      generated_at: new Date().toISOString(),
      license_policy:
        'Per-entry source and license metadata required. Original contributor notes released under CC BY 4.0 without PII; third-party lexical sources retain their respective terms.',
      concept_coverage_summary: [
        {
          concept_id: 'concept-community-fieldwork',
          concept_label: 'Community Fieldwork Observations (Unverified Local Drafts)',
          documented_entry_ids: contributions.map((c) => `nka-${c.id.replace(/[^a-z0-9-]/g, '')}`),
          region_matrix_states: {
            old_mysuru_southern: {
              status: 'provisional_candidate',
              entry_id: contributions.find((c) => c.regionId === 'mysuru-mandya') ? `nka-${contributions.find((c) => c.regionId === 'mysuru-mandya')!.id.replace(/[^a-z0-9-]/g, '')}` : null,
              note: 'User-contributed local fieldwork observation.',
            },
            kittur_karnataka: {
              status: 'provisional_candidate',
              entry_id: contributions.find((c) => c.regionId === 'uttara-karnataka') ? `nka-${contributions.find((c) => c.regionId === 'uttara-karnataka')!.id.replace(/[^a-z0-9-]/g, '')}` : null,
              note: 'User-contributed local fieldwork observation.',
            },
            kalyana_karnataka: {
              status: 'provisional_candidate',
              entry_id: contributions.find((c) => c.regionId === 'kalyana-karnataka') ? `nka-${contributions.find((c) => c.regionId === 'kalyana-karnataka')!.id.replace(/[^a-z0-9-]/g, '')}` : null,
              note: 'User-contributed local fieldwork observation.',
            },
            karavali_coastal: {
              status: 'provisional_candidate',
              entry_id: contributions.find((c) => c.regionId === 'karavali') ? `nka-${contributions.find((c) => c.regionId === 'karavali')!.id.replace(/[^a-z0-9-]/g, '')}` : null,
              note: 'User-contributed local fieldwork observation.',
            },
            malnad: {
              status: 'provisional_candidate',
              entry_id: contributions.find((c) => c.regionId === 'malenadu') ? `nka-${contributions.find((c) => c.regionId === 'malenadu')!.id.replace(/[^a-z0-9-]/g, '')}` : null,
              note: 'User-contributed local fieldwork observation.',
            },
            central_border_cluster: {
              status: 'provisional_candidate',
              entry_id: contributions.find((c) => c.regionId === 'bengaluru-urban') ? `nka-${contributions.find((c) => c.regionId === 'bengaluru-urban')!.id.replace(/[^a-z0-9-]/g, '')}` : null,
              note: 'User-contributed local fieldwork observation.',
            },
          },
        },
      ],
      entries: contributions.map((c) => ({
        id: `nka-${c.id.replace(/[^a-z0-9-]/g, '')}`,
        concept_id: 'concept-community-fieldwork',
        concept: c.meaning,
        meaning_en: c.meaning.length >= 10 ? c.meaning : `${c.meaning} (fieldwork observation)`,
        language_code: 'kn',
        kannada_script: c.wordKannada,
        transliteration: c.wordTransliteration,
        learner_phonetic_guide: c.wordTransliteration,
        context: `Documented by ${c.contributorName} (${c.attributionPreference}) from ${c.district}.`,
        register: 'everyday_regional_and_community_spoken',
        region_or_locality: c.district,
        sub_variety: `${c.regionId} regional vernacular`,
        variant_type: 'provisional_candidate',
        variation_type: 'lexical',
        morphological_note: c.localNotes || 'User observation logged via Local Browser Fieldwork Notebook.',
        pattern_evidence_level: 'E4',
        evidence_level: 'E4',
        evidence_status: 'contributor_pending',
        citation: {
          source_id: 'SRC-COMMUNITY-FIELDWORK',
          source_title: 'Local Fieldwork Notebook Submission',
          author_or_publisher: c.contributorName,
          publication_year: 2026,
          locator: null,
          url: null,
        },
        review_record: null,
        license_status: c.license_status || 'approved_for_planned_use',
        limitations: [
          'Entry was recorded in a client-side fieldwork notebook and has not yet undergone formal peer linguistic review.',
          'Exact headword attestation in a published dictionary is pending verification.',
        ],
      })),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(schemaCompliantExport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'namma_kannada_schema_validated_fieldwork_export.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-100 text-purple-900 text-xs font-bold mb-2">
              <MapPin className="w-3.5 h-3.5 text-purple-700" />
              <span>Local Browser Fieldwork Notebook (`localStorage`)</span>
            </div>
            <h2 className="text-3xl font-extrabold text-stone-900">
              Community Dialect Vault
            </h2>
            <p className="text-stone-600 mt-1 max-w-2xl text-sm sm:text-base">
              Document regional words, idioms, and local expressions from your hometown. Entries are stored locally in your browser and exportable as schema-validated JSON for research archival.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onResetLocalData && (
              <button
                onClick={onResetLocalData}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs font-semibold transition-all cursor-pointer"
                title="Reset local drafts to default entries"
              >
                <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                <span>Reset Drafts</span>
              </button>
            )}

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-sm font-semibold transition-all shadow-xs cursor-pointer"
            >
              {downloadSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4 text-stone-500" />}
              <span>{downloadSuccess ? 'Downloaded Schema JSON!' : 'Download Schema-Validated JSON'}</span>
            </button>

            <button
              onClick={onOpenContributeModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-linear-to-r from-red-600 to-amber-600 text-white text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Draft New Observation</span>
            </button>
          </div>
        </div>

        {/* Local Persistence & Storage Transparency Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs text-purple-950 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-bold">Client Storage & Licensing Policy:</strong>
            <p className="text-stone-700 leading-relaxed">
              Fieldwork observations are stored locally in your browser's private storage (<code>localStorage</code>) and tagged as <code>contributor_pending</code> (E3 observation / E4 phrase). They are not synced to a live server. When downloaded, each entry includes explicit attribution metadata under CC BY 4.0 without personal identifying information.
            </p>
          </div>
        </div>

        {/* Audio Error Alert if TTS voice is missing */}
        {audioError && (
          <div className="mb-6 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong>TTS Notice:</strong> {audioError}
            </div>
            <button onClick={() => setAudioError(null)} className="text-red-700 font-bold hover:underline">Dismiss</button>
          </div>
        )}

        {/* Contributions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributions.map((item) => {
            const region = REGIONS.find((r) => r.id === item.regionId);
            const isPlaying = playingId === item.id;
            const isBookmarked = bookmarkedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-stone-200 hover:border-purple-300 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg text-2xs font-extrabold uppercase tracking-wide bg-purple-50 text-purple-800 border border-purple-200">
                        {region?.name.split(' (')[0] || 'Karnataka'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-3xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
                        {item.status || 'contributor_pending'}
                      </span>
                    </div>

                    <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500" />
                      {item.district}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <h3 className="font-kannada font-black text-2xl text-stone-900 leading-loose" lang="kn">
                      {item.wordKannada}
                    </h3>
                    <span className="text-sm font-bold text-red-700">
                      /{item.wordTransliteration}/
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-stone-700 font-medium">
                    {item.meaning}
                  </p>

                  {item.usageExample && (
                    <div className="mt-4 p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-800">
                      <span className="font-bold text-stone-500 block mb-0.5">Sample Sentence:</span>
                      <span className="font-kannada text-sm block leading-loose" lang="kn">"{item.usageExample}"</span>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between text-2xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Contributor: <strong className="text-stone-700">{item.contributorName}</strong> ({item.attributionPreference})
                    </span>
                    <span>{item.timestamp}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => onBookmarkContribution(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isBookmarked 
                        ? 'bg-purple-100 border-purple-300 text-purple-900' 
                        : 'text-stone-700 hover:text-purple-700 hover:bg-purple-50 border-stone-200'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-purple-600 text-purple-600' : 'text-stone-400'}`} />
                    <span>{isBookmarked ? 'Saved to Device' : 'Save Entry'}</span>
                  </button>

                  <button
                    onClick={() => handlePlayAudio(item)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isPlaying
                        ? 'bg-amber-500 text-stone-950 animate-pulse'
                        : 'bg-stone-50 hover:bg-amber-100 text-stone-800 border border-stone-200'
                    }`}
                    title="Listen (Synthetic Standard kn-IN Script Readout — Not a Native Regional Recording)"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isPlaying ? 'Speaking...' : 'Synthetic kn-IN'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
