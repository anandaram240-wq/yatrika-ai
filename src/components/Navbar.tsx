import React from 'react';
import { Compass, Sparkles, Map, Volume2, Utensils, BookOpen, Wand2 } from 'lucide-react';

export type MainNavTab = 'planner' | 'itinerary' | 'map' | 'phrases' | 'food' | 'explore';
export type ActiveTab = MainNavTab | 'matrix' | 'glossary' | 'quiz' | 'community' | 'linguistics';

interface NavbarProps {
  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab) => void;
  onOpenQuickPlanner: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickPlanner,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      {/* Top Banner Ribbon - Karnataka Red and Yellow */}
      <div className="h-1.5 w-full bg-linear-to-r from-red-600 via-amber-500 to-amber-400"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Identity */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('planner')}
          >
            <div className="relative w-11 h-11 rounded-2xl bg-linear-to-br from-red-700 to-amber-500 flex items-center justify-center text-white font-kannada font-bold text-2xl shadow-md group-hover:scale-105 transition-transform duration-200">
              ಯಾ
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-stone-900" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-stone-950 group-hover:text-red-700 transition-colors">
                  ಯಾತ್ರಿಕ <span className="text-red-700">AI</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-bold rounded-full bg-red-100 text-red-900 border border-red-300">
                  PS 06 • Travel AI
                </span>
              </div>
              <p className="text-xs text-stone-600 font-medium">
                Intelligent Cultural & Linguistic Travel Planner for Karnataka
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
            <button
              onClick={() => setActiveTab('planner')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'planner'
                  ? 'bg-white text-stone-950 shadow-xs border border-amber-300'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/50'
              }`}
            >
              <Wand2 className="w-4 h-4 text-red-600" />
              <span>AI Trip Planner</span>
            </button>

            <button
              onClick={() => setActiveTab('itinerary')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'itinerary'
                  ? 'bg-white text-stone-950 shadow-xs border border-amber-300'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/50'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Current Itinerary</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-white text-stone-950 shadow-xs border border-amber-300'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/50'
              }`}
            >
              <Map className="w-4 h-4 text-teal-600" />
              <span>Route Map</span>
            </button>

            <button
              onClick={() => setActiveTab('phrases')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'phrases'
                  ? 'bg-white text-stone-950 shadow-xs border border-amber-300'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/50'
              }`}
            >
              <Volume2 className="w-4 h-4 text-indigo-600" />
              <span>Kannada Audio Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('food')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'food'
                  ? 'bg-white text-stone-950 shadow-xs border border-amber-300'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/50'
              }`}
            >
              <Utensils className="w-4 h-4 text-orange-600" />
              <span>Food Trail</span>
            </button>

            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-white text-stone-950 shadow-xs border border-amber-300'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Destinations (20+)</span>
            </button>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenQuickPlanner}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-red-700 to-amber-600 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg hover:from-red-800 hover:to-amber-700 active:scale-95 transition-all cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              <span>Plan Trip Now</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="lg:hidden flex items-center justify-between py-2 border-t border-amber-100 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === 'planner' ? 'bg-red-700 text-white' : 'text-stone-700 bg-stone-100'
            }`}
          >
            ✨ Planner
          </button>
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === 'itinerary' ? 'bg-red-700 text-white' : 'text-stone-700 bg-stone-100'
            }`}
          >
            🧭 Itinerary
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === 'map' ? 'bg-red-700 text-white' : 'text-stone-700 bg-stone-100'
            }`}
          >
            🗺️ Map
          </button>
          <button
            onClick={() => setActiveTab('phrases')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === 'phrases' ? 'bg-red-700 text-white' : 'text-stone-700 bg-stone-100'
            }`}
          >
            🔊 Kannada Voice
          </button>
          <button
            onClick={() => setActiveTab('food')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === 'food' ? 'bg-red-700 text-white' : 'text-stone-700 bg-stone-100'
            }`}
          >
            🍛 Food
          </button>
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              activeTab === 'explore' ? 'bg-red-700 text-white' : 'text-stone-700 bg-stone-100'
            }`}
          >
            🏛️ Places
          </button>
        </div>
      </div>
    </header>
  );
};
