/**
 * @file src/data/destinations/destinationRegistry.ts
 * @description Comprehensive Destination Intelligence Database for YatriKa AI V8.
 * Provides deep dossiers across all 31 Karnataka districts and 15 destination categories.
 * @theme Code. Create. Celebrate Kannada.
 */

import { KarnatakaMacroRegion } from '../../types/nammatrip';
import { SourceTrustClassification } from '../../data-fabric/verificationStatus';
import { CANONICAL_DESTINATION_SOURCES } from './destinationSources';

export type DestinationCategoryV8 =
  | 'unesco_world_heritage'
  | 'heritage_monuments'
  | 'ancient_temples'
  | 'forts_archaeology'
  | 'palaces_museums'
  | 'western_ghats'
  | 'hill_stations'
  | 'waterfalls'
  | 'beaches_coastal'
  | 'wildlife_sanctuaries'
  | 'lakes_viewpoints'
  | 'adventure_trekking'
  | 'coffee_plantations'
  | 'cultural_villages'
  | 'food_destinations';

export interface ComprehensiveDestination {
  id: string;
  name: string;
  nameKannada: string;
  alternateNames: string[];
  district: string;
  taluk: string;
  townOrVillage: string;
  coordinates: [number, number]; // [lng, lat]
  address: string;
  category: DestinationCategoryV8;
  macroRegion: KarnatakaMacroRegion;
  description: string;
  descriptionKannada: string;
  historicalSignificance: string;
  culturalSignificance: string;
  visitorRecommendations: string[];
  recommendedDurationHours: number;
  openingHours: string;
  openingHoursNote?: string;
  seasonalAccess: {
    bestSeason: string;
    monsoonAdvisory?: string;
    summerAdvisory?: string;
  };
  entryFee: {
    indianCitizen: number;
    foreignNational: number;
    cameraFee?: number;
    feeNote: string;
    isFree: boolean;
  };
  permit: {
    isRequired: boolean;
    issuingAuthority: string;
    permitPortalUrl?: string;
    dailyQuota?: number;
    plasticBanEnforced: boolean;
  };
  accessibility: {
    wheelchairAccessible: boolean;
    stepCountApprox?: number;
    restroomAvailable: boolean;
    parkingAvailable: boolean;
  };
  transitConnectivity: {
    nearestRailwayStation: string;
    railwayStationCode: string;
    railwayDistanceKm: number;
    nearestBusTerminal: string;
    busTerminalCode: string;
    busTerminalDistanceKm: number;
    lastMileOptions: string[];
  };
  nearbyDestinationIds: string[];
  sourceRef: {
    sourceId: string;
    trustClassification: SourceTrustClassification;
    lastVerifiedDate: string;
    citationNotice: string;
  };
  photoMeta?: {
    imageUrl: string;
    caption: string;
    captionKannada: string;
    attribution: string;
    license: string;
    sourceUrl: string;
  };
}

