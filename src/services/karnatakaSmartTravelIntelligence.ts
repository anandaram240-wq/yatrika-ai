// src/services/karnatakaSmartTravelIntelligence.ts

import { BudgetTier, KarnatakaPOI } from '../types/nammatrip';
import { CURATED_CIRCUIT_PRESETS, KARNATAKA_POIS } from '../data/karnatakaTravelRegistry';

export type TravelSeason = 'winter_oct_feb' | 'monsoon_jun_sep' | 'summer_mar_may';

export interface TrainCorridorInfo {
  trainNumber: string;
  corridorName: string;
  trainName: string;
  originCode: string;
  destinationCode: string;
  departureTime: string;
  arrivalTime: string;
  durationLabel: string;
  specialHighlight: string;
  lastMileKsrtcNote: string;
  savesHotelNight: boolean;
  hotelNightSavingsInr: number;
}

export const VERIFIED_TRAIN_CORRIDORS: Record<string, TrainCorridorInfo> = {
  'vande-bharat-mysuru': {
    trainNumber: '20608 / 20661',
    corridorName: 'Bengaluru (SBC) ⇄ Mysuru (MYS) Express Corridor',
    trainName: 'Mysuru Vande Bharat Express',
    originCode: 'SBC',
    destinationCode: 'MYS',
    departureTime: '05:45 AM',
    arrivalTime: '07:20 AM',
    durationLabel: '1h 35m',
    specialHighlight: '160 km/h aero-train cruising through Ramanagara silk & rock country',
    lastMileKsrtcNote: 'Pre-paid auto stand at MYS Platform 1 directly connects to Mysuru Palace in 8 mins',
    savesHotelNight: false,
    hotelNightSavingsInr: 0,
  },
  'hampi-express-overnight': {
    trainNumber: '16592',
    corridorName: 'Bengaluru (SBC) ⇄ Hosapete (HPT — Hampi Gateway)',
    trainName: 'Hampi Express (Overnight Sleeper)',
    originCode: 'SBC',
    destinationCode: 'HPT',
    departureTime: '09:50 PM',
    arrivalTime: '07:05 AM',
    durationLabel: '9h 15m',
    specialHighlight: 'Sleep comfortably in Bengaluru and wake up amidst the 15th-century Vijayanagara boulders',
    lastMileKsrtcNote: 'KKRTC city shuttle departs Hosapete station every 20 minutes directly to Hampi Bazaar (₹25)',
    savesHotelNight: true,
    hotelNightSavingsInr: 2400,
  },
  'panchaganga-karavali-vistadome': {
    trainNumber: '16595 / 16539',
    corridorName: 'Bengaluru (YPR) ⇄ Subrahmanya ⇄ Mangaluru ⇄ Udupi (UD)',
    trainName: 'Panchaganga Express / Yesvantpur Vistadome',
    originCode: 'YPR',
    destinationCode: 'UD',
    departureTime: '07:00 AM',
    arrivalTime: '05:15 PM',
    durationLabel: '10h 15m',
    specialHighlight: 'Glass-roof Vistadome car through 58 tunnels and waterfalls of the Sakleshpur–Subrahmanya Western Ghats',
    lastMileKsrtcNote: 'Udupi Indrali railway station connects to Sri Krishna Matha in 10 mins by auto or NH-66 express bus',
    savesHotelNight: false,
    hotelNightSavingsInr: 0,
  },
  'siddharoodha-hubballi-express': {
    trainNumber: '20661',
    corridorName: 'Bengaluru (SBC) ⇄ Davangere ⇄ SSS Hubballi (UBL)',
    trainName: 'Dharwad Vande Bharat Express',
    originCode: 'SBC',
    destinationCode: 'UBL',
    departureTime: '05:45 AM',
    arrivalTime: '10:45 AM',
    durationLabel: '5h 00m',
    specialHighlight: 'World’s longest railway platform (1,507m) and gateway to Badami Chalukya circuit & Dandeli',
    lastMileKsrtcNote: 'Chigari BRTS high-frequency corridor connects Hubballi and Dharwad every 3 minutes',
    savesHotelNight: false,
    hotelNightSavingsInr: 0,
  },
};

