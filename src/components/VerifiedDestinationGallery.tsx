/**
 * @file src/components/VerifiedDestinationGallery.tsx
 * @description Magazine-grade responsive photograph viewer with strict provenance disclosure.
 * @theme Code. Create. Celebrate Kannada.
 */

import React, { useState } from 'react';
import { VerifiedPhotoRecord } from '../data/media/karnatakaPhotoRegistry';
import { ImageProvenanceService } from '../services/imageProvenanceService';

interface VerifiedDestinationGalleryProps {
  photo: VerifiedPhotoRecord;
  className?: string;
}

export const VerifiedDestinationGallery: React.FC<VerifiedDestinationGalleryProps> = ({
  photo,
  className = '',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showProvenanceInfo, setShowProvenanceInfo] = useState(false);

  const srcSet = ImageProvenanceService.generateSrcSet(photo.originalMediaUrl);

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#1A1714] ${className}`}>
      {/* Background / Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-[#2C2723] animate-pulse flex items-center justify-center text-[#A69E94] text-xs">
          <span>ಛಾಯಾಚಿತ್ರ ಲೋಡ್ ಆಗುತ್ತಿದೆ... (Loading verified photo)</span>
        </div>
      )}

      {hasError ? (
        <div className="h-64 flex flex-col items-center justify-center p-6 text-center text-[#A69E94] bg-[#221E1A]">
          <span className="text-3xl mb-2">🏛️</span>
          <p className="font-serif text-sm">{photo.name}</p>
          <span className="text-xs text-[#7A7369] mt-1">ಛಾಯಾಚಿತ್ರ ತಾತ್ಕಾಲಿಕವಾಗಿ ಲಭ್ಯವಿಲ್ಲ (Photo unavailable)</span>
        </div>
      ) : (
        <img
          src={photo.originalMediaUrl}
          srcSet={srcSet}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
          alt={photo.caption || photo.name}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Caption & Attribution Overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
        <p className="font-serif text-sm font-medium tracking-wide drop-shadow-sm">{photo.caption}</p>
        <p className="text-xs text-[#E8DFD3] font-kannada mt-0.5 opacity-90">{photo.captionKannada}</p>

        {/* Provenance Footer */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/15 text-[11px] text-white/80">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400">✓</span>
            <span className="truncate max-w-[240px]">{photo.attribution}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowProvenanceInfo(!showProvenanceInfo)}
            className="text-[10px] bg-white/20 hover:bg-white/30 backdrop-blur-md px-2 py-0.5 rounded text-white transition-colors"
          >
            {showProvenanceInfo ? 'Hide Provenance' : 'ಪರವಾನಗಿ ವಿವರ (License)'}
          </button>
        </div>

        {/* Slide-down Provenance Details Drawer */}
        {showProvenanceInfo && (
          <div className="mt-2 p-2.5 rounded-lg bg-black/85 backdrop-blur-md border border-white/20 text-[10px] space-y-1">
            <p><strong>ಹಕ್ಕುಸ್ವಾಮ್ಯ (License):</strong> {photo.license}</p>
            <p><strong>ಮೂಲ (Source):</strong> {photo.source}</p>
            <p><strong>ಭೌಗೋಳಿಕ ದೃಢೀಕರಣ:</strong> {photo.geographicMatchNotes}</p>
            <p className="text-emerald-300">✓ AI-ಮುಕ್ತ ಅಧಿಕೃತ ಛಾಯಾಚಿತ್ರ (Non-AI verified real image)</p>
          </div>
        )}
      </div>
    </div>
  );
};
