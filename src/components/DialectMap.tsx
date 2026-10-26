import React, { useState } from 'react';
import { REGIONS } from '../data/regions';
import { RegionId } from '../types';
import { speechService } from '../utils/speech';
import { KarnatakaMapSvg } from './KarnatakaMapSvg';
import { Volume2, MapPin, Sparkles, Compass, CheckCircle2, BookOpen, AlertCircle, Play, ArrowRight } from 'lucide-react';

interface DialectMapProps {
  onSelectRegionForMatrix?: (regionId: RegionId) => void;
}

// Quick interactive regional slang words for exploration
const REGIONAL_QUICK_WORDS: Record<RegionId, Array<{ kannada: string; transliteration: string; meaning: string }>> = {
  'uttara-karnataka': [
    { kannada: 'ಸಾಹೂಕಾರ್', transliteration: 'Sahookar', meaning: 'Chief / respected person' },
    { kannada: 'ಹೌದ್ಲಾ', transliteration: 'Haudla', meaning: 'Is that so / Really!' },
    { kannada: 'ಯಕ್ಕಾ', transliteration: 'Yakka', meaning: 'Sister / affectionate address' },
    { kannada: 'ಗಡದ್ದಾಗಿ', transliteration: 'Gadaddagi', meaning: 'Heartily / intensely' },
    { kannada: 'ಮಂಡಕ್ಕಿ', transliteration: 'Mandakki', meaning: 'Puffed rice' },
  ],
  'karavali': [
    { kannada: 'ಮಾರ್ರೆ', transliteration: 'Marre', meaning: 'Friend / pal (iconic coastal address)' },
    { kannada: 'ಎಂತ', transliteration: 'Entha', meaning: 'What' },
    { kannada: 'ಕುಸುಂಬೆರೆ', transliteration: 'Kusumbere', meaning: 'Vegetable salad / Kosambari' },
    { kannada: 'ಬೋಳ್ಯಾ', transliteration: 'Boliya', meaning: 'Buddy / close companion' },
    { kannada: 'ಸೌಖ್ಯ ಉಂಟಾ', transliteration: 'Saukhya unta', meaning: 'Is all well?' },
  ],
  'mysuru-mandya': [
    { kannada: 'ಸ್ವಾಮಿ', transliteration: 'Swami', meaning: 'Sir / polite address' },
    { kannada: 'ಅಲ್ವೇ', transliteration: 'Alve', meaning: 'Isn\'t it so?' },
    { kannada: 'ತಿಂಡಿ ಆಯ್ತಾ', transliteration: 'Thindi aaytha', meaning: 'Did you have breakfast?' },
    { kannada: 'ಆರಾಮಾಗಿದ್ದೀರಾ', transliteration: 'Aaramagiddira', meaning: 'Are you doing well?' },
    { kannada: 'ಇರ್ಲಿ ಬಿಡಿ', transliteration: 'Irli bidi', meaning: 'Let it be / no problem' },
  ],
  'kalyana-karnataka': [
    { kannada: 'ಖರೇನ', transliteration: 'Kharena', meaning: 'Is it true? / Really?' },
    { kannada: 'ಹಾಂಗೆ', transliteration: 'Haange', meaning: 'In that way' },
    { kannada: 'ಗಡಬಡ', transliteration: 'Gadabada', meaning: 'Hurry / rush' },
    { kannada: 'ರೊಟ್ಟಿ', transliteration: 'Rotti', meaning: 'Jowar flatbread' },
    { kannada: 'ಏನ್ ವಿಚಾರ', transliteration: 'En vichara', meaning: 'What is the news?' },
  ],
  'bengaluru-urban': [
    { kannada: 'ಮಗಾ', transliteration: 'Maga', meaning: 'Bro / friend (lit. son)' },
    { kannada: 'ಬೇಜಾನ್', transliteration: 'Bejaan', meaning: 'A lot / heavily' },
    { kannada: 'ಸೀನ್ ಇಲ್ಲ', transliteration: 'Scene illa', meaning: 'No worries / no tension' },
    { kannada: 'ಗುರು', transliteration: 'Guru', meaning: 'Dude / friend' },
    { kannada: 'ಹಾಫ್ ಬಾಯ್ಲ್', transliteration: 'Half boil', meaning: 'Fried egg' },
  ],
  'malenadu': [
    { kannada: 'ಕಾಪಿ', transliteration: 'Kaapi', meaning: 'Fresh filter coffee' },
    { kannada: 'ಮನೆ ಕಡೆ', transliteration: 'Mane kade', meaning: 'Towards home' },
    { kannada: 'ಹುಷಾರು', transliteration: 'Hushaaru', meaning: 'Be alert / take care' },
    { kannada: 'ಮಳೆಗಾಲ', transliteration: 'Malegaala', meaning: 'Monsoon season' },
    { kannada: 'ತೊಟ್ಲ', transliteration: 'Thotla', meaning: 'Cradle' },
  ],
};

