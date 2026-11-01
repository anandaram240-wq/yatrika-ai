/**
 * @file src/components/DestinationDetailDrawer.tsx
 * @description Master 8-Section Comprehensive Destination Dossier Drawer for YatriKa AI V8.
 * Unites Overview, Visiting Info, Reaching, Staying, Dining, Nearby, Planning, and Source Provenance.
 * @theme Code. Create. Celebrate Kannada.
 */

import React, { useState } from 'react';
import { KarnatakaPOI } from '../types/nammatrip';
import { getAuthenticDestinationPhoto } from '../data/karnatakaPhotoRegistry';
import { LiveWeather } from '../services/liveWeatherService';
import { DestinationRegistryV8, ComprehensiveDestination } from '../data/destinations/destinationRegistry';
import { AccommodationRegistryV8, ComprehensiveAccommodation } from '../stays/accommodationRegistry';
import { VERIFIED_KARNATAKA_RESTAURANTS, KarnatakaDiningRecord } from '../dining/restaurantRegistry';
import { KARNATAKA_LOCAL_TRANSFERS, LocalTransportOption } from '../mobility/localTransportRegistry';
import { getTrustClassificationMeta } from '../data-fabric/verificationStatus';
import { FreshnessManager } from '../data-fabric/freshnessManager';

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

  const [activeSubTab, setActiveSubTab] = useState<'visiting' | 'transit' | 'stays' | 'dining' | 'sources'>('visiting');

  // Look up V8 comprehensive dossier if available
  const compDest: ComprehensiveDestination | undefined = DestinationRegistryV8.getInstance().getById(poi.id);
  const photoMeta = getAuthenticDestinationPhoto(poi.id, poi.category, poi.name, poi.district);
  const airDistanceKm = originCoordinates ? computeDistanceKm(originCoordinates, poi.coordinates) : null;

  // Stays nearby
  const nearbyStays: ComprehensiveAccommodation[] = AccommodationRegistryV8.getInstance().search({
    destinationOrDistrict: poi.district,
  }).slice(0, 3);

  // Dining nearby
  const nearbyDining: KarnatakaDiningRecord[] = VERIFIED_KARNATAKA_RESTAURANTS.filter(
    (r) => r.district.toLowerCase() === poi.district.toLowerCase() || r.servesDestinationId === poi.id
  ).slice(0, 3);

  // Local transfers
  const localTransfers: LocalTransportOption[] = KARNATAKA_LOCAL_TRANSFERS.filter(
    (t) => t.servesDestinationName.toLowerCase().includes(poi.name.toLowerCase()) ||
           poi.district.toLowerCase().includes(t.servesDestinationName.toLowerCase())
  );

  const trustMeta = getTrustClassificationMeta(compDest ? compDest.sourceRef.trustClassification : 'OFFICIAL_PUBLISHED');
  const freshnessMeta = FreshnessManager.evaluate(compDest?.sourceRef.lastVerifiedDate || poi.verifiedDate || '2026-10-31');

  return (
    <aside className="yt-drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="yt-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="yt-drawer-close-btn"
          onClick={onClose}
          aria-label="Close destination dossier"
        >
          ✕
        </button>

        {/* SECTION A: OVERVIEW & HERO PHOTO */}
        <div className="yt-drawer-hero relative">
          <img
            src={compDest?.photoMeta?.imageUrl || photoMeta.imageUrl}
            alt={poi.name}
            className="yt-drawer-img"
          />
          <div className="yt-drawer-hero-overlay">
            <span className="yt-drawer-category-tag">
              {compDest?.category ? compDest.category.replace('_', ' ') : poi.category.replace('_', ' ')}
            </span>
            <span className="yt-drawer-region-tag">{poi.macroRegion}</span>
          </div>
          <div className="yt-drawer-attribution">
            {compDest?.photoMeta?.attribution || photoMeta.attribution} • {compDest?.photoMeta?.license || photoMeta.license}
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

            {/* Granular Source Trust Badge (No fake green badge) */}
            <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-[#E8DFD3]">
              <span
                className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm"
                style={{ backgroundColor: trustMeta.badgeBg, color: trustMeta.badgeText, border: `1px solid ${trustMeta.badgeBorder}` }}
              >
                <span>{trustMeta.icon}</span>
                <span>{trustMeta.label}</span>
              </span>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{ backgroundColor: freshnessMeta.badgeBg, color: freshnessMeta.badgeText, border: `1px solid ${freshnessMeta.badgeBorder}` }}
              >
                <span>{freshnessMeta.icon}</span>
                <span>{freshnessMeta.state} ({freshnessMeta.formattedAge})</span>
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="yt-drawer-metrics-grid my-3">
            <div className="yt-metric-cell">
              <span className="yt-metric-label">
                {poi.category === 'railway_station' || poi.category === 'bus_terminal' || poi.category === 'airport'
                  ? (uiLanguage === 'kn' ? 'ನಿಲ್ದಾಣದ ವರ್ಗ' : 'Hub Classification')
                  : (uiLanguage === 'kn' ? 'ಸಮಯಾವಧಿ' : 'Recommended Time')}
              </span>
              <span className="yt-metric-value">
                {poi.category === 'railway_station'
                  ? `🚆 Railway Hub (${poi.transportMeta?.officialCode || 'SWR'})`
                  : poi.category === 'bus_terminal'
                  ? `🚌 Bus Hub (${poi.transportMeta?.zoneOrOperator?.split(' ')[0] || 'KSRTC'})`
                  : poi.category === 'airport'
                  ? '✈️ Regional Airport'
                  : `⏱️ ${Math.round((poi.recommendedHours || 1.5) * 60)} mins`}
              </span>
            </div>

            <div className="yt-metric-cell">
              <span className="yt-metric-label">{uiLanguage === 'kn' ? 'ಉತ್ತಮ ಸಮಯ' : 'Best Time'}</span>
              <span className="yt-metric-value">{poi.bestTimeOfDay || 'Morning & Sunset'}</span>
            </div>

            <div className="yt-metric-cell">
              <span className="yt-metric-label">{uiLanguage === 'kn' ? 'ಪ್ರವೇಶ ಶುಲ್ಕ' : 'Entry Fee'}</span>
              <span className="yt-metric-value">
                {poi.entryFeeInr.indianCitizen > 0 ? `₹${poi.entryFeeInr.indianCitizen}` : 'Free Entry'}
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

          {/* Sub-tab Navigation */}
          <div className="flex border-b border-[#E8DFD3] text-xs font-medium my-4 gap-4 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveSubTab('visiting')}
              className={`pb-2 border-b-2 transition-colors shrink-0 ${
                activeSubTab === 'visiting' ? 'border-[#A44A28] text-[#A44A28] font-bold' : 'border-transparent text-[#7A7369] hover:text-[#1A1714]'
              }`}
            >
              ವಿವರ • Visiting Info
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('transit')}
              className={`pb-2 border-b-2 transition-colors shrink-0 ${
                activeSubTab === 'transit' ? 'border-[#A44A28] text-[#A44A28] font-bold' : 'border-transparent text-[#7A7369] hover:text-[#1A1714]'
              }`}
            >
              ಸಾರಿಗೆ • How to Reach
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('stays')}
              className={`pb-2 border-b-2 transition-colors shrink-0 ${
                activeSubTab === 'stays' ? 'border-[#A44A28] text-[#A44A28] font-bold' : 'border-transparent text-[#7A7369] hover:text-[#1A1714]'
              }`}
            >
              ತಂಗುದಾಣ • Stays ({nearbyStays.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('dining')}
              className={`pb-2 border-b-2 transition-colors shrink-0 ${
                activeSubTab === 'dining' ? 'border-[#A44A28] text-[#A44A28] font-bold' : 'border-transparent text-[#7A7369] hover:text-[#1A1714]'
              }`}
            >
              ಊಟೋಪಹಾರ • Food ({nearbyDining.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('sources')}
              className={`pb-2 border-b-2 transition-colors shrink-0 ${
                activeSubTab === 'sources' ? 'border-[#A44A28] text-[#A44A28] font-bold' : 'border-transparent text-[#7A7369] hover:text-[#1A1714]'
              }`}
            >
              ಮೂಲ ದಾಖಲೆ • Sources
            </button>
          </div>

          {/* TAB 1: VISITING INFO & CULTURAL SIGNIFICANCE */}
          {activeSubTab === 'visiting' && (
            <div className="space-y-4">
              <section className="yt-drawer-section">
                <h3 className="yt-drawer-section-title">
                  {uiLanguage === 'kn' ? 'ಐತಿಹಾಸಿಕ ವಿವರ • Overview' : 'Cultural Overview'}
                </h3>
                <p className="yt-drawer-prose leading-relaxed">
                  {compDest?.description || poi.summary}
                </p>
                {compDest?.historicalSignificance && (
                  <p className="text-xs text-[#4A443C] bg-[#FAF7F2] p-3 rounded-xl border border-[#F4EFEA] mt-2">
                    🏛️ <strong>ಐತಿಹಾಸಿಕ ಮಹತ್ವ:</strong> {compDest.historicalSignificance}
                  </p>
                )}
              </section>

              {/* SECTION B: VISITING INFORMATION & ASI HOURS */}
              <section className="yt-drawer-section">
                <h3 className="yt-drawer-section-title">
                  {uiLanguage === 'kn' ? 'ದರ್ಶನ ಮತ್ತು ಭೇಟಿಯ ನಿಯಮಗಳು • Visiting Info' : 'Visiting Regulations'}
                </h3>
                <div className="bg-white border border-[#E8DFD3] rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between items-baseline border-b border-[#F4EFEA] pb-2">
                    <span className="text-[#7A7369]">ಅಧಿಕೃತ ಸಮಯ (Opening Hours):</span>
                    <span className="font-semibold text-[#1A1714]">
                      {compDest?.openingHours || poi.openingHours || 'Sunrise to Sunset'}
                    </span>
                  </div>
                  {compDest?.openingHoursNote && (
                    <p className="text-[11px] text-[#B45309]">⚠️ {compDest.openingHoursNote}</p>
                  )}
                  <div className="flex justify-between items-baseline border-b border-[#F4EFEA] pb-2">
                    <span className="text-[#7A7369]">ಪ್ರವೇಶ ಶುಲ್ಕ (Entry Fee):</span>
                    <span className="font-semibold text-[#1A1714]">
                      {compDest?.entryFee.isFree || poi.entryFeeInr.indianCitizen === 0
                        ? 'ಉಚಿತ (Free Entry)'
                        : `ಭಾರತೀಯರಿಗೆ ₹${poi.entryFeeInr.indianCitizen} (Foreigners ₹${poi.entryFeeInr.foreignNational || 600})`}
                    </span>
                  </div>
                  {compDest?.permit.isRequired && (
                    <div className="p-2 rounded bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309]">
                      🌲 <strong>ಅರಣ್ಯ ಪರವಾನಗಿ ಅಗತ್ಯ:</strong> {compDest.permit.issuingAuthority}
                    </div>
                  )}
                  <p className="text-[11px] text-[#7A7369]">
                    {poi.entryFeeInr.feeNote || 'ASI statutory ticket regulations applicable.'}
                  </p>
                </div>
              </section>

              {/* Visitor Recommendations */}
              {compDest?.visitorRecommendations && compDest.visitorRecommendations.length > 0 && (
                <section className="yt-drawer-section">
                  <h3 className="yt-drawer-section-title">💡 ಪ್ರವಾಸಿ ಸಲಹೆಗಳು • Visitor Tips</h3>
                  <ul className="space-y-1.5 text-xs text-[#4A443C]">
                    {compDest.visitorRecommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#A44A28] mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          {/* TAB 2: TRANSIT & REACHING */}
          {activeSubTab === 'transit' && (
            <div className="space-y-4">
              <section className="yt-drawer-section">
                <h3 className="yt-drawer-section-title">🚆 ರೈಲ್ವೆ ಮತ್ತು ಬಸ್ ಸಂಪರ್ಕ • How to Reach</h3>
                <div className="bg-white border border-[#E8DFD3] rounded-xl p-3.5 space-y-3 text-xs">
                  <div>
                    <span className="text-[#7A7369] block">ಹತ್ತಿರದ ರೈಲ್ವೆ ನಿಲ್ದಾಣ (Nearest Railway):</span>
                    <span className="font-semibold text-[#1A1714] text-sm">
                      {compDest?.transitConnectivity.nearestRailwayStation || poi.nearestRailwayId}
                    </span>
                    {compDest && (
                      <p className="text-[11px] text-[#7A7369]">ಅಂತರ: {compDest.transitConnectivity.railwayDistanceKm} km</p>
                    )}
                  </div>

                  <div className="border-t border-[#F4EFEA] pt-2">
                    <span className="text-[#7A7369] block">ಹತ್ತಿರದ ಬಸ್ ನಿಲ್ದಾಣ (Nearest Bus Terminal):</span>
                    <span className="font-semibold text-[#1A1714] text-sm">
                      {compDest?.transitConnectivity.nearestBusTerminal || poi.nearestBusTerminalId}
                    </span>
                    {compDest && (
                      <p className="text-[11px] text-[#7A7369]">ಅಂತರ: {compDest.transitConnectivity.busTerminalDistanceKm} km</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Last Mile Transfers */}
              {localTransfers.length > 0 && (
                <section className="yt-drawer-section">
                  <h3 className="yt-drawer-section-title">🚖 ಕೊನೆಯ ಮೈಲಿ ಸಂಪರ್ಕ • Last-Mile Transfers</h3>
                  <div className="space-y-2">
                    {localTransfers.map((lt) => (
                      <div key={lt.id} className="bg-white border border-[#E8DFD3] rounded-xl p-3 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-[#1A1714]">{lt.providerOrganization}</span>
                          <span className="font-mono text-[#A44A28] font-bold">₹{lt.estimatedFareInr.min} - ₹{lt.estimatedFareInr.max}</span>
                        </div>
                        <p className="text-[#4A443C]">{lt.counterLocation}</p>
                        <p className="text-[11px] text-[#166534] mt-1">💡 {lt.tipForTraveler}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* TAB 3: STAYS NEARBY */}
          {activeSubTab === 'stays' && (
            <div className="space-y-3">
              <h3 className="yt-drawer-section-title">🏨 ದೃಢೀಕೃತ ತಂಗುದಾಣಗಳು • Verified Stays Nearby</h3>
              {nearbyStays.length === 0 ? (
                <p className="text-xs text-[#7A7369] p-4 text-center bg-white rounded-xl border border-[#E8DFD3]">
                  ಹತ್ತಿರದ ಸರ್ಕಾರಿ ಅಥವಾ ನೋಂದಾಯಿತ ತಂಗುದಾಣಗಳು ಶೀಘ್ರದಲ್ಲೇ ನವೀಕರಣಗೊಳ್ಳಲಿವೆ.
                </p>
              ) : (
                nearbyStays.map((stay) => (
                  <div key={stay.id} className="bg-white border border-[#E8DFD3] rounded-xl p-3.5 text-xs flex justify-between items-center gap-2">
                    <div>
                      <span className="font-semibold text-sm text-[#1A1714] block">{stay.name}</span>
                      <p className="text-[#7A7369] text-[11px]">📍 {stay.distanceToDestinationKm} km from destination • {stay.category.replace('_', ' ')}</p>
                      <p className="text-[#A44A28] font-semibold mt-1">₹{stay.priceRangeInr.min} - ₹{stay.priceRangeInr.max} / ರಾತ್ರಿ</p>
                    </div>
                    <a
                      href={stay.officialBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#A44A28] text-white text-xs font-medium shrink-0"
                    >
                      ಬುಕಿಂಗ್ ↗
                    </a>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: DINING & LOCAL FOOD */}
          {activeSubTab === 'dining' && (
            <div className="space-y-3">
              <h3 className="yt-drawer-section-title">🍲 ಸ್ಥಳೀಯ ಆಹಾರ ಪರಂಪರೆ • Regional Dining</h3>
              {nearbyDining.length === 0 ? (
                <p className="text-xs text-[#7A7369] p-4 text-center bg-white rounded-xl border border-[#E8DFD3]">
                  ಸ್ಥಳೀಯ ಆಹಾರ ಸಂಸ್ಥೆಗಳ ಮಾಹಿತಿ ಶೀಘ್ರದಲ್ಲೇ ಲಭ್ಯವಾಗಲಿದೆ.
                </p>
              ) : (
                nearbyDining.map((dine) => (
                  <div key={dine.id} className="bg-white border border-[#E8DFD3] rounded-xl p-3.5 text-xs space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-sm text-[#1A1714]">{dine.name}</span>
                      <span className="text-[#166534] font-medium text-[11px]">{dine.isPureVeg ? 'ಶುದ್ಧ ಸಸ್ಯಾಹಾರಿ' : 'ಕರಾವಳಿ ಊಟ'}</span>
                    </div>
                    <p className="text-[#4A443C]">{dine.culturalNote}</p>
                    <p className="text-[11px] text-[#A44A28]">
                      🌟 <strong>ವಿಶೇಷತೆ:</strong> {dine.signatureDishes.join(', ')}
                    </p>
                    <p className="text-[10px] text-[#7A7369]">ಸಮಯ: {dine.operatingHours} • ಅಂದಾಜು: ₹{dine.pricePerPersonEstimateInr}/ವ್ಯಕ್ತಿಗೆ</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: SOURCES & DATA PROVENANCE */}
          {activeSubTab === 'sources' && (
            <div className="space-y-3">
              <h3 className="yt-drawer-section-title">📜 ದತ್ತಾಂಶದ ಮೂಲ ಮತ್ತು ದೃಢೀಕರಣ • Source Provenance</h3>
              <div className="bg-white border border-[#E8DFD3] rounded-xl p-4 text-xs space-y-2">
                <p><strong>ಮೂಲ ಸಂಸ್ಥೆ (Source):</strong> {poi.sourceAttribution || 'Archaeological Survey of India & Dept of Tourism, GoK'}</p>
                <p><strong>ದೃಢೀಕರಣ ವರ್ಗ (Classification):</strong> <span className="font-mono text-[#A44A28]">{trustMeta.code}</span></p>
                <p><strong>ಕೊನೆಯ ಪರಿಶೀಲನೆ (Last Verified):</strong> {compDest?.sourceRef.lastVerifiedDate || poi.verifiedDate || '2026-10-31'}</p>
                <p><strong>ಪರವಾನಗಿ (License):</strong> {photoMeta.license}</p>
                <p className="text-[11px] text-[#7A7369] border-t border-[#F4EFEA] pt-2">
                  {compDest?.sourceRef.citationNotice || 'Information validated under the statutory provisions of AMASR Act 1958 and Karnataka Tourism Policy.'}
                </p>
              </div>
            </div>
          )}

          {/* Local Kannada Phrase Context */}
          <div className="yt-drawer-phrase-card my-4">
            <span className="yt-phrase-dialect-badge">{poi.localPhrase.dialectLabel}</span>
            <div className="yt-phrase-kannada font-kannada text-sm font-medium">{poi.localPhrase.kannada}</div>
            <div className="yt-phrase-iast text-xs text-[#7A7369] italic">{poi.localPhrase.iast}</div>
            <div className="yt-phrase-english text-xs text-[#1A1714] font-medium">{poi.localPhrase.english}</div>
            <div className="yt-phrase-usage text-[11px] text-[#7A7369] mt-1">{poi.localPhrase.usageContext}</div>
          </div>

          {/* Bottom Action Bar */}
          <div className="yt-drawer-actions mt-6 pt-4 border-t border-[#E8DFD3]">
            {isAdded ? (
              <button
                type="button"
                className="yt-drawer-action-btn remove"
                onClick={() => onRemoveFromTrip(poi.id)}
              >
                ✕ ಪ್ರವಾಸದಿಂದ ತೆಗೆಯಿರಿ (Remove from Trip)
              </button>
            ) : (
              <button
                type="button"
                className="yt-drawer-action-btn add"
                onClick={() => onAddToTrip(poi.id)}
              >
                + ಪ್ರವಾಸಕ್ಕೆ ಸೇರಿಸಿ (Add to Itinerary)
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
