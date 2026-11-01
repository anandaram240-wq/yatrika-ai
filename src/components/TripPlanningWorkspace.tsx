/**
 * src/components/TripPlanningWorkspace.tsx
 * Professional Split-Screen Planning Experience for YatriKa AI.
 * 40% Editorial Itinerary Travel Document | 60% Calm Interactive Geographic Canvas.
 */

import React, { useState, useMemo } from 'react';
import { KarnatakaPOI, BudgetTier, ComputedTripRoute } from '../types/nammatrip';
import { UserOriginOption, KARNATAKA_POIS, KARNATAKA_GATEWAY_ORIGINS } from '../data/karnatakaTravelRegistry';
import { getAuthenticDestinationPhoto } from '../data/karnatakaPhotoRegistry';
import { LiveWeather } from '../services/liveWeatherService';
import {
  KARNATAKA_TRAIN_SCHEDULES,
  KSRTC_BUS_SERVICES,
  getTrainsForOrigin,
} from '../services/liveTransitService';
import { ShaktiLeg, CarbonComparison } from './ShaktiSavingsLedger';

export interface TripPlanningWorkspaceProps {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  itineraryStops: KarnatakaPOI[];
  userOrigin: UserOriginOption;
  onChangeOrigin: (origin: UserOriginOption) => void;
  route: ComputedTripRoute;
  activeCircuitTitle: string;
  days: number;
  setDays: (days: number) => void;
  travellers: number;
  setTravellers: (count: number) => void;
  shaktiWomenCount: number;
  setShaktiWomenCount: (count: number) => void;
  budgetTier: BudgetTier;
  setBudgetTier: (tier: BudgetTier) => void;
  netTotalBudgetInr: number;
  shaktiSavingsInr: number;
  activeTab: 'timeline' | 'trains' | 'budget' | 'discover';
  setActiveTab: (tab: 'timeline' | 'trains' | 'budget' | 'discover') => void;
  onSelectPoiDetail: (poiId: string) => void;
  onAddStop: (poiId: string) => void;
  onRemoveStop: (poiId: string) => void;
  onMoveStop: (index: number, direction: -1 | 1) => void;
  onOptimizeSequence: () => void;
  onFitMapRoute: () => void;
  onExportMarkdown: () => void;
  onShareTrip: () => void;
  shareCopied: boolean;
  uiLanguage: 'kn' | 'en';
  originWeather: LiveWeather | null;
  stopsWeather: Map<string, LiveWeather>;
  isGhatRoute: boolean;
  ghatName?: string;
  mapStyleId: string;
  onSwitchMapStyle: (style: any) => void;
  // Simulation trigger
  isTourActive: boolean;
  onStartTour: () => void;
  onStopTour: () => void;
  shaktiLegs?: ShaktiLeg[];
  carbonEstimate?: CarbonComparison;
  baseBudget?: {
    stayInr: number;
    transportInr: number;
    activityInr: number;
    mealsInr: number;
    totalInr: number;
  };
}

