/**
 * @file src/intelligence/sourceRegistry.ts
 * @description Unified source registry with strict provenance metadata for all YatriKa external data.
 * @theme Code. Create. Celebrate Kannada.
 */

export type DataReliabilityClass =
  | 'official_government'
  | 'statutory_authority'
  | 'open_scientific_api'
  | 'verified_academic_epigraphy'
  | 'transport_operator_feed'
  | 'community_osm'
  | 'inferred_model';

export type InformationCategory =
  | 'weather'
  | 'road_condition'
  | 'destination_info'
  | 'opening_hours'
  | 'transport_schedule'
  | 'train_info'
  | 'travel_advisory'
  | 'heritage_epigraphy';

export interface DataSourceMetadata {
  sourceId: string;
  organization: string;
  category: InformationCategory;
  reliabilityClass: DataReliabilityClass;
  coverageScope: string;
  defaultValidityMinutes: number;
  officialPortalUrl: string;
  attributionText: string;
  usageRestrictions: string;
}

export const UNIFIED_SOURCE_REGISTRY: Record<string, DataSourceMetadata> = {
  'src-open-meteo': {
    sourceId: 'src-open-meteo',
    organization: 'Open-Meteo European Weather Model Ensemble',
    category: 'weather',
    reliabilityClass: 'open_scientific_api',
    coverageScope: 'Pan-Karnataka 0.1° High-Resolution Grid',
    defaultValidityMinutes: 30,
    officialPortalUrl: 'https://open-meteo.com/',
    attributionText: 'Weather data powered by Open-Meteo high-resolution atmospheric models under CC-BY 4.0.',
    usageRestrictions: 'Non-authoritative micro-climate forecast. Not a statutory disaster warning.',
  },
  'src-imd-bengaluru': {
    sourceId: 'src-imd-bengaluru',
    organization: 'India Meteorological Department (IMD) Meteorological Centre Bengaluru',
    category: 'weather',
    reliabilityClass: 'official_government',
    coverageScope: 'All 31 Karnataka Districts Weather Bulletins',
    defaultValidityMinutes: 180,
    officialPortalUrl: 'https://mausam.imd.gov.in/bengaluru/',
    attributionText: 'Statutory weather bulletins & radar observations from IMD Bengaluru.',
    usageRestrictions: 'Official government alerts for heavy rainfall, cyclones, and ghat squalls.',
  },
  'src-karnataka-pwd': {
    sourceId: 'src-karnataka-pwd',
    organization: 'Public Works Department (PWD), Government of Karnataka',
    category: 'road_condition',
    reliabilityClass: 'official_government',
    coverageScope: 'State Highways and Major District Roads across Karnataka',
    defaultValidityMinutes: 120,
    officialPortalUrl: 'https://kpwd.karnataka.gov.in/',
    attributionText: 'PWD Karnataka official ghat maintenance notifications and bridge advisories.',
    usageRestrictions: 'Official status of state highway blockages and seasonal diversions.',
  },
  'src-nhai-karnataka': {
    sourceId: 'src-nhai-karnataka',
    organization: 'National Highways Authority of India (NHAI) RO Bengaluru',
    category: 'road_condition',
    reliabilityClass: 'official_government',
    coverageScope: 'NH-75, NH-66, NH-48, NH-275, NH-50 Corridors',
    defaultValidityMinutes: 120,
    officialPortalUrl: 'https://nhai.gov.in/',
    attributionText: 'NHAI official highway notifications and toll plaza advisories.',
    usageRestrictions: 'Authoritative data for National Highway corridors.',
  },
  'src-ksrtc-official': {
    sourceId: 'src-ksrtc-official',
    organization: 'Karnataka State Road Transport Corporation (KSRTC)',
    category: 'transport_schedule',
    reliabilityClass: 'transport_operator_feed',
    coverageScope: 'Airavat, Ambari Utsav, Rajahamsa, Karnataka Sarige across all divisions',
    defaultValidityMinutes: 360,
    officialPortalUrl: 'https://ksrtc.in/',
    attributionText: 'KSRTC published timetables, Shakti Scheme guidelines, and Awatar booking hand-offs.',
    usageRestrictions: 'Timetable data verified against official seasonal schedules; live seat status requires operator booking portal.',
  },
  'src-swr-ntes': {
    sourceId: 'src-swr-ntes',
    organization: 'South Western Railway (SWR) / National Train Enquiry System (NTES)',
    category: 'train_info',
    reliabilityClass: 'transport_operator_feed',
    coverageScope: 'Hubballi, Mysuru, and Bengaluru Divisions',
    defaultValidityMinutes: 240,
    officialPortalUrl: 'https://enquiry.indianrail.gov.in/',
    attributionText: 'SWR published timetables and Western Ghat Vistadome schedules.',
    usageRestrictions: 'Indian Railways public timetable information; live running status linked to NTES.',
  },
  'src-kstdc-tourism': {
    sourceId: 'src-kstdc-tourism',
    organization: 'Department of Tourism, Government of Karnataka / KSTDC',
    category: 'destination_info',
    reliabilityClass: 'official_government',
    coverageScope: 'Karnataka Registered Heritage & Nature Destinations',
    defaultValidityMinutes: 1440,
    officialPortalUrl: 'https://karnatakatourism.org/',
    attributionText: 'Karnataka Tourism official destination guides and verified entry points.',
    usageRestrictions: 'Official tourist facilitation data.',
  },
  'src-asi-bengaluru-dharwad': {
    sourceId: 'src-asi-bengaluru-dharwad',
    organization: 'Archaeological Survey of India (ASI) Bengaluru & Dharwad Circles',
    category: 'opening_hours',
    reliabilityClass: 'statutory_authority',
    coverageScope: 'Centrally Protected Monuments (Hampi, Pattadakal, Badami, Belur, Halebidu)',
    defaultValidityMinutes: 1440,
    officialPortalUrl: 'https://asibengalurucircle.in/',
    attributionText: 'ASI statutory monument timings, ticketing categories, and heritage rules.',
    usageRestrictions: 'Governed by AMASR Act 1958.',
  },
  'src-ksdma-advisory': {
    sourceId: 'src-ksdma-advisory',
    organization: 'Karnataka State Disaster Management Authority (KSDMA)',
    category: 'travel_advisory',
    reliabilityClass: 'official_government',
    coverageScope: 'All 31 Karnataka Districts Disaster & Flood Alerts',
    defaultValidityMinutes: 60,
    officialPortalUrl: 'https://ksdma.karnataka.gov.in/',
    attributionText: 'KSDMA official alerts, District Disaster Management Authorities (DDMA) notifications.',
    usageRestrictions: 'Life-safety authoritative emergency communications.',
  },
  'src-epigraphy-karnatica': {
    sourceId: 'src-epigraphy-karnatica',
    organization: 'Epigraphia Carnatica / Kannada Sahitya Parishat / Mysore Archeological Series',
    category: 'heritage_epigraphy',
    reliabilityClass: 'verified_academic_epigraphy',
    coverageScope: 'Halmidi, Kavirajamarga, Badami Inscriptions, Hoysala Sasana records',
    defaultValidityMinutes: 525600, // Permanent historical record
    officialPortalUrl: 'https://kannadasahithyaparishathu.karnataka.gov.in/',
    attributionText: 'Verified academic epigraphy from B.L. Rice, Fleet, and Kannada University Hampi scholarly archives.',
    usageRestrictions: 'Scholarly linguistic and historical reference.',
  },
};

export function getSourceMetadata(sourceId: string): DataSourceMetadata {
  return (
    UNIFIED_SOURCE_REGISTRY[sourceId] ?? {
      sourceId,
      organization: 'External Community or Inferred Service',
      category: 'destination_info',
      reliabilityClass: 'inferred_model',
      coverageScope: 'Unspecified',
      defaultValidityMinutes: 60,
      officialPortalUrl: '',
      attributionText: 'Information derived from secondary or algorithmic heuristics.',
      usageRestrictions: 'Use with traveler discretion; verify with local authorities.',
    }
  );
}
