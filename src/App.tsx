import { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { Hero } from './components/Hero';
import { DialectMap } from './components/DialectMap';
import { PhraseMatrix } from './components/PhraseMatrix';
import { SlangGlossary } from './components/SlangGlossary';
import { DialectGuesser } from './components/DialectGuesser';
import { CommunityVault } from './components/CommunityVault';
import { ContributeModal } from './components/ContributeModal';
import { VoicePracticeModal } from './components/VoicePracticeModal';
import { Footer } from './components/Footer';
import { CommunityContribution, GlossaryWord, RegionId } from './types';

// Initial sample community contributions
const INITIAL_CONTRIBUTIONS: CommunityContribution[] = [
  {
    id: 'c1',
    wordKannada: 'ಯಕ್ಕಾ',
    wordTransliteration: 'Yakka',
    meaning: 'Elder sister or affectionate exclamation when addressing friends.',
    regionId: 'uttara-karnataka',
    district: 'Hubballi',
    usageExample: 'ಯಕ್ಕಾ, ಸ್ವಲ್ಪ ಈ ಕಡೆ ಬಂದು ನೋಡು!',
    contributorName: 'Basavaraj Patil',
    timestamp: '2 hours ago',
    upvotes: 18,
  },
  {
    id: 'c2',
    wordKannada: 'ಕುಸುಂಬೆರೆ',
    wordTransliteration: 'Kusumbere',
    meaning: 'Vegetable salad / Kosambari or general coastal meal accompaniment.',
    regionId: 'karavali',
    district: 'Kundapura',
    usageExample: 'ಇವತ್ತು ಊಟಕ್ಕೆ ಎಂತ ಕುಸುಂಬೆರೆ ಮಾಡ್ದೀರಿ ಮಾರ್ರೆ?',
    contributorName: 'Sujatha Hegde',
    timestamp: 'Yesterday',
    upvotes: 24,
  },
  {
    id: 'c3',
    wordKannada: 'ಏನ್ ಸಮಚಾರ',
    wordTransliteration: 'En Samachara',
    meaning: 'What is the news / What\'s happening in town?',
    regionId: 'mysuru-mandya',
    district: 'Mandya',
    usageExample: 'ಬನ್ನಿ ಸ್ವಾಮಿ, ಊರಲ್ಲಿ ಏನ್ ಹೊಸ ಸಮಚಾರ?',
    contributorName: 'Chetan Gowda',
    timestamp: '3 days ago',
    upvotes: 31,
  },
];

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [matrixInitialRegion, setMatrixInitialRegion] = useState<RegionId | undefined>(undefined);

  // Voice practice modal state
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [voicePhrase, setVoicePhrase] = useState({
    kannada: '',
    transliteration: '',
    meaning: '',
  });

  // Community contributions stored in localStorage
  const [contributions, setContributions] = useState<CommunityContribution[]>(() => {
    try {
      const saved = localStorage.getItem('namma_kannada_contributions');
      return saved ? JSON.parse(saved) : INITIAL_CONTRIBUTIONS;
    } catch {
      return INITIAL_CONTRIBUTIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('namma_kannada_contributions', JSON.stringify(contributions));
    } catch (e) {
      console.error(e);
    }
  }, [contributions]);

  const handleAddContribution = (newEntry: CommunityContribution) => {
    setContributions(prev => [newEntry, ...prev]);
  };

  const handleUpvoteContribution = (id: string) => {
    setContributions(prev =>
      prev.map(c => (c.id === id ? { ...c, upvotes: c.upvotes + 1 } : c))
    );
  };

  const handleSelectRegionForMatrix = (regionId: RegionId) => {
    setMatrixInitialRegion(regionId);
    setActiveTab('matrix');
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleOpenVoicePractice = (kannada: string, transliteration: string, meaning: string) => {
    setVoicePhrase({ kannada, transliteration, meaning });
    setVoiceModalOpen(true);
  };

  // Convert community contributions into glossary items
  const communityGlossaryWords: GlossaryWord[] = contributions.map(c => ({
    id: c.id,
    wordKannada: c.wordKannada,
    wordEnglish: c.wordTransliteration,
    regionId: c.regionId,
    meaning: c.meaning,
    usageKannada: c.usageExample || c.wordKannada,
    usageTransliteration: c.wordTransliteration,
    usageEnglish: c.meaning,
    culturalOrigin: `Documented by community contributor ${c.contributorName} from ${c.district}.`,
    tags: ['Community', c.district],
    isCommunityContributed: true,
    upvotes: c.upvotes,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-stone-900 selection:bg-amber-300">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenContributeModal={() => setIsContributeModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="grow">
        {/* Hero Section */}
        <Hero setActiveTab={setActiveTab} />

        {/* Tab Content Panels */}
        <div className="transition-all duration-300">
          {activeTab === 'map' && (
            <DialectMap onSelectRegionForMatrix={handleSelectRegionForMatrix} />
          )}

          {activeTab === 'matrix' && (
            <PhraseMatrix
              initialRegionId={matrixInitialRegion}
              onOpenVoicePractice={handleOpenVoicePractice}
            />
          )}

          {activeTab === 'glossary' && (
            <SlangGlossary customWords={communityGlossaryWords} />
          )}

          {activeTab === 'quiz' && <DialectGuesser />}

          {activeTab === 'community' && (
            <CommunityVault
              contributions={contributions}
              onOpenContributeModal={() => setIsContributeModalOpen(true)}
              onUpvoteContribution={handleUpvoteContribution}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Contribution Modal */}
      <ContributeModal
        isOpen={isContributeModalOpen}
        onClose={() => setIsContributeModalOpen(false)}
        onAddContribution={handleAddContribution}
      />

      {/* Voice Practice Modal */}
      <VoicePracticeModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        kannadaPhrase={voicePhrase.kannada}
        transliteration={voicePhrase.transliteration}
        meaning={voicePhrase.meaning}
      />
    </div>
  );
}

export default App;
