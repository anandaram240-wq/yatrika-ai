// src/data/safetyAndWeatherRegistry.ts

export type SafetyMapClassification =
  | 'ACTIVE_OFFICIAL_ADVISORY'
  | 'HISTORICAL_INCIDENT'
  | 'TERRAIN_PRECAUTION'
  | 'WILDLIFE_PRECAUTION'
  | 'WATER_HAZARD'
  | 'TEMPORARY_CLOSURE'
  | 'UNVERIFIED_REPORT'
  | 'EXPIRED_ADVISORY';

export interface SafetyEvidenceRecord {
  id: string;
  destinationId: string;
  classification: SafetyMapClassification;
  badgeSymbol: string; // Never rely on colour alone (WCAG 2.2 AA)
  severityTone: 'RED_ACTIVE' | 'AMBER_CAUTION' | 'BLUE_WATER_WEATHER' | 'NEUTRAL_HISTORICAL';
  title: string;
  locationName: string;
  coordinates: [number, number];
  locationAccuracy: 'EXACT_LANDMARK' | 'REPORTED_LOCALITY_CORRIDOR' | 'RIVER_REACH';
  dateOfIncidentOrEvent: string;
  publicationDate: string;
  responsibleAuthority: string;
  sourceClassification: 'OFFICIAL_AUTHORITY_ADVISORY' | 'DOCUMENTED_NEWS_RECORD';
  sourceUrls: { label: string; url: string }[];
  validFrom: string;
  validUntil: string;
  currentStatus: 'HISTORICAL_AWARENESS_CONTEXT' | 'ACTIVE_SEASONAL_MONITORING';
  lastVerificationDate: string;
  summaryWhatHappened: string;
  recommendedPrecautions: string[];
  emergencyContact: {
    nationalErssNumber: '112';
    erssUrl: 'https://112.gov.in/';
    localAuthorityNote: string;
  };
}