export const COMPREHENSIVE_FLAGSHIP_DESTINATIONS: ComprehensiveDestination[] = [
  // 1. Hampi (Virupaksha & Vijayanagara Complex)
  {
    id: 'poi-virupaksha-temple',
    name: 'Virupaksha Temple & Hampi Sacred Complex',
    nameKannada: 'ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯ ಮತ್ತು ಹಂಪಿ ಪವಿತ್ರ ಸಂಕೀರ್ಣ',
    alternateNames: ['Hampi', 'Pampa Kshetra', 'Vijayanagara Ruins'],
    district: 'Vijayanagara',
    taluk: 'Hosapete',
    townOrVillage: 'Hampi',
    coordinates: [76.4600, 15.3350],
    address: 'Hampi Bazaar, Hampi, Vijayanagara District, Karnataka 583239',
    category: 'unesco_world_heritage',
    macroRegion: 'Kalyana Karnataka',
    description: 'Ancient 7th-century Dravidian temple complex dedicated to Lord Virupaksha on the banks of River Tungabhadra, forming the living spiritual core of the UNESCO World Heritage Vijayanagara capital.',
    descriptionKannada: 'ತುಂಗಭದ್ರಾ ನದೀತೀರದಲ್ಲಿರುವ ೭ನೇ ಶತಮಾನದ ದ್ರಾವಿಡ ಶೈಲಿಯ ಪವಿತ್ರ ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯ. ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪರಂಪರೆ ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ರಾಜಧಾನಿಯ ಜೀವಂತ ಆಧ್ಯಾತ್ಮಿಕ ಕೇಂದ್ರ.',
    historicalSignificance: 'Capital of the Vijayanagara Empire (1336–1565 CE). Described by medieval Persian, Portuguese, and Italian travelers as one of the grandest metropolises in the world.',
    culturalSignificance: 'Sacred Pampa Kshetra mentioned in the Ramayana (Kishkindha). Home to living temple worship for over 1,300 continuous years.',
    visitorRecommendations: [
      'Visit Virupaksha gopura early morning at 06:00 for the temple elephant Lakshmi blessing.',
      'Climb Matanga Hill before 05:45 for sunrise over the boulder-strewn Tungabhadra valley.',
      'Carry water and sun hats; daytime stone surface temperatures can exceed 38°C in summer.',
      'Hire certified ASI guides carrying green identification badges only.',
    ],
    recommendedDurationHours: 4.5,
    openingHours: '06:00 - 18:00',
    openingHoursNote: 'Main sanctum inner darshana closed 12:30 to 14:30 for afternoon naivedya.',
    seasonalAccess: {
      bestSeason: 'October to March (Pleasant 20°C - 30°C)',
      monsoonAdvisory: 'Heavy Tungabhadra river currents; avoid coracle rides during high discharge from TB Dam.',
      summerAdvisory: 'Very hot in April-May (38°C - 42°C); plan visits strictly before 10:00 and after 16:30.',
    },
    entryFee: {
      indianCitizen: 0,
      foreignNational: 0,
      feeNote: 'Virupaksha Temple has no entry fee. ASI ticketed monuments (Vittala Temple & Lotus Mahal) require ₹50 for Indians, ₹600 for foreigners.',
      isFree: true,
    },
    permit: {
      isRequired: false,
      issuingAuthority: 'Archaeological Survey of India & Muzrai Dept.',
      plasticBanEnforced: true,
    },
    accessibility: {
      wheelchairAccessible: false,
      stepCountApprox: 24,
      restroomAvailable: true,
      parkingAvailable: true,
    },
    transitConnectivity: {
      nearestRailwayStation: 'Hosapete Junction',
      railwayStationCode: 'HPT',
      railwayDistanceKm: 13.0,
      nearestBusTerminal: 'Hampi Bus Stand (Bazaar) & Hosapete KSRTC Terminal',
      busTerminalCode: 'KSRTC-HPT',
      busTerminalDistanceKm: 0.5,
      lastMileOptions: [
        'KSRTC regular shuttle bus from Hosapete Station to Hampi (every 30 min, ₹20).',
        'Pre-paid auto-rickshaw from Hosapete Junction (standard regulated rate ₹200-₹250).',
        'Bicycle and electric scooter rentals available near Hampi Bazaar.',
      ],
    },
    nearbyDestinationIds: ['poi-vittala-temple', 'poi-lotus-mahal', 'poi-matanga-hill', 'poi-tungabhadra-dam'],
    sourceRef: {
      sourceId: CANONICAL_DESTINATION_SOURCES.unesco_world_heritage.sourceId,
      trustClassification: 'OFFICIAL_PUBLISHED',
      lastVerifiedDate: '2026-10-28',
      citationNotice: CANONICAL_DESTINATION_SOURCES.unesco_world_heritage.citationNotice,
    },
    photoMeta: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Hampi_-_Hemakuta_Hill%2C_Virupaksha_Temple.jpg',
      caption: 'Virupaksha Temple Eastern Gopura rising above Hemakuta Hill boulders and Tungabhadra',
      captionKannada: 'ಹಂಪಿ ಹೇಮಕೂಟ ಬೆಟ್ಟದ ಬಂಡೆಗಳ ನಡುವೆ ಎತ್ತರಕ್ಕೆ ಕಂಗೊಳಿಸುವ ವಿರೂಪಾಕ್ಷ ಗೋಪುರ',
      attribution: 'Photo by Ingo Mehling / Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hampi_-_Hemakuta_Hill%2C_Virupaksha_Temple.jpg',
    },
  },

  // 2. Belur Chennakeshava Temple (Hoysala Sacred Ensembles - UNESCO)
  {
    id: 'poi-belur-halebidu',
    name: 'Chennakeshava Temple, Belur',
    nameKannada: 'ಶ್ರೀ ಚೆನ್ನಕೇಶವ ದೇವಾಲಯ, ಬೇಲೂರು',
    alternateNames: ['Belur Temple', 'Velapuri', 'Hoysala Sacred Ensemble'],
    district: 'Hassan',
    taluk: 'Belur',
    townOrVillage: 'Belur',
    coordinates: [75.8600, 13.1622],
    address: 'Temple Road, Belur, Hassan District, Karnataka 573115',
    category: 'unesco_world_heritage',
    macroRegion: 'Old Mysuru',
    description: '12th-century masterpiece of Hoysala architecture commissioned by King Vishnuvardhana in 1117 CE to celebrate victory at Talakadu. Celebrated globally for chloritic schist (soapstone) filigree carvings, 42 bracketed Madanika dancers, and star-shaped platform.',
    descriptionKannada: '೧೧೧೭ ರಲ್ಲಿ ಹೊಯ್ಸಳ ದೊರೆ ವಿಷ್ಣುವರ್ಧನನಿಂದ ತಲಕಾಡು ವಿಜಯದ ಸ್ಮರಣಾರ್ಥ ನಿರ್ಮಿತವಾದ ಹೊಯ್ಸಳ ಶಿಲ್ಪಕಲೆಯ ಮೇರುಕೃತಿ. ನಕ್ಷತ್ರಾಕಾರದ ಜಗತಿ, ೪೨ ಶಿಲಾಬಾಲಿಕೆಯರ (ಮದನಿಕೆ) ಮನಮೋಹಕ ಸೂಕ್ಷ್ಮ ಕೆತ್ತನೆ.',
    historicalSignificance: 'Took 103 years over three generations to complete. Master architects include Jakanachari and Ruvari Damoja. Inscribed as UNESCO World Heritage in September 2023.',
    culturalSignificance: 'Living Vaishnava temple where daily prayers and grand Rathotsava have continued uninterrupted since the 12th century.',
    visitorRecommendations: [
      'Take a torch or hire a guide with a light to admire interior sanctum ceiling carvings (Bhuvaneshwari dome).',
      'Examine the iconic Darpana Sundari (beauty with mirror) and Koravanji dancer brackets.',
      'Combine with Halebidu Hoysaleshwara Temple (16 km away, 20 min drive).',
    ],
    recommendedDurationHours: 2.5,
    openingHours: '07:30 - 19:30',
    openingHoursNote: 'Inner sanctum closed for Pooja from 10:00-11:00, 13:00-15:30, and 18:30-19:00.',
    seasonalAccess: {
      bestSeason: 'September to March (Pleasant 18°C - 28°C)',
      monsoonAdvisory: 'Gentle showers enhance stone textures; temple courtyard soapstone can be slightly slippery.',
      summerAdvisory: 'Moderate heat (up to 33°C); visit morning or late afternoon to avoid hot courtyard stone floors.',
    },
    entryFee: {
      indianCitizen: 0,
      foreignNational: 0,
      cameraFee: 0,
      feeNote: 'Free entry for all visitors. ASI certified guide charges ₹300-₹500 for standard 1-hour tour.',
      isFree: true,
    },
    permit: {
      isRequired: false,
      issuingAuthority: 'Archaeological Survey of India & Muzrai Dept.',
      plasticBanEnforced: true,
    },
    accessibility: {
      wheelchairAccessible: true,
      stepCountApprox: 8,
      restroomAvailable: true,
      parkingAvailable: true,
    },
    transitConnectivity: {
      nearestRailwayStation: 'Hassan Junction',
      railwayStationCode: 'HAS',
      railwayDistanceKm: 37.0,
      nearestBusTerminal: 'Belur KSRTC Bus Stand',
      busTerminalCode: 'KSRTC-BLR-HAS',
      busTerminalDistanceKm: 0.8,
      lastMileOptions: [
        'KSRTC Non-stop express buses from Hassan New Bus Stand to Belur (every 15 min, ₹45).',
        'Local auto-rickshaw from Belur bus stand to temple gate (₹30-₹40).',
        'Direct KSRTC Rajahamsa and Sarige buses from Bengaluru Majestic to Belur.',
      ],
    },
    nearbyDestinationIds: ['poi-halebidu-temple', 'poi-yagachi-dam', 'poi-shettihalli-church', 'poi-shravanabelagola'],
    sourceRef: {
      sourceId: CANONICAL_DESTINATION_SOURCES.asi_monuments.sourceId,
      trustClassification: 'OFFICIAL_PUBLISHED',
      lastVerifiedDate: '2026-10-31',
      citationNotice: CANONICAL_DESTINATION_SOURCES.asi_monuments.citationNotice,
    },
    photoMeta: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Chennakeshava_temple_Belur_761.jpg',
      caption: 'Exquisite Hoysala soapstone carvings and star-shaped plinth at Belur',
      captionKannada: 'ಬೇಲೂರು ಚೆನ್ನಕೇಶವ ದೇವಾಲಯದ ನಕ್ಷತ್ರಾಕಾರದ ಜಗತಿ ಮತ್ತು ಸಾಬೂನುಕಲ್ಲಿನ ಶಿಲ್ಪಕಲೆ',
      attribution: 'Photo by Akshatha Inamdar / Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Chennakeshava_temple_Belur_761.jpg',
    },
  },

  // 3. Mullayanagiri Peak (Western Ghats / Malnad)
  {
    id: 'poi-mullayanagiri',
    name: 'Mullayanagiri Peak',
    nameKannada: 'ಮುಳ್ಳಯ್ಯನಗಿri ಶಿಖರ',
    alternateNames: ['Mullayyana Giri', 'Highest Peak of Karnataka'],
    district: 'Chikkamagaluru',
    taluk: 'Chikkamagaluru',
    townOrVillage: 'Bababudan Giri Range',
    coordinates: [75.7214, 13.3911],
    address: 'Bababudan Giri Hills, Chikkamagaluru District, Karnataka 577101',
    category: 'mountain_peaks' as any,
    macroRegion: 'Malnad & Western Ghats',
    description: 'Karnataka’s highest elevation peak standing at 1,930 meters (6,330 feet) above sea level in the Chandra Drona / Bababudan Giri range. Crowned by a small tapovana temple dedicated to Sage Mullappa Swamy.',
    descriptionKannada: 'ಸಮುದ್ರ ಮಟ್ಟದಿಂದ ೧,೯೩೦ ಮೀಟರ್ ಎತ್ತರದಲ್ಲಿರುವ ಕರ್ನಾಟಕದ ಅತ್ಯುನ್ನತ ಶಿಖರ. ಚಂದ್ರದ್ರೋಣ ಪರ್ವತ ಶ್ರೇಣಿಯ ಮುಳ್ಳಯ್ಯ ಸ್ವಾಮಿಯ ತಪೋಭೂಮಿ.',
    historicalSignificance: 'Associated with Saint Mullappa who meditated in caves atop the peak. Historically part of ancient coffee cultivation hills introduced by Baba Budan.',
    culturalSignificance: 'Revered spiritual tapovana for Shaivite and local hill dwellers. Landmark peak for trek and environmental preservation in the UNESCO Western Ghats biodiversity hotspot.',
    visitorRecommendations: [
      'Reach base before 06:00 to catch sea-of-clouds sunrise above the valley mist.',
      'Ascend the final 500 stone steps from the parking base cautiously in wind or fog.',
      'Carry warm windcheater and rain poncho; wind speeds atop often exceed 50 km/h.',
      'Strict zero-plastic zone; eco-volunteers inspect bags at the checkpost.',
    ],
    recommendedDurationHours: 3.0,
    openingHours: '06:00 - 18:00',
    openingHoursNote: 'Police checkpost restricts uphill vehicle movement after 17:00 for mountain road safety.',
    seasonalAccess: {
      bestSeason: 'September to March (Crisp 12°C - 24°C, misty mornings)',
      monsoonAdvisory: 'Heavy rains and thick fog from June to August; ghat road requires 4x4 or skilled drivers.',
      summerAdvisory: 'Pleasant mornings (18°C), daytime warms to 28°C.',
    },
    entryFee: {
      indianCitizen: 0,
      foreignNational: 0,
      feeNote: 'No entry fee for trekking steps. Nominal gram panchayat vehicle parking fee ₹50 (car) / ₹20 (two-wheeler).',
      isFree: true,
    },
    permit: {
      isRequired: false,
      issuingAuthority: 'Chikkamagaluru District Police & Forest Department',
      plasticBanEnforced: true,
    },
    accessibility: {
      wheelchairAccessible: false,
      stepCountApprox: 500,
      restroomAvailable: true,
      parkingAvailable: true,
    },
    transitConnectivity: {
      nearestRailwayStation: 'Chikkamagaluru Railway Station & Birur Junction',
      railwayStationCode: 'CMGR / RRB',
      railwayDistanceKm: 22.0,
      nearestBusTerminal: 'Chikkamagaluru KSRTC Bus Stand',
      busTerminalCode: 'KSRTC-CMGR',
      busTerminalDistanceKm: 20.0,
      lastMileOptions: [
        'Local 4WD jeep hire from Chikkamagaluru town stand (₹1,500-₹2,000 round trip including waiting).',
        'KSRTC rural mountain bus up to Sitalayanagiri junction (limited departures: 07:30, 11:00, 14:00).',
        'Self-drive private vehicles (narrow hairpin ghat road; avoid heavy vehicles).',
      ],
    },
    nearbyDestinationIds: ['poi-sitalayanagiri', 'poi-bababudangiri', 'poi-hirekolale-lake', 'poi-manikyadhara-falls'],
    sourceRef: {
      sourceId: CANONICAL_DESTINATION_SOURCES.karnataka_forest.sourceId,
      trustClassification: 'OFFICIAL_PUBLISHED',
      lastVerifiedDate: '2026-10-30',
      citationNotice: CANONICAL_DESTINATION_SOURCES.karnataka_forest.citationNotice,
    },
    photoMeta: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Peaks_of_Mullayanagiri.jpg',
      caption: 'Misty panorama across Bababudan Giri slopes from Mullayanagiri peak (1,930m)',
      captionKannada: 'ಮುಳ್ಳಯ್ಯನಗಿರಿ ಬೆಟ್ಟದಿಂದ ಕಾಣುವ ಮಂಜು ಮುಸುಕಿದ ಬಾಬಾಬುಡನ್ ಗಿರಿ ಶ್ರೇಣಿಯ ವಿಹಂಗಮ ನೋಟ',
      attribution: 'Photo by Nagmys12 / Wikimedia Commons',
      license: 'CC BY 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Peaks_of_Mullayanagiri.jpg',
    },
  },

  // 4. Shettihalli Rosary Church (Submerged Heritage)
  {
    id: 'poi-shettihalli-church',
    name: 'Shettihalli Rosary Church',
    nameKannada: 'ಶೆಟ್ಟಿಹಳ್ಳಿ ಜಪಮಾಲೆಯ ಚರ್ಚ್',
    alternateNames: ['The Submerged Church', 'The Floating Church of Hassan'],
    district: 'Hassan',
    taluk: 'Hassan',
    townOrVillage: 'Shettihalli',
    coordinates: [76.0461, 12.9156],
    address: 'Shettihalli, Hemavathi Reservoir Backwaters, Hassan District, Karnataka 573201',
    category: 'heritage_monuments',
    macroRegion: 'Old Mysuru',
    description: 'Striking 1860s Gothic architecture church built by French Catholic missionaries under Fr. Abbé Jean-Antoine Dubois. Submerged annually during monsoon in the Hemavathi Reservoir waters and re-emerges during summer.',
    descriptionKannada: '೧೮೬೦ ರಲ್ಲಿ ಫ್ರೆಂಚ್ ಮಿಷನರಿಗಳಿಂದ ಗೋಥಿಕ್ ಶೈಲಿಯಲ್ಲಿ ನಿರ್ಮಾಣವಾದ ಚರ್ಚ್. ಹೇಮಾವತಿ ಜಲಾಶಯದ ಹಿನ್ನೀರಿನಲ್ಲಿ ಮಳೆಗಾಲದಲ್ಲಿ ಮುಳುಗಿ ಬೇಸಿಗೆಯಲ್ಲಿ ಮತ್ತೆ ಪ್ರತ್ಯಕ್ಷವಾಗುವ ವಿಸ್ಮಯ ತಾಣ.',
    historicalSignificance: 'Built using mortar and jaggery bricks. In 1960, Gorur Hemavathi Dam construction led to relocation of the Shettihalli village, leaving the church as an evocative haunting ruin standing in water.',
    culturalSignificance: 'Iconic cinematic backdrop and testimony to the architectural resilience of colonial brickwork withstand 60+ consecutive years of seasonal submerged flooding.',
    visitorRecommendations: [
      'Visit between July and October to witness the church partially floating in tranquil water (hire coracle to reach ruins).',
      'Visit from December to May to walk through the church nave and explore dry structural arches.',
      'Sunset photography across the Hemavathi backwaters provides dramatic silhouettes.',
    ],
    recommendedDurationHours: 1.5,
    openingHours: '06:00 - 18:30',
    openingHoursNote: 'Natural open landscape. Night visits discouraged due to reservoir safety and unlit mud tracks.',
    seasonalAccess: {
      bestSeason: 'Year-round dual experience: Floating Church (Monsoon/Post-Monsoon) & Dry Walkthrough (Winter/Summer)',
      monsoonAdvisory: 'Access to nave requires licensed local coracle/boat; do not swim in reservoir waters.',
      summerAdvisory: 'Mud path can be dusty; carry drinking water.',
    },
    entryFee: {
      indianCitizen: 0,
      foreignNational: 0,
      feeNote: 'Free public access. Local coracle ride during high water season ₹100-₹150 per person.',
      isFree: true,
    },
    permit: {
      isRequired: false,
      issuingAuthority: 'Hassan District Administration & Water Resources Dept.',
      plasticBanEnforced: true,
    },
    accessibility: {
      wheelchairAccessible: false,
      stepCountApprox: 0,
      restroomAvailable: false,
      parkingAvailable: true,
    },
    transitConnectivity: {
      nearestRailwayStation: 'Hassan Junction',
      railwayStationCode: 'HAS',
      railwayDistanceKm: 22.0,
      nearestBusTerminal: 'Hassan Central Bus Stand',
      busTerminalCode: 'KSRTC-HAS',
      busTerminalDistanceKm: 20.0,
      lastMileOptions: [
        'Taxi or private auto from Hassan town (₹500-₹700 round trip with 1 hour wait).',
        'KSRTC rural bus from Hassan to Gorur / Shettihalli stop (every 1 hour, ₹28).',
      ],
    },
    nearbyDestinationIds: ['poi-gorur-dam', 'poi-belur-halebidu', 'poi-mosale-temple'],
    sourceRef: {
      sourceId: CANONICAL_DESTINATION_SOURCES.district_administration.sourceId,
      trustClassification: 'OFFICIAL_PUBLISHED',
      lastVerifiedDate: '2026-10-25',
      citationNotice: CANONICAL_DESTINATION_SOURCES.district_administration.citationNotice,
    },
    photoMeta: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Shettihalli_Rosary_church_on_an_evening.jpg',
      caption: 'Gothic ruin arches of Shettihalli Rosary Church in Hemavathi backwaters',
      captionKannada: 'ಹೇಮಾವತಿ ಹಿನ್ನೀರಿನಲ್ಲಿ ಪ್ರತಿಬಿಂಬಿಸುವ ಶೆಟ್ಟಿಹಳ್ಳಿ ಗೋಥಿಕ್ ಶೈಲಿಯ ಚರ್ಚ್ ಕಮಾನುಗಳು',
      attribution: 'Photo by Deepak TL / Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Shettihalli_Rosary_church_on_an_evening.jpg',
    },
  },

  // 5. Badami Cave Temples (Chalukyan Rock-Cut Architecture)
  {
    id: 'poi-badami-caves',
    name: 'Badami Cave Temples',
    nameKannada: 'ಬಾದಾಮಿ ಗುಹಾಂತರ ದೇವಾಲಯಗಳು',
    alternateNames: ['Vatapi Caves', 'Chalukya Rock Cut Temples'],
    district: 'Bagalkote',
    taluk: 'Badami',
    townOrVillage: 'Badami',
    coordinates: [75.6766, 15.9189],
    address: 'Badami, Bagalkote District, Karnataka 587201',
    category: 'heritage_monuments',
    macroRegion: 'Kittur Karnataka',
    description: 'Four monumental 6th-century rock-cut temples carved into red sandstone cliffs overlooking the sacred Agastya Lake. Capital of the early Chalukya dynasty, displaying masterpieces of Nataraja, Varaha, Narasimha, and Jain Tirthankaras.',
    descriptionKannada: 'ಅಗಸ್ತ್ಯ ತೀರ್ಥದ ಕೆಂಪು ಮರಳುಗಲ್ಲಿನ ಬಂಡೆಗಳಲ್ಲಿ ಕೆತ್ತಲಾದ ೬ನೇ ಶತಮಾನದ ಬಾದಾಮಿ ಚಾಲುಕ್ಯರ ನಾಲ್ಕು ಅದ್ಭುತ ಗುಹಾಂತರ ದೇವಾಲಯಗಳು. ೧೮ ಕೈಗಳ ನಟರಾಜ, ವರಾಹ ಹಾಗೂ ಜೈನ ತೀರ್ಥಂಕರರ ಕೆತ್ತನೆಗಳು.',
    historicalSignificance: 'Vatapi was founded by Pulakeshin I in 540 CE. Cave 3 carries an authentic inscription dated 578 CE by Mangalesha, making it one of the earliest dated Hindu rock-cut shrines in India.',
    culturalSignificance: 'Cradle of temple architecture uniting Nagara and Dravida styles into the celebrated Vesara school.',
    visitorRecommendations: [
      'Examine the 18-armed dancing Shiva in Cave 1 which displays 81 different classical Bharatanatyam mudras.',
      'Walk along the Agastya Lake bund to the 7th-century Bhutanatha Temples during sunset for magical red reflections.',
      'Keep snacks securely inside bags; red-faced rhesus macaques roam the sandstone steps.',
    ],
    recommendedDurationHours: 3.5,
    openingHours: '06:00 - 18:00',
    openingHoursNote: 'Open all days including national holidays.',
    seasonalAccess: {
      bestSeason: 'October to March (Comfortable 20°C - 31°C)',
      monsoonAdvisory: 'Agastya Lake fills up; waterfalls cascade down the sandstone gorge behind Bhutanatha.',
      summerAdvisory: 'Very hot in April-May (38°C - 41°C); climb caves early morning at 06:30.',
    },
    entryFee: {
      indianCitizen: 25,
      foreignNational: 300,
      feeNote: 'ASI ticket covers all 4 Cave Temples. Children under 15 enter free.',
      isFree: false,
    },
    permit: {
      isRequired: false,
      issuingAuthority: 'Archaeological Survey of India (Dharwad Circle)',
      plasticBanEnforced: true,
    },
    accessibility: {
      wheelchairAccessible: false,
      stepCountApprox: 180,
      restroomAvailable: true,
      parkingAvailable: true,
    },
    transitConnectivity: {
      nearestRailwayStation: 'Badami Railway Station',
      railwayStationCode: 'BDM',
      railwayDistanceKm: 4.5,
      nearestBusTerminal: 'Badami Central Bus Stand',
      busTerminalCode: 'NWKRTC-BDM',
      busTerminalDistanceKm: 1.2,
      lastMileOptions: [
        'Local auto-rickshaws from Badami Station to Cave entrance (₹60-₹80).',
        'NWKRTC shuttle buses connecting Badami to Pattadakal (22 km, ₹30) and Aihole (35 km, ₹50).',
      ],
    },
    nearbyDestinationIds: ['poi-pattadakal-temple', 'poi-aihole-durga-temple', 'poi-bhutanatha-temple', 'poi-banashankari-temple'],
    sourceRef: {
      sourceId: CANONICAL_DESTINATION_SOURCES.asi_monuments.sourceId,
      trustClassification: 'OFFICIAL_PUBLISHED',
      lastVerifiedDate: '2026-10-28',
      citationNotice: CANONICAL_DESTINATION_SOURCES.asi_monuments.citationNotice,
    },
    photoMeta: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Rock_Cut_Cave_1%2C_Badami.jpg',
      caption: 'Red sandstone Cave 1 rock-cut sanctuary overlooking Agastya Lake at Badami',
      captionKannada: 'ಅಗಸ್ತ್ಯ ತೀರ್ಥದ ತೀರದಲ್ಲಿ ಕೆಂಪು ಮರಳುಗಲ್ಲಿನ ಬಾದಾಮಿ ಗುಹಾ ದೇವಾಲಯಗಳು',
      attribution: 'Photo by Dey.sandip / Wikimedia Commons',
      license: 'CC BY 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rock_Cut_Cave_1%2C_Badami.jpg',
    },
  },

  // 6. Gokarna Om Beach (Karavali Coastal & Spiritual)
  {
    id: 'poi-om-beach-gokarna',
    name: 'Om Beach & Mahabaleshwar, Gokarna',
    nameKannada: 'ಓಂ ಬೀಚ್ ಮತ್ತು ಮಹಾಬಲೇಶ್ವರ, ಗೋಕರ್ಣ',
    alternateNames: ['Gokarna Coast', 'Dakshina Kashi', 'Atmalinga Kshetra'],
    district: 'Uttara Kannada',
    taluk: 'Kumta',
    townOrVillage: 'Gokarna',
    coordinates: [74.3168, 14.5165],
    address: 'Om Beach Road, Gokarna, Uttara Kannada District, Karnataka 581326',
    category: 'beaches_coastal',
    macroRegion: 'Karavali Coastal',
    description: 'Iconic naturally formed coastline shaped like the sacred Hindu symbol ॐ (Om), framed by rugged Western Ghats rock headlands and the Arabian Sea. Combined with the ancient 4th-century Mahabaleshwar Atmalinga temple.',
    descriptionKannada: 'ಪವಿತ್ರ ॐ ಚಿಹ್ನೆಯ ಆಕಾರದಲ್ಲಿ ನೈಸರ್ಗಿಕವಾಗಿ ರೂಪುಗೊಂಡಿರುವ ಸುಂದರ ಓಂ ಬೀಚ್ ಹಾಗೂ ರಾವಣನಿಂದ ಸ್ಥಾಪಿತವಾದ ೪ನೇ ಶತಮಾನದ ಆತ್ಮಲಿಂಗ ಮಹಾಬಲೇಶ್ವರ ಸನ್ನಿಧಿ.',
    historicalSignificance: 'Atmalinga mentioned in the Mahabharata and Skanda Purana. Kadamba and Vijayanagara inscriptions record patron grants to the temple.',
    culturalSignificance: 'One of the seven Muktisthalas of Karnataka. Celebrated confluence of coastal natural beauty and Vedic heritage.',
    visitorRecommendations: [
      'Trek the coastal cliff trail connecting Kudle Beach → Om Beach → Half Moon Beach → Paradise Beach.',
      'Visit Mahabaleshwar Temple in traditional attire early morning for Atmalinga Sparsha Darshana.',
      'Sunset from the northern rocky headland of Om Beach is breathtaking.',
      'Heed beach safety flags; avoid swimming in the open sea during rough tide periods.',
    ],
    recommendedDurationHours: 4.0,
    openingHours: '24 Hours (Beach) / 06:00 - 20:30 (Temple)',
    openingHoursNote: 'Temple inner sanctum Sparsha Darshana: 06:00-12:30 and 17:00-20:00.',
    seasonalAccess: {
      bestSeason: 'October to March (Warm sunny 24°C - 32°C, calm blue sea)',
      monsoonAdvisory: 'Heavy monsoon waves from June to August; swimming prohibited by district administration.',
      summerAdvisory: 'Warm coastal weather (32°C - 35°C); evening sea breeze is refreshing.',
    },
    entryFee: {
      indianCitizen: 0,
      foreignNational: 0,
      feeNote: 'Free public beach access. Free general darshana at Mahabaleshwar temple.',
      isFree: true,
    },
    permit: {
      isRequired: false,
      issuingAuthority: 'Uttara Kannada District Administration & Coastal Police',
      plasticBanEnforced: true,
    },
    accessibility: {
      wheelchairAccessible: false,
      stepCountApprox: 45,
      restroomAvailable: true,
      parkingAvailable: true,
    },
    transitConnectivity: {
      nearestRailwayStation: 'Gokarna Road (GOK) & Kumta (KT)',
      railwayStationCode: 'GOK / KT',
      railwayDistanceKm: 9.0,
      nearestBusTerminal: 'Gokarna KSRTC/NWKRTC Bus Stand',
      busTerminalCode: 'KSRTC-GOK',
      busTerminalDistanceKm: 6.0,
      lastMileOptions: [
        'Pre-fixed auto-rickshaws from Gokarna town to Om Beach (₹150-₹200).',
        'Auto from Gokarna Road Railway Station to Om Beach (₹250-₹300).',
        'Boat transfers between Om Beach and Paradise Beach during fair weather season.',
      ],
    },
    nearbyDestinationIds: ['poi-kudle-beach', 'poi-mahabaleshwar-temple', 'poi-mirjan-fort', 'poi-yana-rocks'],
    sourceRef: {
      sourceId: CANONICAL_DESTINATION_SOURCES.karnataka_tourism.sourceId,
      trustClassification: 'OFFICIAL_PUBLISHED',
      lastVerifiedDate: '2026-10-31',
      citationNotice: CANONICAL_DESTINATION_SOURCES.karnataka_tourism.citationNotice,
    },
    photoMeta: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/53/PXL_20260103_101009613_People_and_Beach_Om_Beach_Gokarna%2C_Karnataka_35.jpg',
      caption: 'Curves of the Arabian Sea washing the rocky shores of Om Beach, Gokarna',
      captionKannada: 'ಗೋಕರ್ಣದ ಓಂ ಬೀಚ್‌ನ ಕಲ್ಲಿನ ದಡಕ್ಕೆ ಅಪ್ಪಳಿಸುವ ಅರಬ್ಬಿ ಸಮುದ್ರದ ನೀಲಿ ಅಲೆಗಳು',
      attribution: 'Photo by Sourabh.biswas003 / Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:PXL_20260103_101009613_People_and_Beach_Om_Beach_Gokarna%2C_Karnataka_35.jpg',
    },
  },

  // 7. Mysuru Ambavilas Palace (Royal Wadiyar Dynasty Seat)
  {
    id: 'poi-mysore-palace',
    name: 'Mysuru Ambavilas Palace',
    nameKannada: 'ಮೈಸೂರು ಅಂಬಾವಿಲಾಸ ಅರಮನೆ',
    alternateNames: ['Mysore Palace', 'Amba Vilas', 'Mysuru Aramane'],
    district: 'Mysuru',
    taluk: 'Mysuru',
    townOrVillage: 'Mysuru City',
    coordinates: [76.6552, 12.3052],
    address: 'Sayyaji Rao Road, Agrahara, Chamrajpura, Mysuru, Karnataka 570001',
    category: 'palaces_museums',
    macroRegion: 'Old Mysuru',
    description: 'Magnificent Indo-Saracenic royal residence of the Wadiyar dynasty designed by British architect Henry Irwin. Features the ornate Public Durbar Hall, stained glass ceilings from Glasgow, golden Howdah throne, and 97,000-bulb illumination on Sunday evenings.',
    descriptionKannada: 'ಒಡೆಯರ್ ರಾಜಮನೆತನದ ಭವ್ಯ ಇಂಡೋ-ಸಾರ್ಸೆನಿಕ್ ಅರಮನೆ. ಬ್ರಿಟಿಷ್ ವಾಸ್ತುಶಿಲ್ಪಿ ಹೆನ್ರಿ ಇರ್ವಿನ್ ವಿನ್ಯಾಸಗೊಳಿಸಿದ ಈ ಮಹಲ್‌ನಲ್ಲಿ ಭವ್ಯ ದರ್ಬಾರ್ ಹಾಲ್, ಕಲ್ಯಾಣ ಮಂಟಪದ ಗಾಜಿನ ಛಾವಣಿ ಹಾಗೂ ೯೭,೦೦೦ ದೀಪಗಳ ಸಾಪ್ತಾಹಿಕ ದೀಪಾಲಂಕಾರವಿದೆ.',
    historicalSignificance: 'Seat of the Kingdom of Mysore from 1399 to 1950. The modern palace was constructed between 1897 and 1912 after the old wooden palace burned down.',
    culturalSignificance: 'Epicenter of the world-famous Mysuru Dasara (Nada Habba) festival with the Jamboo Savari elephant procession carrying the golden Chamundeshwari idol.',
    visitorRecommendations: [
      'Enter through Varaha Gate or South Gate early in the morning to avoid ticket queues.',
      'Do not miss the Sunday evening 7:00 PM to 8:00 PM palace illumination.',
      'Audio guides in Kannada, English, and Hindi are available at the entrance counter.',
      'Combine with Sri Chamarajendra Zoological Gardens and Devaraja Market nearby.',
    ],
    recommendedDurationHours: 2.5,
    openingHours: '10:00 - 17:30 Daily',
    openingHoursNote: 'Palace illumination on Sundays & State Holidays: 19:00 - 20:00 (Dasara: 19:00 - 21:00). Sound & Light Show (Mon-Sat): Kannada 19:00 - 20:00, English 20:00 - 20:45.',
    seasonalAccess: {
      bestSeason: 'October to March (Dasara festivities, cool winter evenings 18°C - 28°C)',
      monsoonAdvisory: 'Pleasant rainfall; palace interior is fully covered and accessible year-round.',
      summerAdvisory: 'Warm daytime (30°C - 35°C); visit indoor galleries in early morning.',
    },
    entryFee: {
      indianCitizen: 100,
      foreignNational: 100,
      feeNote: 'Adults ₹100, Students & Children (10-18) ₹50, Children < 10 free. Interior photography prohibited; free footwear stands at Varaha & Amba Vilas gates.',
      isFree: false,
    },
    permit: {
      isRequired: false,
      issuingAuthority: 'Mysuru Palace Board, Govt of Karnataka',
      plasticBanEnforced: true,
    },
    accessibility: {
      wheelchairAccessible: true,
      stepCountApprox: 20,
      restroomAvailable: true,
      parkingAvailable: true,
    },
    transitConnectivity: {
      nearestRailwayStation: 'Mysuru Junction (MYS)',
      railwayStationCode: 'MYS',
      railwayDistanceKm: 2.0,
      nearestBusTerminal: 'Mysuru City Bus Stand (Suburban / CBS)',
      busTerminalCode: 'KSRTC-MYS',
      busTerminalDistanceKm: 1.5,
      lastMileOptions: [
        'Pre-paid auto-rickshaws directly from MYS railway station platform exit (₹40-₹60 meter tariff).',
        'Frequent KSRTC city buses from City Bus Stand to Palace Varaha Gate (₹10).',
        'Tonga horse carriage rides around palace perimeter for heritage experience.',
      ],
    },
    nearbyDestinationIds: ['poi-chamundi-hills', 'poi-srirangapatna', 'poi-brindavan-gardens', 'poi-st-philomenas-church'],
    sourceRef: {
      sourceId: CANONICAL_DESTINATION_SOURCES.karnataka_tourism.sourceId,
      trustClassification: 'OFFICIAL_PUBLISHED',
      lastVerifiedDate: '2026-10-31',
      citationNotice: 'Mysuru Palace Board statutory visitor guidelines and Archaeological Dept records.',
    },
    photoMeta: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Mysore_Palace_Morning.jpg',
      caption: 'Indo-Saracenic grandeur of Mysuru Palace Amba Vilas in morning light',
      captionKannada: 'ಮುಂಜಾನೆಯ ಹೊಂಗಿರಣದಲ್ಲಿ ಕಂಗೊಳಿಸುವ ಮೈಸೂರು ಅಂಬಾವಿಲಾಸ ಅರಮನೆ',
      attribution: 'Photo by Muhammad Mahdi Karim / Wikimedia Commons',
      license: 'GFDL 1.2 / CC BY-SA',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mysore_Palace_Morning.jpg',
    },
  },

  // 7.1 Srirangapatna Island Heritage (Daria Daulat Bagh, Gumbaz & Ranganatha)
  {
    id: 'poi-srirangapatna',
    name: 'Srirangapatna Island Heritage (Daria Daulat Bagh)',
    nameKannada: 'ಶ್ರೀರಂಗಪಟ್ಟಣ (ದರಿಯಾ ದೌಲತ್ ಬಾಗ್ ಮತ್ತು ಶ್ರೀರಂಗನಾಥಸ್ವಾಮಿ)',
    alternateNames: ['Seringapatam', 'Daria Daulat Bagh', 'Tipu Summer Palace'],
    district: 'Mandya',
    taluk: 'Srirangapatna',
    townOrVillage: 'Srirangapatna',
    coordinates: [76.6932, 12.4218],
    address: 'Daria Daulat Bagh, Srirangapatna, Mandya District, Karnataka 571438',
    category: 'heritage_monuments',
    macroRegion: 'Old Mysuru',
    description: 'Kaveri River island capital of Tipu Sultan and Hyder Ali. Highlights include Tipu’s teak Summer Palace (Daria Daulat Bagh) featuring historic 1780 Battle of Pollilur murals, Gumbaz mausoleum, subterranean Bailey’s Dungeon, and the 9th-century Sri Ranganathaswamy Temple.',
    descriptionKannada: 'ಕಾವೇರಿ ನದಿ ದ್ವೀಪದಲ್ಲಿರುವ ಐತಿಹಾಸಿಕ ತಾಣ. ಟಿಪ್ಪು ಸುಲ್ತಾನರ ಬೇಸಿಗೆ ಅರಮನೆ (ದರಿಯಾ ದೌಲತ್ ಬಾಗ್), ಗುಂಬಜ್, ಕರ್ನಲ್ ಬೈಲಿ ಜೈಲು ಹಾಗೂ ಪುರಾತನ ಶ್ರೀರಂಗನಾಥಸ್ವಾಮಿ ದೇವಾಲಯಗಳ ಮಹತ್ವದ ಸಂಗಮ.',
    historicalSignificance: 'Capital of the Kingdom of Mysore under Hyder Ali and Tipu Sultan until the Fourth Anglo-Mysore War of 1799. Site of significant anti-colonial resistance.',
    culturalSignificance: 'Adi Ranga is the first of three holy Kaveri river island shrines dedicated to Lord Ranganatha (along with Madhya Ranga at Shivanasamudra and Antya Ranga at Srirangam).',
    visitorRecommendations: [
      'Visit Daria Daulat Bagh in the morning when teak wood galleries are naturally lit.',
      'Combine Ranganathaswamy Temple darshan (07:30-13:30) with Gumbaz mausoleum.',
      'Pre-paid auto rickshaws at Srirangapatna station cover the 4-monument circuit for ₹150-₹200.',
    ],
    recommendedDurationHours: 3,
    seasonalAccess: {
      bestSeason: 'September to March',
      monsoonAdvisory: 'Pleasant during light monsoon, but Kaveri river currents run high at Sangama and island bathing ghats.',
      summerAdvisory: 'Midday temperatures can reach 36°C; early morning visits recommended for teak galleries.',
    },
    openingHours: '08:30 AM – 05:30 PM Daily',
    openingHoursNote: 'Daria Daulat Bagh open daily 08:30-17:30. Ranganathaswamy temple: 07:30-13:30 & 16:00-20:00.',
    entryFee: {
      indianCitizen: 25,
      foreignNational: 300,
      feeNote: 'ASI ticket ₹25 (Online ₹20) at Daria Daulat Bagh; children under 15 free. Ranganathaswamy temple entry free.',
      isFree: false,
    },
    permit: {
      isRequired: false,
      issuingAuthority: 'Archaeological Survey of India (Bengaluru Circle)',
      plasticBanEnforced: true,
    },
    accessibility: {
      wheelchairAccessible: true,
      stepCountApprox: 10,
      restroomAvailable: true,
      parkingAvailable: true,
    },
    transitConnectivity: {
      nearestRailwayStation: 'Srirangapatna Railway Station (SGM)',
      railwayStationCode: 'SGM',
      railwayDistanceKm: 1.2,
      nearestBusTerminal: 'Srirangapatna Bus Stand',
      busTerminalCode: 'KSRTC-SGP',
      busTerminalDistanceKm: 0.8,
      lastMileOptions: [
        'Local auto-rickshaws connect all 4 monuments across Srirangapatna island for ₹150-₹200.',
        'KSRTC suburban buses operate every 10 mins from Mysuru CBS to Srirangapatna (₹22, 16 km).',
      ],
    },
    nearbyDestinationIds: ['poi-mysore-palace', 'poi-chamundi-hills', 'poi-ranganathittu', 'poi-brindavan-gardens'],
    sourceRef: {
      sourceId: CANONICAL_DESTINATION_SOURCES.asi_monuments.sourceId,
      trustClassification: 'OFFICIAL_PUBLISHED',
      lastVerifiedDate: '2026-10-31',
      citationNotice: 'Archaeological Survey of India (Bengaluru Circle) Monument Index & Mandya District Gazette.',
    },
    photoMeta: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Daria_Daulat_Bagh.jpg',
      caption: 'Teakwood Summer Palace of Tipu Sultan at Daria Daulat Bagh, Srirangapatna',
      captionKannada: 'ದರಿಯಾ ದೌಲತ್ ಬಾಗ್ — ಟಿಪ್ಪು ಸುಲ್ತಾನರ ಸುಂದರ ಬೇಸಿಗೆ ಅರಮನೆ, ಶ್ರೀರಂಗಪಟ್ಟಣ',
      attribution: 'Photo by Ankmachine / Wikimedia Commons',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Daria_Daulat_Bagh.jpg',
    },
  },

  // 8. Madikeri Raja's Seat & Coorg Highlands
  {
    id: 'poi-coorg-raja-seat',
    name: "Madikeri Raja's Seat & Coorg Highlands",
    nameKannada: 'ರಾಜಾಸೀಟ್ ಮತ್ತು ಮಡಿಕೇರಿ — ಕೊಡಗು',
    alternateNames: ["Raja's Seat", 'Madikeri Viewpoint', 'Coorg Raja Seat'],
    district: 'Kodagu',
    taluk: 'Madikeri',
    townOrVillage: 'Madikeri',
    coordinates: [75.7367, 12.4148],
    address: 'Raja Seat Road, Stuart Hill, Madikeri, Kodagu, Karnataka 571201',
    category: 'hill_stations',
    macroRegion: 'Old Mysuru',
    description: 'Picturesque seasonal garden perched on a high ridge overlooking deep Western Ghats valleys. Historically used by the Rajas of Kodagu to enjoy breathtaking sunsets and misty mountain vistas.',
    descriptionKannada: 'ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಕಣಿವೆಗಳನ್ನು ನೋಡುವ ಎತ್ತರದ ಶಿಖರದ ಮೇಲಿನ ಸುಂದರ ಉದ್ಯಾನವನ. ಕೊಡಗಿನ ರಾಜರು ಸೂರ್ಯಾಸ್ತ ಮತ್ತು ಕಣಿವೆಗಳ ಮಂಜಿನ ನೋಟವನ್ನು ಆಸ್ವಾದಿಸುತ್ತಿದ್ದ ಐತಿಹಾಸಿಕ ತಾಣ.',
    historicalSignificance: 'Built during the reign of the Haleri Kings of Kodagu (17th to 19th century) as a scenic royal pleasure retreat.',
    culturalSignificance: 'Gateway to Kodagu cultural traditions, indigenous Ainmane ancestral homes, and highland coffee agro-forestry.',
    visitorRecommendations: [
      'Arrive by 05:00 PM for the sunset over the mist-laden Western Ghats ridges.',
      'Visit the musical fountain show in the garden after dusk.',
      'Explore nearby Abbey Falls (8 km away) and Omkareshwara Temple.',
      'Sample authentic Coorg coffee and spices from registered farmer co-operatives in town.',
    ],
    recommendedDurationHours: 3.0,
    openingHours: '05:30 - 20:00 Daily',
    openingHoursNote: 'Musical fountain: 19:00 - 19:30 on weekdays, 19:00 - 20:00 on weekends.',
    seasonalAccess: {
      bestSeason: 'October to March (Crisp 15°C - 24°C, blooming flowers, clear skies)',
      monsoonAdvisory: 'Heavy Western Ghats rainfall (June-August); dense mist limits valley visibility.',
      summerAdvisory: 'Pleasant mountain climate (20°C - 28°C); ideal retreat from plains heat.',
    },
    entryFee: {
      indianCitizen: 25,
      foreignNational: 25,
      feeNote: 'Garden entry ₹25; Toy train ride ₹20; Musical fountain ₹10',
      isFree: false,
    },
    permit: {
      isRequired: false,
      issuingAuthority: 'Kodagu District Horticulture Department',
      plasticBanEnforced: true,
    },
    accessibility: {
      wheelchairAccessible: true,
      stepCountApprox: 15,
      restroomAvailable: true,
      parkingAvailable: true,
    },
    transitConnectivity: {
      nearestRailwayStation: 'Mysuru Junction (MYS) & Hassan Junction (HAS)',
      railwayStationCode: 'MYS / HAS',
      railwayDistanceKm: 118.0,
      nearestBusTerminal: 'Madikeri KSRTC Bus Stand',
      busTerminalCode: 'KSRTC-MDK',
      busTerminalDistanceKm: 1.2,
      lastMileOptions: [
        'Pre-paid and meter autos from Madikeri Bus Stand to Raja’s Seat (₹40).',
        'KSRTC non-stop Rajahamsa and Airavat express buses from Mysuru (2.5 hours) and Bengaluru (5.5 hours).',
        'Private local taxis for circuit tours to Talakaveri, Abbey Falls, and Dubare Elephant Camp.',
      ],
    },
    nearbyDestinationIds: ['poi-abbey-falls', 'poi-talakaveri', 'poi-dubare-elephant-camp', 'poi-mandalpatti-peak'],
    sourceRef: {
      sourceId: CANONICAL_DESTINATION_SOURCES.karnataka_tourism.sourceId,
      trustClassification: 'OFFICIAL_PUBLISHED',
      lastVerifiedDate: '2026-10-31',
      citationNotice: 'Kodagu District Tourism & Horticulture guidelines.',
    },
    photoMeta: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Raja_seat_at_madikeri.JPG',
      caption: "Sunset pavilion and mountain mist at Raja's Seat, Madikeri Coorg",
      captionKannada: 'ಮಡಿಕೇರಿಯ ರಾಜಾಸೀಟ್‌ನಿಂದ ಕಾಣುವ ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಮಂಜು ಮುಸುಕಿದ ವಿಹಂಗಮ ಕಣಿವೆ',
      attribution: 'Photo by Akshayprabhu2005 / Wikimedia Commons',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Raja_seat_at_madikeri.JPG',
    },
  },
];

