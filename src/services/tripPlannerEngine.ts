// src/services/tripPlannerEngine.ts

import { BudgetTier, ComputedTripRoute, KarnatakaPOI, TripBudgetBreakdown } from '../types/nammatrip';
import { getPoiById, CURATED_CIRCUIT_PRESETS } from '../data/karnatakaTravelRegistry';

const TIER_RATES: Record<
  BudgetTier,
  { stayPerNightPerPerson: number; foodPerDayPerPerson: number; transportPerKm: number; baseTransitPerPerson: number }
> = {
  backpacker: {
    stayPerNightPerPerson: 650, // Hostels / KSTDC dorms / Dharamshalas
    foodPerDayPerPerson: 380, // Darshinis, MTR/Khanavali meals
    transportPerKm: 2.2, // KSRTC Sarige/Rajahamsa & 2S/Sleeper train
    baseTransitPerPerson: 350,
  },
  comfort: {
    stayPerNightPerPerson: 1850, // KSTDC Mayura / Registered Coffee Homestays
    foodPerDayPerPerson: 750, // Sit-down regional dining & cafes
    transportPerKm: 5.5, // KSRTC Airavat AC / Vande Bharat / Shared Cab
    baseTransitPerPerson: 750,
  },
  premium: {
    stayPerNightPerPerson: 4800, // Boutique heritage resorts & JLR lodges
    foodPerDayPerPerson: 1600, // Fine dining & curated estate meals
    transportPerKm: 16.0, // Dedicated Innova/SUV + tolls
    baseTransitPerPerson: 1800,
  },
};

export function calculateTripBudget(params: {
  stops: KarnatakaPOI[];
  route: ComputedTripRoute;
  days: number;
  travellers: number;
  tier: BudgetTier;
}): TripBudgetBreakdown {
  const safeDays = Math.max(1, Math.min(15, params.days));
  const safeTravellers = Math.max(1, Math.min(20, params.travellers));
  const rates = TIER_RATES[params.tier];

  const nights = Math.max(0, safeDays - 1);
  const accommodationInr = nights * rates.stayPerNightPerPerson * safeTravellers;
  const foodInr = safeDays * rates.foodPerDayPerPerson * safeTravellers;

  const distanceCost = Math.round(params.route.totalDistanceKm * rates.transportPerKm);
  const transportInr =
    params.tier === 'premium'
      ? distanceCost + rates.baseTransitPerPerson // Private vehicle shared across group
      : (distanceCost + rates.baseTransitPerPerson) * safeTravellers;

  const rawEntryPerPerson = params.stops.reduce((acc, stop) => {
    return (
      acc +
      (stop.entryFeeInr.indianCitizen || 0) +
      (stop.costEstimatePerPersonInr ? Math.round(stop.costEstimatePerPersonInr * 0.25) : 0)
    );
  }, 0);

  const entryAndActivitiesInr = rawEntryPerPerson * safeTravellers;
  const totalInr = accommodationInr + foodInr + transportInr + entryAndActivitiesInr;
  const perPersonPerDayInr = Math.round(totalInr / (safeDays * safeTravellers));

  return {
    tier: params.tier,
    days: safeDays,
    travellers: safeTravellers,
    transportInr,
    accommodationInr,
    foodInr,
    entryAndActivitiesInr,
    totalInr,
    perPersonPerDayInr,
  };
}

export interface ShareableTripState {
  stopIds: string[];
  days: number;
  travellers: number;
  tier: BudgetTier;
}

export function serializeTripToQueryString(state: ShareableTripState): string {
  const params = new URLSearchParams();
  params.set('stops', state.stopIds.join(','));
  params.set('days', String(state.days));
  params.set('travellers', String(state.travellers));
  params.set('tier', state.tier);
  return `?${params.toString()}`;
}

export function parseTripFromQueryString(search: string): ShareableTripState {
  const params = new URLSearchParams(search);
  const rawStops = params.get('stops');
  const validStopIds = rawStops
    ? rawStops
        .split(',')
        .map((s) => s.trim())
        .filter((id) => Boolean(getPoiById(id)))
    : [];

  const defaultPreset = CURATED_CIRCUIT_PRESETS[0];
  const stopIds = validStopIds.length >= 2 ? validStopIds : defaultPreset.stopIds;
  const days = Math.max(1, Math.min(14, Number(params.get('days')) || defaultPreset.days));
  const travellers = Math.max(1, Math.min(12, Number(params.get('travellers')) || 2));
  const rawTier = params.get('tier') as BudgetTier;
  const tier: BudgetTier =
    rawTier === 'backpacker' || rawTier === 'comfort' || rawTier === 'premium' ? rawTier : defaultPreset.defaultTier;

  return { stopIds, days, travellers, tier };
}

export function exportItineraryToMarkdown(params: {
  stops: KarnatakaPOI[];
  route: ComputedTripRoute;
  budget: TripBudgetBreakdown;
}): string {
  const lines: string[] = [
    `# NammaTrip AI — Karnataka Travel Itinerary`,
    `**Duration:** ${params.budget.days} Days | **Travellers:** ${params.budget.travellers} | **Style:** ${params.budget.tier.toUpperCase()}`,
    `**Total Road Distance:** ${params.route.totalDistanceKm} km | **Est. Drive Time:** ${Math.floor(params.route.totalDurationMinutes / 60)}h ${params.route.totalDurationMinutes % 60}m`,
    `**Estimated Total Budget:** ₹${params.budget.totalInr.toLocaleString('en-IN')} (₹${params.budget.perPersonPerDayInr.toLocaleString('en-IN')}/person/day)`,
    ``,
    `## Ordered Itinerary Stops`,
  ];

  params.stops.forEach((stop, index) => {
    lines.push(
      `### ${index + 1}. ${stop.name} (${stop.nameKannada}) — *${stop.district}*`,
      `- **Category:** ${stop.category} | **Visit Time:** ${stop.recommendedHours} hrs | **Best Time:** ${stop.bestTimeOfDay}`,
      `- **Entry / Tariff:** ₹${stop.entryFeeInr.indianCitizen} (${stop.entryFeeInr.feeNote})`,
      `- **Local Kannada Companion (${stop.localPhrase.dialectLabel}):**`,
      `  - Kannada: ${stop.localPhrase.kannada}`,
      `  - Transliteration: *${stop.localPhrase.iast}*`,
      `  - Meaning: "${stop.localPhrase.english}"`,
      ``
    );
  });

  return lines.join('\n');
}
