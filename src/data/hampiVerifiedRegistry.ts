// src/data/hampiVerifiedRegistry.ts

export type HampiClusterId = 'sacred_centre' | 'royal_centre' | 'vittala_complex' | 'natural_cultural';

export interface VerifiedMediaAsset {
  id: string;
  destinationId: 'hampi';
  poiId: string;
  title: string;
  commonsPageUrl: string;
  originalUrl: string;
  thumbSrcSet: {
    w640: string;
    w1280: string;
    w2560: string;
    w3840?: string; // Included only when original width >= 3840px
  };
  photographer: string;
  license: 'CC BY-SA 3.0' | 'CC BY-SA 4.0';
  licenseUrl: string;
  originalWidth: number;
  originalHeight: number;
  focalPoint: string; // CSS object-position
  verificationStatus: 'VERIFIED_WIKIMEDIA_COMMONS';
}

export interface HampiAttraction {
  id: string;
  nameEn: string;
  nameKn: string;
  cluster: HampiClusterId;
  clusterLabel: string;
  coordinates: [number, number]; // [lng, lat] WGS84 verified
  elevationMeters: number;
  openingHours: string;
  entryFee: {
    indianInr: number;
    saarcBimstecInr: number;
    foreignInr: number;
    note: string;
  };
  recommendedDurationMins: number;
  summary: string;
  safetyAndAccessNote: string;
  authoritativeSources: { label: string; url: string }[];
  mediaAssetId?: string;
}

export const HAMPI_VERIFIED_MEDIA: Record<string, VerifiedMediaAsset> = {
  virupaksha_hero: {
    id: 'virupaksha_hero',
    destinationId: 'hampi',
    poiId: 'virupaksha-temple',
    title: 'Virupaksha Temple and Chariot at Hampi (ASI Monument S-KA-105)',
    commonsPageUrl: 'https://commons.wikimedia.org/wiki/File:Virupaksha_Temple_and_Chariot_at_Hampi.jpg',
    originalUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Virupaksha_Temple_and_Chariot_at_Hampi.jpg',
    thumbSrcSet: {
      w640: 'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Virupaksha_Temple_and_Chariot_at_Hampi.jpg&width=640',
      w1280: 'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Virupaksha_Temple_and_Chariot_at_Hampi.jpg&width=1280',
      w2560: 'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Virupaksha_Temple_and_Chariot_at_Hampi.jpg&width=2560',
      w3840: 'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Virupaksha_Temple_and_Chariot_at_Hampi.jpg&width=3840',
    },
    photographer: 'Naveen P.G. (User:Pgnaveen)',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    originalWidth: 4928,
    originalHeight: 3264,
    focalPoint: '50% 42%',
    verificationStatus: 'VERIFIED_WIKIMEDIA_COMMONS',
  },
  stone_chariot_vittala: {
    id: 'stone_chariot_vittala',
    destinationId: 'hampi',
    poiId: 'stone-chariot',
    title: 'Stone Chariot at Vittala Temple, Hampi',
    commonsPageUrl: 'https://commons.wikimedia.org/wiki/File:Stone_Chariot_at_Vittala_temple,_Hampi.jpg',
    originalUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Stone_Chariot_at_Vittala_temple%2C_Hampi.jpg',
    thumbSrcSet: {
      w640: 'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Stone_Chariot_at_Vittala_temple,_Hampi.jpg&width=640',
      w1280: 'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Stone_Chariot_at_Vittala_temple,_Hampi.jpg&width=1280',
      w2560: 'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Stone_Chariot_at_Vittala_temple,_Hampi.jpg&width=2560',
    },
    photographer: 'Corrector007',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    originalWidth: 3264,
    originalHeight: 1836,
    focalPoint: '50% 50%',
    verificationStatus: 'VERIFIED_WIKIMEDIA_COMMONS',
  },
  lotus_mahal_zenana: {
    id: 'lotus_mahal_zenana',
    destinationId: 'hampi',
    poiId: 'lotus-mahal',
    title: 'Lotus Mahal (Kamal Mahal), Zenana Enclosure, Hampi',
    commonsPageUrl: 'https://commons.wikimedia.org/wiki/File:LOTUS_MAHAL,_HAMPI,_karnataka.jpg',
    originalUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/LOTUS_MAHAL%2C_HAMPI%2C_karnataka.jpg',
    thumbSrcSet: {
      w640: 'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/LOTUS_MAHAL,_HAMPI,_karnataka.jpg&width=640',
      w1280: 'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/LOTUS_MAHAL,_HAMPI,_karnataka.jpg&width=1280',
      w2560: 'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/LOTUS_MAHAL,_HAMPI,_karnataka.jpg&width=2560',
      w3840: 'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/LOTUS_MAHAL,_HAMPI,_karnataka.jpg&width=3840',
    },
    photographer: 'Naveen Kadam (User:Naveekadamphotography)',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    originalWidth: 4341,
    originalHeight: 4578,
    focalPoint: '50% 55%',
    verificationStatus: 'VERIFIED_WIKIMEDIA_COMMONS',
  },
  lotus_mahal_wide: {
    id: 'lotus_mahal_wide',
    destinationId: 'hampi',
    poiId: 'royal-enclosure',
    title: 'Lotus Mahal Wide Perspective, Hampi',
    commonsPageUrl: 'https://commons.wikimedia.org/wiki/File:Lotus_Mahal_-hampi.jpg',
    originalUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Lotus_Mahal_-hampi.jpg',
    thumbSrcSet: {
      w640: 'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Lotus_Mahal_-hampi.jpg&width=640',
      w1280: 'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Lotus_Mahal_-hampi.jpg&width=1280',
      w2560: 'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Lotus_Mahal_-hampi.jpg&width=2560',
      w3840: 'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Lotus_Mahal_-hampi.jpg&width=3840',
    },
    photographer: 'Sarnith vikash',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    originalWidth: 4496,
    originalHeight: 3000,
    focalPoint: '50% 50%',
    verificationStatus: 'VERIFIED_WIKIMEDIA_COMMONS',
  },
};

