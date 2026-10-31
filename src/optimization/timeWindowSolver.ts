/**
 * @file src/optimization/timeWindowSolver.ts
 * @description Time-window constraint solver factoring temple sanctum closures and sunlight windows.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface TimeWindowConstraint {
  poiId: string;
  poiName: string;
  category: string;
  openingTime: string; // "06:00"
  closingTime: string; // "18:30"
  middayClosureStart?: string; // "12:30" (e.g. temple darshan pause)
  middayClosureEnd?: string;   // "16:00" (e.g. temple re-opening)
  recommendedDwellMinutes: number;
  mustVisitInDaylight: boolean;
}

export interface ScheduledVisitSlot {
  poiId: string;
  poiName: string;
  arrivalTime: string;
  departureTime: string;
  dwellMinutes: number;
  isDarshanClosureViolation: boolean;
  isAfterSunset: boolean;
  violationWarning?: string;
}

export class TimeWindowSolver {
  /**
   * Evaluates if a proposed visit time window respects opening hours and mid-day sanctum closures.
   */
  public static evaluateVisitSlot(
    constraint: TimeWindowConstraint,
    arrivalTimeStr: string // "HH:MM"
  ): ScheduledVisitSlot {
    const [arrH, arrM] = arrivalTimeStr.split(':').map(Number);
    const arrMinutes = arrH * 60 + arrM;

    const depMinutes = arrMinutes + constraint.recommendedDwellMinutes;
    const depH = Math.floor(depMinutes / 60) % 24;
    const depM = depMinutes % 60;
    const departureTimeStr = `${String(depH).padStart(2, '0')}:${String(depM).padStart(2, '0')}`;

    let isDarshanViolation = false;
    let violationWarning: string | undefined;

    // Check mid-day temple closure (e.g. 12:30 PM - 4:00 PM)
    if (constraint.middayClosureStart && constraint.middayClosureEnd) {
      const [closeStartH, closeStartM] = constraint.middayClosureStart.split(':').map(Number);
      const [closeEndH, closeEndM] = constraint.middayClosureEnd.split(':').map(Number);

      const closeStartMins = closeStartH * 60 + closeStartM;
      const closeEndMins = closeEndH * 60 + closeEndM;

      // Arriving during closure or visit overlapping deeply into closure
      if (arrMinutes >= closeStartMins && arrMinutes < closeEndMins) {
        isDarshanViolation = true;
        violationWarning = `Arrival at ${arrivalTimeStr} falls during mid-day sanctum closure (${constraint.middayClosureStart} - ${constraint.middayClosureEnd}). Gates closed for devotees.`;
      }
    }

    // Sunset is approx 18:30 in Karnataka
    const sunsetMinutes = 18 * 60 + 30;
    const isAfterSunset = arrMinutes > sunsetMinutes && constraint.mustVisitInDaylight;
    if (isAfterSunset && !violationWarning) {
      violationWarning = `Arrival at ${arrivalTimeStr} is after sunset. Scenic viewpoints and mountain trails are unsafe after dark.`;
    }

    return {
      poiId: constraint.poiId,
      poiName: constraint.poiName,
      arrivalTime: arrivalTimeStr,
      departureTime: departureTimeStr,
      dwellMinutes: constraint.recommendedDwellMinutes,
      isDarshanClosureViolation: isDarshanViolation,
      isAfterSunset,
      ...(violationWarning ? { violationWarning } : {}),
    };
  }
}
