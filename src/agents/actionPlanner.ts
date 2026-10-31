/**
 * @file src/agents/actionPlanner.ts
 * @description Action planning and execution plan generation for YatriKa AI.
 * @theme Code. Create. Celebrate Kannada.
 */

export type PlannedActionType =
  | 'SET_ORIGIN'
  | 'ADD_DESTINATION'
  | 'REMOVE_DESTINATION'
  | 'REORDER_STOPS'
  | 'INSERT_MEAL_STOP'
  | 'PROPOSE_DETOUR'
  | 'TRIGGER_ADVISORY_ALERT'
  | 'PROPOSE_TRANSIT_CONNECTION';

export interface PlannedAction {
  id: string;
  type: PlannedActionType;
  title: string;
  description: string;
  payload: Record<string, unknown>;
  requiresConfirmation: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  rationale: string;
}

export class ActionPlanner {
  /**
   * Plans the initial actions to construct an itinerary from parsed request parameters.
   */
  public static planTripSetup(params: {
    originId: string;
    originName: string;
    destinationIds: string[];
    viaIds?: string[];
  }): PlannedAction[] {
    const actions: PlannedAction[] = [];

    actions.push({
      id: `action-orig-${params.originId}`,
      type: 'SET_ORIGIN',
      title: `Set Starting Origin: ${params.originName}`,
      description: `Anchor highway route traversal at ${params.originName}.`,
      payload: { originId: params.originId },
      requiresConfirmation: false,
      priority: 'high',
      rationale: 'Routes must begin strictly at the designated departure station or GPS origin.',
    });

    if (params.viaIds && params.viaIds.length > 0) {
      params.viaIds.forEach((viaId) => {
        actions.push({
          id: `action-via-${viaId}`,
          type: 'ADD_DESTINATION',
          title: `Add Corridor Waypoint: ${viaId}`,
          description: `Intermediate highway stop requested by traveler.`,
          payload: { poiId: viaId, isVia: true },
          requiresConfirmation: false,
          priority: 'medium',
          rationale: 'Requested via stop along primary corridor.',
        });
      });
    }

    params.destinationIds.forEach((destId) => {
      actions.push({
        id: `action-dest-${destId}`,
        type: 'ADD_DESTINATION',
        title: `Add Destination: ${destId}`,
        description: `Primary destination included in itinerary.`,
        payload: { poiId: destId },
        requiresConfirmation: false,
        priority: 'high',
        rationale: 'Primary target destination.',
      });
    });

    return actions;
  }

  /**
   * Generates a safe detour action proposal for a disrupted corridor.
   */
  public static planDetourProposal(params: {
    affectedCorridor: string;
    suggestedBypass: string;
    hazardReason: string;
    additionalMinutes: number;
    additionalKm: number;
  }): PlannedAction {
    return {
      id: `action-detour-${Date.now()}`,
      type: 'PROPOSE_DETOUR',
      title: `Reroute via ${params.suggestedBypass}`,
      description: `Bypasses ${params.affectedCorridor} due to ${params.hazardReason}. Adds +${params.additionalMinutes}m and +${params.additionalKm.toFixed(1)} km.`,
      payload: {
        bypassCorridor: params.suggestedBypass,
        affectedCorridor: params.affectedCorridor,
        deltaMinutes: params.additionalMinutes,
        deltaKm: params.additionalKm,
      },
      requiresConfirmation: true, // NON-NEGOTIABLE: Never silently change route
      priority: 'critical',
      rationale: 'Safety protocol: hazardous pass requires traveler authorization before applying route changes.',
    };
  }

  /**
   * Plans meal breaks for journeys exceeding 4 hours.
   */
  public static planMealBreak(params: {
    corridorName: string;
    elapsedHours: number;
    suggestedStopName: string;
  }): PlannedAction | null {
    if (params.elapsedHours < 3.5) return null;

    return {
      id: `action-meal-${Date.now()}`,
      type: 'INSERT_MEAL_STOP',
      title: `Recommended Rest & Meal: ${params.suggestedStopName}`,
      description: `Drive time along ${params.corridorName} is ${params.elapsedHours.toFixed(1)}h. Rest break advised.`,
      payload: { stopName: params.suggestedStopName, recommendedDurationMins: 45 },
      requiresConfirmation: false,
      priority: 'medium',
      rationale: 'Driver fatigue prevention and local culinary immersion.',
    };
  }
}
