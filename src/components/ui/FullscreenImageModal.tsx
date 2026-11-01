/**
 * @file src/components/ui/FullscreenImageModal.tsx
 * @description Accessible full-screen image viewer with keyboard dismissal.
 * @theme Code. Create. Celebrate Kannada.
 */

import React, { useEffect } from 'react';
import { IconButton } from './Buttons';

export interface FullscreenImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageAlt: string;
  caption?: string;
  attribution?: string;
  license?: string;
}

export const FullscreenImageModal: React.FC<FullscreenImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  imageAlt,
  caption,
  attribution,
  license,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label={`Full screen image: ${imageAlt}`}
      onClick={onClose}
    >
      <div className="absolute top-4 right-4 z-10">
        <IconButton
          icon="✕"
          ariaLabel="Close full-screen image view"
          variant="glass"
          size="lg"
          onClick={onClose}
        />
      </div>

      <div
        className="relative max-w-5xl max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={imageAlt}
          className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-white/10"
        />
        {(caption || attribution) && (
          <div className="mt-3 text-center text-white/90 text-xs max-w-2xl px-4 py-2 bg-black/50 rounded-lg backdrop-blur-xs">
            {caption && <p className="font-medium text-sm text-white mb-0.5">{caption}</p>}
            {attribution && (
              <p className="text-[11px] text-white/70">
                {attribution} {license && `• ${license}`}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
