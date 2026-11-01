/**
 * @file src/services/itineraryLegTransitService.ts
 * @description Leg-by-leg intermodal transport planner for YatriKa AI / NammaTrip.
 * Replaces monolithic text walls with genuine itinerary-segmented transit options.
 * Specifically handles Karnataka topological realities:
 *   - Leg 1: Bengaluru -> Hassan (Real trains: 16539 Vistadome, 16575 Gomateshwara, KSRTC via NH-75)
 *   - Leg 2: Hassan -> Belur (No railway station in Belur; HAS 38km nearest railhead; KSRTC local shuttle enquiry)
 *   - Leg 3: Belur -> Chikkamagaluru (25km via SH-57; authorized KSRTC buses and taxi estimates)
 *   - Leg 4: Chikkamagaluru -> Mullayanagiri (22km mountain ghat road; 4WD jeep required; no trains/heavy buses)
 *   - Never duplicates Bengaluru-Mysuru trains into non-Mysuru legs!
 * @theme Code. Create. Celebrate Kannada.
 */

import { KarnatakaPOI } from '../types/nammatrip';
import { UserOriginOption } from '../data/karnatakaTravelRegistry';
import { TrainSearchService } from '../transit/railways/trainSearchService';

export type RailheadStatus = 'direct_rail' | 'road_only_near_railhead' | 'ghat_4wd_required';

export interface LegTrainOption {
  trainNumber: string;
  trainName: string;
  trainNameKannada?: string;
  trainType: string;
  originCode: string;
  originName: string;
  destinationCode: string;
  destinationName: string;
  departureTime: string;
  arrivalTime: string;
  durationLabel: string;
  daysRunning: string[];
  classesAvailable: string[];
  fareStartingInr: number;
  liveStatusUrl: string;
  bookingUrl: string;
  specialHighlight: string;
  lastMileNote: string;
}

export interface LegBusOption {
  serviceLabel: string;
  operator: string;
  departureFrequency: string;
  durationLabel: string;
  fareInr: number;
  shaktiFree: boolean;
  boardingPoint: string;
  alightingPoint: string;
  bookingUrl: string;
  routeVia: string;
}

export interface LegRoadAndTaxi {
  routeDescription: string;
  majorHighway: string;
  estimatedDriveTimeLabel: string;
  taxiFareEstimateInr: number;
  localTransferAdvice: string;
  terrainType: 'plains_highway' | 'interdistrict_road' | 'ghat_hairpin_mountain';
}

export interface ItineraryLegTransit {
  legIndex: number;
  legId: string;
  fromName: string;
  fromCoordinates: [number, number];
  toName: string;
  toCoordinates: [number, number];
  distanceKm: number;
  railheadStatus: RailheadStatus;
  railheadNotice?: string;
  trains: LegTrainOption[];
  buses: LegBusOption[];
  roadAndTaxi: LegRoadAndTaxi;
}

/**
 * Calculates straight-line or road-factor distance between two points in km.
 */
function estimateDistanceKm(from: [number, number], to: [number, number]): number {
  const [lng1, lat1] = from;
  const [lng2, lat2] = to;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const crowdDist = R * c;
  // Apply 1.25 road winding factor
  return Math.max(12, Math.round(crowdDist * 1.25));
}

/**
 * Builds the intermodal transit itinerary for a sequence of stops.
 */
