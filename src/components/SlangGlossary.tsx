import React, { useState } from 'react';
import { GLOSSARY_WORDS } from '../data/glossary';
import { REGIONS } from '../data/regions';
import { GlossaryWord, RegionId } from '../types';
import { speechService } from '../utils/speech';
import { Volume2, Search, BookOpen, Heart, Tag, Share2, Check } from 'lucide-react';

interface SlangGlossaryProps {
  customWords?: GlossaryWord[];
}

export const SlangGlossary: React.FC<SlangGlossaryProps> = ({ customWords = [] }) => {
  const [selectedRegionId, setSelectedRegionId] = useState<RegionId | 'all'>('all');
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

  const allWords: GlossaryWord[] = [...customWords, ...GLOSSARY_WORDS];

  const filteredWords = allWords.filter((w) => {
    const matchesRegion = selectedRegionId === 'all' || w.regionId === selectedRegionId;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      w.wordKannada.includes(searchQuery) ||
      w.wordEnglish.toLowerCase().includes(q) ||
      w.meaning.toLowerCase().includes(q) ||
      w.culturalOrigin.toLowerCase().includes(q) ||
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
    const text = `${word.wordKannada} (${word.wordEnglish}) - ${word.meaning}\nExample: ${word.usageKannada} [${word.usageTransliteration}]`;
    navigator.clipboard.writeText(text);
    setCopiedId(word.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePlayAudio = (word: GlossaryWord) => {
    setPlayingWordId(word.id);
    speechService.speak({
      kannadaText: word.usageKannada || word.wordKannada,
      transliteration: word.usageTransliteration || word.wordEnglish,
      onEnd: () => setPlayingWordId(null),
      onError: () => setPlayingWordId(null),
    });
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-100 text-teal-800 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5 text-teal-700" />
            <span>Namma Shabda Kosha (ನಮ್ಮ ಶಬ್ದ ಕೋಶ)</span>
          </div>
          <h2 className="text-3xl font-extrabold text-stone-900">
            Regional Slang, Idioms & Cultural Origin Stories
          </h2>
          <p className="text-stone-600 mt-1 max-w-2xl text-sm sm:text-base">
            Every dialect has words that define its people. Explore the etymology and social backdrop behind Karnataka's most famous expressions.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm mb-8 space-y-4">
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

            {/* Search Bar */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search word, meaning, tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWords.map((word) => {
            const region = REGIONS.find((r) => r.id === word.regionId);
            const isFav = favorites.includes(word.id);
            const isPlaying = playingWordId === word.id;

            return (
              <div
                key={word.id}
                className="bg-white rounded-3xl border border-stone-200 hover:border-teal-400 hover:shadow-lg transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Region & Actions */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg text-2xs font-extrabold uppercase tracking-wide bg-stone-100 text-stone-700 border border-stone-200">
                      {region?.name.split(' (')[0] || 'Karnataka'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(word)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                        title="Copy phrase & meaning"
                      >
                        {copiedId === word.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Share2 className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => toggleFavorite(word.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isFav ? 'text-red-500 hover:text-red-600' : 'text-stone-300 hover:text-red-400'
                        }`}
                        title="Save to favorites"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Word Header */}
                  <div className="flex items-baseline gap-2.5">
                    <h3 className="font-kannada font-black text-2xl text-stone-900">
                      {word.wordKannada}
                    </h3>
                    <span className="text-base font-extrabold text-red-700">
                      /{word.wordEnglish}/
                    </span>
                  </div>

                  {/* Meaning */}
                  <p className="mt-2 text-sm text-stone-700 font-medium">
                    {word.meaning}
                  </p>

                  {/* Usage Sample */}
                  <div className="mt-4 p-3 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                    <div className="text-2xs uppercase tracking-wider font-bold text-stone-400">
                      Sample Conversation:
                    </div>
                    <div className="font-kannada text-sm font-semibold text-stone-900">
                      "{word.usageKannada}"
                    </div>
                    <div className="text-xs text-red-800 font-medium">
                      {word.usageTransliteration}
                    </div>
                    <div className="text-xs text-stone-600 italic">
                      Meaning: {word.usageEnglish}
                    </div>
                  </div>

                  {/* Cultural Origin Note */}
                  <div className="mt-4 text-xs text-stone-600 leading-relaxed">
                    <span className="font-bold text-stone-800">Cultural Context: </span>
                    {word.culturalOrigin}
                  </div>
                </div>

                {/* Bottom Row: Tags & Audio Player */}
                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {word.tags.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-2xs font-medium"
                      >
                        <Tag className="w-2.5 h-2.5 text-stone-400" />
                        {tag}
                      </span>
                    ))}
                    {word.isCommunityContributed && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-2xs font-bold">
                        Community
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handlePlayAudio(word)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isPlaying
                        ? 'bg-amber-500 text-stone-950 animate-pulse'
                        : 'bg-stone-50 hover:bg-amber-100 text-stone-800 border border-stone-200'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isPlaying ? 'Playing...' : 'Pronounce'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredWords.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 my-8">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-stone-800">No expressions found</h3>
            <p className="text-sm text-stone-500 mt-1">
              Try adjusting your search or region filter to discover more words.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