export const HAMPI_SAFETY_EVIDENCE_RECORDS: SafetyEvidenceRecord[] = [
  {
    id: 'hampi-safety-matanga-hill-2025-06-09',
    destinationId: 'hampi',
    classification: 'TERRAIN_PRECAUTION',
    badgeSymbol: '[▲ TERRAIN CAUTION / HISTORICAL RESCUE]',
    severityTone: 'AMBER_CAUTION',
    title: 'Matanga Hill Boulder & Crevice Trekking Precaution',
    locationName: 'Matanga Hill Summit & Cave Crevice Approaches, Hampi',
    coordinates: [76.4660, 15.3320],
    locationAccuracy: 'EXACT_LANDMARK',
    dateOfIncidentOrEvent: '2025-06-09',
    publicationDate: '2025-06-09',
    responsibleAuthority: 'Vijayanagara District Police & Fire/Emergency Rescue Services',
    sourceClassification: 'DOCUMENTED_NEWS_RECORD',
    sourceUrls: [
      {
        label: 'The New Indian Express (9 June 2025): Teen rescued after falling into Hampi Matanga Hill cave',
        url: 'https://www.newindianexpress.com/states/karnataka/2025/Jun/09/teen-rescued-after-falling-into-hampis-matanga-hill-cave',
      },
    ],
    validFrom: '2025-06-09',
    validUntil: 'Permanent Terrain Precaution',
    currentStatus: 'HISTORICAL_AWARENESS_CONTEXT',
    lastVerificationDate: '2026-10-24',
    summaryWhatHappened:
      'On 9 June 2025, a 16-year-old tourist trekking alone fell into a narrow boulder cave crevice on Matanga Hill and was trapped for several hours before being rescued by local police and rescue personnel.',
    recommendedPrecautions: [
      'Rocky terrain and cave or crevice hazards have been reported. Avoid trekking alone.',
      'Stay on established stone-stepped routes (such as the eastern Hampi Bazaar / Eduru Basavanna steps) and inform a trusted person or local authority about your plan.',
      'Mobile coverage may be limited inside deep boulder fissures on parts of the hill.',
      'Descend before sunset as there is no artificial trail lighting.',
    ],
    emergencyContact: {
      nationalErssNumber: '112',
      erssUrl: 'https://112.gov.in/',
      localAuthorityNote: 'Hampi Tourism Police Station & Kamalapura Police Station',
    },
  },
  {
    id: 'hampi-safety-sanapur-canal-2025-03-06',
    destinationId: 'hampi',
    classification: 'HISTORICAL_INCIDENT',
    badgeSymbol: '[◆ ISOLATED NIGHT CORRIDOR PRECAUTION]',
    severityTone: 'AMBER_CAUTION',
    title: 'Sanapur / Tungabhadra Left Bank Canal Nighttime Isolation Precaution',
    locationName: 'Tungabhadra Left Bank Canal Bank near Sanapur (North Bank / Anegundi Corridor)',
    coordinates: [76.4420, 15.3615],
    locationAccuracy: 'REPORTED_LOCALITY_CORRIDOR',
    dateOfIncidentOrEvent: '2025-03-06',
    publicationDate: '2025-03-08 (Conviction reported February 2026)',
    responsibleAuthority: 'Koppal / Gangavathi Rural Police & District Judiciary',
    sourceClassification: 'DOCUMENTED_NEWS_RECORD',
    sourceUrls: [
      {
        label: 'The Indian Express: Incident report near Tungabhadra Canal, Sanapur',
        url: 'https://indianexpress.com/article/cities/bangalore/karnataka-rape-hampi-anegundi-police-israeli-tourist-tungabhadra-canal-9875258/',
      },
      {
        label: 'The News Minute (Feb 2026): Three men convicted in Hampi Sanapur case',
        url: 'https://www.thenewsminute.com/karnataka/karnataka-three-men-convicted-in-hampi-gangrape-murder',
      },
    ],
    validFrom: '2025-03-06',
    validUntil: 'Historical Awareness Context',
    currentStatus: 'HISTORICAL_AWARENESS_CONTEXT',
    lastVerificationDate: '2026-10-24',
    summaryWhatHappened:
      'On the night of 6 March 2025, a serious violent criminal incident occurred along an isolated stretch of the Tungabhadra Left Bank Canal near Sanapur involving assault, sexual violence, and a tourist drowning. A court conviction of the three accused was subsequently reported in February 2026.',
    recommendedPrecautions: [
      'Avoid isolated waterways, canal banks, and poorly populated rural stretches after dark.',
      'Use established, verified transport and registered accommodation providers.',
      'Avoid travelling alone to unlit areas at night.',
      'Check current local police patrol advice and share your live itinerary with a trusted contact.',
    ],
    emergencyContact: {
      nationalErssNumber: '112',
      erssUrl: 'https://112.gov.in/',
      localAuthorityNote: 'Gangavathi Rural Police Station (North Bank) / Hampi Police Station (South Bank)',
    },
  },
  {
    id: 'hampi-safety-tungabhadra-flooding-2024-07-31',
    destinationId: 'hampi',
    classification: 'WATER_HAZARD',
    badgeSymbol: '[≈ SEASONAL RESERVOIR & RIVER HAZARD]',
    severityTone: 'BLUE_WATER_WEATHER',
    title: 'Tungabhadra Dam Spillway Release & Seasonal Riverbank Submergence Context',
    locationName: 'Tungabhadra River Gorge, Purandaradasa Mandapa & Chakratirtha Riverfront',
    coordinates: [76.4648, 15.3372],
    locationAccuracy: 'RIVER_REACH',
    dateOfIncidentOrEvent: '2024-07-31',
    publicationDate: '2024-07-31',
    responsibleAuthority: 'Tungabhadra Board (TB Dam) & Vijayanagara District Disaster Management Authority',
    sourceClassification: 'DOCUMENTED_NEWS_RECORD',
    sourceUrls: [
      {
        label: 'The New Indian Express (31 July 2024): Monuments along Tungabhadra submerge during heavy dam discharge',
        url: 'https://www.newindianexpress.com/states/karnataka/2024/Jul/31/atleast-12-monuments-in-hampi-submerge-amidst-heavy-rains',
      },
    ],
    validFrom: 'Monsoon Spillway Release Windows (July–September)',
    validUntil: 'Historical Seasonal Context (2024 flood warning is NOT active in Nov 2026)',
    currentStatus: 'HISTORICAL_AWARENESS_CONTEXT',
    lastVerificationDate: '2026-10-24',
    summaryWhatHappened:
      'In late July 2024, heavy monsoon inflows into the Tungabhadra Reservoir in Hosapete required large spillway discharges (>1 lakh cusecs), temporarily submerging low-lying riverbank monuments (such as Purandaradasa Mandapa and steps near Kodandarama Temple) and halting coracle/ferry crossings.',
    recommendedPrecautions: [
      'This July 2024 event is displayed as seasonal hydrological context, not an active flood closure today.',
      'During monsoon months or upstream heavy rainfall, always verify current Tungabhadra Dam outflow advisories before approaching river steps.',
      'Never enter the Tungabhadra River for swimming due to submerged boulder undercurrents and crocodile habitat.',
    ],
    emergencyContact: {
      nationalErssNumber: '112',
      erssUrl: 'https://112.gov.in/',
      localAuthorityNote: 'Vijayanagara District Emergency Operating Centre (DEOC)',
    },
  },
];
