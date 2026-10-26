import React, { useState } from 'react';
import { GLOSSARY_WORDS } from '../data/glossary';
import { REGIONS } from '../data/regions';
import { GlossaryWord, RegionId } from '../types';
import { speechService } from '../utils/speech';
import { Volume2, Search, BookOpen, Heart, Tag, Share2, Check, ShieldAlert, Eye, EyeOff } from 'lucide-react';

interface SlangGlossaryProps {
  customWords?: GlossaryWord[];
}

export const SlangGlossary: React.FC<SlangGlossaryProps> = ({ customWords = [] }) => {
  const [selectedRegionId, setSelectedRegionId] = useState<RegionId | 'all'>('all');
  const [showQuarantinedBacklog, setShowQuarantinedBacklog] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('namma_kannada_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  const allWords: GlossaryWord[] = [
    ...customWords,
    ...(showQuarantinedBacklog ? GLOSSARY_WORDS : []),
  ];

  const filteredWords = allWords.filter((w) => {
    const matchesRegion = selectedRegionId === 'all' || w.regionId === selectedRegionId;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      w.wordKannada.includes(searchQuery) ||
      w.wordEnglish.toLowerCase().includes(q) ||
      w.meaning.toLowerCase().includes(q) ||
      w.culturalOrigin.toLowerCase().includes(q) ||
      (w.locality && w.locality.toLowerCase().includes(q)) ||
      w.tags.some(t => t.toLowerCase().includes(q));
    return matchesRegion && matchesSearch;
  });

  const toggleFavorite = (id: string) => {
    const updated = favorites.includes(id)
      ? favorites.filter(item => item !== id)
      : [...favorites, id];
    setFavorites(updated);
    try {
      localStorage.setItem('namma_kannada_favorites', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopy = (word: GlossaryWord) => {
    const text = `${word.wordKannada} (${word.wordEnglish}) - ${word.meaning}\nLocality: ${word.locality || 'Karnataka'}\nSource: ${word.source.title} (${word.source.authorOrInstitution})\nExample: ${word.usageKannada} [${word.usageTransliteration}]`;
    navigator.clipboard.writeText(text);
    setCopiedId(word.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePlayAudio = (word: GlossaryWord) => {
    setPlayingWordId(word.id);
    setAudioError(null);
    speechService.speak({
      kannadaText: word.usageKannada || word.wordKannada,
      transliteration: word.usageTransliteration || word.wordEnglish,
      onEnd: () => setPlayingWordId(null),
      onError: (err) => {
        setPlayingWordId(null);
        setAudioError(err);
      },
    });
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-100 text-teal-900 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5 text-teal-700" />
            <span>Namma Shabda Kosha (ನಮ್ಮ ಶಬ್ದ ಕೋಶ)</span>
          </div>
          <h2 className="text-3xl font-extrabold text-stone-900">
            Documented Regional Slang, Idioms & Etymology
          </h2>
          <p className="text-stone-600 mt-1 max-w-2xl text-sm sm:text-base">
            Every dialect has words that encapsulate its people and history. Explore linguistic provenance, source citations, and colloquial examples.
          </p>
        </div>

        {/* Quarantine Banner */}
        <div className="mb-6 p-4 rounded-3xl bg-amber-50/90 border border-amber-300 text-amber-950 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Linguistic Audit Quarantine Notice (Argon Phase 2.5):</strong>
              <span className="text-stone-700">
                The 15 repository glossary entries below are held in an <strong>Unverified Backlog (E5)</strong> pending human physical page lookup (verifying headword editions in Kittel 1894, KSP Nighantu, or CIIL dictionaries and ensuring no Tulu/Kodava items are mislabeled as Kannada).
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowQuarantinedBacklog(!showQuarantinedBacklog)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-100 text-amber-900 font-bold whitespace-nowrap self-start md:self-auto cursor-pointer"
          >
            {showQuarantinedBacklog ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showQuarantinedBacklog ? 'Hide Quarantined Backlog' : 'Show Quarantined Backlog (15)'}</span>
          </button>
        </div>

        {/* Audio Error Alert if TTS voice is missing */}
        {audioError && (
          <div className="mb-6 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong>TTS Notice:</strong> {audioError}
            </div>
            <button onClick={() => setAudioError(null)} className="text-red-700 font-bold hover:underline">Dismiss</button>
          </div>
        )}

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Region Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <button
                onClick={() => setSelectedRegionId('all')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedRegionId === 'all'
                    ? 'bg-teal-700 text-white font-bold'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                All Regions ({allWords.length})
              </button>
              {REGIONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRegionId(r.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedRegionId === r.id
                      ? 'bg-teal-700 text-white font-bold'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {r.name.split(' (')[0]}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search word, meaning, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Glossary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWords.map((word) => {
            const isFav = favorites.includes(word.id);
            const isPlaying = playingWordId === word.id;
            const region = REGIONS.find((r) => r.id === word.regionId);
            const isQuarantined = word.evidence_status === 'unverified' || word.status === 'unverified';

            return (
              <div
                key={word.id}
                className={`bg-white rounded-3xl border p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all ${
                  isQuarantined
                    ? 'border-amber-200 hover:border-amber-400 bg-amber-50/20'
                    : 'border-stone-200 hover:border-teal-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg text-2xs font-extrabold uppercase tracking-wide bg-stone-100 text-stone-800 border border-stone-200">
                      {region?.name.split(' (')[0] || 'Karnataka'}
                    </span>

                    <span className={`px-2 py-0.5 rounded-md text-3xs font-bold uppercase tracking-wider ${
                      isQuarantined
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-purple-100 text-purple-900'
                    }`}>
                      {isQuarantined ? 'Quarantined (E5)' : 'Contributor Draft'}
                    </span>
                  </div>

                  {word.locality && (
                    <div className="text-3xs text-stone-500 font-medium mb-1">
                      Locality: <strong className="text-stone-700">{word.locality}</strong>
                    </div>
                  )}

                  <div className="flex items-baseline gap-2">
                    <h3 className="font-kannada font-black text-2xl text-stone-900 leading-loose" lang="kn">
                      {word.wordKannada}
                    </h3>
                    <span className="text-sm font-bold text-red-700">
                      /{word.wordEnglish}/
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-stone-700 font-medium">
                    {word.meaning}
                  </p>

                  {/* Cultural Origin / Etymology */}
                  <div className="mt-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-600">
                    <span className="font-bold text-stone-700 block mb-0.5">Etymology & Usage:</span>
                    <span>{word.culturalOrigin}</span>
                  </div>

                  {/* Sample Dialogue */}
                  <div className="mt-3 p-3 rounded-2xl bg-teal-50/40 border border-teal-100 text-xs">
                    <span className="font-bold text-teal-900 block mb-0.5">Conversational Context:</span>
                    <span className="font-kannada text-sm text-stone-900 block leading-loose" lang="kn">
                      "{word.usageKannada}"
                    </span>
                    <span className="text-2xs text-stone-500 italic block mt-0.5">
                      {word.usageEnglish}
                    </span>
                  </div>

                  {/* Citation */}
                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center gap-1.5 text-2xs text-stone-500 font-mono">
                    <BookOpen className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate" title={`${word.source.title} (${word.source.authorOrInstitution})`}>
                      {word.source.title}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {word.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-3xs font-medium bg-stone-100 text-stone-600"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFavorite(word.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isFav 
                          ? 'bg-red-50 border-red-200 text-red-600' 
                          : 'border-stone-200 text-stone-400 hover:text-red-500'
                      }`}
                      title="Save to favorites"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-600' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleCopy(word)}
                      className="p-2 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                      title="Copy citation to clipboard"
                    >
                      {copiedId === word.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <button
                    onClick={() => handlePlayAudio(word)}
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
