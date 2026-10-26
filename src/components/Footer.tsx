import React from 'react';
import { Compass, Sparkles, MapPin, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-white border-t border-stone-800 mt-16 relative overflow-hidden">
      {/* Top Accent Ribbon */}
      <div className="h-1.5 w-full bg-linear-to-r from-red-600 via-amber-400 to-amber-500"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-red-600 to-amber-500 flex items-center justify-center text-white font-kannada font-bold text-lg shadow-sm">
                ಯಾ
              </div>
              <span className="text-xl font-black text-white">
                ಯಾತ್ರಿಕ <span className="text-red-500">AI</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-md">
              Intelligent Cultural & Linguistic Travel Planner for Karnataka. Engineered for the <strong>Kannada Digital Innovation Hackathon 2026</strong> organized by HackerRank Campus Crew, The National Institute of Engineering (NIE), Mysuru.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800 text-red-300 text-3xs font-extrabold uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Problem Statement 06 • Travel & Tourism</span>
            </div>
          </div>

          {/* Quick Pillars */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-3">
              Platform Innovations
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-300">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span>Deterministic Highway Routing</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Verified ASI & KSTDC Fees</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                <span>Native Kannada Audio Synthesis</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Regional Culinary Trail Mapping</span>
              </li>
            </ul>
          </div>

          {/* Standards & Offline Moat */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-3">
              Technical Moat
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-300">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Offline Reliable (0 API Latency)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-teal-400" />
                <span>Sub-50ms Itinerary Generation</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>React 19 + TypeScript + Tailwind 4</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-6 border-t border-stone-800 text-center text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © 2026 YatriKa AI • Code. Create. Celebrate Kannada.
          </div>
          <div className="font-kannada text-xs text-amber-400 font-bold">
            ಕರ್ನಾಟಕದ ಶ್ರೀಮಂತ ಪರಂಪರೆ ಮತ್ತು ಪ್ರವಾಸೋದ್ಯಮಕ್ಕೆ ಸಮರ್ಪಿತ
          </div>
        </div>
      </div>
    </footer>
  );
};
