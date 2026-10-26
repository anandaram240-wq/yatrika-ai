import React from 'react';
import { Sparkles, ArrowDown, Layers, Award } from 'lucide-react';
import { ActiveTab } from './Navbar';

interface HeroProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab }) => {
  return (
    <div className="relative overflow-hidden bg-amber-50 border-b border-amber-200 py-6 sm:py-8 shadow-xs">
      {/* Decorative Kannada Glyphs in Background */}
      <div 
        className="absolute top-1 right-6 text-amber-200/50 font-kannada font-black text-7xl sm:text-9xl select-none pointer-events-none"
        aria-hidden="true"
      >
        ಕರ್ನಾಟಕ
      </div>
      <div 
        className="absolute -bottom-4 left-6 text-red-200/40 font-kannada font-black text-6xl sm:text-8xl select-none pointer-events-none"
        aria-hidden="true"
      >
        ಕನ್ನಡ
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Hackathon Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-900 text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Kannada Digital Innovation Hackathon 2026 • Problem 04</span>
          </div>

          {/* Main Title - High Contrast */}
          <h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-950 tracking-tight leading-tight"
            style={{ color: '#0c0a09' }}
          >
            Explore the Regional Varieties of{' '}
            <span className="text-red-700 underline decoration-amber-500 decoration-4 underline-offset-4">
              ನಮ್ಮ ಕನ್ನಡ (Namma Kannada)
            </span>
          </h1>

          <p 
            className="mt-3 text-sm sm:text-base text-stone-800 leading-relaxed font-medium max-w-2xl mx-auto"
            style={{ color: '#292524' }}
          >
            From the crisp tempo of <strong>Dharwad & Kittur</strong>, the coastal cadence of <strong>Kundapura & Karavali</strong>, to the royal courtliness of <strong>Mysuru</strong> and the cosmopolitan energy of <strong>Bengaluru</strong> — discover how Kannada sounds and transforms across Karnataka!
          </p>

          {/* Quick Action Navigation Bar */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            <a
              href="#karnataka-map-section"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold shadow-md active:scale-95 transition-all text-xs sm:text-sm cursor-pointer"
            >
              <ArrowDown className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>Explore Interactive Map Below</span>
            </a>

            <button
              onClick={() => setActiveTab('matrix')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 font-bold hover:bg-stone-50 active:scale-95 shadow-xs transition-all text-xs sm:text-sm cursor-pointer"
            >
              <Layers className="w-4 h-4 text-red-600" />
              <span>Cross-Dialect Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 font-bold hover:bg-stone-50 active:scale-95 shadow-xs transition-all text-xs sm:text-sm cursor-pointer"
            >
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Dialect Quiz</span>
            </button>
          </div>

          {/* Clean 4-Metric Strip */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto text-left">
            <div className="bg-white p-2.5 rounded-xl border border-stone-300 shadow-2xs">
              <div className="text-xl sm:text-2xl font-black text-red-700">6</div>
              <div className="text-xs text-stone-900 font-bold">Cultural Regions</div>
              <div className="text-3xs text-stone-500">Interactive Map</div>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-stone-300 shadow-2xs">
              <div className="text-xl sm:text-2xl font-black text-amber-600">13</div>
              <div className="text-xs text-stone-900 font-bold">Candidate Phrases</div>
              <div className="text-3xs text-stone-500">5 Everyday Concepts</div>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-stone-300 shadow-2xs">
              <div className="text-xl sm:text-2xl font-black text-teal-700">Audio 🔊</div>
              <div className="text-xs text-stone-900 font-bold">Speech Pronunciation</div>
              <div className="text-3xs text-stone-500">Native Web Voice</div>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-stone-300 shadow-2xs">
              <div className="text-xl sm:text-2xl font-black text-purple-700">100%</div>
              <div className="text-xs text-stone-900 font-bold">Grounded Sources</div>
              <div className="text-3xs text-stone-500">CIIL & Upadhyaya</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};