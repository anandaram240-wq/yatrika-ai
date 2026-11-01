/**
 * @file src/transit/railways/trainSearchService.ts
 * @description Station-to-station train search and transfer guide for Karnataka.
 * Connects South Western Railway schedules with last-mile tourist destinations.
 * @theme Code. Create. Celebrate Kannada.
 */

import { VERIFIED_KARNATAKA_TRAINS, KarnatakaTrainScheduleV8 } from './trainScheduleAdapter';
import { KarnatakaRailwayStation, getStation } from './stationRegistry';

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
    const toQ = (params.toStationCodeOrCity || '').toLowerCase().trim();

    const matched = VERIFIED_KARNATAKA_TRAINS.filter((t) => {
      // From match
      const fromMatch =
        !fromQ ||
        t.originCode.toLowerCase() === fromQ ||
        t.originName.toLowerCase().includes(fromQ) ||
        t.keyIntermediateStations.some((s) => s.stationCode.toLowerCase() === fromQ || s.stationName.toLowerCase().includes(fromQ));

      // To match (including Hampi mapping to Hosapete HPT, Belur mapping to Hassan HAS)
      let toMatch =
        !toQ ||
        t.destinationCode.toLowerCase() === toQ ||
        t.destinationName.toLowerCase().includes(toQ) ||
        t.keyIntermediateStations.some((s) => s.stationCode.toLowerCase() === toQ || s.stationName.toLowerCase().includes(toQ));

      if (!toMatch && toQ.includes('hampi')) {
        toMatch = t.destinationCode === 'HPT' || t.keyIntermediateStations.some((s) => s.stationCode === 'HPT');
      }
      if (!toMatch && (toQ.includes('belur') || toQ.includes('halebidu'))) {
        toMatch = t.destinationCode === 'HAS' || t.keyIntermediateStations.some((s) => s.stationCode === 'HAS');
      }

      return fromMatch && toMatch;
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
      if (toQ.includes('hampi') || toQ.includes('hosapete')) {
        transferGuide = 'Tip for Hampi: Hampi does not have its own railway tracks. Book trains to Hosapete Junction (HPT, 13 km away). Frequent KSRTC shuttle buses and autos connect Hosapete station to Hampi Bazaar in 25 minutes.';
      } else if (toQ.includes('belur') || toQ.includes('halebidu')) {
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