export function buildItineraryLegsTransit(
  origin: UserOriginOption,
  stops: KarnatakaPOI[]
): ItineraryLegTransit[] {
  if (stops.length === 0) return [];

  const points: Array<{ name: string; district: string; coordinates: [number, number]; id: string }> = [
    { name: origin.name.split('(')[0].trim(), district: 'Bengaluru', coordinates: origin.coordinates, id: origin.id },
    ...stops.map((s) => ({ name: s.name, district: s.district || '', coordinates: s.coordinates, id: s.id })),
  ];

  const legs: ItineraryLegTransit[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];
    const fromLower = from.name.toLowerCase();
    const toLower = to.name.toLowerCase();
    const fromDistLower = from.district.toLowerCase();
    const toDistLower = to.district.toLowerCase();
    const distanceKm = estimateDistanceKm(from.coordinates, to.coordinates);

    const isFromBlr = fromLower.includes('bengaluru') || fromLower.includes('bangalore');
    const isToHassan = toLower.includes('hassan') || toDistLower.includes('hassan') || toLower.includes('shettihalli');
    const isFromHassan = fromLower.includes('hassan') || fromDistLower.includes('hassan') || fromLower.includes('shettihalli');
    const isToBelur = toLower.includes('belur') || toLower.includes('chennakeshava');
    const isFromBelur = fromLower.includes('belur') || fromLower.includes('chennakeshava');
    const isToCkm = toLower.includes('chikkamagaluru') || toDistLower.includes('chikkamagaluru');
    const isFromCkm = fromLower.includes('chikkamagaluru') || fromDistLower.includes('chikkamagaluru');
    const isToPeak = toLower.includes('mullayanagiri') || toLower.includes('mullayan') || toLower.includes('seethalayyanagiri');

    // ================= SPECIFIC KNOWN KARNATAKA LEGS =================

    // --- CASE 1: BENGALURU TO HASSAN ---
    if (isFromBlr && isToHassan) {
      legs.push({
        legIndex: i + 1,
        legId: `leg-${i + 1}`,
        fromName: from.name,
        fromCoordinates: from.coordinates,
        toName: to.name,
        toCoordinates: to.coordinates,
        distanceKm: 183,
        railheadStatus: 'direct_rail',
        railheadNotice:
          'Direct South Western Railway connection. Hassan Junction (HAS) is a major junction on the Bengaluru–Mangaluru corridor.',
        trains: [
          {
            trainNumber: '16539/16540',
            trainName: 'Western Ghat Vistadome Express',
            trainType: 'Special Vistadome',
            originCode: 'YPR',
            originName: 'Yesvantpur Junction',
            destinationCode: 'HAS',
            destinationName: 'Hassan Junction',
            departureTime: '07:00',
            arrivalTime: '09:45',
            durationLabel: '2h 45m',
            daysRunning: ['Fri', 'Sat', 'Sun'],
            classesAvailable: ['EV (Vistadome)', 'CC', '2S'],
            fareStartingInr: 95,
            liveStatusUrl: 'https://etrain.info/in/trains/16539',
            bookingUrl: 'https://www.irctc.co.in/nget/train-search',
            specialHighlight:
              'Glass-roof observation coach with 360° rotating seats through Kunigal and Shravanabelagola.',
            lastMileNote:
              'Alight at Hassan Junction (09:45 AM). Pre-paid autos and KSRTC shuttle buses to Belur depart outside.',
          },
          {
            trainNumber: '16575/16576',
            trainName: 'Gomateshwara Express',
            trainType: 'Express',
            originCode: 'YPR',
            originName: 'Yesvantpur Junction',
            destinationCode: 'HAS',
            destinationName: 'Hassan Junction',
            departureTime: '07:15',
            arrivalTime: '10:05',
            durationLabel: '2h 50m',
            daysRunning: ['Sun', 'Tue', 'Thu'],
            classesAvailable: ['CC', '2S'],
            fareStartingInr: 95,
            liveStatusUrl: 'https://etrain.info/in/trains/16575',
            bookingUrl: 'https://www.irctc.co.in/nget/train-search',
            specialHighlight:
              'Direct morning express to Shravanabelagola Bahubali and Hassan Hoysala gateway.',
            lastMileNote:
              'Connects seamlessly at Hassan to Belur & Halebidu temple excursions.',
          },
          {
            trainNumber: '16515',
            trainName: 'Karwar Express (via Hassan)',
            trainType: 'Express',
            originCode: 'YPR',
            originName: 'Yesvantpur Junction',
            destinationCode: 'HAS',
            destinationName: 'Hassan Junction',
            departureTime: '07:00',
            arrivalTime: '09:45',
            durationLabel: '2h 45m',
            daysRunning: ['Mon', 'Wed', 'Fri'],
            classesAvailable: ['CC', '2S', 'SL'],
            fareStartingInr: 95,
            liveStatusUrl: 'https://etrain.info/in/trains/16515',
            bookingUrl: 'https://www.irctc.co.in/nget/train-search',
            specialHighlight: 'Punctual day express running via Kunigal bypass directly to Hassan.',
            lastMileNote: 'Arrives at Hassan Platform 2.',
          },
        ],
        buses: [
          {
            serviceLabel: 'KSRTC Airavat Club Class',
            operator: 'KSRTC',
            departureFrequency: 'Every 45 minutes',
            durationLabel: '3h 30m',
            fareInr: 360,
            shaktiFree: false,
            boardingPoint: 'Kempegowda Bus Station (Majestic) / Satellite Terminal',
            alightingPoint: 'Hassan Central Bus Stand (CBS)',
            bookingUrl: 'https://www.ksrtc.in',
            routeVia: 'NH-75 Expressway via Nelamangala & Kunigal',
          },
          {
            serviceLabel: 'KSRTC Karnataka Sarige (Non-Stop)',
            operator: 'KSRTC',
            departureFrequency: 'Every 15 minutes',
            durationLabel: '3h 45m',
            fareInr: 195,
            shaktiFree: true,
            boardingPoint: 'Majestic Platform 8',
            alightingPoint: 'Hassan Central Bus Stand (CBS)',
            bookingUrl: 'https://www.ksrtc.in',
            routeVia: 'NH-75 via Bellur Cross',
          },
        ],
        roadAndTaxi: {
          routeDescription: 'Bengaluru ➔ Nelamangala ➔ Kunigal ➔ Channarayapatna ➔ Hassan',
          majorHighway: 'NH-75 (4-Lane Tolled Expressway)',
          estimatedDriveTimeLabel: '3h 15m (183 km)',
          taxiFareEstimateInr: 3500,
          localTransferAdvice: 'Excellent 4-lane divided expressway with clean highway food plazas near Kunigal and Bellur Cross.',
          terrainType: 'plains_highway',
        },
      });
      continue;
    }

    // --- CASE 2: HASSAN TO BELUR ---
    if (isFromHassan && isToBelur) {
      legs.push({
        legIndex: i + 1,
        legId: `leg-${i + 1}`,
        fromName: from.name,
        fromCoordinates: from.coordinates,
        toName: to.name,
        toCoordinates: to.coordinates,
        distanceKm: 38,
        railheadStatus: 'road_only_near_railhead',
        railheadNotice:
          '⚠️ Belur has NO railway station. Hassan Junction (HAS, 38 km) is the nearest railhead. Road transit by KSRTC bus or local taxi is required.',
        trains: [], // NO trains - Belur has no station!
        buses: [
          {
            serviceLabel: 'KSRTC Belur Non-Stop Temple Shuttle',
            operator: 'KSRTC Hassan Division',
            departureFrequency: 'Every 15 minutes (06:00 to 21:30)',
            durationLabel: '40 minutes',
            fareInr: 45,
            shaktiFree: true,
            boardingPoint: 'Hassan New Bus Stand (Platform 3)',
            alightingPoint: 'Belur Temple Circle (200m from Chennakeshava entrance)',
            bookingUrl: 'https://www.ksrtc.in',
            routeVia: 'NH-373 Belur Road direct',
          },
          {
            serviceLabel: 'KSRTC Ordinary / Sarige',
            operator: 'KSRTC',
            departureFrequency: 'Every 10 minutes',
            durationLabel: '45 minutes',
            fareInr: 38,
            shaktiFree: true,
            boardingPoint: 'Hassan Old Bus Stand',
            alightingPoint: 'Belur Bus Stand',
            bookingUrl: 'https://www.ksrtc.in',
            routeVia: 'Hassan-Belur State Highway',
          },
        ],
        roadAndTaxi: {
          routeDescription: 'Hassan New Bus Stand ➔ Salagame ➔ Hagare ➔ Belur Chennakeshava Temple',
          majorHighway: 'NH-373 (Well-paved 2-lane highway)',
          estimatedDriveTimeLabel: '40 minutes (38 km)',
          taxiFareEstimateInr: 950,
          localTransferAdvice: 'Smooth 38 km tarmac road. Pre-paid autos from Hassan station cost ~₹550; private cabs cost ~₹900–1,200.',
          terrainType: 'interdistrict_road',
        },
      });
      continue;
    }

    // --- CASE 3: BELUR TO CHIKKAMAGALURU ---
    if (isFromBelur && isToCkm) {
      legs.push({
        legIndex: i + 1,
        legId: `leg-${i + 1}`,
        fromName: from.name,
        fromCoordinates: from.coordinates,
        toName: to.name,
        toCoordinates: to.coordinates,
        distanceKm: 25,
        railheadStatus: 'road_only_near_railhead',
        railheadNotice:
          'Road transit corridor (25 km). Belur has no railway tracks; nearest railheads are Hassan Junction (HAS) and Birur Junction (RRB).',
        trains: [], // NO trains - direct road route
        buses: [
          {
            serviceLabel: 'KSRTC Inter-District Express',
            operator: 'KSRTC Chikkamagaluru Division',
            departureFrequency: 'Every 20 minutes',
            durationLabel: '35 minutes',
            fareInr: 35,
            shaktiFree: true,
            boardingPoint: 'Belur KSRTC Bus Stand',
            alightingPoint: 'Chikkamagaluru KSRTC Central Stand (Kadur Road)',
            bookingUrl: 'https://www.ksrtc.in',
            routeVia: 'SH-57 Malnad Highway',
          },
          {
            serviceLabel: 'KSRTC Rajahamsa Intercity',
            operator: 'KSRTC',
            departureFrequency: 'Hourly departures',
            durationLabel: '30 minutes',
            fareInr: 65,
            shaktiFree: false,
            boardingPoint: 'Belur Bypass Junction',
            alightingPoint: 'Chikkamagaluru CBS',
            bookingUrl: 'https://www.ksrtc.in',
            routeVia: 'SH-57 Coffee Corridor',
          },
        ],
        roadAndTaxi: {
          routeDescription: 'Belur ➔ Magadi ➔ Vastare Cross ➔ Chikkamagaluru Town',
          majorHighway: 'SH-57 (Scenic Coffee Country Highway)',
          estimatedDriveTimeLabel: '35 minutes (25 km)',
          taxiFareEstimateInr: 700,
          localTransferAdvice: 'Short and scenic 25 km drive surrounded by lush silver oak trees and coffee estates. Taxis cost ~₹600–800.',
          terrainType: 'interdistrict_road',
        },
      });
      continue;
    }

    // --- CASE 4: CHIKKAMAGALURU TO MULLAYANAGIRI ---
    if (isFromCkm && isToPeak) {
      legs.push({
        legIndex: i + 1,
        legId: `leg-${i + 1}`,
        fromName: from.name,
        fromCoordinates: from.coordinates,
        toName: to.name,
        toCoordinates: to.coordinates,
        distanceKm: 22,
        railheadStatus: 'ghat_4wd_required',
        railheadNotice:
          '⛰️ Mullayanagiri Peak (1,930m) — Highest peak in Karnataka. Steep mountain ghat roads with sharp hairpin bends. No railway lines or heavy state buses operate on the upper peak ascent. State buses terminate at foothills (Kaimara). Private 4WD jeep or registered local taxi hire from Chikkamagaluru town is required for the summit.',
        trains: [], // NO trains on mountain peak!
        buses: [
          {
            serviceLabel: 'KSRTC Foothill Shuttle (Kaimara / Sitalayanagiri Base)',
            operator: 'KSRTC Chikkamagaluru Division',
            departureFrequency: 'Every 60 minutes (07:00 to 17:00)',
            durationLabel: '45 minutes',
            fareInr: 30,
            shaktiFree: true,
            boardingPoint: 'Chikkamagaluru City Bus Stand',
            alightingPoint: 'Kaimara Foothills Junction (Base)',
            bookingUrl: 'https://www.ksrtc.in',
            routeVia: 'Bababudangiri Ghat Road (stops at foothills)',
          },
        ],
        roadAndTaxi: {
          routeDescription: 'Chikkamagaluru Town ➔ Kaimara Handpost ➔ Sitalayanagiri ➔ Mullayanagiri Summit Parking',
          majorHighway: 'Mullayanagiri Ghat Road (Narrow 1.5-lane hill ascent, 14 hairpin curves)',
          estimatedDriveTimeLabel: '50 minutes (22 km)',
          taxiFareEstimateInr: 1500,
          localTransferAdvice: 'Jeep hire at Chikkamagaluru town taxi stand costs ~₹1,400–1,800 return including waiting time. Private cars can reach Sitalayanagiri, but final 2 km is steep; 400-step stone staircase leads to the summit temple.',
          terrainType: 'ghat_hairpin_mountain',
        },
      });
      continue;
    }

    // --- CASE 5: BENGALURU TO MYSURU ---
    if (
      (fromLower.includes('bengaluru') || fromLower.includes('bangalore')) &&
      toLower.includes('mysuru')
    ) {
      legs.push({
        legIndex: i + 1,
        legId: `leg-${i + 1}`,
        fromName: from.name,
        fromCoordinates: from.coordinates,
        toName: to.name,
        toCoordinates: to.coordinates,
        distanceKm: 145,
        railheadStatus: 'direct_rail',
        railheadNotice:
          'Electrified double-track South Western Railway high-speed corridor alongside 10-lane Bengaluru-Mysuru Expressway.',
        trains: [
          {
            trainNumber: '20607',
            trainName: 'MGR Chennai Central - Mysuru Vande Bharat Express (calls SBC)',
            trainType: 'Vande Bharat',
            originCode: 'MAS',
            originName: 'MGR Chennai Central (SBC 10:15)',
            destinationCode: 'MYS',
            destinationName: 'Mysuru Junction',
            departureTime: '10:20 (ex-SBC)',
            arrivalTime: '12:20',
            durationLabel: '2h 00m',
            daysRunning: ['Daily except Wed'],
            classesAvailable: ['CC', 'EC'],
            fareStartingInr: 380,
            liveStatusUrl: 'https://etrain.info/in/trains/20607',
            bookingUrl: 'https://www.irctc.co.in/nget/train-search',
            specialHighlight: '160 km/h aero-train cruising through Ramanagara silk & rock country.',
            lastMileNote: 'Pre-paid auto stand at MYS Platform 1 connects directly to Mysuru Palace (3 km, ₹50).',
          },
          {
            trainNumber: '12007',
            trainName: 'Shatabdi Express (Mysuru)',
            trainType: 'Shatabdi',
            originCode: 'MAS',
            originName: 'MGR Chennai Central (SBC 10:45)',
            destinationCode: 'MYS',
            destinationName: 'Mysuru Junction',
            departureTime: '10:50 (ex-SBC)',
            arrivalTime: '13:00',
            durationLabel: '2h 10m',
            daysRunning: ['Daily except Tue'],
            classesAvailable: ['CC', 'EC'],
            fareStartingInr: 245,
            liveStatusUrl: 'https://etrain.info/in/trains/12007',
            bookingUrl: 'https://www.irctc.co.in/nget/train-search',
            specialHighlight: 'Executive express with complimentary meal service.',
            lastMileNote: 'KSRTC City bus 201 from MYS station to Palace (₹12).',
          },
        ],
        buses: [
          {
            serviceLabel: 'KSRTC Airavat Club Class (EV / Multi-axle)',
            operator: 'KSRTC',
            departureFrequency: 'Every 20 minutes',
            durationLabel: '2h 30m',
            fareInr: 280,
            shaktiFree: false,
            boardingPoint: 'Majestic / Satellite Terminal',
            alightingPoint: 'Mysuru Suburb Central Bus Stand',
            bookingUrl: 'https://www.ksrtc.in',
            routeVia: 'NH-275 Bengaluru-Mysuru 10-Lane Expressway',
          },
          {
            serviceLabel: 'KSRTC Karnataka Sarige Express',
            operator: 'KSRTC',
            departureFrequency: 'Every 10 minutes',
            durationLabel: '2h 45m',
            fareInr: 160,
            shaktiFree: true,
            boardingPoint: 'Majestic Platform 1',
            alightingPoint: 'Mysuru CBS',
            bookingUrl: 'https://www.ksrtc.in',
            routeVia: 'NH-275 Expressway',
          },
        ],
        roadAndTaxi: {
          routeDescription: 'Bengaluru ➔ Bidadi ➔ Ramanagara ➔ Mandya ➔ Srirangapatna ➔ Mysuru',
          majorHighway: 'NH-275 (10-Lane Access-Controlled Expressway)',
          estimatedDriveTimeLabel: '2h 15m (145 km)',
          taxiFareEstimateInr: 2800,
          localTransferAdvice: 'Smooth 10-lane expressway with 100 km/h speed limit. Two-wheelers and autos banned on main carriageway.',
          terrainType: 'plains_highway',
        },
      });
      continue;
    }

    // --- CASE 6: GENERIC FALLBACK FOR ANY OTHER KARNATAKA LEG ---
    const searchRes = TrainSearchService.search({
      fromStationCodeOrCity: from.name,
      toStationCodeOrCity: to.name,
    });

    const isMountain = toLower.includes('peak') || toLower.includes('betta') || toLower.includes('giri');
    const railStatus: RailheadStatus =
      searchRes.totalDirect > 0
        ? 'direct_rail'
        : isMountain
        ? 'ghat_4wd_required'
        : 'road_only_near_railhead';

    const mappedTrains: LegTrainOption[] = searchRes.directTrains.map((dt) => ({
      trainNumber: dt.train.trainNumber,
      trainName: dt.train.trainName,
      trainNameKannada: dt.train.trainNameKannada,
      trainType: dt.train.trainType.toUpperCase(),
      originCode: dt.train.originCode,
      originName: dt.train.originName,
      destinationCode: dt.train.destinationCode,
      destinationName: dt.train.destinationName,
      departureTime: dt.train.departureTime,
      arrivalTime: dt.train.arrivalTime,
      durationLabel: dt.train.durationLabel,
      daysRunning: dt.train.daysOfOperation,
      classesAvailable: dt.train.classesAvailable,
      fareStartingInr:
        dt.train.fareGuide.generalSecondClass || dt.train.fareGuide.sleeper || dt.train.fareGuide.acChairCar || 100,
      liveStatusUrl: dt.train.ntesRunningStatusUrl,
      bookingUrl: dt.train.irctcBookingUrl,
      specialHighlight: dt.train.scenicHighlights,
      lastMileNote: dt.lastMileAdvice,
    }));

    const approxFare = Math.round(distanceKm * 1.15);

    legs.push({
      legIndex: i + 1,
      legId: `leg-${i + 1}`,
      fromName: from.name,
      fromCoordinates: from.coordinates,
      toName: to.name,
      toCoordinates: to.coordinates,
      distanceKm,
      railheadStatus: railStatus,
      railheadNotice:
        railStatus === 'direct_rail'
          ? `Direct rail service available between ${from.name} and ${to.name}.`
          : searchRes.transferGuide ||
            `${to.name} does not have a dedicated railway junction; road transit via state highways recommended.`,
      trains: mappedTrains,
      buses: [
        {
          serviceLabel: 'KSRTC Inter-District Express',
          operator: 'KSRTC',
          departureFrequency: 'Every 30–60 minutes',
          durationLabel: `${Math.floor((distanceKm / 45) * 60)} min`,
          fareInr: approxFare,
          shaktiFree: true,
          boardingPoint: `${from.name} KSRTC Bus Stand`,
          alightingPoint: `${to.name} Central Stand`,
          bookingUrl: 'https://www.ksrtc.in',
          routeVia: 'State Highway corridor',
        },
      ],
      roadAndTaxi: {
        routeDescription: `${from.name} ➔ ${to.name}`,
        majorHighway: 'Karnataka State Highway / National Highway',
        estimatedDriveTimeLabel: `${Math.floor(distanceKm / 55)}h ${Math.round((distanceKm % 55) * 1.1)}m (${distanceKm} km)`,
        taxiFareEstimateInr: Math.round(distanceKm * 16),
        localTransferAdvice: 'Regional highway route; state transport buses and local registered taxis available.',
        terrainType: isMountain ? 'ghat_hairpin_mountain' : 'interdistrict_road',
      },
    });
  }

  return legs;
}
