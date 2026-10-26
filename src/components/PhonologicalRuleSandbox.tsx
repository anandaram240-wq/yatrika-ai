// src/components/PhonologicalRuleSandbox.tsx
import React, { useState } from 'react';
import { PHONOLOGICAL_DERIVATION_RULES, PhonologicalDerivationStep } from '../utils/dialectometryEngine';
import { Sparkles, ArrowRight, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

export const PhonologicalRuleSandbox: React.FC = () => {
  const [selectedRuleKey, setSelectedRuleKey] = useState<string>('kudure-to-kudre');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(1);

  const derivationKeys = [
    {
      key: 'kudure-to-kudre',
      label: 'Medial Vowel Syncope (ಕುದುರೆ → ಕುದ್ರೆ)',
      subtext: 'William Bright (1958) & Harold Schiffman (1983)',
      tag: 'Pan-Karnataka Colloquial'
    },
    {
      key: 'huduga-to-udga',
      label: 'Syncope + Glottal Deletion (ಹುಡುಗ → ಹುಡ್ಗ → ಉಡ್ಗ)',
      subtext: 'Kēśirāja (1260 CE) & U. P. Upadhyaya (1976)',
      tag: 'Rural Southern (Mandya/Mysuru)'
    },
    {
      key: 'hege-to-hyanga',
      label: 'Velar-Palatal Metaphony (ಹೇಗೆ → ಹ್ಯಾಂಗ)',
      subtext: 'Old Ka. *eṅge Retention & Low Vowel Shift',
      tag: 'Kittur & Kalyana (Dharwad/Kalaburagi)'
    }
  ];

  const currentSteps: PhonologicalDerivationStep[] = PHONOLOGICAL_DERIVATION_RULES[selectedRuleKey] || [];

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl text-stone-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Tier-2 Deep Research • Advancement 5
            </span>
            <span className="text-xs text-stone-400 font-mono">Finite-State Transducer (FST)</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            Generative Phonological Derivation Engine
          </h3>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl">
            Proves that dialect forms are not arbitrary "slang", but rule-governed mathematical derivations from underlying Dravidian roots via historical sound-change laws.
          </p>
        </div>

        {/* Derivation Rule Switcher */}
        <div className="flex flex-wrap gap-2">
          {derivationKeys.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setSelectedRuleKey(item.key);
                setActiveStepIndex(1);
              }}
              className={`px-3 py-2 rounded-xl text-left text-xs transition-all border ${
                selectedRuleKey === item.key
                  ? 'bg-amber-500 text-stone-950 font-semibold border-amber-400 shadow-md'
                  : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
              }`}
            >
              <div className="font-medium">{item.label}</div>
              <div className={`text-[10px] mt-0.5 ${selectedRuleKey === item.key ? 'text-stone-900' : 'text-stone-400'}`}>
                {item.tag}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step by Step Derivation Progression */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-400" />
            Derivation Trajectory ({currentSteps.length} Sequential Rules)
          </span>
          <span className="text-xs text-stone-500">
            Click any step to inspect formal transform notation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentSteps.map((step, idx) => {
            const isSelected = activeStepIndex === idx;
            const isUR = step.ruleCode === 'UR-BASE';
            const isSR = step.ruleCode === 'SR-FINAL';

            return (
              <div
                key={step.ruleCode + idx}
                onClick={() => setActiveStepIndex(idx)}
                className={`cursor-pointer rounded-xl p-4 transition-all border ${
                  isSelected
                    ? 'bg-stone-800/90 border-amber-500 shadow-lg ring-1 ring-amber-500/50'
                    : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      isUR
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : isSR
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {step.ruleCode}
                  </span>
                  <span className="text-xs text-stone-500 font-mono">Step {idx + 1}</span>
                </div>

                <div className="my-3 text-center">
                  <div className="text-2xl font-bold font-kannada text-white leading-loose" lang="kn">
                    {step.outputFormKannada}
                  </div>
                  <div className="text-xs text-amber-400/90 font-mono tracking-wide mt-1">
                    {step.outputFormIAST}
                  </div>
                </div>

                <div className="text-xs font-medium text-stone-200 mt-2 truncate">
                  {step.ruleName}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Step Deep Inspector */}
      {currentSteps[activeStepIndex] && (
        <div className="mt-6 bg-stone-950 rounded-xl p-5 border border-stone-800/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-stone-800">
            <div>
              <span className="text-xs font-mono text-amber-400 font-semibold uppercase">
                Active Transform Inspection • {currentSteps[activeStepIndex].ruleCode}
              </span>
              <h4 className="text-lg font-bold text-white mt-0.5">
                {currentSteps[activeStepIndex].ruleName}
              </h4>
            </div>
            <div className="flex items-center gap-2 bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-800 text-xs font-mono text-stone-300">
              <span className="text-stone-400">{currentSteps[activeStepIndex].inputFormIAST}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-emerald-400 font-bold">{currentSteps[activeStepIndex].outputFormIAST}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
            <div className="space-y-3">
              <div>
                <span className="text-stone-400 block mb-1 font-semibold uppercase text-[10px] tracking-wider">
                  Formal Phonological Rule Notation
                </span>
                <div className="bg-stone-900/90 p-3 rounded-lg border border-stone-800 font-mono text-amber-300 text-xs">
                  {currentSteps[activeStepIndex].formalNotation}
                </div>
              </div>

              <div>
                <span className="text-stone-400 block mb-1 font-semibold uppercase text-[10px] tracking-wider">
                  Linguistic Explanation & Mechanism
                </span>
                <p className="text-stone-300 leading-relaxed bg-stone-900/50 p-3 rounded-lg border border-stone-800/60">
                  {currentSteps[activeStepIndex].explanation}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-stone-400 block mb-1 font-semibold uppercase text-[10px] tracking-wider">
                  Scholarly Attestation & Authority
                </span>
                <div className="bg-stone-900/50 p-3 rounded-lg border border-stone-800/60 flex items-start gap-2.5">
                  <BookOpen className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div className="text-stone-300">
                    {currentSteps[activeStepIndex].scholarlyCitation}
                  </div>
                </div>
              </div>

              <div className="bg-amber-950/20 border border-amber-800/30 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Determinism Guarantee
                </div>
                <p className="text-[11px] text-stone-400 leading-normal">
                  This derivation is strictly deterministic. No probabilistic hallucination or heuristic text manipulation is involved.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
