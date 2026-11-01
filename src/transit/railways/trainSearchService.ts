/**
 * @file src/transit/railways/trainSearchService.ts
 * @description Station-to-station train search and transfer guide for Karnataka.
 * Connects South Western Railway schedules with last-mile tourist destinations.
 * Enforces strict directional topology: the boarding station must occur before the alighting station.
 * @theme Code. Create. Celebrate Kannada.
 */

import { VERIFIED_KARNATAKA_TRAINS, KarnatakaTrainScheduleV8 } from './trainScheduleAdapter';
import { KarnatakaRailwayStation, getStation } from './stationRegistry';
import { validateTrainIdentity } from './trainValidator';

export interface TrainSearchParams {
  fromStationCodeOrCity: string;
  toStationCodeOrCity: string;
  travelDate?: string;
  classPreference?: string;
}

export interface TrainSearchResult {
  train: KarnatakaTrainScheduleV8;
  originStation?: KarnatakaRailwayStation;
  destinationStation?: KarnatakaRailwayStation;
  irctcBookingUrl: string;
  lastMileAdvice: string;
}

export interface TrainSearchResponse {
  fromQuery: string;
  toQuery: string;
  directTrains: TrainSearchResult[];
  totalDirect: number;
  transferGuide?: string;
  disclaimer: string;
}

export class TrainSearchService {
  public static search(params: TrainSearchParams): TrainSearchResponse {
    const fromQ = (params.fromStationCodeOrCity || '').toLowerCase().trim();
    let toQ = (params.toStationCodeOrCity || '').toLowerCase().trim();

    // Map common tourist destinations to their nearest gateway railway junctions
    if (toQ.includes('hampi')) toQ = 'hpt';
    if (toQ.includes('belur') || toQ.includes('halebidu')) toQ = 'has';
    if (toQ.includes('shravanabelagola')) toQ = 'sbga';

    let resolvedFrom = fromQ;
    if (resolvedFrom.includes('hampi')) resolvedFrom = 'hpt';
    if (resolvedFrom.includes('belur') || resolvedFrom.includes('halebidu')) resolvedFrom = 'has';

    const matched = VERIFIED_KARNATAKA_TRAINS.filter((t) => {
      // If either query is empty, allow broad matching
      if (!resolvedFrom && !toQ) return true;

      // Build ordered station sequence for this train
      const stops: Array<{ code: string; name: string }> = [];
      if (t.keyIntermediateStations && t.keyIntermediateStations.length > 0) {
        t.keyIntermediateStations.forEach((s) => {
          stops.push({ code: s.stationCode.toLowerCase(), name: s.stationName.toLowerCase() });
        });
      } else {
        stops.push(
          { code: t.originCode.toLowerCase(), name: t.originName.toLowerCase() },
          { code: t.destinationCode.toLowerCase(), name: t.destinationName.toLowerCase() }
        );
      }

      // Check if from matches
      let fromIdx = -1;
      if (!resolvedFrom) {
        fromIdx = 0;
      } else {
        fromIdx = stops.findIndex(
          (s) => s.code === resolvedFrom || s.name.includes(resolvedFrom)
        );
        // Also check train origin
        if (fromIdx === -1 && (t.originCode.toLowerCase() === resolvedFrom || t.originName.toLowerCase().includes(resolvedFrom))) {
          fromIdx = 0;
        }
      }

      // Check if to matches
      let toIdx = -1;
      if (!toQ) {
        toIdx = stops.length - 1;
      } else {
        toIdx = stops.findIndex(
          (s) => s.code === toQ || s.name.includes(toQ)
        );
        // Also check train destination
        if (toIdx === -1 && (t.destinationCode.toLowerCase() === toQ || t.destinationName.toLowerCase().includes(toQ))) {
          toIdx = stops.length - 1;
        }
      }

      // Directional constraint: origin must occur BEFORE destination in train schedule
      return fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
    }).filter((train) => {
      // Train identity validation check: reject invalid or fabricated trains
      const val = validateTrainIdentity({
        trainNumber: train.trainNumber,
        trainName: train.trainName,
        originCode: train.originCode,
        destinationCode: train.destinationCode,
      });
      return val.isValid;
    });

    const results: TrainSearchResult[] = matched.map((train) => {
      return {
        train,
        originStation: getStation(train.originCode),
        destinationStation: getStation(train.destinationCode),
        irctcBookingUrl: train.irctcBookingUrl,
        lastMileAdvice: train.lastMileConnectivityAdvice,
      };
    });

    let transferGuide: string | undefined = undefined;
    if (results.length === 0) {
      if (toQ.includes('hampi') || toQ.includes('hpt') || toQ.includes('hosapete')) {
        transferGuide = 'Tip for Hampi: Hampi does not have its own railway tracks. Book trains to Hosapete Junction (HPT, 13 km away). Frequent KSRTC shuttle buses and autos connect Hosapete station to Hampi Bazaar in 25 minutes.';
      } else if (toQ.includes('belur') || toQ.includes('has') || toQ.includes('hassan')) {
        transferGuide = 'Tip for Belur/Halebidu: The nearest railway junction is Hassan Junction (HAS, 37 km from Belur). Alight at Hassan and board KSRTC non-stop buses leaving every 15 minutes to Belur Temple.';
      } else if (toQ.includes('coorg') || toQ.includes('madikeri')) {
        transferGuide = 'Tip for Coorg: Coorg has no railway station due to Western Ghat ecology. Take a train to Mysuru Junction (MYS) or Hassan (HAS), then continue by KSRTC bus or taxi (2.5 hours).';
      }
    }

    return {
      fromQuery: params.fromStationCodeOrCity,
      toQuery: params.toStationCodeOrCity,
      directTrains: results,
      totalDirect: results.length,
      transferGuide,
      disclaimer: 'Train schedules verified against Indian Railways NTES. Live seat availability and ticket reservations occur exclusively on the official IRCTC portal (irctc.co.in).',
    };
  }

  public static getAllTrains(): KarnatakaTrainScheduleV8[] {
    return VERIFIED_KARNATAKA_TRAINS;
  }
}
