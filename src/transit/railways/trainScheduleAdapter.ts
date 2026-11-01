/**
 * @file src/transit/railways/trainScheduleAdapter.ts
 * @description Master timetable adapter for verified Karnataka passenger & express trains.
 * Sourced from Indian Railways NTES & South Western Railway public gazette.
 * Strictly separates directions:
 *   - Train 16592: Northbound (Mysuru / SBC KSR Bengaluru -> Hosapete / Hampi -> Hubballi)
 *   - Train 16591: Southbound (Hubballi -> Hosapete / Hampi -> SBC KSR Bengaluru -> Mysuru)
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
  // 1A. Train 16592: Hampi Express (Northbound: Bengaluru -> Hosapete / Hampi)
  {
    trainNumber: '16592',
    trainName: 'Hampi Express (Northbound: SBC to HPT)',
    trainNameKannada: 'ಹಂಪಿ ಎಕ್ಸ್‌ಪ್ರೆಸ್ (ಉತ್ತರಮುಖಿ: ಬೆಂಗಳೂರು - ಹೊಸಪೇಟೆ)',
    trainType: 'express',
    originCode: 'SBC',
    originName: 'KSR Bengaluru (Majestic)',
    destinationCode: 'HPT',
    destinationName: 'Hosapete Junction (Hampi Gateway)',
    departureTime: '21:50',
    arrivalTime: '07:10',
    durationLabel: '9h 20m (Overnight)',
    daysOfOperation: ['Daily'],
    classesAvailable: ['1A', '2A', '3A', 'SL'],
    keyIntermediateStations: [
      { stationCode: 'MYS', stationName: 'Mysuru Junction (Origin)', arrivalTime: '18:15', departureTime: '18:15', haltMinutes: 0 },
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '21:40', departureTime: '21:50', haltMinutes: 10 },
      { stationCode: 'YPR', stationName: 'Yesvantpur Junction', arrivalTime: '22:00', departureTime: '22:02', haltMinutes: 2 },
      { stationCode: 'TK', stationName: 'Tumakuru', arrivalTime: '22:58', departureTime: '23:00', haltMinutes: 2 },
      { stationCode: 'CTA', stationName: 'Chitradurga', arrivalTime: '02:40', departureTime: '02:42', haltMinutes: 2 },
      { stationCode: 'BAY', stationName: 'Ballari Junction', arrivalTime: '05:35', departureTime: '05:40', haltMinutes: 5 },
      { stationCode: 'HPT', stationName: 'Hosapete Junction', arrivalTime: '07:10', departureTime: '07:15', haltMinutes: 5 },
      { stationCode: 'UBL', stationName: 'SSS Hubballi (Terminus)', arrivalTime: '10:10', departureTime: '10:10', haltMinutes: 0 },
    ],
    fareGuide: {
      sleeper: 265,
      ac3Tier: 710,
      ac2Tier: 1015,
    },
    scenicHighlights: 'Overnight heritage sleeper train. Board at Bengaluru Majestic at night; wake up at dawn right at the threshold of the Vijayanagara UNESCO capital.',
    scenicHighlightsKannada: 'ರಾತ್ರಿ ನಿದ್ರಿಸಿ ಬೆಳಗ್ಗೆ ೦೭:೧೦ಕ್ಕೆ ಯುನೆಸ್ಕೋ ವಿಜಯನಗರ ರಾಜಧಾನಿಯ ಹೊಸ್ತಿಲಲ್ಲೇ ಎಚ್ಚರಗೊಳ್ಳುವ ಐತಿಹಾಸಿಕ ರೈಲು.',
    irctcBookingUrl: 'https://www.irctc.co.in/nget/train-search',
    ntesRunningStatusUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=TRAIN&subAction=SHOW_TRAIN&trainNo=16592',
    lastMileConnectivityAdvice: 'From Hosapete station portico, board KSRTC Hampi Bazaar shuttle (₹20, 25 min) or take pre-paid auto (₹200 direct to Vittala / Virupaksha).',
  },

  // 1B. Train 16591: Hampi Express (Southbound: Hosapete / Hampi -> Bengaluru)
  {
    trainNumber: '16591',
    trainName: 'Hampi Express (Southbound: HPT to SBC)',
    trainNameKannada: 'ಹಂಪಿ ಎಕ್ಸ್‌ಪ್ರೆಸ್ (ದಕ್ಷಿಣಮುಖಿ: ಹೊಸಪೇಟೆ - ಬೆಂಗಳೂರು)',
    trainType: 'express',
    originCode: 'HPT',
    originName: 'Hosapete Junction (Hampi Gateway)',
    destinationCode: 'SBC',
    destinationName: 'KSR Bengaluru (Majestic)',
    departureTime: '21:10',
    arrivalTime: '06:10',
    durationLabel: '9h 00m (Overnight)',
    daysOfOperation: ['Daily'],
    classesAvailable: ['1A', '2A', '3A', 'SL'],
    keyIntermediateStations: [
      { stationCode: 'UBL', stationName: 'SSS Hubballi (Origin)', arrivalTime: '18:30', departureTime: '18:30', haltMinutes: 0 },
      { stationCode: 'HPT', stationName: 'Hosapete Junction', arrivalTime: '21:05', departureTime: '21:10', haltMinutes: 5 },
      { stationCode: 'BAY', stationName: 'Ballari Junction', arrivalTime: '22:20', departureTime: '22:25', haltMinutes: 5 },
      { stationCode: 'CTA', stationName: 'Chitradurga', arrivalTime: '01:05', departureTime: '01:07', haltMinutes: 2 },
      { stationCode: 'TK', stationName: 'Tumakuru', arrivalTime: '04:38', departureTime: '04:40', haltMinutes: 2 },
      { stationCode: 'YPR', stationName: 'Yesvantpur Junction', arrivalTime: '05:30', departureTime: '05:32', haltMinutes: 2 },
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '06:10', departureTime: '06:20', haltMinutes: 10 },
      { stationCode: 'MYS', stationName: 'Mysuru Junction (Terminus)', arrivalTime: '08:50', departureTime: '08:50', haltMinutes: 0 },
    ],
    fareGuide: {
      sleeper: 265,
      ac3Tier: 710,
      ac2Tier: 1015,
    },
    scenicHighlights: 'Board at Hosapete after a full day exploring Hampi ruins and sunset on Matanga Hill; wake up in central Bengaluru refreshed.',
    scenicHighlightsKannada: 'ಹಂಪಿಯ ಸೂರ್ಯಾಸ್ತ ವೀಕ್ಷಿಸಿದ ನಂತರ ರಾತ್ರಿ ಹೊಸಪೇಟೆಯಲ್ಲಿ ರೈಲು ಹತ್ತಿ, ಬೆಳಗಾಗುವಷ್ಟರಲ್ಲಿ ಬೆಂಗಳೂರು ತಲುಪುವ ಅತ್ಯಂತ ಆರಾಮದಾಯಕ ಪಯಣ.',
    irctcBookingUrl: 'https://www.irctc.co.in/nget/train-search',
    ntesRunningStatusUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=TRAIN&subAction=SHOW_TRAIN&trainNo=16591',
    lastMileConnectivityAdvice: 'Arrives KSR Bengaluru Platform 1/2 at 06:10 AM. Immediate seamless access to Namma Metro Purple & Green lines via footbridge.',
  },

  // 2A. Train 20608: Mysuru -> Bengaluru -> Chennai Vande Bharat Express
  {
    trainNumber: '20608',
    trainName: 'Mysuru - MGR Chennai Central Vande Bharat Express (via SBC)',
    trainNameKannada: 'ಮೈಸೂರು - ಎಂ.ಜಿ.ಆರ್ ಚೆನ್ನೈ ಸೆಂಟ್ರಲ್ ವಂದೇ ಭಾರತ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್',
    trainType: 'vande_bharat',
    originCode: 'MYS',
    originName: 'Mysuru Junction',
    destinationCode: 'MAS',
    destinationName: 'MGR Chennai Central (calls SBC 14:50)',
    departureTime: '13:05',
    arrivalTime: '19:20',
    durationLabel: '6h 15m (1h 45m to SBC)',
    daysOfOperation: ['Daily except Wednesday'],
    classesAvailable: ['CC', 'EC'],
    keyIntermediateStations: [
      { stationCode: 'MYS', stationName: 'Mysuru Junction', arrivalTime: '13:05', departureTime: '13:05', haltMinutes: 0 },
      { stationCode: 'MYA', stationName: 'Mandya', arrivalTime: '13:38', departureTime: '13:39', haltMinutes: 1 },
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '14:50', departureTime: '15:00', haltMinutes: 10 },
      { stationCode: 'KPD', stationName: 'Katpadi Junction', arrivalTime: '17:33', departureTime: '17:35', haltMinutes: 2 },
      { stationCode: 'MAS', stationName: 'MGR Chennai Central', arrivalTime: '19:20', departureTime: '19:20', haltMinutes: 0 },
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

  // 2B. Train 20607: Chennai -> Bengaluru -> Mysuru Vande Bharat Express
  {
    trainNumber: '20607',
    trainName: 'MGR Chennai Central - Mysuru Vande Bharat Express (via SBC)',
    trainNameKannada: 'ಎಂ.ಜಿ.ಆರ್ ಚೆನ್ನೈ ಸೆಂಟ್ರಲ್ - ಮೈಸೂರು ವಂದೇ ಭಾರತ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್',
    trainType: 'vande_bharat',
    originCode: 'MAS',
    originName: 'MGR Chennai Central',
    destinationCode: 'MYS',
    destinationName: 'Mysuru Junction (calls SBC 10:15)',
    departureTime: '05:50',
    arrivalTime: '12:20',
    durationLabel: '6h 30m (2h 00m ex-SBC)',
    daysOfOperation: ['Daily except Wednesday'],
    classesAvailable: ['CC', 'EC'],
    keyIntermediateStations: [
      { stationCode: 'MAS', stationName: 'MGR Chennai Central', arrivalTime: '05:50', departureTime: '05:50', haltMinutes: 0 },
      { stationCode: 'KPD', stationName: 'Katpadi Junction', arrivalTime: '07:13', departureTime: '07:15', haltMinutes: 2 },
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '10:15', departureTime: '10:20', haltMinutes: 5 },
      { stationCode: 'MYA', stationName: 'Mandya', arrivalTime: '11:30', departureTime: '11:31', haltMinutes: 1 },
      { stationCode: 'MYS', stationName: 'Mysuru Junction', arrivalTime: '12:20', departureTime: '12:20', haltMinutes: 0 },
    ],
    fareGuide: {
      acChairCar: 380,
      acExecutiveChairCar: 760,
    },
    scenicHighlights: 'Morning express to Mysuru Palace and Chamundi Hills. Clean aerodynamic high-speed corridor with regional breakfast.',
    scenicHighlightsKannada: 'ಬೆಂಗಳೂರಿನಿಂದ ಮೈಸೂರಿಗೆ ಕೇವಲ ೨ ಗಂಟೆಗಳ ಹೈ-ಸ್ಪೀಡ್ ಪ್ರಯಾಣ, ಮೈಸೂರು ಅರಮನೆ ಭೇಟಿಗೆ ಅತ್ಯುತ್ತಮ ಮುಂಜಾನೆಯ ರೈಲು.',
    irctcBookingUrl: 'https://www.irctc.co.in/nget/train-search',
    ntesRunningStatusUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=TRAIN&subAction=SHOW_TRAIN&trainNo=20607',
    lastMileConnectivityAdvice: 'Alight at Mysuru Junction. Prepaid auto stand at Platform 1 portico connects directly to Mysore Palace (3 km, ₹50).',
  },

  // 3A. Train 16539: Western Ghat Vistadome Express (Yesvantpur -> Mangaluru via Sakleshpur)
  {
    trainNumber: '16539',
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

  // 3B. Train 16540: Western Ghat Vistadome Express (Mangaluru -> Yesvantpur via Sakleshpur)
  {
    trainNumber: '16540',
    trainName: 'Mangaluru - Yesvantpur Western Ghat Vistadome Express',
    trainNameKannada: 'ಮಂಗಳೂರು - ಯಶವಂತಪುರ ಪಶ್ಚಿಮ ಘಟ್ಟ ವಿಸ್ಟಾಡೋಮ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್',
    trainType: 'vistadome_express',
    originCode: 'MAJN',
    originName: 'Mangaluru Junction',
    destinationCode: 'YPR',
    destinationName: 'Yesvantpur Junction (Bengaluru)',
    departureTime: '09:15',
    arrivalTime: '19:05',
    durationLabel: '9h 50m',
    daysOfOperation: ['Daily'],
    classesAvailable: ['EV', 'CC', '2S'],
    keyIntermediateStations: [
      { stationCode: 'SBHR', stationName: 'Subrahmanya Road', arrivalTime: '11:10', departureTime: '11:15', haltMinutes: 5 },
      { stationCode: 'SKLR', stationName: 'Sakleshpur', arrivalTime: '14:40', departureTime: '14:55', haltMinutes: 15 },
      { stationCode: 'HAS', stationName: 'Hassan Junction', arrivalTime: '16:05', departureTime: '16:10', haltMinutes: 5 },
      { stationCode: 'YPR', stationName: 'Yesvantpur Junction', arrivalTime: '19:05', departureTime: '19:05', haltMinutes: 0 },
    ],
    fareGuide: {
      vistadome: 690,
      acChairCar: 420,
      generalSecondClass: 165,
    },
    scenicHighlights: 'Daytime Ghat ascent through the Western Ghats mountain pass into the Deccan plateau with observation lounge.',
    scenicHighlightsKannada: 'ಕರಾವಳಿಯಿಂದ ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಸುರಂಗಗಳ ಮೂಲಕ ಮಲೆನಾಡನ್ನು ಹತ್ತಿ ಬೆಂಗಳೂರು ಸೇರುವ ಸುಂದರ ಪ್ರಕೃತಿ ಸಿರಿಯ ಪಯಣ.',
    irctcBookingUrl: 'https://www.irctc.co.in/nget/train-search',
    ntesRunningStatusUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=TRAIN&subAction=SHOW_TRAIN&trainNo=16540',
    lastMileConnectivityAdvice: 'Arrives Yesvantpur Junction Platform 1. Connects directly to Green Line Metro at Yeshwantpur station.',
  },

  // 4A. Train 16535: Gol Gumbaz Express (Bengaluru -> Badami -> Vijayapura)
  {
    trainNumber: '16535',
    trainName: 'Gol Gumbaz Express (Bengaluru to Badami / Vijayapura)',
    trainNameKannada: 'ಗೋಲ್ ಗುಂಬಜ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್ (ಬೆಂಗಳೂರು - ಬಾದಾಮಿ)',
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

  // 4B. Train 16536: Gol Gumbaz Express (Badami -> Bengaluru -> Mysuru)
  {
    trainNumber: '16536',
    trainName: 'Gol Gumbaz Express (Badami to Bengaluru)',
    trainNameKannada: 'ಗೋಲ್ ಗುಂಬಜ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್ (ಬಾದಾಮಿ - ಬೆಂಗಳೂರು)',
    trainType: 'express',
    originCode: 'BDM',
    originName: 'Badami',
    destinationCode: 'SBC',
    destinationName: 'KSR Bengaluru',
    departureTime: '19:30',
    arrivalTime: '07:45',
    durationLabel: '12h 15m (Overnight)',
    daysOfOperation: ['Daily'],
    classesAvailable: ['1A', '2A', '3A', 'SL'],
    keyIntermediateStations: [
      { stationCode: 'BDM', stationName: 'Badami', arrivalTime: '19:28', departureTime: '19:30', haltMinutes: 2 },
      { stationCode: 'GDG', stationName: 'Gadag Junction', arrivalTime: '21:05', departureTime: '21:15', haltMinutes: 10 },
      { stationCode: 'UBL', stationName: 'SSS Hubballi', arrivalTime: '22:40', departureTime: '22:50', haltMinutes: 10 },
      { stationCode: 'DVG', stationName: 'Davanagere', arrivalTime: '01:28', departureTime: '01:30', haltMinutes: 2 },
      { stationCode: 'ASK', stationName: 'Arsikere Junction', arrivalTime: '04:10', departureTime: '04:15', haltMinutes: 5 },
      { stationCode: 'TK', stationName: 'Tumakuru', arrivalTime: '05:58', departureTime: '06:00', haltMinutes: 2 },
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '07:45', departureTime: '07:55', haltMinutes: 10 },
      { stationCode: 'MYS', stationName: 'Mysuru Junction (Terminus)', arrivalTime: '10:45', departureTime: '10:45', haltMinutes: 0 },
    ],
    fareGuide: {
      sleeper: 320,
      ac3Tier: 865,
      ac2Tier: 1240,
    },
    scenicHighlights: 'Board at Badami station after sunset over Agastya Lake; arrive in Bengaluru for a productive morning.',
    scenicHighlightsKannada: 'ಬಾದಾಮಿ ಗುಹೆಗಳ ದರ್ಶನದ ನಂತರ ಸಂಜೆ ರೈಲು ಹತ್ತಿ ಮುಂಜಾನೆ ಬೆಂಗಳೂರು ತಲುಪುವ ಸುಲಭ ಸಾರಿಗೆ.',
    irctcBookingUrl: 'https://www.irctc.co.in/nget/train-search',
    ntesRunningStatusUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=TRAIN&subAction=SHOW_TRAIN&trainNo=16536',
    lastMileConnectivityAdvice: 'Arrives KSR Bengaluru Platform 5 at 07:45 AM. Connects directly to BMTC bus stands and metro.',
  },

  // 5A. Train 16575: Gomateshwara Express (Yesvantpur -> Shravanabelagola -> Hassan)
  {
    trainNumber: '16575',
    trainName: 'Gomateshwara Express (Yesvantpur to Hassan / Mangaluru)',
    trainNameKannada: 'ಗೊಮ್ಮಟೇಶ್ವರ ಎಕ್ಸ್‌ಪ್ರೆಸ್ (ಯಶವಂತಪುರ - ಹಾಸನ)',
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

  // 5B. Train 16576: Gomateshwara Express (Hassan -> Shravanabelagola -> Yesvantpur)
  {
    trainNumber: '16576',
    trainName: 'Gomateshwara Express (Hassan to Yesvantpur)',
    trainNameKannada: 'ಗೊಮ್ಮಟೇಶ್ವರ ಎಕ್ಸ್‌ಪ್ರೆಸ್ (ಹಾಸನ - ಯಶವಂತಪುರ)',
    trainType: 'express',
    originCode: 'HAS',
    originName: 'Hassan Junction',
    destinationCode: 'YPR',
    destinationName: 'Yesvantpur Junction',
    departureTime: '16:15',
    arrivalTime: '20:15',
    durationLabel: '4h 00m',
    daysOfOperation: ['Mon', 'Wed', 'Fri'],
    classesAvailable: ['CC', '2S'],
    keyIntermediateStations: [
      { stationCode: 'HAS', stationName: 'Hassan Junction', arrivalTime: '16:10', departureTime: '16:15', haltMinutes: 5 },
      { stationCode: 'SBGA', stationName: 'Shravanabelagola', arrivalTime: '17:15', departureTime: '17:16', haltMinutes: 1 },
      { stationCode: 'KIGL', stationName: 'Kunigal', arrivalTime: '18:14', departureTime: '18:15', haltMinutes: 1 },
      { stationCode: 'YPR', stationName: 'Yesvantpur Junction', arrivalTime: '20:15', departureTime: '20:15', haltMinutes: 0 },
    ],
    fareGuide: {
      acChairCar: 280,
      generalSecondClass: 95,
    },
    scenicHighlights: 'Evening return train from Hassan and Shravanabelagola to Bengaluru.',
    scenicHighlightsKannada: 'ಬೇಲೂರು, ಹಳೇಬೀಡು ಹಾಗೂ ಶ್ರವಣಬೆಳಗೊಳದ ಪ್ರವಾಸ ಮುಗಿಸಿ ಸಂಜೆ ಬೆಂಗಳೂರಿಗೆ ಮರಳುವ ಅನುಕೂಲಕರ ರೈಲು.',
    irctcBookingUrl: 'https://www.irctc.co.in/nget/train-search',
    ntesRunningStatusUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=TRAIN&subAction=SHOW_TRAIN&trainNo=16576',
    lastMileConnectivityAdvice: 'Arrives Yesvantpur Junction at 20:15. Metro connection available right outside the station gate.',
  },

  // 6A. Train 20661: KSR Bengaluru -> Dharwad Vande Bharat Express (via UBL)
  {
    trainNumber: '20661',
    trainName: 'KSR Bengaluru - Dharwad Vande Bharat Express',
    trainNameKannada: 'ಕೆ.ಎಸ್.ಆರ್ ಬೆಂಗಳೂರು - ಧಾರವಾಡ ವಂದೇ ಭಾರತ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್',
    trainType: 'vande_bharat',
    originCode: 'SBC',
    originName: 'KSR Bengaluru',
    destinationCode: 'DWR',
    destinationName: 'Dharwad (via SSS Hubballi)',
    departureTime: '05:45',
    arrivalTime: '11:15',
    durationLabel: '5h 30m',
    daysOfOperation: ['Daily except Tuesday'],
    classesAvailable: ['CC', 'EC'],
    keyIntermediateStations: [
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '05:45', departureTime: '05:45', haltMinutes: 0 },
      { stationCode: 'YPR', stationName: 'Yesvantpur Junction', arrivalTime: '05:55', departureTime: '05:57', haltMinutes: 2 },
      { stationCode: 'DVG', stationName: 'Davanagere', arrivalTime: '09:15', departureTime: '09:17', haltMinutes: 2 },
      { stationCode: 'UBL', stationName: 'SSS Hubballi Junction', arrivalTime: '10:45', departureTime: '10:50', haltMinutes: 5 },
      { stationCode: 'DWR', stationName: 'Dharwad', arrivalTime: '11:15', departureTime: '11:15', haltMinutes: 0 },
    ],
    fareGuide: {
      acChairCar: 635,
      acExecutiveChairCar: 1250,
    },
    scenicHighlights: 'Semi-high-speed express corridor connecting Bengaluru to Davanagere benne dosa country, Hubballi Platform 1, and Dharwad peda heartland.',
    scenicHighlightsKannada: 'ಬೆಂಗಳೂರಿನಿಂದ ದಾವಣಗೆರೆ, ಹುಬ್ಬಳ್ಳಿ ಹಾಗೂ ಧಾರವಾಡಕ್ಕೆ ಕೇವಲ ೫ ಗಂಟೆ ೩೦ ನಿಮಿಷಗಳ ಅತಿವೇಗದ ವಂದೇ ಭಾರತ್ ಸಂಪರ್ಕ.',
    irctcBookingUrl: 'https://www.irctc.co.in/nget/train-search',
    ntesRunningStatusUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=TRAIN&subAction=SHOW_TRAIN&trainNo=20661',
    lastMileConnectivityAdvice: 'Connects at SSS Hubballi to Chigari BRTS corridor and KSRTC luxury buses to Badami (2h) and Hampi (2h).',
  },

  // 6B. Train 20662: Dharwad -> KSR Bengaluru Vande Bharat Express (via UBL)
  {
    trainNumber: '20662',
    trainName: 'Dharwad - KSR Bengaluru Vande Bharat Express',
    trainNameKannada: 'ಧಾರವಾಡ - ಕೆ.ಎಸ್.ಆರ್ ಬೆಂಗಳೂರು ವಂದೇ ಭಾರತ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್',
    trainType: 'vande_bharat',
    originCode: 'DWR',
    originName: 'Dharwad',
    destinationCode: 'SBC',
    destinationName: 'KSR Bengaluru',
    departureTime: '13:15',
    arrivalTime: '19:10',
    durationLabel: '5h 55m',
    daysOfOperation: ['Daily except Tuesday'],
    classesAvailable: ['CC', 'EC'],
    keyIntermediateStations: [
      { stationCode: 'DWR', stationName: 'Dharwad', arrivalTime: '13:15', departureTime: '13:15', haltMinutes: 0 },
      { stationCode: 'UBL', stationName: 'SSS Hubballi Junction', arrivalTime: '13:35', departureTime: '13:40', haltMinutes: 5 },
      { stationCode: 'DVG', stationName: 'Davanagere', arrivalTime: '15:00', departureTime: '15:02', haltMinutes: 2 },
      { stationCode: 'YPR', stationName: 'Yesvantpur Junction', arrivalTime: '18:50', departureTime: '18:52', haltMinutes: 2 },
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '19:10', departureTime: '19:10', haltMinutes: 0 },
    ],
    fareGuide: {
      acChairCar: 635,
      acExecutiveChairCar: 1250,
    },
    scenicHighlights: 'Afternoon return semi-high-speed express from North Karnataka twin cities to Bengaluru.',
    scenicHighlightsKannada: 'ಧಾರವಾಡ ಹಾಗೂ ಹುಬ್ಬಳ್ಳಿಯಿಂದ ಮಧ್ಯಾಹ್ನ ಹೊರಟು ಸಂಜೆ ಬೆಂಗಳೂರು ತಲುಪುವ ಅತ್ಯುತ್ತಮ ರೈಲು.',
    irctcBookingUrl: 'https://www.irctc.co.in/nget/train-search',
    ntesRunningStatusUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=TRAIN&subAction=SHOW_TRAIN&trainNo=20662',
    lastMileConnectivityAdvice: 'Arrives KSR Bengaluru Platform 8. Direct access to Namma Metro interchange.',
  },

  // 7A. Train 16589: Rani Chennamma Express (SBC -> MRJ) - Express, NOT Vande Bharat!
  {
    trainNumber: '16589',
    trainName: 'Rani Chennamma Express (Bengaluru to Hubballi / Belagavi)',
    trainNameKannada: 'ರಾಣಿ ಚೆನ್ನಮ್ಮ ಎಕ್ಸ್‌ಪ್ರೆಸ್ (ಬೆಂಗಳೂರು - ಹುಬ್ಬಳ್ಳಿ - ಬೆಳಗಾವಿ)',
    trainType: 'express',
    originCode: 'SBC',
    originName: 'KSR Bengaluru',
    destinationCode: 'MRJ',
    destinationName: 'Miraj Junction (via Hubballi, Belagavi)',
    departureTime: '23:00',
    arrivalTime: '08:35 (to BGM)',
    durationLabel: '9h 35m (to Belagavi)',
    daysOfOperation: ['Daily'],
    classesAvailable: ['1A', '2A', '3A', 'SL', '2S'],
    keyIntermediateStations: [
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '23:00', departureTime: '23:00', haltMinutes: 0 },
      { stationCode: 'YPR', stationName: 'Yesvantpur Junction', arrivalTime: '23:10', departureTime: '23:12', haltMinutes: 2 },
      { stationCode: 'TK', stationName: 'Tumakuru', arrivalTime: '00:01', departureTime: '00:03', haltMinutes: 2 },
      { stationCode: 'ASK', stationName: 'Arsikere Junction', arrivalTime: '01:18', departureTime: '01:23', haltMinutes: 5 },
      { stationCode: 'DVG', stationName: 'Davanagere', arrivalTime: '03:20', departureTime: '03:22', haltMinutes: 2 },
      { stationCode: 'UBL', stationName: 'SSS Hubballi Junction', arrivalTime: '05:40', departureTime: '05:50', haltMinutes: 10 },
      { stationCode: 'DWR', stationName: 'Dharwad', arrivalTime: '06:10', departureTime: '06:12', haltMinutes: 2 },
      { stationCode: 'BGM', stationName: 'Belagavi', arrivalTime: '08:35', departureTime: '08:40', haltMinutes: 5 },
      { stationCode: 'MRJ', stationName: 'Miraj Junction', arrivalTime: '12:00', departureTime: '12:00', haltMinutes: 0 },
    ],
    fareGuide: {
      sleeper: 345,
      ac3Tier: 920,
      ac2Tier: 1330,
      generalSecondClass: 165,
    },
    scenicHighlights: 'Named after Kittur Rani Chennamma. Overnight journey eliminating hotel cost; arrive in Belagavi / Kittur Fort corridor at morning.',
    scenicHighlightsKannada: 'ಕಿತ್ತೂರು ರಾಣಿ ಚೆನ್ನಮ್ಮ ಅವರ ಸ್ಮರಣಾರ್ಥ ನಾಮಕರಣಗೊಂಡ ಜನಪ್ರಿಯ ರಾತ್ರಿ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ರೈಲು.',
    irctcBookingUrl: 'https://www.irctc.co.in/nget/train-search',
    ntesRunningStatusUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=TRAIN&subAction=SHOW_TRAIN&trainNo=16589',
    lastMileConnectivityAdvice: 'Belagavi station connects to Central Bus Stand for NWKRTC buses to Kittur Fort (30 km) and Gokak Falls.',
  },

  // 7B. Train 16590: Rani Chennamma Express (MRJ -> SBC) - Express, NOT Vande Bharat!
  {
    trainNumber: '16590',
    trainName: 'Rani Chennamma Express (Belagavi / Hubballi to Bengaluru)',
    trainNameKannada: 'ರಾಣಿ ಚೆನ್ನಮ್ಮ ಎಕ್ಸ್‌ಪ್ರೆಸ್ (ಬೆಳಗಾವಿ - ಹುಬ್ಬಳ್ಳಿ - ಬೆಂಗಳೂರು)',
    trainType: 'express',
    originCode: 'MRJ',
    originName: 'Miraj Junction',
    destinationCode: 'SBC',
    destinationName: 'KSR Bengaluru',
    departureTime: '15:35',
    arrivalTime: '06:15',
    durationLabel: '14h 40m (overnight from Belagavi dep 18:35)',
    daysOfOperation: ['Daily'],
    classesAvailable: ['1A', '2A', '3A', 'SL', '2S'],
    keyIntermediateStations: [
      { stationCode: 'MRJ', stationName: 'Miraj Junction', arrivalTime: '15:35', departureTime: '15:35', haltMinutes: 0 },
      { stationCode: 'BGM', stationName: 'Belagavi', arrivalTime: '18:30', departureTime: '18:35', haltMinutes: 5 },
      { stationCode: 'DWR', stationName: 'Dharwad', arrivalTime: '21:08', departureTime: '21:10', haltMinutes: 2 },
      { stationCode: 'UBL', stationName: 'SSS Hubballi Junction', arrivalTime: '21:40', departureTime: '21:50', haltMinutes: 10 },
      { stationCode: 'DVG', stationName: 'Davanagere', arrivalTime: '23:45', departureTime: '23:47', haltMinutes: 2 },
      { stationCode: 'ASK', stationName: 'Arsikere Junction', arrivalTime: '02:15', departureTime: '02:20', haltMinutes: 5 },
      { stationCode: 'TK', stationName: 'Tumakuru', arrivalTime: '04:18', departureTime: '04:20', haltMinutes: 2 },
      { stationCode: 'YPR', stationName: 'Yesvantpur Junction', arrivalTime: '05:40', departureTime: '05:42', haltMinutes: 2 },
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '06:15', departureTime: '06:15', haltMinutes: 0 },
    ],
    fareGuide: {
      sleeper: 345,
      ac3Tier: 920,
      ac2Tier: 1330,
      generalSecondClass: 165,
    },
    scenicHighlights: 'Board at Belagavi or Hubballi after North Karnataka tour; arrive in Bengaluru at morning.',
    scenicHighlightsKannada: 'ಉತ್ತರ ಕರ್ನಾಟಕದ ಪ್ರವಾಸ ಮುಗಿಸಿ ರಾತ್ರಿ ಮಲಗಿ ಮುಂಜಾನೆ ಬೆಂಗಳೂರು ತಲುಪಲು ಅತ್ಯಂತ ಪ್ರಶಸ್ತವಾದ ರೈಲು.',
    irctcBookingUrl: 'https://www.irctc.co.in/nget/train-search',
    ntesRunningStatusUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=TRAIN&subAction=SHOW_TRAIN&trainNo=16590',
    lastMileConnectivityAdvice: 'Arrives KSR Bengaluru Platform 5 at 06:15 AM. Direct metro interchange.',
  },

  // 8A. Train 20651: KSR Bengaluru -> Talguppa Intercity Superfast Express
  {
    trainNumber: '20651',
    trainName: 'KSR Bengaluru - Talguppa Intercity Superfast Express',
    trainNameKannada: 'ಕೆ.ಎಸ್.ಆರ್ ಬೆಂಗಳೂರು - ತಾಳಗುಪ್ಪ ಇಂಟರ್‌ಸಿಟಿ ಸೂಪರ್‌ಫಾಸ್ಟ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್',
    trainType: 'superfast',
    originCode: 'SBC',
    originName: 'KSR Bengaluru',
    destinationCode: 'TLGP',
    destinationName: 'Talguppa (Jog Falls Gateway)',
    departureTime: '15:00',
    arrivalTime: '21:45',
    durationLabel: '6h 45m',
    daysOfOperation: ['Daily'],
    classesAvailable: ['CC', '2S'],
    keyIntermediateStations: [
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '15:00', departureTime: '15:00', haltMinutes: 0 },
      { stationCode: 'YPR', stationName: 'Yesvantpur Junction', arrivalTime: '15:10', departureTime: '15:12', haltMinutes: 2 },
      { stationCode: 'TK', stationName: 'Tumakuru', arrivalTime: '16:00', departureTime: '16:02', haltMinutes: 2 },
      { stationCode: 'ASK', stationName: 'Arsikere Junction', arrivalTime: '17:25', departureTime: '17:30', haltMinutes: 5 },
      { stationCode: 'RRB', stationName: 'Birur Junction', arrivalTime: '18:13', departureTime: '18:15', haltMinutes: 2 },
      { stationCode: 'TKE', stationName: 'Tarikere', arrivalTime: '18:41', departureTime: '18:42', haltMinutes: 1 },
      { stationCode: 'BDVT', stationName: 'Bhadravati', arrivalTime: '19:03', departureTime: '19:05', haltMinutes: 2 },
      { stationCode: 'SMET', stationName: 'Shivamogga Town', arrivalTime: '19:40', departureTime: '19:45', haltMinutes: 5 },
      { stationCode: 'ANF', stationName: 'Anandapuram', arrivalTime: '20:49', departureTime: '20:50', haltMinutes: 1 },
      { stationCode: 'SAG', stationName: 'Sagara Jambagaru', arrivalTime: '21:18', departureTime: '21:20', haltMinutes: 2 },
      { stationCode: 'TLGP', stationName: 'Talguppa', arrivalTime: '21:45', departureTime: '21:45', haltMinutes: 0 },
    ],
    fareGuide: {
      acChairCar: 510,
      generalSecondClass: 155,
    },
    scenicHighlights: 'Afternoon Malnad express through Arecanut groves and Sahyadri foothills towards Jog Falls.',
    scenicHighlightsKannada: 'ಮಲೆನಾಡಿನ ಹಸಿರು ಸಿರಿಯ ನಡುವೆ ಸಾಗುವ ಜೋಗ ಜಲಪಾತದ ಹೆಬ್ಬಾಗಿಲಾದ ತಾಳಗುಪ್ಪ ರೈಲು.',
    irctcBookingUrl: 'https://www.irctc.co.in/nget/train-search',
    ntesRunningStatusUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=TRAIN&subAction=SHOW_TRAIN&trainNo=20651',
    lastMileConnectivityAdvice: 'KSRTC local buses connect Talguppa station to Jog Falls (14 km, 25 min, ₹30).',
  },

  // 8B. Train 20652: Talguppa -> KSR Bengaluru Intercity Superfast Express
  {
    trainNumber: '20652',
    trainName: 'Talguppa - KSR Bengaluru Intercity Superfast Express',
    trainNameKannada: 'ತಾಳಗುಪ್ಪ - ಕೆ.ಎಸ್.ಆರ್ ಬೆಂಗಳೂರು ಇಂಟರ್‌ಸಿಟಿ ಸೂಪರ್‌ಫಾಸ್ಟ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್',
    trainType: 'superfast',
    originCode: 'TLGP',
    originName: 'Talguppa (Jog Falls Gateway)',
    destinationCode: 'SBC',
    destinationName: 'KSR Bengaluru',
    departureTime: '05:15',
    arrivalTime: '11:50',
    durationLabel: '6h 35m',
    daysOfOperation: ['Daily'],
    classesAvailable: ['CC', '2S'],
    keyIntermediateStations: [
      { stationCode: 'TLGP', stationName: 'Talguppa', arrivalTime: '05:15', departureTime: '05:15', haltMinutes: 0 },
      { stationCode: 'SAG', stationName: 'Sagara Jambagaru', arrivalTime: '05:32', departureTime: '05:34', haltMinutes: 2 },
      { stationCode: 'ANF', stationName: 'Anandapuram', arrivalTime: '06:04', departureTime: '06:05', haltMinutes: 1 },
      { stationCode: 'SMET', stationName: 'Shivamogga Town', arrivalTime: '07:00', departureTime: '07:05', haltMinutes: 5 },
      { stationCode: 'BDVT', stationName: 'Bhadravati', arrivalTime: '07:23', departureTime: '07:25', haltMinutes: 2 },
      { stationCode: 'TKE', stationName: 'Tarikere', arrivalTime: '07:44', departureTime: '07:45', haltMinutes: 1 },
      { stationCode: 'RRB', stationName: 'Birur Junction', arrivalTime: '08:20', departureTime: '08:22', haltMinutes: 2 },
      { stationCode: 'ASK', stationName: 'Arsikere Junction', arrivalTime: '09:05', departureTime: '09:10', haltMinutes: 5 },
      { stationCode: 'TK', stationName: 'Tumakuru', arrivalTime: '10:25', departureTime: '10:27', haltMinutes: 2 },
      { stationCode: 'YPR', stationName: 'Yesvantpur Junction', arrivalTime: '11:20', departureTime: '11:22', haltMinutes: 2 },
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '11:50', departureTime: '11:50', haltMinutes: 0 },
    ],
    fareGuide: {
      acChairCar: 510,
      generalSecondClass: 155,
    },
    scenicHighlights: 'Morning express from Malnad and Shivamogga to Bengaluru.',
    scenicHighlightsKannada: 'ಶಿವಮೊಗ್ಗ ಹಾಗೂ ಮಲೆನಾಡಿನಿಂದ ಮುಂಜಾನೆ ಹೊರಟು ಮಧ್ಯಾಹ್ನಕ್ಕೆ ಬೆಂಗಳೂರು ತಲುಪುವ ಅತ್ಯುತ್ತಮ ರೈಲು.',
    irctcBookingUrl: 'https://www.irctc.co.in/nget/train-search',
    ntesRunningStatusUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=TRAIN&subAction=SHOW_TRAIN&trainNo=20652',
    lastMileConnectivityAdvice: 'Arrives KSR Bengaluru at 11:50 AM. Direct metro access.',
  },
];
