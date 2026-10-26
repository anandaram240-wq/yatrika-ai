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
import { PhonologicalRuleSandbox } from './components/PhonologicalRuleSandbox';
import { DiachronicTimeMachine } from './components/DiachronicTimeMachine';
import { DialectometryMatrixView } from './components/DialectometryMatrixView';
import { DpiExporterModal } from './components/DpiExporterModal';
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
    license_status: 'approved_for_planned_use',
    timestamp: '2 hours ago',
    status: 'contributor_pending',
    evidence_status: 'contributor_pending',
    evidence_level: 'E4',
    localNotes: 'Unreviewed local observation draft',
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
    license_status: 'approved_for_planned_use',
    timestamp: 'Yesterday',
    status: 'contributor_pending',
    evidence_status: 'contributor_pending',
    evidence_level: 'E4',
    localNotes: 'Unreviewed local observation draft',
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
    license_status: 'approved_for_planned_use',
    timestamp: '3 days ago',
    status: 'contributor_pending',
    evidence_status: 'contributor_pending',
    evidence_level: 'E4',
    localNotes: 'Unreviewed local observation draft',
  },
];

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [isDpiModalOpen, setIsDpiModalOpen] = useState(false);
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
    evidence_status: 'contributor_pending',
    evidence_level: 'E4',
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
        onOpenDpiModal={() => setIsDpiModalOpen(true)}
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
              onOpenContributeModal={() => setIsContributeModalOpen(true)}
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

          {activeTab === 'linguistics' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
              <div className="text-center max-w-3xl mx-auto mb-8">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-900 border border-red-300">
                  Computational Dravidian Linguistics & DPI Lab
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2 tracking-tight">
                  Formal Phonology, Diachrony & Dialectometry
                </h2>
                <p className="text-sm text-stone-600 mt-2">
                  Advancements 5 through 8: Grounded in peer-reviewed Dravidian linguistics (Bright 1958, Schiffman 1983, Upadhyaya 1976, Shankara Bhat 2001, and Kēśirāja’s 13th-century Śabdamaṇidarpaṇa).
                </p>
                <div className="mt-4 flex justify-center gap-3">
                  <button
                    onClick={() => setIsDpiModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors flex items-center gap-2"
                  >
                    <span>Download GoK PadaKanaja & Glottolog CLDF Datasets</span>
                  </button>
                </div>
              </div>

              {/* Advancement 5: Generative Phonology */}
              <PhonologicalRuleSandbox />

              {/* Advancement 6: Diachronic Time Machine */}
              <DiachronicTimeMachine />

              {/* Advancement 7: Dialectometry Matrix */}
              <DialectometryMatrixView />
            </div>
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

      {/* DPI & CLDF Exporter Modal */}
      <DpiExporterModal
        isOpen={isDpiModalOpen}
        onClose={() => setIsDpiModalOpen(false)}
      />
    </div>
  );
}

export default App;
