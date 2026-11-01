/**
 * src/components/EditorialNavbar.tsx
 * Refined Editorial Navigation Bar for YatriKa AI.
 * Cultural authenticity, clean typography, bilingual branding, and effortless mode switching.
 */

import React from 'react';

export interface EditorialNavbarProps {
  currentView: 'explore' | 'workspace' | 'transit' | 'saved';
  onSelectView: (view: 'explore' | 'workspace' | 'transit' | 'saved') => void;
  uiLanguage: 'kn' | 'en';
  onToggleLanguage: () => void;
  onOpenVoice: () => void;
  onPlanTripCta: () => void;
  stopCount: number;
  totalDistanceKm: number;
  activeCircuitTitle?: string;
  isOnline: boolean;
}

export const EditorialNavbar: React.FC<EditorialNavbarProps> = ({
  currentView,
  onSelectView,
  uiLanguage,
  onToggleLanguage,
  onOpenVoice,
  onPlanTripCta,
  stopCount,
  totalDistanceKm,
  activeCircuitTitle,
  isOnline,
}) => {
  return (
    <nav className="yt-navbar">
      {/* Brand Identity */}
      <div
        className="yt-navbar-brand cursor-pointer"
        onClick={() => onSelectView('explore')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectView('explore');
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="YatriKa Home — Navigate to Discover Journal"
      >
        <div className="yt-brand-monogram font-kannada">ಯಾ</div>
        <div className="yt-brand-text">
          <div className="yt-brand-name">
            <span>YatriKa</span>
            <span className="yt-brand-kannada font-kannada">ಯಾತ್ರಿಕ</span>
          </div>
          <div className="yt-brand-tagline">
            {uiLanguage === 'kn' ? 'ಕರ್ನಾಟಕ ಪ್ರವಾಸ ದಿಕ್ಸೂಚಿ' : 'Karnataka Travel Journal'}
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="yt-navbar-links">
        <button
          type="button"
          className={`yt-nav-link ${currentView === 'explore' ? 'active' : ''}`}
          onClick={() => onSelectView('explore')}
        >
          <span>{uiLanguage === 'kn' ? 'ಅನ್ವೇಷಿಸಿ' : 'Discover'}</span>
        </button>

        <button
          type="button"
          className={`yt-nav-link ${currentView === 'workspace' ? 'active' : ''}`}
          onClick={() => onSelectView('workspace')}
        >
          <span>{uiLanguage === 'kn' ? 'ಪ್ರವಾಸ ಯೋಜನೆ' : 'Trip Workspace'}</span>
          {stopCount > 0 && <span className="yt-nav-badge">{stopCount}</span>}
        </button>

        <button
          type="button"
          className={`yt-nav-link ${currentView === 'transit' ? 'active' : ''}`}
          onClick={() => onSelectView('transit')}
        >
          <span>{uiLanguage === 'kn' ? 'ರೈಲು & ಬಸ್ ಸಂಚಾರ' : 'Transit & Shakti'}</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="yt-navbar-actions">
        {/* Offline indicator if disconnected */}
        {!isOnline && (
          <span className="yt-offline-pill" title="Offline mode: Using verified local cache">
            🛰️ {uiLanguage === 'kn' ? 'ಆಫ್‌ಲೈನ್' : 'Offline'}
          </span>
        )}

        {/* Current Active Circuit Pill if planning */}
        {activeCircuitTitle && currentView === 'workspace' && (
          <div className="yt-active-circuit-pill" title={activeCircuitTitle}>
            <span className="yt-circuit-dot"></span>
            <span className="yt-circuit-text">{activeCircuitTitle}</span>
            <span className="yt-circuit-km">({totalDistanceKm} km)</span>
          </div>
        )}

        {/* Voice Assistant Button */}
        <button
          type="button"
          className="yt-btn-voice"
          onClick={onOpenVoice}
          title={uiLanguage === 'kn' ? 'ಧ್ವನಿ ಸಹಾಯಕ (ಮಾತನಾಡಿ)' : 'Kannada Voice Assistant'}
          aria-label="Open voice assistant"
        >
          <span className="yt-voice-icon">🎙️</span>
          <span className="yt-voice-label font-kannada">
            {uiLanguage === 'kn' ? 'ಮಾತನಾಡಿ' : 'Voice'}
          </span>
        </button>

        {/* Bilingual Language Switcher */}
        <button
          type="button"
          className="yt-btn-lang"
          onClick={onToggleLanguage}
          title="Switch Language / ಭಾಷೆ ಬದಲಾಯಿಸಿ"
          aria-label="Toggle language between Kannada and English"
        >
          <span className="yt-lang-globe">🌐</span>
          <span className="yt-lang-text font-kannada">
            {uiLanguage === 'kn' ? 'English' : 'ಕನ್ನಡ'}
          </span>
        </button>

        {/* Primary CTA */}
        {currentView === 'explore' ? (
          <button type="button" className="yt-btn-plan-primary" onClick={onPlanTripCta}>
            <span>{uiLanguage === 'kn' ? 'ಪ್ರವಾಸ ರಚಿಸಿ' : 'Plan a Journey'}</span>
            <span className="yt-btn-arrow">→</span>
          </button>
        ) : (
          <button type="button" className="yt-btn-plan-primary" onClick={() => onSelectView('explore')}>
            <span>{uiLanguage === 'kn' ? 'ತಾಣಗಳು' : 'Browse Destinations'}</span>
          </button>
        )}
      </div>
    </nav>
  );
};
