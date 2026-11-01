/**
 * @file src/components/OnboardingTourModal.tsx
 * @description Product Usability Onboarding Experience for YatriKa AI (ಯಾತ್ರಿಕ)
 * @event Karnataka Digital Innovation Hackathon 2026
 * @aesthetic Daylight Glassmorphism (#f8fafc, #2563eb, #ea580c)
 */

import React, { useState } from 'react';

interface OnboardingTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchGoldenJourney: () => void;
}

export const OnboardingTourModal: React.FC<OnboardingTourModalProps> = ({
  isOpen,
  onClose,
  onLaunchGoldenJourney,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  if (!isOpen) return null;

  const steps = [
    {
      stepBadge: 'ಹಂತ ೧ / Step 1',
      titleKannada: 'ಕನ್ನಡ-ಮೊದಲ ನೈಸರ್ಗಿಕ ಸಂವಾದ (Kannada-First Voice & Text)',
      icon: '🎙️',
      descriptionKannada:
        'ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ. ನಿಮ್ಮ ಸ್ಥಳೀಯ ಉಪಭಾಷೆಯನ್ನು (ಮೈಸೂರು, ಕುಂದಾಪ್ರ, ಕಲ್ಯಾಣ, ಕಿತ್ತೂರು, ಹವ್ಯಕ ಅಥವಾ ಬೆಂಗಳೂರು ಕಾಂಗ್ಲಿಷ್) ಯಾತ್ರಿಕ AI ನಿಖರವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತದೆ.',
      descriptionEnglish:
        'Speak or type in Kannada or English. YatriKa AI natively recognizes regional dialects (Mysuru, Kundagannada, Kalyana, Kittur, Havyaka, and Kanglish).',
      samplePrompt: '🌟 "ಬೆಂಗಳೂರಿನಿಂದ ಹಾಸನ, ಬೇಲೂರು ಮತ್ತು ಮುಳ್ಳಯ್ಯನಗಿರಿ ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ಲಾನ್ ಮಾಡಿ"',
    },
    {
      stepBadge: 'ಹಂತ ೨ / Step 2',
      titleKannada: 'ಪ್ಯಾರೇಟೊ ಬಹು-ಉದ್ದೇಶಿತ ಆಯ್ಕೆ & ಶಕ್ತಿ ₹0 ಆಡಿಟ್ (Pareto Optimizer & Shakti ₹0)',
      icon: '⚖️',
      descriptionKannada:
        'ಕೇವಲ ಒಂದೇ ಮಾರ್ಗವಲ್ಲ; ನಿಮ್ಮ ಆದ್ಯತೆಗೆ ತಕ್ಕಂತೆ ೪ ಪ್ಯಾರೇಟೊ ಪರ್ಯಾಯಗಳನ್ನು ಆರಿಸಿ: ⚡ ಅತೀ ವೇಗದ, 💰 ಶಕ್ತಿ ಯೋಜನೆ ₹0 ಕನಿಷ್ಠ ವೆಚ್ಚ, 🏛️ ಗರಿಷ್ಠ ಪರಂಪರೆ, ಅಥವಾ 🛡️ ಕನಿಷ್ಠ ಅಪಾಯ. ಶಕ್ತಿ ಯೋಜನೆಯಡಿ ಮಹಿಳೆಯರಿಗೆ ಕೆಎಸ್‌ಆರ್‌ಟಿಸಿ ₹0 ಲೆಕ್ಕಾಚಾರ ಲಭ್ಯ.',
      descriptionEnglish:
        'Choose from 4 non-dominated Pareto alternatives: Fastest, Lowest Cost (Shakti ₹0), Maximum Heritage, or Lowest Risk. Legally grounded Shakti Scheme audit (GoK TRD 34 MDA 2023).',
      samplePrompt: 'ಲೆಡ್ಜರ್: ₹430 KSRTC ಉಳಿತಾಯ · ನೈಜ ಇಂಧನ ಮತ್ತು ಟೋಲ್ ಲೆಕ್ಕಾಚಾರ',
    },
    {
      stepBadge: 'ಹಂತ ೩ / Step 3',
      titleKannada: 'ಘಾಟಿ-ರಕ್ಷಣೆ & ಶೂನ್ಯ-ನೆಟ್‌ವರ್ಕ್ ಆಫ್‌ಲೈನ್ ಪಾಸ್ (Ghat-Shield & Offline SOS)',
      icon: '🛡️',
      descriptionKannada:
        'ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಹೇರ್‌ಪಿನ್ ತಿರುವುಗಳು, ಮಳೆ, ಹಾಗೂ ಬೇಲೂರು ಮಧ್ಯಾಹ್ನದ ನೈವೇದ್ಯ ವಿರಾಮ (12:30–3:30) ಮತ್ತು ಮುಳ್ಳಯ್ಯನಗಿರಿ ಸಂಜೆ 5:30 ರ ನಿರ್ಬಂಧಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಪರಿಶೀಲಿಸುತ್ತದೆ. ನೆಟ್‌ವರ್ಕ್ ಇಲ್ಲದಿದ್ದರೂ ಆಫ್‌ಲೈನ್ ಪಾಸ್ ಮತ್ತು 112/108 SOS ತುರ್ತು ಸಹಾಯ ಲಭ್ಯ.',
      descriptionEnglish:
        'Automated Western Ghat hairpin, fog & darshan window checks. Belur noon sanctum & Mullayanagiri 17:30 gate restrictions verified. Zero-connectivity cryptographic offline packs with emergency SOS directory.',
      samplePrompt: 'SHA-256 ಸಮಗ್ರತೆಯುಳ್ಳ ಆಫ್‌ಲೈನ್ ರೂಟ್ ಪ್ಯಾಕ್ & ತುರ್ತು ಡೈರೆಕ್ಟರಿ',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleStartGolden = () => {
    onClose();
    onLaunchGoldenJourney();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          maxWidth: 620,
          width: '100%',
          overflow: 'hidden',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header with Daylight Glassmorphic Accent */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e3a8a, #2563eb 60%, #ea580c)',
            padding: '24px 28px',
            color: '#ffffff',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: '#ffffff',
                color: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: 800,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
            >
              ಯಾ
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>
                ಯಾತ್ರಿಕ AI ಗೆ ಸುಸ್ವಾಗತ! (Welcome to YatriKa AI)
              </h2>
              <div style={{ fontSize: 13, opacity: 0.92, marginTop: 2 }}>
                Karnataka’s Autonomous Travel Intelligence Operating System
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: 30,
              height: 30,
              color: '#ffffff',
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Close Guide"
          >
            ✕
          </button>
        </div>

        {/* Card Content */}
        <div style={{ padding: '26px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: '#eff6ff',
                color: '#2563eb',
                padding: '4px 10px',
                borderRadius: 999,
                border: '1px solid #bfdbfe',
              }}
            >
              {steps[currentStep].stepBadge}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  style={{
                    width: idx === currentStep ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: idx === currentStep ? '#ea580c' : '#cbd5e1',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div
              style={{
                fontSize: 36,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 14,
                padding: '10px 14px',
                lineHeight: 1,
              }}
            >
              {steps[currentStep].icon}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                {steps[currentStep].titleKannada}
              </h3>
              <p style={{ margin: '0 0 6px 0', fontSize: 13, lineHeight: 1.5, color: '#334155' }}>
                {steps[currentStep].descriptionKannada}
              </p>
              <p style={{ margin: '0 0 12px 0', fontSize: 12, lineHeight: 1.45, color: '#64748b' }}>
                {steps[currentStep].descriptionEnglish}
              </p>
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontSize: 12,
                  color: '#1e293b',
                  fontWeight: 600,
                }}
              >
                {steps[currentStep].samplePrompt}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 28px',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <button
            type="button"
            onClick={handleStartGolden}
            style={{
              background: 'linear-gradient(135deg, #ea580c, #c2410c)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              padding: '9px 16px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 6px rgba(234, 88, 12, 0.35)',
            }}
          >
            🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (Start Golden Journey)
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  borderRadius: 8,
                  padding: '9px 14px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                ಹಿಂದಕ್ಕೆ (Back)
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                padding: '9px 18px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {currentStep < steps.length - 1 ? 'ಮುಂದೆ (Next) →' : 'ಪ್ರಾರಂಭಿಸಿ (Get Started) ✓'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
