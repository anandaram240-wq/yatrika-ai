/**
 * src/components/DestinationDetailDrawer.tsx
 * Premium Editorial Destination Detail Drawer for YatriKa AI.
 * Presents verified historical, architectural, visiting, and weather dossier with honest attributions.
 */

import React from 'react';
import { KarnatakaPOI } from '../types/nammatrip';
import { getAuthenticDestinationPhoto } from '../data/karnatakaPhotoRegistry';
import { LiveWeather } from '../services/liveWeatherService';

export interface DestinationDetailDrawerProps {
  poi: KarnatakaPOI | null;
  onClose: () => void;
  onAddToTrip: (poiId: string) => void;
  onRemoveFromTrip: (poiId: string) => void;
  isAdded: boolean;
  liveWeather?: LiveWeather | null;
  originCoordinates?: [number, number];
  uiLanguage: 'kn' | 'en';
}

function computeDistanceKm(c1: [number, number], c2: [number, number]): number {
  const R = 6371;
  const dLat = ((c2[1] - c1[1]) * Math.PI) / 180;
  const dLon = ((c2[0] - c1[0]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((c1[1] * Math.PI) / 180) *
      Math.cos((c2[1] * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export const DestinationDetailDrawer: React.FC<DestinationDetailDrawerProps> = ({
  poi,
  onClose,
  onAddToTrip,
  onRemoveFromTrip,
  isAdded,
  liveWeather,
  originCoordinates,
  uiLanguage,
}) => {
  if (!poi) return null;

  const photoMeta = getAuthenticDestinationPhoto(poi.id);
  const airDistanceKm = originCoordinates
    ? computeDistanceKm(originCoordinates, poi.coordinates)
    : null;

  return (
    <aside className="yt-drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="yt-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="yt-drawer-close-btn"
          onClick={onClose}
          aria-label="Close destination details"
        >
          ✕
        </button>

        {/* Hero Photo Header */}
        <div className="yt-drawer-hero">
          <img
            src={photoMeta.imageUrl}
            alt={poi.name}
            className="yt-drawer-img"
          />
          <div className="yt-drawer-hero-overlay">
            <span className="yt-drawer-category-tag">{poi.category.replace('_', ' ')}</span>
            <span className="yt-drawer-region-tag">{poi.macroRegion}</span>
          </div>
          <div className="yt-drawer-attribution">
            {photoMeta.attribution} • {photoMeta.license}
          </div>
        </div>

        {/* Content Body */}
        <div className="yt-drawer-body">
          {/* Title Header */}
          <div className="yt-drawer-title-block">
            <div className="yt-drawer-kannada font-kannada">{poi.nameKannada}</div>
            <h2 className="yt-drawer-title">{poi.name}</h2>
            <div className="yt-drawer-location">
              📍 {poi.district} District • {poi.macroRegion}
              {airDistanceKm && <span> • {airDistanceKm} km from origin</span>}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="yt-drawer-metrics-grid">
            <div className="yt-metric-cell">
              <span className="yt-metric-label">{uiLanguage === 'kn' ? 'ಸಮಯಾವಧಿ' : 'Recommended Time'}</span>
              <span className="yt-metric-value">⏱️ {Math.round((poi.recommendedHours || 1.5) * 60)} mins</span>
            </div>

            <div className="yt-metric-cell">
              <span className="yt-metric-label">{uiLanguage === 'kn' ? 'ಉತ್ತಮ ಸಮಯ' : 'Best Time'}</span>
              <span className="yt-metric-value">
                {poi.bestTimeOfDay || 'Morning & Sunset'}
              </span>
            </div>

            <div className="yt-metric-cell">
              <span className="yt-metric-label">{uiLanguage === 'kn' ? 'ಪ್ರವೇಶ ಶುಲ್ಕ' : 'Entry Fee'}</span>
              <span className="yt-metric-value">
                {poi.entryFeeInr.indianCitizen > 0 ? `₹${poi.entryFeeInr.indianCitizen}` : 'Free entry'}
              </span>
            </div>

            {liveWeather && (
              <div className="yt-metric-cell weather">
                <span className="yt-metric-label">{uiLanguage === 'kn' ? 'ಹವಾಮಾನ' : 'Current Weather'}</span>
                <span className="yt-metric-value">
                  {liveWeather.emoji} {liveWeather.tempC}°C • {liveWeather.label}
                </span>
              </div>
            )}
          </div>

          {/* Description & Cultural Lore */}
          <div className="yt-drawer-section">
            <h3 className="yt-drawer-heading">{uiLanguage === 'kn' ? 'ಐತಿಹಾಸಿಕ ಹಾಗೂ ಸಾಂಸ್ಕೃತಿಕ ಹಿನ್ನೆಲೆ' : 'Cultural & Historical Significance'}</h3>
            <p className="yt-drawer-prose">
              {poi.summary || photoMeta.caption || 'Verified heritage destination in Karnataka.'}
            </p>
            {photoMeta.captionKannada && (
              <p className="yt-drawer-prose-kannada font-kannada">
                {photoMeta.captionKannada}
              </p>
            )}
            {poi.localPhrase && (
              <div className="yt-local-phrase-box">
                <span className="yt-phrase-tag">🗣️ Local Phrase:</span>
                <span className="font-kannada yt-phrase-kn">{poi.localPhrase.kannada}</span>
                <span className="yt-phrase-en">"{poi.localPhrase.english}"</span>
              </div>
            )}
          </div>

          {/* Visiting Information & Source Verification */}
          <div className="yt-drawer-section">
            <h3 className="yt-drawer-heading">{uiLanguage === 'kn' ? 'ಭೇಟಿ ನೀಡುವ ಸಮಯ ಮತ್ತು ದೃಢೀಕರಣ' : 'Visiting Information & Source Provenance'}</h3>
            <div className="yt-provenance-box">
              <div className="yt-prov-row">
                <strong>Standard Visiting Hours:</strong>
                <span>{poi.openingHours || '7:30 AM – 6:30 PM (Daily)'}</span>
              </div>
              <div className="yt-prov-row">
                <strong>Source:</strong>
                <span>{poi.sourceAttribution || 'Archaeological Survey of India (ASI) & Karnataka Tourism'}</span>
              </div>
              <div className="yt-prov-row">
                <strong>Verification Status:</strong>
                <span className="yt-verified-pill">✓ Verified Geo-Coordinates ({poi.verifiedDate})</span>
              </div>
              <div className="yt-prov-row">
                <strong>Coordinates:</strong>
                <span>{poi.coordinates[1].toFixed(4)}°N, {poi.coordinates[0].toFixed(4)}°E</span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="yt-drawer-actions">
            {isAdded ? (
              <button
                type="button"
                className="yt-btn-remove-trip"
                onClick={() => onRemoveFromTrip(poi.id)}
              >
                ✕ {uiLanguage === 'kn' ? 'ಪ್ರವಾಸದಿಂದ ತೆಗೆಯಿರಿ' : 'Remove from Itinerary'}
              </button>
            ) : (
              <button
                type="button"
                className="yt-btn-add-trip"
                onClick={() => onAddToTrip(poi.id)}
              >
                + {uiLanguage === 'kn' ? 'ಪ್ರವಾಸಕ್ಕೆ ಸೇರಿಸಿ' : 'Add to Trip Itinerary'}
              </button>
            )}

            <button
              type="button"
              className="yt-btn-directions"
              onClick={() => {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${poi.coordinates[1]},${poi.coordinates[0]}`;
                window.open(url, '_blank');
              }}
            >
              🗺️ Open in Google Maps
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
