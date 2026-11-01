/**
 * src/features/voice/VoiceTranscript.tsx
 * Clean, high-legibility transcript display supporting live audio text and manual correction.
 */

import React, { useState, useEffect } from 'react';

interface VoiceTranscriptProps {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  onManualEdit: (updatedText: string) => void;
  language: 'kn-IN' | 'en-IN';
}

export const VoiceTranscript: React.FC<VoiceTranscriptProps> = ({
  transcript,
  interimTranscript,
  isListening,
  onManualEdit,
  language,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(transcript);

  useEffect(() => {
    if (!isEditing) {
      setEditText(transcript);
    }
  }, [transcript, isEditing]);

  const activeText = transcript || interimTranscript;

  const handleSaveEdit = () => {
    onManualEdit(editText);
    setIsEditing(false);
  };

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isListening && (
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#dc2626',
                display: 'inline-block',
                boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.2)',
              }}
            />
          )}
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            {isListening
              ? language === 'kn-IN'
                ? 'ಧ್ವನಿ ರೆಕಾರ್ಡ್ ಆಗುತ್ತಿದೆ (Listening...)'
                : 'Listening to your voice...'
              : language === 'kn-IN'
              ? 'ಧ್ವನಿ ಪಠ್ಯ (Captured Transcript)'
              : 'Captured Transcript'}
          </span>
        </div>

        {!isListening && activeText && (
          <button
            type="button"
            onClick={() => (isEditing ? handleSaveEdit() : setIsEditing(true))}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#2563eb',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {isEditing
              ? language === 'kn-IN'
                ? 'ಉಳಿಸಿ (Save)'
                : 'Save'
              : language === 'kn-IN'
              ? 'ತಿದ್ದುಪಡಿ (Edit Text)'
              : 'Edit Text'}
          </button>
        )}
      </div>

      {isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={2}
            style={{
              width: '100%',
              padding: '8px 10px',
              border: '1.5px solid #2563eb',
              borderRadius: 8,
              fontSize: 14,
              fontFamily: 'inherit',
              color: '#172033',
              outline: 'none',
            }}
            placeholder="ಪ್ರವಾಸದ ವಿವರಗಳನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ..."
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button
              type="button"
              onClick={() => {
                setEditText(transcript);
                setIsEditing(false);
              }}
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                fontSize: 11.5,
                cursor: 'pointer',
              }}
            >
              ರದ್ದು
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              style={{
                padding: '4px 12px',
                borderRadius: 6,
                border: 'none',
                background: '#2563eb',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: 11.5,
                cursor: 'pointer',
              }}
            >
              ಅನ್ವಯಿಸಿ (Apply)
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            fontSize: 14.5,
            color: activeText ? '#172033' : '#94a3b8',
            fontStyle: activeText ? 'normal' : 'italic',
            lineHeight: 1.5,
            minHeight: 24,
          }}
        >
          {activeText ||
            (language === 'kn-IN'
              ? 'ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ... (ಉದಾ: "ಬೆಂಗಳೂರಿನಿಂದ ಹಾಸನದ ಮೂಲಕ ಚಿಕ್ಕಮಗಳೂರಿಗೆ ಮೂರು ದಿನದ ಪ್ರವಾಸ")'
              : 'Speak in English or Kannada... (e.g. "Plan a 3-day trip from Bangalore to Chikmagalur via Hassan")')}
        </div>
      )}
    </div>
  );
};
