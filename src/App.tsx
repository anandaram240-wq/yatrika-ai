// src/App.tsx
import React, { useState } from 'react';
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const match = resolveDestinationQuery(searchInput);
    if (match) {
      setDestination(match);
      setActiveWorkspace('explorer');
    }
  };

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
        {/* Editorial Destination Context Banner (Always immediate, zero gating form) */}
        <section className="rounded-2xl border border-white/15 bg-[#151a23] p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-7 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <span>Canonical ID: {destination.id.toUpperCase()}</span>
              <span>·</span>
              <span>District: {destination.district}</span>
              <span>·</span>
              <span>
                WGS84: {destination.center[1].toFixed(4)}°N, {destination.center[0].toFixed(4)}°E
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

        {/* WORKSPACE A & B: Interactive Destination Explorer + Map + Cluster Registry */}
        {(activeWorkspace === 'explorer' || activeWorkspace === 'discover') && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8 space-y-4">
              {/* Geographic Cluster Filter Pills */}
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

        {/* WORKSPACE C: Cluster-Coherent Journey Builder */}
        {activeWorkspace === 'builder' && (
          <section className="rounded-2xl border border-white/15 bg-[#151a23] p-5 space-y-4">
            <h2 className="text-lg font-bold">
              Workspace C: Geographical Cluster Journey Builder ({itineraryStops.length} Verified Stops)
            </h2>
            <p className="text-xs text-[#b0b8c5]">
              Stops are sequenced by geographical cluster (Sacred Centre → Royal Centre → Vittala Complex) to prevent zigzagging across the 26 sq km ruins zone.
            </p>
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
        )}

        {/* WORKSPACE D: Feasibility & Departure Engine */}
        {(activeWorkspace === 'feasibility' || activeWorkspace === 'explorer') && (
          <DepartureAndFeasibilityWorkspace destination={destination} />
        )}

        {/* WORKSPACE E: Transport & Last-Mile Intelligence */}
        {activeWorkspace === 'transport' && (
          <section className="rounded-2xl border border-white/15 bg-[#151a23] p-5 space-y-3 text-xs">
            <h2 className="text-lg font-bold">Workspace E: Transport & Last-Mile Intelligence (Hampi / Hosapete)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#0c0f14] border border-white/10 space-y-1.5">
                <strong className="text-[#d97736] text-sm">1. Rail & Highway Trunk</strong>
                <p>
                  <strong>Hosapete Junction (HPT):</strong> 13 km from Hampi Bazaar. Served by Hampi Express (16592/16591) from KSR Bengaluru & Mysuru, and Vijaynagar Express from Hubballi.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0c0f14] border border-white/10 space-y-1.5">
                <strong className="text-[#d97736] text-sm">2. KSRTC & Local Last-Mile</strong>
                <p>
                  Frequent KSRTC shuttle buses run between Hosapete Bus Stand, Kamalapura, and Hampi Bazaar every 20–30 minutes (06:00 AM – 08:30 PM).
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0c0f14] border border-white/10 space-y-1.5">
                <strong className="text-[#d97736] text-sm">3. Vittala Buggy & River Crossing</strong>
                <p>
                  Private vehicles stop at Gejjala Mandapa parking; official battery-operated EV buggies shuttle 1 km to Vittala Temple (08:30 AM – 05:30 PM).
                </p>
              </div>
            </div>
          </section>
        )}

        {/* WORKSPACE F: Legitimate Accommodation Zones */}
        {activeWorkspace === 'accommodation' && (
          <section className="rounded-2xl border border-white/15 bg-[#151a23] p-5 space-y-3 text-xs">
            <h2 className="text-lg font-bold">Workspace F: Verified Accommodation Zones (Archaeological Buffer Compliance)</h2>
            <p className="text-[#b0b8c5]">
              Because Hampi is a protected UNESCO World Heritage zone, commercial hotel construction inside the core monument buffer is restricted. Legitimate stays cluster in four verified zones:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0c0f14] border border-white/10">
                <strong className="text-sm text-emerald-400">1. Kamalapura (4 km from Royal Centre)</strong>
                <p className="mt-1 text-[#b0b8c5]">
                  Official KSTDC Mayura Bhuvaneshwari and heritage resorts immediately outside the southern monument gate; closest base to Lotus Mahal and Daroji.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0c0f14] border border-white/10">
                <strong className="text-sm text-emerald-400">2. Hosapete City (13 km from Hampi)</strong>
                <p className="mt-1 text-[#b0b8c5]">
                  Full-service hotels adjacent to Hosapete Junction (HPT) railway station and KSRTC terminal with 24/7 pharmacy, ATM, and hospital access.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0c0f14] border border-white/10">
                <strong className="text-sm text-emerald-400">3. Hampi Bazaar / Virupapura Licensed Homestays</strong>
                <p className="mt-1 text-[#b0b8c5]">
                  Karnataka Tourism registered community homestays within walking distance of Virupaksha Temple and Matanga Hill sunrise steps.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0c0f14] border border-white/10">
                <strong className="text-sm text-emerald-400">4. Anegundi Heritage Village (North Bank)</strong>
                <p className="mt-1 text-[#b0b8c5]">
                  Traditional vernacular courtyard stays curated by The Kishkinda Trust (TKT) near Anjanadri Hill.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* WORKSPACE G: Safety & Visitor Awareness */}
        {activeWorkspace === 'safety' && (
          <section className="rounded-2xl border border-white/15 bg-[#151a23] p-5 space-y-3 text-xs">
            <h2 className="text-lg font-bold">Workspace G: Safety, Terrain & Regulatory Awareness</h2>
            <ul className="space-y-2 list-disc list-inside text-[#b0b8c5]">
              <li>
                <strong className="text-white">Tungabhadra River Hazards:</strong> Deep submerged boulder whirlpools, sudden dam discharges, and mugger crocodiles make swimming strictly unsafe.
              </li>
              <li>
                <strong className="text-white">Granite Thermal & Dusk Safety:</strong> Unshaded boulder trails exceed 38°C in afternoon hours and have zero artificial lighting after 6:00 PM; descend Matanga and Hemakuta hills before sunset.
              </li>
              <li>
                <strong className="text-white">Drone Prohibition:</strong> Flying unmanned aerial vehicles (UAVs/drones) over ASI protected monuments in Hampi is prohibited without prior DGCA and ASI Director-General clearance.
              </li>
              <li>
                <strong className="text-white">Emergency Contacts:</strong> Emergency Response Support System (ERSS): <strong>112</strong> · Tourist Helpline Karnataka: <strong>1363</strong> · Kamalapura Police Station & Primary Health Centre (4 km from Royal Enclosure).
              </li>
            </ul>
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