export const HAMPI_ATTRACTIONS: HampiAttraction[] = [
  // ================= 1. SACRED CENTRE =================
  {
    id: 'virupaksha-temple',
    nameEn: 'Virupaksha Temple',
    nameKn: 'ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯ',
    cluster: 'sacred_centre',
    clusterLabel: 'Sacred Centre',
    coordinates: [76.4589, 15.3350],
    elevationMeters: 432,
    openingHours: '06:00 AM – 01:00 PM, 05:00 PM – 09:00 PM (Daily)',
    entryFee: {
      indianInr: 2,
      saarcBimstecInr: 2,
      foreignInr: 2,
      note: 'Nominal temple trust entry ₹2; still camera fee ₹50. Active living temple since 7th century CE.',
    },
    recommendedDurationMins: 75,
    summary:
      'Living Shaivite sanctuary anchored by a 50-meter nine-tiered eastern Raya Gopura, Ranga Mandapa ceiling frescoes, and the Hampi Bazaar ceremonial axis.',
    safetyAndAccessNote: 'Footwear must be deposited at the shoe counter outside the eastern gopura; beware of macaques near offerings.',
    authoritativeSources: [
      { label: 'ASI Hampi Mini Circle', url: 'https://asimustsee.nic.in/' },
      { label: 'Hampi Monument Timings Registry', url: 'https://hampi.in/hampi-monument-timings' },
    ],
    mediaAssetId: 'virupaksha_hero',
  },
  {
    id: 'hemakuta-hill',
    nameEn: 'Hemakuta Hill Temple Complex',
    nameKn: 'ಹೇಮಕೂಟ ಬೆಟ್ಟ',
    cluster: 'sacred_centre',
    clusterLabel: 'Sacred Centre',
    coordinates: [76.4582, 15.3328],
    elevationMeters: 465,
    openingHours: '06:00 AM – 06:00 PM (Sunrise to Sunset)',
    entryFee: { indianInr: 0, saarcBimstecInr: 0, foreignInr: 0, note: 'Free entry.' },
    recommendedDurationMins: 60,
    summary:
      'Sloping granite sheet-rock hill dotted with over 30 pre-Vijayanagara and early Vijayanagara triple-shrined (Trikutachala) stepped-pyramid temples.',
    safetyAndAccessNote: 'Smooth granite bedrock becomes slippery during brief showers; descend before dusk as there is no artificial path lighting.',
    authoritativeSources: [{ label: 'UNESCO Group of Monuments at Hampi', url: 'https://whc.unesco.org/en/list/241/' }],
  },
  {
    id: 'krishna-temple',
    nameEn: 'Balakrishna Temple & Krishna Bazaar',
    nameKn: 'ಕೃಷ್ಣ ದೇವಾಲಯ',
    cluster: 'sacred_centre',
    clusterLabel: 'Sacred Centre',
    coordinates: [76.4586, 15.3292],
    elevationMeters: 448,
    openingHours: '06:00 AM – 06:00 PM',
    entryFee: { indianInr: 0, saarcBimstecInr: 0, foreignInr: 0, note: 'Free entry.' },
    recommendedDurationMins: 45,
    summary:
      'Built by Krishnadevaraya in 1513 CE to commemorate the conquest of Udayagiri (Odisha), facing an excavated colonnaded bazaar and sacred pushkarani tank.',
    safetyAndAccessNote: 'Direct roadside access along the Kamalapura–Hampi Bazaar road; watch for two-wheeler traffic when crossing to Krishna Bazaar.',
    authoritativeSources: [{ label: 'UNESCO World Heritage Dossier 241', url: 'https://whc.unesco.org/en/list/241/' }],
  },
  {
    id: 'sasivekalu-ganesha',
    nameEn: 'Sasivekalu Ganesha',
    nameKn: 'ಸಾಸಿವೆಕಾಳು ಗಣೇಶ',
    cluster: 'sacred_centre',
    clusterLabel: 'Sacred Centre',
    coordinates: [76.4583, 15.3311],
    elevationMeters: 455,
    openingHours: '06:00 AM – 06:00 PM',
    entryFee: { indianInr: 0, saarcBimstecInr: 0, foreignInr: 0, note: 'Free entry.' },
    recommendedDurationMins: 20,
    summary:
      '2.4-meter monolithic Ganesha statue carved in 1506 CE from a single boulder on the southern slope of Hemakuta Hill, housed in an open pillared pavilion.',
    safetyAndAccessNote: 'Short stone-stepped approach from the main road.',
    authoritativeSources: [{ label: 'ASI Hampi Circle', url: 'https://asi.nic.in/' }],
  },
  {
    id: 'badavilinga',
    nameEn: 'Badavilinga',
    nameKn: 'ಬಡವಿಲಿಂಗ',
    cluster: 'sacred_centre',
    clusterLabel: 'Sacred Centre',
    coordinates: [76.4593, 15.3280],
    elevationMeters: 442,
    openingHours: '06:00 AM – 06:00 PM',
    entryFee: { indianInr: 0, saarcBimstecInr: 0, foreignInr: 0, note: 'Free entry.' },
    recommendedDurationMins: 20,
    summary:
      '3-meter-high monolithic black stone Shiva Linga permanently standing in water fed by an ancient Vijayanagara irrigation canal inside a roofless sanctum.',
    safetyAndAccessNote: 'Situated immediately adjacent to Lakshmi Narasimha; stone threshold can be damp.',
    authoritativeSources: [{ label: 'Hampi Monument Registry', url: 'https://hampi.in/hampi-monument-timings' }],
  },
  {
    id: 'lakshmi-narasimha',
    nameEn: 'Ugra Narasimha (Lakshmi Narasimha)',
    nameKn: 'ಲಕ್ಷ್ಮೀ ನರಸಿಂಹ (ಉಗ್ರ ನರಸಿಂಹ)',
    cluster: 'sacred_centre',
    clusterLabel: 'Sacred Centre',
    coordinates: [76.4590, 15.3281],
    elevationMeters: 443,
    openingHours: '06:00 AM – 06:00 PM',
    entryFee: { indianInr: 0, saarcBimstecInr: 0, foreignInr: 0, note: 'Free entry.' },
    recommendedDurationMins: 25,
    summary:
      '6.7-meter monolithic sculpture commissioned in 1528 CE during Krishnadevaraya’s reign, depicting Narasimha seated cross-legged beneath a seven-hooded Adishesha.',
    safetyAndAccessNote: 'Flat walk from the parking bay; exposed to midday sun.',
    authoritativeSources: [{ label: 'UNESCO Group of Monuments at Hampi', url: 'https://whc.unesco.org/en/list/241/' }],
  },
  {
    id: 'achyutaraya-temple',
    nameEn: 'Achyutaraya Temple & Courtesans Street (Sule Bazaar)',
    nameKn: 'ಅಚ್ಯುತರಾಯ ದೇವಾಲಯ',
    cluster: 'sacred_centre',
    clusterLabel: 'Sacred Centre',
    coordinates: [76.4682, 15.3324],
    elevationMeters: 438,
    openingHours: '06:00 AM – 06:00 PM',
    entryFee: { indianInr: 0, saarcBimstecInr: 0, foreignInr: 0, note: 'Free entry.' },
    recommendedDurationMins: 50,
    summary:
      'Built in 1534 CE in the valley between Matanga and Gandhamadana hills, dedicated to Lord Tiruvengalanatha and fronted by the broad colonnaded Sule Bazaar.',
    safetyAndAccessNote: 'Reached by descending stone steps from Matanga Hill or walking along the river path from Kodandarama Temple; carry drinking water.',
    authoritativeSources: [{ label: 'UNESCO Group of Monuments at Hampi', url: 'https://whc.unesco.org/en/list/241/' }],
  },

  // ================= 2. ROYAL CENTRE =================
  {
    id: 'mahanavami-dibba',
    nameEn: 'Mahanavami Dibba (Dasara Platform)',
    nameKn: 'ಮಹಾನವಮಿ ದಿಬ್ಬ',
    cluster: 'royal_centre',
    clusterLabel: 'Royal Centre',
    coordinates: [76.4718, 15.3132],
    elevationMeters: 462,
    openingHours: '06:00 AM – 06:00 PM',
    entryFee: { indianInr: 0, saarcBimstecInr: 0, foreignInr: 0, note: 'Free entry inside Royal Enclosure.' },
    recommendedDurationMins: 45,
    summary:
      '12-meter-high three-tiered granite ceremonial stage inside the Royal Enclosure, carved with low-relief friezes of royal processions, hunting scenes, and foreign horse traders.',
    safetyAndAccessNote: 'Steep stone staircase to the summit platform; hold handrails and supervise children.',
    authoritativeSources: [{ label: 'UNESCO World Heritage Centre', url: 'https://whc.unesco.org/en/list/241/' }],
  },
  {
    id: 'hazara-rama-temple',
    nameEn: 'Hazara Rama Temple',
    nameKn: 'ಹಜಾರ ರಾಮ ದೇವಾಲಯ',
    cluster: 'royal_centre',
    clusterLabel: 'Royal Centre',
    coordinates: [76.4714, 15.3168],
    elevationMeters: 458,
    openingHours: '06:00 AM – 06:00 PM',
    entryFee: { indianInr: 0, saarcBimstecInr: 0, foreignInr: 0, note: 'Free entry.' },
    recommendedDurationMins: 45,
    summary:
      'Private royal chapel of the Vijayanagara rulers featuring exterior enclosure walls carved with over 1,000 narrative bas-relief panels of the Ramayana and polished black basalt pillars.',
    safetyAndAccessNote: 'Level stone courtyard; high thermal radiation on bare stone between 12:00 PM and 3:30 PM.',
    authoritativeSources: [{ label: 'ASI Hampi Circle', url: 'https://asi.nic.in/' }],
  },
  {
    id: 'queens-bath',
    nameEn: "Queen's Bath",
    nameKn: 'ರಾಣಿಯ ಸ್ನಾನಗೃಹ',
    cluster: 'royal_centre',
    clusterLabel: 'Royal Centre',
    coordinates: [76.4731, 15.3095],
    elevationMeters: 460,
    openingHours: '06:00 AM – 06:00 PM',
    entryFee: { indianInr: 0, saarcBimstecInr: 0, foreignInr: 0, note: 'Free entry.' },
    recommendedDurationMins: 30,
    summary:
      'Indo-Islamic aquatic pavilion at the southern entrance to the Royal Centre featuring a 1.8m-deep sunken bath surrounded by ornate stucco-vaulted corridors and projecting lotus balconies.',
    safetyAndAccessNote: 'Stay behind guardrails around the sunken central pool edge.',
    authoritativeSources: [{ label: 'Hampi Monument Timings', url: 'https://hampi.in/hampi-monument-timings' }],
  },
  {
    id: 'lotus-mahal',
    nameEn: 'Lotus Mahal (Kamal Mahal / Chitrangini Mahal)',
    nameKn: 'ಲೋಟಸ್ ಮಹಲ್ (ಕಮಲ ಮಹಲ್)',
    cluster: 'royal_centre',
    clusterLabel: 'Royal Centre',
    coordinates: [76.4692, 15.3191],
    elevationMeters: 454,
    openingHours: '08:00 AM – 06:00 PM (Daily)',
    entryFee: {
      indianInr: 40,
      saarcBimstecInr: 40,
      foreignInr: 600,
      note: 'Combined ASI same-day ticket covers Zenana Enclosure (Lotus Mahal + Elephant Stables), Vittala Temple, and Kamalapura Museum. Free for children under 15.',
    },
    recommendedDurationMins: 50,
    summary:
      'Symmetrical two-storeyed pavilion inside the walled Zenana Enclosure blending cusped Indo-Islamic arches with stepped Vijayanagara pyramidal roofs shaped like an opening lotus bud.',
    safetyAndAccessNote: 'Retain your physical or e-ticket QR from the Zenana Enclosure counter as it grants same-day entry to Vittala Temple.',
    authoritativeSources: [
      { label: 'ASI Online Ticketing Portal', url: 'https://asi.payumoney.com/' },
      { label: 'Hampi Monument Timings', url: 'https://hampi.in/hampi-monument-timings' },
    ],
    mediaAssetId: 'lotus_mahal_zenana',
  },
  {
    id: 'elephant-stables',
    nameEn: 'Elephant Stables (Gajashala)',
    nameKn: 'ಆನೆ ಲಾಯ (ಗಜಶಾಲೆ)',
    cluster: 'royal_centre',
    clusterLabel: 'Royal Centre',
    coordinates: [76.4713, 15.3204],
    elevationMeters: 455,
    openingHours: '08:00 AM – 06:00 PM (Daily)',
    entryFee: {
      indianInr: 40,
      saarcBimstecInr: 40,
      foreignInr: 600,
      note: 'Included in the combined ASI Zenana Enclosure & Vittala Temple same-day ticket.',
    },
    recommendedDurationMins: 40,
    summary:
      'Grand 11-chambered domed structure immediately east of the Zenana Enclosure that housed the ceremonial royal elephants of the Vijayanagara court.',
    safetyAndAccessNote: 'Accessible via the Zenana Enclosure ticket gate.',
    authoritativeSources: [{ label: 'ASI Online Ticketing Portal', url: 'https://asi.payumoney.com/' }],
  },
  {
    id: 'royal-enclosure',
    nameEn: 'Royal Enclosure & Stepped Tank (Pushkarani)',
    nameKn: 'ರಾಯಲ್ ಎನ್ಕ್ಲೋಜರ್ ಮತ್ತು ಪುಷ್ಕರಣಿ',
    cluster: 'royal_centre',
    clusterLabel: 'Royal Centre',
    coordinates: [76.4706, 15.3125],
    elevationMeters: 461,
    openingHours: '06:00 AM – 06:00 PM',
    entryFee: { indianInr: 0, saarcBimstecInr: 0, foreignInr: 0, note: 'Free entry.' },
    recommendedDurationMins: 60,
    summary:
      'Fortified administrative heart of the empire containing the precision-fitted black schist Stepped Tank (Pushkarani), stone aqueducts, underground treasury chamber, and audience hall foundations.',
    safetyAndAccessNote: 'Stepped tank edges are unrailed; entering the water or climbing down the schist tiers is prohibited by ASI guards.',
    authoritativeSources: [{ label: 'UNESCO World Heritage Centre', url: 'https://whc.unesco.org/en/list/241/' }],
    mediaAssetId: 'lotus_mahal_wide',
  },

  // ================= 3. VITTALA COMPLEX =================
  {
    id: 'vittala-temple',
    nameEn: 'Vijaya Vittala Temple Complex',
    nameKn: 'ವಿಜಯ ವಿಠ್ಠಲ ದೇವಾಲಯ',
    cluster: 'vittala_complex',
    clusterLabel: 'Vittala Complex',
    coordinates: [76.4750, 15.3417],
    elevationMeters: 428,
    openingHours: '08:30 AM – 05:30 PM (Daily)',
    entryFee: {
      indianInr: 40,
      saarcBimstecInr: 40,
      foreignInr: 600,
      note: 'Combined ASI same-day ticket (valid across Vittala Complex and Zenana Enclosure). Electric buggy from Gejjala Mandapa parking costs ~₹20 round-trip.',
    },
    recommendedDurationMins: 120,
    summary:
      'Apex of Vijayanagara temple architecture featuring the 56-pillar Musical Ranga Mandapa (Saregama pillars), Kalyana Mandapa, and sprawling stone-flagged courtyard.',
    safetyAndAccessNote: 'Private motor vehicles are restricted 1 km prior at Gejjala Mandapa; walk the heritage trail or board the official battery-operated buggy.',
    authoritativeSources: [
      { label: 'ASI Online Ticketing Portal', url: 'https://asi.payumoney.com/' },
      { label: 'Hampi Monument Timings', url: 'https://hampi.in/hampi-monument-timings' },
    ],
  },
  {
    id: 'stone-chariot',
    nameEn: 'Hampi Stone Chariot (Garuda Shrine)',
    nameKn: 'ಹಂಪಿ ಕಲ್ಲಿನ ರಥ',
    cluster: 'vittala_complex',
    clusterLabel: 'Vittala Complex',
    coordinates: [76.4752, 15.3417],
    elevationMeters: 428,
    openingHours: '08:30 AM – 05:30 PM (Daily)',
    entryFee: {
      indianInr: 40,
      saarcBimstecInr: 40,
      foreignInr: 600,
      note: 'Located inside Vittala Temple courtyard; covered by the Vittala Temple ASI ticket.',
    },
    recommendedDurationMins: 30,
    summary:
      'Iconic monolithic-style granite ratha shrine dedicated to Garuda inside the Vittala Temple courtyard, assembled with interlocking granite blocks and floral wheel spokes depicted on the ₹50 Indian banknote.',
    safetyAndAccessNote: 'Protective chain barrier surrounds the chariot plinth; touching or climbing the stone wheels is strictly prohibited.',
    authoritativeSources: [{ label: 'UNESCO Group of Monuments at Hampi', url: 'https://whc.unesco.org/en/list/241/' }],
    mediaAssetId: 'stone_chariot_vittala',
  },
  {
    id: 'kings-balance',
    nameEn: "King's Balance (Tulabhara)",
    nameKn: 'ತುಲಾಭಾರ ಮಂಟಪ (ಅರಸರ ತಕ್ಕಡಿ)',
    cluster: 'vittala_complex',
    clusterLabel: 'Vittala Complex',
    coordinates: [76.4730, 15.3395],
    elevationMeters: 431,
    openingHours: '06:00 AM – 06:00 PM',
    entryFee: { indianInr: 0, saarcBimstecInr: 0, foreignInr: 0, note: 'Free entry along the ancient footpath southwest of Vittala Temple.' },
    recommendedDurationMins: 20,
    summary:
      '5-meter granite post-and-lintel frame with three stone loops on the crossbeam where Vijayanagara emperors weighed themselves against gold, gems, and grain for charitable distribution on auspicious days.',
    safetyAndAccessNote: 'Located on the pedestrian boulder path connecting Achyutaraya Temple to the Vittala complex.',
    authoritativeSources: [{ label: 'UNESCO Group of Monuments at Hampi', url: 'https://whc.unesco.org/en/list/241/' }],
  },

  // ================= 4. NATURAL & CULTURAL =================
  {
    id: 'matanga-hill',
    nameEn: 'Matanga Hill Summit & Veerabhadra Shrine',
    nameKn: 'ಮಾತಂಗ ಬೆಟ್ಟ',
    cluster: 'natural_cultural',
    clusterLabel: 'Natural & Cultural',
    coordinates: [76.4660, 15.3320],
    elevationMeters: 515,
    openingHours: '05:30 AM – 06:30 PM',
    entryFee: { indianInr: 0, saarcBimstecInr: 0, foreignInr: 0, note: 'Free trek.' },
    recommendedDurationMins: 90,
    summary:
      'Highest panoramic vantage point in central Hampi (515 m ASL), offering a 360-degree view of the Tungabhadra river bend, Achyutaraya valley, and Virupaksha gopura.',
    safetyAndAccessNote: 'Carry a headlamp for pre-dawn sunrise climbs; use the stone-cut steps starting beside the Monolithic Bull (Eduru Basavanna) at the east end of Hampi Bazaar.',
    authoritativeSources: [{ label: 'Karnataka Tourism — Hampi', url: 'https://karnatakatourism.org/' }],
  },
  {
    id: 'tungabhadra-river',
    nameEn: 'Tungabhadra River Gorge & Chakratirtha Bend',
    nameKn: 'ತುಂಗಭದ್ರಾ ನದಿ ತೀರ',
    cluster: 'natural_cultural',
    clusterLabel: 'Natural & Cultural',
    coordinates: [76.4648, 15.3372],
    elevationMeters: 422,
    openingHours: '06:00 AM – 06:00 PM',
    entryFee: { indianInr: 0, saarcBimstecInr: 0, foreignInr: 0, note: 'Walkway free; licensed coracle rides subject to seasonal water level regulations.' },
    recommendedDurationMins: 60,
    summary:
      'Granite gorge where the Tungabhadra River cuts north around Chakratirtha, lined with rock-cut Sahasralinga carvings, Purandaradasa Mandapa, and Kodandarama Temple.',
    safetyAndAccessNote: 'CRITICAL SAFETY WARNING: Deep whirlpools, submerged granite crevices, and mugger crocodiles inhabit the river gorge. Never swim or board unlicensed coracles during dam water releases.',
    authoritativeSources: [{ label: 'Vijayanagara District Administration', url: 'https://vijayanagara.nic.in/' }],
  },
  {
    id: 'daroji-sloth-bear-sanctuary',
    nameEn: 'Daroji Sloth Bear Sanctuary',
    nameKn: 'ದರೋಜಿ ಕರಡಿ ಧಾಮ',
    cluster: 'natural_cultural',
    clusterLabel: 'Natural & Cultural',
    coordinates: [76.5711, 15.2531],
    elevationMeters: 540,
    openingHours: '02:00 PM – 05:30 PM (Daily; Karadikallu Gudda watchtower)',
    entryFee: {
      indianInr: 50,
      saarcBimstecInr: 50,
      foreignInr: 300,
      note: 'Karnataka Forest Department entry fee + vehicle entry charge (~₹150–₹500 depending on vehicle type).',
    },
    recommendedDurationMins: 120,
    summary:
      '82.72 sq km scrub-forest and boulder sanctuary located 15 km southeast of Kamalapura, established by the Karnataka Forest Department specifically for Indian Sloth Bears (*Melursus ursinus*), leopards, and paintedfrancolins.',
    safetyAndAccessNote: 'Visitors must remain at the designated Karadikallu Gudda watchtower; walking onto boulder outcrops inside the sanctuary is strictly forbidden.',
    authoritativeSources: [{ label: 'Karnataka Forest Department (Aranya)', url: 'https://aranya.gov.in/' }],
  },
  {
    id: 'anegundi-area',
    nameEn: 'Anegundi Heritage Village & Anjanadri Hill',
    nameKn: 'ಆನೆಗುಂದಿ ಮತ್ತು ಅಂಜನಾದ್ರಿ ಬೆಟ್ಟ',
    cluster: 'natural_cultural',
    clusterLabel: 'Natural & Cultural',
    coordinates: [76.4910, 15.3530],
    elevationMeters: 445,
    openingHours: '06:00 AM – 06:30 PM',
    entryFee: { indianInr: 0, saarcBimstecInr: 0, foreignInr: 0, note: 'Free entry.' },
    recommendedDurationMins: 150,
    summary:
      'Pre-Vijayanagara fortified citadel on the northern bank of the Tungabhadra (Koppal district border), featuring Gagan Mahal, Chintamani complex, Pampa Sarovar, and the 575-step Anjanadri Hill.',
    safetyAndAccessNote: 'When the river ferry is closed, travel via the Bukkasagara motorable road bridge (~22 km road detour from Kamalapura).',
    authoritativeSources: [{ label: 'Karnataka Tourism — Anegundi', url: 'https://karnatakatourism.org/' }],
  },
];

