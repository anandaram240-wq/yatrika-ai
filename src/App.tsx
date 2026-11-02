// src/App.tsx — YatriKa AI (V9.0 Karnataka Intelligent Journey Platform)
import React, { useState, useMemo } from 'react';
import {
  KARNATAKA_DESTINATIONS,
  DestinationRecord,
  resolveDestinationQuery,
} from './data/destinationsRegistry';
import {
  HAMPI_ATTRACTIONS,
  HAMPI_VERIFIED_MEDIA,
  HampiAttraction,
  HampiClusterId,
} from './data/hampiVerifiedRegistry';
import { HampiDualModeMap } from './components/map/HampiDualModeMap';
import { VerifiedCommonsImage } from './components/media/VerifiedCommonsImage';
import { DepartureAndFeasibilityWorkspace } from './components/journey/DepartureAndFeasibilityWorkspace';
import { GuidedJourneyWizard, CompleteJourneyRequest } from './components/journey/GuidedJourneyWizard';
import {
  calculateHonestBudget,
} from './engines/budgetLedgerEngine';
import {
  BudgetLineItem,
  BudgetAndClassConfig,
  TravellerGroupConfig,
} from './types/journeySchema';
import {
  VERIFIED_KARNATAKA_TRAINS,
  VERIFIED_KARNATAKA_BUSES,
} from './data/railwayAndBusRegistry';
import { HAMPI_ACCOMMODATION_REGISTRY } from './data/accommodationAndDossierRegistry';
import { HAMPI_SAFETY_EVIDENCE_RECORDS } from './data/safetyAndWeatherRegistry';
import {
  VERIFIED_CORRIDOR_DETOURS,
  RouteCorridorDetourCandidate,
  evaluateJourneyFeasibilityDeterministically,
} from './engines/feasibilityAndDetourEngine';
import { KARNATAKA_31_DISTRICTS } from './data/karnataka31DistrictsBaseline';

type WorkspaceKey =
  | 'discover'
  | 'explorer'
  | 'builder'
  | 'feasibility'
  | 'transport'
  | 'accommodation'
  | 'safety'
  | 'sources';

const WORKSPACES: { key: WorkspaceKey; code: string; label: string }[] = [
  { key: 'discover', code: 'A', label: 'Discover Karnataka' },
  { key: 'explorer', code: 'B', label: 'Interactive Explorer' },
  { key: 'builder', code: 'C', label: 'Journey Builder' },
  { key: 'feasibility', code: 'D', label: 'Feasibility Engine' },
  { key: 'transport', code: 'E', label: 'Transport & Last-Mile' },
  { key: 'accommodation', code: 'F', label: 'Accommodation' },
  { key: 'safety', code: 'G', label: 'Safety & Awareness' },
  { key: 'sources', code: 'H', label: 'Source & Evidence' },
];

