import React, { useState } from 'react';
import { DIALECT_PHRASES } from '../data/phrases';
import { REGIONS } from '../data/regions';
import { DialectPhrase, PhraseCategory, RegionId } from '../types';
import { speechService } from '../utils/speech';
import { Volume2, Search, Mic, Sparkles } from 'lucide-react';

interface PhraseMatrixProps {
  initialRegionId?: RegionId;
  onOpenVoicePractice: (kannada: string, transliteration: string, meaning: string) => void;
}

export const PhraseMatrix: React.FC<PhraseMatrixProps> = ({
  initialRegionId,
  onOpenVoicePractice,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PhraseCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhraseId, setSelectedPhraseId] = useState<string>(DIALECT_PHRASES[0].id);
  const [playingRegionId, setPlayingRegionId] = useState<string | null>(null);

  const categories: { id: PhraseCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All Expressions', icon: '✨' },
    { id: 'greetings', label: 'Greetings', icon: '🙏' },
    { id: 'food-dining', label: 'Food & Feasts', icon: '🍛' },
    { id: 'travel-auto', label: 'Travel & Autos', icon: '🛺' },
    { id: 'daily-life', label: 'Everyday Care', icon: '🏡' },
    { id: 'humor-slang', label: 'Humor & Banter', icon: '😄' },
  ];

  const filteredPhrases = DIALECT_PHRASES.filter((phrase) => {
    const matchesCategory = selectedCategory === 'all' || phrase.category === selectedCategory;
    const matchesSearch =
      phrase.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phrase.context.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phrase.standardKannada.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phrase.standardKannada.kannada.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const activePhrase: DialectPhrase = 
    filteredPhrases.find(p => p.id === selectedPhraseId) || 
    filteredPhrases[0] || 
    DIALECT_PHRASES[0];

  const handlePlayAudio = (
    kannadaText: string,
    transliteration: string,
    key: string,
    pitch = 1.0,
    rate = 1.0
  ) => {
    setPlayingRegionId(key);
    speechService.speak({
      kannadaText,
      transliteration,
      pitch,
      rate,
      onEnd: () => setPlayingRegionId(null),
      onError: () => setPlayingRegionId(null),
    });
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-100 text-red-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>Cross-Dialect Transformer Matrix</span>
          </div>
          <h2 className="text-3xl font-extrabold text-stone-900">
            Compare How One Thought Sounds in 6 Dialects
          </h2>
          <p className="text-stone-600 mt-1 max-w-2xl text-sm sm:text-base">
            Select an everyday situation to witness how words change their cadence, grammar, and emotional flavor across Karnataka.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-red-700 text-white shadow-xs font-bold'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search phrase or meaning..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Quick Phrase Selector List */}
          <div className="flex gap-2 overflow-x-auto pt-2 pb-1">
            {filteredPhrases.map((phrase) => {
              const isSelected = phrase.id === activePhrase.id;
              return (
                <button
                  key={phrase.id}
                  onClick={() => setSelectedPhraseId(phrase.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all text-left border cursor-pointer ${
                    isSelected
                      ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-2xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="block truncate max-w-xs">{phrase.english}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Expression Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-md p-6 sm:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                Context: {activePhrase.context}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
                "{activePhrase.english}"
              </h3>
            </div>

            {/* Standard Kannada Reference Card */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center justify-between gap-4 max-w-md">
              <div>
                <span className="text-2xs uppercase font-bold text-stone-500 tracking-wider">
                  Standard Kannada (ಗ್ರಾಂಥಿಕ ಕನ್ನಡ)
                </span>
                <div className="font-kannada font-bold text-lg text-stone-900">
                  {activePhrase.standardKannada.kannada}
                </div>
                <div className="text-xs text-stone-600 font-medium">
                  {activePhrase.standardKannada.transliteration}
                </div>
              </div>

              <button
                onClick={() =>
                  handlePlayAudio(
                    activePhrase.standardKannada.kannada,
                    activePhrase.standardKannada.transliteration,
                    'standard'
                  )
                }
                className={`p-2.5 rounded-xl border border-stone-300 bg-white hover:bg-amber-50 transition-all cursor-pointer ${
                  playingRegionId === 'standard' ? 'bg-amber-500 text-white animate-pulse' : 'text-stone-700'
                }`}
                title="Listen to Standard Kannada"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 6 Regional Dialect Grid */}
          <div className="mt-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Regional Variations Across Karnataka</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {REGIONS.map((region) => {
                const variation = activePhrase.variations[region.id];
                if (!variation) return null;
                const isPlaying = playingRegionId === region.id;
                const isHighlighted = initialRegionId === region.id;

                return (
                  <div
                    key={region.id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                      isHighlighted
                        ? 'ring-2 ring-red-500 shadow-md bg-stone-50/90'
                        : 'bg-stone-50/60 border-stone-200 hover:border-amber-400 hover:shadow-sm'
                    }`}
                  >
                    <div>
                      {/* Region Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold text-stone-800">
                          {region.name.split(' (')[0]}
                        </span>
                        <span className="font-kannada text-xs text-amber-800 font-semibold bg-amber-100/60 px-2 py-0.5 rounded-md">
                          {region.kannadaName.split(' (')[0]}
                        </span>
                      </div>

                      {/* Kannada Script */}
                      <div className="font-kannada font-bold text-lg sm:text-xl text-stone-900 mt-2 leading-relaxed">
                        {variation.kannada}
                      </div>

                      {/* Transliteration */}
                      <div className="text-xs sm:text-sm font-semibold text-red-700 mt-1">
                        {variation.transliteration}
                      </div>

                      {/* Nuance explanation */}
                      <div className="mt-3 text-xs text-stone-600 bg-white/80 p-2.5 rounded-xl border border-stone-200/80">
                        <span className="font-bold text-stone-700">Linguistic Nuance: </span>
                        <span>{variation.nuance}</span>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() =>
                          handlePlayAudio(
                            variation.kannada,
                            variation.transliteration,
                            region.id,
                            variation.audioPitch,
                            variation.audioRate
                          )
                        }
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isPlaying
                            ? 'bg-amber-500 text-stone-950 animate-pulse'
                            : 'bg-white text-stone-800 border border-stone-300 hover:bg-amber-50 hover:text-amber-900'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>{isPlaying ? 'Playing...' : 'Listen'}</span>
                      </button>

                      <button
                        onClick={() =>
                          onOpenVoicePractice(
                            variation.kannada,
                            variation.transliteration,
                            activePhrase.english
                          )
                        }
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-stone-600 hover:text-red-700 hover:bg-red-50 border border-stone-200 transition-colors cursor-pointer"
                        title="Practice pronouncing this in your own voice"
                      >
                        <Mic className="w-3.5 h-3.5 text-red-600" />
                        <span>Practice</span>
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