export interface AranyaVihaaraCompliance {
  requiresForestPermit: boolean;
  officialPortalUrl: string;
  permitTypeNote?: string;
}

export function getAranyaVihaaraCompliance(poi: KarnatakaPOI): AranyaVihaaraCompliance {
  const permitIds = ['poi-mullayanagiri', 'poi-kabini-nagarhole', 'poi-coorg-raja-seat'];
  if (permitIds.includes(poi.id) || poi.category === 'wildlife_nature') {
    return {
      requiresForestPermit: true,
      officialPortalUrl: 'https://aranyavihaara.karnataka.gov.in',
      permitTypeNote: 'Eco-Trek / Safari entry pass regulated by Karnataka Forest Dept',
    };
  }
  return {
    requiresForestPermit: false,
    officialPortalUrl: 'https://karnatakatourism.org',
  };
}

export interface SeasonalAdvisory {
  ratingBadge: string;
  advisoryText: string;
}

export function getSeasonalAdvisory(poi: KarnatakaPOI, season: TravelSeason): SeasonalAdvisory {
  if (season === 'monsoon_jun_sep') {
    if (poi.category === 'attraction' && poi.id.includes('falls')) {
      return {
        ratingBadge: 'Peak_Roaring_Flow',
        advisoryText: 'Monsoon season brings maximum waterfall volume; check for gorge mist advisories.',
      };
    }
    if (poi.macroRegion === 'Malnad & Western Ghats' || poi.macroRegion === 'Karavali Coastal') {
      return {
        ratingBadge: 'Lush_Greenery_Rain_Alert',
        advisoryText: 'High rainfall in ghats. Drive carefully on Charmadi/Shiradi ghat turns.',
      };
    }
    return {
      ratingBadge: 'Pleasant_Breeze',
      advisoryText: 'Good season with overcast weather across Deccan plains.',
    };
  }

  if (season === 'summer_mar_may') {
    if (poi.category === 'wildlife_nature') {
      return {
        ratingBadge: 'Prime_Tiger_Waterhole_Sightings',
        advisoryText: 'High wildlife visibility near Kabini riverbanks as water recedes.',
      };
    }
    if (poi.macroRegion === 'Kittur Karnataka' || poi.macroRegion === 'Kalyana Karnataka') {
      return {
        ratingBadge: 'Early_Morning_Visits_Recommended',
        advisoryText: 'Sun peaks above 38°C; schedule temple visits between 6:30 AM and 10:30 AM.',
      };
    }
    return {
      ratingBadge: 'Cooler_Hill_Retreat',
      advisoryText: 'Refreshing high-altitude escape from the plains heat.',
    };
  }

  // winter_oct_feb (Default)
  return {
    ratingBadge: 'Optimal_Pleasant_Weather',
    advisoryText: 'Crisp mornings and clear skies ideal for heritage walks, cliff treks, and photography.',
  };
}

export interface ShaktiSavingsResult {
  shaktiDiscountInr: number;
  netTransportInr: number;
  explanation: string;
}

export function calculateShaktiSchemeSavings(params: {
  baseTransportInr: number;
  totalTravellers: number;
  karnatakaDomicileWomenCount: number;
  tier: BudgetTier;
}): ShaktiSavingsResult {
  const { baseTransportInr, totalTravellers, karnatakaDomicileWomenCount, tier } = params;

  if (karnatakaDomicileWomenCount <= 0 || tier === 'premium') {
    return {
      shaktiDiscountInr: 0,
      netTransportInr: baseTransportInr,
      explanation:
        tier === 'premium'
          ? 'Shakti Scheme covers KSRTC Ordinary & Express non-AC buses. Premium private SUV transit does not qualify.'
          : 'No Shakti beneficiaries specified. Standard KSRTC & train fares apply.',
    };
  }

  // On backpacker / comfort tiers, estimated bus transit portion is ~50-65%
  const busPortionRatio = tier === 'backpacker' ? 0.65 : 0.45;
  const eligibleBusTransportTotal = baseTransportInr * busPortionRatio;
  const perPersonBusCost = eligibleBusTransportTotal / Math.max(1, totalTravellers);

  const discount = Math.round(perPersonBusCost * Math.min(karnatakaDomicileWomenCount, totalTravellers));
  const netTransport = Math.max(0, baseTransportInr - discount);

  return {
    shaktiDiscountInr: discount,
    netTransportInr: netTransport,
    explanation: `Karnataka Shakti Scheme applies ₹0 fare on KSRTC/NWKRTC/KKRTC Ordinary & Express buses for ${karnatakaDomicileWomenCount} resident women, saving ₹${discount.toLocaleString('en-IN')}.`,
  };
}