export function App() {
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceKey>('explorer');
  const [searchInput, setSearchInput] = useState<string>('Hampi');
  const [destination, setDestination] = useState<DestinationRecord>(KARNATAKA_DESTINATIONS.hampi);
  const [activeCluster, setActiveCluster] = useState<HampiClusterId | 'all'>('all');
  const [selectedPoi, setSelectedPoi] = useState<HampiAttraction>(HAMPI_ATTRACTIONS[0]);
  const [itineraryStops, setItineraryStops] = useState<HampiAttraction[]>([
    HAMPI_ATTRACTIONS[0],
    HAMPI_ATTRACTIONS[1],
    HAMPI_ATTRACTIONS[10],
    HAMPI_ATTRACTIONS[13],
  ]);
  const [districtDivisionFilter, setDistrictDivisionFilter] = useState<string>('ALL');
  const [detourCandidates, setDetourCandidates] = useState<RouteCorridorDetourCandidate[]>([]);

  // Default Traveller Group & Budget/Class Config (Decoupled per Section 10)
  const [groupConfig, setGroupConfig] = useState<TravellerGroupConfig>({
    adults: 2,
    children: 0,
    seniors: 0,
    roomsRequired: 1,
    nights: 1,
    accessibilityNeeds: { stepFreeAccess: false, minimalWalking: false, wheelchairFriendly: false },
  });

  const [budgetAndClass, setBudgetAndClass] = useState<BudgetAndClassConfig>({
    budgetMode: 'PER_PERSON',
    budgetTier: 'standard',
    customBudgetInr: 5000,
    preferredModes: ['RAIL', 'BUS'],
    preferredRailClasses: ['SL', '3A'],
    preferredBusClasses: ['EXPRESS', 'AC_SLEEPER'],
    accommodationPreference: 'GOVERNMENT_OPERATED_ONLY',
    isBusinessLuxuryExperience: false,
  });

  // Calculate honest itemized budget ledger (Section 10E)
  const defaultLineItems: BudgetLineItem[] = useMemo(
    () => [
      {
        id: 'outbound-rail',
        category: 'OUTBOUND_TRANSPORT',
        label: '16592 Hampi Express (SBC → HPT) Sleeper Class',
        amountPerPersonInr: 285,
        amountGroupTotalInr: null,
        status: 'PUBLISHED_RATE',
        sourceLabel: 'Indian Railways PRS Tariff',
        sourceUrl: 'https://enquiry.indianrail.gov.in/',
        notes: 'Indian Railways published fare. Confirm live seat availability on IRCTC.',
      },
      {
        id: 'return-rail',
        category: 'RETURN_TRANSPORT',
        label: '16591 Hampi Express (HPT → SBC) Sleeper Class',
        amountPerPersonInr: 285,
        amountGroupTotalInr: null,
        status: 'PUBLISHED_RATE',
        sourceLabel: 'Indian Railways PRS Tariff',
        sourceUrl: 'https://enquiry.indianrail.gov.in/',
        notes: 'Published tariff; booking via IRCTC / RailOne.',
      },
      {
        id: 'local-ksrtc-shuttle',
        category: 'LOCAL_TRANSPORT',
        label: 'KKRTC Hosapete ↔ Hampi Bazaar Stage Carriage',
        amountPerPersonInr: 50,
        amountGroupTotalInr: null,
        status: 'PUBLISHED_RATE',
        sourceLabel: 'KKRTC Stage Carriage Fare Table',
        notes: '₹25 each way per person.',
      },
      {
        id: 'vittala-ev-buggy',
        category: 'LOCAL_TRANSPORT',
        label: 'Gejjala Mantapa ↔ Vittala Temple Battery EV Buggy',
        amountPerPersonInr: 20,
        amountGroupTotalInr: null,
        status: 'PUBLISHED_RATE',
        sourceLabel: 'ASI / Local Tourism Battery Buggy Counter',
        notes: 'Official eco-buggy fare.',
      },
      {
        id: 'kstdc-stay',
        category: 'ACCOMMODATION',
        label: 'KSTDC Hotel Mayura Bhuvaneshwari Hampi (Kamalapura)',
        amountPerPersonInr: null,
        amountGroupTotalInr: null,
        status: 'UNAVAILABLE',
        sourceLabel: 'KSTDC Official Portal',
        sourceUrl: 'https://kstdc.co/hotels/hotel-mayura-bhuvaneshwari-hampi/',
        notes: 'Live inventory tariff unavailable at retrieval time. Verify directly on kstdc.co.',
      },
      {
        id: 'asi-heritage-entry',
        category: 'ENTRY_FEES',
        label: 'ASI Combined Ticket (Vittala Temple & Lotus Mahal / Zenana Enclosure)',
        amountPerPersonInr: 40,
        amountGroupTotalInr: null,
        status: 'CONFIRMED',
        sourceLabel: 'ASI Official Notification & Ticketing',
        sourceUrl: 'https://asi.payumoney.com/',
        notes: 'Valid for same-day entry at both ticketed ASI enclosures for Indian nationals.',
      },
      {
        id: 'local-meals-estimate',
        category: 'FOOD',
        label: 'Authentic Regional Meals & Filter Coffee (Kamalapura / Hampi Bazaar)',
        amountPerPersonInr: 750,
        amountGroupTotalInr: null,
        status: 'ESTIMATED',
        sourceLabel: 'Regional Field Benchmark',
        notes: 'Traditional South Indian thali, jolada rotti, and breakfast.',
      },
    ],
    []
  );

  const budgetSummary = useMemo(
    () => calculateHonestBudget(groupConfig, budgetAndClass, defaultLineItems),
    [groupConfig, budgetAndClass, defaultLineItems]
  );

  // Deterministic 10-rule feasibility assessment (Section 21)
  const feasibilityResult = useMemo(
    () =>
      evaluateJourneyFeasibilityDeterministically({
        originExists: true,
        destinationExists: true,
        routeValid: true,
        estimatedTransitDurationMins: 545, // 9h 05m via Hampi Express
        availableTripDays: 2,
        plannedAttractionVisitMinsTotal: itineraryStops.reduce(
          (sum, s) => sum + s.recommendedDurationMins,
          0
        ),
        plannedLocalTransferBufferMins: 60,
        hasUnconfirmedTransportOrHotelRate: budgetSummary.hasUnavailableCoreItems,
        exceedsUserDeclaredBudget: budgetSummary.budgetComparisonStatus === 'EXCEEDS_BUDGET',
        violatesAccessibilityConstraint: false,
        safetyAdvisoriesAttached: true,
      }),
    [itineraryStops, budgetSummary]
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const match = resolveDestinationQuery(searchInput);
    if (match) {
      setDestination(match);
      setActiveWorkspace('explorer');
    }
  };

  const handleWizardBuild = (req: CompleteJourneyRequest) => {
    setDestination(req.destination);
    setGroupConfig(req.travellers);
    setBudgetAndClass(req.budgetAndClass);
    setActiveWorkspace('builder');
  };

  const addDetourStop = (detour: RouteCorridorDetourCandidate) => {
    if (!detourCandidates.some((d) => d.id === detour.id)) {
      setDetourCandidates((prev) => [...prev, detour]);
    }
  };

  const filteredDistricts = useMemo(() => {
    if (districtDivisionFilter === 'ALL') return KARNATAKA_31_DISTRICTS;
    return KARNATAKA_31_DISTRICTS.filter((d) => d.division === districtDivisionFilter);
  }, [districtDivisionFilter]);

  return (
    <div className="min-h-screen bg-[#0c0f14] text-[#f4f1ea] flex flex-col">
      {/* Top Command Header & Multilingual Destination Search */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[#0c0f14]/90 border-b border-white/15 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#d97736] font-bold">
              YATRIKA V9.0 · ಕರ್ನಾಟಕ ಪ್ರಯಾಣ ವೇದಿಕೆ
            </span>
            <h1 className="text-base md:text-lg font-bold">
              Search a Karnataka destination and understand the entire journey around it.
            </h1>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search Hampi (ಹಂಪಿ), Mysuru (ಮೈಸೂರು), Gokarna, Badami..."
              className="w-full md:w-80 rounded-xl bg-[#151a23] border border-white/20 px-3.5 py-2 text-xs text-[#f4f1ea] focus:outline-none focus:border-[#d97736]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#d97736] text-black text-xs font-bold hover:bg-[#e5894a]"
            >
              Explore
            </button>
          </form>
        </div>

        {/* Quick Canonical Destination Switcher */}
        <div className="max-w-7xl mx-auto mt-2.5 flex flex-wrap items-center gap-1.5">
          {Object.values(KARNATAKA_DESTINATIONS).map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setDestination(d);
                setSearchInput(d.nameEn);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs transition ${
                destination.id === d.id
                  ? 'bg-[#d97736] text-black font-bold'
                  : 'bg-[#151a23] text-[#b0b8c5] hover:text-white border border-white/10'
              }`}
            >
              {d.nameEn} · {d.nameKn}
            </button>
          ))}
        </div>

        {/* 8-Workspace Navigation Bar */}
        <nav className="max-w-7xl mx-auto mt-3 flex overflow-x-auto gap-1.5 pb-1">
          {WORKSPACES.map((ws) => (
            <button
              key={ws.key}
              type="button"
              onClick={() => setActiveWorkspace(ws.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                activeWorkspace === ws.key
                  ? 'bg-white text-black font-bold'
                  : 'bg-[#151a23] text-[#b0b8c5] hover:bg-white/10'
              }`}
            >
              <span className="text-[#d97736] mr-1 font-bold">{ws.code}.</span>
              {ws.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Main Workspace Container */}
      <main className="max-w-7xl w-full mx-auto flex-1 p-4 space-y-6">
        {/* Editorial Destination Context Banner */}
        <section className="rounded-2xl border border-white/15 bg-[#151a23] p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-7 space-y-2">
            <div className="inline-flex flex-wrap items-center gap-2 text-xs text-emerald-400 font-semibold">
              <span>Canonical ID: {destination.id.toUpperCase()}</span>
              <span>·</span>
              <span>District: {destination.district}</span>
              <span>·</span>
              <span>
                WGS84: {destination.center[1].toFixed(4)}°N, {destination.center[0].toFixed(4)}°E
              </span>
              <span>·</span>
              <span>
                Nearest Railhead: <strong className="text-white">{destination.nearestRailhead.name} ({destination.nearestRailhead.code})</strong> · {destination.nearestRailhead.distanceKm} km
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold">
              {destination.nameEn} ({destination.nameKn})
            </h2>
            <p className="text-xs font-semibold text-[#d97736]">{destination.editorialTagline}</p>
            <p className="text-xs md:text-sm text-[#b0b8c5] leading-relaxed">{destination.editorialIntro}</p>
          </div>
          <div className="lg:col-span-5">
            <VerifiedCommonsImage asset={HAMPI_VERIFIED_MEDIA.virupaksha_hero} isHero />
          </div>
        </section>

        {/* WORKSPACE A: Discover Karnataka (7-Step Wizard + 31 Districts Baseline) */}
        {activeWorkspace === 'discover' && (
          <div className="space-y-6">
            <GuidedJourneyWizard initialDestination={destination} onBuildJourney={handleWizardBuild} />

            {/* All 31 Karnataka Districts Baseline (Section 25) */}
            <section className="rounded-2xl border border-white/15 bg-[#151a23] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#f4f1ea]">
                    Karnataka All 31 Districts Discovery Baseline
                  </h3>
                  <p className="text-xs text-[#b0b8c5]">
                    Statewide geographical baseline across Bengaluru, Mysuru, Belagavi, and Kalaburagi administrative divisions.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {['ALL', 'Bengaluru', 'Mysuru', 'Belagavi', 'Kalaburagi'].map((div) => (
                    <button
                      key={div}
                      type="button"
                      onClick={() => setDistrictDivisionFilter(div)}
                      className={`px-2.5 py-1 rounded-lg ${
                        districtDivisionFilter === div
                          ? 'bg-[#d97736] text-black font-bold'
                          : 'bg-[#0c0f14] text-[#b0b8c5] border border-white/10'
                      }`}
                    >
                      {div}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredDistricts.map((dist) => (
                  <div
                    key={dist.districtCode}
                    className="p-3.5 rounded-xl bg-[#0c0f14] border border-white/10 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#f4f1ea]">
                        {dist.nameEn} ({dist.nameKn})
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-emerald-400">
                        {dist.division}
                      </span>
                    </div>
                    <div className="text-[#b0b8c5]">
                      HQ: <strong>{dist.headquarters}</strong> · Code: {dist.districtCode}
                    </div>
                    <div className="text-amber-200">
                      Flagship: <strong>{dist.flagshipDestination}</strong>
                    </div>
                    {dist.deepDossierReady ? (
                      <span className="inline-block text-[10px] text-emerald-400 font-semibold mt-1">
                        ✓ Deep Dossier & 3D Terrain Active
                      </span>
                    ) : (
                      <span className="inline-block text-[10px] text-[#b0b8c5] mt-1">
                        Discovery Baseline Preloaded
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* WORKSPACE B: Interactive Destination Explorer & 3D Terrain Map */}
        {activeWorkspace === 'explorer' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8 space-y-4">
              {destination.id === 'hampi' && (
                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      ['all', 'All 18 Verified Monuments'],
                      ['sacred_centre', 'Sacred Centre (7)'],
                      ['royal_centre', 'Royal Centre (6)'],
                      ['vittala_complex', 'Vittala Complex (3)'],
                      ['natural_cultural', 'Natural & Cultural (4)'],
                    ] as const
                  ).map(([cid, label]) => (
                    <button
                      key={cid}
                      type="button"
                      onClick={() => setActiveCluster(cid)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        activeCluster === cid
                          ? 'bg-[#d97736] text-black'
                          : 'bg-[#151a23] text-[#b0b8c5] border border-white/15'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}

              <HampiDualModeMap
                destination={destination}
                selectedPoiId={selectedPoi?.id ?? null}
                activeCluster={activeCluster}
                onSelectPoi={setSelectedPoi}
              />
            </div>

            {/* Verified Monument Inspector Drawer */}
            <aside className="lg:col-span-4 rounded-2xl border border-white/15 bg-[#151a23] p-4 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded bg-[#d97736]/20 text-[#d97736] font-bold">
                    {selectedPoi.clusterLabel}
                  </span>
                  <span className="text-[#b0b8c5]">
                    {selectedPoi.coordinates[1].toFixed(4)}°N, {selectedPoi.coordinates[0].toFixed(4)}°E ·{' '}
                    {selectedPoi.elevationMeters}m ASL
                  </span>
                </div>

                <h3 className="text-lg font-bold">
                  {selectedPoi.nameEn} <span className="text-sm text-[#b0b8c5]">({selectedPoi.nameKn})</span>
                </h3>

                {selectedPoi.mediaAssetId && HAMPI_VERIFIED_MEDIA[selectedPoi.mediaAssetId] && (
                  <VerifiedCommonsImage asset={HAMPI_VERIFIED_MEDIA[selectedPoi.mediaAssetId]} />
                )}

                <p className="text-xs text-[#b0b8c5] leading-relaxed">{selectedPoi.summary}</p>

                <div className="rounded-xl bg-[#0c0f14] p-3 border border-white/10 space-y-1.5 text-xs">
                  <div>
                    <strong>Verified Timings:</strong> {selectedPoi.openingHours}
                  </div>
                  <div>
                    <strong>ASI / Temple Entry Fee:</strong> Indian ₹{selectedPoi.entryFee.indianInr} · SAARC ₹
                    {selectedPoi.entryFee.saarcBimstecInr} · Foreign ₹{selectedPoi.entryFee.foreignInr}
                  </div>
                  <div className="text-[11px] text-[#b0b8c5]">{selectedPoi.entryFee.note}</div>
                </div>

                <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-200">
                  <strong>Field Precaution:</strong> {selectedPoi.safetyAndAccessNote}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!itineraryStops.some((s) => s.id === selectedPoi.id)) {
                    setItineraryStops((prev) => [...prev, selectedPoi]);
                  }
                  setActiveWorkspace('builder');
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400"
              >
                + Add {selectedPoi.nameEn} to Journey Builder
              </button>
            </aside>
          </section>
        )}

        {/* WORKSPACE C: Cluster-Coherent Journey Builder & Honest Budget Ledger */}
        {activeWorkspace === 'builder' && (
          <div className="space-y-6">
            <section className="rounded-2xl border border-white/15 bg-[#151a23] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <h2 className="text-lg font-bold">
                    Workspace C: Geographical Cluster Journey Builder ({itineraryStops.length} Verified Stops)
                  </h2>
                  <p className="text-xs text-[#b0b8c5]">
                    Stops sequenced by physical cluster (Sacred Centre → Royal Centre → Vittala Complex) to eliminate zigzagging across the 26 km² ruins zone.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveWorkspace('feasibility')}
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400"
                >
                  Verify Feasibility & Timetable →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {itineraryStops.map((stop, idx) => (
                  <div
                    key={stop.id}
                    className="p-3.5 rounded-xl bg-[#0c0f14] border border-white/10 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1 text-xs">
                      <span className="text-[#d97736] font-bold">
                        Stop {idx + 1} · {stop.clusterLabel}
                      </span>
                      <div className="font-bold text-sm">
                        {stop.nameEn} ({stop.nameKn})
                      </div>
                      <div className="text-[#b0b8c5]">
                        Duration: ~{stop.recommendedDurationMins} mins · Hours: {stop.openingHours}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setItineraryStops((prev) => prev.filter((s) => s.id !== stop.id))}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Along My Route Corridor Detours (Section 22) */}
            <section className="rounded-2xl border border-white/15 bg-[#151a23] p-5 space-y-4">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-[#f4f1ea]">
                  Along My Route: Verified Highway Detours (UNESCO Hoysala & Nayaka Forts)
                </h3>
                <p className="text-xs text-[#b0b8c5]">
                  Calculated with authentic detour kilometres, additional driving minutes, and ASI opening windows.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {VERIFIED_CORRIDOR_DETOURS.map((detour) => (
                  <div
                    key={detour.id}
                    className="p-4 rounded-xl bg-[#0c0f14] border border-white/10 flex flex-col justify-between space-y-3 text-xs"
                  >
                    <div className="space-y-1.5">
                      <div className="text-emerald-400 font-bold">{detour.nameKn}</div>
                      <div className="font-bold text-sm text-[#f4f1ea]">{detour.nameEn}</div>
                      <div className="text-[#b0b8c5]">
                        Node: <strong>{detour.nearestHighwayNode}</strong>
                      </div>
                      <div className="rounded-lg bg-[#151a23] p-2 border border-white/10 space-y-0.5 text-[11px]">
                        <div>
                          Extra Distance: <strong>+{detour.detourAdditionalKm} km</strong>
                        </div>
                        <div>
                          Extra Driving: <strong>+{detour.detourAdditionalDriveMins} mins</strong>
                        </div>
                        <div>
                          Recommended Visit: <strong>{detour.recommendedVisitDurationMins} mins</strong>
                        </div>
                        <div className="text-amber-200">
                          Hours: {detour.openingHoursWindow.display}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => addDetourStop(detour)}
                      className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-[#d97736] font-bold border border-white/15"
                    >
                      {detourCandidates.some((d) => d.id === detour.id)
                        ? '✓ Detour Added to Journey'
                        : '+ Add Detour to Journey'}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Honest Itemized Budget Ledger (Section 10E) */}
            <section className="rounded-2xl border border-white/15 bg-[#151a23] p-5 space-y-4 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#f4f1ea]">
                    Honest Itemized Budget & Accounting Ledger (Decoupled Class Accounting)
                  </h3>
                  <p className="text-[#b0b8c5]">
                    Separates confirmed and published rates from estimated costs. Never fabricates a combined total when live inventory is unavailable.
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full font-bold text-xs ${
                    budgetSummary.budgetComparisonStatus === 'WITHIN_KNOWN_COSTS'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : budgetSummary.budgetComparisonStatus === 'EXCEEDS_BUDGET'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  Status: {budgetSummary.budgetComparisonStatus.replace(/_/g, ' ')}
                </div>
              </div>

              {/* Subtotal Breakdown Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#0c0f14] border border-white/10 space-y-1">
                  <div className="text-[#b0b8c5]">Target Budget</div>
                  <div className="text-base font-bold text-white">
                    ₹{budgetSummary.budgetTargetPerPersonInr.toLocaleString('en-IN')} / person
                  </div>
                  <div className="text-[11px] text-[#b0b8c5]">
                    Group Target: ₹{budgetSummary.budgetTargetGroupInr.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0c0f14] border border-emerald-500/30 space-y-1">
                  <div className="text-emerald-400">Confirmed / Published</div>
                  <div className="text-base font-bold text-emerald-300">
                    ₹{budgetSummary.confirmedAndPublishedPerPersonInr.toLocaleString('en-IN')} / person
                  </div>
                  <div className="text-[11px] text-[#b0b8c5]">
                    Group Total: ₹{budgetSummary.confirmedAndPublishedGroupInr.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0c0f14] border border-amber-500/30 space-y-1">
                  <div className="text-amber-300">Estimated (Meals/Local)</div>
                  <div className="text-base font-bold text-amber-200">
                    ₹{budgetSummary.estimatedPerPersonInr.toLocaleString('en-IN')} / person
                  </div>
                  <div className="text-[11px] text-[#b0b8c5]">
                    Group Total: ₹{budgetSummary.estimatedGroupInr.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0c0f14] border border-rose-500/30 space-y-1">
                  <div className="text-rose-400">Unpriced Live Items</div>
                  <div className="text-base font-bold text-rose-300">
                    {budgetSummary.unavailableItemLabels.length} Item(s)
                  </div>
                  <div className="text-[11px] text-rose-300 truncate">
                    {budgetSummary.unavailableItemLabels.join(', ') || 'None'}
                  </div>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0c0f14] text-[#b0b8c5] uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Item Description</th>
                      <th className="p-2.5">Rate / Person</th>
                      <th className="p-2.5">Verification Status</th>
                      <th className="p-2.5">Source & Audit Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-[#151a23]">
                    {budgetSummary.lineItems.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5">
                        <td className="p-2.5 font-bold text-[#d97736]">{item.category}</td>
                        <td className="p-2.5 font-medium text-[#f4f1ea]">{item.label}</td>
                        <td className="p-2.5 font-mono">
                          {item.amountPerPersonInr ? `₹${item.amountPerPersonInr}` : '— (Live Portal Quote)'}
                        </td>
                        <td className="p-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.status === 'CONFIRMED' || item.status === 'PUBLISHED_RATE'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : item.status === 'ESTIMATED'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-2.5 text-[#b0b8c5] text-[11px]">
                          {item.notes} {item.sourceUrl && (
                            <a
                              href={item.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 underline ml-1"
                            >
                              Source
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* WORKSPACE D: Feasibility Engine & 10-Rule Audit */}
        {(activeWorkspace === 'feasibility' || activeWorkspace === 'explorer') && (
          <div className="space-y-4">
            <DepartureAndFeasibilityWorkspace destination={destination} />

            {/* 10-Rule Deterministic Evaluation Checklist (Section 21) */}
            {activeWorkspace === 'feasibility' && (
              <section className="rounded-2xl border border-white/15 bg-[#151a23] p-5 space-y-4 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-[#f4f1ea]">
                      Deterministic 10-Rule Feasibility Audit Checklist
                    </h3>
                    <p className="text-[#b0b8c5]">
                      Computed strictly via spatial and temporal constraints. Never fabricated by an LLM.
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full font-bold ${
                      feasibilityResult.status === 'FEASIBLE' ||
                      feasibilityResult.status === 'FEASIBLE_WITH_UNCONFIRMED_CONNECTIONS'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    Verdict: {feasibilityResult.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {feasibilityResult.ruleChecklist.map((rule) => (
                    <div
                      key={rule.ruleNumber}
                      className="p-3 rounded-xl bg-[#0c0f14] border border-white/10 flex items-start gap-2.5"
                    >
                      <span className="text-base leading-none">
                        {rule.passed ? '✅' : '⚠️'}
                      </span>
                      <div className="space-y-0.5">
                        <div className="font-bold text-[#f4f1ea]">
                          Rule {rule.ruleNumber}: {rule.ruleName}
                        </div>
                        <div className="text-[11px] text-[#b0b8c5]">{rule.explanation}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {feasibilityResult.uncertaintiesToDisclose.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1">
                    <strong>Disclosed Uncertainties:</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {feasibilityResult.uncertaintiesToDisclose.map((u, i) => (
                        <li key={i}>{u}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {/* WORKSPACE E: Transport & Last-Mile Intelligence */}
        {activeWorkspace === 'transport' && (
          <section className="rounded-2xl border border-white/15 bg-[#151a23] p-5 space-y-5 text-xs">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-[#f4f1ea]">
                Workspace E: Indian Railways & Karnataka State Bus Connectivity
              </h2>
              <p className="text-[#b0b8c5]">
                Separates PRS Reserved trains from Unreserved services. Provides state-preserving handoffs to IRCTC, RailOne, NTES, and KSRTC AWATAR.
              </p>
            </div>

            {/* Indian Railways Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#d97736]">
                1. South Western Railway (SWR) Verified Services (SBC / HPT Corridor)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {VERIFIED_KARNATAKA_TRAINS.map((train) => (
                  <div
                    key={train.trainNumber}
                    className="p-4 rounded-xl bg-[#0c0f14] border border-white/10 space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-emerald-400">
                          Train {train.trainNumber} · {train.serviceCategory}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white font-mono">
                          {train.durationHoursMinutes}
                        </span>
                      </div>
                      <div className="font-bold text-sm text-[#f4f1ea]">{train.trainName}</div>
                      <div className="text-[#b0b8c5]">
                        <strong>{train.sourceStation.name} ({train.sourceStation.code})</strong> at {train.departureTime} →{' '}
                        <strong>{train.destinationStation.name} ({train.destinationStation.code})</strong> at {train.arrivalTime}
                      </div>
                      <div className="text-[11px] text-[#b0b8c5]">
                        Stops: {train.intermediateStops.join(' · ')}
                      </div>

                      {/* Supported Classes (Strictly filtered, CC/EC never shown if not present) */}
                      <div className="flex items-center gap-1 pt-1">
                        <span className="text-[11px] text-[#b0b8c5] mr-1">Supported Classes:</span>
                        {train.supportedClasses.map((cls) => (
                          <span
                            key={cls}
                            className="px-2 py-0.5 rounded bg-white/15 text-white font-bold text-[10px]"
                          >
                            {cls}
                          </span>
                        ))}
                      </div>

                      <div className="text-[11px] text-amber-200/90 italic pt-1">
                        {train.liveRunningMessage}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-white/10">
                      {train.irctcBookable && (
                        <a
                          href="https://www.irctc.co.in/"
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-1.5 rounded-lg bg-[#d97736] text-black font-bold text-center hover:bg-[#e5894a]"
                        >
                          Book Reserved on IRCTC
                        </a>
                      )}
                      {train.railOneUnreservedSupported && (
                        <a
                          href={train.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-1.5 rounded-lg bg-white/10 text-white font-semibold text-center hover:bg-white/20 border border-white/15"
                        >
                          Verify NTES / RailOne
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KSRTC & Local Bus Shuttles */}
            <div className="space-y-3 pt-3">
              <h3 className="text-sm font-bold text-[#d97736]">
                2. KSRTC / KKRTC State Transport Corridors & Local Shuttles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {VERIFIED_KARNATAKA_BUSES.map((bus) => (
                  <div
                    key={bus.serviceId}
                    className="p-4 rounded-xl bg-[#0c0f14] border border-white/10 space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-emerald-400">{bus.operator}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white">
                          {bus.busClass.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="font-bold text-sm text-[#f4f1ea]">{bus.serviceName}</div>
                      <div className="text-[#b0b8c5]">
                        From: <strong>{bus.fromTerminal}</strong>
                      </div>
                      <div className="text-[#b0b8c5]">
                        To: <strong>{bus.toTerminal}</strong>
                      </div>
                      <div className="text-[11px] text-[#b0b8c5]">
                        Timings: {bus.departureTime} → {bus.arrivalTime} ({bus.durationHoursMinutes})
                      </div>
                      <div className="text-[11px] text-amber-200">
                        Fare: {bus.publishedFareInr ? `₹${bus.publishedFareInr} (Stage Carriage)` : 'Dynamic AWATAR tariff; verify live on portal.'}
                      </div>
                    </div>

                    <a
                      href={bus.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#d97736] font-bold text-center border border-white/15"
                    >
                      Check {bus.operator} Official Portal →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* WORKSPACE F: Strict Government & Registered Accommodation */}
        {activeWorkspace === 'accommodation' && (
          <section className="rounded-2xl border border-white/15 bg-[#151a23] p-5 space-y-4 text-xs">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-[#f4f1ea]">
                Workspace F: Strict Government & Registered Accommodation Registry
              </h2>
              <p className="text-[#b0b8c5]">
                Only government-operated properties (KSTDC / Jungle Lodges) and officially registered homestays are eligible for primary recommendations. Properties listed on NIDHI+ only are explicitly disclosed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {HAMPI_ACCOMMODATION_REGISTRY.map((acc) => (
                <div
                  key={acc.id}
                  className={`p-4 rounded-xl bg-[#0c0f14] border space-y-2 flex flex-col justify-between ${
                    acc.eligibleForPrimaryRecommendation
                      ? 'border-emerald-500/40'
                      : 'border-white/10 opacity-75'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          acc.verificationLabel === 'GOVERNMENT_OPERATED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {acc.verificationLabel.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] text-[#b0b8c5]">
                        {acc.distanceFromDestinationKm} km from core
                      </span>
                    </div>

                    <div className="font-bold text-sm text-[#f4f1ea]">{acc.propertyName}</div>
                    <div className="text-[#b0b8c5]">
                      Authority: <strong>{acc.operatingOrClassifyingAuthority}</strong>
                    </div>
                    <div className="text-[11px] text-[#b0b8c5]">
                      Reg / Lic: <code>{acc.registrationOrClassificationNumber}</code>
                    </div>
                    <div className="text-[11px] text-[#b0b8c5]">
                      Location: {acc.locality}, {acc.taluk}, {acc.district} ({acc.distanceReferencePoint})
                    </div>
                    <div className="p-2 rounded bg-[#151a23] border border-white/10 text-[11px] text-[#b0b8c5] italic">
                      {acc.availabilityDisclosure}
                    </div>
                  </div>

                  <a
                    href={acc.officialPropertyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-center"
                  >
                    Official Booking Portal →
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* WORKSPACE G: Evidence-Backed Safety & Environmental Layer */}
        {activeWorkspace === 'safety' && (
          <section className="rounded-2xl border border-white/15 bg-[#151a23] p-5 space-y-5 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#f4f1ea]">
                  Workspace G: Evidence-Backed Safety & Local Awareness Layer
                </h2>
                <p className="text-[#b0b8c5]">
                  Documented historical incidents, seasonal hydrological context, and non-colour-alone accessible badges with direct 112 emergency access.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="tel:112"
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                >
                  Call ERSS 112
                </a>
                <a
                  href="https://112.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15"
                >
                  112.gov.in
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {HAMPI_SAFETY_EVIDENCE_RECORDS.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl bg-[#0c0f14] border border-white/10 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300 text-[11px]">
                        {rec.badgeSymbol}
                      </span>
                      <span className="text-[10px] text-[#b0b8c5]">{rec.dateOfIncidentOrEvent}</span>
                    </div>

                    <div className="font-bold text-sm text-[#f4f1ea]">{rec.title}</div>
                    <div className="text-[11px] text-[#b0b8c5]">
                      Location: <strong>{rec.locationName}</strong>
                    </div>
                    <div className="text-[11px] text-[#b0b8c5]">
                      Authority: {rec.responsibleAuthority}
                    </div>

                    <p className="text-[#b0b8c5] leading-relaxed pt-1">
                      {rec.summaryWhatHappened}
                    </p>

                    <div className="rounded-lg bg-[#151a23] p-2.5 border border-white/10 space-y-1">
                      <strong className="text-white text-[11px]">Recommended Precautions:</strong>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#b0b8c5]">
                        {rec.recommendedPrecautions.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 space-y-1">
                    <div className="text-[10px] text-[#b0b8c5]">
                      Emergency: <strong>{rec.emergencyContact.localAuthorityNote}</strong>
                    </div>
                    {rec.sourceUrls.map((s, i) => (
                      <a
                        key={i}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-[10px] text-emerald-400 hover:underline truncate"
                      >
                        Source: {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* WORKSPACE H: Source & Evidence Explorer */}
        {activeWorkspace === 'sources' && (
          <section className="rounded-2xl border border-white/15 bg-[#151a23] p-5 space-y-4 text-xs">
            <h2 className="text-lg font-bold">Workspace H: Authoritative Source & Photographic Evidence Registry</h2>
            <p className="text-[#b0b8c5]">
              Every coordinate, monument fee, timing record, and photographic asset in Yatrika V9.0 is traceable to an authoritative public source or Creative Commons license:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(HAMPI_VERIFIED_MEDIA).map((asset) => (
                <VerifiedCommonsImage key={asset.id} asset={asset} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
export default App;
