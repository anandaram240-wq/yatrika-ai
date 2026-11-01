/**
 * @file src/transit/buses/busScheduleAdapter.ts
 * @description Standardized bus schedule data adapter and comprehensive Karnataka timetables.
 * Strictly separates published timetables from live seat inventory.
 * @theme Code. Create. Celebrate Kannada.
 */

export type BusInfoState =
  | 'LIVE_SERVICE_DATA'
  | 'OFFICIAL_SCHEDULE'
  | 'PUBLISHED_OPERATOR_INFORMATION'
  | 'ESTIMATED_JOURNEY'
  | 'USER_REPORTED'
  | 'UNAVAILABLE';

export type BusServiceClass =
  | 'ordinary_sarige'
  | 'rajahamsa_executive'
  | 'airavat_club_class'
  | 'ambari_utsav_sleeper'
  | 'vayu_vajra_airport'
  | 'ev_power_plus'
  | 'kalyana_ratha_sleeper';

export interface ComprehensiveBusSchedule {
  id: string;
  operatorId: 'KSRTC' | 'BMTC' | 'NWKRTC' | 'KKRTC' | 'VRL';
  operatorName: string;
  serviceName: string;
  serviceNumber?: string;
  serviceClass: BusServiceClass;
  originCity: string;
  originTerminal: string;
  destinationCity: string;
  destinationTerminal: string;
  departureTime: string; // HH:MM
  arrivalTime: string;   // HH:MM
  durationLabel: string;
  durationMinutes: number;
  intermediateStops: string[];
  distanceKm: number;
  fareInr: number;
  shaktiFree: boolean; // Free travel for Karnataka women on ordinary & express
  isAc: boolean;
  hasSleeperBerth: boolean;
  hasUsbCharging: boolean;
  infoState: BusInfoState;
  retrievedDate: string;
  bookingUrl: string;
  depotContact: string;
  routeHighlight: string;
}

