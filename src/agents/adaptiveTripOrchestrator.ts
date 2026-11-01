/**
 * @file src/agents/adaptiveTripOrchestrator.ts
 * @description Autonomous Trip Replanning Orchestrator V2 for YatriKa AI.
 * Implements context-preserving trip state, human approval gates, decision audit logging, and rollbacks.
 * @theme Code. Create. Celebrate Kannada.
 */

import { DecisionAuditManager, AutonomousDecisionRecord } from './decisionAuditLog';
import { DisruptionAnalyzer, DisruptionEvent } from './disruptionAnalyzer';
import { RouteReplanner, ItineraryStop, ReplannedAlternative } from './routeReplanner';

export interface TripState {
  tripId: string;
  travelerOrigin: string;
  activeStops: ItineraryStop[];
  currentStopIndex: number;
  isRerouteInProgress: boolean;
  activeDecisionRecord?: AutonomousDecisionRecord;
}

export class AdaptiveTripOrchestrator {
  public readonly auditManager: DecisionAuditManager;
  private tripState: TripState;

  constructor(initialStops: ItineraryStop[], origin: string = 'Bengaluru') {
    this.auditManager = new DecisionAuditManager();
    this.tripState = {
      tripId: `trip-${Date.now()}`,
      travelerOrigin: origin,
      activeStops: initialStops,
      currentStopIndex: 0,
      isRerouteInProgress: false,
    };
  }

  public getTripState(): TripState {
    return { ...this.tripState };
  }

  /**
   * Handle an interruption during journey.
   * Generates alternatives and stages a decision awaiting user approval.
   */
  public handleDisruption(event: DisruptionEvent): {
    requiresApproval: boolean;
    decisionId: string;
    alternatives: ReplannedAlternative[];
    explanationKannada: string;
    explanationEnglish: string;
  } {
    const analysis = DisruptionAnalyzer.assessDisruption(event);
    if (!analysis.isActionable) {
      throw new Error(`Disruption event not actionable: ${analysis.reasoning}`);
    }

    const snapshot = JSON.parse(JSON.stringify(this.tripState.activeStops));
    const alternatives = RouteReplanner.generateAlternatives({
      currentStopIndex: this.tripState.currentStopIndex,
      originalStops: this.tripState.activeStops,
      delayMinutes: event.expectedDelayMinutes,
      disruptedSegment: event.affectedCorridor,
    });

    const recommended = alternatives[0];
    const decisionId = `dec-${Date.now()}`;

    const decisionRecord: AutonomousDecisionRecord = {
      decisionId,
      timestamp: new Date().toISOString(),
      triggerEvent: event.interruptionType,
      sourceOfInterruption: event.sourceAuthority,
      affectedSegment: event.affectedCorridor,
      reasonCode: 'REROUTE_FEASIBILITY_OPTIMIZATION',
      explanationEnglish: `Traffic delay on ${event.affectedCorridor} (+${event.expectedDelayMinutes}m). Replanned to avoid temple closure and ensure safe arrival.`,
      explanationKannada: `${event.affectedCorridor} ಮಾರ್ಗದಲ್ಲಿ ವಿಳಂಬ (+${event.expectedDelayMinutes} ನಿಮಿಷ). ದೇವಾಲಯದ ಮುಚ್ಚುವಿಕೆ ತಪ್ಪಿಸಲು ಮಾರ್ಗ ಪರಿಷ್ಕರಣೆ.`,
      alternativesEvaluated: alternatives.map((a) => ({
        optionId: a.optionId,
        description: a.label,
        durationDeltaMinutes: a.totalDurationMinutes - 480,
        costDeltaInr: 0,
        feasibilityScore: a.feasibilityScore,
      })),
      recommendedOptionId: recommended.optionId,
      humanApprovalRequired: true,
      approvalStatus: 'PENDING',
      previousItinerarySnapshot: snapshot,
    };

    this.auditManager.logDecision(decisionRecord);
    this.tripState.isRerouteInProgress = true;
    this.tripState.activeDecisionRecord = decisionRecord;

    return {
      requiresApproval: true,
      decisionId,
      alternatives,
      explanationEnglish: decisionRecord.explanationEnglish,
      explanationKannada: decisionRecord.explanationKannada,
    };
  }

  /**
   * Traveler explicitly approves the proposed alternative.
   */
  public commitUserApproval(decisionId: string, chosenOptionId: string, alternatives: ReplannedAlternative[]): boolean {
    const decision = this.auditManager.getDecision(decisionId);
    if (!decision || decision.approvalStatus !== 'PENDING') return false;

    const chosen = alternatives.find((a) => a.optionId === chosenOptionId);
    if (!chosen) return false;

    this.auditManager.approveDecision(decisionId);
    this.tripState.activeStops = chosen.stops;
    this.tripState.isRerouteInProgress = false;
    return true;
  }

  /**
   * Traveler rejects and rolls back to original itinerary snapshot.
   */
  public rollback(decisionId: string): boolean {
    const res = this.auditManager.rollbackDecision(decisionId);
    if (!res.success) return false;

    this.tripState.activeStops = res.restoredSnapshot as ItineraryStop[];
    this.tripState.isRerouteInProgress = false;
    return true;
  }
}
