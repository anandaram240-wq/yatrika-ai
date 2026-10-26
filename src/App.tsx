import { useState } from 'react';
import { Navbar, MainNavTab } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TripWizard } from './components/TripWizard';
import { GeneratingScreen } from './components/GeneratingScreen';
import { ItineraryDashboard } from './components/ItineraryDashboard';
import { KarnatakaRouteMap } from './components/KarnatakaRouteMap';
import { KannadaPhraseBook } from './components/KannadaPhraseBook';
import { FoodTrailView } from './components/FoodTrailView';
import { DestinationExplorer } from './components/DestinationExplorer';
import { PrintableItineraryModal } from './components/PrintableItineraryModal';
import { Footer } from './components/Footer';
import { TripInputs, GeneratedItinerary, Destination } from './types';
import { generateSmartItinerary } from './utils/itineraryEngine';

// Default initial trip: 3-Day Royal Mysuru & Coorg Hills
const DEFAULT_INITIAL_INPUTS: TripInputs = {
  startingCity: 'bengaluru',
  vibe: 'balanced',
  durationDays: 3,
  budgetTier: 'comfort',
  travelStyle: 'couple',
};

export function App() {
  const [activeTab, setActiveTab] = useState<MainNavTab>('planner');
  const [currentInputs, setCurrentInputs] = useState<TripInputs>(DEFAULT_INITIAL_INPUTS);
  const [itinerary, setItinerary] = useState<GeneratedItinerary>(() => 
    generateSmartItinerary(DEFAULT_INITIAL_INPUTS)
  );
  
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [pendingInputs, setPendingInputs] = useState<TripInputs | null>(null);

  const startTripGeneration = (inputs: TripInputs) => {
    setPendingInputs(inputs);
    setIsWizardOpen(false);
    setIsGenerating(true);
  };

  const handleGenerationComplete = () => {
    if (pendingInputs) {
      setCurrentInputs(pendingInputs);
      const newItinerary = generateSmartItinerary(pendingInputs);
      setItinerary(newItinerary);
      setPendingInputs(null);
    }
    setIsGenerating(false);
    setActiveTab('itinerary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInspectDestinationFromExplorer = (_dest: Destination) => {
    setActiveTab('map');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-stone-900 selection:bg-amber-400 selection:text-stone-950 font-sans">
      {/* 1. TOP NAVBAR */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickPlanner={() => setIsWizardOpen(true)}
      />

      {/* 2. MAIN CONTENT AREA */}
      <main className="grow">
        {/* HERO (Always shown on 'planner' tab) */}
        {activeTab === 'planner' && (
          <>
            <HeroSection
              onSelectPreset={(preset) => startTripGeneration(preset)}
              onOpenCustomWizard={() => setIsWizardOpen(true)}
            />
            {/* Embedded Live Itinerary Preview directly below Hero */}
            <div className="pt-4">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl sm:text-2xl font-black text-stone-950">
                    Active Trip Itinerary Preview
                  </h3>
                  <button
                    onClick={() => setIsWizardOpen(true)}
                    className="text-xs font-bold text-red-700 hover:underline cursor-pointer"
                  >
                    Change Parameters in Wizard →
                  </button>
                </div>
              </div>
              <ItineraryDashboard
                itinerary={itinerary}
                onModifyTrip={() => setIsWizardOpen(true)}
                onOpenPrintModal={() => setIsPrintModalOpen(true)}
                onViewOnMap={() => {
                  setActiveTab('map');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          </>
        )}

        {/* ITINERARY TAB */}
        {activeTab === 'itinerary' && (
          <ItineraryDashboard
            itinerary={itinerary}
            onModifyTrip={() => setIsWizardOpen(true)}
            onOpenPrintModal={() => setIsPrintModalOpen(true)}
            onViewOnMap={() => {
              setActiveTab('map');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* MAP TAB */}
        {activeTab === 'map' && (
          <KarnatakaRouteMap
            itinerary={itinerary}
          />
        )}

        {/* KANNADA PHRASES TAB */}
        {activeTab === 'phrases' && (
          <KannadaPhraseBook />
        )}

        {/* FOOD TRAIL TAB */}
        {activeTab === 'food' && (
          <FoodTrailView />
        )}

        {/* DESTINATIONS EXPLORER TAB */}
        {activeTab === 'explore' && (
          <DestinationExplorer
            onSelectDestination={handleInspectDestinationFromExplorer}
          />
        )}
      </main>

      {/* 3. MODALS */}
      {/* 5-Step Trip Customizer Wizard */}
      <TripWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onGenerate={(inputs) => startTripGeneration(inputs)}
        initialInputs={currentInputs}
      />

      {/* Simulated AI Generation Loader */}
      {isGenerating && (
        <GeneratingScreen
          onComplete={handleGenerationComplete}
        />
      )}

      {/* Print / PDF Export Modal */}
      <PrintableItineraryModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        itinerary={itinerary}
      />

      {/* 4. FOOTER */}
      <Footer />
    </div>
  );
}

export default App;
