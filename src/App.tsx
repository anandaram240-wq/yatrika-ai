// src/App.tsx — YatriKa AI (Wanderlog + Mindtrip + Stippl Grade UI/UX)
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './index.css';

import { BasemapStyleId, getBasemapStyle, MAP_PROVIDER_CONFIG } from './config/mapProviders';
import {
  KARNATAKA_POIS,
  CURATED_CIRCUIT_PRESETS,
  getPoiById,
  UserOriginOption,
  KARNATAKA_GATEWAY_ORIGINS,
} from './data/karnatakaTravelRegistry';
import { BudgetTier, ComputedTripRoute, KarnatakaPOI } from './types/nammatrip';
import {
  buildFallbackRoadCorridor,
  calculateMultiStopRoadRoute,
  optimizeStopSequence,
} from './services/routingService';
import {
  calculateTripBudget,
  exportItineraryToMarkdown,
  parseTripFromQueryString,
  serializeTripToQueryString,
} from './services/tripPlannerEngine';
import {
  VERIFIED_TRAIN_CORRIDORS,
  getAranyaVihaaraCompliance,
  getSeasonalAdvisory,
  calculateShaktiSchemeSavings,
  parseNaturalLanguageTripPrompt,
  TravelSeason,
  getCorridorIntelligence,
} from './services/karnatakaSmartTravelIntelligence';

// High-resolution curated photography for each Karnataka POI
const POI_PHOTO_MAP: Record<string, string> = {
  'poi-mysore-palace': 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=600&q=80',
  'poi-hampi-stone-chariot': 'https://images.unsplash.com/photo-1600100397608-f010f423b971?auto=format&fit=crop&w=600&q=80',
  'poi-badami-caves': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
  'poi-belur-halebidu': 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=600&q=80',
  'poi-gol-gumbaz': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
  'poi-jog-falls': 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80',
  'poi-udupi-krishna': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
  'poi-murudeshwar': 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=600&q=80',
  'poi-coorg-raja-seat': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'poi-mullayanagiri': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  'poi-gokarna-om-beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  'poi-kabini-nagarhole': 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=600&q=80',
  'poi-nandi-hills': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
  'poi-shravanabelagola': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
  'poi-st-marys-island': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  'poi-netrani-scuba': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
  'poi-bandipur': 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=600&q=80',
  'poi-srirangapatna': 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=600&q=80',
  'poi-chamundi-hills': 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=600&q=80',
  'poi-hirekolale-lake': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'poi-chitradurga-fort': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
  'poi-pattadakal-unesco': 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=600&q=80',
  'poi-aihole-durga': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
  'poi-dandeli-rafting': 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=600&q=80',
  'poi-yana-caves': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  'poi-shivanasamudra': 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80',
  'poi-agumbe-sunset': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'poi-bylakuppe-golden-temple': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
  'poi-dharmasthala': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
  'poi-kukke-subramanya': 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=600&q=80',
  'poi-kudremukh-peak': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  'poi-talakaveri': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'poi-bidar-fort': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
  'poi-gokak-falls': 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80',
  'poi-somnathpur-temple': 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=600&q=80',
  'poi-lalbagh-bangalore': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
  'poi-bannerghatta-park': 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=600&q=80',
  'poi-ranganathittu': 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=600&q=80',
  'poi-belagavi-fort': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
  'poi-kittur-fort': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
  'poi-savandurga': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  'poi-ramadevara-betta': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
  'poi-melukote': 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=600&q=80',
  'poi-iruppu-falls': 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80',
  'poi-abbey-falls': 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80',
  'poi-dubare-elephant-camp': 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=600&q=80',
  'poi-br-hills': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'poi-mm-hills': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
  'poi-himavad-gopalaswamy': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  'poi-bhadra-wildlife': 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=600&q=80',
  'poi-kemmangundi': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'poi-hebbe-falls': 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80',
  'poi-keladi-ikkeri': 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=600&q=80',
  'poi-koodli-sangama': 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=600&q=80',
  'poi-kavaledurga-fort': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
  'poi-mirjan-fort': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
  'poi-kudle-beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  'poi-maravanthe-beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  'poi-kollur-mookambika': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
  'poi-kodachadri-peak': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  'poi-pilikula-nisargadhama': 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=600&q=80',
  'poi-panambur-beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  'poi-tannirbhavi-beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  'poi-nrityagram': 'https://images.unsplash.com/photo-1600100397608-f010f423b971?auto=format&fit=crop&w=600&q=80',
  'poi-devarayanadurga': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
  'poi-madhugiri-fort': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
  'poi-sanganakallu': 'https://images.unsplash.com/photo-1600100397608-f010f423b971?auto=format&fit=crop&w=600&q=80',
  'poi-kudalasangama': 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=600&q=80',
  'poi-anjanadri-hill': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
  'poi-sanapur-lake': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'poi-banashankari': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
  'poi-kaginele': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
  'poi-vibhuti-falls': 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80',
  'poi-apsarakonda': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  'poi-honnavar-backwaters': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'poi-karkala-gommateshwara': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
  'poi-moodabidri-thousand-pillars': 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=600&q=80',
  'poi-malpe-seawalk': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  'poi-kaup-lighthouse': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  'poi-omkareshwara-madikeri': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
  'poi-mandalpatti': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  'poi-chelavara-falls': 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80',
  'poi-shettihalli-church': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
  'poi-manjarabad-fort': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
  'poi-bisle-ghat': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'poi-chunchanakatte-falls': 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80',
  'poi-tipu-summer-palace-blr': 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=600&q=80',
  'poi-channapatna-craft': 'https://images.unsplash.com/photo-1600100397608-f010f423b971?auto=format&fit=crop&w=600&q=80',
  'poi-ulsoor-lake': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'poi-nuggehalli': 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=600&q=80',
  'poi-begur-fort': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
  'poi-gundal-dam': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'poi-seethalayyanagiri': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
  'poi-jhari-falls': 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80',
  'poi-bababudangiri': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  'poi-kallathigiri-falls': 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80',
  'poi-z-point-kemmangundi': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'poi-kyathanamakki': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  'poi-horanadu-annapoorneshwari': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
  'poi-sringeri-sharada-peetham': 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=600&q=80',
  'poi-charmadi-ghat-view': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'poi-ballalarayana-durga': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
  'poi-balehonnur-rambhapuri': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
  'poi-syntheri-rocks': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  'poi-sathodi-falls': 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80',
  'poi-magod-falls': 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80',
  'poi-unchalli-falls': 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80',
  'poi-ibrahim-rouza': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
  'poi-talakad-keerthinarayana': 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=600&q=80',
  'poi-gorur-dam': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'poi-devarayanadurga-bhoganarasimha': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
  'poi-savandurga-narasimha': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  'poi-chennakeshava-aralaguppe': 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=600&q=80',
  'poi-kudremukh-national-park': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  'food-mtr-bengaluru': 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80',
  'food-davangere-benne-dose': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
  'food-dharwad-pedha-jolada-rotti': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
  'food-udupi-woodlands-goli-baje': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
  'rail-sbc': 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80',
  'rail-mys': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
  'rail-hpt': 'https://images.unsplash.com/photo-1515165562839-978bbcf18277?auto=format&fit=crop&w=600&q=80',
  'rail-ud': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
  'rail-ubl': 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80',
};

