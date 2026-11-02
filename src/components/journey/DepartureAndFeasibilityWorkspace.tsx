// src/components/journey/DepartureAndFeasibilityWorkspace.tsx
import React, { useState } from 'react';
import { DestinationRecord } from '../../data/destinationsRegistry';

export interface JourneyParameters {
  departureType: 'city' | 'rail' | 'airport' | 'bus' | 'gps';
  departureLabel: string;
  departureCoords: [number, number];
  journeyDate: string;
  days: number;
  travellers: number;
  budgetPerTravellerInr: number;
  travelStyle: 'heritage_deep_dive' | 'Slow_cultural' | 'backpacker' | 'family_comfort';
  transportPreference: 'train_ksrtc' | 'rail_plus_auto' | 'self_drive' | 'flight_plus_cab';
}

const KARNATAKA_TRANSIT_HUBS: Record<string, { label: string; type: JourneyParameters['departureType']; coords: [number, number] }> = {
  SBC: { label: 'KSR Bengaluru City Junction (SBC) — Rail', type: 'rail', coords: [77.5683, 12.9784] },
  HPT: { label: 'Hosapete Junction (HPT) — Rail', type: 'rail', coords: [76.3860, 15.2689] },
  MYS: { label: 'Mysuru Junction (MYS) — Rail', type: 'rail', coords: [76.6458, 12.3136] },
  BLR: { label: 'Kempegowda International Airport Bengaluru (BLR)', type: 'airport', coords: [77.7066, 13.1986] },
  VDY: { label: 'Jindal Vijaynagar Airport (VDY) — Toranagallu', type: 'airport', coords: [76.6347, 15.1758] },
  KSRTC_MAJESTIC: { label: 'Kempegowda Bus Terminal (Majestic KSRTC), Bengaluru', type: 'bus', coords: [77.5726, 12.9779] },
  HUBBALLI_CITY: { label: 'Hubballi-Dharwad City Centre', type: 'city', coords: [75.1240, 15.3647] },
};

