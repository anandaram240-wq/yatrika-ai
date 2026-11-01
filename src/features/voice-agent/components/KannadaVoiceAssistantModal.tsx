/**
 * src/features/voice-agent/components/KannadaVoiceAssistantModal.tsx
 * Interactive Kannada Multimodal Voice Assistant Modal.
 * Styled in the crisp daylight glassmorphic design system.
 */

import React, { useState, useEffect } from 'react';
import { speechAdapterInstance } from '../adapters/speechRecognitionAdapter';
import { classifyKannadaIntent } from '../services/kannadaIntentClassifier';
import { VoiceIntentResult } from '../domain/types';

interface KannadaVoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyIntent: (intentResult: VoiceIntentResult) => void;
}

const SAMPLE_DEMO_UTTERANCES = [
  '🌟 ಬೆಂಗಳೂರಿನಿಂದ ಹಾಸನ, ಬೇಲೂರು, ಚಿಕ್ಕಮಗಳೂರು ಮತ್ತು ಮುಳ್ಳಯ್ಯನಗಿರಿ ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ಲಾನ್ ಮಾಡಿ',
  'ಮೈಸೂರಿನಿಂದ ಚಿಕ್ಕಮಗಳೂರಿಗೆ ಐದು ಸಾವಿರ ರೂಪಾಯಿ ಬಜೆಟ್‌ನಲ್ಲಿ ಪ್ಲಾನ್ ಮಾಡಿ',
  'ಹಂಪಿ, ಬಾದಾಮಿ ಮತ್ತು ಪಟ್ಟದಕಲ್ಲು ಯುನೆಸ್ಕೋ ಪ್ರವಾಸ ತೋರಿಸಿ',
  'ಗೋಕರ್ಣ ಮತ್ತು ಉಡುಪಿ ಕರಾವಳಿ ಪ್ರವಾಸ ಪ್ಲಾನ್ ಕೊಡಿ',
  'ಮುಳ್ಳಯ್ಯನಗಿರಿ ರಸ್ತೆಯಲ್ಲಿ ಮಳೆ ಮತ್ತು ಮಂಜು ಹೇಗಿರುತ್ತೆ?',
  'ಶಕ್ತಿ ಯೋಜನೆಯಡಿ ಮಹಿಳೆಯರಿಗೆ ಬಸ್ ಉಚಿತವಿದೆಯೇ?',
];