export const TripPlanningWorkspace: React.FC<TripPlanningWorkspaceProps> = ({
  mapContainerRef,
  itineraryStops,
  userOrigin,
  onChangeOrigin,
  route,
  activeCircuitTitle,
  days,
  setDays,
  travellers,
  setTravellers,
  shaktiWomenCount,
  setShaktiWomenCount,
  budgetTier,
  setBudgetTier,
  netTotalBudgetInr,
  shaktiSavingsInr,
  activeTab,
  setActiveTab,
  onSelectPoiDetail,
  onAddStop,
  onRemoveStop,
  onMoveStop,
  onOptimizeSequence,
  onFitMapRoute,
  onExportMarkdown,
  onShareTrip,
  shareCopied,
  uiLanguage,
  originWeather,
  stopsWeather,
  isGhatRoute,
  ghatName,
  mapStyleId,
  onSwitchMapStyle,
  isTourActive,
  onStartTour,
  onStopTour,
  shaktiLegs = [],
  carbonEstimate,
  baseBudget,
}) => {
  const [transitSubTab, setTransitSubTab] = useState<'origin' | 'trains' | 'buses'>('origin');
  const [discoverSearch, setDiscoverSearch] = useState('');
  const [discoverRegion, setDiscoverRegion] = useState('all');
  const [discoverCategory, setDiscoverCategory] = useState<'all' | 'attractions' | 'railway_station' | 'bus_terminal'>('all');

  const filteredDiscoverPois = useMemo(() => {
    return KARNATAKA_POIS.filter((p) => {
      if (discoverRegion !== 'all' && p.macroRegion !== discoverRegion) return false;
      if (discoverCategory === 'attractions') {
        if (p.category === 'railway_station' || p.category === 'bus_terminal' || p.category === 'airport') return false;
      } else if (discoverCategory === 'railway_station') {
        if (p.category !== 'railway_station') return false;
      } else if (discoverCategory === 'bus_terminal') {
        if (p.category !== 'bus_terminal') return false;
      }
      if (discoverSearch.trim()) {
        const q = discoverSearch.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.nameKannada.includes(q) ||
          p.district.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [discoverSearch, discoverRegion, discoverCategory]);

  const originTrains = useMemo(() => {
    const list = getTrainsForOrigin(userOrigin.id);
    return list.length > 0 ? list : KARNATAKA_TRAIN_SCHEDULES.slice(0, 4);
  }, [userOrigin.id]);
  return (
    <div className="yt-workspace-container">
      {/* ================= 40% LEFT ITINERARY FEED ================= */}
      <aside className="yt-workspace-itinerary-pane">
        {/* Document Header */}
        <div className="yt-doc-header">
          <div className="yt-doc-header-top">
            <div>
              <span className="yt-doc-eyebrow font-kannada">ಪ್ರವಾಸ ವೇಳಾಪಟ್ಟಿ • Field Itinerary</span>
              <h1 className="yt-doc-title">{activeCircuitTitle || 'Custom Karnataka Journey'}</h1>
            </div>

            <div className="yt-doc-actions">
              <button
                type="button"
                className="yt-btn-doc-action"
                onClick={onShareTrip}
                title="Copy shareable trip link"
              >
                {shareCopied ? '✓ Copied' : '🔗 Share'}
              </button>
              <button
                type="button"
                className="yt-btn-doc-action"
                onClick={onExportMarkdown}
                title="Download formatted travel document"
              >
                ⬇ Export
              </button>
            </div>
          </div>

          {/* Key Trip Metrics Bar */}
          <div className="yt-doc-summary-bar">
            <div className="yt-doc-stat">
              <span className="yt-doc-stat-num">{itineraryStops.length}</span>
              <span className="yt-doc-stat-lbl">{uiLanguage === 'kn' ? 'ತಾಣಗಳು' : 'Stops'}</span>
            </div>
            <div className="yt-doc-stat-div">•</div>
            <div className="yt-doc-stat">
              <span className="yt-doc-stat-num">{route.totalDistanceKm}</span>
              <span className="yt-doc-stat-lbl">km</span>
            </div>
            <div className="yt-doc-stat-div">•</div>
            <button
              type="button"
              className="yt-doc-stat yt-doc-stat-btn"
              onClick={() => setDays(days >= 7 ? 1 : days + 1)}
              title={uiLanguage === 'kn' ? 'ದಿನಗಳನ್ನು ಬದಲಿಸಲು ಒತ್ತಿ' : 'Click to adjust trip duration'}
              aria-label={uiLanguage === 'kn' ? `ಪ್ರವಾಸದ ಅವಧಿ: ${days} ದಿನಗಳು. ಬದಲಿಸಲು ಒತ್ತಿ.` : `Trip duration: ${days} days. Click to cycle duration.`}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <span className="yt-doc-stat-num">{days}</span>
              <span className="yt-doc-stat-lbl">{uiLanguage === 'kn' ? 'ದಿನಗಳು (ಬದಲಿಸಿ)' : 'Days (tap)'}</span>
            </button>
            <div className="yt-doc-stat-div">•</div>
            <div className="yt-doc-stat">
              <span className="yt-doc-stat-num text-emerald">₹{netTotalBudgetInr.toLocaleString('en-IN')}</span>
              <span className="yt-doc-stat-lbl">
                {shaktiSavingsInr > 0 ? `(Saved ₹${shaktiSavingsInr})` : 'Est. Total'}
              </span>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="yt-workspace-tabs">
            <button
              type="button"
              className={`yt-ws-tab ${activeTab === 'timeline' ? 'active' : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              📅 {uiLanguage === 'kn' ? 'ವೇಳಾಪಟ್ಟಿ' : 'Timeline'} ({itineraryStops.length})
            </button>
            <button
              type="button"
              className={`yt-ws-tab ${activeTab === 'trains' ? 'active' : ''}`}
              onClick={() => setActiveTab('trains')}
            >
              🚆 {uiLanguage === 'kn' ? 'ರೈಲು & ಬಸ್' : 'Transit & KSRTC'}
            </button>
            <button
              type="button"
              className={`yt-ws-tab ${activeTab === 'budget' ? 'active' : ''}`}
              onClick={() => setActiveTab('budget')}
            >
              ₹ {uiLanguage === 'kn' ? 'ವೆಚ್ಚ & ಶಕ್ತಿ' : 'Budget & Shakti'}
            </button>
            <button
              type="button"
              className={`yt-ws-tab ${activeTab === 'discover' ? 'active' : ''}`}
              onClick={() => setActiveTab('discover')}
            >
              + {uiLanguage === 'kn' ? 'ತಾಣ ಸೇರಿಸಿ' : 'Add Places'}
            </button>
          </div>
        </div>

        {/* Scrollable Timeline Document Content */}
        <div className="yt-doc-content">
          {activeTab === 'timeline' && (
            <div className="yt-timeline-tree">
              {/* Origin Node */}
              <div className="yt-timeline-node origin">
                <div className="yt-node-pin origin">📍</div>
                <div className="yt-node-content">
                  <div className="yt-node-header">
                    <span className="yt-node-tag">Trip Origin</span>
                    <span className="yt-node-time">Depart 07:00 AM</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <h3 className="yt-node-title font-kannada" style={{ margin: 0 }}>
                      {userOrigin.nameKannada} ({userOrigin.name.split('(')[0].trim()})
                    </h3>
                    <select
                      value={userOrigin.id}
                      onChange={(e) => {
                        const found = KARNATAKA_GATEWAY_ORIGINS.find((o) => o.id === e.target.value);
                        if (found) onChangeOrigin(found);
                      }}
                      className="yt-origin-select-inline"
                      style={{ fontSize: 11, padding: '3px 6px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    >
                      {KARNATAKA_GATEWAY_ORIGINS.slice(0, 8).map((orig) => (
                        <option key={orig.id} value={orig.id}>
                          {orig.name.split('(')[0].trim()}
                        </option>
                      ))}
                    </select>
                  </div>
                  {originWeather && (
                    <div className="yt-node-weather">
                      {originWeather.emoji} {originWeather.tempC}°C • {originWeather.label}
                    </div>
                  )}
                </div>
              </div>

              {/* Initial Drive Leg */}
              {itineraryStops.length > 0 && (
                <div className="yt-timeline-connector">
                  <div className="yt-connector-line" />
                  <div className="yt-connector-badge">
                    <span>🚗 Drive to first stop</span>
                    <span>•</span>
                    <span>{route.legs[0]?.distanceKm || 186} km</span>
                    <span>•</span>
                    <span>{Math.round((route.legs[0]?.durationMinutes || 195) / 60)}h {(route.legs[0]?.durationMinutes || 195) % 60}m</span>
                  </div>
                </div>
              )}

              {/* Contextual Ghat Warning if route crosses Western Ghats */}
              {isGhatRoute && (
                <div className="yt-ghat-alert-pill">
                  <span className="yt-ghat-icon">⚠️</span>
                  <div className="yt-ghat-text">
                    <strong>Ghat-Shield Advisory:</strong> Driving through {ghatName || 'Western Ghats Corridor'}. Monitor live precipitation and fog advisories.
                  </div>
                </div>
              )}

              {/* Sequential Destination Stops */}
              {itineraryStops.map((stop, idx) => {
                const photoMeta = getAuthenticDestinationPhoto(stop.id, stop.category, stop.name, stop.district);
                const nextLeg = route.legs[idx + 1];
                const weather = stopsWeather.get(stop.id);

                return (
                  <React.Fragment key={stop.id}>
                    <div className="yt-timeline-node stop">
                      <div className="yt-node-pin stop">{idx + 1}</div>
                      <div className="yt-node-content stop">
                        <div className="yt-stop-card-split">
                          <img
                            src={photoMeta.thumbnailUrl}
                            alt={stop.name}
                            className="yt-stop-card-thumb"
                            onClick={() => onSelectPoiDetail(stop.id)}
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.src.startsWith('data:image/svg+xml')) {
                                target.src = photoMeta.imageUrl;
                              }
                            }}
                          />

                          <div className="yt-stop-card-info">
                            <div className="yt-stop-meta-row">
                              <span className="yt-stop-kannada font-kannada">{stop.nameKannada}</span>
                              <div className="yt-stop-controls">
                                <button
                                  type="button"
                                  className="yt-btn-move"
                                  onClick={() => onMoveStop(idx, -1)}
                                  disabled={idx === 0}
                                  title="Move earlier"
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  className="yt-btn-move"
                                  onClick={() => onMoveStop(idx, 1)}
                                  disabled={idx === itineraryStops.length - 1}
                                  title="Move later"
                                >
                                  ↓
                                </button>
                                <button
                                  type="button"
                                  className="yt-btn-delete"
                                  onClick={() => onRemoveStop(stop.id)}
                                  disabled={itineraryStops.length <= 1}
                                  title="Remove stop"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>

                            <h4
                              className="yt-stop-english-name"
                              onClick={() => onSelectPoiDetail(stop.id)}
                            >
                              {stop.name}
                            </h4>

                            <div className="yt-stop-subline">
                              <span>📍 {stop.district} District</span>
                              <span>•</span>
                              {stop.category === 'railway_station' ? (
                                <span className="font-semibold text-[#7C3AED]">🚆 Railway Interchange ({stop.transportMeta?.officialCode || 'SWR'})</span>
                              ) : stop.category === 'bus_terminal' ? (
                                <span className="font-semibold text-[#DC2626]">🚌 Bus Interchange ({stop.transportMeta?.zoneOrOperator?.split(' ')[0] || 'KSRTC'})</span>
                              ) : stop.category === 'airport' ? (
                                <span className="font-semibold text-[#3B82F6]">✈️ Regional Airport</span>
                              ) : (
                                <span>⏱️ {stop.recommendedHours || 1.5}h visit</span>
                              )}
                              {weather && <span>• {weather.emoji} {weather.tempC}°C</span>}
                            </div>

                            <div className="yt-stop-card-actions">
                              <button
                                type="button"
                                className="yt-btn-stop-dossier"
                                onClick={() => onSelectPoiDetail(stop.id)}
                              >
                                View Details & Hours →
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Connecting Drive Leg to Next Stop */}
                    {nextLeg && idx < itineraryStops.length - 1 && (
                      <div className="yt-timeline-connector">
                        <div className="yt-connector-line" />
                        <div className="yt-connector-badge">
                          <span>🛣️ Drive</span>
                          <span>•</span>
                          <span>{nextLeg.distanceKm} km</span>
                          <span>•</span>
                          <span>{Math.round(nextLeg.durationMinutes / 60)}h {nextLeg.durationMinutes % 60}m</span>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}

              {/* End of Journey Indicator */}
              <div className="yt-timeline-node end">
                <div className="yt-node-pin end">🏁</div>
                <div className="yt-node-content">
                  <div className="yt-node-header">
                    <span className="yt-node-tag">Journey Complete</span>
                  </div>
                  <div className="yt-end-text">
                    Total {route.totalDistanceKm} km explored across Karnataka.
                  </div>
                </div>
              </div>

              {/* Sequence Optimizer CTA */}
              <div className="yt-timeline-footer-tools">
                <button
                  type="button"
                  className="yt-btn-optimize-stops"
                  onClick={onOptimizeSequence}
                >
                  ⚡ Auto-Optimize Stop Sequence for Shortest Driving Time
                </button>
                <button
                  type="button"
                  className="yt-btn-add-more-stops"
                  onClick={() => setActiveTab('discover')}
                >
                  + Add More Destinations
                </button>
              </div>
            </div>
          )}

          {/* ================= VIEW 2: TRANSIT (SWR TRAINS & KSRTC BUSES) ================= */}
          {activeTab === 'trains' && (
            <div className="yt-transit-tab-content">
              {/* Transit Mode Sub-Tabs */}
              <div className="yt-transit-subnav">
                <button
                  type="button"
                  className={`yt-tsub-btn ${transitSubTab === 'origin' ? 'active' : ''}`}
                  onClick={() => setTransitSubTab('origin')}
                >
                  📍 From {userOrigin.name.split('(')[0].trim().slice(0, 14)}
                </button>
                <button
                  type="button"
                  className={`yt-tsub-btn ${transitSubTab === 'trains' ? 'active' : ''}`}
                  onClick={() => setTransitSubTab('trains')}
                >
                  🚆 SWR Trains ({KARNATAKA_TRAIN_SCHEDULES.length})
                </button>
                <button
                  type="button"
                  className={`yt-tsub-btn ${transitSubTab === 'buses' ? 'active' : ''}`}
                  onClick={() => setTransitSubTab('buses')}
                >
                  🚌 KSRTC Buses ({KSRTC_BUS_SERVICES.length})
                </button>
              </div>

              {/* Trains List */}
              {(transitSubTab === 'trains' || transitSubTab === 'origin') && (
                <div className="yt-transit-cards-list">
                  <div className="yt-tab-section-heading">
                    {transitSubTab === 'origin'
                      ? `South Western Railway Connections from ${userOrigin.name.split('(')[0].trim()}`
                      : 'All Karnataka SWR Train Schedules'}
                  </div>
                  {(transitSubTab === 'origin' ? originTrains : KARNATAKA_TRAIN_SCHEDULES).map((tr) => (
                    <div key={tr.id} className="yt-transit-item-card">
                      <div className="yt-tcard-header">
                        <div className="yt-tcard-badges">
                          <span className="yt-pill-purple">🚆 #{tr.trainNumber}</span>
                          <span className="yt-pill-blue">{tr.trainType.replace('_', ' ').toUpperCase()}</span>
                        </div>
                        {tr.savesHotelNight && (
                          <span className="yt-pill-emerald">
                            🌙 Saves ₹{tr.hotelSavingInr.toLocaleString('en-IN')} Stay
                          </span>
                        )}
                      </div>

                      <h4 className="yt-tcard-title">{tr.trainName}</h4>

                      <div className="yt-tcard-route">
                        {tr.originName} ({tr.originCode} • {tr.departureTime}) ➔ {tr.destinationName} ({tr.destinationCode} • {tr.arrivalTime})
                      </div>

                      <div className="yt-tcard-details">
                        <span>⏱️ {tr.durationLabel}</span>
                        <span>•</span>
                        <span>🗓️ {tr.daysRunning.join(', ')}</span>
                        <span>•</span>
                        <span className="font-bold text-emerald">
                          ₹{tr.fareRange.secondClass > 0 ? tr.fareRange.secondClass : tr.fareRange.chair || tr.fareRange.sleeper} onwards
                        </span>
                      </div>

                      <div className="yt-tcard-lore">{tr.specialHighlight}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* KSRTC Buses List */}
              {transitSubTab === 'buses' && (
                <div className="yt-transit-cards-list">
                  <div className="yt-tab-section-heading">
                    KSRTC Inter-District Bus Corridors & Shakti Scheme Eligibility
                  </div>
                  {KSRTC_BUS_SERVICES.map((bus) => (
                    <div key={bus.id} className="yt-transit-item-card">
                      <div className="yt-tcard-header">
                        <div className="yt-tcard-badges">
                          <span className="yt-pill-orange">🚌 {bus.serviceLabel}</span>
                          <span className="yt-pill-blue">{bus.departureTimes.length} daily trips</span>
                        </div>
                        {bus.shaktiFree ? (
                          <span className="yt-pill-emerald">
                            ✓ Shakti Scheme: ₹0 for Women Domicile
                          </span>
                        ) : (
                          <span className="yt-pill-muted">Premium AC (Non-Shakti)</span>
                        )}
                      </div>

                      <h4 className="yt-tcard-title">{bus.serviceLabel}</h4>
                      <div className="yt-tcard-route">
                        {bus.originCity} ({bus.departureTimes[0]}) ➔ {bus.destinationCity}
                      </div>

                      <div className="yt-tcard-details">
                        <span>🛣️ {bus.durationLabel}</span>
                        <span>•</span>
                        <span className="font-bold text-emerald">Fare: ₹{bus.fareInr}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= VIEW 3: BUDGET & SHAKTI AUDIT ================= */}
          {activeTab === 'budget' && (
            <div className="yt-budget-tab-content">
              {/* Financial Snapshot */}
              <div className="yt-budget-snapshot-grid">
                <div className="yt-bsnap-card">
                  <span className="yt-bsnap-label">Net Travel Cost</span>
                  <span className="yt-bsnap-value text-emerald">₹{netTotalBudgetInr.toLocaleString('en-IN')}</span>
                  <span className="yt-bsnap-sub">For {travellers} {travellers === 1 ? 'person' : 'people'} ({days} days)</span>
                </div>
                <div className="yt-bsnap-card">
                  <span className="yt-bsnap-label">Shakti ₹0 Bus Savings</span>
                  <span className="yt-bsnap-value text-blue">₹{shaktiSavingsInr.toLocaleString('en-IN')}</span>
                  <span className="yt-bsnap-sub">{shaktiWomenCount} female domicile {shaktiWomenCount === 1 ? 'passenger' : 'passengers'}</span>
                </div>
                {carbonEstimate && (
                  <div className="yt-bsnap-card">
                    <span className="yt-bsnap-label">CO₂ Carbon Saved</span>
                    <span className="yt-bsnap-value text-emerald">
                      {(carbonEstimate.privateTripKgCo2e - carbonEstimate.selectedTripKgCo2e).toFixed(1)} kg
                    </span>
                    <span className="yt-bsnap-sub">vs. Private SUV</span>
                  </div>
                )}
              </div>

              {/* Budget Parameters Controls */}
              <div className="yt-budget-controls-card">
                <div className="yt-bctrl-group">
                  <label className="yt-bctrl-label">Budget Tier</label>
                  <div className="yt-tier-selector">
                    {(['backpacker', 'comfort', 'premium'] as const).map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        className={`yt-tier-btn ${budgetTier === tier ? 'active' : ''}`}
                        onClick={() => setBudgetTier(tier)}
                      >
                        {tier.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="yt-bctrl-row">
                  <div className="yt-bctrl-group">
                    <label className="yt-bctrl-label">Total Travellers</label>
                    <div className="yt-stepper">
                      <button
                        type="button"
                        onClick={() => setTravellers(Math.max(1, travellers - 1))}
                        disabled={travellers <= 1}
                      >
                        -
                      </button>
                      <span>{travellers}</span>
                      <button
                        type="button"
                        onClick={() => setTravellers(travellers + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="yt-bctrl-group">
                    <label className="yt-bctrl-label">Shakti Eligible Women</label>
                    <div className="yt-stepper">
                      <button
                        type="button"
                        onClick={() => setShaktiWomenCount(Math.max(0, shaktiWomenCount - 1))}
                        disabled={shaktiWomenCount <= 0}
                      >
                        -
                      </button>
                      <span>{shaktiWomenCount}</span>
                      <button
                        type="button"
                        onClick={() => setShaktiWomenCount(Math.min(travellers, shaktiWomenCount + 1))}
                        disabled={shaktiWomenCount >= travellers}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Base Budget Breakdown */}
              {baseBudget && (
                <div className="yt-budget-breakdown-card">
                  <h4 className="yt-bbreak-title">Estimated Category Breakdown</h4>
                  <div className="yt-bbreak-rows">
                    <div className="yt-bbreak-row">
                      <span>🏨 Accommodation ({days - 1} nights)</span>
                      <span>₹{baseBudget.stayInr.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="yt-bbreak-row">
                      <span>🚌 Transport (Gross)</span>
                      <span>₹{baseBudget.transportInr.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="yt-bbreak-row">
                      <span>🏛️ Monument Entry Fees</span>
                      <span>₹{baseBudget.activityInr.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="yt-bbreak-row">
                      <span>☕ Food & Local Karnataka Dining</span>
                      <span>₹{baseBudget.mealsInr.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="yt-bbreak-divider" />
                    <div className="yt-bbreak-row total">
                      <span>Gross Total</span>
                      <span>₹{baseBudget.totalInr.toLocaleString('en-IN')}</span>
                    </div>
                    {shaktiSavingsInr > 0 && (
                      <div className="yt-bbreak-row discount">
                        <span>Shakti Scheme Subsidy</span>
                        <span>- ₹{shaktiSavingsInr.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="yt-bbreak-row net">
                      <span>Final Net Total</span>
                      <span className="text-emerald">₹{netTotalBudgetInr.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Statutory Shakti Scheme Per-Leg Audit Ledger */}
              {shaktiLegs.length > 0 && (
                <div className="yt-shakti-audit-table-card">
                  <div className="yt-saudit-header">
                    <h4 className="yt-saudit-title">Statutory Shakti Scheme Per-Leg Audit</h4>
                    <span className="yt-saudit-badge">GoK Order TRD 34 MDA 2023</span>
                  </div>
                  <div className="yt-saudit-table-wrap">
                    <table className="yt-saudit-table">
                      <thead>
                        <tr>
                          <th>Corridor Leg</th>
                          <th>Service Type</th>
                          <th>Base Fare</th>
                          <th>Fare Paid</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shaktiLegs.map((leg) => (
                          <tr key={leg.id}>
                            <td className="yt-td-leg">{leg.description}</td>
                            <td className="yt-td-service">{leg.serviceLabel}</td>
                            <td className="yt-td-fare">₹{leg.baseFareInr}</td>
                            <td className="yt-td-paid font-bold">₹{leg.farePaidInr}</td>
                            <td className="yt-td-status">
                              {leg.eligibility === 'verified-eligible' ? (
                                <span className="yt-status-tag verified">✓ ₹0 Shakti</span>
                              ) : (
                                <span className="yt-status-tag exempt">Standard Fare</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= VIEW 4: DISCOVER & ADD PLACES ================= */}
          {activeTab === 'discover' && (
            <div className="yt-discover-tab-content">
              <div className="yt-discover-header">
                <input
                  type="text"
                  value={discoverSearch}
                  onChange={(e) => setDiscoverSearch(e.target.value)}
                  placeholder="Search Karnataka's 650 destinations..."
                  className="yt-discover-search-input"
                />

                <div className="yt-discover-region-chips">
                  {['all', 'Old Mysuru', 'Malnad & Western Ghats', 'Karavali Coastal', 'Kalyana Karnataka', 'Kittur Karnataka', 'Central Karnataka'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={`yt-dchip ${discoverRegion === r ? 'active' : ''}`}
                      onClick={() => setDiscoverRegion(r)}
                    >
                      {r === 'all' ? 'All Regions' : r.replace(' & Western Ghats', '')}
                    </button>
                  ))}
                </div>

                {/* Category Filter Chips */}
                <div className="yt-discover-region-chips" style={{ marginTop: 6 }}>
                  <button
                    type="button"
                    className={`yt-dchip ${discoverCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setDiscoverCategory('all')}
                  >
                    ✨ All Places
                  </button>
                  <button
                    type="button"
                    className={`yt-dchip ${discoverCategory === 'attractions' ? 'active' : ''}`}
                    onClick={() => setDiscoverCategory('attractions')}
                  >
                    🏰 Attractions & Heritage
                  </button>
                  <button
                    type="button"
                    className={`yt-dchip ${discoverCategory === 'railway_station' ? 'active' : ''}`}
                    onClick={() => setDiscoverCategory('railway_station')}
                  >
                    🚆 Railway Stations
                  </button>
                  <button
                    type="button"
                    className={`yt-dchip ${discoverCategory === 'bus_terminal' ? 'active' : ''}`}
                    onClick={() => setDiscoverCategory('bus_terminal')}
                  >
                    🚌 Bus Terminals
                  </button>
                </div>
              </div>

              <div className="yt-discover-items-list">
                {filteredDiscoverPois.slice(0, 30).map((poi) => {
                  const photo = getAuthenticDestinationPhoto(poi.id, poi.category, poi.name, poi.district);
                  const isAlreadyInTrip = itineraryStops.some((s) => s.id === poi.id);

                  return (
                    <div key={poi.id} className="yt-discover-card">
                      <img
                        src={photo.thumbnailUrl}
                        alt={poi.name}
                        className="yt-dcard-thumb"
                        onClick={() => onSelectPoiDetail(poi.id)}
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.startsWith('data:image/svg+xml')) {
                            target.src = photo.imageUrl;
                          }
                        }}
                      />
                      <div className="yt-dcard-info">
                        <div className="yt-dcard-kannada font-kannada">{poi.nameKannada}</div>
                        <h4 className="yt-dcard-name" onClick={() => onSelectPoiDetail(poi.id)}>
                          {poi.name}
                        </h4>
                        <div className="yt-dcard-meta">
                          <span>📍 {poi.district}</span>
                          <span>•</span>
                          {poi.category === 'railway_station' ? (
                            <span className="font-semibold text-[#7C3AED]">🚆 Railway Interchange ({poi.transportMeta?.officialCode || 'SWR'})</span>
                          ) : poi.category === 'bus_terminal' ? (
                            <span className="font-semibold text-[#DC2626]">🚌 Bus Interchange ({poi.transportMeta?.zoneOrOperator?.split(' ')[0] || 'KSRTC'})</span>
                          ) : poi.category === 'airport' ? (
                            <span className="font-semibold text-[#3B82F6]">✈️ Regional Airport</span>
                          ) : (
                            <span>⏱️ {poi.recommendedHours || 1.5}h</span>
                          )}
                        </div>
                      </div>

                      <div className="yt-dcard-actions">
                        <button
                          type="button"
                          className="yt-btn-dcard-details"
                          onClick={() => onSelectPoiDetail(poi.id)}
                          title="View Details"
                        >
                          Details
                        </button>
                        {isAlreadyInTrip ? (
                          <button
                            type="button"
                            className="yt-btn-dcard-remove"
                            onClick={() => onRemoveStop(poi.id)}
                          >
                            ✓ Added
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="yt-btn-dcard-add"
                            onClick={() => onAddStop(poi.id)}
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ================= 60% RIGHT MAPLIBRE CANVAS ================= */}
      <main className="yt-workspace-map-pane">
        <div ref={mapContainerRef} className="yt-maplibre-canvas" />

        {/* Restrained Map Floating Controls */}
        <div className="yt-map-restrained-controls">
          {/* Fit Route */}
          <button
            type="button"
            className="yt-map-ctrl-btn"
            onClick={onFitMapRoute}
            title="Fit view to complete route geometry"
          >
            🗺️ Fit Route
          </button>

          {/* Map Style Selector */}
          <div className="yt-map-style-group">
            {(['bright', 'liberty', 'dark'] as const).map((st) => (
              <button
                key={st}
                type="button"
                className={`yt-map-style-chip ${mapStyleId === st ? 'active' : ''}`}
                onClick={() => onSwitchMapStyle(st)}
              >
                {st === 'bright' ? 'Day' : st === 'liberty' ? 'Terrain' : 'Night'}
              </button>
            ))}
          </div>

          {/* Tour Simulation (Explicit trigger only) */}
          {isTourActive ? (
            <button
              type="button"
              className="yt-map-ctrl-btn tour-active"
              onClick={onStopTour}
            >
              ⏹ Stop Tour
            </button>
          ) : (
            <button
              type="button"
              className="yt-map-ctrl-btn"
              onClick={onStartTour}
              title="Experience 3D animated route tour"
            >
              ▶ 3D Route Tour
            </button>
          )}
        </div>
      </main>
    </div>
  );
};
