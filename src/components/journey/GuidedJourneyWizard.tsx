// src/components/journey/GuidedJourneyWizard.tsx
import React, { useState } from 'react';
import {
  DestinationRecord,
  resolveDestinationQuery,
} from '../../data/destinationsRegistry';
import {
  BudgetAndClassConfig,
  RailClassCode,
  BusServiceClass,
  TravellerGroupConfig,
  TravellerInterest,
} from '../../types/journeySchema';
import { SELECTABLE_BUDGET_TIERS } from '../../engines/budgetLedgerEngine';

export interface CompleteJourneyRequest {
  destination: DestinationRecord;
  departure: {
    mode: 'GPS' | 'CITY' | 'RAIL_STATION' | 'BUS_TERMINAL' | 'AIRPORT' | 'LANDMARK' | 'SAVED';
    canonicalName: string;
    stationCode?: string;
    coordinates: [number, number];
    resolvedAddress: string;
  };
  schedule: {
    departureDate: string;
    returnDate: string;
    days: number;
    preferredDepartureWindow: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'OVERNIGHT';
    preferredReturnWindow: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'OVERNIGHT';
    dateFlexibilityDays: number;
  };
  travellers: TravellerGroupConfig;
  budgetAndClass: BudgetAndClassConfig;
  interests: TravellerInterest[];
}

const CANONICAL_DEPARTURE_RECORDS = [
  {
    id: 'sbc_rail',
    mode: 'RAIL_STATION' as const,
    canonicalName: 'KSR Bengaluru City Junction (SBC)',
    stationCode: 'SBC',
    coordinates: [77.5683, 12.9784] as [number, number],
    resolvedAddress: 'Majestic, Bengaluru Urban District, Karnataka 560023',
  },
  {
    id: 'majestic_bus',
    mode: 'BUS_TERMINAL' as const,
    canonicalName: 'Kempegowda Bus Station (Majestic KSRTC)',
    coordinates: [77.5726, 12.9779] as [number, number],
    resolvedAddress: 'Subhash Nagar, Majestic, Bengaluru, Karnataka 560009',
  },
  {
    id: 'mys_rail',
    mode: 'RAIL_STATION' as const,
    canonicalName: 'Mysuru Junction (MYS)',
    stationCode: 'MYS',
    coordinates: [76.6458, 12.3136] as [number, number],
    resolvedAddress: 'Irwin Road, Medar Block, Yadavagiri, Mysuru, Karnataka 570001',
  },
  {
    id: 'hpt_rail',
    mode: 'RAIL_STATION' as const,
    canonicalName: 'Hosapete Junction (HPT)',
    stationCode: 'HPT',
    coordinates: [76.3860, 15.2689] as [number, number],
    resolvedAddress: 'Station Road, Hosapete, Vijayanagara District, Karnataka 583201',
  },
  {
    id: 'blr_airport',
    mode: 'AIRPORT' as const,
    canonicalName: 'Kempegowda International Airport (BLR)',
    stationCode: 'BLR',
    coordinates: [77.7066, 13.1986] as [number, number],
    resolvedAddress: 'KIAL Rd, Devanahalli, Bengaluru, Karnataka 560300',
  },
];

const ALL_INTERESTS: TravellerInterest[] = [
  'Heritage',
  'Mountains',
  'Waterfalls',
  'Wildlife',
  'Beaches',
  'Food',
  'Culture',
  'Temples',
  'Architecture',
  'Adventure',
  'Family experiences',
  'Relaxation',
  'Accessible destinations',
];

interface Props {
  initialDestination: DestinationRecord;
  onBuildJourney: (req: CompleteJourneyRequest) => void;
}

