/**
 * @file src/transit/transportDataAdapter.ts
 * @description Attributed transport timetable data adapter for KSRTC, SWR, and BMRCL.
 * @theme Code. Create. Celebrate Kannada.
 */

export type TransitOperator = 'KSRTC' | 'SWR_INDIAN_RAILWAYS' | 'BMRCL_METRO' | 'NWKRTC' | 'KKRTC';

export type BusServiceCategory =
  | 'karnataka_sarige'     // Ordinary / Express: SHAKTI ELIGIBLE
  | 'gramantara_sarige'    // Rural feeder: SHAKTI ELIGIBLE
  | 'rajahamsa'            // Semi-luxury non-AC: NOT SHAKTI ELIGIBLE
  | 'airavat_club_class'   // Luxury Volvo multi-axle AC: NOT SHAKTI ELIGIBLE
  | 'ambari_utsav'         // Ultra-luxury Volvo 9600 sleeper: NOT SHAKTI ELIGIBLE
  | 'flybus_airport';      // Airport executive AC: NOT SHAKTI ELIGIBLE

export interface TransitServiceSchedule {
  serviceId: string;
  operator: TransitOperator;
  serviceCategory: BusServiceCategory | 'vande_bharat' | 'express_train' | 'metro_purple' | 'metro_green';
  serviceName: string;
  serviceNumber?: string;
  originHubId: string;
  originHubName: string;
  destinationHubId: string;
  destinationHubName: string;
  departureTime: string; // "HH:MM"
  arrivalTime: string;   // "HH:MM"
  durationMinutes: number;
  baseFareInr: number;
  isShaktiEligible: boolean; // Under GoK Order TRD 34 MDA 2023
  dataClassification: 'scheduled_published' | 'estimated_frequency' | 'external_hand_off';
  officialBookingUrl: string;
}

export const VERIFIED_TRANSIT_SERVICES: TransitServiceSchedule[] = [
  // 1. Bengaluru -> Chikkamagaluru (KSRTC Sarige - Shakti Eligible)
  {
    serviceId: 'ksrtc-sarige-blr-ckm-01',
    operator: 'KSRTC',
    serviceCategory: 'karnataka_sarige',
    serviceName: 'Karnataka Sarige Express',
    serviceNumber: 'KSRTC-5120',
    originHubId: 'hub-majestic-bus',
    originHubName: 'Kempegowda Bus Station Majestic (Terminal 2)',
    destinationHubId: 'hub-ckm-bus',
    destinationHubName: 'Chikkamagaluru KSRTC Bus Stand',
    departureTime: '06:30',
    arrivalTime: '11:15',
    durationMinutes: 285,
    baseFareInr: 310,
    isShaktiEligible: true,
    dataClassification: 'scheduled_published',
    officialBookingUrl: 'https://ksrtc.in/oprs-web/guest/home.do',
  },
  // 2. Bengaluru -> Chikkamagaluru (KSRTC Rajahamsa - NOT Shakti Eligible)
  {
    serviceId: 'ksrtc-rajahamsa-blr-ckm-02',
    operator: 'KSRTC',
    serviceCategory: 'rajahamsa',
    serviceName: 'Rajahamsa Executive',
    serviceNumber: 'KSRTC-RH-221',
    originHubId: 'hub-majestic-bus',
    originHubName: 'Kempegowda Bus Station Majestic (Terminal 1)',
    destinationHubId: 'hub-ckm-bus',
    destinationHubName: 'Chikkamagaluru KSRTC Bus Stand',
    departureTime: '07:15',
    arrivalTime: '11:45',
    durationMinutes: 270,
    baseFareInr: 450,
    isShaktiEligible: false, // Semi-luxury is NOT eligible under Govt order
    dataClassification: 'scheduled_published',
    officialBookingUrl: 'https://ksrtc.in/oprs-web/guest/home.do',
  },
  // 3. SWR Vande Bharat (Bengaluru -> Mysuru)
  {
    serviceId: 'swr-vb-20608',
    operator: 'SWR_INDIAN_RAILWAYS',
    serviceCategory: 'vande_bharat',
    serviceName: 'Mysuru Vande Bharat Express',
    serviceNumber: '20608',
    originHubId: 'hub-sbc-railway',
    originHubName: 'KSR Bengaluru City Junction (SBC)',
    destinationHubId: 'hub-mys-railway',
    destinationHubName: 'Mysuru Junction (MYS)',
    departureTime: '05:45',
    arrivalTime: '07:20',
    durationMinutes: 95,
    baseFareInr: 515,
    isShaktiEligible: false, // Trains are NOT covered under state bus scheme
    dataClassification: 'scheduled_published',
    officialBookingUrl: 'https://www.irctc.co.in/',
  },
  // 4. SWR Overnight Hampi Express (Bengaluru -> Hosapete)
  {
    serviceId: 'swr-hampi-16592',
    operator: 'SWR_INDIAN_RAILWAYS',
    serviceCategory: 'express_train',
    serviceName: 'Hampi Express (Overnight Sleeper)',
    serviceNumber: '16592',
    originHubId: 'hub-sbc-railway',
    originHubName: 'KSR Bengaluru City Junction (SBC)',
    destinationHubId: 'hub-hpt-railway',
    destinationHubName: 'Hosapete Junction (HPT - Hampi Gateway)',
    departureTime: '21:50',
    arrivalTime: '07:05',
    durationMinutes: 555,
    baseFareInr: 285,
    isShaktiEligible: false,
    dataClassification: 'scheduled_published',
    officialBookingUrl: 'https://www.irctc.co.in/',
  },
  // 5. Namma Metro Purple Line (Baiyappanahalli -> Majestic -> Kengeri)
  {
    serviceId: 'bmrcl-purple-shuttle',
    operator: 'BMRCL_METRO',
    serviceCategory: 'metro_purple',
    serviceName: 'Namma Metro Purple Line High-Frequency Metro',
    originHubId: 'hub-majestic-metro',
    originHubName: 'Nadaprabhu Kempegowda Majestic Metro Interchange',
    destinationHubId: 'hub-kengeri-metro',
    destinationHubName: 'Kengeri Bus Terminal Metro Station',
    departureTime: '06:00',
    arrivalTime: '06:28',
    durationMinutes: 28,
    baseFareInr: 38,
    isShaktiEligible: false,
    dataClassification: 'estimated_frequency',
    officialBookingUrl: 'https://english.bmrc.co.in/',
  },
];
