/**
 * @file src/optimization/routeScoring.ts
 * @description Multivariate objective function for itinerary quality and feasibility scoring.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface ItineraryScoreBreakdown {
  overallScore: number; // 0 - 100
  pacingScore: number;
  timeWindowAdherenceScore: number;
  daylightSafetyScore: number;
  penalties: {
    darshanViolationPenalty: number;
    nightGhatPenalty: number;
    overpackedPenalty: number;
  };
  verbalAssessment: string;
}

export class RouteScoring {
  /**
   * Computes an explainable, multi-objective score for an itinerary schedule.
   */
  public static scoreItinerary(params: {
    totalDriveHours: number;
    allocatedDays: number;
    stopsCount: number;
    darshanViolationsCount: number;
    nightGhatLegsCount: number;
  }): ItineraryScoreBreakdown {
    const { totalDriveHours, allocatedDays, stopsCount, darshanViolationsCount, nightGhatLegsCount } = params;

    let score = 100;
    const avgDrivePerDay = totalDriveHours / Math.max(1, allocatedDays);
    const avgStopsPerDay = stopsCount / Math.max(1, allocatedDays);

    // 1. Pacing penalty (optimal is 3-5h drive/day and 2-3 stops/day)
    let pacingScore = 100;
    let overpackedPenalty = 0;
    if (avgDrivePerDay > 6.5) {
      overpackedPenalty += 20;
      pacingScore -= 25;
    }
    if (avgStopsPerDay > 4) {
      overpackedPenalty += 15;
      pacingScore -= 20;
    }

    // 2. Darshan violations (penalty 25 per closed temple arrival)
    const darshanViolationPenalty = darshanViolationsCount * 25;
    const timeWindowAdherenceScore = Math.max(0, 100 - darshanViolationPenalty);

    // 3. Night Ghat driving penalty (penalty 30 for safety risk)
    const nightGhatPenalty = nightGhatLegsCount * 30;
    const daylightSafetyScore = Math.max(0, 100 - nightGhatPenalty);

    score = score - overpackedPenalty - darshanViolationPenalty - nightGhatPenalty;
    score = Math.max(0, Math.min(100, score));

    let verbal = 'Excellent, relaxed itinerary with verified timing windows.';
    if (score < 50) {
      verbal = 'Critical scheduling flaws: high risk of arriving at locked temples or night driving on hazardous ghats.';
    } else if (score < 75) {
      verbal = 'Feasible but demanding: tight transitions and long driving hours.';
    }

    return {
      overallScore: score,
      pacingScore: Math.max(0, pacingScore),
      timeWindowAdherenceScore,
      daylightSafetyScore,
      penalties: {
        darshanViolationPenalty,
        nightGhatPenalty,
        overpackedPenalty,
      },
      verbalAssessment: verbal,
    };
  }
}
