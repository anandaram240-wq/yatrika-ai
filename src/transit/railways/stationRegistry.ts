/**
 * @file src/transit/railways/stationRegistry.ts
 * @description Master registry of Karnataka Railway Stations, junctions, and last-mile connections.
 * Sourced from South Western Railway (SWR) & Indian Railways.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface KarnatakaRailwayStation {
  stationCode: string;
  name: string;
  nameKannada: string;
  division: 'SBC' | 'MYS' | 'UBL' | 'PGT' | 'KR';
  railwayZone: string;
  district: string;
  coordinates: [number, number];
  amenities: string[];
  servesDestinations: {
    destinationName: string;
    distanceKm: number;
    recommendedTransfer: string;
  }[];
  ntesEnquiryUrl: string;
}

export const KARNATAKA_RAILWAY_STATIONS: Record<string, KarnatakaRailwayStation> = {
  SBC: {
    stationCode: 'SBC',
    name: 'KSR Bengaluru City Junction (Kranti Veera Sangolli Rayanna)',
    nameKannada: 'ಕ್ರಾಂತಿವೀರ ಸಂಗೊಳ್ಳಿ ರಾಯಣ್ಣ ಬೆಂಗಳೂರು ಸಿಟಿ ಜಂಕ್ಷನ್',
    division: 'SBC',
    railwayZone: 'South Western Railway (SWR)',
    district: 'Bengaluru Urban',
    coordinates: [77.5714, 12.9784],
    amenities: ['Pre-paid Auto', 'Namma Metro Green/Purple interchange', 'Retiring Rooms', 'IRCTC Executive Lounge', 'Escalators', 'Wi-Fi'],
    servesDestinations: [
      { destinationName: 'Bengaluru Palace & Vidhana Soudha', distanceKm: 3.5, recommendedTransfer: 'Namma Metro Purple Line / Auto-rickshaw' },
      { destinationName: 'Bannerghatta National Park', distanceKm: 22.0, recommendedTransfer: 'BMTC 365 bus from Majestic Platform 15' },
    ],
    ntesEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=STN&subAction=FACILITY&stnCode=SBC',
  },
  YPR: {
    stationCode: 'YPR',
    name: 'Yesvantpur Junction',
    nameKannada: 'ಯಶವಂತಪುರ ಜಂಕ್ಷನ್',
    division: 'SBC',
    railwayZone: 'South Western Railway (SWR)',
    district: 'Bengaluru Urban',
    coordinates: [77.5501, 13.0238],
    amenities: ['Namma Metro Green Line connection', 'Pre-paid Auto', 'Retiring Rooms', 'Escalators', 'Wi-Fi'],
    servesDestinations: [
      { destinationName: 'Bengaluru ISKCON Temple', distanceKm: 2.0, recommendedTransfer: 'Namma Metro Green Line or local auto (₹40)' },
      { destinationName: 'Western Ghats Vistadome Departure Portico', distanceKm: 0.1, recommendedTransfer: 'Platform 1 executive lounge' },
    ],
    ntesEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=STN&subAction=FACILITY&stnCode=YPR',
  },
  MAJN: {
    stationCode: 'MAJN',
    name: 'Mangaluru Junction',
    nameKannada: 'ಮಂಗಳೂರು ಜಂಕ್ಷನ್ (ಕಂಕನಾಡಿ)',
    division: 'PGT',
    railwayZone: 'Southern Railway (SR)',
    district: 'Dakshina Kannada',
    coordinates: [74.8732, 12.8687],
    amenities: ['Pre-paid Auto', 'Retiring Rooms', 'Waiting Hall', 'Wi-Fi'],
    servesDestinations: [
      { destinationName: 'Mangaluru City & Panambur Beach', distanceKm: 8.0, recommendedTransfer: 'Local pre-paid auto or KSRTC city bus' },
      { destinationName: 'Udupi Sri Krishna Matha', distanceKm: 60.0, recommendedTransfer: 'Express bus via NH-66 or passenger train' },
    ],
    ntesEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=STN&subAction=FACILITY&stnCode=MAJN',
  },
  SBGA: {
    stationCode: 'SBGA',
    name: 'Shravanabelagola Railway Station',
    nameKannada: 'ಶ್ರವಣಬೆಳಗೊಳ ರೈಲ್ವೆ ನಿಲ್ದಾಣ',
    division: 'MYS',
    railwayZone: 'South Western Railway (SWR)',
    district: 'Hassan',
    coordinates: [76.4950, 12.8550],
    amenities: ['Passenger Shelter', 'Auto Stand', 'Drinking Water'],
    servesDestinations: [
      { destinationName: 'Vindhyagiri Hill & 57-ft Bahubali Gommateshwara', distanceKm: 2.5, recommendedTransfer: 'Local auto-rickshaw (₹50)' },
    ],
    ntesEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=STN&subAction=FACILITY&stnCode=SBGA',
  },
  MYS: {
    stationCode: 'MYS',
    name: 'Mysuru Junction',
    nameKannada: 'ಮೈಸೂರು ಜಂಕ್ಷನ್',
    division: 'MYS',
    railwayZone: 'South Western Railway (SWR)',
    district: 'Mysuru',
    coordinates: [76.6433, 12.3160],
    amenities: ['Pre-paid Auto booth', 'Tourist Facilitation Counter', 'Retiring Rooms', 'Battery Buggy', 'Free High-speed Wi-Fi'],
    servesDestinations: [
      { destinationName: 'Mysuru Palace', distanceKm: 2.2, recommendedTransfer: 'Pre-paid auto (Platform 1 counter, ~₹50) or City Bus 201' },
      { destinationName: 'Chamundi Hills', distanceKm: 12.0, recommendedTransfer: 'City Bus 201 from station bus stand' },
      { destinationName: 'Srirangapatna Heritage Island', distanceKm: 15.0, recommendedTransfer: 'Local passenger train or KSRTC express bus' },
    ],
    ntesEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=STN&subAction=FACILITY&stnCode=MYS',
  },
  HAS: {
    stationCode: 'HAS',
    name: 'Hassan Junction',
    nameKannada: 'ಹಾಸನ ಜಂಕ್ಷನ್',
    division: 'MYS',
    railwayZone: 'South Western Railway (SWR)',
    district: 'Hassan',
    coordinates: [76.1042, 13.0069],
    amenities: ['Retiring Rooms', 'KSRTC Connecting Bus counter', 'Auto Stand', 'Waiting Hall'],
    servesDestinations: [
      { destinationName: 'Belur Chennakeshava Temple', distanceKm: 38.0, recommendedTransfer: 'KSRTC Non-stop bus from Hassan New Bus Stand (every 15 min, ₹45)' },
      { destinationName: 'Halebidu Hoysaleshwara Temple', distanceKm: 31.0, recommendedTransfer: 'KSRTC shuttle bus from Hassan (every 30 min, ₹40)' },
      { destinationName: 'Shettihalli Submerged Church', distanceKm: 22.0, recommendedTransfer: 'Local taxi / auto via Gorur road' },
    ],
    ntesEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=STN&subAction=FACILITY&stnCode=HAS',
  },
  HPT: {
    stationCode: 'HPT',
    name: 'Hosapete Junction (Hampi Gateway)',
    nameKannada: 'ಹೊಸಪೇಟೆ ಜಂಕ್ಷನ್ (ಹಂಪಿ ದ್ವಾರ)',
    division: 'UBL',
    railwayZone: 'South Western Railway (SWR)',
    district: 'Vijayanagara',
    coordinates: [76.3884, 15.2750],
    amenities: ['KSTDC Tourist Information Desk', 'Retiring Rooms', 'Pre-paid Auto booth', 'Heritage murals'],
    servesDestinations: [
      { destinationName: 'Hampi Sacred Ruins & Virupaksha Temple', distanceKm: 13.0, recommendedTransfer: 'KSRTC shuttle bus directly from station entrance to Hampi Bazaar (₹20, every 30 min)' },
      { destinationName: 'Tungabhadra Dam & Japanese Gardens', distanceKm: 6.5, recommendedTransfer: 'Auto-rickshaw or local city bus' },
    ],
    ntesEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=STN&subAction=FACILITY&stnCode=HPT',
  },
  BDM: {
    stationCode: 'BDM',
    name: 'Badami Railway Station',
    nameKannada: 'ಬಾದಾಮಿ ರೈಲ್ವೆ ನಿಲ್ದಾಣ',
    division: 'UBL',
    railwayZone: 'South Western Railway (SWR)',
    district: 'Bagalkote',
    coordinates: [75.6983, 15.9183],
    amenities: ['Waiting Hall', 'Auto Stand', 'Drinking Water'],
    servesDestinations: [
      { destinationName: 'Badami Cave Temples & Agastya Lake', distanceKm: 4.5, recommendedTransfer: 'Local auto-rickshaw (₹60-₹80)' },
      { destinationName: 'Pattadakal UNESCO World Heritage Complex', distanceKm: 22.0, recommendedTransfer: 'NWKRTC shuttle bus from Badami bus stand (₹30)' },
      { destinationName: 'Aihole Durga Temple & Heritage Complex', distanceKm: 35.0, recommendedTransfer: 'NWKRTC shuttle bus or day taxi' },
    ],
    ntesEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=STN&subAction=FACILITY&stnCode=BDM',
  },
  UBL: {
    stationCode: 'UBL',
    name: 'SSS Hubballi Junction (World’s Longest Railway Platform)',
    nameKannada: 'ಶ್ರೀ ಸಿದ್ಧಾರೂಢ ಸ್ವಾಮೀಜಿ ಹುಬ್ಬಳ್ಳಿ ಜಂಕ್ಷನ್',
    division: 'UBL',
    railwayZone: 'South Western Railway (SWR Headquarter)',
    district: 'Dharwad',
    coordinates: [75.1436, 15.3489],
    amenities: ['Platform 1 (1,507m World Record)', 'Executive Lounges', 'HDBRTS Bus Rapid Transit terminal', 'IRCTC Food Plaza'],
    servesDestinations: [
      { destinationName: 'Dharwad Cultural Heritage & Peda Centers', distanceKm: 20.0, recommendedTransfer: 'HDBRTS Chigari AC Bus every 3 minutes (₹30)' },
      { destinationName: 'Badami Chalukya Circuit', distanceKm: 105.0, recommendedTransfer: 'Direct passenger train or NWKRTC express bus' },
      { destinationName: 'Dandeli Wildlife & Kali White Water Rafting', distanceKm: 75.0, recommendedTransfer: 'NWKRTC bus via Haliyal or private taxi' },
    ],
    ntesEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=STN&subAction=FACILITY&stnCode=UBL',
  },
  MAQ: {
    stationCode: 'MAQ',
    name: 'Mangaluru Central',
    nameKannada: 'ಮಂಗಳೂರು ಸೆಂಟ್ರಲ್',
    division: 'PGT',
    railwayZone: 'Southern Railway (SR)',
    district: 'Dakshina Kannada',
    coordinates: [74.8431, 12.8636],
    amenities: ['Pre-paid Auto', 'Retiring Rooms', 'KSRTC City Bus Bay', 'Food Court'],
    servesDestinations: [
      { destinationName: 'Panambur & Tannirbhavi Beaches', distanceKm: 11.0, recommendedTransfer: 'City Bus 30A or local auto' },
      { destinationName: 'Udupi Sri Krishna Matha', distanceKm: 58.0, recommendedTransfer: 'KSRTC Volvo / Express bus every 15 min or MEMU train' },
      { destinationName: 'Dharmasthala Manjunatha Temple', distanceKm: 75.0, recommendedTransfer: 'KSRTC Express bus from KSRTC Bejai terminal' },
    ],
    ntesEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=STN&subAction=FACILITY&stnCode=MAQ',
  },
  DWR: {
    stationCode: 'DWR',
    name: 'Dharwad',
    nameKannada: 'ಧಾರವಾಡ',
    division: 'UBL',
    railwayZone: 'South Western Railway (SWR)',
    district: 'Dharwad',
    coordinates: [75.0078, 15.4589],
    amenities: ['Vande Bharat Platform', 'Chigari BRTS connectivity', 'Waiting Hall', 'Auto Stand'],
    servesDestinations: [
      { destinationName: 'Dharwad Cultural Heritage & Karnatak University', distanceKm: 3.0, recommendedTransfer: 'Local Auto / City Bus' },
      { destinationName: 'Kittur Rani Chennamma Fort', distanceKm: 32.0, recommendedTransfer: 'NWKRTC bus via PB Road / NH-48' },
    ],
    ntesEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=STN&subAction=FACILITY&stnCode=DWR',
  },
  BGM: {
    stationCode: 'BGM',
    name: 'Belagavi',
    nameKannada: 'ಬೆಳಗಾವಿ',
    division: 'UBL',
    railwayZone: 'South Western Railway (SWR)',
    district: 'Belagavi',
    coordinates: [74.5097, 15.8497],
    amenities: ['Retiring Rooms', 'Executive Lounge', 'NWKRTC City Bus Bay', 'Auto Stand'],
    servesDestinations: [
      { destinationName: 'Belagavi Fort & Kamal Basti', distanceKm: 3.5, recommendedTransfer: 'City Auto (₹50)' },
      { destinationName: 'Kittur Fort', distanceKm: 48.0, recommendedTransfer: 'NWKRTC Express Bus from CBT' },
      { destinationName: 'Gokak Falls', distanceKm: 65.0, recommendedTransfer: 'NWKRTC bus or taxi' },
    ],
    ntesEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=STN&subAction=FACILITY&stnCode=BGM',
  },
  TLGP: {
    stationCode: 'TLGP',
    name: 'Talguppa (Jog Falls Gateway)',
    nameKannada: 'ತಾಳಗುಪ್ಪ (ಜೋಗ ಜಲಪಾತದ ಹೆಬ್ಬಾಗಿಲು)',
    division: 'MYS',
    railwayZone: 'South Western Railway (SWR)',
    district: 'Shivamogga',
    coordinates: [74.9125, 14.2189],
    amenities: ['Passenger Shed', 'KSRTC Connecting Bus Bay', 'Auto Stand'],
    servesDestinations: [
      { destinationName: 'Jog Falls (Gerosoppa)', distanceKm: 14.0, recommendedTransfer: 'KSRTC connecting bus every 20 min (₹30, 25 min)' },
      { destinationName: 'Ikkeri Aghoreshwara Temple', distanceKm: 18.0, recommendedTransfer: 'Local auto or KSRTC bus via Sagara' },
    ],
    ntesEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=STN&subAction=FACILITY&stnCode=TLGP',
  },
  RRB: {
    stationCode: 'RRB',
    name: 'Birur Junction',
    nameKannada: 'ಬೀರೂರು ಜಂಕ್ಷನ್',
    division: 'MYS',
    railwayZone: 'South Western Railway (SWR)',
    district: 'Chikkamagaluru',
    coordinates: [75.9754, 13.5936],
    amenities: ['Junction Platform', 'KSRTC Connecting Bus Bay', 'Auto Stand', 'Retiring Rooms'],
    servesDestinations: [
      { destinationName: 'Chikkamagaluru Coffee Country', distanceKm: 45.0, recommendedTransfer: 'KSRTC bus or local taxi via Kadur (₹65, 1 hr)' },
      { destinationName: 'Kemmangundi Hill Station', distanceKm: 35.0, recommendedTransfer: 'Private taxi / jeep via Lingadahalli' },
    ],
    ntesEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/q?opt=STN&subAction=FACILITY&stnCode=RRB',
  },
};

export function getStation(stationCode: string): KarnatakaRailwayStation | undefined {
  return KARNATAKA_RAILWAY_STATIONS[stationCode.toUpperCase()];
}