export const KannadaVoiceAssistantModal: React.FC<KannadaVoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplyIntent,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [intentResult, setIntentResult] = useState<VoiceIntentResult | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isSpeakingResponse, setIsSpeakingResponse] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      speechAdapterInstance.stopListening();
      setIsRecording(false);
      setTranscript('');
      setIntentResult(null);
      setSpeechError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartRecording = () => {
    setSpeechError(null);
    setTranscript('');
    setIntentResult(null);

    const started = speechAdapterInstance.startListening(
      {
        onStart: () => setIsRecording(true),
        onResult: (text, isFinal) => {
          setTranscript(text);
          if (isFinal || text.length > 5) {
            const classified = classifyKannadaIntent(text);
            setIntentResult(classified);
          }
        },
        onError: (err) => {
          setIsRecording(false);
          setSpeechError(err);
        },
        onEnd: () => {
          setIsRecording(false);
        },
      },
      'kn-IN'
    );

    if (!started) {
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    speechAdapterInstance.stopListening();
    setIsRecording(false);
    if (transcript) {
      const classified = classifyKannadaIntent(transcript);
      setIntentResult(classified);
    }
  };

  const handleSelectSample = (sample: string) => {
    setTranscript(sample);
    const classified = classifyKannadaIntent(sample);
    setIntentResult(classified);
  };

  const handleConfirmAndApply = () => {
    if (!intentResult) return;

    // Provide friendly Kannada voice feedback
    const confirmationKannada = intentResult.targetCircuitId
      ? 'ಖಂಡಿತ! ನಿಮ್ಮ ಪ್ರವಾಸ ಪ್ಲಾನ್ ಸಿದ್ಧಪಡಿಸಲಾಗಿದೆ. ಮಾರ್ಗವನ್ನು ನಕ್ಷೆಯಲ್ಲಿ ತೋರಿಸುತ್ತಿದ್ದೇನೆ.'
      : 'ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ವಿವರವಾದ ಪ್ರವಾಸ ಯೋಜನೆಯನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ.';

    setIsSpeakingResponse(true);
    speechAdapterInstance.speakKannada(confirmationKannada, () => {
      setIsSpeakingResponse(false);
    });

    onApplyIntent(intentResult);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.22)',
          border: '1.5px solid #e2e8f0',
          width: '100%',
          maxWidth: 580,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.25s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
              }}
            >
              🎙️
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a' }}>
                YatriKa Kannada AI Companion
              </div>
              <div style={{ fontSize: 11.5, color: '#64748b' }}>
                ಕನ್ನಡ ಧ್ವನಿ ಸಹಾಯಕ • Speak in any Karnataka dialect
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              background: '#f1f5f9',
              borderRadius: '50%',
              width: 30,
              height: 30,
              cursor: 'pointer',
              fontWeight: 700,
              color: '#475569',
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Microphone Central Orb */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '12px 0' }}>
            <button
              type="button"
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              style={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                border: 'none',
                background: isRecording
                  ? 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
                  : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                fontSize: 32,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isRecording
                  ? '0 0 0 10px rgba(239, 68, 68, 0.25), 0 8px 24px rgba(220, 38, 38, 0.4)'
                  : '0 8px 24px rgba(37, 99, 235, 0.35)',
                transition: 'all 0.2s ease',
              }}
              title={isRecording ? 'Stop Recording' : 'Start Kannada Voice Input'}
            >
              {isRecording ? '⏹' : '🎤'}
            </button>
            <div style={{ fontSize: 13, fontWeight: 700, color: isRecording ? '#dc2626' : '#2563eb' }}>
              {isRecording ? 'ಧ್ವನಿ ರೆಕಾರ್ಡ್ ಆಗುತ್ತಿದೆ... (Speaking...)' : 'ಧ್ವನಿ ಆರಂಭಿಸಲು ಮೈಕ್ರೊಫೋನ್ ಒತ್ತಿ'}
            </div>
          </div>

          {/* Error Message if any */}
          {speechError && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '8px 12px',
                borderRadius: 10,
                fontSize: 12,
              }}
            >
              ⚠️ {speechError}
            </div>
          )}

          {/* Transcript Box */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: '12px 14px',
              minHeight: 64,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>
              ಲೈವ್ ಧ್ವನಿ ಪಠ್ಯ (Live Transcript)
            </div>
            <div style={{ fontSize: 14, color: transcript ? '#0f172a' : '#94a3b8', fontStyle: transcript ? 'normal' : 'italic' }}>
              {transcript || 'ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ... (Speak in Kannada e.g. "ಮೈಸೂರಿನಿಂದ ಹಂಪಿಗೆ ಹೋಗಲು ಪ್ಲಾನ್ ಮಾಡಿ")'}
            </div>
          </div>

          {/* Intent & Entity Analysis Card */}
          {intentResult && (
            <div
              style={{
                background: '#eff6ff',
                border: '1.5px solid #bfdbfe',
                borderRadius: 14,
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>
                  🎯 ಗುರುತಿಸಲಾದ ಉದ್ದೇಶ (Detected Intent)
                </span>
                <span
                  style={{
                    background: '#dbeafe',
                    color: '#1e40af',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 999,
                  }}
                >
                  {Math.round(intentResult.confidence * 100)}% ವಿಶ್ವಾಸಾರ್ಹತೆ
                </span>
              </div>

              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                {intentResult.intent === 'route_search' && '🛣️ ಹೊಸ ಪ್ರವಾಸ ಮಾರ್ಗ ಶೋಧ (Route Search)'}
                {intentResult.intent === 'budget_query' && '💰 ಬಜೆಟ್ & ವೆಚ್ಚ ಲೆಕ್ಕಾಚಾರ (Budget Calculation)'}
                {intentResult.intent === 'food_khanavali_query' && '🍲 ಪ್ರಾದೇಶಿಕ ಊಟ & ಖಾನಾವಳಿ ಶೋಧ (Khanavali & Dining)'}
                {intentResult.intent === 'corridor_advice_query' && '⛰️ ಘಾಟ್ ರಸ್ತೆ & ಹೆದ್ದಾರಿ ಸಲಹೆ (Highway & Pass Advisory)'}
                {intentResult.intent === 'weather_season_query' && '🌦️ ಹವಾಮಾನ & ಮಳೆ ಎಚ್ಚರಿಕೆ (Micro-climate Advisory)'}
                {intentResult.intent === 'emergency_query' && '🚨 ತುರ್ತು ಸೇವೆಗಳು & ಹೆಲ್ಪ್‌ಲೈನ್ (Emergency Directory)'}
              </div>

              {/* Extracted Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                {intentResult.detectedDialect && (
                  <span style={{ background: '#ffffff', border: '1px solid #bfdbfe', color: '#1d4ed8', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>
                    ಉಪಭಾಷೆ: {intentResult.detectedDialect.replace('_', ' ')}
                  </span>
                )}
                {intentResult.entities.budgetInr && (
                  <span style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>
                    ಬಜೆಟ್: ₹{intentResult.entities.budgetInr}
                  </span>
                )}
                {intentResult.entities.origin && (
                  <span style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#b45309', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>
                    ಆರಂಭ: {intentResult.entities.origin}
                  </span>
                )}
                {intentResult.entities.destination && (
                  <span style={{ background: '#fff7ed', border: '1px solid #fed7aa', color: '#c2410c', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>
                    ತಲುಪುವ ಸ್ಥಳ: {intentResult.entities.destination}
                  </span>
                )}
                {intentResult.entities.isFemalePassenger && (
                  <span style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', color: '#9d174d', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>
                    ಶಕ್ತಿ ಯೋಜನೆ: ಅರ್ಹರು (₹0 Bus Fare)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Sample Prompts */}
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
              💡 ಮಾದರಿ ಧ್ವನಿ ಪ್ರಾಂಪ್ಟ್‌ಗಳು (Click to test):
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SAMPLE_DEMO_UTTERANCES.map((utterance, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(utterance)}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    padding: '6px 10px',
                    textAlign: 'left',
                    fontSize: 12,
                    color: '#334155',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#eff6ff';
                    e.currentTarget.style.borderColor = '#93c5fd';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  " {utterance} "
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontWeight: 600,
              fontSize: 12.5,
              cursor: 'pointer',
            }}
          >
            ರದ್ದು (Cancel)
          </button>
          <button
            type="button"
            onClick={handleConfirmAndApply}
            disabled={!intentResult}
            style={{
              padding: '8px 20px',
              borderRadius: 10,
              border: 'none',
              background: intentResult ? '#2563eb' : '#94a3b8',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 12.5,
              cursor: intentResult ? 'pointer' : 'not-allowed',
              boxShadow: intentResult ? '0 2px 8px rgba(37, 99, 235, 0.35)' : 'none',
            }}
          >
            {isSpeakingResponse ? 'ಧ್ವನಿ ಪ್ಲೇ ಆಗುತ್ತಿದೆ...' : '✓ ಪ್ರವಾಸ ಅನ್ವಯಿಸಿ (Apply Plan)'}
          </button>
        </div>
      </div>
    </div>
  );
};
