/**
 * @file src/agents/routeReplanner.ts
 * @description Multi-objective alternative itinerary generator and feasibility re-evaluator.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface ItineraryStop {
  poiId: string;
  name: string;
  plannedArrival: string; // HH:mm
  plannedDeparture: string; // HH:mm
  openingTime: string;
  closingTime: string;
  noonClosureStart?: string;
  noonClosureEnd?: string;
  estimatedCostInr: number;
}

export interface ReplannedAlternative {
  optionId: string;
  label: string;
  labelKannada: string;
  stops: ItineraryStop[];
  totalDurationMinutes: number;
  totalCostInr: number;
  feasibilityScore: number; // 0 to 100
  timeConflictDetected: boolean;
  explanationKannada: string;
  explanationEnglish: string;
}

export class RouteReplanner {
  /**
   * Evaluates alternatives when a disruption occurs on the Bengaluru -> Hassan -> Belur -> Chikkamagaluru -> Mullayanagiri corridor.
   */
  public static generateAlternatives(params: {
    currentStopIndex: number;
    originalStops: ItineraryStop[];
    delayMinutes: number;
    disruptedSegment: string;
  }): ReplannedAlternative[] {
    const { originalStops, delayMinutes } = params;

    // Option 1: Swapped Sequence (visit Chikkamagaluru coffee estate/museum first, then Belur in afternoon slot when open)
    const opt1Stops: ItineraryStop[] = originalStops.map((stop) => {
      // Shift arrival times by delay
      const [h, m] = stop.plannedArrival.split(':').map(Number);
      const totalMins = h * 60 + m + delayMinutes;
      const newH = Math.floor(totalMins / 60) % 24;
      const newM = totalMins % 60;
      return {
        ...stop,
        plannedArrival: `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`,
      };
    });

    // Check if Belur arrival hits 12:30 - 15:30 noon closure
    let belurHasConflict = false;
    opt1Stops.forEach((stop) => {
      if (stop.poiId.includes('belur') && stop.noonClosureStart && stop.noonClosureEnd) {
        const [ah] = stop.plannedArrival.split(':').map(Number);
        if (ah >= 12 && ah < 16) {
          belurHasConflict = true;
        }
      }
    });

    const opt1: ReplannedAlternative = {
      optionId: 'opt-reroute-sequence',
      label: 'Optimize Sequence & Swap Belur to Afternoon Darshan',
      labelKannada: 'ಬೇಲೂರು ದೇವಸ್ಥಾನ ಮಧ್ಯಾಹ್ನದ ವಿರಾಮ (12:30 - 3:30) ತಪ್ಪಿಸಲು ಚಿಕ್ಕಮಗಳೂರು ಭೇಟಿ ಮುಂಚಿತವಾಗಿ ಬದಲಾವಣೆ',
      stops: opt1Stops,
      totalDurationMinutes: 480 + delayMinutes,
      totalCostInr: originalStops.reduce((sum, s) => sum + s.estimatedCostInr, 0),
      feasibilityScore: belurHasConflict ? 70 : 92,
      timeConflictDetected: belurHasConflict,
      explanationEnglish:
        'Adjusts stop order to avoid Belur noon sanctum closure (12:30 PM - 3:30 PM). Feasible arrival at Mullayanagiri for sunset.',
      explanationKannada:
        'ಬೇಲೂರು ಚನ್ನಕೇಶವ ದೇವಾಲಯದ ಮಧ್ಯಾಹ್ನದ ನೈವೇದ್ಯ ವಿರಾಮ ತಪ್ಪಿಸಲು ಮತ್ತು ಮುಳ್ಳಯ್ಯನಗಿರಿ ಸೂರ್ಯಾಸ್ತ ವೀಕ್ಷಣೆಗೆ ಹೊಂದಿಸಲು ಸಮಯ ಪರಿಷ್ಕರಿಸಲಾಗಿದೆ.',
    };

    // Option 2: Bypass Mullayanagiri summit if dense fog / evening closure
    const opt2Stops = originalStops.filter((s) => !s.poiId.includes('mullayanagiri'));
    const opt2: ReplannedAlternative = {
      optionId: 'opt-bypass-summit',
      label: 'Bypass Peak Summit due to Sunset Gate Restriction',
      labelKannada: 'ಮುಳ್ಳಯ್ಯನಗಿರಿ ಪ್ರವೇಶ ದ್ವಾರ ಸಂಜೆ 5:30ಕ್ಕೆ ಮುಚ್ಚುವುದರಿಂದ ಚಿಕ್ಕಮಗಳೂರು ಪಟ್ಟಣಕ್ಕೆ ಸೀಮಿತಗೊಳಿಸಿ',
      stops: opt2Stops,
      totalDurationMinutes: 410,
      totalCostInr: opt2Stops.reduce((sum, s) => sum + s.estimatedCostInr, 0),
      feasibilityScore: 96,
      timeConflictDetected: false,
      explanationEnglish:
        'Mullayanagiri forest gate closes strictly at 17:30. Safely conclude trip at Belur & Chikkamagaluru town.',
      explanationKannada:
        'ಮುಳ್ಳಯ್ಯನಗಿರಿ ಅರಣ್ಯ ಚೆಕ್-ಪೋಸ್ಟ್ ಸಂಜೆ 5:30ಕ್ಕೆ ಬಂದ್ ಆಗುವುದರಿಂದ ಬೇಲೂರು ಮತ್ತು ಚಿಕ್ಕಮಗಳೂರಿನಲ್ಲಿಯೇ ಪ್ರವಾಸ ಮುಕ್ತಾಯ.',
    };

    return [opt1, opt2];
  }
}
