/**
 * @file src/components/TransportDirectoryWorkspace.tsx
 * @description Dedicated Transport Infrastructure Directory for Karnataka Tourism.
 * Separates physical facility discovery (railway stations & bus terminals) with verified
 * photography, amenities, and operator metadata from dynamic route search.
 * @theme Code. Create. Celebrate Kannada.
 */

import React, { useState } from 'react';
import { getAuthenticDestinationPhoto } from '../data/karnatakaPhotoRegistry';

export interface TransportFacility {
  id: string;
  category: 'railway_station' | 'bus_terminal';
  name: string;
  nameKannada: string;
  code: string;
  operatorOrZone: string;
  divisionOrZone: string;
  district: string;
  macroRegion: string;
  facilities: string[];
  supportedServices?: string[];
  platformsAndEnquiry?: string;
  topConnections: string[];
  officialUrl: string;
  sourceAttribution: string;
  verifiedDate: string;
  coordinates: [number, number];
}

export const KARNATAKA_TRANSPORT_FACILITIES: TransportFacility[] = [
  // ================= 1. RAILWAY STATIONS =================
  {
    id: 'rail-sbc',
    category: 'railway_station',
    name: 'KSR Bengaluru City Junction (SBC)',
    nameKannada: 'ಕ್ರಾಂತಿವೀರ ಸಂಗೊಳ್ಳಿ ರಾಯಣ್ಣ ಬೆಂಗಳೂರು ನಗರ ರೈಲು ನಿಲ್ದಾಣ',
    code: 'SBC',
    operatorOrZone: 'South Western Railway (SWR)',
    divisionOrZone: 'Bengaluru Division (Headquarters)',
    district: 'Bengaluru Urban',
    macroRegion: 'Old Mysuru',
    facilities: [
      'Luggage Cloakroom',
      'AC Executive Lounge',
      'IRCTC Multi-Cuisine Food Plaza',
      'Retiring Rooms & Dormitories',
      'High-Speed Wi-Fi',
      'Pre-paid Auto & Taxi Stand',
      'Direct Namma Metro Skywalk (Kempegowda Majestic)',
    ],
    topConnections: [
      'Mysuru (Vande Bharat 20607 / Shatabdi — 1 hr 50 min)',
      'Hosapete / Hampi (Hampi Express 16592 overnight)',
      'Hubballi (Vande Bharat 20661 / Jan Shatabdi)',
      'Mangaluru (Vistadome Ghat Express 16539 / Panchaganga 16595)',
      'Belagavi & Kalaburagi',
    ],
    officialUrl: 'https://www.irctc.co.in/nget/train-search',
    sourceAttribution: 'South Western Railway (SWR) Official Station Index',
    verifiedDate: '2026-11-01',
    coordinates: [77.5683, 12.9784],
  },
  {
    id: 'rail-mys',
    category: 'railway_station',
    name: 'Mysuru Junction (MYS)',
    nameKannada: 'ಮೈಸೂರು ಜಂಕ್ಷನ್ ರೈಲು ನಿಲ್ದಾಣ',
    code: 'MYS',
    operatorOrZone: 'South Western Railway (SWR)',
    divisionOrZone: 'Mysuru Division (Divisional HQ)',
    district: 'Mysuru',
    macroRegion: 'Old Mysuru',
    facilities: [
      'Adjacent Mysore Rail Museum',
      'Heritage Clock Tower & Concourse',
      'AC Waiting Lounges',
      'Pre-paid Auto Stand',
      'Luggage Cloakroom & Battery Cars',
      'KSTDC Tourist Information Counter',
    ],
    topConnections: [
      'Bengaluru (Vande Bharat / Shatabdi / Tipu Express)',
      'Hassan (Gateway to Belur & Halebidu)',
      'Mangaluru (Via Sakleshpur Shiradi Ghats)',
      'Madikeri (Coorg via connecting KSRTC corridor)',
      'Bandipur & Kabini Wildlife Gateways',
    ],
    officialUrl: 'https://www.irctc.co.in/nget/train-search',
    sourceAttribution: 'South Western Railway (Mysuru Division)',
    verifiedDate: '2026-11-01',
    coordinates: [76.6435, 12.3168],
  },
  {
    id: 'rail-hpt',
    category: 'railway_station',
    name: 'Hosapete Junction (HPT — Hampi Gateway)',
    nameKannada: 'ಹೊಸಪೇಟೆ ಜಂಕ್ಷನ್ (ಹಂಪಿ ಹೆಬ್ಬಾಗಿಲು)',
    code: 'HPT',
    operatorOrZone: 'South Western Railway (SWR)',
    divisionOrZone: 'Hubballi Division',
    district: 'Vijayanagara',
    macroRegion: 'Kalyana Karnataka',
    facilities: [
      'Vijayanagara Architectural Facade',
      'Dedicated Hampi Tourist Information Desk',
      'Station Auto & Taxi Stand to Hampi Bazaar (13 km)',
      'AC Waiting Room & Cloakroom',
      'Retiring Rooms & Cafeteria',
    ],
    topConnections: [
      'Hampi UNESCO World Heritage Monuments (13 km)',
      'Bengaluru (Hampi Express 16592 overnight)',
      'Hubballi Junction (UBL — 143 km)',
      'Badami & Bagalkote (Chalukya Circuit)',
      'Tungabhadra Dam & Japanese Garden',
    ],
    officialUrl: 'https://www.irctc.co.in/nget/train-search',
    sourceAttribution: 'South Western Railway (Hubballi Division)',
    verifiedDate: '2026-11-01',
    coordinates: [76.3860, 15.2756],
  },
  {
    id: 'rail-ud',
    category: 'railway_station',
    name: 'Udupi Railway Station (UD — Konkan Railway)',
    nameKannada: 'ಉಡುಪಿ ರೈಲು ನಿಲ್ದಾಣ (ಕೊಂಕಣ ರೈಲ್ವೆ)',
    code: 'UD',
    operatorOrZone: 'Konkan Railway Corporation (KRCL)',
    divisionOrZone: 'Karwar Division (Konkan Railway)',
    district: 'Udupi',
    macroRegion: 'Karavali Coastal',
    facilities: [
      'Konkan Scenic Green Station Concourse',
      'Indrali Pre-paid Auto Stand',
      'Passenger Retiring Rooms & Dormitories',
      'Direct Bus & Auto to Sri Krishna Matha (4 km)',
      'Direct Road Connection to Malpe Beach (9 km)',
    ],
    topConnections: [
      'Sri Krishna Matha & Kanakana Kindi (4 km)',
      'Malpe Beach & St. Mary’s Basaltic Islands (9 km)',
      'Murudeshwar Shiva Temple & Beach',
      'Gokarna Om Beach & Kudle Beach',
      'Bengaluru (Panchaganga Express 16595)',
    ],
    officialUrl: 'https://konkanrailway.com',
    sourceAttribution: 'Konkan Railway Corporation (KRCL) Station Index',
    verifiedDate: '2026-11-01',
    coordinates: [74.7702, 13.3324],
  },
  {
    id: 'rail-ubl',
    category: 'railway_station',
    name: 'SSS Hubballi Junction (UBL)',
    nameKannada: 'ಶ್ರೀ ಸಿದ್ಧಾರೂಢ ಸ್ವಾಮೀಜಿ ಹುಬ್ಬಳ್ಳಿ ಜಂಕ್ಷನ್',
    code: 'UBL',
    operatorOrZone: 'South Western Railway (SWR HQ)',
    divisionOrZone: 'Hubballi Division & SWR Zonal Headquarters',
    district: 'Dharwad',
    macroRegion: 'Kittur Karnataka',
    facilities: [
      'Guinness World Record Longest Railway Platform (1,507m • Platform 1)',
      'Direct Foot Overbridge Skywalk to Chigari BRTS Station',
      'Executive AC Lounges & Electronic Coach Indicators',
      '24x7 Multi-cuisine Food Court',
      'Luggage Cloakroom & SWR Heritage Kiosks',
    ],
    topConnections: [
      'Dharwad (Via Chigari Green BRTS Corridor every 3 min)',
      'Bengaluru (Vande Bharat 20661 — 4 hr 45 min)',
      'Belagavi & Kittur Fort',
      'Goa / Vasco da Gama (Castle Rock Ghat route)',
      'Hosapete / Hampi & Badami',
    ],
    officialUrl: 'https://www.irctc.co.in/nget/train-search',
    sourceAttribution: 'South Western Railway Zonal HQ Information System',
    verifiedDate: '2026-11-01',
    coordinates: [75.1439, 15.3456],
  },

  // ================= 2. BUS TERMINALS =================
  {
    id: 'bus-majestic',
    category: 'bus_terminal',
    name: 'Kempegowda Bus Station (Majestic KSRTC)',
    nameKannada: 'ಕೆಂಪೇಗೌಡ ಬಸ್ ನಿಲ್ದಾಣ (ಮೆಜೆಸ್ಟಿಕ್ ಕೆಎಸ್‌ಆರ್‌ಟಿಸಿ)',
    code: 'KSRTC-MAJ',
    operatorOrZone: 'KSRTC & BMTC',
    divisionOrZone: 'KSRTC Central Division',
    district: 'Bengaluru Urban',
    macroRegion: 'Old Mysuru',
    facilities: [
      '30 Operational Long-Distance Bus Bays',
      'Direct Footbridge to Nadaprabhu Kempegowda Metro Station',
      'Direct Skywalk to KSR Bengaluru City Railway Station',
      '24x7 KSRTC Passenger Helpdesk (080-22221321)',
      'Cloakroom, AC Waiting Lounge & Feeding Rooms',
    ],
    supportedServices: [
      'Airavat Club Class Multi-Axle AC',
      'Ambari Utsav Premium Sleeper',
      'Flybus Direct Bengaluru Airport',
      'Rajahamsa Executive',
      'Karnataka Sarige (Shakti Scheme ₹0)',
      'EV Power Plus Intercity Electric',
    ],
    platformsAndEnquiry: 'Terminal 1 (BMTC City/Airport), Terminal 2 (KSRTC Statewide Inter-district)',
    topConnections: [
      'Mysuru (EV Power Plus every 15 min via Bengaluru-Mysuru Expressway)',
      'Madikeri / Coorg (Hourly Express & Airavat)',
      'Chikkamagaluru & Hassan (Belur connection)',
      'Mangaluru & Udupi (Day Express & Overnight Ambari)',
      'Shivamogga / Jog Falls & Hubballi',
    ],
    officialUrl: 'https://ksrtc.in',
    sourceAttribution: 'Karnataka State Road Transport Corporation (KSRTC)',
    verifiedDate: '2026-11-01',
    coordinates: [77.5713, 12.9774],
  },
  {
    id: 'bus-mysuru',
    category: 'bus_terminal',
    name: 'Mysuru Suburb KSRTC Bus Stand',
    nameKannada: 'ಮೈಸೂರು ಉಪನಗರ ಕೆಎಸ್‌ಆರ್‌ಟಿಸಿ ಬಸ್ ನಿಲ್ದಾಣ',
    code: 'KSRTC-MYS',
    operatorOrZone: 'KSRTC',
    divisionOrZone: 'KSRTC Mysuru Rural Division',
    district: 'Mysuru',
    macroRegion: 'Old Mysuru',
    facilities: [
      '24 Inter-district Departure Bays',
      'Suburban Passenger AC Waiting Rooms',
      'KSTDC Tourist Information Counter',
      'Pre-paid Auto Stand (Palace 500m away)',
      'Central Cloakroom & Electronic Destination Screens',
    ],
    supportedServices: [
      'EV Power Plus Electric to Bengaluru (Every 15 min)',
      'Airavat Club Class to Coorg & Coastal Karnataka',
      'Rajahamsa Express',
      'Rural Karnataka Sarige (Shakti Scheme ₹0 for Women)',
    ],
    platformsAndEnquiry: 'Bays 1-6 (Bengaluru Expressway), Bays 7-12 (Madikeri/Coorg), Bays 13-18 (Bandipur/Ooty)',
    topConnections: [
      'Bengaluru (Expressway EV Power Plus — 2h)',
      'Madikeri / Coorg (Bylakuppe Golden Temple route)',
      'Bandipur Tiger Reserve & Gundlupet',
      'Hassan, Belur & Halebidu',
      'Somanathapura Chennakeshava & Talakadu',
    ],
    officialUrl: 'https://ksrtc.in',
    sourceAttribution: 'KSRTC Mysuru Division Operations',
    verifiedDate: '2026-11-01',
    coordinates: [76.6584, 12.3115],
  },
  {
    id: 'bus-hosapete',
    category: 'bus_terminal',
    name: 'Hosapete KKRTC Central Bus Terminal',
    nameKannada: 'ಹೊಸಪೇಟೆ ಕೆಕೆಆರ್‌ಟಿಸಿ ಕೇಂದ್ರ ಬಸ್ ನಿಲ್ದಾಣ',
    code: 'KKRTC-HPT',
    operatorOrZone: 'KKRTC (Kalyana Karnataka Road Transport Corp)',
    divisionOrZone: 'KKRTC Vijayanagara Division',
    district: 'Vijayanagara',
    macroRegion: 'Kalyana Karnataka',
    facilities: [
      'Platform 4 Dedicated Hampi Heritage Shuttle Bay (Every 20 min • ₹25)',
      'KKRTC Passenger Inquiry Desk (08394-228300)',
      'Covered Passenger Waiting Sheds & Drinking Water',
      'Local Autorickshaw Pre-paid Stand to Hampi Bazaar',
      'Luggage Counters & Local Bus Services',
    ],
    supportedServices: [
      'Kalyana Ratha AC Sleeper',
      'Suvarna Sarige',
      'Hampi Heritage Shuttle Bus (High-frequency local connection)',
      'Kalyana Sarige (Shakti Scheme ₹0)',
    ],
    platformsAndEnquiry: 'Bay 4: Hampi Bazaar shuttle | Bay 8: Badami/Pattadakal/Aihole circuit',
    topConnections: [
      'Hampi Heritage Ruins & Virupaksha Temple (13 km • ₹25)',
      'Badami Cave Temples & Pattadakal (Direct Express)',
      'Hubballi & Dharwad',
      'Kalaburagi & Bidar Fort',
      'Bengaluru (Overnight Kalyana Ratha)',
    ],
    officialUrl: 'https://ksrtc.in',
    sourceAttribution: 'KKRTC Central Bus Terminal Registry',
    verifiedDate: '2026-11-01',
    coordinates: [76.3908, 15.2689],
  },
  {
    id: 'bus-mangaluru',
    category: 'bus_terminal',
    name: 'Mangaluru KSRTC Bus Terminal (Bejai)',
    nameKannada: 'ಮಂಗಳೂರು ಕೆಎಸ್‌ಆರ್‌ಟಿಸಿ ಬಸ್ ನಿಲ್ದಾಣ (ಬಿಜೈ)',
    code: 'KSRTC-MNG',
    operatorOrZone: 'KSRTC',
    divisionOrZone: 'KSRTC Mangaluru Division',
    district: 'Dakshina Kannada',
    macroRegion: 'Karavali Coastal',
    facilities: [
      'Modern Multi-Level Transit Terminal Complex',
      'Air-Conditioned Waiting Hall & Baby Care Lounge',
      'Multi-Cuisine Passenger Cafeteria',
      'Pre-paid City Taxi & Auto Rickshaw Booth',
      'Wheelchair Access Ramps & Digital Display Boards',
    ],
    supportedServices: [
      'Ambari Dream Class Volvo Sleeper',
      'Airavat Diamond & Club Class',
      'Coastal Highway Superfast',
      'Shiradi Ghat & Sampaje Ghat Services',
      'Karnataka Sarige (Shakti Scheme ₹0)',
    ],
    platformsAndEnquiry: 'Bays 1-5 (Udupi/Kundapura NH-66), Bays 6-10 (Bengaluru via Ghats), Bays 11-15 (Madikeri)',
    topConnections: [
      'Udupi (NH-66 Express every 10 min)',
      'Madikeri (Via scenic Sampaje Ghat)',
      'Bengaluru (Via Hassan & Shiradi Ghat)',
      'Dharmasthala & Kukke Subramanya Pilgrimage',
      'Gokarna & Karwar (Coastal Corridor)',
    ],
    officialUrl: 'https://ksrtc.in',
    sourceAttribution: 'KSRTC Mangaluru Division Operations',
    verifiedDate: '2026-11-01',
    coordinates: [74.8431, 12.8892],
  },
];

