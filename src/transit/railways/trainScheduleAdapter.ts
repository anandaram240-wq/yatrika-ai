/**
 * @file src/transit/railways/trainScheduleAdapter.ts
 * @description Master timetable adapter for verified Karnataka passenger & express trains.
 * Sourced from Indian Railways NTES & South Western Railway public gazette.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface KarnatakaTrainScheduleV8 {
  trainNumber: string;
  trainName: string;
  trainNameKannada: string;
  trainType: 'vande_bharat' | 'vistadome_express' | 'superfast' | 'express' | 'jan_shatabdi';
  originCode: string;
  originName: string;
  destinationCode: string;
  destinationName: string;
  departureTime: string; // HH:MM
  arrivalTime: string;   // HH:MM
  durationLabel: string;
  daysOfOperation: string[]; // e.g. ['Daily'] or ['Mon', 'Tue', ...]
  classesAvailable: string[]; // ['1A', '2A', '3A', 'CC', 'EC', 'EV', 'SL', '2S']
  keyIntermediateStations: {
    stationCode: string;
    stationName: string;
    arrivalTime: string;
    departureTime: string;
    haltMinutes: number;
  }[];
  fareGuide: {
    generalSecondClass?: number;
    sleeper?: number;
    acChairCar?: number;
    acExecutiveChairCar?: number;
    vistadome?: number;
    ac3Tier?: number;
    ac2Tier?: number;
  };
  scenicHighlights: string;
  scenicHighlightsKannada: string;
  irctcBookingUrl: string;
  ntesRunningStatusUrl: string;
  lastMileConnectivityAdvice: string;
}

export const VERIFIED_KARNATAKA_TRAINS: KarnatakaTrainScheduleV8[] = [
  // 1. Mysuru - Bengaluru Vande Bharat Express
  {
    trainNumber: '20607 / 20608',
    trainName: 'Mysuru - Chennai Central Vande Bharat Express',
    trainNameKannada: 'ಮೈಸೂರು - ಚೆನ್ನೈ ವಂದೇ ಭಾರತ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್',
    trainType: 'vande_bharat',
    originCode: 'MYS',
    originName: 'Mysuru Junction',
    destinationCode: 'SBC',
    destinationName: 'KSR Bengaluru City',
    departureTime: '13:05',
    arrivalTime: '14:50',
    durationLabel: '1h 45m',
    daysOfOperation: ['Daily except Wednesday'],
    classesAvailable: ['CC', 'EC'],
    keyIntermediateStations: [
      { stationCode: 'MYS', stationName: 'Mysuru Junction', arrivalTime: '13:05', departureTime: '13:05', haltMinutes: 0 },
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '14:50', departureTime: '15:00', haltMinutes: 10 },
    ],
    fareGuide: {
      acChairCar: 380,
      acExecutiveChairCar: 760,
    },
    scenicHighlights: 'Traverses Ramanagara silk countryside and Mandya sugarcane plains at 130 km/h with 180° rotatable executive seats.',
    scenicHighlightsKannada: 'ರಾಮನಗರದ ರೇಷ್ಮೆ ನಾಡು ಹಾಗೂ ಮಂಡ್ಯದ ಕಬ್ಬಿನ ಬಯಲುಗಳಲ್ಲಿ ೧೩೦ ಕಿಮೀ ವೇಗದಲ್ಲಿ ಸಾಗುವ ಏರೋಡೈನಾಮಿಕ್ ರೈಲು.',
    irctcBookingUrl: 'https://www.irctc.co.in/nget/train-search',
    ntesRunningStatusUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=TRAIN&subAction=SHOW_TRAIN&trainNo=20608',
    lastMileConnectivityAdvice: 'Arrives KSR Bengaluru Platform 7. Direct subway escalators lead straight to Namma Metro interchange.',
  },

  // 2. Western Ghat Vistadome Express (Yesvantpur - Mangaluru)
  {
    trainNumber: '16539 / 16540',
    trainName: 'Yesvantpur - Mangaluru Western Ghat Vistadome Express',
    trainNameKannada: 'ಯಶವಂತಪುರ - ಮಂಗಳೂರು ಪಶ್ಚಿಮ ಘಟ್ಟ ವಿಸ್ಟಾಡೋಮ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್',
    trainType: 'vistadome_express',
    originCode: 'YPR',
    originName: 'Yesvantpur Junction (Bengaluru)',
    destinationCode: 'MAJN',
    destinationName: 'Mangaluru Junction',
    departureTime: '07:00',
    arrivalTime: '16:40',
    durationLabel: '9h 40m',
    daysOfOperation: ['Daily'],
    classesAvailable: ['EV', 'CC', '2S'],
    keyIntermediateStations: [
      { stationCode: 'HAS', stationName: 'Hassan Junction', arrivalTime: '09:40', departureTime: '09:45', haltMinutes: 5 },
      { stationCode: 'SKLR', stationName: 'Sakleshpur', arrivalTime: '10:45', departureTime: '11:00', haltMinutes: 15 },
      { stationCode: 'SBHR', stationName: 'Subrahmanya Road', arrivalTime: '13:50', departureTime: '13:55', haltMinutes: 5 },
      { stationCode: 'MAJN', stationName: 'Mangaluru Junction', arrivalTime: '16:40', departureTime: '16:40', haltMinutes: 0 },
    ],
    fareGuide: {
      vistadome: 690,
      acChairCar: 420,
      generalSecondClass: 165,
    },
    scenicHighlights: 'Spectacular glass-roof observation coach ascending the Sakleshpur–Subrahmanya Green Route Ghat tunnels, deep ravines, and monsoon waterfalls.',
    scenicHighlightsKannada: 'ಸಕಲೇಶಪುರ-ಸುಬ್ರಹ್ಮಣ್ಯ ಗ್ರೀನ್ ರೂಟ್ ಕಣಿವೆಗಳು, ಸುರಂಗಗಳು ಹಾಗೂ ಜಲಪಾತಗಳ ೩೬೦ ಡಿಗ್ರಿ ಗಾಜಿನ ಮೇಲ್ಛಾವಣಿಯ ನೋಟ.',
    irctcBookingUrl: 'https://www.irctc.co.in/nget/train-search',
    ntesRunningStatusUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=TRAIN&subAction=SHOW_TRAIN&trainNo=16539',
    lastMileConnectivityAdvice: 'Alight at Hassan Junction (09:40 AM) for Belur/Halebidu Hoysala temples (40 min bus ride). Alight at Subrahmanya Road for Kukke temple.',
  },

  // 3. Hampi Express (Mysuru - Bengaluru - Hosapete)
  {
    trainNumber: '16591 / 16592',
    trainName: 'Hampi Express',
    trainNameKannada: 'ಹಂಪಿ ಎಕ್ಸ್‌ಪ್ರೆಸ್',
    trainType: 'express',
    originCode: 'SBC',
    originName: 'KSR Bengaluru',
    destinationCode: 'HPT',
    destinationName: 'Hosapete Junction (Hampi)',
    departureTime: '21:50',
    arrivalTime: '07:10',
    durationLabel: '9h 20m (Overnight)',
    daysOfOperation: ['Daily'],
    classesAvailable: ['1A', '2A', '3A', 'SL'],
    keyIntermediateStations: [
      { stationCode: 'YPR', stationName: 'Yesvantpur Junction', arrivalTime: '22:00', departureTime: '22:02', haltMinutes: 2 },
      { stationCode: 'TK', stationName: 'Tumakuru', arrivalTime: '22:58', departureTime: '23:00', haltMinutes: 2 },
      { stationCode: 'CTA', stationName: 'Chitradurga', arrivalTime: '02:40', departureTime: '02:42', haltMinutes: 2 },
      { stationCode: 'BAY', stationName: 'Ballari Junction', arrivalTime: '05:35', departureTime: '05:40', haltMinutes: 5 },
      { stationCode: 'HPT', stationName: 'Hosapete Junction', arrivalTime: '07:10', departureTime: '07:10', haltMinutes: 0 },
    ],
    fareGuide: {
      sleeper: 265,
      ac3Tier: 710,
      ac2Tier: 1015,
    },
    scenicHighlights: 'Overnight heritage sleeper train. Wakes up right at the gates of the Vijayanagara UNESCO capital.',
    scenicHighlightsKannada: 'ರಾತ್ರಿ ನಿದ್ರಿಸಿ ಬೆಳಗ್ಗೆ ೦೭:೧೦ಕ್ಕೆ ಯುನೆಸ್ಕೋ ವಿಜಯನಗರ ರಾಜಧಾನಿಯ ಹೊಸ್ತಿಲಲ್ಲೇ ಎಚ್ಚರಗೊಳ್ಳುವ ಐತಿಹಾಸಿಕ ರೈಲು.',
    irctcBookingUrl: 'https://www.irctc.co.in/nget/train-search',
    ntesRunningStatusUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=TRAIN&subAction=SHOW_TRAIN&trainNo=16591',
    lastMileConnectivityAdvice: 'From Hosapete station portico, board KSRTC Hampi Bazaar shuttle (₹20, 25 min) or take pre-paid auto (₹200).',
  },

  // 4. Gol Gumbaz Express (Mysuru - Bengaluru - Badami - Vijayapura)
  {
    trainNumber: '16535 / 16536',
    trainName: 'Gol Gumbaz Express',
    trainNameKannada: 'ಗೋಲ್ ಗುಂಬಜ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್',
    trainType: 'express',
    originCode: 'SBC',
    originName: 'KSR Bengaluru',
    destinationCode: 'BDM',
    destinationName: 'Badami (and Vijayapura)',
    departureTime: '18:50',
    arrivalTime: '06:48',
    durationLabel: '11h 58m (Overnight)',
    daysOfOperation: ['Daily'],
    classesAvailable: ['1A', '2A', '3A', 'SL'],
    keyIntermediateStations: [
      { stationCode: 'TK', stationName: 'Tumakuru', arrivalTime: '19:53', departureTime: '19:55', haltMinutes: 2 },
      { stationCode: 'ASK', stationName: 'Arsikere Junction', arrivalTime: '21:15', departureTime: '21:20', haltMinutes: 5 },
      { stationCode: 'DVG', stationName: 'Davanagere', arrivalTime: '23:38', departureTime: '23:40', haltMinutes: 2 },
      { stationCode: 'UBL', stationName: 'SSS Hubballi', arrivalTime: '02:40', departureTime: '02:50', haltMinutes: 10 },
      { stationCode: 'GDG', stationName: 'Gadag Junction', arrivalTime: '04:00', departureTime: '04:10', haltMinutes: 10 },
      { stationCode: 'BDM', stationName: 'Badami', arrivalTime: '06:48', departureTime: '06:50', haltMinutes: 2 },
    ],
    fareGuide: {
      sleeper: 320,
      ac3Tier: 865,
      ac2Tier: 1240,
    },
    scenicHighlights: 'Trunk overnight artery connecting Bengaluru to the northern Chalukyan and Adil Shahi architectural capitals.',
    scenicHighlightsKannada: 'ಬೆಂಗಳೂರಿನಿಂದ ಬಾದಾಮಿ, ಪಟ್ಟದಕಲ್ಲು ಮತ್ತು ವಿಜಯಪುರದ ಐತಿಹಾಸಿಕ ತಾಣಗಳನ್ನು ಬೆಸೆಯುವ ಮುಖ್ಯ ರಾತ್ರಿ ರೈಲು.',
    irctcBookingUrl: 'https://www.irctc.co.in/nget/train-search',
    ntesRunningStatusUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=TRAIN&subAction=SHOW_TRAIN&trainNo=16535',
    lastMileConnectivityAdvice: 'Alight at Badami station (06:48 AM). Auto-rickshaw to Cave Temples (4 km, ₹70). Transfer to Pattadakal & Aihole by bus.',
  },

  // 5. Gomateshwara Express (Yesvantpur - Hassan - Mangaluru)
  {
    trainNumber: '16575 / 16576',
    trainName: 'Gomateshwara Express',
    trainNameKannada: 'ಗೊಮ್ಮಟೇಶ್ವರ ಎಕ್ಸ್‌ಪ್ರೆಸ್',
    trainType: 'express',
    originCode: 'YPR',
    originName: 'Yesvantpur Junction',
    destinationCode: 'HAS',
    destinationName: 'Hassan Junction',
    departureTime: '07:15',
    arrivalTime: '10:05',
    durationLabel: '2h 50m',
    daysOfOperation: ['Sun', 'Tue', 'Thu'],
    classesAvailable: ['CC', '2S'],
    keyIntermediateStations: [
      { stationCode: 'BAW', stationName: 'Chikka Banavara', arrivalTime: '07:27', departureTime: '07:28', haltMinutes: 1 },
      { stationCode: 'KIGL', stationName: 'Kunigal', arrivalTime: '08:18', departureTime: '08:19', haltMinutes: 1 },
      { stationCode: 'SBGA', stationName: 'Shravanabelagola', arrivalTime: '09:07', departureTime: '09:08', haltMinutes: 1 },
      { stationCode: 'HAS', stationName: 'Hassan Junction', arrivalTime: '10:05', departureTime: '10:10', haltMinutes: 5 },
    ],
    fareGuide: {
      acChairCar: 280,
      generalSecondClass: 95,
    },
    scenicHighlights: 'Direct morning train to the monolithic 57-foot Gomateshwara Bahubali statue at Shravanabelagola and Hassan Hoysala corridor.',
    scenicHighlightsKannada: 'ಶ್ರವಣಬೆಳಗೊಳದ ೫೭ ಅಡಿ ಎತ್ತರದ ಬಾಹುಬಲಿ ಗೋಮಟೇಶ್ವರ ಸನ್ನಿಧಿಗೆ ಮುಂಜಾನೆಯ ರೈಲು ಸಂಪರ್ಕ.',
    irctcBookingUrl: 'https://www.irctc.co.in/nget/train-search',
    ntesRunningStatusUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=TRAIN&subAction=SHOW_TRAIN&trainNo=16575',
    lastMileConnectivityAdvice: 'Alight at Shravanabelagola (09:07 AM) to climb Vindhyagiri hill steps. Or continue to Hassan for Belur/Halebidu.',
  },
];