export const PUBLISHED_KARNATAKA_BUS_SCHEDULES: ComprehensiveBusSchedule[] = [
  // --- BENGALURU TO HASSAN & BELUR (GOLDEN HERITAGE CORRIDOR) ---
  {
    id: 'ksrtc-blr-has-belur-rajahamsa-01',
    operatorId: 'KSRTC',
    operatorName: 'Karnataka State Road Transport Corporation (KSRTC)',
    serviceName: 'Rajahamsa Executive',
    serviceNumber: 'KSRTC-RH-1402',
    serviceClass: 'rajahamsa_executive',
    originCity: 'Bengaluru',
    originTerminal: 'Kempegowda Bus Station (Majestic, Platform 2)',
    destinationCity: 'Belur',
    destinationTerminal: 'Belur KSRTC Bus Stand',
    departureTime: '06:30',
    arrivalTime: '10:45',
    durationLabel: '4h 15m',
    durationMinutes: 255,
    intermediateStops: ['Nelamangala Toll', 'Kunigal Bypass', 'Channarayapatna', 'Hassan New Bus Stand'],
    distanceKm: 220,
    fareInr: 280,
    shaktiFree: true,
    isAc: false,
    hasSleeperBerth: false,
    hasUsbCharging: true,
    infoState: 'OFFICIAL_SCHEDULE',
    retrievedDate: '2026-10-31',
    bookingUrl: 'https://ksrtc.in/oprs-web/guest/home.do',
    depotContact: 'Hassan KSRTC Central Depot: 08172-268341',
    routeHighlight: 'Express morning service directly connecting Majestic to Hoysala Chennakeshava Temple gates.',
  },
  {
    id: 'ksrtc-blr-has-belur-airavat-02',
    operatorId: 'KSRTC',
    operatorName: 'KSRTC',
    serviceName: 'Airavat Club Class (Multi-Axle AC)',
    serviceNumber: 'KSRTC-AC-2104',
    serviceClass: 'airavat_club_class',
    originCity: 'Bengaluru',
    originTerminal: 'Kempegowda Bus Station (Majestic, Platform 1)',
    destinationCity: 'Belur (via Hassan)',
    destinationTerminal: 'Belur Bus Stand',
    departureTime: '08:00',
    arrivalTime: '11:45',
    durationLabel: '3h 45m',
    durationMinutes: 225,
    intermediateStops: ['Kunigal', 'Channarayapatna Bypass', 'Hassan'],
    distanceKm: 220,
    fareInr: 410,
    shaktiFree: false, // Airavat AC luxury is not covered under Shakti Scheme
    isAc: true,
    hasSleeperBerth: false,
    hasUsbCharging: true,
    infoState: 'OFFICIAL_SCHEDULE',
    retrievedDate: '2026-10-31',
    bookingUrl: 'https://ksrtc.in/oprs-web/guest/home.do',
    depotContact: 'Bengaluru Central Division: 080-22870099',
    routeHighlight: 'Smooth NH-75 expressway ride with recliner seats and chilled cabin.',
  },

  // --- BENGALURU TO CHIKKAMAGALURU (MULLAYANAGIRI GATEWAY) ---
  {
    id: 'ksrtc-blr-cmgr-ambari-01',
    operatorId: 'KSRTC',
    operatorName: 'KSRTC',
    serviceName: 'Ambari Utsav Premium AC Sleeper',
    serviceNumber: 'KSRTC-AU-3301',
    serviceClass: 'ambari_utsav_sleeper',
    originCity: 'Bengaluru',
    originTerminal: 'Kempegowda Bus Station (Majestic)',
    destinationCity: 'Chikkamagaluru',
    destinationTerminal: 'Chikkamagaluru KSRTC Bus Stand',
    departureTime: '22:30',
    arrivalTime: '04:45',
    durationLabel: '6h 15m (Overnight)',
    durationMinutes: 375,
    intermediateStops: ['Yeshwantpur Govardhan', 'Kunigal', 'Hassan Bypass', 'Belur Cross'],
    distanceKm: 245,
    fareInr: 650,
    shaktiFree: false,
    isAc: true,
    hasSleeperBerth: true,
    hasUsbCharging: true,
    infoState: 'OFFICIAL_SCHEDULE',
    retrievedDate: '2026-10-31',
    bookingUrl: 'https://ksrtc.in/oprs-web/guest/home.do',
    depotContact: 'Chikkamagaluru Depot: 08262-230403',
    routeHighlight: 'Sleep comfortably in Bengaluru; wake up at 04:45 AM at the foot of Mullayanagiri coffee hills.',
  },
  {
    id: 'ksrtc-blr-cmgr-sarige-02',
    operatorId: 'KSRTC',
    operatorName: 'KSRTC',
    serviceName: 'Karnataka Sarige (Express)',
    serviceNumber: 'KSRTC-EXP-4110',
    serviceClass: 'ordinary_sarige',
    originCity: 'Bengaluru',
    originTerminal: 'Kempegowda Bus Station (Majestic)',
    destinationCity: 'Chikkamagaluru',
    destinationTerminal: 'Chikkamagaluru Central Stand',
    departureTime: '07:15',
    arrivalTime: '12:30',
    durationLabel: '5h 15m',
    durationMinutes: 315,
    intermediateStops: ['Nelamangala', 'Kunigal', 'Channarayapatna', 'Hassan', 'Belur'],
    distanceKm: 245,
    fareInr: 215,
    shaktiFree: true, // Free for Karnataka women under Shakti scheme
    isAc: false,
    hasSleeperBerth: false,
    hasUsbCharging: false,
    infoState: 'OFFICIAL_SCHEDULE',
    retrievedDate: '2026-10-31',
    bookingUrl: 'https://ksrtc.in/oprs-web/guest/home.do',
    depotContact: 'Chikkamagaluru Depot: 08262-230403',
    routeHighlight: 'Budget-friendly daytime service. 100% free for women with Karnataka domicile smart-card.',
  },

  // --- BENGALURU TO HOSAPETE / HAMPI (KKRTC & KSRTC) ---
  {
    id: 'kkrtc-blr-hampi-kalyana-ratha-01',
    operatorId: 'KKRTC',
    operatorName: 'Kalyana Karnataka Road Transport Corporation (KKRTC)',
    serviceName: 'Kalyana Ratha Multi-Axle AC Sleeper',
    serviceNumber: 'KKRTC-KR-108',
    serviceClass: 'kalyana_ratha_sleeper',
    originCity: 'Bengaluru',
    originTerminal: 'Kempegowda Bus Station (Majestic, Platform 12)',
    destinationCity: 'Hosapete (Hampi)',
    destinationTerminal: 'Hosapete KKRTC Central Bus Stand',
    departureTime: '22:00',
    arrivalTime: '05:30',
    durationLabel: '7h 30m (Overnight)',
    durationMinutes: 450,
    intermediateStops: ['Tumakuru Bypass', 'Sira', 'Chitradurga Bypass', 'Kudligi'],
    distanceKm: 330,
    fareInr: 720,
    shaktiFree: false,
    isAc: true,
    hasSleeperBerth: true,
    hasUsbCharging: true,
    infoState: 'OFFICIAL_SCHEDULE',
    retrievedDate: '2026-10-30',
    bookingUrl: 'https://kkrtc.karnataka.gov.in/',
    depotContact: 'Hosapete Central Bus Depot: 08394-222384',
    routeHighlight: 'Flagship overnight connection directly to Hampi gateway. Shuttle to Hampi monuments every 20 min from terminal.',
  },
  {
    id: 'ksrtc-blr-hpt-rajahamsa-02',
    operatorId: 'KSRTC',
    operatorName: 'KSRTC',
    serviceName: 'Rajahamsa Executive',
    serviceNumber: 'KSRTC-RH-1822',
    serviceClass: 'rajahamsa_executive',
    originCity: 'Bengaluru',
    originTerminal: 'Kempegowda Bus Station (Majestic)',
    destinationCity: 'Hosapete (Hampi)',
    destinationTerminal: 'Hosapete Bus Terminal',
    departureTime: '06:00',
    arrivalTime: '13:00',
    durationLabel: '7h 00m',
    durationMinutes: 420,
    intermediateStops: ['Tumakuru', 'Chitradurga Fort Cross', 'Kudligi'],
    distanceKm: 330,
    fareInr: 395,
    shaktiFree: true,
    isAc: false,
    hasSleeperBerth: false,
    hasUsbCharging: true,
    infoState: 'OFFICIAL_SCHEDULE',
    retrievedDate: '2026-10-31',
    bookingUrl: 'https://ksrtc.in/oprs-web/guest/home.do',
    depotContact: 'Bengaluru North Division: 080-22873377',
    routeHighlight: 'Daytime scenic route passing Chitradurga rocky hill fortress and Tungabhadra countryside.',
  },

  // --- BENGALURU TO MYSURU (HIGH FREQUENCY SHAKTI EXPRESS) ---
  {
    id: 'ksrtc-blr-mys-ev-powerplus-01',
    operatorId: 'KSRTC',
    operatorName: 'KSRTC',
    serviceName: 'EV Power Plus (Intercity Electric AC)',
    serviceNumber: 'KSRTC-EV-01',
    serviceClass: 'ev_power_plus',
    originCity: 'Bengaluru',
    originTerminal: 'Kempegowda Bus Station (Majestic, Plat. 2A)',
    destinationCity: 'Mysuru',
    destinationTerminal: 'Mysuru Suburban Bus Stand',
    departureTime: '07:00',
    arrivalTime: '09:45',
    durationLabel: '2h 45m',
    durationMinutes: 165,
    intermediateStops: ['Kengeri Metro', 'Bidadi Bypass', 'Mandya Bypass'],
    distanceKm: 145,
    fareInr: 290,
    shaktiFree: false,
    isAc: true,
    hasSleeperBerth: false,
    hasUsbCharging: true,
    infoState: 'OFFICIAL_SCHEDULE',
    retrievedDate: '2026-10-31',
    bookingUrl: 'https://ksrtc.in/oprs-web/guest/home.do',
    depotContact: 'Mysuru City Depot: 0821-2443355',
    routeHighlight: '100% Zero-emission electric Volvo operating via Bengaluru-Mysuru Expressway (NH-275).',
  },
  {
    id: 'ksrtc-blr-mys-sarige-express-02',
    operatorId: 'KSRTC',
    operatorName: 'KSRTC',
    serviceName: 'Karnataka Sarige (Non-Stop)',
    serviceNumber: 'KSRTC-NS-201',
    serviceClass: 'ordinary_sarige',
    originCity: 'Bengaluru',
    originTerminal: 'Satellite Bus Terminal (Mysuru Road, MCTC)',
    destinationCity: 'Mysuru',
    destinationTerminal: 'Mysuru Suburban Bus Stand',
    departureTime: '06:00',
    arrivalTime: '08:45',
    durationLabel: '2h 45m (Departures every 10 min)',
    durationMinutes: 165,
    intermediateStops: ['Non-Stop via 10-Lane Expressway'],
    distanceKm: 140,
    fareInr: 165,
    shaktiFree: true, // Free for women under Shakti Scheme
    isAc: false,
    hasSleeperBerth: false,
    hasUsbCharging: false,
    infoState: 'OFFICIAL_SCHEDULE',
    retrievedDate: '2026-10-31',
    bookingUrl: 'https://ksrtc.in/oprs-web/guest/home.do',
    depotContact: 'MCTC Satellite Station Control: 080-26756655',
    routeHighlight: 'High-frequency non-stop shuttle. Runs every 10 minutes round-the-clock.',
  },

  // --- HUBBALLI TO BADAMI & BAGALKOTE (NWKRTC) ---
  {
    id: 'nwkrtc-ubl-badami-sarige-01',
    operatorId: 'NWKRTC',
    operatorName: 'North Western Karnataka Road Transport Corporation (NWKRTC)',
    serviceName: 'NWKRTC Suvarna Sarige',
    serviceNumber: 'NWK-BGK-504',
    serviceClass: 'ordinary_sarige',
    originCity: 'Hubballi',
    originTerminal: 'Hubballi Old Bus Stand (CBT)',
    destinationCity: 'Badami (Cave Temples)',
    destinationTerminal: 'Badami Central Bus Stand',
    departureTime: '07:30',
    arrivalTime: '10:00',
    durationLabel: '2h 30m',
    durationMinutes: 150,
    intermediateStops: ['Navalgund', 'Nargund', 'Ron'],
    distanceKm: 105,
    fareInr: 110,
    shaktiFree: true,
    isAc: false,
    hasSleeperBerth: false,
    hasUsbCharging: false,
    infoState: 'OFFICIAL_SCHEDULE',
    retrievedDate: '2026-10-30',
    bookingUrl: 'https://nwkrtc.karnataka.gov.in/',
    depotContact: 'Hubballi Divisional Control: 0836-2237511',
    routeHighlight: 'Direct Chalukyan heritage circuit connection from Hubballi railway junction to Badami.',
  },

  // --- BENGALURU AIRPORT CONNECTIVITY (BMTC VAYU VAJRA) ---
  {
    id: 'bmtc-kia-majestic-vayu-vajra-01',
    operatorId: 'BMTC',
    operatorName: 'Bengaluru Metropolitan Transport Corporation (BMTC)',
    serviceName: 'Vayu Vajra Airport AC Volvo (Route KIA-9)',
    serviceNumber: 'BMTC-KIA-9',
    serviceClass: 'vayu_vajra_airport',
    originCity: 'Bengaluru Airport',
    originTerminal: 'Kempegowda International Airport (Terminal 1 & 2)',
    destinationCity: 'Bengaluru City',
    destinationTerminal: 'Kempegowda Bus Station (Majestic Platform 30)',
    departureTime: '06:00',
    arrivalTime: '07:15',
    durationLabel: '1h 15m (Every 15 minutes 24x7)',
    durationMinutes: 75,
    intermediateStops: ['Hebbal Flyover', 'Mekhri Circle', 'Cantonment Station', 'Majestic'],
    distanceKm: 38,
    fareInr: 250,
    shaktiFree: false, // Airport luxury AC Volvo excluded from Shakti scheme
    isAc: true,
    hasSleeperBerth: false,
    hasUsbCharging: true,
    infoState: 'OFFICIAL_SCHEDULE',
    retrievedDate: '2026-10-31',
    bookingUrl: 'https://mybmtc.karnataka.gov.in/',
    depotContact: 'BMTC Airport Control: 7760991199',
    routeHighlight: '24x7 Airport connectivity with luggage racks, AC, and high-speed expressway transit.',
  },
];
