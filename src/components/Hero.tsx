import React from 'react';
import { Compass, Sparkles, Volume2, ShieldCheck, ArrowRight } from 'lucide-react';
import { ActiveTab } from './Navbar';

interface HeroProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab }) => {
  return (
    <div className="relative overflow-hidden bg-linear-to-b from-amber-100/70 via-amber-50/40 to-transparent pt-10 pb-12 border-b border-amber-200/60">
      {/* Decorative Kannada Glyphs in Background */}
      <div className="absolute top-2 right-8 text-amber-200/40 font-kannada font-black text-9xl select-none pointer-events-none">
        ಕರ್ನಾಟಕ
      </div>
      <div className="absolute -bottom-6 left-12 text-red-200/30 font-kannada font-black text-8xl select-none pointer-events-none">
        ಕನ್ನಡ
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-linear-to-r from-red-600/10 to-amber-600/10 border border-red-300 text-red-800 text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>HackerRank Campus Crew • NIE Mysuru Hackathon 2026</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-tight">
            Explore the Regional Varieties of <br className="hidden sm:inline" />
            <span className="bg-linear-to-r from-red-600 via-amber-600 to-amber-500 bg-clip-text text-transparent">
              Namma Kannada
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
            From the crisp tempo of <strong>Dharwad</strong>, the coastal oceanic cadence of <strong>Kundapura & Karavali</strong>, the royal courtliness of <strong>Mysuru</strong>, to the contemporary code-mixing of <strong>Bengaluru</strong> — discover and compare documented regional phrases with authentic linguistic citations.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('matrix')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-linear-to-r from-red-600 to-amber-600 text-white font-bold shadow-lg hover:shadow-xl hover:from-red-700 hover:to-amber-700 active:scale-95 transition-all text-sm sm:text-base cursor-pointer"
            >
              <span>Explore Comparative Matrix</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-stone-300 text-stone-800 font-bold hover:bg-stone-50 active:scale-95 shadow-xs transition-all text-sm sm:text-base cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Take Phrase Knowledge Quiz</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-amber-200/80 shadow-xs text-center">
              <div className="text-2xl sm:text-3xl font-black text-red-700">6</div>
              <div className="text-xs text-stone-600 font-semibold mt-1">Exploration Zones</div>
              <div className="text-3xs text-stone-400 mt-0.5">Educational Taxonomy</div>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-amber-200/80 shadow-xs text-center">
              <div className="text-2xl sm:text-3xl font-black text-amber-600">30+</div>
              <div className="text-xs text-stone-600 font-semibold mt-1">Source-Attested Entries</div>
              <div className="text-3xs text-stone-400 mt-0.5">Grounded in Literature</div>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-amber-200/80 shadow-xs text-center">
              <div className="text-2xl sm:text-3xl font-black text-teal-700 flex items-center justify-center gap-1">
                <Volume2 className="w-5 h-5 text-teal-600" />
                <span>Synthetic</span>
              </div>
              <div className="text-xs text-stone-600 font-semibold mt-1">Web Speech Synthesis</div>
              <div className="text-3xs text-stone-400 mt-0.5">Phonetic Audio Guide</div>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-amber-200/80 shadow-xs text-center">
              <div className="text-2xl sm:text-3xl font-black text-indigo-700 flex items-center justify-center gap-1">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span>Verified</span>
              </div>
              <div className="text-xs text-stone-600 font-semibold mt-1">Structured Provenance</div>
              <div className="text-3xs text-stone-400 mt-0.5">CIIL / Kittel / Parishat</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
