/**
 * @file src/components/JourneyReadinessPassport.tsx
 * @description Structured evidence document for the planned itinerary — YatriKa AI V9.
 * @theme Code. Create. Celebrate Kannada.
 */

import React from 'react';
import { KarnatakaPOI, ComputedTripRoute } from '../types/nammatrip';
import { FeasibilityAssessmentReport } from '../optimization/feasibilityEngine';

export interface JourneyReadinessPassportProps {
  stops: KarnatakaPOI[];
  route: ComputedTripRoute | null;
  feasibilityReport: FeasibilityAssessmentReport | null;
  allocatedDays: number;
  travellers: number;
  originName: string;
  onShare?: () => void;
  onDownload?: () => void;
  uiLanguage: 'kn' | 'en';
}

// ---------------------------------------------------------------------------
// Inline compact verdict strip
// ---------------------------------------------------------------------------

type VerdictKey =
  | 'FEASIBLE_VERIFIED'
  | 'FEASIBLE_UNCONFIRMED'
  | 'REQUIRES_DECISION'
  | 'NOT_FEASIBLE'
  | 'INSUFFICIENT_DATA';

interface CompactVerdictConfig {
  label: string;
  icon: string;
  stripClass: string;
}

const COMPACT_VERDICT: Record<VerdictKey, CompactVerdictConfig> = {
  FEASIBLE_VERIFIED: {
    label: 'Feasible — Verified',
    icon: '✓',
    stripClass: 'yt-passport-verdict-green',
  },
  FEASIBLE_UNCONFIRMED: {
    label: 'Feasible — Unconfirmed connections',
    icon: '⚠',
    stripClass: 'yt-passport-verdict-amber',
  },
  REQUIRES_DECISION: {
    label: 'Requires user decision',
    icon: '◈',
    stripClass: 'yt-passport-verdict-amber',
  },
  NOT_FEASIBLE: {
    label: 'Not feasible with current inputs',
    icon: '✗',
    stripClass: 'yt-passport-verdict-red',
  },
  INSUFFICIENT_DATA: {
    label: 'Insufficient data',
    icon: '?',
    stripClass: 'yt-passport-verdict-grey',
  },
};

function resolveVerdictKey(
  report: FeasibilityAssessmentReport | null,
  stops: KarnatakaPOI[],
  route: ComputedTripRoute | null,
): VerdictKey {
  if (!report || stops.length < 2) return 'INSUFFICIENT_DATA';
  if (report.isFeasible) {
    return route?.provenance === 'live_osrm' ? 'FEASIBLE_VERIFIED' : 'FEASIBLE_UNCONFIRMED';
  }
  return report.scoreBreakdown.overallScore >= 40 ? 'REQUIRES_DECISION' : 'NOT_FEASIBLE';
}

// ---------------------------------------------------------------------------
// Download handler
// ---------------------------------------------------------------------------

