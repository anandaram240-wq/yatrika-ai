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
    trainNumber: '20607 / 20608',
    corridorName: 'Chennai Central ⇄ Bengaluru (SBC) ⇄ Mysuru (MYS) Express Corridor',
    trainName: 'MGR Chennai Central - Mysuru Vande Bharat Express',
    originCode: 'MAS',
    destinationCode: 'MYS',
    departureTime: '10:20 AM (ex-SBC)',
    arrivalTime: '12:20 PM',
    durationLabel: '2h 00m (ex-SBC)',
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
    corridorName: 'Bengaluru (YPR) ⇄ Hassan ⇄ Sakleshpur ⇄ Mangaluru ⇄ Udupi (UD)',
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
    trainNumber: '20661 / 20662',
    corridorName: 'Bengaluru (SBC) ⇄ Davanagere ⇄ SSS Hubballi (UBL) ⇄ Dharwad (DWR)',
    trainName: 'KSR Bengaluru - Dharwad Vande Bharat Express',
    originCode: 'SBC',
    destinationCode: 'DWR',
    departureTime: '05:45 AM',
    arrivalTime: '11:15 AM',
    durationLabel: '5h 30m',
    specialHighlight: 'World’s longest railway platform (1,507m at Hubballi) and gateway to Badami Chalukya circuit & Dandeli',
    lastMileKsrtcNote: 'Chigari BRTS high-frequency corridor connects Hubballi and Dharwad every 3 minutes',
    savesHotelNight: false,
    hotelNightSavingsInr: 0,
  },
  'gomateshwara-hassan-express': {
    trainNumber: '16575 / 16576',
    corridorName: 'Bengaluru (YPR) ⇄ Shravanabelagola ⇄ Hassan Junction (HAS)',
    trainName: 'Gomateshwara Express',
    originCode: 'YPR',
    destinationCode: 'HAS',
    departureTime: '07:15 AM',
    arrivalTime: '10:05 AM',
    durationLabel: '2h 50m',
    specialHighlight: 'Direct morning train connecting Bengaluru to Shravanabelagola Bahubali and Hassan (nearest railhead for Belur & Halebidu Hoysala temples)',
    lastMileKsrtcNote: 'Hassan CBS has KSRTC Non-Stop express buses departing every 15 minutes to Belur Temple (₹45, 40 min)',
    savesHotelNight: false,
    hotelNightSavingsInr: 0,
  },
  'rani-chennamma-express': {
    trainNumber: '16589 / 16590',
    corridorName: 'Bengaluru (SBC) ⇄ Tumakuru ⇄ Davanagere ⇄ Hubballi ⇄ Belagavi (BGM)',
    trainName: 'Rani Chennamma Express (Overnight Superfast)',
    originCode: 'SBC',
    destinationCode: 'MRJ',
    departureTime: '11:00 PM',
    arrivalTime: '08:35 AM (BGM)',
    durationLabel: '9h 35m (overnight)',
    specialHighlight: 'Named after Kittur Rani Chennamma. Overnight journey eliminating hotel cost, arriving in Hubballi/Belagavi at dawn',
    lastMileKsrtcNote: 'Belagavi Central Bus Stand is right across from station for Kittur Fort and Gokak Falls',
    savesHotelNight: true,
    hotelNightSavingsInr: 2200,
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

  // Extract Days (English & Kannada numerals/words)
  let days = 3;
  const daysMatch = p.match(/(\d+)\s*(?:day|days|d|ದಿನ)/);
  if (daysMatch) {
    days = Math.max(1, Math.min(10, parseInt(daysMatch[1], 10)));
  } else if (p.includes('ಒಂದು ದಿನ') || p.includes('೧ ದಿನ')) {
    days = 1;
  } else if (p.includes('ಎರಡು ದಿನ') || p.includes('೨ ದಿನ')) {
    days = 2;
  } else if (p.includes('ಮೂರು ದಿನ') || p.includes('೩ ದಿನ')) {
    days = 3;
  } else if (p.includes('ನಾಲ್ಕು ದಿನ') || p.includes('೪ ದಿನ')) {
    days = 4;
  } else if (p.includes('ಐದು ದಿನ') || p.includes('೫ ದಿನ')) {
    days = 5;
  } else if (p.includes('ಆರು ದಿನ') || p.includes('೬ ದಿನ') || p.includes('ವಾರ')) {
    days = 7;
  }

  // Extract Travellers (English & Kannada)
  let travellers = 2;
  const travMatch = p.match(/(\d+)\s*(?:person|people|traveller|travellers|adults|ಜನ|ಮಂದಿ)/);
  if (travMatch) {
    travellers = Math.max(1, Math.min(12, parseInt(travMatch[1], 10)));
  } else if (p.includes('solo') || p.includes('ಒಬ್ಬರೇ') || p.includes('ಏಕಾಂಗಿ')) {
    travellers = 1;
  } else if (p.includes('ಇಬ್ಬರು') || p.includes('ದಂಪತಿ') || p.includes('couple')) {
    travellers = 2;
  } else if (p.includes('ಮೂವರು')) {
    travellers = 3;
  } else if (p.includes('ನಾಲ್ವರು') || p.includes('family') || p.includes('group') || p.includes('ಕುಟುಂಬ') || p.includes('ಗೆಳೆಯರು')) {
    travellers = 4;
  }

  // Extract Tier / Budget (English & Kannada)
  let tier: BudgetTier = 'comfort';
  if (
    p.includes('budget') ||
    p.includes('cheap') ||
    p.includes('backpacker') ||
    p.includes('hostel') ||
    p.includes('under 3000') ||
    p.includes('under 4000') ||
    p.includes('under 5000') ||
    p.includes('5000') ||
    p.includes('ಐದು ಸಾವಿರ') ||
    p.includes('ಬಜೆಟ್') ||
    p.includes('ಕಡಿಮೆ ವೆಚ್ಚ') ||
    p.includes('ಉಚಿತ')
  ) {
    tier = 'backpacker';
  } else if (
    p.includes('luxury') ||
    p.includes('resort') ||
    p.includes('premium') ||
    p.includes('5-star') ||
    p.includes('ಐಷಾರಾಮಿ') ||
    p.includes('ಪ್ರೀಮಿಯಂ')
  ) {
    tier = 'premium';
  }

  // Find circuits safely by canonical id
  const unescoCircuit = CURATED_CIRCUIT_PRESETS.find((c) => c.id === 'circuit-unesco-hampi-badami') || CURATED_CIRCUIT_PRESETS[2];
  const coastCircuit = CURATED_CIRCUIT_PRESETS.find((c) => c.id === 'circuit-karavali-malnad-coast') || CURATED_CIRCUIT_PRESETS[3];
  const royalCircuit = CURATED_CIRCUIT_PRESETS.find((c) => c.id === 'circuit-royal-mysuru-coorg') || CURATED_CIRCUIT_PRESETS[1];
  const goldenCircuit = CURATED_CIRCUIT_PRESETS.find((c) => c.id === 'circuit-golden-bengaluru-mullayanagiri') || CURATED_CIRCUIT_PRESETS[0];

  let stopIds: string[] = goldenCircuit.stopIds;
  let summary = `Generated a ${days}-day ${tier} itinerary for ${travellers} travellers.`;

  if (
    p.includes('hampi') ||
    p.includes('ಹಂಪಿ') ||
    p.includes('ಹಂಪಿಗೆ') ||
    p.includes('unesco') ||
    p.includes('badami') ||
    p.includes('ಬಾದಾಮಿ') ||
    p.includes('hosapete') ||
    p.includes('ಹೊಸಪೇಟೆ') ||
    p.includes('ಪಟ್ಟದಕಲ್ಲು') ||
    p.includes('ಐಹೊಳೆ')
  ) {
    stopIds = unescoCircuit.stopIds;
    summary = `Optimized ${days}-day UNESCO Empire Trail (Hampi, Badami, Pattadakal) with SWR rail and heritage corridors for ${travellers} travellers.`;
  } else if (
    p.includes('coast') ||
    p.includes('beach') ||
    p.includes('gokarna') ||
    p.includes('ಗೋಕರ್ಣ') ||
    p.includes('udupi') ||
    p.includes('ಉಡುಪಿ') ||
    p.includes('ಕರಾವಳಿ') ||
    p.includes('waterfall') ||
    p.includes('jog') ||
    p.includes('ಜೋಗ') ||
    p.includes('ಮಂಗಳೂರು')
  ) {
    stopIds = coastCircuit.stopIds;
    summary = `Assembled ${days}-day Karavali Coastal & Malnad Waterfalls circuit connecting Udupi, Gokarna, and Jog Falls.`;
  } else if (
    p.includes('chikkamagaluru') ||
    p.includes('ಚಿಕ್ಕಮಗಳೂರು') ||
    p.includes('mullayanagiri') ||
    p.includes('ಮುಳ್ಳಯ್ಯನಗಿರಿ') ||
    p.includes('belur') ||
    p.includes('ಬೇಲೂರು') ||
    p.includes('halebidu') ||
    p.includes('ಹಳೇಬೀಡು') ||
    p.includes('ಶೆಟ್ಟಿಹಳ್ಳಿ')
  ) {
    stopIds = goldenCircuit.stopIds;
    summary = `Crafted ${days}-day Golden Coffee & Hoysala Trail across Belur, Shettihalli, and Mullayanagiri peak.`;
  } else if (
    p.includes('coorg') ||
    p.includes('ಕೂರ್ಗ್') ||
    p.includes('ಕೊಡಗು') ||
    p.includes('madikeri') ||
    p.includes('ಮಡಿಕೇರಿ') ||
    p.includes('mysore') ||
    p.includes('ಮೈಸೂರು') ||
    p.includes('ಮೈಸೂರಿಗೆ') ||
    p.includes('palace') ||
    p.includes('safari') ||
    p.includes('kabini')
  ) {
    stopIds = royalCircuit.stopIds;
    summary = `Tailored ${days}-day Royal Mysuru, Kabini Safari & Misty Coorg circuit with Vande Bharat rail connections.`;
  } else {
    // Custom keyword search across all POIs (English and Kannada names)
    const matches = KARNATAKA_POIS.filter(
      (poi) =>
        p.includes(poi.district.toLowerCase()) ||
        p.includes(poi.name.toLowerCase().split(' ')[0]) ||
        p.includes(poi.nameKannada) ||
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

export interface CorridorBranch {
  id: string;
  label: string;
  corridorTitle: string;
  roadName: string;
  mountainAdvisory?: string;
  recommendedPoiIds: string[];
  suggestedPresetId: string;
  primaryHighwayNumber: string;
}

export interface CorridorRecommendation {
  corridorTitle: string;
  roadName: string;
  mountainAdvisory?: string;
  recommendedPoiIds: string[];
  suggestedPresetId?: string;
  availableBranches?: CorridorBranch[];
}

export function getCorridorIntelligence(originId: string): CorridorRecommendation {
  if (originId === 'origin-chikkamagaluru') {
    return {
      corridorTitle: 'Mullayanagiri Mountain Ridge & Coffee Valley Corridor',
      roadName: 'Kaimara - Mullayanagiri Mountain Ghat Road (18 Hairpins)',
      mountainAdvisory: 'Ascent from 1,030m to 1,930m summit • Drive in 1st/2nd gear • Morning cloud mist between 06:00–08:30 • 4x4 needed for Jhari Falls',
      recommendedPoiIds: [
        'poi-seethalayyanagiri',
        'poi-mullayanagiri',
        'poi-jhari-falls',
        'poi-bababudangiri',
        'poi-hirekolale-lake',
      ],
      suggestedPresetId: 'circuit-chikkamagaluru-mullayanagiri',
      availableBranches: [
        {
          id: 'branch-ckm-mullayanagiri',
          label: '⛰️ Mullayanagiri & Baba Budan Ridge',
          corridorTitle: 'Mullayanagiri Mountain Ridge & Coffee Valley Corridor',
          roadName: 'Kaimara - Mullayanagiri Mountain Ghat Road (18 Hairpins)',
          mountainAdvisory: 'Ascent from 1,030m to 1,930m summit • Drive in 1st/2nd gear • Morning cloud mist between 06:00–08:30 • 4x4 needed for Jhari Falls',
          recommendedPoiIds: [
            'poi-seethalayyanagiri',
            'poi-mullayanagiri',
            'poi-jhari-falls',
            'poi-bababudangiri',
            'poi-hirekolale-lake',
          ],
          suggestedPresetId: 'circuit-chikkamagaluru-mullayanagiri',
          primaryHighwayNumber: 'SH-57 / Ghat Pass',
        },
        {
          id: 'branch-ckm-kudremukh',
          label: '🌿 Kudremukh & Kalasa Valley',
          corridorTitle: 'Bhadra Valley to Kudremukh Rainforest Corridor',
          roadName: 'SH-66 Mudigere-Kottigehara & Kalasa Ghat',
          mountainAdvisory: 'Dense evergreen canopy • Heavy monsoon leeches & fog • Aranya Vihaara check-post permits required',
          recommendedPoiIds: [
            'poi-kallathigiri-falls',
            'poi-z-point-kemmangundi',
            'poi-horanadu-annapoorneshwari',
            'poi-sringeri-sharada-peetham',
          ],
          suggestedPresetId: 'circuit-malnad-spiritual-peaks',
          primaryHighwayNumber: 'SH-66',
        },
      ],
    };
  }
  if (originId === 'origin-mangaluru' || originId === 'origin-udupi') {
    return {
      corridorTitle: 'Karavali to Western Ghats Mountain Pass Corridor',
      roadName: 'Charmadi Ghat (SH-37) / Shiradi Ghat (NH-75)',
      mountainAdvisory: 'Dramatic transition from sea level to 1,100m • Cascading roadside streams • Heavy rain mist; daytime travel advised',
      recommendedPoiIds: ['poi-charmadi-ghat-view', 'poi-ballalarayana-durga', 'poi-horanadu-annapoorneshwari', 'poi-sringeri-sharada-peetham'],
      suggestedPresetId: 'circuit-malnad-spiritual-peaks',
      availableBranches: [
        {
          id: 'branch-karavali-ghats',
          label: '🌊 Charmadi & Western Ghats Pass',
          corridorTitle: 'Karavali to Western Ghats Mountain Pass Corridor',
          roadName: 'Charmadi Ghat (SH-37) / Shiradi Ghat (NH-75)',
          mountainAdvisory: 'Dramatic transition from sea level to 1,100m • Cascading roadside streams • Heavy rain mist; daytime travel advised',
          recommendedPoiIds: ['poi-charmadi-ghat-view', 'poi-ballalarayana-durga', 'poi-horanadu-annapoorneshwari', 'poi-sringeri-sharada-peetham'],
          suggestedPresetId: 'circuit-malnad-spiritual-peaks',
          primaryHighwayNumber: 'SH-37 / NH-75',
        },
        {
          id: 'branch-karavali-coast',
          label: '🏖️ NH-66 Coastal Marine Highway',
          corridorTitle: 'Karavali Coastal Marine Corridor',
          roadName: 'NH-66 Coastal Expressway (Udupi - Murudeshwar - Gokarna)',
          mountainAdvisory: 'Scenic Arabian sea views • Coastal sea breeze • High humidity and afternoon tropical showers',
          recommendedPoiIds: ['poi-udupi-krishna', 'poi-murudeshwar', 'poi-gokarna-om-beach', 'poi-jog-falls'],
          suggestedPresetId: 'circuit-karavali-malnad-coast',
          primaryHighwayNumber: 'NH-66',
        },
      ],
    };
  }
  if (originId === 'origin-mysuru') {
    return {
      corridorTitle: 'Old Mysuru & Nilgiri Foothills Wildlife Corridor',
      roadName: 'Bengaluru-Mysuru Expressway (NH-275) & Ooty Highway (NH-766)',
      mountainAdvisory: 'Statutory wildlife night-driving ban on NH-766 through Bandipur 21:00 to 06:00 • Keep safe distance from wild elephant herds',
      recommendedPoiIds: ['poi-srirangapatna', 'poi-somnathpur-temple', 'poi-ranganathittu', 'poi-bandipur', 'poi-talakad-keerthinarayana'],
      suggestedPresetId: 'circuit-wildlife-royal-heritage',
      availableBranches: [
        {
          id: 'branch-mysuru-wildlife',
          label: '🐅 Bandipur & Kabini Safari Trail',
          corridorTitle: 'Old Mysuru & Nilgiri Foothills Wildlife Corridor',
          roadName: 'NH-766 Gundlupet Highway & Kabini Forest Road',
          mountainAdvisory: 'Statutory wildlife night-driving ban on NH-766 through Bandipur 21:00 to 06:00 • Keep safe distance from wild elephant herds',
          recommendedPoiIds: ['poi-srirangapatna', 'poi-somnathpur-temple', 'poi-ranganathittu', 'poi-bandipur', 'poi-talakad-keerthinarayana'],
          suggestedPresetId: 'circuit-wildlife-royal-heritage',
          primaryHighwayNumber: 'NH-766',
        },
        {
          id: 'branch-mysuru-coorg',
          label: '☕ Hunsur to Coorg Coffee Valley',
          corridorTitle: 'Mysuru to Kodagu Cloud Hills Corridor',
          roadName: 'NH-275 Bilikere-Hunsur-Madikeri Road',
          mountainAdvisory: 'Estate curve bends • Foggy mornings in Madikeri • Elephants near Dubare crossing zone',
          recommendedPoiIds: ['poi-srirangapatna', 'poi-mysore-palace', 'poi-dubare-elephant-camp', 'poi-coorg-raja-seat'],
          suggestedPresetId: 'circuit-royal-mysuru-coorg',
          primaryHighwayNumber: 'NH-275',
        },
      ],
    };
  }
  if (originId === 'origin-shivamogga') {
    return {
      corridorTitle: 'Central Malnad Forest & Waterfall Circuit',
      roadName: 'NH-169 & Tarikere-Kemmangundi Mountain Pass',
      mountainAdvisory: 'Lush evergreen canopy • Winding curves around Bhadra reservoir • Kalhatti cascade directly crosses temple rocks',
      recommendedPoiIds: ['poi-kallathigiri-falls', 'poi-z-point-kemmangundi', 'poi-bhadra-wildlife', 'poi-sringeri-sharada-peetham'],
      suggestedPresetId: 'circuit-grand-hoysala-heritage',
    };
  }
  if (originId === 'origin-hubballi' || originId === 'origin-belagavi' || originId === 'origin-vijayapura' || originId === 'origin-hampi') {
    return {
      corridorTitle: 'Deccan Chalukya & Adil Shahi Heritage Corridor',
      roadName: 'NH-50 & NH-218 Heritage Golden Quadrangle',
      mountainAdvisory: 'Smooth high-speed North Karnataka expressway • High midday sun; early morning monument exploration recommended',
      recommendedPoiIds: ['poi-badami-caves', 'poi-banashankari', 'poi-pattadakal-unesco', 'poi-kudalasangama', 'poi-ibrahim-rouza'],
      suggestedPresetId: 'circuit-unesco-empire-trail',
    };
  }
  if (originId === 'origin-madikeri') {
    return {
      corridorTitle: 'Kodagu Coffee Hills & Pushpagiri Sanctuary Corridor',
      roadName: 'SH-88 Madikeri-Somwarpet & Sampaje Ghat (NH-275)',
      mountainAdvisory: 'Narrow estate roads with blind corners • 4x4 jeep required for Mandalpatti summit • Night forest restrictions apply',
      recommendedPoiIds: ['poi-omkareshwara-madikeri', 'poi-mandalpatti', 'poi-chelavara-falls', 'poi-talakaveri', 'poi-dubare-elephant-camp'],
      suggestedPresetId: 'circuit-royal-mysuru-coorg',
    };
  }
  // Default: Bengaluru Gateway with 3 high-impact scenic corridors
  return {
    corridorTitle: 'Bengaluru Gateway to Karnataka Scenic Corridors',
    roadName: 'NH-75 Hassan Express / NH-275 Mysuru Expressway',
    mountainAdvisory: 'Access-controlled multi-lane highway • Fast corridor connections to Malnad, Heritage & Coastal routes',
    recommendedPoiIds: ['poi-shravanabelagola', 'poi-belur-halebidu', 'poi-mullayanagiri', 'poi-mysore-palace'],
    suggestedPresetId: 'circuit-grand-hoysala-heritage',
    availableBranches: [
      {
        id: 'branch-bengaluru-hassan-malnad',
        label: '⛰️ NH-75 Malnad & Hoysala Ridge',
        corridorTitle: 'NH-75 Hassan Express & Malnad Heritage Ridge',
        roadName: 'NH-75 Hassan 4-Lane Tollway & Kaimara Mountain Pass',
        mountainAdvisory: 'Fast 4-lane access highway to Hassan • Ascent from 800m to 1,930m summit • 18 Hairpins beyond Kaimara Checkpost',
        recommendedPoiIds: [
          'poi-shravanabelagola',
          'poi-belur-halebidu',
          'poi-mullayanagiri',
          'poi-hirekolale-lake',
        ],
        suggestedPresetId: 'circuit-grand-hoysala-heritage',
        primaryHighwayNumber: 'NH-75',
      },
      {
        id: 'branch-bengaluru-mysuru-coorg',
        label: '👑 NH-275 Mysuru Expressway & Coorg',
        corridorTitle: 'NH-275 Mysuru 10-Lane Expressway & Nilgiri Foothills',
        roadName: 'NH-275 Access-Controlled Expressway & NH-766',
        mountainAdvisory: '75-min high-speed expressway to Mysuru • Wildlife night curfew (21:00–06:00) on Bandipur NH-766',
        recommendedPoiIds: [
          'poi-srirangapatna',
          'poi-mysore-palace',
          'poi-kabini-nagarhole',
          'poi-coorg-raja-seat',
        ],
        suggestedPresetId: 'circuit-royal-mysuru-coorg',
        primaryHighwayNumber: 'NH-275',
      },
      {
        id: 'branch-bengaluru-deccan-unesco',
        label: '🏛️ NH-48/50 Deccan UNESCO Trail',
        corridorTitle: 'Deccan Chalukya & Vijayanagara UNESCO Empire Corridor',
        roadName: 'NH-48 Golden Quadrangle & NH-50 Solapur Express',
        mountainAdvisory: 'High-speed 6-lane express corridor • High midday sun on Deccan plateau • Early morning exploration advised',
        recommendedPoiIds: [
          'poi-chitradurga-fort',
          'poi-hampi-stone-chariot',
          'poi-badami-caves',
          'poi-pattadakal-unesco',
        ],
        suggestedPresetId: 'circuit-unesco-hampi-badami',
        primaryHighwayNumber: 'NH-48 / NH-50',
      },
    ],
  };
}
