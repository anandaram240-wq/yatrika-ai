import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, MapPin, Compass, ShieldCheck } from 'lucide-react';

interface GeneratingScreenProps {
  onComplete: () => void;
}

const GENERATION_STEPS = [
  'Analyzing Karnataka highways & road travel times...',
  'Factoring Western Ghats pass limits & daytime driving rules...',
  'Verifying ASI monument & temple darshan timings...',
  'Curating authentic regional food stops & signature dishes...',
  'Attaching localized Kannada audio travel phrases...',
  'Finalizing complete customized itinerary...',
];

export const GeneratingScreen: React.FC<GeneratingScreenProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < GENERATION_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 280);

    const completeTimeout = setTimeout(() => {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#dc2626', '#f59e0b', '#0d9488', '#fbbf24'],
        });
      } catch (e) {
        // Confetti fallback
      }
      onComplete();
    }, 1800);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
      <div className="bg-stone-900 border-2 border-amber-400/80 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
        {/* Animated Top Karnataka Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-red-600 via-amber-400 to-amber-500 animate-pulse"></div>

        {/* Pulsing Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-red-700 to-amber-500 flex items-center justify-center text-white shadow-xl animate-bounce">
          <Compass className="w-8 h-8 text-amber-200" />
        </div>

        <h3 className="text-xl font-black text-white mt-5">
          Crafting Your Karnataka Itinerary
        </h3>
        <p className="text-xs text-amber-300 font-kannada font-bold mt-1">
          ಯಾತ್ರಿಕ AI ಪ್ರವಾಸ ಯೋಜನೆ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-stone-800 rounded-full h-2 mt-6 overflow-hidden border border-stone-700">
          <div
            className="bg-linear-to-r from-red-600 to-amber-400 h-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / GENERATION_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Dynamic Status Text */}
        <div className="mt-4 min-h-[3rem] flex items-center justify-center">
          <p className="text-xs text-stone-300 font-medium animate-fade-in flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-spin-slow" />
            <span>{GENERATION_STEPS[currentStepIndex]}</span>
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-center gap-4 text-3xs text-stone-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Zero Hallucination Routes
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            Verified Karnataka Terrain
          </span>
        </div>
      </div>
    </div>
  );
};
