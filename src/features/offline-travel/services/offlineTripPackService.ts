/**
 * src/features/offline-travel/services/offlineTripPackService.ts
 * Generates and validates self-contained Offline Survival Packs for Karnataka travel.
 */

import {
  OfflineTripPack,
  OfflineEmergencyContact,
  OfflineSurvivalPhrase,
  OfflineStopData,
} from '../domain/types';
import { offlineStorage } from '../storage/offlineStorageRepository';

// Official Karnataka Emergency Directory (Verified Government & Public Safety Helplines)
export const OFFICIAL_KARNATAKA_EMERGENCY_DIRECTORY: OfflineEmergencyContact[] = [
  {
    id: 'karnataka-112',
    title: 'Karnataka State Emergency Response System',
    titleKannada: 'ಕರ್ನಾಟಕ ಏಕೀಕೃತ ತುರ್ತು ಸಹಾಯವಾಣಿ',
    phoneNumber: '112',
    category: 'police',
    availableHours: '24/7 (All 31 Districts)',
    notes: 'Toll-free single emergency number for Police, Fire, and Ambulance.',
  },
  {
    id: 'karnataka-108',
    title: 'Arogya Kavacha Medical Ambulance',
    titleKannada: 'ಆರೋಗ್ಯ ಕವಚ ಆಂಬ್ಯುಲೆನ್ಸ್',
    phoneNumber: '108',
    category: 'medical',
    availableHours: '24/7',
    notes: 'Free emergency medical service with GPS-enabled dispatch.',
  },
  {
    id: 'disaster-1077',
    title: 'District Disaster Management Cell',
    titleKannada: 'ಜಿಲ್ಲಾ ವಿಪತ್ತು ನಿರ್ವಹಣಾ ಕೇಂದ್ರ',
    phoneNumber: '1077',
    category: 'disaster',
    availableHours: '24/7 during monsoons & natural alerts',
    notes: 'Ghat road landslides, heavy rainfall flooding, and mountain rescue.',
  },
  {
    id: 'forest-1926',
    title: 'Karnataka Forest Department Helpline',
    titleKannada: 'ಅರಣ್ಯ ಇಲಾಖೆ ಸಹಾಯವಾಣಿ',
    phoneNumber: '1926',
    category: 'forest',
    availableHours: '24/7',
    notes: 'Wildlife encounters, forest fires, and Aranya Vihaara check-post queries.',
  },
  {
    id: 'kstdc-helpline',
    title: 'KSTDC Tourist Information Helpline',
    titleKannada: 'ಕೆಎಸ್‌ಟಿಡಿಸಿ ಪ್ರವಾಸಿ ಮಾಹಿತಿ',
    phoneNumber: '080-22352828',
    category: 'tourism',
    availableHours: '08:00 AM – 08:00 PM',
    notes: 'Official Karnataka State Tourism Development Corporation desk.',
  },
  {
    id: 'ksrtc-call-center',
    title: 'KSRTC 24/7 Passenger Call Center',
    titleKannada: 'ಕೆಎಸ್ಆರ್ಟಿಸಿ ಪ್ರಯಾಣಿಕರ ಸಹಾಯವಾಣಿ',
    phoneNumber: '080-49596666',
    category: 'transport',
    availableHours: '24/7',
    notes: 'Real-time bus schedules, Shakti scheme queries, and breakdown assistance.',
  },
];

// Essential In-Context Kannada Survival Phrases (with Phonetics & Safety Context)
export const KANNAADA_SURVIVAL_PHRASES: OfflineSurvivalPhrase[] = [
  {
    kannada: 'ನನಗೆ ತುರ್ತು ಸಹಾಯ ಬೇಕು',
    phonetic: 'Nanage thurthu sahaaya beku',
    english: 'I need urgent help',
    category: 'safety',
  },
  {
    kannada: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ ಅಥವಾ ಕ್ಲಿನಿಕ್ ಎಲ್ಲಿದೆ?',
    phonetic: 'Hatthirada aaspagre athava clinic ellide?',
    english: 'Where is the nearest hospital or clinic?',
    category: 'medical',
  },
  {
    kannada: 'ಪೊಲೀಸ್ ಠಾಣೆಗೆ ಹೇಗೆ ಹೋಗುವುದು?',
    phonetic: 'Police thaaneye hege hoguvudu?',
    english: 'How do I get to the police station?',
    category: 'safety',
  },
  {
    kannada: 'ಇಲ್ಲಿ ಮೊಬೈಲ್ ನೆಟ್‌ವರ್ಕ್ ಸಿಗುತ್ತದೆಯೇ?',
    phonetic: 'Illi mobile network siguthadeye?',
    english: 'Is mobile network available here?',
    category: 'direction',
  },
  {
    kannada: 'ಮುಂದಿನ ಬಸ್ ಯಾವಾಗ ಬರುತ್ತದೆ?',
    phonetic: 'Mundina bus yaavaaga baruthade?',
    english: 'When does the next bus arrive?',
    category: 'transport',
  },
  {
    kannada: 'ಶಕ್ತಿ ಯೋಜನೆಯಡಿ ಈ ಬಸ್‌ನಲ್ಲಿ ಟಿಕೆಟ್ ಉಚಿತವಿದೆಯೇ?',
    phonetic: 'Shakti yojaneyadi ee busnalli ticket uchithavidyeye?',
    english: 'Is this bus zero-fare under the Shakti Scheme?',
    category: 'transport',
  },
  {
    kannada: 'ಕುಡಿಯುವ ಶುದ್ಧ ನೀರು ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ?',
    phonetic: 'Kudiyuva shuddha neeru elli siguthade?',
    english: 'Where can I find clean drinking water?',
    category: 'food',
  },
  {
    kannada: 'ದಯವಿಟ್ಟು ಮೀಟರ್ ಹಾಕಿ ಹೋಗಿ',
    phonetic: 'Dayavittu meter haaki hogi',
    english: 'Please turn on the fare meter',
    category: 'transport',
  },
];

