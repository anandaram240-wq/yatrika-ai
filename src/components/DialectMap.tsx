import React, { useState } from 'react';
import { REGIONS } from '../data/regions';
import { RegionId } from '../types';
import { speechService } from '../utils/speech';
import { Volume2, MapPin, Sparkles, Compass, CheckCircle2 } from 'lucide-react';

interface DialectMapProps {
  onSelectRegionForMatrix?: (regionId: RegionId) => void;
}

export const DialectMap: React.FC<DialectMapProps> = ({ onSelectRegionForMatrix }) => {
  const [selectedRegionId, setSelectedRegionId] = useState<RegionId>('uttara-karnataka');
  const [playingPhraseIndex, setPlayingPhraseIndex] = useState<number | null>(null);

  const selectedRegion = REGIONS.find(r => r.id === selectedRegionId) || REGIONS[0];

  const handlePlayAudio = (phraseKannada: string, transliteration: string, index: number) => {
    setPlayingPhraseIndex(index);
    speechService.speak({
      kannadaText: phraseKannada,
      transliteration: transliteration,
      onEnd: () => setPlayingPhraseIndex(null),
      onError: () => setPlayingPhraseIndex(null),
    });
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-100 text-red-800 text-xs font-bold mb-2">
              <Compass className="w-3.5 h-3.5 text-red-600" />
              <span>Interactive Geographical Explorer</span>
            </div>
            <h2 className="text-3xl font-extrabold text-stone-900">
              The Linguistic Geography of Karnataka
            </h2>
            <p className="text-stone-600 mt-1 max-w-2xl text-sm sm:text-base">
              Click on any region below to discover how tone, vocabulary, cadence, and cultural heritage transform across the land of Kannada.
            </p>
          </div>
        </div>

        {/* Region Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
          {REGIONS.map((region) => {
            const isSelected = region.id === selectedRegionId;
            return (
              <button
                key={region.id}
                onClick={() => setSelectedRegionId(region.id)}
                className={`flex flex-col p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? `${region.themeColor.secondary} ring-2 ring-amber-500 shadow-md font-bold scale-[1.02]`
                    : 'bg-white border-stone-200 hover:border-amber-300 hover:bg-stone-50'
                }`}
              >
                <span className="text-xs font-semibold uppercase text-stone-500 flex items-center justify-between">
                  <span>Zone</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                </span>
                <span className="font-extrabold text-sm text-stone-900 mt-1 line-clamp-1">
                  {region.name.split(' (')[0]}
                </span>
                <span className="font-kannada text-xs text-stone-600 mt-0.5 line-clamp-1">
                  {region.kannadaName.split(' (')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Region Deep-Dive Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          {/* Card Banner */}
          <div className="bg-linear-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-6 sm:p-8 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-amber-400 text-stone-900 font-extrabold text-xs tracking-wider uppercase">
                  {selectedRegion.districts.length} Districts Included
                </span>
                <h3 className="text-2xl sm:text-4xl font-black mt-2 text-white">
                  {selectedRegion.name}
                </h3>
                <p className="font-kannada text-lg sm:text-xl text-amber-300 font-bold mt-1">
                  {selectedRegion.kannadaName}
                </p>
                <p className="text-stone-300 mt-2 text-sm sm:text-base max-w-3xl italic">
                  "{selectedRegion.tagline}"
                </p>
              </div>

              {onSelectRegionForMatrix && (
                <button
                  onClick={() => onSelectRegionForMatrix(selectedRegion.id)}
                  className="self-start md:self-center px-4 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-sm hover:bg-amber-400 active:scale-95 transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  View in Cross-Dialect Matrix →
                </button>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Details & Signature Phrases */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Linguistic Profile & Overview
                </h4>
                <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
                  {selectedRegion.description}
                </p>
              </div>

              {/* Signature Audio Phrases */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Signature Expressions (Click to Listen)
                  </h4>
                  <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" />
                    Web Audio Synthesis
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedRegion.signaturePhrases.map((phrase, idx) => {
                    const isPlaying = playingPhraseIndex === idx;
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all ${
                          isPlaying 
                            ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-300/50' 
                            : 'bg-stone-50 border-stone-200 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="font-kannada font-bold text-lg sm:text-xl text-stone-900">
                              {phrase.kannada}
                            </div>
                            <div className="text-sm font-semibold text-red-800">
                              {phrase.transliteration}
                            </div>
                            <div className="text-xs text-stone-600">
                              Meaning: <span className="text-stone-800 font-medium">"{phrase.meaning}"</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handlePlayAudio(phrase.kannada, phrase.transliteration, idx)}
                            className={`p-3 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                              isPlaying
                                ? 'bg-amber-500 text-stone-950 animate-pulse scale-105'
                                : 'bg-white text-stone-700 hover:bg-amber-100 hover:text-amber-800 border border-stone-300'
                            }`}
                            title="Play pronunciation audio"
                          >
                            <Volume2 className={`w-5 h-5 ${isPlaying ? 'text-stone-950' : 'text-amber-600'}`} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cultural Highlights */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Cultural & Heritage Significance</span>
                </div>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                  {selectedRegion.culturalHighlights}
                </p>
              </div>
            </div>

            {/* Right Col: Dialect Anatomy & Districts */}
            <div className="space-y-6">
              {/* Dialect Features Panel */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Linguistic Cadence & Grammar</span>
                </h4>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-stone-500 font-medium block">Rhythm & Cadence:</span>
                    <span className="font-bold text-stone-800">{selectedRegion.dialectFeatures.cadence}</span>
                  </div>

                  <div>
                    <span className="text-stone-500 font-medium block">Pronoun Nuances:</span>
                    <span className="font-mono text-stone-800 bg-white px-2 py-1 rounded-md border border-stone-200 inline-block mt-0.5">
                      {selectedRegion.dialectFeatures.pronouns}
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-500 font-medium block">Notable Suffixes & Tags:</span>
                    <span className="font-mono text-stone-800 bg-white px-2 py-1 rounded-md border border-stone-200 inline-block mt-0.5">
                      {selectedRegion.dialectFeatures.notableSuffixes}
                    </span>
                  </div>
                </div>
              </div>

              {/* Districts Tag List */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 mb-3">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>Districts in this Zone</span>
                </h4>

                <div className="flex flex-wrap gap-1.5">
                  {selectedRegion.districts.map((district) => (
                    <span
                      key={district}
                      className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 text-stone-800 text-xs font-semibold shadow-2xs"
                    >
                      {district}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Characteristics Checklist */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Distinctive Dialect Traits
                </h4>
                <ul className="space-y-2">
                  {selectedRegion.characteristics.map((char, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
