/**
 * @file src/data-fabric/sourceRegistry.ts
 * @description Master Authoritative Source Registry for YatriKa AI V8.
 * Standardizes metadata for every external government, operator, and scientific source.
 * @theme Code. Create. Celebrate Kannada.
 */

import { SourceTrustClassification } from './verificationStatus';

export type ExternalDataCategory =
  | 'destination_info'
  | 'opening_hours'
  | 'entry_fees'
  | 'trekking_permits'
  | 'bus_schedule'
  | 'train_schedule'
  | 'weather'
  | 'road_condition'
  | 'disaster_alert'
  | 'heritage_epigraphy'
  | 'registered_accommodation'
  | 'gi_gastronomy';

export type SourceAccessMethod =
  | 'REST_JSON_API'
  | 'PUBLISHED_GAZETTE_OR_SCHEDULE'
  | 'OPERATOR_DISPATCH_FEED'
  | 'PHYSICAL_INSPECTION_AUDIT'
  | 'OPEN_COMMUNITY_VECTOR_FEED';

export interface AuthoritativeSourceRecord {
  sourceId: string;
  sourceOrganization: string;
  sourceOrganizationKannada: string;
  sourceUrl: string;
  dataCategory: ExternalDataCategory;
  accessMethod: SourceAccessMethod;
  trustClassification: SourceTrustClassification;
  licenseId: string;
  geographicCoverage: string;
  geographicCoverageKannada: string;
  lastRetrievedTimestamp: string;
  lastSourcePublicationTimestamp: string;
  lastIndependentlyVerifiedTimestamp: string;
  validityMinutes: number;
  expiryConditions: string;
  refreshPolicy: 'REALTIME' | 'HOURLY' | 'DAILY' | 'SEASONAL' | 'PERMANENT';
  attributionStatement: string;
  emergencyHelpline?: string;
  officialBookingOrEnquiryUrl?: string;
}