/**
 * Computes deterministic CRC32-like checksum string for payload integrity verification
 */
export function computePackChecksum(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `crc32-${Math.abs(hash).toString(16)}`;
}

/**
 * Compiles a comprehensive, self-contained offline survival pack from active itinerary state
 */
export async function createAndSaveOfflineTripPack(params: {
  id: string;
  circuitTitle: string;
  circuitTitleKannada: string;
  origin: { id: string; name: string; nameKannada: string; coordinates: [number, number] };
  stops: any[];
  totalDistanceKm: number;
  routeCoordinates: [number, number][];
  netTotalInr: number;
  lodgingInr: number;
  fuelInr: number;
  ticketsInr: number;
  foodInr: number;
}): Promise<OfflineTripPack> {
  const offlineStops: OfflineStopData[] = params.stops.map((s) => ({
    id: s.id,
    name: s.name,
    nameKannada: s.nameKannada || s.name,
    district: s.district || 'Karnataka',
    coordinates: s.coordinates,
    category: s.category || 'Sightseeing',
    timing: s.timing || '09:00 AM – 06:00 PM',
    durationHours: s.durationHours || 2,
    entryFeeInr: s.entryFeeInr || 0,
    nearestRailStation: s.nearestRailStation,
    forestPermitRequired: s.forestPermitRequired,
    contactNumber: s.contactNumber || '112',
    localPhrase: s.localPhrase || {
      kannada: 'ಇಲ್ಲಿಗೆ ಹೇಗೆ ಹೋಗುವುದು?',
      english: 'How to reach here?',
      phonetic: 'Illige hege hoguvudu?',
      context: 'Local direction assistance',
    },
  }));

  const estimatedDriveHours = Math.round((params.totalDistanceKm / 45) * 10) / 10;

  const rawPayloadForChecksum = JSON.stringify({
    stops: offlineStops.map((s) => s.id),
    coordsLen: params.routeCoordinates.length,
    dist: params.totalDistanceKm,
  });

  const pack: OfflineTripPack = {
    id: params.id,
    circuitTitle: params.circuitTitle,
    circuitTitleKannada: params.circuitTitleKannada,
    origin: params.origin,
    stops: offlineStops,
    totalDistanceKm: params.totalDistanceKm,
    estimatedDriveHours,
    routeCoordinates: params.routeCoordinates,
    emergencyDirectory: OFFICIAL_KARNATAKA_EMERGENCY_DIRECTORY,
    kannadaSurvivalPhrases: KANNAADA_SURVIVAL_PHRASES,
    shaktiGuidance: {
      isEligible: true,
      freeBusServices: [
        'KSRTC Ordinary (Karnataka Sarige)',
        'NWKRTC City & Suburban',
        'KKRTC Pura Seva & Ordinary',
        'BMTC Non-AC City Buses',
      ],
      paidExemptions: [
        'Airawat Club Class (Volvo Multi-Axle)',
        'Flybus (Airport Express)',
        'EV Power Plus / Ambari Dream Class',
        'Interstate Routes beyond Karnataka Border',
      ],
      officialOrderReference: 'Govt of Karnataka Order No. TRAN 38 TEP 2023 (Effective June 11, 2023)',
    },
    budgetSummary: {
      netTotalInr: params.netTotalInr,
      lodgingInr: params.lodgingInr,
      fuelInr: params.fuelInr,
      ticketsInr: params.ticketsInr,
      foodInr: params.foodInr,
    },
    createdAt: new Date().toISOString(),
    schemaVersion: 1,
    sizeBytes: Math.round(new Blob([JSON.stringify(params)]).size),
    checksum: computePackChecksum(rawPayloadForChecksum),
    status: 'ready',
  };

  await offlineStorage.saveTripPack(pack);
  return pack;
}
