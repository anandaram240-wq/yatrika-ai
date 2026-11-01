/**
 * @file src/transit/buses/busSearchService.ts
 * @description Master multi-operator bus search service for Karnataka State Transport.
 * Covers KSRTC, BMTC, NWKRTC, KKRTC, and licensed operators with Shakti Scheme support.
 * @theme Code. Create. Celebrate Kannada.
 */

import { PUBLISHED_KARNATAKA_BUS_SCHEDULES, ComprehensiveBusSchedule, BusServiceClass } from './busScheduleAdapter';
import { BusBookingHandoff, BookingHandoffPayload } from './bookingHandoff';
import { getBusOperator, BusOperatorRecord } from './busOperatorRegistry';

export interface BusSearchParams {
  origin: string;
  destination: string;
  journeyDate?: string;
  passengers?: number;
  womenPassengersCount?: number;
  serviceClass?: BusServiceClass | 'all';
  operatorId?: string;
  shaktiOnly?: boolean;
}

export interface BusSearchResultItem {
  schedule: ComprehensiveBusSchedule;
  operator: BusOperatorRecord;
  handoff: BookingHandoffPayload;
  shaktiSavingsInr: number;
}

export interface BusSearchResponse {
  origin: string;
  destination: string;
  journeyDate: string;
  results: BusSearchResultItem[];
  totalFound: number;
  fallbackNotice?: string;
  shaktiSchemeAvailable: boolean;
}

export class BusSearchService {
  public static search(params: BusSearchParams): BusSearchResponse {
    const orig = (params.origin || '').toLowerCase().trim();
    const dest = (params.destination || '').toLowerCase().trim();
    const journeyDate = params.journeyDate || new Date().toISOString().split('T')[0];
    const womenCount = params.womenPassengersCount || 0;

    let matches = PUBLISHED_KARNATAKA_BUS_SCHEDULES.filter((bus) => {
      // Origin match
      const originMatch =
        !orig ||
        bus.originCity.toLowerCase().includes(orig) ||
        bus.originTerminal.toLowerCase().includes(orig);

      // Destination match (also checks intermediate stops)
      const destMatch =
        !dest ||
        bus.destinationCity.toLowerCase().includes(dest) ||
        bus.destinationTerminal.toLowerCase().includes(dest) ||
        bus.intermediateStops.some((s) => s.toLowerCase().includes(dest));

      // Class match
      const classMatch =
        !params.serviceClass ||
        params.serviceClass === 'all' ||
        bus.serviceClass === params.serviceClass;

      // Operator match
      const opMatch =
        !params.operatorId ||
        params.operatorId === 'all' ||
        bus.operatorId === params.operatorId;

      // Shakti filter
      const shaktiMatch = !params.shaktiOnly || bus.shaktiFree;

      return originMatch && destMatch && classMatch && opMatch && shaktiMatch;
    });

    let fallbackNotice: string | undefined = undefined;

    // Fallback if no direct route found
    if (matches.length === 0) {
      fallbackNotice = `Live schedule is not available for direct ${params.origin} → ${params.destination}. Displaying official published regional schedules with operator enquiry link.`;
      // Provide regional fallback services from same operator/origin
      matches = PUBLISHED_KARNATAKA_BUS_SCHEDULES.filter((bus) =>
        bus.originCity.toLowerCase().includes(orig) || bus.destinationCity.toLowerCase().includes(dest)
      );
    }

    const items: BusSearchResultItem[] = matches.map((schedule) => {
      const operator = getBusOperator(schedule.operatorId);
      const isShaktiApplicable = schedule.shaktiFree && womenCount > 0;
      const shaktiSavingsInr = isShaktiApplicable ? schedule.fareInr * womenCount : 0;
      const handoff = BusBookingHandoff.createHandoff(
        schedule.operatorId,
        schedule.originCity,
        schedule.destinationCity,
        journeyDate,
        isShaktiApplicable
      );

      return {
        schedule,
        operator,
        handoff,
        shaktiSavingsInr,
      };
    });

    const hasShaktiInResults = items.some((i) => i.schedule.shaktiFree);

    return {
      origin: params.origin,
      destination: params.destination,
      journeyDate,
      results: items,
      totalFound: items.length,
      fallbackNotice,
      shaktiSchemeAvailable: hasShaktiInResults,
    };
  }

  public static getAllSchedules(): ComprehensiveBusSchedule[] {
    return PUBLISHED_KARNATAKA_BUS_SCHEDULES;
  }
}
