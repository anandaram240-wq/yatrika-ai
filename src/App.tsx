// src/App.tsx

import { useState, useEffect, useMemo } from 'react';
import { BasemapStyleId, MAP_PROVIDER_CONFIG } from './config/mapProviders';
import {
  KARNATAKA_POIS,
  CURATED_CIRCUIT_PRESETS,
  LAYER_CATEGORY_META,
  getPoiById,
} from './data/karnatakaTravelRegistry';
import {
  BudgetTier,
  ComputedTripRoute,
  KarnatakaPOI,
  MapLayerCategory,
} from './types/nammatrip';
import {
  buildFallbackRoadCorridor,
  calculateMultiStopRoadRoute,
  optimizeStopSequence,
} from './services/routingService';
import {
  calculateTripBudget,
  exportItineraryToMarkdown,
  parseTripFromQueryString,
  serializeTripToQueryString,
} from './services/tripPlannerEngine';
import { NammaTripMap } from './components/NammaTripMap';

const STORAGE_KEY = 'nammatrip_saved_state_v1';

export function App() {
  // Initialize trip from URL query string or localStorage
  const initialTrip = useMemo(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('stops=')) {
      return parseTripFromQueryString(window.location.search);
    }
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed.stopIds) && parsed.stopIds.length >= 2) {
            return parsed;
          }
        }
      } catch {
        // Ignore storage read errors
      }
    }
    return parseTripFromQueryString('');
  }, []);

  const [stopIds, setStopIds] = useState<string[]>(initialTrip.stopIds);
  const [days, setDays] = useState<number>(initialTrip.days);
  const [travellers, setTravellers] = useState<number>(initialTrip.travellers);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>(initialTrip.tier);
  const [styleId, setStyleId] = useState<BasemapStyleId>(MAP_PROVIDER_CONFIG.defaultStyleId);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'directions' | 'transport' | 'layers' | 'budget'>('itinerary');
  const [selectedPoiId, setSelectedPoiId] = useState<string | null>(initialTrip.stopIds[0] || 'poi-mysore-palace');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [shareCopied, setShareCopied] = useState<boolean>(false);

  // Initialize all 15 layer toggles
  const [activeLayers, setActiveLayers] = useState<Record<MapLayerCategory, boolean>>(() => {
    const map = {} as Record<MapLayerCategory, boolean>;
    LAYER_CATEGORY_META.forEach((m) => {
      map[m.id] = m.defaultVisible;
    });
    return map;
  });

  // Resolve ordered itinerary stop objects
  const itineraryStops = useMemo(
    () => stopIds.map((id) => getPoiById(id)).filter((p): p is KarnatakaPOI => Boolean(p)),
    [stopIds]
  );

  // Compute initial fallback route synchronously, then upgrade via live OSRM road routing
  const [route, setRoute] = useState<ComputedTripRoute>(() =>
    buildFallbackRoadCorridor(itineraryStops)
  );
  const [isRoutingLoading, setIsRoutingLoading] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    setIsRoutingLoading(true);
    calculateMultiStopRoadRoute(itineraryStops, controller.signal)
      .then((res) => {
        setRoute(res);
        setIsRoutingLoading(false);
      })
      .catch(() => {
        setRoute(buildFallbackRoadCorridor(itineraryStops));
        setIsRoutingLoading(false);
      });

    return () => controller.abort();
  }, [itineraryStops]);

  // Persist to localStorage and sync URL query params
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const state = { stopIds, days, travellers, tier: budgetTier };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      const qs = serializeTripToQueryString(state);
      window.history.replaceState(null, '', qs);
    } catch {
      // Ignore storage quota errors
    }
  }, [stopIds, days, travellers, budgetTier]);

  const budget = useMemo(
    () =>
      calculateTripBudget({
        stops: itineraryStops,
        route,
        days,
        travellers,
        tier: budgetTier,
      }),
    [itineraryStops, route, days, travellers, budgetTier]
  );

  const selectedPoi = useMemo(
    () => (selectedPoiId ? getPoiById(selectedPoiId) || null : null),
    [selectedPoiId]
  );

  const nearestRailway = useMemo(
    () => (selectedPoi ? getPoiById(selectedPoi.nearestRailwayId) : undefined),
    [selectedPoi]
  );

  const nearestBus = useMemo(
    () => (selectedPoi ? getPoiById(selectedPoi.nearestBusTerminalId) : undefined),
    [selectedPoi]
  );

  const filteredPoisForSearch = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return KARNATAKA_POIS;
    return KARNATAKA_POIS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.macroRegion.toLowerCase().includes(q) ||
        p.nameKannada.includes(q)
    );
  }, [searchQuery]);

  // Itinerary Stop Actions
  const handleAddStop = (poiId: string) => {
    if (!stopIds.includes(poiId)) {
      setStopIds((prev) => [...prev, poiId]);
    }
    setSelectedPoiId(poiId);
  };

  const handleRemoveStop = (poiId: string) => {
    if (stopIds.length <= 2) return; // Keep at least 2 stops for a valid route
    setStopIds((prev) => prev.filter((id) => id !== poiId));
  };

  const handleMoveStop = (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= stopIds.length) return;
    const copy = [...stopIds];
    const [item] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, item);
    setStopIds(copy);
  };

  const handleOptimizeStops = () => {
    const optimized = optimizeStopSequence(itineraryStops);
    setStopIds(optimized.map((s) => s.id));
  };

  const handleLoadCircuitPreset = (presetId: string) => {
    const preset = CURATED_CIRCUIT_PRESETS.find((c) => c.id === presetId);
    if (!preset) return;
    setStopIds(preset.stopIds);
    setDays(preset.days);
    setBudgetTier(preset.defaultTier);
    setSelectedPoiId(preset.stopIds[0]);
  };

  const handleSpeakKannada = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'kn-IN';
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyShareLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard?.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  const handleDownloadItineraryMd = () => {
    const md = exportItineraryToMarkdown({ stops: itineraryStops, route, budget });
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NammaTrip-Karnataka-${days}Days.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#0f172a',
      }}
    >
      {/* Top Application Header */}
      <header
        style={{
          height: 58,
          background: '#0f172a',
          color: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          borderBottom: '1px solid #1e293b',
          zIndex: 20,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            style={{
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #334155',
              borderRadius: 6,
              padding: '6px 10px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            {sidebarOpen ? '◀ Hide Planner' : '▶ Open Planner'}
          </button>
          <div>
            <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em', color: '#38bdf8' }}>
              NammaTrip AI
            </span>
            <span style={{ marginLeft: 8, fontSize: 13, color: '#cbd5e1' }}>
              ನಮ್ಮ ಟ್ರಿಪ್ — Karnataka Geospatial Travel, Rail/KSRTC & Heritage Planner
            </span>
          </div>
        </div>

        {/* Quick Route & Budget Summary Pill + Share Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              background: '#1e293b',
              padding: '5px 12px',
              borderRadius: 999,
              fontSize: 12,
              display: 'flex',
              gap: 12,
            }}
          >
            <span>
              <strong>{itineraryStops.length}</strong> Stops
            </span>
            <span>•</span>
            <span>
              <strong>{route.totalDistanceKm}</strong> km
            </span>
            <span>•</span>
            <span>
              <strong>
                {Math.floor(route.totalDurationMinutes / 60)}h {route.totalDurationMinutes % 60}m
              </strong>{' '}
              drive
            </span>
            <span>•</span>
            <span style={{ color: '#4ade80', fontWeight: 700 }}>
              ₹{budget.totalInr.toLocaleString('en-IN')} ({budgetTier})
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyShareLink}
            style={{
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {shareCopied ? '✓ Link Copied' : '🔗 Share Trip'}
          </button>

          <button
            type="button"
            onClick={handleDownloadItineraryMd}
            style={{
              background: '#334155',
              color: '#f8fafc',
              border: 'none',
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ⬇ Export .MD
          </button>
        </div>
      </header>

      {/* Main Workspace: Collapsible Planner Sidebar + Full-Viewport MapLibre Canvas */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', overflow: 'hidden' }}>
        {sidebarOpen && (
          <aside
            aria-label="Trip planning sidebar"
            style={{
              width: 390,
              maxWidth: '100vw',
              height: '100%',
              background: '#ffffff',
              borderRight: '1px solid #cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 15,
              boxShadow: '4px 0 16px rgba(15,23,42,0.08)',
            }}
          >
            {/* Curated Karnataka Circuit Presets */}
            <div style={{ padding: '10px 12px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6, textTransform: 'uppercase' }}>
                Instant Karnataka Circuit Presets
              </div>
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
                {CURATED_CIRCUIT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleLoadCircuitPreset(preset.id)}
                    style={{
                      flexShrink: 0,
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      color: '#1e40af',
                      borderRadius: 6,
                      padding: '5px 8px',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {preset.title} ({preset.days}D)
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                borderBottom: '1px solid #e2e8f0',
                background: '#f1f5f9',
              }}
            >
              {(
                [
                  { id: 'itinerary', label: 'Stops' },
                  { id: 'directions', label: 'Route' },
                  { id: 'transport', label: 'Rail/Bus' },
                  { id: 'budget', label: 'Budget' },
                  { id: 'layers', label: 'Layers' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '9px 4px',
                    fontSize: 12,
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    color: activeTab === tab.id ? '#2563eb' : '#475569',
                    background: activeTab === tab.id ? '#ffffff' : 'transparent',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent',
                    cursor: 'pointer',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Tab Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
              {/* TAB 1: MULTI-STOP ITINERARY & POI DISCOVERY */}
              {activeTab === 'itinerary' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>
                      Active Multi-Stop Itinerary ({itineraryStops.length})
                    </h2>
                    <button
                      type="button"
                      onClick={handleOptimizeStops}
                      style={{
                        background: '#ecfdf5',
                        border: '1px solid #6ee7b7',
                        color: '#047857',
                        borderRadius: 6,
                        padding: '4px 8px',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      ⚡ Optimize Order
                    </button>
                  </div>

                  {/* Ordered Stop List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    {itineraryStops.map((stop, idx) => (
                      <div
                        key={stop.id}
                        onClick={() => setSelectedPoiId(stop.id)}
                        style={{
                          padding: 10,
                          borderRadius: 8,
                          border: selectedPoiId === stop.id ? '2px solid #2563eb' : '1px solid #cbd5e1',
                          background: selectedPoiId === stop.id ? '#f8fafc' : '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>
                            <span
                              style={{
                                display: 'inline-block',
                                width: 20,
                                height: 20,
                                borderRadius: 999,
                                background: '#ea580c',
                                color: '#fff',
                                textAlign: 'center',
                                lineHeight: '20px',
                                fontSize: 11,
                                marginRight: 6,
                              }}
                            >
                              {idx + 1}
                            </span>
                            {stop.name}
                          </div>
                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                            {stop.nameKannada} • {stop.district} ({stop.recommendedHours}h)
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 4 }} onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => handleMoveStop(idx, -1)}
                            disabled={idx === 0}
                            title="Move stop up"
                            style={miniBtnStyle}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveStop(idx, 1)}
                            disabled={idx === itineraryStops.length - 1}
                            title="Move stop down"
                            style={miniBtnStyle}
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveStop(stop.id)}
                            disabled={itineraryStops.length <= 2}
                            title="Remove stop"
                            style={{ ...miniBtnStyle, color: '#dc2626' }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Destination Search & Add to Trip */}
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
                    <label htmlFor="poi-search" style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                      Discover & Add Karnataka Destinations / Hubs
                    </label>
                    <input
                      id="poi-search"
                      type="search"
                      placeholder="Search Hampi, Coorg, Udupi, SBC, Dose..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        fontSize: 12,
                        marginBottom: 8,
                        boxSizing: 'border-box',
                      }}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {filteredPoisForSearch.map((poi) => {
                        const inTrip = stopIds.includes(poi.id);
                        return (
                          <div
                            key={poi.id}
                            style={{
                              padding: '7px 9px',
                              borderRadius: 6,
                              border: '1px solid #e2e8f0',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontSize: 12,
                            }}
                          >
                            <div
                              style={{ cursor: 'pointer', flex: 1 }}
                              onClick={() => setSelectedPoiId(poi.id)}
                            >
                              <div style={{ fontWeight: 600 }}>{poi.name}</div>
                              <div style={{ fontSize: 11, color: '#64748b' }}>
                                {poi.district} • {poi.category.replace('_', ' ')}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAddStop(poi.id)}
                              disabled={inTrip}
                              style={{
                                background: inTrip ? '#e2e8f0' : '#2563eb',
                                color: inTrip ? '#64748b' : '#ffffff',
                                border: 'none',
                                borderRadius: 5,
                                padding: '4px 8px',
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: inTrip ? 'default' : 'pointer',
                              }}
                            >
                              {inTrip ? 'Added' : '+ Add Stop'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ROAD-ROUTE GEOMETRY & TURN-BY-TURN DIRECTIONS */}
              {activeTab === 'directions' && (
                <div>
                  <div
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      background: route.provenance === 'live_osrm' ? '#eff6ff' : '#fffbeb',
                      border: `1px solid ${route.provenance === 'live_osrm' ? '#bfdbfe' : '#fde68a'}`,
                      marginBottom: 12,
                      fontSize: 12,
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>
                      {isRoutingLoading ? 'Calculating road geometry...' : route.provenanceLabel}
                    </div>
                    <div style={{ marginTop: 4, color: '#334155' }}>
                      Total Distance: <strong>{route.totalDistanceKm} km</strong> • Est. Drive:{' '}
                      <strong>
                        {Math.floor(route.totalDurationMinutes / 60)} hrs {route.totalDurationMinutes % 60} mins
                      </strong>
                    </div>
                  </div>

                  {route.legs.map((leg, idx) => (
                    <div
                      key={`${leg.fromStopId}-${leg.toStopId}-${idx}`}
                      style={{
                        marginBottom: 12,
                        border: '1px solid #cbd5e1',
                        borderRadius: 8,
                        padding: 10,
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: 13 }}>
                        Leg {idx + 1}: {leg.fromStopName} → {leg.toStopName}
                      </div>
                      <div style={{ fontSize: 11, color: '#475569', marginBottom: 8 }}>
                        {leg.distanceKm} km • {leg.durationMinutes} mins
                      </div>
                      <ol style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#334155' }}>
                        {leg.steps.map((st, sIdx) => (
                          <li key={sIdx} style={{ marginBottom: 4 }}>
                            {st.instruction}{' '}
                            <span style={{ color: '#64748b' }}>
                              ({st.distanceKm} km, {st.durationMinutes}m)
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: RAILWAY & KSRTC BUS DISCOVERY + BOOKING HAND-OFFS */}
              {activeTab === 'transport' && (
                <div>
                  <h2 style={{ fontSize: 14, fontWeight: 700, marginTop: 0 }}>
                    Verified Indian Railways (SWR/KR) & KSRTC Booking Hand-Offs
                  </h2>
                  <p style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
                    Select any station or bus terminal to inspect official codes, routes, and launch verified booking portals.
                  </p>

                  {KARNATAKA_POIS.filter(
                    (p) => p.category === 'railway_station' || p.category === 'bus_terminal' || p.category === 'airport'
                  ).map((hub) => (
                    <div
                      key={hub.id}
                      onClick={() => setSelectedPoiId(hub.id)}
                      style={{
                        border: '1px solid #cbd5e1',
                        borderRadius: 8,
                        padding: 10,
                        marginBottom: 10,
                        cursor: 'pointer',
                        background: selectedPoiId === hub.id ? '#f8fafc' : '#ffffff',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{hub.name}</span>
                        <span
                          style={{
                            background: '#e0e7ff',
                            color: '#3730a3',
                            padding: '2px 6px',
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {hub.transportMeta?.officialCode}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
                        {hub.transportMeta?.zoneOrOperator} • {hub.transportMeta?.referenceFareNote}
                      </div>
                      {hub.transportMeta?.bookingPortalUrl && (
                        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                          <a
                            href={hub.transportMeta.bookingPortalUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              background: hub.category === 'bus_terminal' ? '#dc2626' : '#1d4ed8',
                              color: '#ffffff',
                              textDecoration: 'none',
                              padding: '5px 10px',
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                          >
                            {hub.category === 'bus_terminal' ? 'Book on Official KSRTC.in ↗' : 'Book on Official IRCTC.co.in ↗'}
                          </a>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddStop(hub.id);
                            }}
                            style={miniBtnStyle}
                          >
                            + Add Hub to Route
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: DYNAMIC BUDGET CALCULATOR */}
              {activeTab === 'budget' && (
                <div>
                  <h2 style={{ fontSize: 14, fontWeight: 700, marginTop: 0 }}>
                    Trip Budget & Duration Calculator (INR)
                  </h2>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                    <div>
                      <label htmlFor="trip-days" style={{ fontSize: 11, fontWeight: 600, display: 'block' }}>
                        Trip Duration (Days)
                      </label>
                      <input
                        id="trip-days"
                        type="number"
                        min={1}
                        max={14}
                        value={days}
                        onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))}
                        style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label htmlFor="trip-travellers" style={{ fontSize: 11, fontWeight: 600, display: 'block' }}>
                        Travellers
                      </label>
                      <input
                        id="trip-travellers"
                        type="number"
                        min={1}
                        max={12}
                        value={travellers}
                        onChange={(e) => setTravellers(Math.max(1, Number(e.target.value) || 1))}
                        style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                    {(['backpacker', 'comfort', 'premium'] as BudgetTier[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setBudgetTier(t)}
                        style={{
                          flex: 1,
                          padding: '7px 4px',
                          borderRadius: 6,
                          border: budgetTier === t ? '2px solid #2563eb' : '1px solid #cbd5e1',
                          background: budgetTier === t ? '#eff6ff' : '#ffffff',
                          fontWeight: 700,
                          fontSize: 11,
                          textTransform: 'capitalize',
                          cursor: 'pointer',
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 13,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span>Road / Rail / KSRTC Transit ({route.totalDistanceKm} km):</span>
                      <strong>₹{budget.transportInr.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span>Accommodation ({Math.max(0, days - 1)} nights):</span>
                      <strong>₹{budget.accommodationInr.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span>Regional Food & Darshinis ({days} days):</span>
                      <strong>₹{budget.foodInr.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span>ASI Monuments / Safari / Entry Fees:</span>
                      <strong>₹{budget.entryAndActivitiesInr.toLocaleString('en-IN')}</strong>
                    </div>
                    <div
                      style={{
                        borderTop: '1px solid #cbd5e1',
                        paddingTop: 8,
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 15,
                        fontWeight: 800,
                        color: '#0f172a',
                      }}
                    >
                      <span>Total Estimated Trip Cost:</span>
                      <span>₹{budget.totalInr.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 4, textAlign: 'right' }}>
                      ₹{budget.perPersonPerDayInr.toLocaleString('en-IN')} per person / day
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: 15 INDEPENDENTLY TOGGLEABLE MAP LAYERS */}
              {activeTab === 'layers' && (
                <div>
                  <h2 style={{ fontSize: 14, fontWeight: 700, marginTop: 0 }}>
                    Map Layers & Point-of-Interest Filters (15 Categories)
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {LAYER_CATEGORY_META.map((layer) => (
                      <label
                        key={layer.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 8px',
                          borderRadius: 6,
                          border: '1px solid #e2e8f0',
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 999,
                              background: layer.colorHex,
                              display: 'inline-block',
                            }}
                          />
                          {layer.label}
                        </span>
                        <input
                          type="checkbox"
                          checked={activeLayers[layer.id]}
                          onChange={(e) =>
                            setActiveLayers((prev) => ({
                              ...prev,
                              [layer.id]: e.target.checked,
                            }))
                          }
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Selected Place Detail Card + Embedded Regional Kannada Companion */}
            {selectedPoi && (
              <div
                style={{
                  borderTop: '2px solid #cbd5e1',
                  background: '#f8fafc',
                  padding: 12,
                  maxHeight: '42%',
                  overflowY: 'auto',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>{selectedPoi.name}</div>
                    <div style={{ fontSize: 12, color: '#475569' }}>
                      {selectedPoi.nameKannada} • {selectedPoi.district} ({selectedPoi.macroRegion})
                    </div>
                  </div>
                  {!stopIds.includes(selectedPoi.id) && (
                    <button
                      type="button"
                      onClick={() => handleAddStop(selectedPoi.id)}
                      style={{
                        background: '#ea580c',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '5px 10px',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      + Add to Trip
                    </button>
                  )}
                </div>

                <p style={{ fontSize: 12, color: '#334155', margin: '6px 0' }}>{selectedPoi.summary}</p>

                <div style={{ fontSize: 11, color: '#475569', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                  <div>
                    <strong>Hours:</strong> {selectedPoi.openingHours}
                  </div>
                  <div>
                    <strong>Fee:</strong> ₹{selectedPoi.entryFeeInr.indianCitizen} ({selectedPoi.entryFeeInr.feeNote})
                  </div>
                  <div>
                    <strong>Nearest Rail:</strong> {nearestRailway?.name || 'N/A'}
                  </div>
                  <div>
                    <strong>Nearest KSRTC:</strong> {nearestBus?.name || 'N/A'}
                  </div>
                </div>

                {/* Regional Kannada Companion Box (Preserved Cultural Moat) */}
                <div
                  style={{
                    marginTop: 8,
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: 8,
                    padding: 8,
                    fontSize: 11,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: '#1e40af' }}>
                      🗣️ Local Kannada Companion ({selectedPoi.localPhrase.dialectLabel})
                    </strong>
                    <button
                      type="button"
                      onClick={() => handleSpeakKannada(selectedPoi.localPhrase.kannada)}
                      style={{
                        background: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 4,
                        padding: '3px 8px',
                        fontSize: 11,
                        cursor: 'pointer',
                      }}
                    >
                      🔊 Speak (kn-IN)
                    </button>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }} lang="kn">
                    {selectedPoi.localPhrase.kannada}
                  </div>
                  <div style={{ fontStyle: 'italic', color: '#334155' }}>{selectedPoi.localPhrase.iast}</div>
                  <div style={{ color: '#475569' }}>"{selectedPoi.localPhrase.english}"</div>
                </div>

                <div style={{ fontSize: 10, color: '#64748b', marginTop: 6 }}>
                  Source: {selectedPoi.sourceAttribution} • Verified: {selectedPoi.verifiedDate} • Coords:{' '}
                  {selectedPoi.coordinates[1].toFixed(4)}°N, {selectedPoi.coordinates[0].toFixed(4)}°E
                </div>
              </div>
            )}
          </aside>
        )}

        {/* Primary WebGL Map Canvas */}
        <main style={{ flex: 1, height: '100%', position: 'relative' }}>
          <NammaTripMap
            allPois={KARNATAKA_POIS}
            itineraryStops={itineraryStops}
            selectedPoiId={selectedPoiId}
            onSelectPoi={(id) => setSelectedPoiId(id)}
            route={route}
            activeLayers={activeLayers}
            styleId={styleId}
            onChangeStyleId={(s) => setStyleId(s)}
            sidebarOpen={sidebarOpen}
          />
        </main>
      </div>
    </div>
  );
}

const miniBtnStyle: React.CSSProperties = {
  border: '1px solid #cbd5e1',
  background: '#ffffff',
  borderRadius: 4,
  padding: '2px 6px',
  fontSize: 11,
  cursor: 'pointer',
};

export default App;
