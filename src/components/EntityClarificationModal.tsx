/**
 * @file src/components/EntityClarificationModal.tsx
 * @description Clarification prompt for ambiguous travel destinations and transit hubs.
 * @theme Code. Create. Celebrate Kannada.
 */

import React from 'react';

export interface AmbiguityCandidate {
  id: string;
  name: string;
  nameKannada: string;
  district: string;
  category: string;
  description: string;
}

interface EntityClarificationModalProps {
  isOpen: boolean;
  rawQuery: string;
  candidates: AmbiguityCandidate[];
  onSelectCandidate: (candidateId: string) => void;
  onCancel: () => void;
}

export const EntityClarificationModal: React.FC<EntityClarificationModalProps> = ({
  isOpen,
  rawQuery,
  candidates,
  onSelectCandidate,
  onCancel,
}) => {
  if (!isOpen || candidates.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 18,
          maxWidth: 520,
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
            padding: '18px 22px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🔍</span>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                ಸ್ಪಷ್ಟೀಕರಣ ಅಗತ್ಯವಿದೆ (Clarification Needed)
              </h3>
              <div style={{ fontSize: 12, opacity: 0.9, marginTop: 2 }}>
                "{rawQuery}" ಗೆ ಒಂದಕ್ಕಿಂತ ಹೆಚ್ಚು ತಾಣಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿವೆ
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: 28,
              height: 28,
              color: '#ffffff',
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '20px 22px' }}>
          <p style={{ margin: '0 0 14px 0', fontSize: 13, color: '#334155' }}>
            ನೀವು ಉದ್ದೇಶಿಸಿದ ನಿಖರ ತಾಣವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ (Please select the exact destination you intended):
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {candidates.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectCandidate(c.id)}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '12px 14px',
                  background: '#f8fafc',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#2563eb';
                  e.currentTarget.style.background = '#eff6ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.background = '#f8fafc';
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                    {c.nameKannada} ({c.name})
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    📍 {c.district} ಜಿಲ್ಲೆ · {c.description}
                  </div>
                </div>
                <button
                  type="button"
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 12px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ಆಯ್ಕೆ (Select)
                </button>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: '12px 22px',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#475569',
              borderRadius: 6,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ರದ್ದು (Cancel)
          </button>
        </div>
      </div>
    </div>
  );
};
