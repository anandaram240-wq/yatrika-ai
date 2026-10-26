import React from 'react';
import { Heart, Sparkles, MapPin, Code2, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-stone-800">
          {/* Col 1: Brand & Hackathon */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-red-600 to-amber-500 flex items-center justify-center text-white font-kannada font-bold text-2xl shadow-md">
                ಕ
              </div>
              <span className="font-extrabold text-2xl text-white">
                ನಮ್ಮ ಕನ್ನಡ
              </span>
            </div>

            <p className="text-sm text-stone-400 max-w-md leading-relaxed">
              An interactive regional language platform documenting and exploring linguistic nuances, pronunciations, local idioms, and cultural heritage across Karnataka.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-amber-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Built for Kannada Digital Innovation Hackathon 2026</span>
            </div>
          </div>

          {/* Col 2: Hackathon Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
              Event Organizers
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li className="font-semibold text-white">HackerRank Campus Crew</li>
              <li>The National Institute of Engineering (NIE), Mysuru</li>
              <li className="text-xs text-stone-500 mt-2">Problem Statement 04: Regional Language Explorer</li>
            </ul>
          </div>

          {/* Col 3: Technology Highlights */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
              Architecture & Stack
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-amber-500" />
                <span>React 19 & TypeScript</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Tailwind CSS & Lucide Icons</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-500" />
                <span>Web Speech API Synthesis</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Geographic Dialect Engine</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>for Karnataka and the Kannada language. Code. Create. Celebrate Kannada.</span>
          </p>

          <p>
            © 2026 Namma Kannada Explorer. All regional expressions documented for cultural preservation.
          </p>
        </div>
      </div>
    </footer>
  );
};