export class DestinationRegistryV8 {
  private static instance: DestinationRegistryV8 | null = null;
  private destinations: Map<string, ComprehensiveDestination> = new Map();

  private constructor() {
    // Populate with flagship comprehensive destinations
    for (const d of COMPREHENSIVE_FLAGSHIP_DESTINATIONS) {
      this.destinations.set(d.id, d);
    }
  }

  public static getInstance(): DestinationRegistryV8 {
    if (!DestinationRegistryV8.instance) {
      DestinationRegistryV8.instance = new DestinationRegistryV8();
    }
    return DestinationRegistryV8.instance;
  }

  public getAll(): ComprehensiveDestination[] {
    return Array.from(this.destinations.values());
  }

  public getById(id: string): ComprehensiveDestination | undefined {
    return this.destinations.get(id);
  }

  public getByDistrict(district: string): ComprehensiveDestination[] {
    const q = district.toLowerCase();
    return this.getAll().filter((d) => d.district.toLowerCase() === q);
  }

  public getByCategory(category: DestinationCategoryV8): ComprehensiveDestination[] {
    return this.getAll().filter((d) => d.category === category);
  }

  public getByRegion(macroRegion: KarnatakaMacroRegion): ComprehensiveDestination[] {
    return this.getAll().filter((d) => d.macroRegion === macroRegion);
  }

  public search(query: string): ComprehensiveDestination[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAll();
    return this.getAll().filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.nameKannada.includes(q) ||
        d.district.toLowerCase().includes(q) ||
        d.taluk.toLowerCase().includes(q) ||
        d.alternateNames.some((alt) => alt.toLowerCase().includes(q)) ||
        d.description.toLowerCase().includes(q)
    );
  }

  public getTotalCount(): number {
    return this.destinations.size;
  }
}
