import React, { useState } from 'react';
import { TRAVEL_PHRASES } from '../data/travelPhrases';
import { TravelPhrase } from '../types';
import { speechService } from '../utils/speech';
import { Volume2, Play, Search, Sparkles } from 'lucide-react';

export const KannadaPhraseBook: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playingPhraseId, setPlayingPhraseId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Phrases', icon: '✨' },
    { id: 'greeting', label: 'Greetings & Respect', icon: '🙏' },
    { id: 'transit', label: 'Auto & Buses', icon: '🛺' },
    { id: 'food', label: 'Food & Cafes', icon: '🍛' },
    { id: 'temple', label: 'Temples & Shrines', icon: '🪔' },
    { id: 'shopping', label: 'Markets & Bargaining', icon: '🛍️' },
    { id: 'emergency', label: 'Emergency & Help', icon: '🚨' },
  ];

  const filteredPhrases = TRAVEL_PHRASES.filter((phrase) => {
    const matchesCategory = selectedCategory === 'all' || phrase.category === selectedCategory;
    const matchesQuery = 
      phrase.kannada.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phrase.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phrase.englishMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phrase.situation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handlePlayAudio = (phrase: TravelPhrase) => {
    setPlayingPhraseId(phrase.id);
    speechService.speak({
      kannadaText: phrase.kannada,
      transliteration: phrase.transliteration,
      onEnd: () => setPlayingPhraseId(null),
      onError: () => setPlayingPhraseId(null),
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-red-800 via-stone-900 to-stone-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-400/80 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-red-600 via-amber-400 to-amber-500"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-3xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Celebrate Kannada Feature • Voice Companion</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Essential Kannada Travel Audio Phrasebook
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl font-medium">
              Real phrases tourists actually need across Karnataka — from demanding auto meters in Bengaluru to ordering Neer Dosa in Udupi. Tap any phrase to hear pronunciation!
            </p>
          </div>

          <div className="flex items-center gap-2 bg-stone-900/90 px-4 py-2 rounded-2xl border border-stone-800 text-xs self-start md:self-center">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-stone-200">Total: {TRAVEL_PHRASES.length} Curated Phrases</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 relative max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by English, Kannada, or situation..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border-2 ${
                isSelected
                  ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-sm font-black'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-amber-300 hover:bg-stone-50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Phrase Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPhrases.map((phrase) => {
          const isPlaying = playingPhraseId === phrase.id;
          return (
            <div
              key={phrase.id}
              className={`bg-white rounded-2xl border-2 p-5 transition-all shadow-xs flex flex-col justify-between ${
                isPlaying
                  ? 'border-amber-500 ring-2 ring-amber-300 bg-amber-50/30'
                  : 'border-stone-200 hover:border-amber-300 hover:shadow-md'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xs font-extrabold uppercase tracking-wider text-red-800 bg-red-100 px-2 py-0.5 rounded-md">
                    {phrase.category.toUpperCase()}
                  </span>
                  <span className="text-3xs text-stone-400 italic">
                    Tap below to listen
                  </span>
                </div>

                <div className="text-2xs text-stone-500 font-semibold line-clamp-1">
                  Situation: {phrase.situation}
                </div>

                {/* Big Kannada Script */}
                <div className="font-kannada font-black text-xl text-stone-950 leading-snug pt-1">
                  {phrase.kannada}
                </div>

                {/* Transliteration */}
                <div className="text-xs font-bold text-red-700">
                  /{phrase.transliteration}/
                </div>

                {/* Meaning */}
                <div className="text-xs text-stone-700 italic">
                  "{phrase.englishMeaning}"
                </div>

                {/* Regional Note */}
                {phrase.regionalNote && (
                  <div className="pt-2 text-3xs text-stone-600 bg-stone-50 p-2 rounded-lg border border-stone-100">
                    <span className="font-bold text-stone-800">Culture Tip: </span>
                    <span>{phrase.regionalNote}</span>
                  </div>
                )}
              </div>

              {/* Play Audio Button */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => handlePlayAudio(phrase)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-amber-500 text-stone-950 scale-105 shadow-md animate-pulse'
                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                  }`}
                >
                  <Play className={`w-3.5 h-3.5 ${isPlaying ? 'fill-stone-950' : 'fill-white'}`} />
                  <span>{isPlaying ? 'Speaking...' : 'Play Audio'}</span>
                </button>

                <span className="text-4xs text-stone-400">
                  Web Speech API
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