function buildDownloadContent(
  originName: string,
  stops: KarnatakaPOI[],
  route: ComputedTripRoute | null,
  allocatedDays: number,
): string {
  const lines: string[] = [
    `# Journey Readiness Passport`,
    `From: ${originName}`,
    `Stops: ${stops.length}`,
    `Days: ${allocatedDays}`,
    ``,
    `## Legs`,
    ...(route?.legs ?? []).map(
      (l) => `- ${l.fromStopName} → ${l.toStopName}: ${l.distanceKm}km, ${l.durationMinutes}min`,
    ),
    ``,
    `## Destinations`,
    ...stops.map((s) =>
      [
        `### ${s.name} (${s.nameKannada})`,
        `Hours: ${s.openingHours}`,
        `Fee: ${s.entryFeeInr.indianCitizen === 0 ? 'Free' : '₹' + s.entryFeeInr.indianCitizen}`,
        `Source: ${s.sourceAttribution}`,
        `Verified: ${s.verifiedDate}`,
      ].join('\n'),
    ),
  ];
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const JourneyReadinessPassport: React.FC<JourneyReadinessPassportProps> = ({
  stops,
  route,
  feasibilityReport,
  allocatedDays,
  travellers,
  originName,
  onShare,
  onDownload: onDownloadProp,
  uiLanguage: _uiLanguage,
}) => {
  const verdictKey = resolveVerdictKey(feasibilityReport, stops, route);
  const compactVerdict = COMPACT_VERDICT[verdictKey];

  const handleDownload = () => {
    const lines = buildDownloadContent(originName, stops, route, allocatedDays);
    const blob = new Blob([lines], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yatrika-journey-passport.md`;
    a.click();
    URL.revokeObjectURL(url);
    onDownloadProp?.();
  };

  return (
    <div className="yt-passport">
      {/* Passport header */}
      <div className="yt-passport-header">
        <div className="yt-passport-brand font-kannada">ಯಾತ್ರಾ ಸಿದ್ಧತಾ ದಾಖಲೆ</div>
        <div className="yt-passport-brand-en">Journey Readiness Passport</div>
        <div className="yt-passport-meta">
          <span>From: {originName}</span>
          <span>{stops.length} stops</span>
          <span>{allocatedDays} days</span>
          <span>
            {travellers} traveller{travellers !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="yt-passport-actions">
          <button onClick={onShare}>📤 Share</button>
          <button onClick={handleDownload}>⬇ Download</button>
        </div>
      </div>

      {/* Feasibility summary strip */}
      <div className={`yt-passport-verdict-strip ${compactVerdict.stripClass}`}>
        <span className="verdict-strip-icon">{compactVerdict.icon}</span>
        <span className="verdict-strip-label">{compactVerdict.label}</span>
        {feasibilityReport && (
          <span className="verdict-strip-score">
            Score: {feasibilityReport.scoreBreakdown.overallScore}/100
          </span>
        )}
      </div>

      {/* Journey legs table */}
      <section className="yt-passport-section">
        <h3>Journey Legs</h3>
        {route?.legs && route.legs.length > 0 ? (
          route.legs.map((leg, i) => (
            <div className="yt-passport-leg" key={i}>
              <div className="leg-route">
                {leg.fromStopName} → {leg.toStopName}
              </div>
              <div className="leg-stats">
                <span>{leg.distanceKm} km</span>
                <span>{leg.durationMinutes} min drive</span>
              </div>
              <div className="leg-provenance">
                Source: {route.provenanceLabel}
                {route.provenance === 'live_osrm' ? ' ✅ VERIFIED' : ' ~ ESTIMATED'}
              </div>
            </div>
          ))
        ) : (
          <p className="data-status-unknown">
            ❓ Route legs: UNKNOWN — Add stops to compute route
          </p>
        )}
      </section>

      {/* Destination records */}
      <section className="yt-passport-section">
        <h3>Destination Records</h3>
        {stops.map((stop) => (
          <div className="yt-passport-destination" key={stop.id}>
            <div className="dest-name">{stop.name}</div>
            <div className="dest-name-kn font-kannada">{stop.nameKannada}</div>

            <div className="dest-field">
              <span className="field-label">Visiting Hours:</span>
              <span className="field-value">{stop.openingHours || '❓ UNKNOWN'}</span>
              <span className="field-status">{stop.openingHours ? '📚 SOURCED' : '❓ UNKNOWN'}</span>
            </div>

            <div className="dest-field">
              <span className="field-label">Entry Fee (Indian):</span>
              <span className="field-value">
                {stop.entryFeeInr.indianCitizen === 0
                  ? 'Free'
                  : `₹${stop.entryFeeInr.indianCitizen}`}
                {stop.entryFeeInr.feeNote ? ` (${stop.entryFeeInr.feeNote})` : ''}
              </span>
              <span className="field-status">📚 SOURCED</span>
            </div>

            <div className="dest-field">
              <span className="field-label">Recommended Visit:</span>
              <span className="field-value">{stop.recommendedHours}h</span>
              <span className="field-status">~ ESTIMATED</span>
            </div>

            <div className="dest-field">
              <span className="field-label">Data Source:</span>
              <span className="field-value">{stop.sourceAttribution}</span>
              <span className="field-status">Verified: {stop.verifiedDate}</span>
            </div>

            {stop.officialUrl && (
              <a
                href={stop.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="dest-official-link"
              >
                Official source ↗
              </a>
            )}

            <div className="dest-field">
              <span className="field-label">Nearest Railway:</span>
              <span className="field-value">{stop.nearestRailwayId || '❓ UNKNOWN'}</span>
            </div>

            <div className="dest-field">
              <span className="field-label">Nearest Bus Terminal:</span>
              <span className="field-value">{stop.nearestBusTerminalId || '❓ UNKNOWN'}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Data transparency notice */}
      <section className="yt-passport-notice">
        <h4>Data Transparency</h4>
        <p>✅ VERIFIED: Official government, railway, or ASI-sourced with retrievable URL.</p>
        <p>📚 SOURCED: Reliable secondary source with attribution and retrieval date.</p>
        <p>~ ESTIMATED: Estimated from regional patterns. Disclosed explicitly.</p>
        <p>❓ UNKNOWN: No data available. Never filled with fabricated information.</p>
        <p>
          Last data retrieval: {stops[0]?.verifiedDate ?? 'Unknown'}. Verify before travel.
        </p>
      </section>
    </div>
  );
};

export default JourneyReadinessPassport;
