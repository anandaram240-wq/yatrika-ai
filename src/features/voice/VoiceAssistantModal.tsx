/**
 * src/features/voice/VoiceAssistantModal.tsx
 * Professional Editorial Voice Assistant Modal for YatriKa AI.
 * Implements full 10-state Voice State Machine with zero artificial animations.
 */

import React, { useEffect, useRef } from 'react';
import { useVoiceRecognition } from './useVoiceRecognition';
import { VoiceTranscript } from './VoiceTranscript';
import { VoiceCommandPreview } from './VoiceCommandPreview';
import { ParsedTravelEntities } from './VoiceStateMachine';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPlan: (parsed: ParsedTravelEntities, rawText: string) => void;
  defaultLanguage?: 'kn-IN' | 'en-IN';
}

const SAMPLE_TRAVEL_QUERIES = [
  {
    kannada: 'ಬೆಂಗಳೂರಿನಿಂದ ಹಾಸನದ ಮೂಲಕ ಬೇಲೂರು ಮತ್ತು ಮುಳ್ಳಯ್ಯನಗಿರಿಗೆ ಹೋಗಬೇಕು',
    english: 'From Bangalore to Mullayanagiri via Hassan and Belur',
  },
  {
    kannada: 'ಮೈಸೂರಿನಿಂದ ಕೊಡಗಿಗೆ ಮೂರು ದಿನದ ಪ್ರವಾಸ ಪ್ಲಾನ್ ಮಾಡಿ, ಐದು ಸಾವಿರ ಬಜೆಟ್',
    english: '3-day Coorg trip from Mysore under ₹5,000 budget',
  },
  {
    kannada: 'ಹಂಪಿ, ಬಾದಾಮಿ ಮತ್ತು ಪಟ್ಟದಕಲ್ಲು ಯುನೆಸ್ಕೋ ಪಾರಂಪರಿಕ ಯಾತ್ರೆ',
    english: 'UNESCO heritage circuit: Hampi, Badami, Pattadakal',
  },
  {
    kannada: 'ಮಂಗಳೂರಿನಿಂದ ಉಡುಪಿ ಮತ್ತು ಗೋಕರ್ಣ ಕರಾವಳಿ ಪ್ರವಾಸ',
    english: 'Coastal tour: Mangalore to Udupi and Gokarna',
  },
];

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplyPlan,
  defaultLanguage = 'kn-IN',
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const {
    context,
    isListening,
    isProcessing,
    hasError,
    hasPreview,
    startListening,
    stopListening,
    cancelListening,
    reset,
    setLanguage,
    updateTranscriptManually,
    confirmPlan,
  } = useVoiceRecognition({
    defaultLanguage,
    onPlanConfirmed: (parsed, rawText) => {
      onApplyPlan(parsed, rawText);
      onClose();
    },
  });

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        cancelListening();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, cancelListening, onClose]);

  // Reset state when opening/closing
  useEffect(() => {
    if (!isOpen) {
      cancelListening();
      reset();
    }
  }, [isOpen, cancelListening, reset]);

  if (!isOpen) return null;

  const isKn = context.language === 'kn-IN';

  const handleSelectSample = (sample: string) => {
    updateTranscriptManually(sample);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={() => {
        cancelListening();
        onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Kannada Voice Travel Assistant"
    >
      <div
        ref={modalRef}
        style={{
          background: '#ffffff',
          borderRadius: 16,
          boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.25)',
          border: '1px solid #e2e8f0',
          width: '100%',
          maxWidth: 580,
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
              }}
            >
              🎙️
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#172033', margin: 0 }}>
                {isKn ? 'ಕನ್ನಡ ಧ್ವನಿ ಪ್ರವಾಸ ಸಹಾಯಕ' : 'Voice Travel Assistant'}
              </h2>
              <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                {isKn
                  ? 'ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ ನಿಮ್ಮ ಪ್ರಯಾಣವನ್ನು ಯೋಜಿಸಿ'
                  : 'Speak naturally to plan your Karnataka journey'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Language Switcher */}
            <div
              style={{
                display: 'flex',
                background: '#e2e8f0',
                borderRadius: 8,
                padding: 2,
              }}
            >
              <button
                type="button"
                onClick={() => setLanguage('kn-IN')}
                style={{
                  border: 'none',
                  background: context.language === 'kn-IN' ? '#ffffff' : 'transparent',
                  color: context.language === 'kn-IN' ? '#2563eb' : '#64748b',
                  fontSize: 11.5,
                  fontWeight: 700,
                  padding: '4px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                ಕನ್ನಡ
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en-IN')}
                style={{
                  border: 'none',
                  background: context.language === 'en-IN' ? '#ffffff' : 'transparent',
                  color: context.language === 'en-IN' ? '#2563eb' : '#64748b',
                  fontSize: 11.5,
                  fontWeight: 700,
                  padding: '4px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                English
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                cancelListening();
                onClose();
              }}
              style={{
                border: 'none',
                background: '#f1f5f9',
                borderRadius: 8,
                width: 32,
                height: 32,
                cursor: 'pointer',
                color: '#64748b',
                fontWeight: 700,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Main Microphone Action Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px 0',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 14,
              gap: 12,
            }}
          >
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  border: isListening ? '3px solid #fecaca' : '3px solid #bfdbfe',
                  background: isListening ? '#dc2626' : '#2563eb',
                  color: '#ffffff',
                  fontSize: 28,
                  cursor: isProcessing ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isListening
                    ? '0 0 0 6px rgba(220, 38, 38, 0.15)'
                    : '0 4px 12px rgba(37, 99, 235, 0.25)',
                  transition: 'all 0.2s ease',
                }}
                aria-label={isListening ? 'Stop recording' : 'Start voice input'}
              >
                {isProcessing ? '⏳' : isListening ? '⏹' : '🎤'}
              </button>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: isListening ? '#dc2626' : '#172033',
                }}
              >
                {isProcessing
                  ? isKn
                    ? 'ಪ್ರವಾಸ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...'
                    : 'Analyzing travel request...'
                  : isListening
                  ? isKn
                    ? 'ಧ್ವನಿ ಆಲಿಸಲಾಗುತ್ತಿದೆ... ಮಾತನಾಡಿ ಮುಗಿದ ಮೇಲೆ ನಿಲ್ಲಿಸಿ'
                    : 'Listening... Tap stop when finished'
                  : isKn
                  ? 'ಮಾತನಾಡಲು ಮೈಕ್ರೋಫೋನ್ ಒತ್ತಿ'
                  : 'Tap microphone to speak'}
              </div>
              <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2 }}>
                {isKn
                  ? 'ಭಾಷೆ: ಕನ್ನಡ (kn-IN) • ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ'
                  : 'Language: English / Kannada • Speak clearly'}
              </div>
            </div>

            {/* In-listening Controls */}
            {isListening && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={stopListening}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    border: '1px solid #dc2626',
                    background: '#ffffff',
                    color: '#dc2626',
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  ⏹ {isKn ? 'ನಿಲ್ಲಿಸಿ (Done)' : 'Stop Listening'}
                </button>
                <button
                  type="button"
                  onClick={cancelListening}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#64748b',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  ✕ {isKn ? 'ರದ್ದು' : 'Cancel'}
                </button>
              </div>
            )}
          </div>

          {/* Error Banner */}
          {hasError && context.error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 10,
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
              role="alert"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>⚠️</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#991b1b' }}>
                  {isKn ? context.error.messageKannada : context.error.messageEnglish}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                {context.error.retryable && (
                  <button
                    type="button"
                    onClick={startListening}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      border: '1px solid #f87171',
                      background: '#ffffff',
                      color: '#991b1b',
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    🔄 {isKn ? 'ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ' : 'Try Again'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    updateTranscriptManually(SAMPLE_TRAVEL_QUERIES[0].kannada);
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontSize: 11.5,
                    cursor: 'pointer',
                  }}
                >
                  ⌨️ {isKn ? 'ಪಠ್ಯ ಉದಾಹರಣೆ ಬಳಸಿ' : 'Use Sample Query'}
                </button>
              </div>
            </div>
          )}

          {/* Live / Editable Transcript */}
          <VoiceTranscript
            transcript={context.transcript}
            interimTranscript={context.interimTranscript}
            isListening={isListening}
            onManualEdit={updateTranscriptManually}
            language={context.language}
          />

          {/* Structured Preview (Only when parsed and ready) */}
          {hasPreview && context.parsedEntities && (
            <VoiceCommandPreview
              entities={context.parsedEntities}
              rawTranscript={context.transcript}
              confidence={context.confidence}
              onConfirm={confirmPlan}
              onRetry={startListening}
              onCancel={() => {
                cancelListening();
                onClose();
              }}
              language={context.language}
            />
          )}

          {/* Sample Travel Commands */}
          {!isListening && !hasPreview && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>
                💡 {isKn ? 'ತ್ವರಿತ ಪರೀಕ್ಷಾರ್ಥ ಪ್ರಾಂಪ್ಟ್‌ಗಳು (Quick Sample Queries):' : 'Sample Travel Queries:'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {SAMPLE_TRAVEL_QUERIES.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(q.kannada)}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      padding: '8px 12px',
                      textAlign: 'left',
                      fontSize: 12.5,
                      color: '#172033',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease, border-color 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#eff6ff';
                      e.currentTarget.style.borderColor = '#bfdbfe';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>"{q.kannada}"</span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{q.english}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
