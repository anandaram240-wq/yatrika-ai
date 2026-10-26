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

// Initial sample community drafts stored locally
const INITIAL_LOCAL_DRAFTS: CommunityContribution[] = [
  {
    id: 'c1',
    wordKannada: 'ಯಕ್ಕಾ',
    wordTransliteration: 'Yakka',
    meaning: 'Elder sister or affectionate exclamation when addressing close friends.',
    regionId: 'uttara-karnataka',
    district: 'Hubballi',
    usageExample: 'ಯಕ್ಕಾ, ಸ್ವಲ್ಪ ಈ ಕಡೆ ಬಂದು ನೋಡು!',
    contributorName: 'Basavaraj Patil',
    attributionPreference: 'real-name',
    licenseConsent: true,
    timestamp: '2 hours ago',
    status: 'contributor-submitted',
    localNotes: 'Documented Hubli colloquialism',
  },
  {
    id: 'c2',
    wordKannada: 'ಕುಸುಂಬೆರೆ',
    wordTransliteration: 'Kusumbere',
    meaning: 'Vegetable salad / seasoned pulse side dish (Coastal variant of Kosambari).',
    regionId: 'karavali',
    district: 'Kundapura',
    usageExample: 'ಇವತ್ತು ಊಟಕ್ಕೆ ಎಂತ ಕುಸುಂಬೆರೆ ಮಾಡ್ದೀರಿ ಮಾರ್ರೆ?',
    contributorName: 'Sujatha Hegde',
    attributionPreference: 'real-name',
    licenseConsent: true,
    timestamp: 'Yesterday',
    status: 'contributor-submitted',
    localNotes: 'Documented Kundapura domestic usage',
  },
  {
    id: 'c3',
    wordKannada: 'ಏನ್ ಸಮಚಾರ',
    wordTransliteration: 'En Samachara',
    meaning: 'What is the news / What is happening in your area?',
    regionId: 'mysuru-mandya',
    district: 'Mandya',
    usageExample: 'ಬನ್ನಿ ಸ್ವಾಮಿ, ಊರಲ್ಲಿ ಏನ್ ಹೊಸ ಸಮಚಾರ?',
    contributorName: 'Chetan Gowda',
    attributionPreference: 'pseudonym',
    licenseConsent: true,
    timestamp: '3 days ago',
    status: 'contributor-submitted',
    localNotes: 'Documented Mandya street discourse',
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

  // Local contributions stored in browser localStorage
  const [contributions, setContributions] = useState<CommunityContribution[]>(() => {
    try {
      const saved = localStorage.getItem('namma_kannada_contributions');
      return saved ? JSON.parse(saved) : INITIAL_LOCAL_DRAFTS;
    } catch {
      return INITIAL_LOCAL_DRAFTS;
    }
  });

  // Local bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('namma_kannada_vault_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('namma_kannada_contributions', JSON.stringify(contributions));
    } catch (e) {
      console.error(e);
    }
  }, [contributions]);

  useEffect(() => {
    try {
      localStorage.setItem('namma_kannada_vault_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedIds]);

  const handleAddContribution = (newEntry: CommunityContribution) => {
    setContributions(prev => [newEntry, ...prev]);
  };

  const handleBookmarkContribution = (id: string) => {
    setBookmarkedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleResetLocalData = () => {
    if (window.confirm('Reset local community drafts to default verified sample entries? Any newly created drafts on this device will be cleared.')) {
      localStorage.removeItem('namma_kannada_contributions');
      localStorage.removeItem('namma_kannada_vault_bookmarks');
      setContributions(INITIAL_LOCAL_DRAFTS);
      setBookmarkedIds([]);
    }
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

  // Convert local community drafts into glossary items with transparent status
  const communityGlossaryWords: GlossaryWord[] = contributions.map(c => ({
    id: c.id,
    wordKannada: c.wordKannada,
    wordEnglish: c.wordTransliteration,
    regionId: c.regionId,
    locality: c.district,
    meaning: c.meaning,
    usageKannada: c.usageExample || c.wordKannada,
    usageTransliteration: c.wordTransliteration,
    usageEnglish: c.meaning,
    culturalOrigin: `Documented by contributor ${c.contributorName} (${c.attributionPreference}) from ${c.district}.`,
    tags: ['Community Draft', c.district],
    status: c.status,
    source: {
      title: `Community Field Submission (${c.district})`,
      authorOrInstitution: c.contributorName,
      year: '2026',
      license: 'CC-BY-4.0',
    },
    isCommunityContributed: true,
    attributionPreference: c.attributionPreference,
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
              onBookmarkContribution={handleBookmarkContribution}
              onResetLocalData={handleResetLocalData}
              bookmarkedIds={bookmarkedIds}
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
