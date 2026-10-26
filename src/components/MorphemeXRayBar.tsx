import React, { useState } from 'react';
import { MorphemeSlot } from '../types';
import { Layers, Sparkles, X } from 'lucide-react';

interface MorphemeXRayBarProps {
  decomposition?: MorphemeSlot[];
}

export const MorphemeXRayBar: React.FC<MorphemeXRayBarProps> = ({
  decomposition,
}) => {
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);

  if (!decomposition || decomposition.length === 0) {
    return null;
  }

  const activeSlot = decomposition.find((s) => s.slot_id === activeSlotId);

  const getSlotColor = (slot: MorphemeSlot, isSelected: boolean) => {
    if (slot.is_invariant_root) {
      return isSelected
        ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-300'
        : 'bg-emerald-50 text-emerald-950 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400';
    }
    if (slot.shift_category === 'aspect_morphology') {
      return isSelected
        ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm ring-2 ring-indigo-300'
        : 'bg-indigo-50 text-indigo-950 border-indigo-300 hover:bg-indigo-100 hover:border-indigo-400';
    }
    if (slot.shift_category === 'phonological_shift') {
      return isSelected
        ? 'bg-amber-600 text-white border-amber-700 shadow-sm ring-2 ring-amber-300'
        : 'bg-amber-50 text-amber-950 border-amber-300 hover:bg-amber-100 hover:border-amber-400';
    }
    if (slot.shift_category === 'lexical_replacement') {
      return isSelected
        ? 'bg-rose-600 text-white border-rose-700 shadow-sm ring-2 ring-rose-300'
        : 'bg-rose-50 text-rose-950 border-rose-300 hover:bg-rose-100 hover:border-rose-400';
    }
    return isSelected
      ? 'bg-stone-700 text-white border-stone-800 shadow-sm ring-2 ring-stone-300'
      : 'bg-stone-50 text-stone-900 border-stone-300 hover:bg-stone-100 hover:border-stone-400';
  };

  return (
    <div className="mt-3 pt-2.5 border-t border-stone-200/80">
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <div className="flex items-center gap-1.5 text-3xs font-extrabold uppercase tracking-wider text-stone-600">
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          <span>Morpheme-Shift X-Ray</span>
        </div>
        <span className="text-4xs text-stone-400 font-mono">
          Click slot to inspect underlying shift
        </span>
      </div>

      {/* Slots Row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {decomposition.map((slot) => {
          const isSelected = activeSlotId === slot.slot_id;
          return (
            <button
              key={slot.slot_id}
              onClick={() => setActiveSlotId(isSelected ? null : slot.slot_id)}
              className={`flex flex-col items-start px-2 py-1 rounded-xl border text-left transition-all cursor-pointer ${getSlotColor(
                slot,
                isSelected
              )}`}
              title={`Click to inspect morpheme slot: ${slot.slot_label}`}
            >
              <div className="flex items-center gap-1 w-full justify-between">
                <span
                  className="font-kannada font-bold text-xs leading-snug"
                  lang="kn"
                >
                  {slot.surface_kn}
                </span>
                {slot.is_invariant_root ? (
                  <span className={`text-4xs px-1 py-0.2 rounded font-black uppercase tracking-tight ${
                    isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-200 text-emerald-900'
                  }`}>
                    ROOT
                  </span>
                ) : (
                  <span className={`text-4xs px-1 py-0.2 rounded font-mono font-medium ${
                    isSelected ? 'bg-stone-800 text-stone-200' : 'bg-stone-200/70 text-stone-700'
                  }`}>
                    {slot.shift_category === 'aspect_morphology'
                      ? 'ASPECT'
                      : slot.shift_category === 'phonological_shift'
                      ? 'SHIFT'
                      : slot.shift_category === 'lexical_replacement'
                      ? 'LEX'
                      : 'SLOT'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-3xs font-mono opacity-85">
                  {slot.surface_iso}
                </span>
                <span className="text-3xs opacity-75 font-medium truncate max-w-[80px]">
                  • {slot.gloss_en}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Slot Callout Details */}
      {activeSlot && (
        <div className="mt-2 p-2.5 rounded-2xl bg-stone-900 text-stone-100 text-xs shadow-lg animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-stone-800">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <strong className="text-amber-300 font-bold text-xs">
                {activeSlot.slot_label}
              </strong>
              {activeSlot.is_invariant_root ? (
                <span className="px-1.5 py-0.5 rounded-md text-3xs font-black bg-emerald-700 text-emerald-100">
                  Invariant Dravidian Root
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded-md text-3xs font-bold bg-stone-800 text-stone-300 uppercase">
                  {activeSlot.shift_category.replace('_', ' ')}
                </span>
              )}
            </div>
            <button
              onClick={() => setActiveSlotId(null)}
              className="text-stone-400 hover:text-stone-100 p-0.5 cursor-pointer"
              title="Close inspector"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 text-2xs">
            <div className="flex items-center gap-2">
              <span className="text-stone-400">Surface vs. Underlying:</span>
              <span className="font-kannada font-bold text-stone-200" lang="kn">
                {activeSlot.surface_kn}
              </span>
              <span className="font-mono text-amber-200">
                /{activeSlot.surface_iso}/
              </span>
              <span className="text-stone-400">←</span>
              <code className="font-mono text-stone-300 bg-stone-800 px-1 py-0.5 rounded text-3xs">
                {activeSlot.underlying_form}
              </code>
            </div>

            <p className="text-stone-300 leading-relaxed pt-0.5">
              {activeSlot.shift_explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