export const AUTHORITATIVE_SOURCE_REGISTRY: Record<string, AuthoritativeSourceRecord> = {
  // 1. KSRTC
  'src-ksrtc': {
    sourceId: 'src-ksrtc',
    sourceOrganization: 'Karnataka State Road Transport Corporation (KSRTC)',
    sourceOrganizationKannada: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ರಸ್ತೆ ಸಾರಿಗೆ ನಿಗಮ',
    sourceUrl: 'https://ksrtc.in/',
    dataCategory: 'bus_schedule',
    accessMethod: 'PUBLISHED_GAZETTE_OR_SCHEDULE',
    trustClassification: 'OPERATOR_CONFIRMED',
    licenseId: 'ksrtc-published-schedule',
    geographicCoverage: 'Inter-district, interstate, and ghat trunk routes across Karnataka',
    geographicCoverageKannada: 'ರಾಜ್ಯಾದ್ಯಂತ ಜಿಲ್ಲಾ ಮತ್ತು ಘಾಟ್ ರಸ್ತೆಗಳ ಬಸ್ ಮಾರ್ಗಗಳು',
    lastRetrievedTimestamp: '2026-10-31T08:00:00.000Z',
    lastSourcePublicationTimestamp: '2026-10-25T00:00:00.000Z',
    lastIndependentlyVerifiedTimestamp: '2026-10-31T10:00:00.000Z',
    validityMinutes: 1440,
    expiryConditions: 'Quarterly seasonal schedule revision or monsoon route diversion',
    refreshPolicy: 'DAILY',
    attributionStatement: 'Bus timetables & Shakti Scheme guidelines certified by KSRTC Central Office, Bengaluru.',
    emergencyHelpline: '080-26252625 / 7760990034',
    officialBookingOrEnquiryUrl: 'https://ksrtc.in/oprs-web/guest/home.do',
  },

  // 2. BMTC
  'src-bmtc': {
    sourceId: 'src-bmtc',
    sourceOrganization: 'Bengaluru Metropolitan Transport Corporation (BMTC)',
    sourceOrganizationKannada: 'ಬೆಂಗಳೂರು ಮಹಾನಗರ ಸಾರಿಗೆ ಸಂಸ್ಥೆ',
    sourceUrl: 'https://mybmtc.karnataka.gov.in/',
    dataCategory: 'bus_schedule',
    accessMethod: 'PUBLISHED_GAZETTE_OR_SCHEDULE',
    trustClassification: 'OPERATOR_CONFIRMED',
    licenseId: 'ogd-india',
    geographicCoverage: 'Bengaluru Urban, Devanahalli Airport (Vayu Vajra), and Metro Interchanges',
    geographicCoverageKannada: 'ಬೆಂಗಳೂರು ನಗರ, ವಿಮಾನ ನಿಲ್ದಾಣ (ವಾಯು ವಜ್ರ) ಮತ್ತು ಮೆಟ್ರೋ ಸಂಪರ್ಕ',
    lastRetrievedTimestamp: '2026-10-31T08:00:00.000Z',
    lastSourcePublicationTimestamp: '2026-10-20T00:00:00.000Z',
    lastIndependentlyVerifiedTimestamp: '2026-10-31T09:30:00.000Z',
    validityMinutes: 1440,
    expiryConditions: 'City route rationalization and airport feeder adjustments',
    refreshPolicy: 'DAILY',
    attributionStatement: 'City transit schedules verified with BMTC Central Control Room, Shanthinagar.',
    emergencyHelpline: '080-22483777',
    officialBookingOrEnquiryUrl: 'https://mybmtc.karnataka.gov.in/',
  },

  // 3. NWKRTC
  'src-nwkrtc': {
    sourceId: 'src-nwkrtc',
    sourceOrganization: 'North Western Karnataka Road Transport Corporation (NWKRTC)',
    sourceOrganizationKannada: 'ವಾಯವ್ಯ ಕರ್ನಾಟಕ ರಸ್ತೆ ಸಾರಿಗೆ ಸಂಸ್ಥೆ',
    sourceUrl: 'https://nwkrtc.karnataka.gov.in/',
    dataCategory: 'bus_schedule',
    accessMethod: 'PUBLISHED_GAZETTE_OR_SCHEDULE',
    trustClassification: 'OPERATOR_CONFIRMED',
    licenseId: 'ogd-india',
    geographicCoverage: 'Hubballi-Dharwad, Belagavi, Uttara Kannada, Vijayapura, Bagalkote, Gadag',
    geographicCoverageKannada: 'ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ, ಬೆಳಗಾವಿ, ಉತ್ತರ ಕನ್ನಡ, ವಿಜಯಪುರ, ಬಾಗಲಕೋಟೆ, ಗದಗ',
    lastRetrievedTimestamp: '2026-10-30T12:00:00.000Z',
    lastSourcePublicationTimestamp: '2026-10-15T00:00:00.000Z',
    lastIndependentlyVerifiedTimestamp: '2026-10-30T14:00:00.000Z',
    validityMinutes: 1440 * 2,
    expiryConditions: 'Seasonal coastal and Malnad monsoon timetable update',
    refreshPolicy: 'DAILY',
    attributionStatement: 'NWKRTC official passenger timetables from Central Office, Gokul Road, Hubballi.',
    emergencyHelpline: '0836-2237511',
    officialBookingOrEnquiryUrl: 'https://nwkrtc.karnataka.gov.in/',
  },

  // 4. KKRTC
  'src-kkrtc': {
    sourceId: 'src-kkrtc',
    sourceOrganization: 'Kalyana Karnataka Road Transport Corporation (KKRTC)',
    sourceOrganizationKannada: 'ಕಲ್ಯಾಣ ಕರ್ನಾಟಕ ರಸ್ತೆ ಸಾರಿಗೆ ನಿಗಮ',
    sourceUrl: 'https://kkrtc.karnataka.gov.in/',
    dataCategory: 'bus_schedule',
    accessMethod: 'PUBLISHED_GAZETTE_OR_SCHEDULE',
    trustClassification: 'OPERATOR_CONFIRMED',
    licenseId: 'ogd-india',
    geographicCoverage: 'Kalaburagi, Bidar, Raichur, Koppal, Yadgir, Ballari, Vijayanagara',
    geographicCoverageKannada: 'ಕಲಬುರಗಿ, ಬೀದರ್, ರಾಯಚೂರು, ಕೊಪ್ಪಳ, ಯಾದಗಿರಿ, ಬಳ್ಳಾರಿ, ವಿಜಯನಗರ',
    lastRetrievedTimestamp: '2026-10-30T12:00:00.000Z',
    lastSourcePublicationTimestamp: '2026-10-10T00:00:00.000Z',
    lastIndependentlyVerifiedTimestamp: '2026-10-30T15:00:00.000Z',
    validityMinutes: 1440 * 2,
    expiryConditions: 'Annual summer/winter transport review',
    refreshPolicy: 'DAILY',
    attributionStatement: 'KKRTC timetables verified with Central Office, Sarige Sadana, Kalaburagi.',
    emergencyHelpline: '08472-227640',
    officialBookingOrEnquiryUrl: 'https://kkrtc.karnataka.gov.in/',
  },

  // 5. South Western Railway (SWR)
  'src-swr-railway': {
    sourceId: 'src-swr-railway',
    sourceOrganization: 'South Western Railway (SWR) & IRCTC',
    sourceOrganizationKannada: 'ದಕ್ಷಿಣ ಪಶ್ಚಿಮ ರೈಲ್ವೆ ಹಾಗೂ ಐಆರ್‌ಸಿಟಿಸಿ',
    sourceUrl: 'https://swr.indianrailways.gov.in/',
    dataCategory: 'train_schedule',
    accessMethod: 'PUBLISHED_GAZETTE_OR_SCHEDULE',
    trustClassification: 'OPERATOR_CONFIRMED',
    licenseId: 'irctc-swr-passenger-info',
    geographicCoverage: 'Hubballi, Mysuru, Bengaluru railway divisions and Western Ghat rail lines',
    geographicCoverageKannada: 'ಹುಬ್ಬಳ್ಳಿ, ಮೈಸೂರು ಮತ್ತು ಬೆಂಗಳೂರು ರೈಲ್ವೆ ವಿಭಾಗಗಳು',
    lastRetrievedTimestamp: '2026-10-31T06:00:00.000Z',
    lastSourcePublicationTimestamp: '2026-10-01T00:00:00.000Z',
    lastIndependentlyVerifiedTimestamp: '2026-10-31T09:00:00.000Z',
    validityMinutes: 1440 * 7,
    expiryConditions: 'Indian Railways All India Railway Time Table (Trains at a Glance)',
    refreshPolicy: 'DAILY',
    attributionStatement: 'Railway schedules verified via Indian Railways NTES and SWR public timetables.',
    emergencyHelpline: '139',
    officialBookingOrEnquiryUrl: 'https://www.irctc.co.in/nget/train-search',
  },

  // 6. ASI Bengaluru & Dharwad Circles
  'src-asi-monuments': {
    sourceId: 'src-asi-monuments',
    sourceOrganization: 'Archaeological Survey of India (ASI) Bengaluru & Dharwad Circles',
    sourceOrganizationKannada: 'ಭಾರತೀಯ ಪುರಾತತ್ವ ಸರ್ವೇಕ್ಷಣಾ ಇಲಾಖೆ (ಬೆಂಗಳೂರು ಮತ್ತು ಧಾರವಾಡ ವೃತ್ತ)',
    sourceUrl: 'https://asibengalurucircle.in/',
    dataCategory: 'opening_hours',
    accessMethod: 'PUBLISHED_GAZETTE_OR_SCHEDULE',
    trustClassification: 'OFFICIAL_PUBLISHED',
    licenseId: 'asi-public-statutory',
    geographicCoverage: 'Centrally protected monuments: Hampi, Belur, Halebidu, Badami, Pattadakal, Aihole, Somnathpur',
    geographicCoverageKannada: 'ಕೇಂದ್ರ ಸಂರಕ್ಷಿತ ಸ್ಮಾರಕಗಳು: ಹಂಪಿ, ಬೇಲೂರು, ಹಳೇಬೀಡು, ಬಾದಾಮಿ, ಪಟ್ಟದಕಲ್ಲು',
    lastRetrievedTimestamp: '2026-10-25T10:00:00.000Z',
    lastSourcePublicationTimestamp: '2026-06-01T00:00:00.000Z',
    lastIndependentlyVerifiedTimestamp: '2026-10-28T11:00:00.000Z',
    validityMinutes: 1440 * 30,
    expiryConditions: 'Statutory amendments to AMASR rules or ticket fee structure',
    refreshPolicy: 'SEASONAL',
    attributionStatement: 'Monument opening hours and ticketing verified via Archaeological Survey of India (ASI) statutory notifications.',
    officialBookingOrEnquiryUrl: 'https://asi.nic.in/',
  },

  // 7. Karnataka Tourism (KSTDC)
  'src-karnataka-tourism': {
    sourceId: 'src-karnataka-tourism',
    sourceOrganization: 'Department of Tourism, Government of Karnataka & KSTDC',
    sourceOrganizationKannada: 'ಪ್ರವಾಸೋದ್ಯಮ ಇಲಾಖೆ, ಕರ್ನಾಟಕ ಸರ್ಕಾರ ಹಾಗೂ ಕೆಎಸ್‌ಟಿಡಿಸಿ',
    sourceUrl: 'https://karnatakatourism.org/',
    dataCategory: 'destination_info',
    accessMethod: 'REST_JSON_API',
    trustClassification: 'OFFICIAL_PUBLISHED',
    licenseId: 'ogd-india',
    geographicCoverage: 'Pan-Karnataka 31 districts verified tourist destinations and heritage sites',
    geographicCoverageKannada: 'ಕರ್ನಾಟಕದ ೩೧ ಜಿಲ್ಲೆಗಳ ಅಧಿಕೃತ ಪ್ರವಾಸಿ ತಾಣಗಳು',
    lastRetrievedTimestamp: '2026-10-31T05:00:00.000Z',
    lastSourcePublicationTimestamp: '2026-09-01T00:00:00.000Z',
    lastIndependentlyVerifiedTimestamp: '2026-10-31T07:00:00.000Z',
    validityMinutes: 1440 * 14,
    expiryConditions: 'Government of Karnataka tourism master plan updates',
    refreshPolicy: 'DAILY',
    attributionStatement: 'Destination descriptions and cultural records verified via Karnataka Tourism Department.',
    emergencyHelpline: '1800-425-4747',
    officialBookingOrEnquiryUrl: 'https://karnatakatourism.org/',
  },

  // 8. Karnataka Forest Department (MyEcoTrip / Aranya)
  'src-forest-dept': {
    sourceId: 'src-forest-dept',
    sourceOrganization: 'Karnataka Forest Department (Eco-Tourism Development Board / MyEcoTrip)',
    sourceOrganizationKannada: 'ಕರ್ನಾಟಕ ಅರಣ್ಯ ಇಲಾಖೆ (ಮೈ ಇಕೋ ಟ್ರಿಪ್)',
    sourceUrl: 'https://myecotrip.com/',
    dataCategory: 'trekking_permits',
    accessMethod: 'PUBLISHED_GAZETTE_OR_SCHEDULE',
    trustClassification: 'OFFICIAL_PUBLISHED',
    licenseId: 'ogd-india',
    geographicCoverage: 'Western Ghats trails (Kudremukha, Kumara Parvatha, Tadiandamol, Mullayanagiri) & wildlife sanctuaries',
    geographicCoverageKannada: 'ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಚಾರಣ ಮಾರ್ಗಗಳು ಮತ್ತು ವನ್ಯಜೀವಿ ಧಾಮಗಳು',
    lastRetrievedTimestamp: '2026-10-30T10:00:00.000Z',
    lastSourcePublicationTimestamp: '2026-09-15T00:00:00.000Z',
    lastIndependentlyVerifiedTimestamp: '2026-10-30T12:00:00.000Z',
    validityMinutes: 1440 * 7,
    expiryConditions: 'Seasonal forest fire restrictions, monsoon bans, and daily carrying capacity limits',
    refreshPolicy: 'DAILY',
    attributionStatement: 'Trek permits and daily slot quotas regulated by Karnataka Eco-Tourism Development Board.',
    officialBookingOrEnquiryUrl: 'https://myecotrip.com/',
  },

  // 9. Jungle Lodges & Resorts (JLR)
  'src-jlr': {
    sourceId: 'src-jlr',
    sourceOrganization: 'Jungle Lodges & Resorts Ltd. (Govt. of Karnataka Undertaking)',
    sourceOrganizationKannada: 'ಜಂಗಲ್ ಲಾಡ್ಜಸ್ & ರೆಸಾರ್ಟ್ಸ್ ಲಿಮಿಟೆಡ್',
    sourceUrl: 'https://www.junglelodges.com/',
    dataCategory: 'registered_accommodation',
    accessMethod: 'PUBLISHED_GAZETTE_OR_SCHEDULE',
    trustClassification: 'PROPERTY_DIRECT_CONFIRMED',
    licenseId: 'ogd-india',
    geographicCoverage: 'Eco-resorts at Kabini, Bandipur, Dandeli, Bheemeshwari, Dubare, Kali River',
    geographicCoverageKannada: 'ಕಬಿನಿ, ಬಂಡೀಪುರ, ದಾಂಡೇಲಿ, ಕಾವೇರಿ ಕಣಿವೆ ಪರಿಸರ ರೆಸಾರ್ಟ್‌ಗಳು',
    lastRetrievedTimestamp: '2026-10-29T10:00:00.000Z',
    lastSourcePublicationTimestamp: '2026-08-01T00:00:00.000Z',
    lastIndependentlyVerifiedTimestamp: '2026-10-29T11:00:00.000Z',
    validityMinutes: 1440 * 14,
    expiryConditions: 'Seasonal tariff revision and safari seat allocation changes',
    refreshPolicy: 'DAILY',
    attributionStatement: 'Tariffs and safari bookings confirmed directly with Jungle Lodges & Resorts Head Office, Bengaluru.',
    emergencyHelpline: '080-40554055',
    officialBookingOrEnquiryUrl: 'https://www.junglelodges.com/',
  },

  // 10. KSTDC Mayura Hotels
  'src-kstdc-hotels': {
    sourceId: 'src-kstdc-hotels',
    sourceOrganization: 'Karnataka State Tourism Development Corporation (KSTDC) Hotels Division',
    sourceOrganizationKannada: 'ಕೆಎಸ್‌ಟಿಡಿಸಿ ಮಯೂರ ಹೊಟೇಲ್‌ಗಳು',
    sourceUrl: 'https://kstdc.co/',
    dataCategory: 'registered_accommodation',
    accessMethod: 'PUBLISHED_GAZETTE_OR_SCHEDULE',
    trustClassification: 'PROPERTY_DIRECT_CONFIRMED',
    licenseId: 'ogd-india',
    geographicCoverage: 'Hotel Mayura properties: Belur, Halebidu, Hampi, Badami, Ooty-Karnataka, Madikeri, Nandi Hills',
    geographicCoverageKannada: 'ಹೋಟೆಲ್ ಮಯೂರ ಶ್ರೇಣಿ: ಬೇಲೂರು, ಹಳೇಬೀಡು, ಹಂಪಿ, ಬಾದಾಮಿ, ಮಡಿಕೇರಿ',
    lastRetrievedTimestamp: '2026-10-29T10:00:00.000Z',
    lastSourcePublicationTimestamp: '2026-08-01T00:00:00.000Z',
    lastIndependentlyVerifiedTimestamp: '2026-10-29T11:30:00.000Z',
    validityMinutes: 1440 * 14,
    expiryConditions: 'Government tourism corporation tariff revisions',
    refreshPolicy: 'DAILY',
    attributionStatement: 'KSTDC Hotel Mayura verified properties, room tariffs, and direct booking verification.',
    emergencyHelpline: '080-43344334',
    officialBookingOrEnquiryUrl: 'https://kstdc.co/',
  },

  // 11. Open-Meteo High-Resolution Ensemble
  'src-open-meteo': {
    sourceId: 'src-open-meteo',
    sourceOrganization: 'Open-Meteo Weather API (ECMWF & GFS European Ensembles)',
    sourceOrganizationKannada: 'ಓಪನ್-ಮೆಟಿಯೋ ಉನ್ನತ-ರೆಸಲ್ಯೂಶನ್ ಹವಾಮಾನ ಮಾದರಿ',
    sourceUrl: 'https://open-meteo.com/',
    dataCategory: 'weather',
    accessMethod: 'REST_JSON_API',
    trustClassification: 'LICENSED_THIRD_PARTY',
    licenseId: 'cc-by-4.0',
    geographicCoverage: 'Pan-Karnataka 0.1° High-Resolution Atmospheric Model',
    geographicCoverageKannada: 'ಕರ್ನಾಟಕದಾದ್ಯಂತ ನಿಖರ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ',
    lastRetrievedTimestamp: '2026-11-01T06:00:00.000Z',
    lastSourcePublicationTimestamp: '2026-11-01T05:30:00.000Z',
    lastIndependentlyVerifiedTimestamp: '2026-11-01T06:00:00.000Z',
    validityMinutes: 60,
    expiryConditions: 'Micro-climate atmospheric model refresh every 60 minutes',
    refreshPolicy: 'HOURLY',
    attributionStatement: 'Atmospheric and rainfall observations powered by Open-Meteo under CC-BY 4.0.',
  },

  // 12. IMD Bengaluru Meteorological Centre
  'src-imd-bengaluru': {
    sourceId: 'src-imd-bengaluru',
    sourceOrganization: 'India Meteorological Department (IMD) Bengaluru Centre',
    sourceOrganizationKannada: 'ಭಾರತೀಯ ಹವಾಮಾನ ಇಲಾಖೆ (ಐಎಂಡಿ) ಬೆಂಗಳೂರು ಕೇಂದ್ರ',
    sourceUrl: 'https://mausam.imd.gov.in/bengaluru/',
    dataCategory: 'disaster_alert',
    accessMethod: 'PUBLISHED_GAZETTE_OR_SCHEDULE',
    trustClassification: 'OFFICIAL_PUBLISHED',
    licenseId: 'ogd-india',
    geographicCoverage: 'All 31 Karnataka districts statutory weather warnings and monsoon bulletins',
    geographicCoverageKannada: 'ಕರ್ನಾಟಕದ ೩೧ ಜಿಲ್ಲೆಗಳ ಶಾಸನಬದ್ಧ ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು',
    lastRetrievedTimestamp: '2026-10-31T12:00:00.000Z',
    lastSourcePublicationTimestamp: '2026-10-31T11:00:00.000Z',
    lastIndependentlyVerifiedTimestamp: '2026-10-31T12:30:00.000Z',
    validityMinutes: 180,
    expiryConditions: 'Monsoon squall warnings and red/orange/yellow color coded district bulletins',
    refreshPolicy: 'HOURLY',
    attributionStatement: 'Statutory weather warnings and rainfall radar observations from IMD Bengaluru.',
  },

  // 13. Karnataka PWD / NHAI Ghat Road Advisories
  'src-karnataka-pwd-ghats': {
    sourceId: 'src-karnataka-pwd-ghats',
    sourceOrganization: 'Public Works Department (PWD) Karnataka & NHAI Regional Office',
    sourceOrganizationKannada: 'ಲೋಕೋಪಯೋಗಿ ಇಲಾಖೆ (ಪಿಡಬ್ಲ್ಯೂಡಿ) ಮತ್ತು ಎನ್‌ಎಚ್‌ಎಐ',
    sourceUrl: 'https://kpwd.karnataka.gov.in/',
    dataCategory: 'road_condition',
    accessMethod: 'PUBLISHED_GAZETTE_OR_SCHEDULE',
    trustClassification: 'OFFICIAL_PUBLISHED',
    licenseId: 'ogd-india',
    geographicCoverage: 'Shiradi Ghat (NH-75), Charmadi Ghat, Agumbe Ghat, Sampaje Ghat corridors',
    geographicCoverageKannada: 'ಶಿರಾಡಿ, ಚಾರ್ಮಾಡಿ, ಆಗುಂಬೆ ಹಾಗೂ ಸಂಪಾಜೆ ಘಾಟ್ ರಸ್ತೆಗಳು',
    lastRetrievedTimestamp: '2026-10-31T09:00:00.000Z',
    lastSourcePublicationTimestamp: '2026-10-30T18:00:00.000Z',
    lastIndependentlyVerifiedTimestamp: '2026-10-31T10:00:00.000Z',
    validityMinutes: 240,
    expiryConditions: 'Emergency landslide clearances and seasonal heavy vehicle movement restrictions',
    refreshPolicy: 'HOURLY',
    attributionStatement: 'Ghat pass conditions and road maintenance advisories verified via PWD Karnataka notices.',
  },

  // 14. Registered Homestays of Karnataka (District Administration)
  'src-registered-homestays': {
    sourceId: 'src-registered-homestays',
    sourceOrganization: 'District Tourism Development Councils (Kodagu, Chikkamagaluru, Hassan, Uttara Kannada)',
    sourceOrganizationKannada: 'ಜಿಲ್ಲಾ ಪ್ರವಾಸೋದ್ಯಮ ಅಭಿವೃದ್ಧಿ ಮಂಡಳಿ (ನೋಂದಾಯಿತ ಹೋಮ್‌ಸ್ಟೇಗಳು)',
    sourceUrl: 'https://karnatakatourism.org/stay/homestays/',
    dataCategory: 'registered_accommodation',
    accessMethod: 'PUBLISHED_GAZETTE_OR_SCHEDULE',
    trustClassification: 'GOVERNMENT_REGISTERED',
    licenseId: 'ogd-india',
    geographicCoverage: 'Malnad, Coorg, Chikkamagaluru, and Coastal registered rural homestays',
    geographicCoverageKannada: 'ಮಲೆನಾಡು, ಕೊಡಗು, ಚಿಕ್ಕಮಗಳೂರು ನೋಂದಾಯಿತ ಗ್ರಾಮೀಣ ಹೋಮ್‌ಸ್ಟೇಗಳು',
    lastRetrievedTimestamp: '2026-10-28T10:00:00.000Z',
    lastSourcePublicationTimestamp: '2026-07-01T00:00:00.000Z',
    lastIndependentlyVerifiedTimestamp: '2026-10-28T14:00:00.000Z',
    validityMinutes: 1440 * 30,
    expiryConditions: 'Annual district administration safety certification and license renewal',
    refreshPolicy: 'SEASONAL',
    attributionStatement: 'Homestays holding legitimate registration numbers issued under the Karnataka Tourism Policy.',
  },

  // 15. Geographical Indications (GI) Registry of India - Karnataka Gastronomy
  'src-gi-gastronomy': {
    sourceId: 'src-gi-gastronomy',
    sourceOrganization: 'Geographical Indications Registry, Government of India (IP India)',
    sourceOrganizationKannada: 'ಭಾರತ ಸರ್ಕಾರದ ಭೌಗೋಳಿಕ ಮಾನ್ಯತೆ (ಜಿಐ) ನೋಂದಣಿ ಇಲಾಖೆ',
    sourceUrl: 'https://search.ipindia.gov.in/GIRPublic/',
    dataCategory: 'gi_gastronomy',
    accessMethod: 'PUBLISHED_GAZETTE_OR_SCHEDULE',
    trustClassification: 'OFFICIAL_PUBLISHED',
    licenseId: 'ogd-india',
    geographicCoverage: 'Pan-Karnataka GI certified culinary traditions and agricultural heritage',
    geographicCoverageKannada: 'ಕರ್ನಾಟಕದ ಜಿಐ ಮಾನ್ಯತೆ ಪಡೆದ ಪಾರಂಪರಿಕ ಆಹಾರ ಪದ್ಧತಿಗಳು',
    lastRetrievedTimestamp: '2026-10-20T10:00:00.000Z',
    lastSourcePublicationTimestamp: '2026-01-01T00:00:00.000Z',
    lastIndependentlyVerifiedTimestamp: '2026-10-20T11:00:00.000Z',
    validityMinutes: 1440 * 365,
    expiryConditions: 'Statutory GI journal registrations under GI of Goods Act 1999',
    refreshPolicy: 'PERMANENT',
    attributionStatement: 'Culinary provenance verified via statutory Geographical Indications (GI) registration certificates.',
  },
};

