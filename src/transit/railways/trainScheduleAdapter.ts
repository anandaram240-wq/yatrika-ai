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

  // 2A. Train 20608: Mysuru -> Bengaluru Vande Bharat Express
  {
    trainNumber: '20608',
    trainName: 'Mysuru - KSR Bengaluru - Chennai Vande Bharat Express',
    trainNameKannada: 'ಮೈಸೂರು - ಬೆಂಗಳೂರು - ಚೆನ್ನೈ ವಂದೇ ಭಾರತ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್',
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
      { stationCode: 'MYA', stationName: 'Mandya', arrivalTime: '13:38', departureTime: '13:39', haltMinutes: 1 },
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

  // 2B. Train 20607: Bengaluru -> Mysuru Vande Bharat Express
  {
    trainNumber: '20607',
    trainName: 'Chennai - KSR Bengaluru - Mysuru Vande Bharat Express',
    trainNameKannada: 'ಚೆನ್ನೈ - ಬೆಂಗಳೂರು - ಮೈಸೂರು ವಂದೇ ಭಾರತ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್',
    trainType: 'vande_bharat',
    originCode: 'SBC',
    originName: 'KSR Bengaluru City',
    destinationCode: 'MYS',
    destinationName: 'Mysuru Junction',
    departureTime: '10:20',
    arrivalTime: '12:20',
    durationLabel: '2h 00m',
    daysOfOperation: ['Daily except Wednesday'],
    classesAvailable: ['CC', 'EC'],
    keyIntermediateStations: [
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
];
