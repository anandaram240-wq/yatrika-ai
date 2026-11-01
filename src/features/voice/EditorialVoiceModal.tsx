/**
 * src/features/voice/EditorialVoiceModal.tsx
 * Natural, Calm, Editorial Voice Experience for YatriKa AI.
 * Backed by the V6.2 session-isolated 10-state Finite State Machine.
 * Honest microphone listening states, live transcript, and clear journey confirmation.
 */

import React, { useState } from 'react';
import { useVoiceRecognition } from './useVoiceRecognition';
import { VoiceIntentResult } from '../voice-agent/domain/types';

export interface EditorialVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyIntent: (intentResult: VoiceIntentResult) => void;
  uiLanguage: 'kn' | 'en';
}

export const EditorialVoiceModal: React.FC<EditorialVoiceModalProps> = ({
  isOpen,
  onClose,
  onApplyIntent,
  uiLanguage,
}) => {
  const {
    context,
    isListening,
    startListening,
    stopListening,
    cancelListening,
    setLanguage,
    updateTranscriptManually,
  } = useVoiceRecognition();

  const {
    state,
    language,
    transcript,
    interimTranscript,
    parsedEntities,
    error,
  } = context;

  const [editText, setEditText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const currentDisplayTranscript = transcript || interimTranscript;

  const handleConfirmAndApply = () => {
    // Generate intent object from state
    const intentResult: VoiceIntentResult = {
      rawTranscript: transcript || editText,
      normalizedText: transcript || editText,
      detectedDialect: 'standard_bengaluru',
      language: language === 'kn-IN' ? 'kn' : 'en',
      intent: 'route_search',
      confidence: 0.95,
      entities: {
        origin: parsedEntities?.origin,
        destination: parsedEntities?.destination,
        budgetInr: parsedEntities?.budgetInr,
        durationDays: parsedEntities?.durationDays,
        isFemalePassenger: parsedEntities?.isFemalePassenger,
      },
      requiresClarification: false,
    };
    onApplyIntent(intentResult);
    onClose();
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      updateTranscriptManually(editText.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="yt-voice-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="yt-voice-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="yt-voice-header">
          <div className="yt-voice-header-title">
            <span className="yt-voice-mic-badge">🎙️</span>
            <div>
              <div className="yt-voice-main-heading font-kannada">
                {uiLanguage === 'kn' ? 'ಕನ್ನಡ ಧ್ವನಿ ಸಹಾಯಕ' : 'Kannada Voice Assistant'}
              </div>
              <div className="yt-voice-sub-heading">
                Natural conversational travel intelligence for Karnataka
              </div>
            </div>
          </div>

          <div className="yt-voice-header-actions">
            {/* Language toggle kn-IN vs en-IN */}
            <div className="yt-voice-lang-toggle">
              <button
                type="button"
                className={`yt-vlang-btn ${language === 'kn-IN' ? 'active' : ''}`}
                onClick={() => setLanguage('kn-IN')}
              >
                ಕನ್ನಡ
              </button>
              <button
                type="button"
                className={`yt-vlang-btn ${language === 'en-IN' ? 'active' : ''}`}
                onClick={() => setLanguage('en-IN')}
              >
                English
              </button>
            </div>

            <button type="button" className="yt-voice-close-btn" onClick={onClose} aria-label="Close dialog">
              ✕
            </button>
          </div>
        </div>

        {/* State Banner */}
        <div className="yt-voice-status-strip">
          {state === 'IDLE' && (
            <span className="yt-vstatus-idle">
              Ready to listen. Tap the microphone and state your journey in Kannada or English.
            </span>
          )}
          {state === 'LISTENING' && (
            <span className="yt-vstatus-listening">
              <span className="yt-vpulse-dot"></span>
              ಕೇಳಿಸಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ (Listening)... ಮಾತನಾಡಿ
            </span>
          )}
          {state === 'PROCESSING' && (
            <span className="yt-vstatus-processing">
              ⏳ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ (Analyzing destination entities)...
            </span>
          )}
          {(state === 'TRANSCRIPT_READY' || state === 'COMMAND_PREVIEW') && (
            <span className="yt-vstatus-ready">
              ✓ ಪೂರ್ಣಗೊಂಡಿದೆ (Recognized). Confirm or edit below:
            </span>
          )}
          {state === 'ERROR' && (
            <span className="yt-vstatus-error">
              ⚠️ {error?.messageKannada || error?.messageEnglish || 'Error occurred.'}
            </span>
          )}
        </div>

        {/* Live Transcript / Edit Box */}
        <div className="yt-voice-transcript-card">
          <div className="yt-vcard-label">
            <span>{uiLanguage === 'kn' ? 'ಧ್ವನಿ ಪ್ರತಿಲೇಖನ (Transcript)' : 'Spoken Transcript'}</span>
            {transcript && !isEditing && (
              <button
                type="button"
                className="yt-vbtn-edit-text"
                onClick={() => {
                  setEditText(transcript);
                  setIsEditing(true);
                }}
              >
                ✏️ {uiLanguage === 'kn' ? 'ತಿದ್ದುಪಡಿ' : 'Edit Text'}
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="yt-vedit-box">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={3}
                className="yt-vtextarea font-kannada"
              />
              <div className="yt-vedit-actions">
                <button type="button" className="yt-vbtn-save-edit" onClick={handleSaveEdit}>
                  Save Correction
                </button>
                <button type="button" className="yt-vbtn-cancel-edit" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="yt-vtranscript-prose font-kannada">
              {currentDisplayTranscript ? (
                <span>
                  {currentDisplayTranscript}
                  {state === 'LISTENING' && <span className="yt-vcursor">|</span>}
                </span>
              ) : (
                <span className="yt-vplaceholder">
                  ಉದಾಹರಣೆಗೆ: &ldquo;ಬೆಂಗಳೂರಿನಿಂದ ಹಾಸನದ ಮೂಲಕ ಬೇಲೂರಿಗೆ ಹೋಗಬೇಕು&rdquo;...
                </span>
              )}
            </div>
          )}
        </div>

        {/* Resolved Travel Entities Preview */}
        {parsedEntities && (
          <div className="yt-ventities-preview">
            <div className="yt-ventities-title">Resolved Journey Parameters:</div>
            <div className="yt-ventities-grid">
              {parsedEntities.origin && (
                <div className="yt-ventity-chip">
                  <span className="yt-ventity-tag">Origin</span>
                  <strong>📍 {parsedEntities.origin}</strong>
                </div>
              )}
              {parsedEntities.destination && (
                <div className="yt-ventity-chip">
                  <span className="yt-ventity-tag">Destination</span>
                  <strong>🎯 {parsedEntities.destination}</strong>
                </div>
              )}
              {parsedEntities.waypoints && parsedEntities.waypoints.length > 0 && (
                <div className="yt-ventity-chip">
                  <span className="yt-ventity-tag">Via Corridor</span>
                  <strong>🛣️ {parsedEntities.waypoints.join(', ')}</strong>
                </div>
              )}
              {parsedEntities.durationDays && (
                <div className="yt-ventity-chip">
                  <span className="yt-ventity-tag">Duration</span>
                  <strong>⏱️ {parsedEntities.durationDays} Days</strong>
                </div>
              )}
              {parsedEntities.budgetInr && (
                <div className="yt-ventity-chip">
                  <span className="yt-ventity-tag">Budget</span>
                  <strong>₹{parsedEntities.budgetInr.toLocaleString('en-IN')}</strong>
                </div>
              )}
              {parsedEntities.isFemalePassenger && (
                <div className="yt-ventity-chip shakti">
                  <span className="yt-ventity-tag">Shakti Scheme</span>
                  <strong>🌸 Zero-Fare Bus Active</strong>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Microphone Button & Action Controls */}
        <div className="yt-voice-controls-bar">
          {state === 'ERROR' ? (
            <button type="button" className="yt-vbtn-retry" onClick={startListening}>
              🔄 Try Again
            </button>
          ) : isListening ? (
            <button type="button" className="yt-vbtn-mic listening" onClick={stopListening}>
              <span className="yt-vmic-icon">⏹</span>
              <span>{uiLanguage === 'kn' ? 'ನಿಲ್ಲಿಸಿ (Done)' : 'Stop Listening'}</span>
            </button>
          ) : (
            <button type="button" className="yt-vbtn-mic idle" onClick={startListening}>
              <span className="yt-vmic-icon">🎙️</span>
              <span>{uiLanguage === 'kn' ? 'ಮಾತನಾಡಿ (Tap to Speak)' : 'Start Speaking'}</span>
            </button>
          )}

          {/* Confirm & Build Itinerary CTA */}
          {(state === 'COMMAND_PREVIEW' || (transcript && state !== 'LISTENING')) && (
            <button type="button" className="yt-vbtn-confirm" onClick={handleConfirmAndApply}>
              <span>✓ {uiLanguage === 'kn' ? 'ಪ್ರವಾಸ ರಚಿಸಿ' : 'Generate Itinerary'}</span>
              <span>→</span>
            </button>
          )}

          {isListening && (
            <button type="button" className="yt-vbtn-cancel" onClick={cancelListening}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
