// src/components/media/VerifiedCommonsImage.tsx
import React, { useState } from 'react';
import { VerifiedMediaAsset } from '../../data/hampiVerifiedRegistry';

interface Props {
  asset: VerifiedMediaAsset;
  isHero?: boolean;
}

export const VerifiedCommonsImage: React.FC<Props> = ({ asset, isHero = false }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const srcSetParts = [
    `${asset.thumbSrcSet.w640} 640w`,
    `${asset.thumbSrcSet.w1280} 1280w`,
    `${asset.thumbSrcSet.w2560} 2560w`,
  ];
  if (asset.thumbSrcSet.w3840 && asset.originalWidth >= 3840) {
    srcSetParts.push(`${asset.thumbSrcSet.w3840} 3840w`);
  }

  return (
    <>
      <figure className="relative overflow-hidden rounded-xl border border-white/15 bg-[#151a23]">
        <img
          src={asset.thumbSrcSet.w1280}
          srcSet={srcSetParts.join(', ')}
          sizes={isHero ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
          alt={asset.title}
          loading={isHero ? 'eager' : 'lazy'}
          style={{ objectPosition: asset.focalPoint }}
          className={`w-full object-cover ${isHero ? 'h-72 md:h-96' : 'h-56'} cursor-zoom-in`}
          onClick={() => setIsFullscreen(true)}
        />
        <figcaption className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-[11px] text-[#b0b8c5] bg-[#0c0f14]/90 border-t border-white/10">
          <span>
            <strong>{asset.title}</strong> · Photo: {asset.photographer} ({asset.originalWidth}×{asset.originalHeight}px)
          </span>
          <div className="flex items-center gap-2">
            <a
              href={asset.licenseUrl}
              target="_blank"
              rel="noreferrer"
              className="underline text-emerald-400"
            >
              {asset.license}
            </a>
            <a
              href={asset.commonsPageUrl}
              target="_blank"
              rel="noreferrer"
              className="underline text-[#d97736]"
            >
              Wikimedia Source
            </a>
          </div>
        </figcaption>
      </figure>

      {isFullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
        >
          <div className="w-full max-w-6xl flex justify-between items-center mb-3 text-xs text-white">
            <span>
              {asset.title} — {asset.photographer} ({asset.license})
            </span>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="px-3 py-1 rounded bg-white/15 hover:bg-white/25 text-white font-semibold"
            >
              Close Fullscreen (ESC)
            </button>
          </div>
          <img
            src={asset.originalUrl}
            alt={asset.title}
            className="max-h-[82vh] max-w-full object-contain rounded-lg"
          />
        </div>
      )}
    </>
  );
};