export const DialectMap: React.FC<DialectMapProps> = ({ onSelectRegionForMatrix }) => {
  const [selectedRegionId, setSelectedRegionId] = useState<RegionId>('uttara-karnataka');
  const [playingPhraseIndex, setPlayingPhraseIndex] = useState<number | null>(null);
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const selectedRegion = REGIONS.find(r => r.id === selectedRegionId) || REGIONS[0];
  const quickWords = REGIONAL_QUICK_WORDS[selectedRegionId] || [];

  const handlePlayAudio = (phraseKannada: string, transliteration: string, index: number) => {
    setPlayingPhraseIndex(index);
    speechService.speak({
      kannadaText: phraseKannada,
      transliteration: transliteration,
      onEnd: () => setPlayingPhraseIndex(null),
      onError: () => setPlayingPhraseIndex(null),
    });
  };

  const handlePlayWord = (wordKannada: string, transliteration: string) => {
    setPlayingWord(wordKannada);
    speechService.speak({
      kannadaText: wordKannada,
      transliteration: transliteration,
      onEnd: () => setPlayingWord(null),
      onError: () => setPlayingWord(null),
    });
  };

  return (
    <section id="karnataka-map-section" className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-100 text-red-900 border border-red-200 text-xs font-bold mb-2">
              <Compass className="w-3.5 h-3.5 text-red-600" />
              <span>Interactive Dialect Map of Karnataka</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-950 tracking-tight" style={{ color: '#0c0a09' }}>
              ಕರ್ನಾಟಕದ ಪ್ರಾದೇಶಿಕ ಕನ್ನಡ ನಕ್ಷೆ
            </h2>
            <p className="text-stone-700 mt-1 max-w-3xl text-sm sm:text-base font-medium">
              Click anywhere on the map or select a zone below to hear how people speak, discover unique local words, and explore authentic citations.
            </p>
          </div>
        </div>

        {/* 1. INTERACTIVE KARNATAKA SVG MAP */}
        <KarnatakaMapSvg
          selectedRegionId={selectedRegionId}
          onSelectRegion={(id) => {
            setSelectedRegionId(id);
          }}
        />

        {/* 2. ACTIVE REGION SHOWCASE SPOTLIGHT */}
        <div className="bg-white rounded-3xl border-2 border-amber-300 shadow-xl overflow-hidden">
          {/* Spotlight Banner Header */}
          <div className="bg-linear-to-r from-stone-950 via-stone-900 to-stone-950 text-white p-5 sm:p-7 relative border-b border-amber-500/40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider">
                    Active Dialect Zone
                  </span>
                  <span className="text-xs text-amber-300 font-semibold">
                    {selectedRegion.districtsAssociated.length} Associated Districts
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black mt-2 text-white flex items-center gap-2">
                  <span>{selectedRegion.name.split(' (')[0]}</span>
                </h3>
                <p className="font-kannada text-lg sm:text-xl text-amber-300 font-extrabold mt-0.5">
                  {selectedRegion.kannadaName}
                </p>
              </div>

              {onSelectRegionForMatrix && (
                <button
                  onClick={() => onSelectRegionForMatrix(selectedRegion.id)}
                  className="self-start md:self-center flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  <span>Compare in Phrase Matrix</span>
                  <ArrowRight className="w-4 h-4 text-stone-950" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Greetings & Slang Spotlight */}
          <div className="p-5 sm:p-8 bg-amber-50/50 border-b border-amber-200/80">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Primary Greeting Box (7 cols) */}
              <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-amber-300 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xs uppercase tracking-wider font-extrabold text-red-800 bg-red-100 px-2.5 py-1 rounded-md">
                      🗣️ Iconic Regional Greeting
                    </span>
                    <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-stone-400" />
                      Tap to Listen
                    </span>
                  </div>

                  {/* Big Kannada Greeting */}
                  <div className="mt-4">
                    <div className="font-kannada text-2xl sm:text-3xl font-black text-stone-950 leading-relaxed">
                      {selectedRegion.signaturePhrases[0]?.kannada || 'ಆರಾಮದೀರಾ?'}
                    </div>
                    <div className="text-sm font-bold text-red-700 mt-1">
                      /{selectedRegion.signaturePhrases[0]?.transliteration}/
                    </div>
                    <div className="text-xs sm:text-sm text-stone-700 mt-1 italic">
                      "{selectedRegion.signaturePhrases[0]?.meaning}"
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <button
                    onClick={() => {
                      const p = selectedRegion.signaturePhrases[0];
                      if (p) handlePlayAudio(p.kannada, p.transliteration, 0);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Listen to Greeting</span>
                  </button>
                  <span className="text-2xs text-stone-500 font-medium">
                    Native Web Voice Synthesis
                  </span>
                </div>
              </div>

              {/* Quick Slang & Local Words Chips (5 cols) */}
              <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-3xs uppercase tracking-wider font-extrabold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md inline-block">
                    ⚡ Iconic Local Vocabulary
                  </span>
                  <p className="text-xs text-stone-600 mt-1">
                    Click any word below to hear how it sounds:
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {quickWords.map((word) => {
                      const isPlaying = playingWord === word.kannada;
                      return (
                        <button
                          key={word.kannada}
                          onClick={() => handlePlayWord(word.kannada, word.transliteration)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isPlaying
                              ? 'bg-amber-500 text-stone-950 border-amber-600 scale-105 shadow-md'
                              : 'bg-stone-50 text-stone-900 border-stone-300 hover:bg-amber-100 hover:border-amber-400'
                          }`}
                          title={`Click to hear "${word.kannada}" (${word.meaning})`}
                        >
                          <span className="font-kannada font-extrabold">{word.kannada}</span>
                          <span className="text-3xs text-stone-500">({word.transliteration})</span>
                          <Volume2 className="w-3 h-3 text-amber-700 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-stone-200 text-2xs text-stone-500">
                  Cadence: <strong className="text-stone-800">{selectedRegion.dialectFeatures.cadenceDescription}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Deep-Dive Linguistic Data Section */}
          <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Details & Signature Phrases */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description & Linguistic Isoglosses */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Linguistic Profile & Regional Characteristics
                </h4>
                <p className="text-stone-800 leading-relaxed text-sm sm:text-base font-normal">
                  {selectedRegion.description}
                </p>
                <div className="mt-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700">
                  <span className="font-bold text-stone-900">Isogloss & Regional Transition: </span>
                  <span>{selectedRegion.isoglossNotes}</span>
                </div>
              </div>

              {/* Signature Audio Phrases with Sources */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Documented Signature Phrases & Citations
                  </h4>
                  <span className="text-3xs text-stone-500 font-medium flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" />
                    Speech Audio Guide
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
                            ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300' 
                            : 'bg-stone-50 border-stone-200 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-kannada font-bold text-lg sm:text-xl text-stone-950">
                                {phrase.kannada}
                              </span>
                              <span className="px-2 py-0.5 rounded-md text-3xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                                {phrase.status}
                              </span>
                            </div>
                            <div className="text-sm font-semibold text-red-800">
                              /{phrase.transliteration}/
                            </div>
                            <div className="text-xs text-stone-700">
                              Meaning: <span className="text-stone-900 font-medium">"{phrase.meaning}"</span>
                            </div>
                            <div className="pt-2 text-2xs text-stone-500 font-mono flex items-center gap-1">
                              <BookOpen className="w-3 h-3 text-stone-400" />
                              <span>Source: {phrase.source.title} ({phrase.source.authorOrInstitution})</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handlePlayAudio(phrase.kannada, phrase.transliteration, idx)}
                            className={`p-3 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                              isPlaying
                                ? 'bg-amber-500 text-stone-950 animate-pulse scale-105'
                                : 'bg-white text-stone-700 hover:bg-amber-100 hover:text-amber-900 border border-stone-300'
                            }`}
                            title="Play synthetic speech guide"
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
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Cultural & Heritage Significance</span>
                </div>
                <p className="text-stone-800 text-xs sm:text-sm leading-relaxed">
                  {selectedRegion.culturalHighlights}
                </p>
              </div>
            </div>

            {/* Right Col: Dialect Anatomy & Districts */}
            <div className="space-y-6">
              {/* Dialect Features Panel */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Phonological & Grammatical Traits</span>
                </h4>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-stone-500 font-medium block">Vocal Cadence Traits:</span>
                    <span className="font-semibold text-stone-900">{selectedRegion.dialectFeatures.cadenceDescription}</span>
                  </div>

                  <div>
                    <span className="text-stone-500 font-medium block">Documented Pronouns:</span>
                    <span className="font-mono text-stone-900 bg-white px-2 py-1 rounded-md border border-stone-200 inline-block mt-0.5">
                      {selectedRegion.dialectFeatures.pronouns}
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-500 font-medium block">Documented Suffixes & Particles:</span>
                    <span className="font-mono text-stone-900 bg-white px-2 py-1 rounded-md border border-stone-200 inline-block mt-0.5">
                      {selectedRegion.dialectFeatures.notableSuffixes}
                    </span>
                  </div>
                </div>
              </div>

              {/* Associated Districts Tag List */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>Associated Districts</span>
                </h4>
                <p className="text-3xs text-stone-500 mb-3">
                  Speakers in these areas frequently share these traits (subject to subregional variation).
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {selectedRegion.districtsAssociated.map((district) => (
                    <span
                      key={district}
                      className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 text-stone-900 text-xs font-semibold shadow-2xs"
                    >
                      {district}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Characteristics Checklist */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
                  Documented Linguistic Features
                </h4>
                <ul className="space-y-2">
                  {selectedRegion.characteristics.map((char, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-stone-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Linguistic Continuum Clarification Alert */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-bold">Linguistic Continuum Notice:</strong>
            <p className="text-stone-700 leading-relaxed">
              In scholarly linguistics (CIIL, LDC-IL), Kannada spoken varieties exist along a continuous geographic gradient (*isoglosses*) with gradual transitions and community sub-dialects (e.g. Havyaka, Arebhashe, Kundagannada, Badaga). The six zones shown above are an educational organization chosen for this interactive atlas, not rigid administrative boundaries.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};