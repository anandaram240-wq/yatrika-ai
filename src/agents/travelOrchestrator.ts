/**
 * @file src/agents/travelOrchestrator.ts
 * @description Central Autonomous Trip Orchestration Engine for YatriKa AI.
 * @theme Code. Create. Celebrate Kannada.
 */

import { TripStateMachine, TripState, TripLifecycleEvent } from './tripStateMachine';
import { TravelDecisionEngine, HazardEvaluationResult, TravelFeasibilityEvaluation } from './travelDecisionEngine';
import { ActionPlanner, PlannedAction } from './actionPlanner';
import { TrustEngine, TrustDecisionExplanation } from '../intelligence/trustEngine';

export interface OrchestratedTripPlan {
  tripId: string;
  state: TripState;
  originId: string;
  originName: string;
  stopIds: string[];
  days: number;
  totalDistanceKm: number;
  estimatedDriveHours: number;
  isGhatTerrain: boolean;
  feasibility: TravelFeasibilityEvaluation;
  activeDisruption?: {
    hazard: HazardEvaluationResult;
    proposedDetourAction: PlannedAction;
    trustExplanation: TrustDecisionExplanation;
  };
  plannedActions: PlannedAction[];
  lastUpdated: string;
}

export class TravelOrchestrator {
  private stateMachine: TripStateMachine;
  private currentPlan: OrchestratedTripPlan | null = null;

  constructor() {
    this.stateMachine = new TripStateMachine('DRAFT');
  }

  public getState(): TripState {
    return this.stateMachine.getState();
  }

  public getCurrentPlan(): OrchestratedTripPlan | null {
    return this.currentPlan;
  }

  /**
   * Initializes and orchestrates a new travel plan from origin and destinations.
   */
  public orchestrateTrip(params: {
    originId: string;
    originName: string;
    destinationIds: string[];
    viaIds?: string[];
    days: number;
    totalRoadDistanceKm: number;
    estimatedDriveHours: number;
    isGhatTerrain: boolean;
  }): OrchestratedTripPlan {
    this.stateMachine.transition({ type: 'START_PLANNING' });

    const feasibility = TravelDecisionEngine.evaluateFeasibility({
      stopCount: params.destinationIds.length + (params.viaIds?.length ?? 0),
      allocatedDays: params.days,
      totalRoadDistanceKm: params.totalRoadDistanceKm,
      estimatedDriveHours: params.estimatedDriveHours,
      isGhatTerrain: params.isGhatTerrain,
    });

    const plannedActions = ActionPlanner.planTripSetup({
      originId: params.originId,
      originName: params.originName,
      destinationIds: params.destinationIds,
      viaIds: params.viaIds,
    });

    // Check if meal stop needed
    const mealAction = ActionPlanner.planMealBreak({
      corridorName: params.isGhatTerrain ? 'Western Ghats Corridor' : 'NH Highway Corridor',
      elapsedHours: params.estimatedDriveHours,
      suggestedStopName: params.isGhatTerrain ? 'Kadur / Hassan Highway Comfort Oasis' : 'Highway Food Plaza',
    });
    if (mealAction) {
      plannedActions.push(mealAction);
    }

    this.stateMachine.transition({ type: 'ITINERARY_FINALIZED' });

    const allStopIds = [...(params.viaIds ?? []), ...params.destinationIds];

    this.currentPlan = {
      tripId: `trip-${Date.now()}`,
      state: this.stateMachine.getState(),
      originId: params.originId,
      originName: params.originName,
      stopIds: allStopIds,
      days: params.days,
      totalDistanceKm: params.totalRoadDistanceKm,
      estimatedDriveHours: params.estimatedDriveHours,
      isGhatTerrain: params.isGhatTerrain,
      feasibility,
      plannedActions,
      lastUpdated: new Date().toISOString(),
    };

    return this.currentPlan;
  }