interface TransportDirectoryWorkspaceProps {
  onSelectFacility?: (poiId: string) => void;
  onAddToTrip?: (poiId: string) => void;
  itineraryStopIds?: string[];
  uiLanguage?: 'kn' | 'en';
  className?: string;
}

export const TransportDirectoryWorkspace: React.FC<TransportDirectoryWorkspaceProps> = ({
  onSelectFacility,
  onAddToTrip,
  itineraryStopIds = [],
  uiLanguage = 'kn',
  className = '',
}) => {
  const [filterType, setFilterType] = useState<'all' | 'railway_station' | 'bus_terminal'>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFacilities = KARNATAKA_TRANSPORT_FACILITIES.filter((f) => {
    if (filterType !== 'all' && f.category !== filterType) return false;
    if (districtFilter !== 'all' && f.district !== districtFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = f.name.toLowerCase().includes(q) || f.nameKannada.includes(q);
      const matchesCode = f.code.toLowerCase().includes(q);
      const matchesDistrict = f.district.toLowerCase().includes(q);
      return matchesName || matchesCode || matchesDistrict;
    }
    return true;
  });

  return (
    <div className={`bg-[#FAF7F2] text-[#1A1714] rounded-2xl p-6 border border-[#E8DFD3] shadow-sm ${className}`}>
      {/* Directory Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#E8DFD3] gap-3">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#7C3AED] font-semibold flex items-center gap-1.5">
            <span>🏛️</span>
            <span>{uiLanguage === 'kn' ? 'ಕರ್ನಾಟಕ ಸಾರಿಗೆ ಮೂಲಸೌಕರ್ಯ ಕೈಪಿಡಿ' : 'Karnataka Transport Infrastructure Directory'}</span>
          </span>
          <h2 className="font-serif text-2xl font-normal text-[#1A1714] mt-1">
            {uiLanguage === 'kn' ? 'ಪ್ರಮುಖ ರೈಲು & ಬಸ್ ನಿಲ್ದಾಣಗಳು' : 'Key Railway Stations & Bus Terminals'}
          </h2>
          <p className="text-xs text-[#7A7369] mt-0.5">
            {uiLanguage === 'kn'
              ? 'ಪರಿಶೀಲಿತ ಛಾಯಾಚಿತ್ರಗಳು, ಸೌಲಭ್ಯಗಳು, ತಲುಪಬಹುದಾದ ತಾಣಗಳು ಹಾಗೂ ಅಧಿಕೃತ ಸಂಪರ್ಕ ಮಾಹಿತಿ.'
              : 'Verified physical infrastructure, amenities, official station codes, and direct portal links.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-[#EDE9FE] text-[#6D28D9] font-medium border border-[#DDD6FE]">
            {filteredFacilities.length} {uiLanguage === 'kn' ? 'ನಿಲ್ದಾಣಗಳು' : 'Verified Hubs'}
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
        <div>
          <label className="block text-xs font-medium text-[#7A7369] mb-1">
            {uiLanguage === 'kn' ? 'ಹುಡುಕಿ (ಹೆಸರು ಅಥವಾ ಕೋಡ್)' : 'Search Station or Code'}
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. SBC, Mysuru, Hosapete, KSRTC..."
            className="w-full text-sm bg-white border border-[#D5C9B8] rounded-xl px-3 py-2 text-[#1A1714] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#7A7369] mb-1">
            {uiLanguage === 'kn' ? 'ಸಾರಿಗೆ ವಿಧ' : 'Facility Type'}
          </label>
          <div className="flex rounded-xl bg-white border border-[#D5C9B8] p-1">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${
                filterType === 'all' ? 'bg-[#1A1714] text-white' : 'text-[#7A7369] hover:text-[#1A1714]'
              }`}
            >
              {uiLanguage === 'kn' ? 'ಎಲ್ಲಾ' : 'All'}
            </button>
            <button
              type="button"
              onClick={() => setFilterType('railway_station')}
              className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${
                filterType === 'railway_station' ? 'bg-[#7C3AED] text-white' : 'text-[#7A7369] hover:text-[#1A1714]'
              }`}
            >
              🚆 {uiLanguage === 'kn' ? 'ರೈಲ್ವೆ' : 'Rail'}
            </button>
            <button
              type="button"
              onClick={() => setFilterType('bus_terminal')}
              className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${
                filterType === 'bus_terminal' ? 'bg-[#DC2626] text-white' : 'text-[#7A7369] hover:text-[#1A1714]'
              }`}
            >
              🚌 {uiLanguage === 'kn' ? 'ಬಸ್' : 'Bus'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#7A7369] mb-1">
            {uiLanguage === 'kn' ? 'ಜಿಲ್ಲೆ' : 'District'}
          </label>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="w-full text-sm bg-white border border-[#D5C9B8] rounded-xl px-3 py-2 text-[#1A1714] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
          >
            <option value="all">{uiLanguage === 'kn' ? 'ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು (All Districts)' : 'All Districts'}</option>
            <option value="Bengaluru Urban">Bengaluru Urban</option>
            <option value="Mysuru">Mysuru</option>
            <option value="Vijayanagara">Vijayanagara (Hampi)</option>
            <option value="Udupi">Udupi</option>
            <option value="Dharwad">Dharwad (Hubballi)</option>
            <option value="Dakshina Kannada">Dakshina Kannada (Mangaluru)</option>
          </select>
        </div>
      </div>

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredFacilities.map((facility) => {
          const photoMeta = getAuthenticDestinationPhoto(facility.id, facility.category, facility.name, facility.district);
          const isAdded = itineraryStopIds.includes(facility.id);
          const isRailway = facility.category === 'railway_station';

          return (
            <article
              key={facility.id}
              className="bg-white rounded-2xl border border-[#E8DFD3] overflow-hidden hover:border-[#D5C9B8] transition-all shadow-sm flex flex-col justify-between"
            >
              {/* Photo & Badge Header */}
              <div className="relative h-48 bg-[#F4EFEA] overflow-hidden">
                <img
                  src={photoMeta.thumbnailUrl}
                  alt={facility.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    // Fail-safe: if network error, display category vector placeholder
                    const target = e.currentTarget;
                    if (!target.src.startsWith('data:image/svg+xml')) {
                      target.src = photoMeta.imageUrl;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full text-white shadow-sm flex items-center gap-1 ${
                      isRailway ? 'bg-[#7C3AED]' : 'bg-[#DC2626]'
                    }`}
                  >
                    <span>{isRailway ? '🚆' : '🚌'}</span>
                    <span>{facility.code}</span>
                  </span>

                  <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                    📍 {facility.district}
                  </span>
                </div>

                {/* Photo Attribution Footer on Image */}
                <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between text-[10px] text-white/90">
                  <span className="truncate max-w-[70%] drop-shadow">
                    📷 {photoMeta.attribution}
                  </span>
                  <span className="bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px]">
                    {photoMeta.license}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-kannada text-[#A44A28] mb-0.5">
                    {facility.nameKannada}
                  </div>
                  <h3
                    className="font-serif text-lg font-semibold text-[#1A1714] cursor-pointer hover:text-[#7C3AED] transition-colors"
                    onClick={() => onSelectFacility?.(facility.id)}
                  >
                    {facility.name}
                  </h3>

                  <div className="text-xs text-[#7A7369] mt-1 flex items-center gap-2">
                    <span className="font-medium text-[#4A443C]">{facility.operatorOrZone}</span>
                    <span>•</span>
                    <span>{facility.divisionOrZone}</span>
                  </div>

                  {/* Key Facilities Badges */}
                  <div className="mt-3">
                    <span className="text-[11px] text-[#7A7369] block font-medium mb-1.5">
                      {uiLanguage === 'kn' ? 'ಪ್ರಮುಖ ಸೌಲಭ್ಯಗಳು (Key Facilities):' : 'Key Amenities:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {facility.facilities.map((fac) => (
                        <span
                          key={fac}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#4A443C] border border-[#E8DFD3]"
                        >
                          ✓ {fac}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Top Connections */}
                  <div className="mt-3 pt-3 border-t border-[#F4EFEA]">
                    <span className="text-[11px] text-[#7A7369] block font-medium mb-1">
                      {uiLanguage === 'kn' ? 'ಪ್ರಮುಖ ಸಂಪರ್ಕ ತಾಣಗಳು (Top Corridors):' : 'Top Destinations Reachable:'}
                    </span>
                    <ul className="text-xs text-[#1A1714] space-y-0.5">
                      {facility.topConnections.slice(0, 3).map((conn) => (
                        <li key={conn} className="flex items-center gap-1.5 text-xs text-[#4A443C]">
                          <span className="text-[#7C3AED] text-[10px]">➔</span>
                          <span>{conn}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Verification & Source */}
                  <div className="mt-3 text-[10px] text-[#7A7369] flex items-center justify-between bg-[#FAF7F2] p-2 rounded-lg border border-[#F4EFEA]">
                    <span>ಮೂಲ: {facility.sourceAttribution}</span>
                    <span className="font-mono">ಪರಿಶೀಲನೆ: {facility.verifiedDate}</span>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-[#F4EFEA]">
                  <a
                    href={facility.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded-lg border border-[#D5C9B8] hover:bg-[#FAF7F2] transition-colors text-[#4A443C] font-medium flex items-center gap-1"
                  >
                    <span>{isRailway ? 'IRCTC / NTES' : 'KSRTC Awatar'}</span>
                    <span>↗</span>
                  </a>

                  <div className="flex items-center gap-2">
                    {onSelectFacility && (
                      <button
                        type="button"
                        onClick={() => onSelectFacility(facility.id)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-[#D5C9B8] hover:bg-[#FAF7F2] transition-colors text-[#1A1714]"
                      >
                        {uiLanguage === 'kn' ? 'ವಿವರಗಳು' : 'Details'}
                      </button>
                    )}

                    {onAddToTrip && (
                      <button
                        type="button"
                        onClick={() => onAddToTrip(facility.id)}
                        className={`text-xs px-4 py-1.5 rounded-lg font-medium transition-all shadow-sm ${
                          isAdded
                            ? 'bg-[#166534] text-white hover:bg-[#14532D]'
                            : isRailway
                            ? 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white'
                            : 'bg-[#DC2626] hover:bg-[#B91C1C] text-white'
                        }`}
                      >
                        {isAdded ? (uiLanguage === 'kn' ? '✓ ಟ್ರಿಪ್‌ನಲ್ಲಿದೆ' : '✓ Added') : (uiLanguage === 'kn' ? '+ ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ' : '+ Add to Trip')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
