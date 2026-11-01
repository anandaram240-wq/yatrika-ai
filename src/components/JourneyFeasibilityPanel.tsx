/**
 * @file src/components/JourneyFeasibilityPanel.tsx
 * @description First-class UI panel surfacing the FeasibilityEngine verdict for YatriKa AI V9.
 * @theme Code. Create. Celebrate Kannada.
 */

import React from 'react';
import { FeasibilityAssessmentReport } from '../optimization/feasibilityEngine';
import { KarnatakaPOI, ComputedTripRoute } from '../types/nammatrip';

export interface JourneyFeasibilityPanelProps {
  report: FeasibilityAssessmentReport | null;
  stops: KarnatakaPOI[];
  route: ComputedTripRoute | null;
  allocatedDays: number;
  isLoading?: boolean;
  onRequestAlternative?: () => void;
}

// ---------------------------------------------------------------------------
// Verdict helpers
// ---------------------------------------------------------------------------

type VerdictKey =
  | 'FEASIBLE_VERIFIED'
  | 'FEASIBLE_UNCONFIRMED'
  | 'REQUIRES_DECISION'
  | 'NOT_FEASIBLE'
  | 'INSUFFICIENT_DATA';

interface VerdictConfig {
  label: string;
  kannada: string;
  icon: string;
  badgeClass: string;
}

const VERDICT_CONFIG: Record<VerdictKey, VerdictConfig> = {
  FEASIBLE_VERIFIED: {
    label: 'FEASIBLE WITH VERIFIED INPUTS',
    kannada: 'ಪರಿಶೀಲಿಸಿದ ಮಾಹಿತಿಯೊಂದಿಗೆ ಸಾಧ್ಯ',
    icon: '✓',
    badgeClass: 'yt-verdict-green',
  },
  FEASIBLE_UNCONFIRMED: {
    label: 'FEASIBLE WITH UNCONFIRMED CONNECTIONS',
    kannada: 'ಅಪ್ರಮಾಣಿತ ಸಂಪರ್ಕಗಳೊಂದಿಗೆ ಸಾಧ್ಯ',
    icon: '⚠',
    badgeClass: 'yt-verdict-amber',
  },
  REQUIRES_DECISION: {
    label: 'REQUIRES USER DECISION',
    kannada: 'ನಿಮ್ಮ ನಿರ್ಧಾರ ಅಗತ್ಯ',
    icon: '◈',
    badgeClass: 'yt-verdict-amber',
  },
  NOT_FEASIBLE: {
    label: 'NOT FEASIBLE WITH CURRENT INPUTS',
    kannada: 'ಪ್ರಸ್ತುತ ಯೋಜನೆ ಸಾಧ್ಯವಿಲ್ಲ',
    icon: '✗',
    badgeClass: 'yt-verdict-red',
  },
  INSUFFICIENT_DATA: {
    label: 'INSUFFICIENT DATA',
    kannada: 'ಮಾಹಿತಿ ಸಾಕಾಗುವುದಿಲ್ಲ',
    icon: '?',
    badgeClass: 'yt-verdict-grey',
  },
};

function resolveVerdict(
  report: FeasibilityAssessmentReport | null,
  stops: KarnatakaPOI[],
  route: ComputedTripRoute | null,
): VerdictKey {
  if (!report || stops.length < 2) return 'INSUFFICIENT_DATA';
  if (report.isFeasible) {
    return route?.provenance === 'live_osrm'
      ? 'FEASIBLE_VERIFIED'
      : 'FEASIBLE_UNCONFIRMED';
  }
  // Not feasible
  return report.scoreBreakdown.overallScore >= 40 ? 'REQUIRES_DECISION' : 'NOT_FEASIBLE';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const JourneyFeasibilityPanel: React.FC<JourneyFeasibilityPanelProps> = ({
  report,
  stops,
  route,
  allocatedDays: _allocatedDays,
  isLoading = false,
  onRequestAlternative,
}) => {
  const verdictKey = resolveVerdict(report, stops, route);
  const verdict = VERDICT_CONFIG[verdictKey];

  if (isLoading) {
    return (
      <div className="yt-feasibility-panel yt-feasibility-loading">
        <p className="yt-feasibility-loading-text">Evaluating itinerary feasibility…</p>
      </div>
    );
  }

  return (
    <div className="yt-feasibility-panel">
      {/* Verdict header */}
      <div className={`yt-feasibility-verdict ${verdict.badgeClass}`}>
        <span className="verdict-icon">{verdict.icon}</span>
        <span className="verdict-label">{verdict.label}</span>
        <span className="verdict-kannada font-kannada">{verdict.kannada}</span>
      </div>

      {/* Explanation text */}
      {report && (
        <p className="yt-feasibility-explanation">{report.explanation}</p>
      )}

      {/* Per-stop timeline */}
      {report && report.scheduledSlots.length > 0 && (
        <div className="yt-feasibility-timeline">
          {report.scheduledSlots.map((slot) => (
            <div key={slot.poiId} className="yt-feasibility-stop-row">
              <div className="stop-name">{slot.poiName}</div>
              <div className="stop-arrival">Arrival: {slot.arrivalTime}</div>
              <div className="stop-dwell">Visit: {slot.dwellMinutes} min</div>
              <div className="stop-status">
                {slot.isDarshanClosureViolation && (
                  <span className="issue-badge">⚠ Mid-day closure</span>
                )}
                {slot.isAfterSunset && (
                  <span className="issue-badge">⚠ After sunset</span>
                )}
                {!slot.isDarshanClosureViolation && !slot.isAfterSunset && (
                  <span className="ok-badge">✓ Window OK</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Route stats from ComputedTripRoute */}
      {route && (
        <div className="yt-feasibility-route-stats">
          <span>Total distance: {route.totalDistanceKm} km</span>
          <span>
            Drive time: {Math.round(route.totalDurationMinutes / 60)}h{' '}
            {route.totalDurationMinutes % 60}m
          </span>
          <span className="route-provenance">Source: {route.provenanceLabel}</span>
        </div>
      )}

      {/* Score breakdown */}
      {report && (
        <div className="yt-feasibility-score-breakdown">
          <div>Overall: {report.scoreBreakdown.overallScore}/100</div>
          <div>Pacing: {report.scoreBreakdown.pacingScore}/100</div>
          <div>Visit windows: {report.scoreBreakdown.timeWindowAdherenceScore}/100</div>
          <div>Daylight safety: {report.scoreBreakdown.daylightSafetyScore}/100</div>
        </div>
      )}

      {/* Alternative plan suggestion */}
      {report?.suggestedAlternativePlan && (
        <div className="yt-feasibility-alternative">
          <p>Suggested: {report.suggestedAlternativePlan.unbundledStopsNote}</p>
          <p>Recommended duration: {report.suggestedAlternativePlan.recommendedDays} days</p>
          <p>Suggested start: {report.suggestedAlternativePlan.suggestedAdjustedDepartureTime}</p>
          {onRequestAlternative && (
            <button className="yt-btn-alternative" onClick={onRequestAlternative}>
              Apply suggested changes
            </button>
          )}
        </div>
      )}

      {/* Data provenance notice */}
      <div className="yt-feasibility-data-notice">
        <p>
          ⚠ Visiting window data is based on published sources as of{' '}
          {stops[0]?.verifiedDate ?? 'unknown'}. Verify with official sites before travel.
        </p>
      </div>
    </div>
  );
};

export default JourneyFeasibilityPanel;
