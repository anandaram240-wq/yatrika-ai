// src/components/DialectometryMatrixView.tsx
import React, { useState } from 'react';
import { generatePairwiseDialectometryMatrix, DialectPairMetric } from '../utils/dialectometryEngine';
import { Calculator, Binary, Info } from 'lucide-react';

export const DialectometryMatrixView: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState<DialectPairMetric | null>(null);

  const pairwiseMetrics = generatePairwiseDialectometryMatrix();

  const regions = [
    { id: 'old_mysuru_southern', shortName: 'Mysuru' },
    { id: 'kittur_karnataka', shortName: 'Kittur' },
    { id: 'kalyana_karnataka', shortName: 'Kalyana' },
    { id: 'karavali_coastal', shortName: 'Karavali' },
    { id: 'malnad', shortName: 'Malnad' },
    { id: 'central_border_cluster', shortName: 'Central' }
  ];

  function getMetricFor(idA: string, idB: string): DialectPairMetric | undefined {
    if (idA === idB) return undefined;
    return pairwiseMetrics.find(
      (m) =>
        (m.regionIdA === idA && m.regionIdB === idB) ||
        (m.regionIdA === idB && m.regionIdB === idA)
    );
  }

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl text-stone-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Tier-2 Deep Research • Advancement 7
            </span>
            <span className="text-xs text-stone-400 font-mono">Nerbonne Dialectometry Model</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Calculator className="w-6 h-6 text-indigo-400" />
            Quantitative Dialectometry & Mutual Intelligibility Matrix
          </h3>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl">
            Replaces subjective impressions with a mathematically rigorous Levenshtein distance matrix weighting phonetic, bound-morphemic, and lexical divergences across Karnataka's 6 macro-linguistic zones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-stone-950 px-3.5 py-2 rounded-xl border border-stone-800 text-xs">
            <span className="text-stone-400 block text-[10px] uppercase font-mono">Cognacy Baseline</span>
            <span className="text-emerald-400 font-bold text-sm">84% – 100% Shared Roots</span>
          </div>
        </div>
      </div>

      {/* Mathematical Formulation Ribbon */}
      <div className="mt-5 bg-stone-950 p-4 rounded-xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Binary className="w-5 h-5 text-indigo-400 shrink-0" />
          <div className="text-xs font-mono text-stone-300">
            <span className="text-indigo-300 font-bold">D(R_i, R_j)</span> = 0.35·d_phon(IPA) + 0.40·d_morph(Suffix) + 0.25·I_lex(Root)
          </div>
        </div>
        <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-stone-400" />
          Weighted by allophonic Dravidian sound-shift costs (p/h, retroflex/dental)
        </div>
      </div>

      {/* 6x6 Matrix Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-center text-xs border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left font-mono text-stone-400 uppercase text-[10px] border-b border-stone-800">
                Region Pair (6×6)
              </th>
              {regions.map((r) => (
                <th key={r.id} className="p-3 font-semibold text-stone-300 border-b border-stone-800">
                  {r.shortName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {regions.map((rowR) => (
              <tr key={rowR.id} className="border-b border-stone-800/60 hover:bg-stone-800/30 transition-colors">
                <td className="p-3 text-left font-medium text-stone-300">
                  {rowR.shortName}
                </td>
                {regions.map((colR) => {
                  if (rowR.id === colR.id) {
                    return (
                      <td key={colR.id} className="p-3 bg-stone-950/40 text-stone-600 font-mono text-[11px]">
                        0.0%
                      </td>
                    );
                  }

                  const metric = getMetricFor(rowR.id, colR.id);
                  if (!metric) return <td key={colR.id} className="p-3 text-stone-700">-</td>;

                  const div = metric.surfaceDivergencePct;
                  const isSelected = selectedPair?.regionIdA === metric.regionIdA && selectedPair?.regionIdB === metric.regionIdB;

                  // Color gradient according to divergence
                  const bgClass =
                    div <= 20
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
                      : div <= 35
                      ? 'bg-blue-950/40 text-blue-300 border-blue-800/40'
                      : div <= 50
                      ? 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                      : 'bg-rose-950/40 text-rose-300 border-rose-800/40';

                  return (
                    <td key={colR.id} className="p-2">
                      <button
                        onClick={() => setSelectedPair(metric)}
                        className={`w-full py-1.5 px-2 rounded-lg font-mono text-xs transition-all border ${bgClass} ${
                          isSelected ? 'ring-2 ring-indigo-400 scale-105' : 'hover:scale-102'
                        }`}
                      >
                        {div}%
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Pair Detail Inspector */}
      {selectedPair ? (
        <div className="mt-6 bg-stone-950 p-5 rounded-xl border border-stone-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                Pairwise Divergence Inspector
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">
                {selectedPair.regionNameA} ↔ {selectedPair.regionNameB}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Mutual Intelligibility: {selectedPair.mutualIntelligibilityLevel}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-center">
            <div className="bg-stone-900/80 p-3.5 rounded-lg border border-stone-800">
              <span className="text-[10px] uppercase font-mono text-stone-400 block mb-1">
                Invariant Root Cognacy
              </span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                {selectedPair.rootCognacyPct}%
              </span>
              <span className="text-[11px] text-stone-400 block mt-1">
                Shared Dravidian Verb/Noun Base
              </span>
            </div>

            <div className="bg-stone-900/80 p-3.5 rounded-lg border border-stone-800">
              <span className="text-[10px] uppercase font-mono text-stone-400 block mb-1">
                Aspect & Suffix Shift
              </span>
              <span className="text-2xl font-extrabold text-amber-400 font-mono">
                {selectedPair.morphemicShiftPct}%
              </span>
              <span className="text-[11px] text-stone-400 block mt-1">
                Progressive & Case Inflection Divergence
              </span>
            </div>

            <div className="bg-stone-900/80 p-3.5 rounded-lg border border-stone-800">
              <span className="text-[10px] uppercase font-mono text-stone-400 block mb-1">
                Composite Divergence Score
              </span>
              <span className="text-2xl font-extrabold text-indigo-400 font-mono">
                {selectedPair.surfaceDivergencePct}%
              </span>
              <span className="text-[11px] text-stone-400 block mt-1">
                Weighted Linguistic Distance
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 text-center text-xs text-stone-500 py-3 font-mono">
          Click any percentage cell in the matrix above to inspect root cognacy vs. suffixal shifts
        </div>
      )}
    </div>
  );
};
