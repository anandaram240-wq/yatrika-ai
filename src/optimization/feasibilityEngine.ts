/**
 * @file src/optimization/feasibilityEngine.ts
 * @description Master feasibility evaluator and realistic alternative schedule generator.
 * @theme Code. Create. Celebrate Kannada.
 */

import { KarnatakaPOI } from '../types/nammatrip';
import { TimeWindowSolver, TimeWindowConstraint, ScheduledVisitSlot } from './timeWindowSolver';
import { MultiDayPlanner, DayItineraryLeg } from './multiDayPlanner';
import { RouteScoring, ItineraryScoreBreakdown } from './routeScoring';

export interface FeasibilityAssessmentReport {
  isFeasible: boolean;
  scoreBreakdown: ItineraryScoreBreakdown;
  scheduledSlots: ScheduledVisitSlot[];
  dailyLegs: DayItineraryLeg[];
  suggestedAlternativePlan?: {
    recommendedDays: number;
    unbundledStopsNote: string;
    suggestedAdjustedDepartureTime: string;
  };
  explanation: string;
}

export class FeasibilityEngine {
  /**
   * Conducts a full feasibility assessment across time-windows, pacing, and terrain constraints.
   */
  public static evaluateFullItinerary(params: {
    originName: string;
    stops: KarnatakaPOI[];
    allocatedDays: number;
    startDepartureTime?: string; // "07:00"
    estimatedTotalDriveHours: number;
  }): FeasibilityAssessmentReport {
    const { originName, stops, allocatedDays, startDepartureTime = '07:00', estimatedTotalDriveHours } = params;

    const scheduledSlots: ScheduledVisitSlot[] = [];
    let darshanViolations = 0;
    let nightGhatViolations = 0;

    const [startH, startM] = startDepartureTime.split(':').map(Number);

    const dailyLegs = MultiDayPlanner.partitionItinerary({
      originName,
      stops,
      allocatedDays,
      startHour: startH,
    });

    // Simulate stop visitation timeline partitioned by day
    dailyLegs.forEach((leg) => {
      let currentTimeMinutes = startH * 60 + startM;

      leg.stops.forEach((stop, index) => {
        // Add drive time to stop (~45m - 90m)
        const driveMins = index === 0 ? 75 : 45;
        currentTimeMinutes += driveMins;

        const arrH = Math.floor(currentTimeMinutes / 60) % 24;
        const arrM = currentTimeMinutes % 60;
        const arrTimeStr = `${String(arrH).padStart(2, '0')}:${String(arrM).padStart(2, '0')}`;

        // Known temple constraints with mid-day darshan closures
        const isTemple = stop.category === 'temple' || stop.name.includes('Temple') || stop.name.includes('ದೇವಾಲಯ');
        const constraint: TimeWindowConstraint = {
          poiId: stop.id,
          poiName: stop.name,
          category: stop.category,
          openingTime: '06:00',
          closingTime: '20:30',
          middayClosureStart: isTemple ? '12:30' : undefined,
          middayClosureEnd: isTemple ? '16:00' : undefined,
          recommendedDwellMinutes: Math.round((stop.recommendedHours || 1.5) * 60),
          mustVisitInDaylight: stop.category === 'hill_trek' || stop.category === 'wildlife_nature',
        };

        const slot = TimeWindowSolver.evaluateVisitSlot(constraint, arrTimeStr);
        scheduledSlots.push(slot);

        if (slot.isDarshanClosureViolation) {
          darshanViolations++;
        }
        if (slot.isAfterSunset) {
          nightGhatViolations++;
        }

        currentTimeMinutes += slot.dwellMinutes;
      });
    });

    const scoreBreakdown = RouteScoring.scoreItinerary({
      totalDriveHours: estimatedTotalDriveHours,
      allocatedDays,
      stopsCount: stops.length,
      darshanViolationsCount: darshanViolations,
      nightGhatLegsCount: nightGhatViolations,
    });

    const isFeasible = scoreBreakdown.overallScore >= 65 && darshanViolations === 0;

    let alternativePlan = undefined;
    if (!isFeasible) {
      const neededDays = Math.max(allocatedDays + 1, Math.ceil(stops.length / 2.5));
      alternativePlan = {
        recommendedDays: neededDays,
        unbundledStopsNote: `Expand trip from ${allocatedDays} to ${neededDays} days to ensure temple visits occur during open morning/evening darshan windows and prevent night driving in Ghats.`,
        suggestedAdjustedDepartureTime: '06:00',
      };
    }

    const explanation = isFeasible
      ? `Itinerary is verified feasible (Score: ${scoreBreakdown.overallScore}/100). All ${stops.length} stops fit comfortably within opening hours.`
      : `Itinerary has critical feasibility flaws (Score: ${scoreBreakdown.overallScore}/100). ${darshanViolations > 0 ? `${darshanViolations} stop(s) arrive during mid-day darshan closures. ` : ''}${alternativePlan?.unbundledStopsNote ?? ''}`;

    return {
      isFeasible,
      scoreBreakdown,
      scheduledSlots,
      dailyLegs,
      suggestedAlternativePlan: alternativePlan,
      explanation,
    };
  }
}
