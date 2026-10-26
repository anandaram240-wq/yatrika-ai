import React from 'react';
import { ConceptCoverage, RegionMatrixSlotId } from '../types';
import { REGION_SLOT_DEFINITIONS } from '../data/dataset';
import { AlertCircle, PlusCircle, CheckCircle2, Share2, Layers } from 'lucide-react';

interface KnowledgeGapRibbonProps {
  coverage: ConceptCoverage;
  onSelectSlot?: (slotKey: RegionMatrixSlotId) => void;
  onContributeFieldwork?: (slotKey: RegionMatrixSlotId, slotName: string) => void;
}

export const KnowledgeGapRibbon: React.FC<KnowledgeGapRibbonProps> = ({
  coverage,
  onSelectSlot,
  onContributeFieldwork,
}) => {
  const slotKeys: RegionMatrixSlotId[] = [
    'old_mysuru_southern',
    'kittur_karnataka',
    'kalyana_karnataka',
    'karavali_coastal',
    'malnad',
    'central_border_cluster',
  ];

  let distinctCount = 0;
  let sharedCount = 0;
  let multiCount = 0;
  let gapCount = 0;

  slotKeys.forEach((key) => {
    const st = coverage.region_matrix_states[key]?.status;
    if (st === 'distinct_regional_variant') distinctCount++;
    else if (st === 'shared_with_standard') sharedCount++;
    else if (st === 'documented_multi_region') multiCount++;
    else if (st === 'no_verified_distinct_variant') gapCount++;
  });

  return (
    <div className="bg-stone-50/90 border border-stone-200/90 rounded-3xl p-4 sm:p-5 mb-6">
      {/* Ribbon Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-200 text-amber-900">
              <Layers className="w-3.5 h-3.5" />
            </span>
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-800">
              Regional Knowledge-Gap & Isogloss Distribution
            </h4>
          </div>
          <p className="text-3xs text-stone-500 mt-0.5">
            Macro-regional status across Karnataka's 6 linguistic zones. Open gaps invite documented community fieldwork.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-3xs font-bold">
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            {distinctCount} Distinct
          </span>
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            {multiCount} Multi-Region
          </span>
          <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 border border-stone-300">
            {sharedCount} Standard Shared
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            {gapCount} Open Gaps
          </span>
        </div>
      </div>

      {/* 6 Macro-Region Mini Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {slotKeys.map((key) => {
          const slotDef = REGION_SLOT_DEFINITIONS[key];
          const slotState = coverage.region_matrix_states[key];
          const isGap = slotState.status === 'no_verified_distinct_variant';
          const isDistinct = slotState.status === 'distinct_regional_variant';
          const isMulti = slotState.status === 'documented_multi_region';

          return (
            <div
              key={key}
              onClick={() => onSelectSlot && onSelectSlot(key)}
              className={`rounded-2xl p-2.5 flex flex-col justify-between transition-all border text-left cursor-pointer ${
                isGap
                  ? 'border-dashed border-amber-300 bg-amber-50/60 hover:bg-amber-100/70'
                  : isDistinct
                  ? 'border-emerald-200 bg-white hover:border-emerald-400 hover:shadow-xs'
                  : isMulti
                  ? 'border-blue-200 bg-white hover:border-blue-400 hover:shadow-xs'
                  : 'border-stone-200 bg-stone-100/60 hover:bg-stone-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-3xs font-extrabold text-stone-800 truncate" title={slotDef.name}>
                    {slotDef.name.replace(' Karnataka', '').replace('Cluster', '')}
                  </span>
                  {isGap ? (
                    <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                  ) : isDistinct ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  ) : isMulti ? (
                    <Share2 className="w-3 h-3 text-blue-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3 text-stone-500 shrink-0" />
                  )}
                </div>

                <div className="text-4xs text-stone-500 font-kannada truncate" lang="kn">
                  {slotDef.kannadaName}
                </div>
              </div>

              <div className="mt-2 pt-1.5 border-t border-stone-200/50">
                {isGap ? (
                  <button
                    onClick={() => onContributeFieldwork && onContributeFieldwork(key, slotDef.name)}
                    className="w-full flex items-center justify-center gap-1 px-1.5 py-1 rounded-lg text-4xs font-black bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer"
                    title={`Contribute verified local field observation for ${slotDef.name}`}
                  >
                    <PlusCircle className="w-2.5 h-2.5" />
                    <span>Log Fieldwork</span>
                  </button>
                ) : (
                  <span
                    className={`block text-center text-4xs font-bold uppercase tracking-tight py-0.5 rounded ${
                      isDistinct
                        ? 'bg-emerald-100 text-emerald-800'
                        : isMulti
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {isDistinct ? 'Distinct' : isMulti ? 'Multi-Reg' : 'Standard'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