  /**
   * Processes a real-time road hazard or weather disruption event.
   * NEVER silently alters the route: transitions to DISRUPTED and requires confirmation.
   */
  public handleDisruptionEvent(params: {
    corridorName: string;
    precipitationMm: number;
    windKmh: number;
    isOfficialRoadClosure: boolean;
    closureReason?: string;
    suggestedBypassCorridor: string;
    bypassAdditionalMinutes: number;
    bypassAdditionalKm: number;
    reportingSourceId: string;
  }): {
    disrupted: boolean;
    requiresTravelerConfirmation: boolean;
    explanation?: TrustDecisionExplanation;
  } {
    if (!this.currentPlan) {
      return { disrupted: false, requiresTravelerConfirmation: false };
    }

    const hazard = TravelDecisionEngine.evaluateHazardDisruption({
      corridorName: params.corridorName,
      precipitationMmPerHour: params.precipitationMm,
      windKmh: params.windKmh,
      isOfficialRoadClosure: params.isOfficialRoadClosure,
      closureReason: params.closureReason,
      officialReportingSource: params.reportingSourceId,
    });

    if (!hazard.hasCriticalDisruption) {
      return { disrupted: false, requiresTravelerConfirmation: false };
    }

    // Move to DISRUPTED state
    this.stateMachine.transition({
      type: 'DISRUPTION_DETECTED',
      issue: hazard.hazardDescription ?? 'Critical road hazard',
      affectedSegmentId: params.corridorName,
    });

    // Generate detour proposal
    const proposedDetourAction = ActionPlanner.planDetourProposal({
      affectedCorridor: params.corridorName,
      suggestedBypass: params.suggestedBypassCorridor,
      hazardReason: hazard.hazardDescription ?? 'Unsafe conditions',
      additionalMinutes: params.bypassAdditionalMinutes,
      additionalKm: params.bypassAdditionalKm,
    });

    const trustExplanation = TrustEngine.explainGhatDetour({
      primaryCorridor: params.corridorName,
      suggestedDetourCorridor: params.suggestedBypassCorridor,
      hazardReason: hazard.hazardDescription ?? 'Severe weather / closure',
      isOfficialClosure: params.isOfficialRoadClosure,
      etaDeltaMinutes: params.bypassAdditionalMinutes,
      distanceDeltaKm: params.bypassAdditionalKm,
      reportingSourceId: params.reportingSourceId,
    });

    this.currentPlan.activeDisruption = {
      hazard,
      proposedDetourAction,
      trustExplanation,
    };
    this.currentPlan.state = this.stateMachine.getState();
    this.currentPlan.lastUpdated = new Date().toISOString();

    return {
      disrupted: true,
      requiresTravelerConfirmation: true, // Non-negotiable confirmation gate
      explanation: trustExplanation,
    };
  }

  /**
   * Applies the proposed detour after explicit traveler confirmation.
   */
  public confirmDetourProposal(): boolean {
    if (!this.currentPlan?.activeDisruption) return false;

    this.stateMachine.transition({ type: 'BEGIN_REPLANNING', proposedChanges: 'Applying suggested bypass route.' });
    this.stateMachine.transition({ type: 'CONFIRM_REPLAN' });

    // Update distance and hours
    const detour = this.currentPlan.activeDisruption.proposedDetourAction.payload;
    const deltaKm = typeof detour.deltaKm === 'number' ? detour.deltaKm : 0;
    const deltaMins = typeof detour.deltaMinutes === 'number' ? detour.deltaMinutes : 0;

    this.currentPlan.totalDistanceKm += deltaKm;
    this.currentPlan.estimatedDriveHours += deltaMins / 60;
    this.currentPlan.activeDisruption = undefined;
    this.currentPlan.state = this.stateMachine.getState();
    this.currentPlan.lastUpdated = new Date().toISOString();

    return true;
  }

  /**
   * Rejects the proposed detour and retains current itinerary.
   */
  public rejectDetourProposal(): boolean {
    if (!this.currentPlan?.activeDisruption) return false;

    this.stateMachine.transition({ type: 'BEGIN_REPLANNING', proposedChanges: 'Traveler retained primary corridor.' });
    this.stateMachine.transition({ type: 'REJECT_REPLAN', revertToPrevious: true });

    this.currentPlan.activeDisruption = undefined;
    this.currentPlan.state = this.stateMachine.getState();
    this.currentPlan.lastUpdated = new Date().toISOString();

    return true;
  }

  /**
   * Transitions trip lifecycle directly.
   */
  public dispatchLifecycleEvent(event: TripLifecycleEvent): boolean {
    const res = this.stateMachine.transition(event);
    if (res.success && this.currentPlan) {
      this.currentPlan.state = res.newState;
      this.currentPlan.lastUpdated = new Date().toISOString();
    }
    return res.success;
  }
}
