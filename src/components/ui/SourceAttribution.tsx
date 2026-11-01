/**
 * @file src/components/ui/SourceAttribution.tsx
 * @description Legible, non-intrusive photographic and archival source attribution overlay.
 * @theme Code. Create. Celebrate Kannada.
 */

import React from 'react';

export interface SourceAttributionProps {
  attribution: string;
  license: string;
  sourceUrl?: string;
  className?: string;
}

export const SourceAttribution: React.FC<SourceAttributionProps> = ({
  attribution,
  license,
  sourceUrl,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-black/65 backdrop-blur-md text-white/90 text-[11px] px-2.5 py-1 rounded-lg border border-white/15 select-none ${className}`}
    >
      <span className="opacity-80">📷</span>
      <span className="truncate max-w-[240px] sm:max-w-[320px]">{attribution}</span>
      <span className="opacity-50">•</span>
      <span className="font-mono text-[10px] font-semibold text-emerald-300">{license}</span>
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 text-white/70 hover:text-white underline text-[10px]"
          title="Open Wikimedia Commons source record"
        >
          ಮೂಲ ↗
        </a>
      )}
    </div>
  );
};
