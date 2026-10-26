import React from 'react';
import { Sparkles, Compass, ArrowRight, Wand2 } from 'lucide-react';
import { TripInputs } from '../types';

interface HeroSectionProps {
  onSelectPreset: (preset: TripInputs) => void;
  onOpenCustomWizard: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectPreset,
  onOpenCustomWizard,
}) => {
  return (
    <div className="relative overflow-hidden bg-amber-50/70 border-b border-amber-200 py-8 sm:py-12">
      {/* Decorative Kannada Glyphs in Background */}
      <div 
        className="absolute top-1 right-6 text-amber-200/50 font-kannada font-black text-8xl sm:text-9xl select-none pointer-events-none"
        aria-hidden="true"
      >
        ಕರ್ನಾಟಕ
      </div>
      <div 
        className="absolute -bottom-6 left-8 text-red-200/40 font-kannada font-black text-7xl sm:text-8xl select-none pointer-events-none"
        aria-hidden="true"
      >
        ಯಾತ್ರಿಕ
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Hackathon Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 border border-red-300 text-red-900 text-xs font-black uppercase tracking-wider mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Problem Statement 06 • AI Travel Planner for Karnataka</span>
          </div>

          {/* Main Title */}
          <h1 
            className="text-3xl sm:text-5xl font-black text-stone-950 tracking-tight leading-tight"
            style={{ color: '#0c0a09' }}
          >
            Explore Karnataka with <br className="hidden sm:inline" />
            <span className="text-red-700 underline decoration-amber-500 decoration-4 underline-offset-4">
              ಯಾತ್ರಿಕ AI (YatriKa)
            </span>{' '}
            & Native Kannada Voice
          </h1>

          <p 
            className="mt-4 text-sm sm:text-base text-stone-800 leading-relaxed font-medium max-w-2xl mx-auto"
            style={{ color: '#292524' }}
          >
            Generate realistic day-by-day itineraries tailored to your budget and travel vibe — complete with <strong>verified entry fees</strong>, <strong>realistic driving times</strong>, <strong>regional food trails</strong>, and <strong>essential Kannada audio phrases</strong> for every stop.
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenCustomWizard}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-linear-to-r from-red-700 to-amber-600 text-white font-black text-sm sm:text-base shadow-lg hover:shadow-xl hover:from-red-800 hover:to-amber-700 active:scale-95 transition-all cursor-pointer"
            >
              <Wand2 className="w-5 h-5" />
              <span>Customize Your Own Trip (5 Steps)</span>
            </button>

            <a
              href="#instant-presets-section"
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white border border-stone-300 text-stone-900 font-bold hover:bg-stone-50 active:scale-95 shadow-xs transition-all text-sm cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Try 1-Click Popular Routes ↓</span>
            </a>
          </div>

          {/* 1-Click Preset Trip Cards */}
          <div id="instant-presets-section" className="mt-10 pt-6 border-t border-amber-200/80">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              <span className="text-xs uppercase font-extrabold tracking-wider text-stone-600">
                ⚡ Instant Demo: Choose a Pre-Configured Karnataka Circuit
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              {/* Preset 1 */}
              <div
                onClick={() => onSelectPreset({
                  startingCity: 'bengaluru',
                  vibe: 'balanced',
                  durationDays: 3,
                  budgetTier: 'comfort',
                  travelStyle: 'couple',
                })}
                className="group bg-white p-4 rounded-2xl border-2 border-stone-200 hover:border-red-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-2xs font-extrabold text-amber-700">
                    <span>👑 ROYAL & COFFEE</span>
                    <span className="bg-amber-100 px-2 py-0.5 rounded-full text-amber-900">3 Days</span>
                  </div>
                  <h4 className="font-extrabold text-stone-950 text-sm mt-1 group-hover:text-red-700 transition-colors">
                    Mysuru & Coorg Hills
                  </h4>
                  <p className="text-2xs text-stone-600 mt-1 line-clamp-2">
                    Amba Vilas Palace, Abbey Falls, Raja’s Seat, and authentic Kodava Pandi Curry.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-2xs font-bold text-red-700">
                  <span>View Itinerary</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Preset 2 */}
              <div
                onClick={() => onSelectPreset({
                  startingCity: 'mangaluru',
                  vibe: 'coastal',
                  durationDays: 3,
                  budgetTier: 'comfort',
                  travelStyle: 'friends',
                })}
                className="group bg-white p-4 rounded-2xl border-2 border-stone-200 hover:border-teal-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-2xs font-extrabold text-teal-700">
                    <span>🏖️ BEACH & CLIFFS</span>
                    <span className="bg-teal-100 px-2 py-0.5 rounded-full text-teal-900">3 Days</span>
                  </div>
                  <h4 className="font-extrabold text-stone-950 text-sm mt-1 group-hover:text-teal-700 transition-colors">
                    Karavali Coastal Circuit
                  </h4>
                  <p className="text-2xs text-stone-600 mt-1 line-clamp-2">
                    Udupi Krishna Matha, Malpe St. Mary’s, Murudeshwara Shiva, and Om Beach.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-2xs font-bold text-teal-700">
                  <span>View Itinerary</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Preset 3 */}
              <div
                onClick={() => onSelectPreset({
                  startingCity: 'bengaluru',
                  vibe: 'heritage',
                  durationDays: 3,
                  budgetTier: 'backpacker',
                  travelStyle: 'solo',
                })}
                className="group bg-white p-4 rounded-2xl border-2 border-stone-200 hover:border-purple-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-2xs font-extrabold text-purple-700">
                    <span>🏛️ UNESCO HERITAGE</span>
                    <span className="bg-purple-100 px-2 py-0.5 rounded-full text-purple-900">3 Days</span>
                  </div>
                  <h4 className="font-extrabold text-stone-950 text-sm mt-1 group-hover:text-purple-700 transition-colors">
                    Hampi & Badami Trail
                  </h4>
                  <p className="text-2xs text-stone-600 mt-1 line-clamp-2">
                    Stone Chariot, Tungabhadra coracle ride, red sandstone caves, and Jolada Rotti.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-2xs font-bold text-purple-700">
                  <span>View Itinerary</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* 4 Metrics Strip */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto text-left">
            <div className="bg-white p-3 rounded-xl border border-stone-300 shadow-2xs">
              <div className="text-xl sm:text-2xl font-black text-red-700">20+</div>
              <div className="text-xs text-stone-900 font-bold">Verified Places</div>
              <div className="text-3xs text-stone-500">Real ASI & KSTDC fees</div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-300 shadow-2xs">
              <div className="text-xl sm:text-2xl font-black text-amber-600">50+</div>
              <div className="text-xs text-stone-900 font-bold">Kannada Phrases</div>
              <div className="text-3xs text-stone-500">With real-time audio</div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-300 shadow-2xs">
              <div className="text-xl sm:text-2xl font-black text-teal-700">Sub-50ms</div>
              <div className="text-xs text-stone-900 font-bold">Zero API Delay</div>
              <div className="text-3xs text-stone-500">100% Offline Reliable</div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-300 shadow-2xs">
              <div className="text-xl sm:text-2xl font-black text-purple-700">6 Zones</div>
              <div className="text-xs text-stone-900 font-bold">Food & Culture</div>
              <div className="text-3xs text-stone-500">Karnataka Wide</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