const DEFAULT_PHOTO =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';

// Geodesic distance calculation between two [lng, lat] coordinates in kilometers
function getCoordDistanceKm(c1: [number, number], c2: [number, number]): number {
  const R = 6371;
  const dLat = ((c2[1] - c1[1]) * Math.PI) / 180;
  const dLon = ((c2[0] - c1[0]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((c1[1] * Math.PI) / 180) *
      Math.cos((c2[1] * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Calculate compass heading in degrees from c1 to c2 (0° = North, 90° = East, 180° = South, 270° = West)
function getCoordBearing(c1: [number, number], c2: [number, number]): number {
  const y = Math.sin(((c2[0] - c1[0]) * Math.PI) / 180) * Math.cos((c2[1] * Math.PI) / 180);
  const x =
    Math.cos((c1[1] * Math.PI) / 180) * Math.sin((c2[1] * Math.PI) / 180) -
    Math.sin((c1[1] * Math.PI) / 180) *
      Math.cos((c2[1] * Math.PI) / 180) *
      Math.cos(((c2[0] - c1[0]) * Math.PI) / 180);
  const b = (Math.atan2(y, x) * 180) / Math.PI;
  return (b + 360) % 360;
}

export function App() {
  const initialTrip = useMemo(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      return parseTripFromQueryString(window.location.search);
    }
    return parseTripFromQueryString('');
  }, []);

  const [activeCircuitId, setActiveCircuitId] = useState<string>(CURATED_CIRCUIT_PRESETS[0].id);
  const [stopIds, setStopIds] = useState<string[]>(initialTrip.stopIds);
  const [days, setDays] = useState<number>(initialTrip.days);
  const [travellers, setTravellers] = useState<number>(initialTrip.travellers);
  const [shaktiWomenCount, setShaktiWomenCount] = useState<number>(1);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>(initialTrip.tier);
  const [season, setSeason] = useState<TravelSeason>('winter_oct_feb');
  const [styleId, setStyleId] = useState<BasemapStyleId>('bright');
  const [activeTab, setActiveTab] = useState<'timeline' | 'trains' | 'budget' | 'discover'>('timeline');
  const [selectedPoiId, setSelectedPoiId] = useState<string>(initialTrip.stopIds[0] || 'poi-mysore-palace');
  const [aiPromptInput, setAiPromptInput] = useState<string>('');
  const [aiStatusBanner, setAiStatusBanner] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState<boolean>(false);

  // User starting location states
  const [userOrigin, setUserOrigin] = useState<UserOriginOption>(() => {
    if (initialTrip.origin) {
      const match = KARNATAKA_GATEWAY_ORIGINS.find((o) => o.id === initialTrip.origin);
      if (match) return match;
    }
    return KARNATAKA_GATEWAY_ORIGINS[0];
  });
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);

  // World-Class Cinematic 60 FPS Route Tour Simulation States
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [isTourPaused, setIsTourPaused] = useState<boolean>(false);
  const [tourProgressRatio, setTourProgressRatio] = useState<number>(0);
  const [tourSpeedMultiplier, setTourSpeedMultiplier] = useState<1 | 2 | 5>(1);
  const [isCameraChase, setIsCameraChase] = useState<boolean>(true);
  const [telemetrySpeed, setTelemetrySpeed] = useState<number>(78);
  const [telemetryAltitude, setTelemetryAltitude] = useState<number>(940);
  const [arrivedStop, setArrivedStop] = useState<KarnatakaPOI | null>(null);

  const vehicleMarkerRef = useRef<maplibregl.Marker | null>(null);
  const vehicleElRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const currentDistKmRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number | null>(null);
  const celebratedStopIdsRef = useRef<Set<string>>(new Set());

  const corridorInfo = useMemo(() => getCorridorIntelligence(userOrigin.id), [userOrigin.id]);

  // MapLibre WebGL refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const itineraryStops = useMemo(
    () => stopIds.map((id) => getPoiById(id)).filter((p): p is KarnatakaPOI => Boolean(p)),
    [stopIds]
  );

  const originPoi = useMemo<KarnatakaPOI>(() => ({
    id: userOrigin.id,
    name: userOrigin.name,
    nameKannada: userOrigin.nameKannada,
    category: 'railway_station',
    district: 'Karnataka',
    macroRegion: 'Old Mysuru',
    coordinates: userOrigin.coordinates,
    minZoomLevel: 5,
    summary: `Trip origin starting point: ${userOrigin.name}`,
    recommendedHours: 0.5,
    bestTimeOfDay: 'Morning Departure',
    entryFeeInr: { indianCitizen: 0, feeNote: 'Free starting origin / transit point' },
    openingHours: 'Open 24 Hours',
    sourceAttribution: 'User Origin Location Selection',
    verifiedDate: '2026-10-29',
    nearestRailwayId: 'rail-sbc',
    nearestBusTerminalId: 'bus-majestic',
    localPhrase: {
      kannada: 'ಯಾತ್ರೆ ಶುರು ಮಾಡೋಣ!',
      iast: 'Yātre śuru māḍōṇa!',
      english: "Let's begin the journey!",
      dialectLabel: 'Universal Kannada',
      usageContext: 'Journey kickoff',
    },
  }), [userOrigin]);

  const fullRouteStops = useMemo<KarnatakaPOI[]>(
    () => [originPoi, ...itineraryStops],
    [originPoi, itineraryStops]
  );

  const [route, setRoute] = useState<ComputedTripRoute>(() =>
    buildFallbackRoadCorridor(fullRouteStops)
  );

  // Calculate live OSRM road route starting from user origin across all destinations
  useEffect(() => {
    const controller = new AbortController();
    calculateMultiStopRoadRoute(fullRouteStops, controller.signal)
      .then((res) => setRoute(res))
      .catch(() => setRoute(buildFallbackRoadCorridor(fullRouteStops)));
    return () => controller.abort();
  }, [fullRouteStops]);

  // Precomputed cumulative distance segments along the primary road route
  const routeGeometryData = useMemo(() => {
    const coords: [number, number][] =
      route.primaryGeometry.coordinates.length >= 2
        ? (route.primaryGeometry.coordinates as [number, number][])
        : [userOrigin.coordinates, ...itineraryStops.map((s) => s.coordinates)];

    const cumDist: number[] = [0];
    let totalDist = 0;
    for (let i = 1; i < coords.length; i++) {
      const d = getCoordDistanceKm(coords[i - 1], coords[i]);
      totalDist += d;
      cumDist.push(totalDist);
    }

    const stopMilestones = itineraryStops.map((stop) => {
      let bestDist = 0;
      let minDiff = Infinity;
      for (let i = 0; i < coords.length; i++) {
        const diff = getCoordDistanceKm(coords[i], stop.coordinates);
        if (diff < minDiff) {
          minDiff = diff;
          bestDist = cumDist[i];
        }
      }
      return { stop, distanceKm: bestDist };
    });

    return { coords, cumDist, totalDist, stopMilestones };
  }, [route.primaryGeometry.coordinates, userOrigin.coordinates, itineraryStops]);

  // Interpolate exact position, bearing, and traveled segment at distance d
  const getInterpolatedState = useCallback(
    (distKm: number) => {
      const { coords, cumDist, totalDist } = routeGeometryData;
      if (coords.length === 0) {
        return {
          coord: userOrigin.coordinates,
          bearing: 0,
          traveledCoords: [userOrigin.coordinates],
          ratio: 0,
        };
      }
      const clampedDist = Math.max(0, Math.min(distKm, totalDist));
      const ratio = totalDist > 0 ? clampedDist / totalDist : 0;

      let i = 0;
      while (i < cumDist.length - 1 && cumDist[i + 1] < clampedDist) {
        i++;
      }

      const startD = cumDist[i];
      const endD = cumDist[i + 1] ?? startD + 0.001;
      const segFraction = endD > startD ? (clampedDist - startD) / (endD - startD) : 0;

      const p0 = coords[i];
      const p1 = coords[i + 1] ?? p0;

      const currentLng = p0[0] + segFraction * (p1[0] - p0[0]);
      const currentLat = p0[1] + segFraction * (p1[1] - p0[1]);
      const bearing = getCoordBearing(p0, p1);

      const traveledCoords = coords.slice(0, i + 1);
      traveledCoords.push([currentLng, currentLat]);

      return {
        coord: [currentLng, currentLat] as [number, number],
        bearing,
        traveledCoords,
        ratio,
        segmentIndex: i,
      };
    },
    [routeGeometryData, userOrigin.coordinates]
  );

  // Sync URL query string
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const qs = serializeTripToQueryString({ origin: userOrigin.id, stopIds, days, travellers, tier: budgetTier });
    window.history.replaceState(null, '', qs);
  }, [userOrigin.id, stopIds, days, travellers, budgetTier]);

  // Budget & Shakti ₹0 Bus Savings
  const baseBudget = useMemo(
    () => calculateTripBudget({ stops: itineraryStops, route, days, travellers, tier: budgetTier }),
    [itineraryStops, route, days, travellers, budgetTier]
  );

  const shaktiInfo = useMemo(
    () =>
      calculateShaktiSchemeSavings({
        baseTransportInr: baseBudget.transportInr,
        totalTravellers: travellers,
        karnatakaDomicileWomenCount: shaktiWomenCount,
        tier: budgetTier,
      }),
    [baseBudget.transportInr, travellers, shaktiWomenCount, budgetTier]
  );

  const netTotalBudgetInr = baseBudget.totalInr - shaktiInfo.shaktiDiscountInr;

  // Initialize Real MapLibre GL JS Vector Map with Royal Heritage Route Layers
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const styleConfig = getBasemapStyle(styleId);

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: styleConfig.url,
        center: [75.85, 13.85],
        zoom: 6.5,
        minZoom: styleConfig.minZoom,
        maxZoom: styleConfig.maxZoom,
      });

      map.addControl(new maplibregl.ScaleControl({ maxWidth: 110, unit: 'metric' }), 'bottom-left');

      const drawRouteLayer = () => {
        if (!map.isStyleLoaded()) return;
        const routeGeoJson = {
          type: 'FeatureCollection' as const,
          features:
            route.primaryGeometry.coordinates.length >= 2
              ? [
                  {
                    type: 'Feature' as const,
                    geometry: route.primaryGeometry,
                    properties: {},
                  },
                ]
              : [],
        };

        const existing = map.getSource('nt-route') as maplibregl.GeoJSONSource | undefined;
        if (existing) {
          existing.setData(routeGeoJson);
        } else {
          map.addSource('nt-route', { type: 'geojson', data: routeGeoJson });
          // Base planned route in Mysore Umber casing and Karnataka Amber Gold line
          map.addLayer({
            id: 'nt-route-casing',
            type: 'line',
            source: 'nt-route',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': '#78350f', 'line-width': 7.5, 'line-opacity': 0.8 },
          });
          map.addLayer({
            id: 'nt-route-line',
            type: 'line',
            source: 'nt-route',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': '#d97706', 'line-width': 4, 'line-opacity': 1 },
          });

          // Traveled route source and animated glowing amber layers
          map.addSource('nt-route-traveled', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
          });
          map.addLayer({
            id: 'nt-route-traveled-casing',
            type: 'line',
            source: 'nt-route-traveled',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': '#991b1b', 'line-width': 9, 'line-opacity': 0.9 },
          });
          map.addLayer({
            id: 'nt-route-traveled-line',
            type: 'line',
            source: 'nt-route-traveled',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': '#fbbf24', 'line-width': 5, 'line-opacity': 1 },
          });
        }
      };

      map.on('load', drawRouteLayer);
      map.on('style.load', drawRouteLayer);
      mapRef.current = map;
    } catch {
      // Headless / WebGL fallback handled gracefully
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Route Polyline & Floating Numbered Map Pins whenever itinerary or route changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateMapData = () => {
      const src = map.getSource('nt-route') as maplibregl.GeoJSONSource | undefined;
      if (src) {
        src.setData({
          type: 'FeatureCollection',
          features:
            route.primaryGeometry.coordinates.length >= 2
              ? [{ type: 'Feature', geometry: route.primaryGeometry, properties: {} }]
              : [],
        });
      }
    };

    if (map.isStyleLoaded()) {
      updateMapData();
    } else {
      map.once('load', updateMapData);
    }

    // Clear old HTML markers and mount Wanderlog-style numbered pill pins
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Mount distinct origin pin
    const originEl = document.createElement('div');
    originEl.className = 'nt-custom-map-pin-origin';
    originEl.innerHTML = `
      <span>📍 Start: ${userOrigin.name.split('(')[0].trim()}</span>
    `;
    originEl.addEventListener('click', () => {
      map.flyTo({ center: userOrigin.coordinates, zoom: 12, duration: 750, essential: true });
    });
    const originMarker = new maplibregl.Marker({ element: originEl, anchor: 'bottom' })
      .setLngLat(userOrigin.coordinates)
      .addTo(map);
    markersRef.current.push(originMarker);

    itineraryStops.forEach((stop, index) => {
      const el = document.createElement('div');
      el.className = `nt-custom-map-pin ${stop.id === selectedPoiId ? 'active' : ''}`;
      el.innerHTML = `
        <span class="nt-custom-map-pin-num">${index + 1}</span>
        <span>${stop.name.split('(')[0].trim()}</span>
      `;
      el.addEventListener('click', () => {
        setSelectedPoiId(stop.id);
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(stop.coordinates)
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, [itineraryStops, route, selectedPoiId, userOrigin]);

  // Smooth flyTo when user clicks a card
  const handleFocusStop = (poi: KarnatakaPOI) => {
    setSelectedPoiId(poi.id);
    mapRef.current?.flyTo({
      center: poi.coordinates,
      zoom: 11,
      pitch: 35,
      duration: 800,
      essential: true,
    });
  };

  const handleFitAllStops = () => {
    const map = mapRef.current;
    if (!map || itineraryStops.length === 0) return;
    const bounds = new maplibregl.LngLatBounds();
    bounds.extend(userOrigin.coordinates);
    itineraryStops.forEach((s) => bounds.extend(s.coordinates));
    map.fitBounds(bounds, { padding: 70, maxZoom: 11.5, duration: 650, pitch: 10, bearing: 0 });
  };

  const handleDetectCurrentLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        const detected: UserOriginOption = {
          id: 'origin-gps',
          name: `Current GPS (${pos.coords.latitude.toFixed(2)}°N, ${pos.coords.longitude.toFixed(2)}°E)`,
          nameKannada: 'ನನ್ನ ಪ್ರಸ್ತುತ ಸ್ಥಳ',
          coordinates: coords,
        };
        setUserOrigin(detected);
        setIsDetectingGps(false);
        setAiStatusBanner(
          `📍 Origin updated to current GPS: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E. Road route recalculated!`
        );
        mapRef.current?.flyTo({ center: coords, zoom: 12.5, duration: 900 });
      },
      (err) => {
        setIsDetectingGps(false);
        alert(`Could not detect GPS location: ${err.message}. Using ${userOrigin.name}.`);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // 60 FPS RequestAnimationFrame Simulation Loop
  const runAnimationLoop = useCallback((timestamp: number) => {
    if (!lastFrameTimeRef.current) {
      lastFrameTimeRef.current = timestamp;
    }
    const deltaMs = Math.min(100, timestamp - lastFrameTimeRef.current);
    lastFrameTimeRef.current = timestamp;

    const map = mapRef.current;
    const totalDist = routeGeometryData.totalDist;

    // Simulation speed rate: ~140 km/h baseline so a full circuit plays gracefully in ~30s
    const baseSimSpeedKmH = 140;
    const effectiveSpeedKmH = baseSimSpeedKmH * tourSpeedMultiplier;
    const deltaDistKm = (effectiveSpeedKmH / 3600) * (deltaMs / 1000);

    currentDistKmRef.current += deltaDistKm;

    if (currentDistKmRef.current >= totalDist) {
      currentDistKmRef.current = totalDist;
      setTourProgressRatio(1);
      setIsTourPaused(true);
      if (vehicleMarkerRef.current && routeGeometryData.coords.length > 0) {
        vehicleMarkerRef.current.setLngLat(routeGeometryData.coords[routeGeometryData.coords.length - 1]);
      }
      return;
    }

    const state = getInterpolatedState(currentDistKmRef.current);
    setTourProgressRatio(state.ratio);

    // Update vehicle marker on MapLibre
    if (vehicleMarkerRef.current) {
      vehicleMarkerRef.current.setLngLat(state.coord);
    }
    if (vehicleElRef.current) {
      vehicleElRef.current.style.transform = `rotate(${state.bearing}deg)`;
    }

    // Update glowing traveled polyline
    if (map) {
      const travSrc = map.getSource('nt-route-traveled') as maplibregl.GeoJSONSource | undefined;
      if (travSrc) {
        travSrc.setData({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: state.traveledCoords,
              },
              properties: {},
            },
          ],
        });
      }

      // Smooth 3D chase camera
      if (isCameraChase) {
        map.jumpTo({
          center: state.coord,
          zoom: 12.8,
          pitch: 54,
          bearing: state.bearing,
        });
      }
    }

    // Dynamic Telemetry Readout
    const isMountain = state.coord[1] >= 12.8 && state.coord[1] <= 13.8 && state.coord[0] <= 76.2;
    const speedGauge = isMountain
      ? 36 + Math.round(Math.sin(timestamp * 0.003) * 6)
      : 82 + Math.round(Math.sin(timestamp * 0.003) * 5);
    setTelemetrySpeed(speedGauge);

    const baseAlt = isMountain ? 1040 + Math.round(state.ratio * 880) : 840;
    setTelemetryAltitude(baseAlt);

    // Check stop milestones for arrival celebration
    routeGeometryData.stopMilestones.forEach(({ stop, distanceKm }) => {
      if (
        Math.abs(currentDistKmRef.current - distanceKm) < 0.6 &&
        !celebratedStopIdsRef.current.has(stop.id)
      ) {
        celebratedStopIdsRef.current.add(stop.id);
        setArrivedStop(stop);
        setSelectedPoiId(stop.id);
        setTimeout(() => {
          setArrivedStop((cur) => (cur?.id === stop.id ? null : cur));
        }, 3200);
      }
    });

    animationFrameRef.current = requestAnimationFrame(runAnimationLoop);
  }, [getInterpolatedState, isCameraChase, routeGeometryData, tourSpeedMultiplier]);

  const handleStartTour = () => {
    const map = mapRef.current;
    if (!map || routeGeometryData.coords.length < 2) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setIsTourActive(true);
    setIsTourPaused(false);
    celebratedStopIdsRef.current.clear();
    currentDistKmRef.current = 0;
    lastFrameTimeRef.current = null;
    setTourProgressRatio(0);

    // Create vehicle DOM marker if not already created
    if (!vehicleMarkerRef.current) {
      const el = document.createElement('div');
      el.className = 'nt-vehicle-marker';
      el.innerHTML = `
        <div class="nt-vehicle-radar"></div>
        <div class="nt-vehicle-headlights"></div>
        <div class="nt-vehicle-chassis">🚗</div>
      `;
      vehicleElRef.current = el;
      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat(routeGeometryData.coords[0])
        .addTo(map);
      vehicleMarkerRef.current = marker;
    } else {
      vehicleMarkerRef.current.setLngLat(routeGeometryData.coords[0]);
    }

    // Orient initial camera to start
    map.flyTo({
      center: routeGeometryData.coords[0],
      zoom: 13,
      pitch: 54,
      bearing: routeGeometryData.coords.length >= 2 ? getCoordBearing(routeGeometryData.coords[0], routeGeometryData.coords[1]) : 0,
      duration: 1200,
      essential: true,
    });

    lastFrameTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(runAnimationLoop);
  };

  const handleTogglePlayPause = () => {
    if (isTourPaused) {
      setIsTourPaused(false);
      lastFrameTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(runAnimationLoop);
    } else {
      setIsTourPaused(true);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  };

  const handleScrubTour = (percent: number) => {
    const ratio = Math.max(0, Math.min(1, percent / 100));
    const targetDist = ratio * routeGeometryData.totalDist;
    currentDistKmRef.current = targetDist;
    setTourProgressRatio(ratio);

    const state = getInterpolatedState(targetDist);
    if (vehicleMarkerRef.current) {
      vehicleMarkerRef.current.setLngLat(state.coord);
    }
    if (vehicleElRef.current) {
      vehicleElRef.current.style.transform = `rotate(${state.bearing}deg)`;
    }
    const map = mapRef.current;
    if (map) {
      const travSrc = map.getSource('nt-route-traveled') as maplibregl.GeoJSONSource | undefined;
      if (travSrc) {
        travSrc.setData({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: { type: 'LineString', coordinates: state.traveledCoords },
              properties: {},
            },
          ],
        });
      }
      if (isCameraChase) {
        map.jumpTo({
          center: state.coord,
          zoom: 12.8,
          pitch: 54,
          bearing: state.bearing,
        });
      }
    }
  };

  const handleNextStop = () => {
    const nextMilestone = routeGeometryData.stopMilestones.find(
      (m) => m.distanceKm > currentDistKmRef.current + 0.5
    );
    if (nextMilestone) {
      handleScrubTour((nextMilestone.distanceKm / routeGeometryData.totalDist) * 100);
    } else {
      handleScrubTour(100);
    }
  };

  const handlePrevStop = () => {
    const prevMilestones = routeGeometryData.stopMilestones.filter(
      (m) => m.distanceKm < currentDistKmRef.current - 0.5
    );
    if (prevMilestones.length > 0) {
      const prev = prevMilestones[prevMilestones.length - 1];
      handleScrubTour((prev.distanceKm / routeGeometryData.totalDist) * 100);
    } else {
      handleScrubTour(0);
    }
  };

  const handleStopTour = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsTourActive(false);
    setIsTourPaused(false);
    setArrivedStop(null);
    setTourProgressRatio(0);
    if (vehicleMarkerRef.current) {
      vehicleMarkerRef.current.remove();
      vehicleMarkerRef.current = null;
    }
    const map = mapRef.current;
    if (map) {
      const travSrc = map.getSource('nt-route-traveled') as maplibregl.GeoJSONSource | undefined;
      if (travSrc) {
        travSrc.setData({ type: 'FeatureCollection', features: [] });
      }
      handleFitAllStops();
    }
  };

  const handleToggleTourActive = () => {
    if (isTourActive) {
      handleStopTour();
    } else {
      handleStartTour();
    }
  };

  const handleSwitchStyle = (nextStyle: BasemapStyleId) => {
    setStyleId(nextStyle);
    const cfg = getBasemapStyle(nextStyle);
    mapRef.current?.setStyle(cfg.url);
  };

  const handleLoadCircuit = (circuitId: string) => {
    const preset = CURATED_CIRCUIT_PRESETS.find((c) => c.id === circuitId);
    if (!preset) return;
    setActiveCircuitId(circuitId);
    setStopIds(preset.stopIds);
    setDays(preset.days);
    setBudgetTier(preset.defaultTier);
    setSelectedPoiId(preset.stopIds[0]);
    setTimeout(handleFitAllStops, 150);
  };

  const handleRunAiPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPromptInput.trim()) return;
    const parsed = parseNaturalLanguageTripPrompt(aiPromptInput);
    setStopIds(parsed.stopIds);
    setDays(parsed.days);
    setTravellers(parsed.travellers);
    setBudgetTier(parsed.tier);
    setSelectedPoiId(parsed.stopIds[0]);
    setAiStatusBanner(parsed.summaryExplanation);
    setActiveTab('timeline');
    setTimeout(handleFitAllStops, 150);
  };

  const handleSpeakKannada = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'kn-IN';
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  };

  const handleMoveStop = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= stopIds.length) return;
    const next = [...stopIds];
    const [moved] = next.splice(idx, 1);
    next.splice(target, 0, moved);
    setStopIds(next);
  };

  const handleRemoveStop = (id: string) => {
    if (stopIds.length <= 2) return;
    setStopIds((prev) => prev.filter((item) => item !== id));
  };

  const handleAddStop = (id: string) => {
    if (!stopIds.includes(id)) {
      setStopIds((prev) => [...prev, id]);
    }
    setSelectedPoiId(id);
  };

  const handleDownloadMarkdown = () => {
    const md = exportItineraryToMarkdown({ stops: itineraryStops, route, budget: baseBudget });
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NammaTrip-Karnataka-${days}Days.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="nt-shell">
      {/* ================= TOP COMMAND BAR ================= */}
      <header className="nt-topbar">
        <div className="nt-brand">
          <div className="nt-logo-badge font-kannada">
            ಯಾ
          </div>
          <div>
            <div className="nt-brand-title">
              <span className="font-heritage" style={{ letterSpacing: '0.02em', color: '#1c1917' }}>
                YatriKa AI
              </span>
              <span className="font-kannada" style={{ fontSize: 16, color: '#d97706', fontWeight: 800 }}>
                (ಯಾತ್ರಿಕ)
              </span>
              <span
                style={{
                  fontSize: 11,
                  background: '#fef3c7',
                  color: '#b45309',
                  border: '1px solid #fde68a',
                  padding: '2px 8px',
                  borderRadius: 999,
                  fontWeight: 700,
                }}
              >
                Route-to-Trip Intelligence
              </span>
            </div>
            <div className="nt-brand-subtitle font-kannada">
              ಕರ್ನಾಟಕ ಯಾತ್ರೆ — Corridor Discovery · Multi-Bundle Archetypes · SWR/KSRTC · Shakti Audit
            </div>
          </div>
        </div>

        {/* Mindtrip-Style Conversational AI Trip Bar */}
        <form className="nt-omnibar" onSubmit={handleRunAiPrompt}>
          <input
            type="text"
            value={aiPromptInput}
            onChange={(e) => setAiPromptInput(e.target.value)}
            placeholder="Ask AI: '4 days under ₹5000 for UNESCO Hampi & waterfalls for 2 people'..."
            aria-label="Natural language trip planner prompt"
          />
          <button type="submit" className="nt-omnibar-btn">
            ✨ Generate Trip
          </button>
        </form>

        {/* Live Route & Budget Summary + Share */}
        <div className="nt-header-actions">
          <div className="nt-stat-pill">
            <span>
              <strong>{itineraryStops.length}</strong> Stops
            </span>
            <span>•</span>
            <span>
              <strong>{route.totalDistanceKm}</strong> km
            </span>
            <span>•</span>
            <span style={{ color: '#059669', fontWeight: 800 }}>
              ₹{netTotalBudgetInr.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            type="button"
            className="nt-btn-outline"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              setShareCopied(true);
              setTimeout(() => setShareCopied(false), 2000);
            }}
          >
            {shareCopied ? '✓ Link Copied' : '🔗 Share'}
          </button>

          <button type="button" className="nt-btn-primary" onClick={handleDownloadMarkdown}>
            ⬇ Export Plan
          </button>
        </div>
      </header>

      {/* ================= SPLIT-SCREEN WORKSPACE ================= */}
      <div className="nt-workspace">
        {/* LEFT PANE: WANDERLOG/LAYLA VISUAL TIMELINE */}
        <aside className="nt-left-feed">
          <div className="nt-feed-sticky-controls">
            {/* Instant Circuit Presets */}
            <div className="nt-preset-strip">
              {CURATED_CIRCUIT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`nt-preset-pill ${activeCircuitId === preset.id ? 'active' : ''}`}
                  onClick={() => handleLoadCircuit(preset.id)}
                >
                  {preset.title} ({preset.days}D)
                </button>
              ))}
              <button
                type="button"
                className="nt-preset-pill"
                style={{ color: '#059669', borderColor: '#a7f3d0', background: '#ecfdf5' }}
                onClick={() => setStopIds(optimizeStopSequence(itineraryStops).map((s) => s.id))}
              >
                ⚡ Auto-Optimize Route
              </button>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="nt-mode-tabs">
              <button
                type="button"
                className={`nt-mode-tab ${activeTab === 'timeline' ? 'active' : ''}`}
                onClick={() => setActiveTab('timeline')}
              >
                🗺️ Visual Itinerary ({itineraryStops.length})
              </button>
              <button
                type="button"
                className={`nt-mode-tab ${activeTab === 'trains' ? 'active' : ''}`}
                onClick={() => setActiveTab('trains')}
              >
                🚆 Trains & KSRTC
              </button>
              <button
                type="button"
                className={`nt-mode-tab ${activeTab === 'budget' ? 'active' : ''}`}
                onClick={() => setActiveTab('budget')}
              >
                ₹ Budget & Shakti
              </button>
              <button
                type="button"
                className={`nt-mode-tab ${activeTab === 'discover' ? 'active' : ''}`}
                onClick={() => setActiveTab('discover')}
              >
                + Add Places ({KARNATAKA_POIS.length})
              </button>
            </div>
          </div>

          <div className="nt-feed-body">
            {aiStatusBanner && (
              <div
                style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  color: '#1e40af',
                  padding: '10px 14px',
                  borderRadius: 12,
                  fontSize: 12.5,
                  fontWeight: 600,
                  marginBottom: 14,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>✨ {aiStatusBanner}</span>
                <button
                  type="button"
                  onClick={() => setAiStatusBanner(null)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 700 }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* VIEW 1: VISUAL ITINERARY TIMELINE WITH PHOTO CARDS & DRIVE CONNECTORS */}
            {activeTab === 'timeline' && (
              <>
                {/* Starting Origin Selector Card */}
                <div className="nt-origin-card">
                  <div className="nt-origin-info">
                    <div className="nt-origin-icon">📍</div>
                    <div className="nt-origin-details">
                      <span className="nt-origin-label">Starting Location</span>
                      <select
                        className="nt-origin-select"
                        value={userOrigin.id}
                        onChange={(e) => {
                          const opt = KARNATAKA_GATEWAY_ORIGINS.find((o) => o.id === e.target.value);
                          if (opt) {
                            setUserOrigin(opt);
                            mapRef.current?.flyTo({ center: opt.coordinates, zoom: 11, duration: 800 });
                          }
                        }}
                      >
                        {KARNATAKA_GATEWAY_ORIGINS.map((orig) => (
                          <option key={orig.id} value={orig.id}>
                            {orig.name} ({orig.nameKannada})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="nt-origin-gps-btn"
                    onClick={handleDetectCurrentLocation}
                    disabled={isDetectingGps}
                  >
                    {isDetectingGps ? '⏳ Locating...' : '🎯 Current GPS'}
                  </button>
                </div>

                {/* Dynamic Origin-Aware Corridor Intelligence Card */}
                <div className="nt-corridor-intelligence-card">
                  <div className="nt-corridor-header">
                    <span className="nt-corridor-tag">🛣️ Route Corridor</span>
                    <span className="nt-corridor-title">{corridorInfo.corridorTitle}</span>
                  </div>
                  <div className="nt-corridor-road">
                    📍 <strong>Primary Highway / Pass:</strong> {corridorInfo.roadName}
                  </div>
                  {corridorInfo.mountainAdvisory && (
                    <div className="nt-corridor-advisory">
                      ⚠️ <strong>Mountain & Highway Advisory:</strong> {corridorInfo.mountainAdvisory}
                    </div>
                  )}

                  {/* En-Route Recommended Places for this specific origin */}
                  <div className="nt-corridor-suggestions">
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>
                      ⭐ Best En-Route Stops from {userOrigin.name.split('(')[0].trim()}:
                    </span>
                    <div className="nt-corridor-pills">
                      {corridorInfo.recommendedPoiIds.map((recId) => {
                        const recPoi = getPoiById(recId);
                        if (!recPoi) return null;
                        const isAdded = stopIds.includes(recId);
                        return (
                          <button
                            key={recId}
                            type="button"
                            disabled={isAdded}
                            onClick={() => handleAddStop(recId)}
                            className={`nt-corridor-pill-btn ${isAdded ? 'added' : ''}`}
                          >
                            {isAdded ? '✓ ' : '+ '}
                            {recPoi.name.split('(')[0].trim()}
                          </button>
                        );
                      })}
                      {corridorInfo.suggestedPresetId && (
                        <button
                          type="button"
                          onClick={() => handleLoadCircuit(corridorInfo.suggestedPresetId!)}
                          className="nt-corridor-preset-btn"
                        >
                          ⚡ Load Corridor Circuit
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Starting Leg Driving Connector from User Origin to First Stop */}
                {itineraryStops.length > 0 && route.legs.length > 0 && (
                  <div className="nt-leg-connector" style={{ marginBottom: 12 }}>
                    <div className="nt-leg-line" />
                    <div className="nt-leg-pill" style={{ background: '#f0fdf4', borderColor: '#86efac' }}>
                      <span>🚗 {route.legs[0].distanceKm} km</span>
                      <span>•</span>
                      <span>
                        {Math.floor(route.legs[0].durationMinutes / 60)}h {route.legs[0].durationMinutes % 60}m drive
                      </span>
                      <span>•</span>
                      <span style={{ color: '#047857', fontWeight: 700 }}>
                        {userOrigin.name.split('(')[0].trim()} ➔ {itineraryStops[0].name.split('(')[0].trim()} ({corridorInfo.roadName.split('(')[0].trim()})
                      </span>
                    </div>
                  </div>
                )}

                {itineraryStops.map((stop, idx) => {
                  const leg = route.legs[idx + 1];
                  const compliance = getAranyaVihaaraCompliance(stop);
                  const seasonal = getSeasonalAdvisory(stop, season);
                  const nearestRail = getPoiById(stop.nearestRailwayId);
                  const nearestBus = getPoiById(stop.nearestBusTerminalId);
                  const photoUrl = POI_PHOTO_MAP[stop.id] || DEFAULT_PHOTO;

                  return (
                    <React.Fragment key={stop.id}>
                      <div
                        className={`nt-stop-card ${selectedPoiId === stop.id ? 'selected' : ''}`}
                        onClick={() => handleFocusStop(stop)}
                      >
                        <div className="nt-stop-card-top">
                          <div className="nt-stop-photo-wrap">
                            <img src={photoUrl} alt={stop.name} className="nt-stop-photo" loading="lazy" />
                            <div className="nt-stop-number-badge">{idx + 1}</div>
                          </div>

                          <div className="nt-stop-info">
                            <div>
                              <div className="nt-stop-header-row">
                                <div>
                                  <div className="nt-stop-title">{stop.name}</div>
                                  <div className="nt-stop-kn" lang="kn">
                                    {stop.nameKannada} • {stop.district}
                                  </div>
                                </div>

                                {/* Reorder / Remove controls */}
                                <div
                                  style={{ display: 'flex', gap: 4 }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleMoveStop(idx, -1)}
                                    disabled={idx === 0}
                                    className="nt-btn-outline"
                                    style={{ padding: '2px 7px', fontSize: 11 }}
                                  >
                                    ↑
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveStop(idx, 1)}
                                    disabled={idx === itineraryStops.length - 1}
                                    className="nt-btn-outline"
                                    style={{ padding: '2px 7px', fontSize: 11 }}
                                  >
                                    ↓
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveStop(stop.id)}
                                    disabled={itineraryStops.length <= 2}
                                    className="nt-btn-outline"
                                    style={{ padding: '2px 7px', fontSize: 11, color: '#dc2626' }}
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>

                              <p className="nt-stop-summary">{stop.summary}</p>
                            </div>

                            <div className="nt-badge-row">
                              <span className="nt-badge blue">⏱ {stop.recommendedHours} hrs</span>
                              <span className="nt-badge emerald">
                                ₹{stop.entryFeeInr.indianCitizen} ({stop.entryFeeInr.feeNote.slice(0, 26)})
                              </span>
                              {nearestRail?.transportMeta && (
                                <span className="nt-badge purple">
                                  🚆 Rail: {nearestRail.transportMeta.officialCode}
                                </span>
                              )}
                              {compliance.requiresForestPermit && (
                                <a
                                  href={compliance.officialPortalUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="nt-badge saffron"
                                  style={{ textDecoration: 'none' }}
                                >
                                  🌲 Aranya Vihaara Permit Req ↗
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Bottom Bar: Authentic Local Kannada Audio + Booking Links */}
                        <div className="nt-stop-footer" onClick={(e) => e.stopPropagation()}>
                          <div className="nt-phrase-inline">
                            <button
                              type="button"
                              className="nt-voice-btn"
                              onClick={() => handleSpeakKannada(stop.localPhrase.kannada)}
                            >
                              🔊 Kannada
                            </button>
                            <span style={{ fontWeight: 700 }} lang="kn">
                              {stop.localPhrase.kannada}
                            </span>
                            <span style={{ color: '#64748b' }}>— "{stop.localPhrase.english}"</span>
                          </div>

                          {nearestBus?.transportMeta && (
                            <a
                              href="https://ksrtc.in"
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                color: '#dc2626',
                                fontWeight: 700,
                                textDecoration: 'none',
                                flexShrink: 0,
                              }}
                            >
                              KSRTC ↗
                            </a>
                          )}
                        </div>
                      </div>

                      {/* WANDERLOG-STYLE TRANSIT CONNECTOR PILL BETWEEN STOPS */}
                      {leg && (
                        <div className="nt-leg-connector">
                          <div className="nt-leg-line" />
                          <div className="nt-leg-pill">
                            <span>🚗 {leg.distanceKm} km</span>
                            <span>•</span>
                            <span>
                              {Math.floor(leg.durationMinutes / 60)}h {leg.durationMinutes % 60}m drive
                            </span>
                            <span>•</span>
                            <span style={{ color: '#2563eb' }}>{seasonal.ratingBadge.replace(/_/g, ' ')}</span>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </>
            )}

            {/* VIEW 2: VERIFIED TRAINS (VISTADOME / HAMPI EXP / VANDE BHARAT) & KSRTC */}
            {activeTab === 'trains' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Object.values(VERIFIED_TRAIN_CORRIDORS).map((tr) => (
                  <div key={tr.trainNumber} className="nt-stop-card" style={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="nt-badge purple">🚆 Train #{tr.trainNumber}</span>
                      {tr.savesHotelNight && (
                        <span className="nt-badge emerald">
                          🌙 Overnight Hotel-Saver (Saves ₹{tr.hotelNightSavingsInr.toLocaleString('en-IN')})
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 800, marginTop: 8 }}>{tr.corridorName}</h3>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginTop: 2 }}>
                      {tr.trainName} ({tr.originCode} {tr.departureTime} → {tr.destinationCode}{' '}
                      {tr.arrivalTime} • {tr.durationLabel})
                    </div>
                    <p style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>{tr.specialHighlight}</p>
                    <div
                      style={{
                        background: '#f8fafc',
                        padding: 10,
                        borderRadius: 8,
                        fontSize: 12,
                        marginTop: 8,
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <strong>Last-Mile KSRTC Link:</strong> {tr.lastMileKsrtcNote}
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <a
                        href="https://www.irctc.co.in/nget/train-search"
                        target="_blank"
                        rel="noreferrer"
                        className="nt-btn-primary"
                        style={{ textDecoration: 'none' }}
                      >
                        Book on IRCTC ({tr.originCode} → {tr.destinationCode}) ↗
                      </a>
                      <a
                        href="https://ksrtc.in"
                        target="_blank"
                        rel="noreferrer"
                        className="nt-btn-outline"
                        style={{ textDecoration: 'none' }}
                      >
                        Book KSRTC Bus ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* VIEW 3: STIPPL-STYLE BUDGET & KARNATAKA SHAKTI ₹0 BUS CALCULATOR */}
            {activeTab === 'budget' && (
              <div className="nt-stop-card" style={{ padding: 18 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>
                  Trip Budget & Karnataka Shakti ₹0 Bus Optimizer
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700 }}>Days</label>
                    <input
                      type="number"
                      min={1}
                      max={14}
                      value={days}
                      onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))}
                      style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cbd5e1', marginTop: 4 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700 }}>Total Travellers</label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={travellers}
                      onChange={(e) => setTravellers(Math.max(1, Number(e.target.value) || 1))}
                      style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cbd5e1', marginTop: 4 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700 }}>Shakti Women (KA)</label>
                    <input
                      type="number"
                      min={0}
                      max={travellers}
                      value={shaktiWomenCount}
                      onChange={(e) =>
                        setShaktiWomenCount(Math.max(0, Math.min(travellers, Number(e.target.value) || 0)))
                      }
                      style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cbd5e1', marginTop: 4 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  {(['backpacker', 'comfort', 'premium'] as BudgetTier[]).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setBudgetTier(tier)}
                      className={`nt-preset-pill ${budgetTier === tier ? 'active' : ''}`}
                      style={{ flex: 1, textTransform: 'capitalize' }}
                    >
                      {tier}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Accommodation ({Math.max(0, days - 1)} nights):</span>
                    <strong>₹{baseBudget.accommodationInr.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Transit ({route.totalDistanceKm} km Road/Rail/KSRTC):</span>
                    <strong>₹{shaktiInfo.netTransportInr.toLocaleString('en-IN')}</strong>
                  </div>
                  {shaktiInfo.shaktiDiscountInr > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 700 }}>
                      <span>Karnataka Shakti ₹0 Bus Savings:</span>
                      <span>− ₹{shaktiInfo.shaktiDiscountInr.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Regional Food & Darshinis:</span>
                    <strong>₹{baseBudget.foodInr.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Monuments, Safari & Entry Tickets:</span>
                    <strong>₹{baseBudget.entryAndActivitiesInr.toLocaleString('en-IN')}</strong>
                  </div>
                  <div
                    style={{
                      borderTop: '2px solid #e2e8f0',
                      paddingTop: 10,
                      marginTop: 6,
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 17,
                      fontWeight: 800,
                    }}
                  >
                    <span>Total Net Trip Budget:</span>
                    <span style={{ color: '#059669' }}>₹{netTotalBudgetInr.toLocaleString('en-IN')}</span>
                  </div>
                  <p style={{ fontSize: 11.5, color: '#475569', marginTop: 4 }}>{shaktiInfo.explanation}</p>
                </div>
              </div>
            )}

            {/* VIEW 4: DISCOVER & ADD MORE KARNATAKA DESTINATIONS */}
            {activeTab === 'discover' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {KARNATAKA_POIS.map((poi) => {
                  const added = stopIds.includes(poi.id);
                  return (
                    <div
                      key={poi.id}
                      className="nt-stop-card"
                      style={{ padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      onClick={() => handleFocusStop(poi)}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{poi.name}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>
                          {poi.district} • {poi.macroRegion} • ₹{poi.entryFeeInr.indianCitizen}
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={added}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddStop(poi.id);
                        }}
                        className={added ? 'nt-btn-outline' : 'nt-btn-primary'}
                      >
                        {added ? '✓ In Trip' : '+ Add Stop'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT PANE: FULL-VIEWPORT INTERACTIVE MAPLIBRE VECTOR MAP */}
        <main className="nt-map-pane">
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

          {/* Waypoint Arrival Celebration Toast on Map */}
          {arrivedStop && (
            <div className="nt-waypoint-celebration-toast">
              <img
                src={POI_PHOTO_MAP[arrivedStop.id] || DEFAULT_PHOTO}
                alt={arrivedStop.name}
                className="nt-waypoint-thumb"
              />
              <div className="nt-waypoint-meta">
                <span className="nt-waypoint-tag">🎯 Arrived at Destination</span>
                <span className="nt-waypoint-name">{arrivedStop.name}</span>
                <span className="nt-waypoint-kn font-kannada">{arrivedStop.nameKannada}</span>
              </div>
              <button
                type="button"
                className="nt-voice-btn"
                style={{ marginLeft: 'auto' }}
                onClick={() => handleSpeakKannada(arrivedStop.localPhrase.kannada)}
              >
                🔊 Listen
              </button>
            </div>
          )}

          {/* World-Class Cinematic Tour Flight Deck (HUD) */}
          {isTourActive && (
            <div className="nt-tour-flight-deck">
              {/* Telemetry Row */}
              <div className="nt-tour-telemetry-row">
                <div className="nt-tour-telemetry-badge">
                  <span>🚗</span>
                  <span>{telemetrySpeed} km/h</span>
                </div>
                <div className="nt-tour-telemetry-badge">
                  <span>⛰️</span>
                  <span>Elev: {telemetryAltitude} m</span>
                </div>
                <span className="nt-tour-location-text">
                  📍 {corridorInfo.corridorTitle} • {corridorInfo.roadName}
                </span>
                <button
                  type="button"
                  onClick={handleStopTour}
                  className="nt-tour-icon-btn"
                  title="Close Simulation Tour"
                  style={{ width: 28, height: 28, fontSize: 11 }}
                >
                  ✕
                </button>
              </div>

              {/* Scrubber Progress Slider */}
              <div className="nt-tour-scrubber-wrap">
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fde68a', minWidth: 32 }}>
                  {Math.round(tourProgressRatio * 100)}%
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={Math.round(tourProgressRatio * 1000) / 10}
                  onChange={(e) => handleScrubTour(parseFloat(e.target.value))}
                  className="nt-tour-slider"
                />
                <span style={{ fontSize: 11, color: '#cbd5e1', minWidth: 60, textAlign: 'right' }}>
                  {(routeGeometryData.totalDist * tourProgressRatio).toFixed(1)} / {routeGeometryData.totalDist.toFixed(1)} km
                </span>
              </div>

              {/* Actions & Telemetry Controls */}
              <div className="nt-tour-actions-row">
                <div className="nt-tour-btn-group">
                  <button
                    type="button"
                    onClick={handlePrevStop}
                    className="nt-tour-icon-btn"
                    title="Previous Waypoint (⏮)"
                  >
                    ⏮
                  </button>
                  <button
                    type="button"
                    onClick={handleTogglePlayPause}
                    className="nt-tour-play-btn"
                    title={isTourPaused ? 'Resume Simulation' : 'Pause Simulation'}
                  >
                    {isTourPaused ? '▶' : '❚❚'}
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStop}
                    className="nt-tour-icon-btn"
                    title="Next Waypoint (⏭)"
                  >
                    ⏭
                  </button>
                </div>

                <div className="nt-tour-btn-group">
                  <span style={{ fontSize: 11, color: '#a8a29e', marginRight: 4 }}>Speed:</span>
                  {([1, 2, 5] as const).map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => setTourSpeedMultiplier(spd)}
                      className={`nt-tour-speed-pill ${tourSpeedMultiplier === spd ? 'active' : ''}`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setIsCameraChase(!isCameraChase)}
                  className={`nt-tour-mode-btn ${isCameraChase ? 'active' : ''}`}
                  title="Toggle 3D chase camera or free map navigation"
                >
                  <span>{isCameraChase ? '🎥 3D Chase' : '🗺️ Free Cam'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Top Floating Map Glass Bar: Season Selector & Basemap Switcher */}
          <div className="nt-map-top-bar">
            <div className="nt-map-glass-pill">
              <span>🌤 Season:</span>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value as TravelSeason)}
                style={{ border: 'none', background: 'transparent', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
              >
                <option value="winter_oct_feb">Oct–Feb (Peak Heritage & Trekking)</option>
                <option value="monsoon_jun_sep">Jun–Sep (Peak Waterfalls & Ghats)</option>
                <option value="summer_mar_may">Mar–May (Peak Kabini Wildlife Safari)</option>
              </select>
            </div>

            <div className="nt-map-glass-pill">
              <span>🗺️ Map Style:</span>
              {(['bright', 'liberty', 'positron', 'dark'] as BasemapStyleId[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleSwitchStyle(st)}
                  style={{
                    border: 'none',
                    background:
                      styleId === st
                        ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
                        : 'transparent',
                    color: styleId === st ? '#ffffff' : '#1c1917',
                    padding: '4px 9px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom-Right Camera Controls */}
          <div className="nt-map-floating-controls">
            <button
              type="button"
              className="nt-map-ctrl-btn"
              onClick={handleToggleTourActive}
              style={{
                background: isTourActive
                  ? 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)'
                  : 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                color: '#ffffff',
                border: 'none',
                boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)',
              }}
            >
              {isTourActive ? '⏹ Stop Route Tour' : '▶️ Play Route Tour (60 FPS)'}
            </button>
            <button type="button" className="nt-map-ctrl-btn" onClick={() => mapRef.current?.zoomIn()}>
              + Zoom In
            </button>
            <button type="button" className="nt-map-ctrl-btn" onClick={() => mapRef.current?.zoomOut()}>
              − Zoom Out
            </button>
            <button type="button" className="nt-map-ctrl-btn" onClick={handleFitAllStops}>
              ⊡ Fit Trip Route
            </button>
            <button
              type="button"
              className="nt-map-ctrl-btn"
              onClick={() =>
                mapRef.current?.fitBounds(MAP_PROVIDER_CONFIG.karnatakaBounds, { padding: 50, duration: 600 })
              }
            >
              🗺️ Full Karnataka
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
