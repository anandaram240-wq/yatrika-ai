/**
 * @file src/components/ui/InformationRow.tsx
 * @description Structured key-value row component for destination facts and railway dossiers.
 * Replaces unstructured paragraphs with scannable, verifiable data points.
 * @theme Code. Create. Celebrate Kannada.
 */

import React from 'react';

export interface InformationRowProps {
  label: string;
  kannadaLabel?: string;
  value: React.ReactNode;
  note?: string;
  source?: string;
  verified?: boolean;
  className?: string;
}

export const InformationRow: React.FC<InformationRowProps> = ({
  label,
  kannadaLabel,
  value,
  note,
  source,
  verified = false,
  className = '',
}) => {
  return (
    <div className={`py-2.5 border-b border-[#F4EFEA] last:border-b-0 text-xs ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
        <div className="flex items-center gap-1.5 shrink-0 text-[#7A7369]">
          <span>{label}</span>
          {kannadaLabel && <span className="font-kannada text-[11px] opacity-85">({kannadaLabel})</span>}
          {verified && (
            <span className="text-[10px] text-[#166534] bg-[#DCFCE7] px-1 rounded font-semibold" title="Verified against official records">
              ✓
            </span>
          )}
        </div>
        <div className="font-medium text-[#1A1714] text-right sm:max-w-[65%]">
          {value}
        </div>
      </div>
      {note && (
        <p className="text-[11px] text-[#8C8275] mt-1 leading-normal pl-0 sm:pl-1">
          {note}
        </p>
      )}
      {source && (
        <p className="text-[10px] text-[#A89F91] mt-0.5 font-mono italic">
          ಮೂಲ (Source): {source}
        </p>
      )}
    </div>
  );
};
