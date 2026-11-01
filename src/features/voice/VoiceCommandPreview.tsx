/**
 * src/features/voice/VoiceCommandPreview.tsx
 * Structured Preview of the Parsed Travel Command.
 * Enforces explicit user confirmation before itinerary and routing calculations.
 */

import React from 'react';
import { ParsedTravelEntities } from './VoiceStateMachine';

interface VoiceCommandPreviewProps {
  entities: ParsedTravelEntities;
  rawTranscript: string;
  confidence: number;
  onConfirm: () => void;
  onRetry: () => void;
  onCancel: () => void;
  language: 'kn-IN' | 'en-IN';
}

export const VoiceCommandPreview: React.FC<VoiceCommandPreviewProps> = ({
  entities,
  confidence,
  onConfirm,
  onRetry,
  onCancel,
  language,
}) => {
  const isKn = language === 'kn-IN';
  const hasDestination = Boolean(entities.destination);
  const isAmbiguous = Boolean(entities.unresolvedTerms && entities.unresolvedTerms.length > 0);

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 16 }}>📋</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#172033' }}>
            {isKn ? 'ಗುರುತಿಸಲಾದ ಪ್ರವಾಸ ವಿವರ (Parsed Travel Plan)' : 'Parsed Travel Request'}
          </span>
        </div>
        <span
          style={{
            background: confidence >= 0.7 ? '#ecfdf5' : '#fef3c7',
            color: confidence >= 0.7 ? '#065f46' : '#92400e',
            border: `1px solid ${confidence >= 0.7 ? '#a7f3d0' : '#fde68a'}`,
            fontSize: 11,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 999,
          }}
        >
          {Math.round(confidence * 100)}% {isKn ? 'ನಿಖರತೆ' : 'confidence'}
        </span>
      </div>

      {/* Structured Fields Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 10,
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 10,
          padding: '12px 14px',
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
            {isKn ? 'ಆರಂಭಿಕ ಸ್ಥಳ (Origin)' : 'Starting Location'}
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: '#172033', marginTop: 2 }}>
            {entities.origin || (isKn ? 'ಬೆಂಗಳೂರು (ಪೂರ್ವನಿಯೋಜಿತ)' : 'Bengaluru (Default)')}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
            {isKn ? 'ತಲುಪುವ ಸ್ಥಳ (Destination)' : 'Destination'}
          </div>
          <div
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: hasDestination ? '#ea580c' : '#dc2626',
              marginTop: 2,
            }}
          >
            {entities.destination || (isKn ? '⚠️ ಗುರುತಿಸಲಾಗಿಲ್ಲ' : '⚠️ Not specified')}
          </div>
        </div>

        {entities.waypoints && entities.waypoints.length > 0 && (
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
              {isKn ? 'ಮಧ್ಯಂತರ ಮಾರ್ಗ (Via Waypoints)' : 'Intermediate Stops'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
              {entities.waypoints.map((wp, i) => (
                <span
                  key={i}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 6,
                    padding: '2px 8px',
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: '#334155',
                  }}
                >
                  📍 {wp}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
            {isKn ? 'ಪ್ರವಾಸ ಅವಧಿ (Duration)' : 'Duration'}
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: '#172033', marginTop: 2 }}>
            {entities.durationDays
              ? `${entities.durationDays} ${isKn ? 'ದಿನಗಳು' : 'Days'}`
              : isKn
              ? '೩ ದಿನಗಳು (ಪ್ರಮಾಣಿತ)'
              : '3 Days (Standard)'}
          </div>
        </div>

        {entities.budgetInr && (
          <div>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
              {isKn ? 'ಅಂದಾಜು ಬಜೆಟ್ (Budget)' : 'Budget'}
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#047857', marginTop: 2 }}>
              ₹{entities.budgetInr.toLocaleString('en-IN')}
            </div>
          </div>
        )}

        {entities.isFemalePassenger && (
          <div>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
              {isKn ? 'ಶಕ್ತಿ ಯೋಜನೆ (Shakti)' : 'Shakti Scheme'}
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#9d174d', marginTop: 2 }}>
              ₹0 {isKn ? 'ಮಹಿಳೆಯರಿಗೆ ಉಚಿತ' : 'Free Bus Travel'}
            </div>
          </div>
        )}
      </div>

      {/* Unresolved Terms Warning */}
      {isAmbiguous && (
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fef3c7',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 12,
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>⚠️</span>
          <span>
            {isKn
              ? 'ಕೆಲವು ಸ್ಥಳಗಳ ಹೆಸರುಗಳು ಅಸ್ಪಷ್ಟವಾಗಿವೆ. ದಯವಿಟ್ಟು ಪಠ್ಯದಲ್ಲಿ ಸರಿಪಡಿಸಿ.'
              : 'Some place names are ambiguous. Please review or edit before building.'}
          </span>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '8px 14px',
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            color: '#475569',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isKn ? 'ರದ್ದು (Cancel)' : 'Cancel'}
        </button>

        <button
          type="button"
          onClick={onRetry}
          style={{
            padding: '8px 14px',
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            background: '#f8fafc',
            color: '#334155',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isKn ? 'ಮತ್ತೊಮ್ಮೆ ಮಾತನಾಡಿ (Try Again)' : 'Try Again'}
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={!hasDestination || isAmbiguous}
          style={{
            padding: '8px 18px',
            borderRadius: 8,
            border: 'none',
            background: hasDestination && !isAmbiguous ? '#2563eb' : '#94a3b8',
            color: '#ffffff',
            fontSize: 12.5,
            fontWeight: 700,
            cursor: hasDestination && !isAmbiguous ? 'pointer' : 'not-allowed',
            boxShadow: hasDestination && !isAmbiguous ? '0 2px 6px rgba(37, 99, 235, 0.25)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>✓</span>
          <span>{isKn ? 'ಈ ಪ್ರಯಾಣವನ್ನು ರೂಪಿಸು' : 'Build This Journey'}</span>
        </button>
      </div>
    </div>
  );
};