export const GuidedJourneyWizard: React.FC<Props> = ({ initialDestination, onBuildJourney }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [destInput, setDestInput] = useState<string>(initialDestination.nameEn);
  const [destination, setDestination] = useState<DestinationRecord>(initialDestination);

  const [departure, setDeparture] = useState<CompleteJourneyRequest['departure']>(
    CANONICAL_DEPARTURE_RECORDS[0]
  );
  const [gpsMessage, setGpsMessage] = useState<string>('');

  const [schedule, setSchedule] = useState<CompleteJourneyRequest['schedule']>({
    departureDate: '2026-11-14',
    returnDate: '2026-11-15',
    days: 2,
    preferredDepartureWindow: 'OVERNIGHT',
    preferredReturnWindow: 'OVERNIGHT',
    dateFlexibilityDays: 1,
  });

  const [travellers, setTravellers] = useState<TravellerGroupConfig>({
    adults: 2,
    children: 0,
    seniors: 0,
    roomsRequired: 1,
    nights: 1,
    accessibilityNeeds: {
      stepFreeAccess: false,
      minimalWalking: false,
      wheelchairFriendly: false,
    },
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

  const [interests, setInterests] = useState<TravellerInterest[]>([
    'Heritage',
    'Temples',
    'Architecture',
    'Culture',
  ]);

  const handleExplicitLocationClick = () => {
    if (!('geolocation' in navigator)) {
      setGpsMessage('Browser geolocation is unavailable. Use manual station or city selection below.');
      return;
    }
    setGpsMessage('Requesting one-time browser coordinates to resolve your nearest Karnataka transit hub...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        setDeparture({
          mode: 'GPS',
          canonicalName: 'User Permitted Current Location',
          coordinates: coords,
          resolvedAddress: `Verified Browser Coordinates (${coords[1].toFixed(4)}°N, ${coords[0].toFixed(4)}°E)`,
        });
        setGpsMessage('Location resolved. You can still switch to any station or city manually.');
      },
      () => {
        setGpsMessage(
          'Location permission was declined. Manual station, airport, and city search remains fully active.'
        );
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const toggleRailClass = (cls: RailClassCode) => {
    setBudgetAndClass((prev) => ({
      ...prev,
      preferredRailClasses: prev.preferredRailClasses.includes(cls)
        ? prev.preferredRailClasses.filter((c) => c !== cls)
        : [...prev.preferredRailClasses, cls],
    }));
  };

  const toggleBusClass = (cls: BusServiceClass) => {
    setBudgetAndClass((prev) => ({
      ...prev,
      preferredBusClasses: prev.preferredBusClasses.includes(cls)
        ? prev.preferredBusClasses.filter((c) => c !== cls)
        : [...prev.preferredBusClasses, cls],
    }));
  };

  const toggleInterest = (interest: TravellerInterest) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const steps = [
    { num: 1, title: '1. Destination' },
    { num: 2, title: '2. Departure' },
    { num: 3, title: '3. Dates' },
    { num: 4, title: '4. Travellers' },
    { num: 5, title: '5. Budget & Class' },
    { num: 6, title: '6. Interests' },
    { num: 7, title: '7. Build Journey' },
  ];

  return (
    <section
      aria-label="Guided Karnataka Journey Setup"
      className="rounded-2xl border border-white/15 bg-[#151a23] p-5 space-y-5"
    >
      {/* Stepper Header — Click any step to edit previous choices */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-white/10 pb-3">
        {steps.map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => setCurrentStep(s.num)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              currentStep === s.num
                ? 'bg-[#d97736] text-black'
                : 'bg-[#0c0f14] text-[#b0b8c5] hover:text-white border border-white/10'
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* STEP 1: DESTINATION */}
      {currentStep === 1 && (
        <div className="space-y-3 text-xs">
          <h3 className="text-sm font-bold text-[#f4f1ea]">
            Step 1: Destination (Supports Kannada, English & Transliterations)
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={destInput}
              onChange={(e) => {
                setDestInput(e.target.value);
                const resolved = resolveDestinationQuery(e.target.value);
                if (resolved) setDestination(resolved);
              }}
              placeholder="e.g., ಹಂಪಿ, Hampi, ಮೈಸೂರು, Mysuru, Gokarna, Chikkamagaluru, Kodagu, Badami"
              className="flex-1 rounded-lg bg-[#0c0f14] border border-white/20 px-3 py-2 text-[#f4f1ea]"
            />
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 rounded-lg bg-[#d97736] text-black font-bold"
            >
              Confirm {destination.nameEn} ({destination.nameKn}) →
            </button>
          </div>
          <div className="p-3 rounded-lg bg-[#0c0f14] border border-white/10">
            <strong>Resolved Canonical Record:</strong> {destination.nameEn} ({destination.nameKn}) · District:{' '}
            {destination.district} · Coordinates: {destination.center[1].toFixed(4)}°N,{' '}
            {destination.center[0].toFixed(4)}°E
          </div>
        </div>
      )}

      {/* STEP 2: DEPARTURE LOCATION */}
      {currentStep === 2 && (
        <div className="space-y-3 text-xs">
          <h3 className="text-sm font-bold text-[#f4f1ea]">
            Step 2: Departure Origin (Station, Bus Terminal, Airport, City, or Opt-In GPS)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="block font-semibold">Select Canonical Transit Hub or City</label>
              <select
                value={departure.canonicalName}
                onChange={(e) => {
                  const found = CANONICAL_DEPARTURE_RECORDS.find((r) => r.canonicalName === e.target.value);
                  if (found) setDeparture(found);
                }}
                className="w-full rounded-lg bg-[#0c0f14] border border-white/20 px-3 py-2 text-[#f4f1ea]"
              >
                {CANONICAL_DEPARTURE_RECORDS.map((r) => (
                  <option key={r.id} value={r.canonicalName}>
                    [{r.mode}] {r.canonicalName}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleExplicitLocationClick}
                className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 font-semibold text-left"
              >
                Use my Location (Requests one-time browser permission; never blocks planning if declined)
              </button>
              {gpsMessage && <p className="text-[11px] text-amber-300">{gpsMessage}</p>}
            </div>

            <div className="p-3 rounded-lg bg-[#0c0f14] border border-white/10 space-y-1">
              <div className="text-emerald-400 font-bold">Resolved Departure Place</div>
              <div>
                <strong>Name:</strong> {departure.canonicalName}
              </div>
              <div>
                <strong>Mode:</strong> {departure.mode} {departure.stationCode ? `(${departure.stationCode})` : ''}
              </div>
              <div>
                <strong>Address:</strong> {departure.resolvedAddress}
              </div>
              <div>
                <strong>WGS84:</strong> {departure.coordinates[1].toFixed(4)}°N, {departure.coordinates[0].toFixed(4)}°E
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className="px-4 py-2 rounded-lg bg-[#d97736] text-black font-bold"
          >
            Continue to Journey Dates →
          </button>
        </div>
      )}

      {/* STEP 3: JOURNEY DATES & DURATION */}
      {currentStep === 3 && (
        <div className="space-y-3 text-xs">
          <h3 className="text-sm font-bold text-[#f4f1ea]">
            Step 3: Journey Dates, Duration & Time Windows (Evaluates target travel day, not today)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[#b0b8c5] mb-1">Departure Date</label>
              <input
                type="date"
                value={schedule.departureDate}
                onChange={(e) => setSchedule((s) => ({ ...s, departureDate: e.target.value }))}
                className="w-full rounded-lg bg-[#0c0f14] border border-white/20 px-3 py-1.5"
              />
            </div>
            <div>
              <label className="block text-[#b0b8c5] mb-1">Return Date</label>
              <input
                type="date"
                value={schedule.returnDate}
                onChange={(e) => setSchedule((s) => ({ ...s, returnDate: e.target.value }))}
                className="w-full rounded-lg bg-[#0c0f14] border border-white/20 px-3 py-1.5"
              />
            </div>
            <div>
              <label className="block text-[#b0b8c5] mb-1">Total Days</label>
              <input
                type="number"
                min={1}
                max={21}
                value={schedule.days}
                onChange={(e) => setSchedule((s) => ({ ...s, days: Math.max(1, Number(e.target.value)) }))}
                className="w-full rounded-lg bg-[#0c0f14] border border-white/20 px-3 py-1.5"
              />
            </div>
            <div>
              <label className="block text-[#b0b8c5] mb-1">Preferred Departure Window</label>
              <select
                value={schedule.preferredDepartureWindow}
                onChange={(e) =>
                  setSchedule((s) => ({
                    ...s,
                    preferredDepartureWindow: e.target.value as CompleteJourneyRequest['schedule']['preferredDepartureWindow'],
                  }))
                }
                className="w-full rounded-lg bg-[#0c0f14] border border-white/20 px-3 py-1.5"
              >
                <option value="MORNING">Morning (05:00 – 11:59)</option>
                <option value="AFTERNOON">Afternoon (12:00 – 16:59)</option>
                <option value="EVENING">Evening (17:00 – 20:59)</option>
                <option value="OVERNIGHT">Overnight (21:00 – 04:59)</option>
              </select>
            </div>
            <div>
              <label className="block text-[#b0b8c5] mb-1">Date Flexibility (± Days)</label>
              <input
                type="number"
                min={0}
                max={7}
                value={schedule.dateFlexibilityDays}
                onChange={(e) => setSchedule((s) => ({ ...s, dateFlexibilityDays: Number(e.target.value) }))}
                className="w-full rounded-lg bg-[#0c0f14] border border-white/20 px-3 py-1.5"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCurrentStep(4)}
            className="px-4 py-2 rounded-lg bg-[#d97736] text-black font-bold"
          >
            Continue to Travellers →
          </button>
        </div>
      )}

      {/* STEP 4: TRAVELLERS & ACCESSIBILITY */}
      {currentStep === 4 && (
        <div className="space-y-3 text-xs">
          <h3 className="text-sm font-bold text-[#f4f1ea]">
            Step 4: Traveller Counts, Rooms & Accessibility (Zero PII collected)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="block text-[#b0b8c5]">Adults</label>
              <input
                type="number"
                min={1}
                value={travellers.adults}
                onChange={(e) => setTravellers((t) => ({ ...t, adults: Math.max(1, Number(e.target.value)) }))}
                className="w-full rounded-lg bg-[#0c0f14] border border-white/20 px-3 py-1.5"
              />
            </div>
            <div>
              <label className="block text-[#b0b8c5]">Children (Under 15)</label>
              <input
                type="number"
                min={0}
                value={travellers.children}
                onChange={(e) => setTravellers((t) => ({ ...t, children: Math.max(0, Number(e.target.value)) }))}
                className="w-full rounded-lg bg-[#0c0f14] border border-white/20 px-3 py-1.5"
              />
            </div>
            <div>
              <label className="block text-[#b0b8c5]">Seniors (60+)</label>
              <input
                type="number"
                min={0}
                value={travellers.seniors}
                onChange={(e) => setTravellers((t) => ({ ...t, seniors: Math.max(0, Number(e.target.value)) }))}
                className="w-full rounded-lg bg-[#0c0f14] border border-white/20 px-3 py-1.5"
              />
            </div>
            <div>
              <label className="block text-[#b0b8c5]">Rooms Needed</label>
              <input
                type="number"
                min={0}
                value={travellers.roomsRequired}
                onChange={(e) => setTravellers((t) => ({ ...t, roomsRequired: Math.max(0, Number(e.target.value)) }))}
                className="w-full rounded-lg bg-[#0c0f14] border border-white/20 px-3 py-1.5"
              />
            </div>
            <div>
              <label className="block text-[#b0b8c5]">Nights Stay</label>
              <input
                type="number"
                min={0}
                value={travellers.nights}
                onChange={(e) => setTravellers((t) => ({ ...t, nights: Math.max(0, Number(e.target.value)) }))}
                className="w-full rounded-lg bg-[#0c0f14] border border-white/20 px-3 py-1.5"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={travellers.accessibilityNeeds.stepFreeAccess}
                onChange={(e) =>
                  setTravellers((t) => ({
                    ...t,
                    accessibilityNeeds: { ...t.accessibilityNeeds, stepFreeAccess: e.target.checked },
                  }))
                }
              />
              <span>Require Step-Free / Ramp Access (Avoid steep boulder climbs)</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={travellers.accessibilityNeeds.wheelchairFriendly}
                onChange={(e) =>
                  setTravellers((t) => ({
                    ...t,
                    accessibilityNeeds: { ...t.accessibilityNeeds, wheelchairFriendly: e.target.checked },
                  }))
                }
              />
              <span>Prioritize Electric Buggy / Wheelchair-Accessible Monuments</span>
            </label>
          </div>
          <button
            type="button"
            onClick={() => setCurrentStep(5)}
            className="px-4 py-2 rounded-lg bg-[#d97736] text-black font-bold"
          >
            Continue to Budget & Travel Class →
          </button>
        </div>
      )}

      {/* STEP 5: DECOUPLED BUDGET & TRAVEL CLASS (SECTION 10) */}
      {currentStep === 5 && (
        <div className="space-y-4 text-xs">
          <h3 className="text-sm font-bold text-[#f4f1ea]">
            Step 5: Independent Budget & Travel Class Configuration
          </h3>
          <p className="text-[#b0b8c5]">
            Your INR budget and your preferred transport class are kept strictly independent.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* A. Budget Configuration */}
            <div className="p-3 rounded-xl bg-[#0c0f14] border border-white/10 space-y-2">
              <div className="font-bold text-[#d97736]">A. Budget Setting</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBudgetAndClass((b) => ({ ...b, budgetMode: 'PER_PERSON' }))}
                  className={`flex-1 py-1 rounded ${
                    budgetAndClass.budgetMode === 'PER_PERSON' ? 'bg-white text-black font-bold' : 'bg-white/10'
                  }`}
                >
                  Per Person
                </button>
                <button
                  type="button"
                  onClick={() => setBudgetAndClass((b) => ({ ...b, budgetMode: 'TOTAL_GROUP' }))}
                  className={`flex-1 py-1 rounded ${
                    budgetAndClass.budgetMode === 'TOTAL_GROUP' ? 'bg-white text-black font-bold' : 'bg-white/10'
                  }`}
                >
                  Total Group
                </button>
              </div>

              <select
                value={budgetAndClass.budgetTier}
                onChange={(e) => {
                  const tier = SELECTABLE_BUDGET_TIERS.find((t) => t.id === e.target.value);
                  setBudgetAndClass((b) => ({
                    ...b,
                    budgetTier: e.target.value as BudgetAndClassConfig['budgetTier'],
                    customBudgetInr: tier ? tier.defaultInr : b.customBudgetInr,
                    isBusinessLuxuryExperience: e.target.value === 'business_luxury',
                  }));
                }}
                className="w-full rounded bg-[#151a23] border border-white/20 px-2.5 py-1.5"
              >
                {SELECTABLE_BUDGET_TIERS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
                <option value="custom">Custom INR Amount</option>
              </select>

              <div>
                <label className="block text-[11px] text-[#b0b8c5]">Custom Budget Amount (₹ INR)</label>
                <input
                  type="number"
                  min={500}
                  step={250}
                  value={budgetAndClass.customBudgetInr}
                  onChange={(e) =>
                    setBudgetAndClass((b) => ({ ...b, customBudgetInr: Math.max(500, Number(e.target.value)) }))
                  }
                  className="w-full rounded bg-[#151a23] border border-white/20 px-2.5 py-1.5"
                />
              </div>
            </div>

            {/* B. Independent Rail & Bus Classes */}
            <div className="p-3 rounded-xl bg-[#0c0f14] border border-white/10 space-y-2">
              <div className="font-bold text-[#d97736]">B. Rail & Bus Class Preferences</div>
              <div className="text-[11px] text-[#b0b8c5]">Rail Classes (filtered per train support):</div>
              <div className="flex flex-wrap gap-1">
                {(['UR', '2S', 'SL', '3A', '2A', '1A', 'CC', 'EC'] as RailClassCode[]).map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => toggleRailClass(cls)}
                    className={`px-2 py-1 rounded text-[11px] ${
                      budgetAndClass.preferredRailClasses.includes(cls)
                        ? 'bg-emerald-500 text-black font-bold'
                        : 'bg-white/10 text-[#b0b8c5]'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>

              <div className="text-[11px] text-[#b0b8c5] pt-1">Bus Service Classes:</div>
              <div className="flex flex-wrap gap-1">
                {(
                  [
                    'ORDINARY',
                    'EXPRESS',
                    'NON_AC_SLEEPER',
                    'AC_SLEEPER',
                    'AC_SEATER',
                    'PREMIUM_VOLVO',
                    'ELECTRIC_EV',
                  ] as BusServiceClass[]
                ).map((bCls) => (
                  <button
                    key={bCls}
                    type="button"
                    onClick={() => toggleBusClass(bCls)}
                    className={`px-2 py-1 rounded text-[10px] ${
                      budgetAndClass.preferredBusClasses.includes(bCls)
                        ? 'bg-[#d97736] text-black font-bold'
                        : 'bg-white/10 text-[#b0b8c5]'
                    }`}
                  >
                    {bCls.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* C. Strict Accommodation Filter */}
            <div className="p-3 rounded-xl bg-[#0c0f14] border border-white/10 space-y-2">
              <div className="font-bold text-[#d97736]">C. Accommodation Compliance Filter</div>
              <select
                value={budgetAndClass.accommodationPreference}
                onChange={(e) =>
                  setBudgetAndClass((b) => ({
                    ...b,
                    accommodationPreference: e.target.value as BudgetAndClassConfig['accommodationPreference'],
                  }))
                }
                className="w-full rounded bg-[#151a23] border border-white/20 px-2.5 py-2"
              >
                <option value="GOVERNMENT_OPERATED_ONLY">1. Government-Operated Only (KSTDC / JLR)</option>
                <option value="GOVERNMENT_CLASSIFIED_HOTELS">2. Government-Classified Hotels</option>
                <option value="REGISTERED_KARNATAKA_HOMESTAYS">
                  3. Registered Karnataka Homestays (Valid Expiry)
                </option>
                <option value="VALID_BUDGET_ACCOMMODATION">4. Validly Registered Budget Stays</option>
                <option value="NO_ACCOMMODATION_REQUIRED">5. No Accommodation Required (Day / Overnight Transit)</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCurrentStep(6)}
            className="px-4 py-2 rounded-lg bg-[#d97736] text-black font-bold"
          >
            Continue to Interests →
          </button>
        </div>
      )}

      {/* STEP 6: INTERESTS */}
      {currentStep === 6 && (
        <div className="space-y-3 text-xs">
          <h3 className="text-sm font-bold text-[#f4f1ea]">Step 6: Select Traveller Interests</h3>
          <div className="flex flex-wrap gap-2">
            {ALL_INTERESTS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  interests.includes(interest)
                    ? 'bg-emerald-500 text-black'
                    : 'bg-[#0c0f14] text-[#b0b8c5] border border-white/15'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setCurrentStep(7)}
            className="px-4 py-2 rounded-lg bg-[#d97736] text-black font-bold"
          >
            Review & Generate Journey →
          </button>
        </div>
      )}

      {/* STEP 7: GENERATE STRUCTURED JOURNEY */}
      {currentStep === 7 && (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-[#0c0f14] border border-emerald-500/30 space-y-1.5">
            <div className="text-sm font-bold text-emerald-400">Ready to Generate Structured Journey & Map</div>
            <div>
              <strong>Route:</strong> {departure.canonicalName} → {destination.nameEn} ({destination.nameKn})
            </div>
            <div>
              <strong>Dates:</strong> {schedule.departureDate} to {schedule.returnDate} ({schedule.days} Days)
            </div>
            <div>
              <strong>Group:</strong> {travellers.adults} Adults, {travellers.children} Children, {travellers.seniors}{' '}
              Seniors ({travellers.roomsRequired} Room)
            </div>
            <div>
              <strong>Budget & Classes:</strong> ₹{budgetAndClass.customBudgetInr.toLocaleString('en-IN')} (
              {budgetAndClass.budgetMode}) · Rail: {budgetAndClass.preferredRailClasses.join(', ')} · Stay:{' '}
              {budgetAndClass.accommodationPreference}
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onBuildJourney({
                destination,
                departure,
                schedule,
                travellers,
                budgetAndClass,
                interests,
              })
            }
            className="w-full py-3.5 rounded-xl bg-[#d97736] hover:bg-[#e5894a] text-black font-extrabold text-sm tracking-wide shadow-lg"
          >
            Build my Karnataka journey
          </button>
        </div>
      )}
    </section>
  );
};
