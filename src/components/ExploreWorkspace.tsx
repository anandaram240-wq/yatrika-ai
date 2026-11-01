/**
 * src/components/ExploreWorkspace.tsx
 * Primary /explore view for YatriKa AI V9.
 *
 * A structured Karnataka Journey Discovery workspace — NOT a chatbot,
 * NOT a static list, NOT an empty map. Four complementary discovery modes:
 *   1. Journey Finder (primary, deterministic search)
 *   2. Ready-Made Circuits
 *   3. Along My Route
 *   4. Explore by District / Interest
 */

import React, { useState, useMemo } from 'react';
import { KARNATAKA_POIS, CURATED_CIRCUIT_PRESETS, KARNATAKA_GATEWAY_ORIGINS } from '../data/karnatakaTravelRegistry';
import { getAuthenticDestinationPhoto } from '../data/karnatakaPhotoRegistry';
import { findJourneys, JourneyFinderQuery, InterestCategory, JourneyFinderResult } from '../data/journeyFinderEngine';
import { getCandidateDetours, computeRoadDetour, DetourResult } from '../services/detourCalculationService';
import { KarnatakaPOI } from '../types/nammatrip';

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

export interface ExploreWorkspaceProps {
  uiLanguage: 'kn' | 'en';
  userOrigin: { id: string; name: string; nameKannada: string; coordinates: [number, number] };
  onSelectCircuit: (circuitId: string) => void;
  onSelectPoiDetail: (poiId: string) => void;
  onAddPoiToTrip: (poiId: string) => void;
  itineraryStopIds: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const ALL_INTERESTS: Array<{ key: InterestCategory; label: string; emoji: string }> = [
  { key: 'heritage',     label: 'Heritage',          emoji: '🏛️' },
  { key: 'mountains',    label: 'Mountains',          emoji: '⛰️' },
  { key: 'waterfalls',   label: 'Waterfalls',         emoji: '💧' },
  { key: 'wildlife',     label: 'Wildlife',           emoji: '🐘' },
  { key: 'coast',        label: 'Coast',              emoji: '🏖️' },
  { key: 'food_culture', label: 'Food & Culture',     emoji: '🍛' },
  { key: 'spiritual',    label: 'Spiritual',          emoji: '🪔' },
  { key: 'family',       label: 'Family-Friendly',    emoji: '👨‍👩‍👧' },
  { key: 'accessible',   label: 'Accessible Travel',  emoji: '♿' },
];

const DURATION_OPTIONS: Array<{ key: JourneyFinderQuery['durationKey']; label: string; sublabel: string }> = [
  { key: 'half_day',  label: 'Half Day',       sublabel: 'up to 80 km' },
  { key: 'one_day',   label: 'One Day',        sublabel: 'up to 150 km' },
  { key: 'weekend',   label: 'Weekend',        sublabel: '2 days / 280 km' },
  { key: '3_5_days',  label: '3–5 Days',       sublabel: 'up to 500 km' },
  { key: 'longer',    label: 'Longer Journey', sublabel: 'across Karnataka' },
];

const TRAVEL_MODE_OPTIONS: Array<{ key: JourneyFinderQuery['travelMode']; label: string; emoji: string }> = [
  { key: 'self_drive',   label: 'Self-Drive',         emoji: '🚗' },
  { key: 'bus',          label: 'Bus (KSRTC)',         emoji: '🚌' },
  { key: 'train_local',  label: 'Train + Local',       emoji: '🚂' },
  { key: 'any',          label: 'Any Mode',            emoji: '🗺️' },
];

const EXPLORE_TABS = [
  { id: 'circuits',   label: 'Ready-Made Circuits' },
  { id: 'route',      label: 'Along My Route' },
  { id: 'district',   label: 'Explore by District' },
  { id: 'interest',   label: 'Explore by Interest' },
] as const;
type ExploreTab = typeof EXPLORE_TABS[number]['id'];

const DATA_STATUS_LABELS: Record<JourneyFinderResult['dataStatus'], string> = {
  verified: 'VERIFIED',
  sourced:  'SOURCED',
  estimated: 'ESTIMATED',
};

const DATA_STATUS_COLORS: Record<JourneyFinderResult['dataStatus'], string> = {
  verified:  'yt-badge-verified',
  sourced:   'yt-badge-sourced',
  estimated: 'yt-badge-estimated',
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export const ExploreWorkspace: React.FC<ExploreWorkspaceProps> = ({
  uiLanguage,
  userOrigin,
  onSelectCircuit,
  onSelectPoiDetail,
  onAddPoiToTrip,
  itineraryStopIds,
}) => {

  // ── Journey Finder State ──────────────────────────────────────────────────
  const [finderOriginId, setFinderOriginId] = useState<string>(userOrigin.id);
  const [finderDuration, setFinderDuration] = useState<JourneyFinderQuery['durationKey']>('weekend');
  const [finderTravelMode, setFinderTravelMode] = useState<JourneyFinderQuery['travelMode']>('any');
  const [finderInterests, setFinderInterests] = useState<Set<InterestCategory>>(new Set());
  const [finderResults, setFinderResults] = useState<JourneyFinderResult[] | null>(null);
  const [finderHasSearched, setFinderHasSearched] = useState(false);

  // ── Secondary Explore State ───────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<ExploreTab>('circuits');

  // Along My Route
  const [routeFrom, setRouteFrom] = useState('Bengaluru');
  const [routeTo, setRouteTo] = useState('Chikkamagaluru');
  const [detourResults, setDetourResults] = useState<DetourResult[] | null>(null);
  const [isDetourCalculating, setIsDetourCalculating] = useState(false);
  const [comparedDetourId, setComparedDetourId] = useState<string | null>(null);
  const [ignoredPoiIds, setIgnoredPoiIds] = useState<Set<string>>(new Set());

  // Explore by District
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  // Explore by Interest
  const [selectedInterest, setSelectedInterest] = useState<InterestCategory | null>(null);

  // ─────────────────────────────────────────────────────────────────────────
  // Computed Data
  // ─────────────────────────────────────────────────────────────────────────

  const uniqueDistricts = useMemo(() => {
    const seen = new Set<string>();
    KARNATAKA_POIS.forEach((p) => seen.add(p.district));
    return [...seen].sort();
  }, []);

  const districtFilteredPois = useMemo(() => {
    if (!selectedDistrict) return [];
    return KARNATAKA_POIS.filter((p) => p.district === selectedDistrict).slice(0, 12);
  }, [selectedDistrict]);

  const interestFilteredPois = useMemo(() => {
    if (!selectedInterest) return [];
    const interest = selectedInterest;
    // Interest→category mapping inline (mirrors journeyFinderEngine logic)
    const catMap: Record<InterestCategory, string[]> = {
      heritage:     ['heritage', 'temple'],
      mountains:    ['hill_trek'],
      waterfalls:   ['attraction'],
      wildlife:     ['wildlife_nature'],
      coast:        ['beach_coastal'],
      food_culture: ['food_dining'],
      spiritual:    ['temple'],
      family:       ['heritage', 'attraction', 'wildlife_nature'],
      accessible:   ['heritage', 'attraction'],
    };
    const cats = catMap[interest];
    return KARNATAKA_POIS.filter((p) => {
      if (!cats.includes(p.category)) return false;
      if (interest === 'waterfalls') {
        return p.name.toLowerCase().includes('fall') || p.nameKannada.includes('ಜಲಪಾತ');
      }
      return true;
    }).slice(0, 12);
  }, [selectedInterest]);

  // ─────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────

  const toggleInterest = (key: InterestCategory) => {
    setFinderInterests((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleFindJourneys = () => {
    const query: JourneyFinderQuery = {
      originId: finderOriginId,
      durationKey: finderDuration,
      travelMode: finderTravelMode,
      interests: [...finderInterests],
    };
    const results = findJourneys(query);
    setFinderResults(results);
    setFinderHasSearched(true);
  };

  const handleFindAlongRoute = async () => {
    setIsDetourCalculating(true);
    setComparedDetourId(null);
    setIgnoredPoiIds(new Set());

    // Resolve origin/destination coordinates via gateway origins or fallback
    const fromOrigin = KARNATAKA_GATEWAY_ORIGINS.find(
      (o) => o.name.toLowerCase().includes(routeFrom.toLowerCase()) || o.nameKannada.includes(routeFrom)
    );
    const toOrigin = KARNATAKA_GATEWAY_ORIGINS.find(
      (o) => o.name.toLowerCase().includes(routeTo.toLowerCase()) || o.nameKannada.includes(routeTo)
    );
    const fromCoords: [number, number] = fromOrigin?.coordinates ?? [77.5683, 12.9784];
    const toCoords: [number, number] = toOrigin?.coordinates ?? [75.7720, 13.3161];

    const candidates = getCandidateDetours(fromCoords, toCoords, KARNATAKA_POIS, 60);

    const calculated: DetourResult[] = await Promise.all(
      candidates.slice(0, 6).map((c) =>
        computeRoadDetour(fromCoords, toCoords, c.poi, c.haversineFromMidpointKm)
      )
    );

    setDetourResults(calculated);
    setIsDetourCalculating(false);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render Helpers
  // ─────────────────────────────────────────────────────────────────────────

  const renderPoiCard = (poi: KarnatakaPOI, actionLabel = 'Explore Detour', onAction = () => onSelectPoiDetail(poi.id)) => {
    const photo = getAuthenticDestinationPhoto(poi.id, poi.category, poi.name, poi.district);
    const isInItinerary = itineraryStopIds.includes(poi.id);
    return (
      <div key={poi.id} className="yt-poi-card">
        <div className="yt-poi-card-image-wrap">
          <img
            src={photo.imageUrl}
            alt={poi.name}
            className="yt-poi-card-image"
            loading="lazy"
          />
          <span className="yt-poi-category-badge">{poi.category.replace(/_/g, ' ')}</span>
        </div>
        <div className="yt-poi-card-body">
          <h4 className="yt-poi-card-title">{poi.name}</h4>
          <p className="yt-poi-card-kannada font-kannada">{poi.nameKannada}</p>
          <p className="yt-poi-card-district">📍 {poi.district}</p>
          <p className="yt-poi-card-summary">{poi.summary.slice(0, 100)}…</p>
          <div className="yt-poi-card-actions">
            <button
              className="yt-btn-secondary yt-btn-sm"
              onClick={onAction}
            >
              {actionLabel}
            </button>
            {!isInItinerary && (
              <button
                className="yt-btn-ghost yt-btn-sm"
                onClick={() => onAddPoiToTrip(poi.id)}
              >
                + Add to Trip
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderJourneyResultCard = (result: JourneyFinderResult) => {
    const firstStopId = result.circuit.stopIds[0];
    return (
      <div key={result.circuit.id} className="yt-journey-result-card">
        <div className="yt-journey-result-header">
          <div className="yt-journey-result-title-block">
            <h3 className="yt-journey-result-title">{result.circuit.title}</h3>
            <p className="yt-journey-result-title-kn font-kannada">{result.circuit.titleKannada}</p>
          </div>
          <div className="yt-journey-result-meta-badges">
            <span className="yt-badge-duration">
              {result.circuit.durationDays} Day{result.circuit.durationDays !== 1 ? 's' : ''}
            </span>
            <span className="yt-badge-distance">~{result.circuit.totalDistanceKm} km</span>
            <span className={`yt-data-status-badge ${DATA_STATUS_COLORS[result.dataStatus]}`}>
              {DATA_STATUS_LABELS[result.dataStatus]}
            </span>
          </div>
        </div>

        <div className="yt-journey-result-score">
          <div className="yt-match-score-bar" title="Transparent match score — not an AI confidence rating">
            <div
              className="yt-match-score-fill"
              style={{ width: `${result.matchScore}%` }}
            />
          </div>
          <span className="yt-match-score-label">{result.matchScore}/100 match</span>
        </div>

        <div className="yt-journey-result-reasons">
          {result.matchReasons.map((reason, i) => (
            <span key={i} className="yt-match-reason-tag">✓ {reason}</span>
          ))}
        </div>

        <div className="yt-journey-result-details">
          <p className="yt-journey-stop-count">
            {result.circuit.stopIds.length} stops
          </p>
          <ul className="yt-journey-highlights">
            {result.circuit.highlights.slice(0, 3).map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>

        <div className="yt-journey-result-actions">
          <button
            className="yt-btn-primary"
            onClick={() => onSelectCircuit(result.circuit.id)}
          >
            Plan this journey →
          </button>
          {firstStopId && (
            <button
              className="yt-btn-secondary"
              onClick={() => onSelectPoiDetail(firstStopId)}
            >
              View details
            </button>
          )}
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render — Secondary Tab Content
  // ─────────────────────────────────────────────────────────────────────────

  const renderReadyMadeCircuits = () => (
    <div className="yt-circuits-grid">
      {CURATED_CIRCUIT_PRESETS.map((circuit) => (
        <div key={circuit.id} className="yt-circuit-card">
          <div className="yt-circuit-card-header">
            <h4 className="yt-circuit-title">{circuit.title}</h4>
            <p className="yt-circuit-subtitle font-kannada">{circuit.subtitle}</p>
          </div>
          <div className="yt-circuit-duration-badge">
            <span className="yt-badge-duration">{circuit.days} Day{circuit.days !== 1 ? 's' : ''}</span>
          </div>
          <ul className="yt-circuit-highlights">
            {circuit.highlights.slice(0, 3).map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
          <button
            className="yt-btn-primary yt-btn-full"
            onClick={() => onSelectCircuit(circuit.id)}
          >
            Plan This Journey →
          </button>
        </div>
      ))}
    </div>
  );

  const renderAlongMyRoute = () => (
    <div className="yt-route-finder">
      <div className="yt-route-inputs">
        <div style={{ flex: 1, minWidth: '180px' }}>
          <label className="yt-field-label">From</label>
          <input
            type="text"
            className="yt-text-input"
            value={routeFrom}
            onChange={(e) => setRouteFrom(e.target.value)}
            placeholder="e.g. Bengaluru"
          />
        </div>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <label className="yt-field-label">To</label>
          <input
            type="text"
            className="yt-text-input"
            value={routeTo}
            onChange={(e) => setRouteTo(e.target.value)}
            placeholder="e.g. Chikkamagaluru"
          />
        </div>
        <button
          className="yt-btn-primary"
          onClick={handleFindAlongRoute}
          disabled={isDetourCalculating}
          style={{ height: '42px', alignSelf: 'flex-end' }}
        >
          {isDetourCalculating ? 'Calculating Road Detours...' : 'Find places along this route →'}
        </button>
      </div>

      {isDetourCalculating && (
        <div className="p-6 text-center text-sm text-[#9CA3AF]">
          🔄 Computing actual road geometries and detour timings via OSRM highway routing...
        </div>
      )}

      {!isDetourCalculating && detourResults !== null && (
        <div className="mt-4 space-y-4">
          <p className="yt-route-disclaimer">
            ℹ️ Detour calculations evaluate actual highway network routing (never straight-line haversine distance).
          </p>
          {detourResults.filter((r) => !ignoredPoiIds.has(r.poi.id)).length === 0 ? (
            <p className="yt-empty-state">No places found along this corridor, or all suggestions were ignored.</p>
          ) : (
            <div className="space-y-4">
              {detourResults
                .filter((r) => !ignoredPoiIds.has(r.poi.id))
                .map((res) => {
                  const photo = getAuthenticDestinationPhoto(res.poi.id, res.poi.category, res.poi.name, res.poi.district);
                  const isAdded = itineraryStopIds.includes(res.poi.id);
                  const isComparing = comparedDetourId === res.poi.id;

                  return (
                    <div
                      key={res.poi.id}
                      className="yt-detour-card bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 transition-all hover:border-[#F59E0B]"
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        <img
                          src={photo.imageUrl}
                          alt={res.poi.name}
                          className="w-full md:w-36 h-28 object-cover rounded-lg"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-white text-base leading-snug">{res.poi.name}</h4>
                              <p className="font-kannada text-xs text-[#F59E0B]">{res.poi.nameKannada}</p>
                              <p className="text-xs text-[#9CA3AF] mt-0.5">{res.poi.district} • {res.poi.summary}</p>
                            </div>
                            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 whitespace-nowrap">
                              {res.dataStatus === 'road_verified' ? '✓ Road Computed' : '~ Estimated Road'}
                            </span>
                          </div>

                          {/* Computed Detour Metrics */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#2A2A2A] text-xs">
                            <div className="bg-[#0F0F0F] p-2 rounded border border-[#2A2A2A]">
                              <span className="text-[#9CA3AF] block text-[10px] uppercase font-bold">Extra Road Dist</span>
                              <span className="text-white font-mono font-bold">+{res.additionalRoadDistanceKm} km</span>
                            </div>
                            <div className="bg-[#0F0F0F] p-2 rounded border border-[#2A2A2A]">
                              <span className="text-[#9CA3AF] block text-[10px] uppercase font-bold">Extra Drive</span>
                              <span className="text-white font-mono font-bold">+{res.additionalRoadDurationMinutes} min</span>
                            </div>
                            <div className="bg-[#0F0F0F] p-2 rounded border border-[#2A2A2A]">
                              <span className="text-[#9CA3AF] block text-[10px] uppercase font-bold">Recommended Visit</span>
                              <span className="text-[#F59E0B] font-mono font-bold">{res.suggestedVisitDurationMinutes} min</span>
                            </div>
                            <div className="bg-[#0F0F0F] p-2 rounded border border-[#2A2A2A]">
                              <span className="text-[#9CA3AF] block text-[10px] uppercase font-bold">Total Time Impact</span>
                              <span className="text-white font-mono font-bold">~{res.totalAdditionalTimeMinutes} min</span>
                            </div>
                          </div>

                          {/* Source Evidence */}
                          <div className="text-[11px] text-[#9CA3AF]">
                            <span>Evidence: {res.poi.sourceAttribution}</span>
                            <span className="mx-1.5">•</span>
                            <span>Verified: {res.poi.verifiedDate}</span>
                          </div>

                          {/* Action Buttons: Add, View, Compare, Ignore */}
                          <div className="flex flex-wrap items-center gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => onAddPoiToTrip(res.poi.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                isAdded
                                  ? 'bg-[#065F46] text-[#A7F3D0] border border-[#34D399]'
                                  : 'bg-[#EA580C] hover:bg-[#C2410C] text-white'
                              }`}
                            >
                              {isAdded ? '✓ Stop Added to Itinerary' : '+ Add this stop'}
                            </button>
                            <button
                              type="button"
                              onClick={() => onSelectPoiDetail(res.poi.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#2A2A2A] hover:bg-[#333333] text-white"
                            >
                              View destination
                            </button>
                            <button
                              type="button"
                              onClick={() => setComparedDetourId(isComparing ? null : res.poi.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#3A3A3A] hover:border-[#F59E0B] text-[#D1D5DB]"
                            >
                              {isComparing ? 'Hide comparison' : 'Compare detour'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setIgnoredPoiIds((prev) => new Set(prev).add(res.poi.id))}
                              className="px-3 py-1.5 rounded-lg text-xs text-[#9CA3AF] hover:text-[#EF4444]"
                            >
                              Ignore suggestion
                            </button>
                          </div>

                          {/* Comparison Box */}
                          {isComparing && (
                            <div className="mt-3 p-3 bg-[#0F0F0F] rounded-lg border border-[#3A3A3A] text-xs space-y-1.5">
                              <div className="font-bold text-[#F59E0B]">
                                ⚖️ Detour Route Comparison: {routeFrom} ➔ {res.poi.name} ➔ {routeTo}
                              </div>
                              <div className="text-[#D1D5DB]">
                                • <strong>Direct Highway Route:</strong> Direct drive along trunk corridor between {routeFrom} and {routeTo}.
                              </div>
                              <div className="text-[#D1D5DB]">
                                • <strong>Detour Highway Route:</strong> Adds <strong>+{res.additionalRoadDistanceKm} km</strong> driving distance and <strong>+{res.additionalRoadDurationMinutes} min</strong> road transit.
                              </div>
                              <div className="text-[#D1D5DB]">
                                • <strong>Recommended Visit Window:</strong> {res.suggestedVisitDurationMinutes} minutes based on attraction scale.
                              </div>
                              <div className="text-[#D1D5DB]">
                                • <strong>Net Schedule Impact:</strong> Total additional schedule requirement: <strong>~{res.totalAdditionalTimeMinutes} minutes</strong> (drive + visit).
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderByDistrict = () => (
    <div className="yt-district-explorer">
      <div className="yt-district-chips">
        {uniqueDistricts.map((d) => (
          <button
            key={d}
            className={`yt-chip ${selectedDistrict === d ? 'yt-chip-active' : ''}`}
            onClick={() => setSelectedDistrict(d === selectedDistrict ? null : d)}
          >
            {d}
          </button>
        ))}
      </div>

      {selectedDistrict && (
        <div>
          <h4 className="yt-section-subtitle mt-4">
            Places in {selectedDistrict} ({districtFilteredPois.length})
          </h4>
          <div className="yt-poi-grid">
            {districtFilteredPois.map((poi) => renderPoiCard(poi))}
          </div>
        </div>
      )}
    </div>
  );

  const renderByInterest = () => (
    <div className="yt-interest-explorer">
      <div className="yt-interest-chips">
        {ALL_INTERESTS.map(({ key, label, emoji }) => (
          <button
            key={key}
            className={`yt-chip yt-interest-chip ${selectedInterest === key ? 'yt-chip-active' : ''}`}
            onClick={() => setSelectedInterest(key === selectedInterest ? null : key)}
          >
            <span>{emoji}</span> {label}
          </button>
        ))}
      </div>

      {selectedInterest && (
        <div>
          <h4 className="yt-section-subtitle mt-4">
            {ALL_INTERESTS.find((i) => i.key === selectedInterest)?.label} destinations
            {interestFilteredPois.length > 0 && ` (${interestFilteredPois.length})`}
          </h4>
          {interestFilteredPois.length === 0 ? (
            <p className="yt-empty-state">No destinations found for this interest. Try another category.</p>
          ) : (
            <div className="yt-poi-grid">
              {interestFilteredPois.map((poi) => renderPoiCard(poi))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Main Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="yt-explore-workspace">

      {/* ═══════════════════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════════════════ */}
      <section className="yt-explore-header">
        <h1 className="font-kannada yt-explore-headline-kn">ಕರ್ನಾಟಕವನ್ನು ಅನ್ವೇಷಿಸಿ</h1>
        <h2 className="yt-explore-headline-en">Discover Karnataka</h2>
        <p className="yt-explore-subline">
          Find journeys that fit your time, interests and way of travelling.
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PRIMARY JOURNEY FINDER
      ═══════════════════════════════════════════════════════ */}
      <section className="yt-journey-finder-section">
        <div className="yt-journey-finder-card">
          <h3 className="yt-journey-finder-heading">
            <span className="yt-accent-dot" /> Journey Finder
            <span className="yt-finder-note">— deterministic, not AI-guessed</span>
          </h3>

          {/* Field 1: Starting location */}
          <div className="yt-finder-field">
            <label className="yt-field-label" htmlFor="finder-origin">
              Starting location
            </label>
            <select
              id="finder-origin"
              className="yt-select"
              value={finderOriginId}
              onChange={(e) => setFinderOriginId(e.target.value)}
            >
              {KARNATAKA_GATEWAY_ORIGINS.map((origin) => (
                <option key={origin.id} value={origin.id}>
                  {origin.name} — {origin.nameKannada}
                </option>
              ))}
            </select>
          </div>

          {/* Field 2: Available duration */}
          <div className="yt-finder-field">
            <label className="yt-field-label">Available duration</label>
            <div className="yt-pill-group">
              {DURATION_OPTIONS.map(({ key, label, sublabel }) => (
                <button
                  key={key}
                  className={`yt-pill ${finderDuration === key ? 'yt-pill-active' : ''}`}
                  onClick={() => setFinderDuration(key)}
                  type="button"
                >
                  <span className="yt-pill-label">{label}</span>
                  <span className="yt-pill-sub">{sublabel}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Field 3: Travel mode */}
          <div className="yt-finder-field">
            <label className="yt-field-label">Travel mode</label>
            <div className="yt-pill-group">
              {TRAVEL_MODE_OPTIONS.map(({ key, label, emoji }) => (
                <button
                  key={key}
                  className={`yt-pill yt-pill-mode ${finderTravelMode === key ? 'yt-pill-active' : ''}`}
                  onClick={() => setFinderTravelMode(key)}
                  type="button"
                >
                  <span>{emoji}</span> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Field 4: Interests (multi-select) */}
          <div className="yt-finder-field">
            <label className="yt-field-label">Interests (select any)</label>
            <div className="yt-chip-group">
              {ALL_INTERESTS.map(({ key, label, emoji }) => (
                <button
                  key={key}
                  className={`yt-chip yt-interest-chip ${finderInterests.has(key) ? 'yt-chip-active' : ''}`}
                  onClick={() => toggleInterest(key)}
                  type="button"
                >
                  <span>{emoji}</span> {label}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            className="yt-btn-primary yt-btn-find"
            onClick={handleFindJourneys}
            type="button"
          >
            Find journeys that fit →
          </button>
        </div>

        {/* Results */}
        {finderHasSearched && finderResults !== null && (
          <div className="yt-finder-results">
            {finderResults.length === 0 ? (
              <p className="yt-empty-state">No matching journeys found. Try broadening your interests or duration.</p>
            ) : (
              <>
                <h4 className="yt-results-heading">
                  {finderResults.length} journey{finderResults.length !== 1 ? 's' : ''} found
                  <span className="yt-results-subtext">sorted by transparent match score</span>
                </h4>
                <div className="yt-journey-results-grid">
                  {finderResults.map(renderJourneyResultCard)}
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECONDARY EXPLORE MODES
      ═══════════════════════════════════════════════════════ */}
      <section className="yt-explore-modes">
        <h3 className="yt-section-heading">
          {uiLanguage === 'kn' ? 'ಇತರ ಅನ್ವೇಷಣಾ ವಿಧಾನಗಳು' : 'More ways to explore'}
        </h3>

        {/* Tab bar */}
        <div className="yt-explore-tabs" role="tablist">
          {EXPLORE_TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`yt-explore-tab ${activeTab === tab.id ? 'yt-explore-tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="yt-explore-tab-content" role="tabpanel">
          {activeTab === 'circuits'  && renderReadyMadeCircuits()}
          {activeTab === 'route'     && renderAlongMyRoute()}
          {activeTab === 'district'  && renderByDistrict()}
          {activeTab === 'interest'  && renderByInterest()}
        </div>
      </section>

    </div>
  );
};

export default ExploreWorkspace;