export interface ParsedAiTripPrompt {
  stopIds: string[];
  days: number;
  travellers: number;
  tier: BudgetTier;
  summaryExplanation: string;
}

export function parseNaturalLanguageTripPrompt(prompt: string): ParsedAiTripPrompt {
  const p = prompt.toLowerCase();

  // Extract Days
  let days = 3;
  const daysMatch = p.match(/(\d+)\s*(?:day|days|d)/);
  if (daysMatch) {
    days = Math.max(1, Math.min(10, parseInt(daysMatch[1], 10)));
  }

  // Extract Travellers
  let travellers = 2;
  const travMatch = p.match(/(\d+)\s*(?:person|people|traveller|travellers|adults)/);
  if (travMatch) {
    travellers = Math.max(1, Math.min(12, parseInt(travMatch[1], 10)));
  } else if (p.includes('solo')) {
    travellers = 1;
  } else if (p.includes('family') || p.includes('group')) {
    travellers = 4;
  }

  // Extract Tier / Budget
  let tier: BudgetTier = 'comfort';
  if (p.includes('budget') || p.includes('cheap') || p.includes('backpacker') || p.includes('hostel') || p.includes('under 3000') || p.includes('under 4000') || p.includes('under 5000')) {
    tier = 'backpacker';
  } else if (p.includes('luxury') || p.includes('resort') || p.includes('premium') || p.includes('5-star')) {
    tier = 'premium';
  }

  // Match Circuits / Stops
  let stopIds: string[] = CURATED_CIRCUIT_PRESETS[0].stopIds;
  let summary = `Generated a ${days}-day ${tier} itinerary for ${travellers} travellers.`;

  if (p.includes('hampi') || p.includes('unesco') || p.includes('badami') || p.includes('boulder')) {
    stopIds = CURATED_CIRCUIT_PRESETS[1].stopIds;
    summary = `Optimized ${days}-day UNESCO Empire Trail with overnight Hampi Express and Chalukya caves for ${travellers} people.`;
  } else if (p.includes('coast') || p.includes('beach') || p.includes('gokarna') || p.includes('udupi') || p.includes('waterfall') || p.includes('jog')) {
    stopIds = CURATED_CIRCUIT_PRESETS[2].stopIds;
    summary = `Assembled ${days}-day Karavali Coastal & Malnad Waterfalls circuit connecting Udupi, Gokarna, and Jog Falls.`;
  } else if (p.includes('coorg') || p.includes('mysore') || p.includes('mysuru') || p.includes('palace') || p.includes('safari') || p.includes('kabini')) {
    stopIds = CURATED_CIRCUIT_PRESETS[0].stopIds;
    summary = `Tailored ${days}-day Royal Mysuru, Kabini Safari & Misty Coorg circuit with Vande Bharat rail connections.`;
  } else {
    // Custom keyword search across all POIs
    const matches = KARNATAKA_POIS.filter(
      (poi) =>
        p.includes(poi.district.toLowerCase()) ||
        p.includes(poi.name.toLowerCase().split(' ')[0]) ||
        p.includes(poi.category)
    );
    if (matches.length >= 2) {
      stopIds = matches.slice(0, 5).map((m) => m.id);
      summary = `Custom tailored ${days}-day itinerary visiting ${matches.map((m) => m.name.split('(')[0].trim()).join(', ')}.`;
    }
  }

  return {
    stopIds,
    days,
    travellers,
    tier,
    summaryExplanation: summary,
  };
}
