// src/components/DiachronicTimeMachine.tsx
import React, { useState } from 'react';
import { DIACHRONIC_TRAJECTORIES, DiachronicTrajectory, DiachronicStage } from '../utils/dialectometryEngine';
import { History, Clock, ShieldCheck, Milestone } from 'lucide-react';

export const DiachronicTimeMachine: React.FC = () => {
  const [selectedConceptIndex, setSelectedConceptIndex] = useState<number>(0);
  const [selectedEpochIndex, setSelectedEpochIndex] = useState<number>(3); // Default to modern regional stage

  const currentTrajectory: DiachronicTrajectory = DIACHRONIC_TRAJECTORIES[selectedConceptIndex] || DIACHRONIC_TRAJECTORIES[0];
  const activeStage: DiachronicStage = currentTrajectory.stages[selectedEpochIndex] || currentTrajectory.stages[0];

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl text-stone-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Tier-2 Deep Research • Advancement 6
            </span>
            <span className="text-xs text-stone-400 font-mono">1,500-Year Historical Diachrony</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-400" />
            1,500-Year Diachronic Etymology Time-Machine
          </h3>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl">
            Demonstrates scientifically that Karnataka's regional dialects (such as Coastal Kundagannada and Havigannaḍa) are classical relic zones preserving 10th-century Old Kannada (Haḷegannaḍa) features lost in urban standard speech.
          </p>
        </div>

        {/* Concept Selector */}
        <div className="flex flex-wrap gap-2">
          {DIACHRONIC_TRAJECTORIES.map((traj, idx) => (
            <button
              key={traj.conceptId}
              onClick={() => {
                setSelectedConceptIndex(idx);
                setSelectedEpochIndex(3);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                selectedConceptIndex === idx
                  ? 'bg-emerald-500 text-stone-950 font-semibold border-emerald-400 shadow-md'
                  : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
              }`}
            >
              {traj.conceptLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Epoch Timeline Selector */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-400" />
            Select Historical Epoch (450 CE → Modern Hosagannaḍa)
          </span>
          <span className="text-xs text-stone-400">
            Slide to travel across historical centuries
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {currentTrajectory.stages.map((stage, idx) => {
            const isSelected = selectedEpochIndex === idx;

            return (
              <button
                key={stage.epochId}
                onClick={() => setSelectedEpochIndex(idx)}
                className={`p-4 rounded-xl text-left transition-all border relative overflow-hidden ${
                  isSelected
                    ? 'bg-stone-800 border-emerald-500 shadow-lg ring-1 ring-emerald-500/50'
                    : 'bg-stone-950/70 border-stone-800 hover:border-stone-700 hover:bg-stone-900/60'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
                )}
                <div className="text-[11px] font-mono text-emerald-400 font-semibold uppercase">
                  Epoch {idx + 1}
                </div>
                <div className="text-sm font-bold text-white mt-1 line-clamp-1">
                  {stage.epochLabel.split('(')[0]}
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">
                  {stage.periodRange}
                </div>

                <div className="mt-3 text-lg font-bold font-kannada text-emerald-200" lang="kn">
                  {stage.formKannada.split('/')[0]}
                </div>
                <div className="text-[11px] text-stone-400 font-mono">
                  {stage.formIAST.split('/')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detailed Breakdown */}
      {activeStage && (
        <div className="mt-6 bg-stone-950 rounded-xl p-6 border border-stone-800/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activeStage.epochLabel}
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  {activeStage.periodRange}
                </span>
              </div>
              <div className="flex items-baseline gap-4 mt-3">
                <div className="text-3xl font-extrabold font-kannada text-white leading-loose" lang="kn">
                  {activeStage.formKannada}
                </div>
                <div className="text-sm text-emerald-400 font-mono">
                  {activeStage.formIAST}
                </div>
              </div>
            </div>

            {/* Archaic Grapheme Highlights */}
            {activeStage.archaicGraphemesUsed && activeStage.archaicGraphemesUsed.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeStage.archaicGraphemesUsed.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  >
                    Archaic: {g}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 text-xs">
            <div className="space-y-4">
              <div>
                <span className="text-stone-400 block mb-1 font-semibold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <Milestone className="w-3.5 h-3.5 text-emerald-400" />
                  Historical Epigraphic & Literary Context
                </span>
                <p className="text-stone-300 leading-relaxed bg-stone-900/60 p-3.5 rounded-lg border border-stone-800">
                  {activeStage.historicalNote}
                </p>
              </div>

              <div>
                <span className="text-stone-400 block mb-1 font-semibold uppercase text-[10px] tracking-wider">
                  Proto-Kannada Invariant Root Anchor
                </span>
                <div className="bg-stone-900/80 p-3 rounded-lg border border-stone-800 flex items-center justify-between">
                  <span className="text-stone-400 font-medium">Underlying Invariant Base:</span>
                  <span className="font-kannada text-white font-bold text-sm" lang="kn">
                    {currentTrajectory.invariantRootKannada} ({currentTrajectory.invariantRootIAST})
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-stone-400 block mb-1 font-semibold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Retention in Living Modern Dialects
                </span>
                <p className="text-emerald-300/90 leading-relaxed bg-emerald-950/20 p-3.5 rounded-lg border border-emerald-800/30">
                  {activeStage.retentionInModernDialects}
                </p>
              </div>

              <div className="p-3 bg-stone-900/40 rounded-lg border border-stone-800 text-stone-400 text-[11px] leading-relaxed">
                <span className="font-semibold text-stone-300">Linguistic Insight:</span> By tracing forms from 450 CE Halmidi inscriptions through Kēśirāja’s 13th-century <em>Śabdamaṇidarpaṇa</em>, we dismantle the false hierarchy between "standard" and "regional" speech. Regional dialects are living custodians of classical Kannada heritage.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