function haversineKm(a: [number, number], b: [number, number]): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b[1] - a[1]);
  const dLon = toRad(b[0] - a[0]);
  const lat1 = toRad(a[1]);
  const lat2 = toRad(b[1]);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const DepartureAndFeasibilityWorkspace: React.FC<{ destination: DestinationRecord }> = ({ destination }) => {
  const [selectedHubKey, setSelectedHubKey] = useState<string>('SBC');
  const [customCity, setCustomCity] = useState<string>('');
  const [gpsStatus, setGpsStatus] = useState<string>('Location not requested (Opt-in only)');
  const [params, setParams] = useState<JourneyParameters>({
    departureType: 'rail',
    departureLabel: KARNATAKA_TRANSIT_HUBS.SBC.label,
    departureCoords: KARNATAKA_TRANSIT_HUBS.SBC.coords,
    journeyDate: '2026-11-15',
    days: 3,
    travellers: 2,
    budgetPerTravellerInr: 8500,
    travelStyle: 'heritage_deep_dive',
    transportPreference: 'train_ksrtc',
  });

  // Explicit opt-in GPS acquisition ONLY when the user clicks the button
  const requestUserLocationExplicitly = () => {
    if (!('geolocation' in navigator)) {
      setGpsStatus('Geolocation API unsupported by browser.');
      return;
    }
    setGpsStatus('Requesting explicit browser permission...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        setParams((prev) => ({
          ...prev,
          departureType: 'gps',
          departureLabel: `Permitted GPS (${coords[1].toFixed(4)}°N, ${coords[0].toFixed(4)}°E)`,
          departureCoords: coords,
        }));
        setGpsStatus('Explicit user location acquired.');
      },
      (err) => {
        setGpsStatus(`Location permission declined or unavailable (${err.message}).`);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const aerialDistKm = Math.round(haversineKm(params.departureCoords, destination.center));
  const estimatedRoadKm = Math.round(aerialDistKm * 1.26);
  const recommendedMinDays = destination.id === 'hampi' ? 2 : 2;
  const minRealisticDailyCostInr = 1800;
  const totalBudgetAvailable = params.budgetPerTravellerInr * params.travellers;
  const estimatedTotalTripCost = params.days * minRealisticDailyCostInr * params.travellers;
  const isFeasible = params.days >= recommendedMinDays && totalBudgetAvailable >= estimatedTotalTripCost;

  return (
    <section className="rounded-2xl border border-white/15 bg-[#151a23] p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <h2 className="text-lg font-bold text-[#f4f1ea]">
            Departure & Journey Feasibility Engine — {destination.nameEn} ({destination.nameKn})
          </h2>
          <p className="text-xs text-[#b0b8c5]">
            Configure your departure hub, duration, and budget after exploring the destination geography.
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isFeasible
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
          }`}
        >
          {isFeasible ? 'Feasibility: VERIFIED VIABLE' : 'Feasibility: ADJUST DAYS OR BUDGET'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Departure Terminal / Station / Airport Selection */}
        <div className="space-y-2">
          <label className="block font-semibold text-[#f4f1ea]">
            1. Select Railway Station, Airport, Bus Terminal or City
          </label>
          <select
            value={selectedHubKey}
            onChange={(e) => {
              const key = e.target.value;
              setSelectedHubKey(key);
              const hub = KARNATAKA_TRANSIT_HUBS[key];
              if (hub) {
                setParams((p) => ({
                  ...p,
                  departureType: hub.type,
                  departureLabel: hub.label,
                  departureCoords: hub.coords,
                }));
              }
            }}
            className="w-full rounded-lg bg-[#0c0f14] border border-white/20 px-3 py-2 text-[#f4f1ea]"
          >
            {Object.entries(KARNATAKA_TRANSIT_HUBS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>

          <div className="p-2 rounded bg-[#0c0f14] border border-white/10 text-xs text-[#b0b8c5]">
            Selected Departure: <strong className="text-emerald-400">{params.departureLabel}</strong>
          </div>

          <input
            type="text"
            placeholder="Or enter custom city / locality..."
            value={customCity}
            onChange={(e) => {
              setCustomCity(e.target.value);
              if (e.target.value.trim()) {
                setParams((p) => ({
                  ...p,
                  departureType: 'city',
                  departureLabel: e.target.value.trim(),
                }));
              }
            }}
            className="w-full rounded-lg bg-[#0c0f14] border border-white/20 px-3 py-2 text-[#f4f1ea]"
          />

          <button
            type="button"
            onClick={requestUserLocationExplicitly}
            className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-[#f4f1ea] border border-white/15 font-medium"
          >
            Use Current Location (Explicit Permission Only)
          </button>
          <p className="text-[11px] text-[#b0b8c5]">{gpsStatus}</p>
        </div>

        {/* Dates, Days, Travellers, Budget */}
        <div className="space-y-2">
          <label className="block font-semibold text-[#f4f1ea]">2. Schedule, Group Size & Budget</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[11px] text-[#b0b8c5]">Journey Date</span>
              <input
                type="date"
                value={params.journeyDate}
                onChange={(e) => setParams((p) => ({ ...p, journeyDate: e.target.value }))}
                className="w-full rounded-lg bg-[#0c0f14] border border-white/20 px-2.5 py-1.5 text-[#f4f1ea]"
              />
            </div>
            <div>
              <span className="text-[11px] text-[#b0b8c5]">Number of Days</span>
              <input
                type="number"
                min={1}
                max={14}
                value={params.days}
                onChange={(e) => setParams((p) => ({ ...p, days: Number(e.target.value) || 1 }))}
                className="w-full rounded-lg bg-[#0c0f14] border border-white/20 px-2.5 py-1.5 text-[#f4f1ea]"
              />
            </div>
            <div>
              <span className="text-[11px] text-[#b0b8c5]">Travellers</span>
              <input
                type="number"
                min={1}
                max={20}
                value={params.travellers}
                onChange={(e) => setParams((p) => ({ ...p, travellers: Number(e.target.value) || 1 }))}
                className="w-full rounded-lg bg-[#0c0f14] border border-white/20 px-2.5 py-1.5 text-[#f4f1ea]"
              />
            </div>
            <div>
              <span className="text-[11px] text-[#b0b8c5]">Budget / Traveller (₹)</span>
              <input
                type="number"
                step={500}
                min={1000}
                value={params.budgetPerTravellerInr}
                onChange={(e) =>
                  setParams((p) => ({ ...p, budgetPerTravellerInr: Number(e.target.value) || 1000 }))
                }
                className="w-full rounded-lg bg-[#0c0f14] border border-white/20 px-2.5 py-1.5 text-[#f4f1ea]"
              />
            </div>
          </div>
        </div>

        {/* Style, Transport & Live Telemetry Output */}
        <div className="space-y-2">
          <label className="block font-semibold text-[#f4f1ea]">3. Style & Last-Mile Intelligence</label>
          <select
            value={params.travelStyle}
            onChange={(e) =>
              setParams((p) => ({ ...p, travelStyle: e.target.value as JourneyParameters['travelStyle'] }))
            }
            className="w-full rounded-lg bg-[#0c0f14] border border-white/20 px-3 py-2 text-[#f4f1ea]"
          >
            <option value="heritage_deep_dive">Archaeological & Heritage Deep-Dive</option>
            <option value="Slow_cultural">Slow Cultural & Craft Exploration</option>
            <option value="backpacker">Backpacker / Public Transit</option>
            <option value="family_comfort">Family & Senior-Friendly Comfort</option>
          </select>

          <select
            value={params.transportPreference}
            onChange={(e) =>
              setParams((p) => ({
                ...p,
                transportPreference: e.target.value as JourneyParameters['transportPreference'],
              }))
            }
            className="w-full rounded-lg bg-[#0c0f14] border border-white/20 px-3 py-2 text-[#f4f1ea]"
          >
            <option value="train_ksrtc">Overnight Express Train + KSRTC Last-Mile</option>
            <option value="rail_plus_auto">Rail to {destination.nearestRailhead.code} + Local Autorickshaw</option>
            <option value="self_drive">Highway Self-Drive (NH-48 / NH-50)</option>
            <option value="flight_plus_cab">Regional Flight ({destination.nearestAirport.code}) + Cab</option>
          </select>

          <div className="p-2.5 rounded-lg bg-[#0c0f14] border border-white/10 space-y-1 text-[11px]">
            <div>
              <strong>Origin:</strong> {params.departureLabel}
            </div>
            <div>
              <strong>Estimated Corridor Distance:</strong> ~{estimatedRoadKm} km road ({aerialDistKm} km direct)
            </div>
            <div>
              <strong>Nearest Railhead:</strong> {destination.nearestRailhead.name} ({destination.nearestRailhead.distanceKm} km)
            </div>
            <div>
              <strong>Total Pool vs Floor Estimate:</strong> ₹{totalBudgetAvailable.toLocaleString('en-IN')} available / ₹
              {estimatedTotalTripCost.toLocaleString('en-IN')} baseline
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

