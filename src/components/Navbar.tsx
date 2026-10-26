import React from 'react';
import { Compass, BookOpen, Layers, Award, PlusCircle, Sparkles, MapPin } from 'lucide-react';

export type ActiveTab = 'map' | 'matrix' | 'glossary' | 'quiz' | 'community';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenContributeModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenContributeModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      {/* Top Banner Ribbon - Karnataka Flag Colors */}
      <div className="h-1.5 w-full bg-linear-to-r from-red-600 via-amber-500 to-amber-400"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Identity */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('map')}
          >
            <div className="relative w-11 h-11 rounded-2xl bg-linear-to-br from-red-600 to-amber-500 flex items-center justify-center text-white font-kannada font-bold text-2xl shadow-md group-hover:scale-105 transition-transform duration-200">
              ಕ
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-stone-900" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-stone-900 group-hover:text-red-700 transition-colors">
                  ನಮ್ಮ ಕನ್ನಡ
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Regional Atlas
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Source-Grounded Regional Language Explorer
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1.5 rounded-2xl border border-stone-200/80">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'map'
                  ? 'bg-white text-stone-900 shadow-xs border border-amber-200/60 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Dialect Map</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'matrix'
                  ? 'bg-white text-stone-900 shadow-xs border border-amber-200/60 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Layers className="w-4 h-4 text-red-600" />
              <span>Comparative Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('glossary')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'glossary'
                  ? 'bg-white text-stone-900 shadow-xs border border-amber-200/60 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Slang & Idioms</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'quiz'
                  ? 'bg-white text-stone-900 shadow-xs border border-amber-200/60 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Phrase Quiz</span>
            </button>

            <button
              onClick={() => setActiveTab('community')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'community'
                  ? 'bg-white text-stone-900 shadow-xs border border-amber-200/60 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <MapPin className="w-4 h-4 text-purple-600" />
              <span>Community Vault</span>
            </button>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenContributeModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-linear-to-r from-red-600 to-amber-600 text-white text-sm font-bold shadow-md hover:shadow-lg hover:from-red-700 hover:to-amber-700 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Draft Local Entry</span>
              <span className="sm:hidden">Contribute</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-amber-100 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'map' ? 'bg-amber-500 text-white' : 'text-stone-600 bg-stone-100'
            }`}
          >
            🗺️ Map
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'matrix' ? 'bg-amber-500 text-white' : 'text-stone-600 bg-stone-100'
            }`}
          >
            🔄 Matrix
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'glossary' ? 'bg-amber-500 text-white' : 'text-stone-600 bg-stone-100'
            }`}
          >
            📖 Glossary
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'quiz' ? 'bg-amber-500 text-white' : 'text-stone-600 bg-stone-100'
            }`}
          >
            🎯 Quiz
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'community' ? 'bg-amber-500 text-white' : 'text-stone-600 bg-stone-100'
            }`}
          >
            ✍️ Vault
          </button>
        </div>
      </div>
    </header>
  );
};
