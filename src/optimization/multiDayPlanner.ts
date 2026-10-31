/**
 * @file src/optimization/multiDayPlanner.ts
 * @description Multi-day itinerary partitioner, overnight hotel hub allocator, and rest-break scheduler.
 * @theme Code. Create. Celebrate Kannada.
 */

import { KarnatakaPOI } from '../types/nammatrip';

export interface DayItineraryLeg {
  dayNumber: number;
  dateLabel: string;
  startLocation: string;
  endOvernightHub: string;
  stops: KarnatakaPOI[];
  scheduledDriveHours: number;
  scheduledSightseeingHours: number;
  mealStops: Array<{ name: string; time: string; type: 'breakfast' | 'lunch' | 'dinner' }>;
  nightGhatDrivingForbidden: boolean;
  notes: string;
}

export class MultiDayPlanner {
  /**
   * Partitions a sequence of stops into balanced daily legs with overnight hotel hubs.
   */
  public static partitionItinerary(params: {
    originName: string;
    stops: KarnatakaPOI[];
    allocatedDays: number;
    startHour?: number; // e.g. 7 (07:00 AM)
  }): DayItineraryLeg[] {
    const { originName, stops, allocatedDays, startHour = 7 } = params;

    const daysCount = Math.max(1, allocatedDays);
    const stopsPerDay = Math.ceil(stops.length / daysCount);
    const dayLegs: DayItineraryLeg[] = [];

    for (let day = 1; day <= daysCount; day++) {
      const startIndex = (day - 1) * stopsPerDay;
      const dayStops = stops.slice(startIndex, startIndex + stopsPerDay);

      let startLoc = day === 1 ? originName : dayLegs[day - 2]?.endOvernightHub ?? originName;
      let overnightHub = originName;

      if (dayStops.length > 0) {
        const lastStop = dayStops[dayStops.length - 1];
        overnightHub = `${lastStop.district} District Hub`;
      }

      // If last day, return towards origin or final destination
      if (day === daysCount) {
        overnightHub = dayStops.length > 0 ? dayStops[dayStops.length - 1].name : originName;
      }

      const driveHours = Number((dayStops.length * 1.4).toFixed(1));
      const sightHours = Number(
        dayStops.reduce((sum, s) => sum + (s.recommendedHours || 1.5), 0).toFixed(1)
      );

      const hasGhat = dayStops.some(
        (s) =>
          ['Chikkamagaluru', 'Kodagu', 'Dakshina Kannada', 'Uttara Kannada', 'Hassan'].includes(s.district) ||
          s.macroRegion === 'Malnad & Western Ghats'
      );

      dayLegs.push({
        dayNumber: day,
        dateLabel: `Day ${day}`,
        startLocation: startLoc,
        endOvernightHub: overnightHub,
        stops: dayStops,
        scheduledDriveHours: driveHours,
        scheduledSightseeingHours: sightHours,
        mealStops: [
          { name: 'Highway Traditional Tiffins', time: `${startHour + 1}:30`, type: 'breakfast' },
          { name: 'Heritage Khanavali / Veg Thali', time: '13:00', type: 'lunch' },
          { name: 'Overnight Hotel Dining', time: '20:00', type: 'dinner' },
        ],
        nightGhatDrivingForbidden: hasGhat,
        notes: hasGhat
          ? 'Western Ghats section: complete all mountain driving before 18:30 due to fog and forest checkpost gates.'
          : 'Plain expressway corridor: well-lit highways with 24h fuel and toll plazas.',
      });
    }

    return dayLegs;
  }
}