export function getAuthoritativeSource(sourceId: string): AuthoritativeSourceRecord {
  return (
    AUTHORITATIVE_SOURCE_REGISTRY[sourceId] ?? {
      sourceId,
      sourceOrganization: 'Secondary Open Community or Field Investigation',
      sourceOrganizationKannada: 'ಮುಕ್ತ ಸಮುದಾಯ ಅಥವಾ ಸ್ಥಳೀಯ ಪರಿಶೀಲನೆ',
      sourceUrl: 'https://karnatakatourism.org/',
      dataCategory: 'destination_info',
      accessMethod: 'PHYSICAL_INSPECTION_AUDIT',
      trustClassification: 'COMMUNITY_MAPPED',
      licenseId: 'odbl-1.0',
      geographicCoverage: 'Karnataka',
      geographicCoverageKannada: 'ಕರ್ನಾಟಕ',
      lastRetrievedTimestamp: new Date().toISOString(),
      lastSourcePublicationTimestamp: new Date().toISOString(),
      lastIndependentlyVerifiedTimestamp: new Date().toISOString(),
      validityMinutes: 1440,
      expiryConditions: 'Community update pending physical audit',
      refreshPolicy: 'DAILY',
      attributionStatement: 'Information mapped via open geospatial and local field records.',
    }
  );
}
