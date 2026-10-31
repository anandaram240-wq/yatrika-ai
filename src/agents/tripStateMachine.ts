/**
 * @file src/agents/tripStateMachine.ts
 * @description Event-driven Trip Lifecycle State Machine for YatriKa AI.
 * @theme Code. Create. Celebrate Kannada.
 */

export type TripState =
  | 'DRAFT'
  | 'PLANNING'
  | 'READY'
  | 'ACTIVE'
  | 'PAUSED'
  | 'DISRUPTED'
  | 'REPLANNING'
  | 'COMPLETED'
  | 'CANCELLED';

export type TripLifecycleEvent =
  | { type: 'START_PLANNING' }
  | { type: 'ITINERARY_FINALIZED' }
  | { type: 'START_JOURNEY' }
  | { type: 'PAUSE_JOURNEY'; reason?: string }
  | { type: 'RESUME_JOURNEY' }
  | { type: 'DISRUPTION_DETECTED'; issue: string; affectedSegmentId: string }
  | { type: 'BEGIN_REPLANNING'; proposedChanges: string }
  | { type: 'CONFIRM_REPLAN' }
  | { type: 'REJECT_REPLAN'; revertToPrevious: boolean }
  | { type: 'FINISH_JOURNEY' }
  | { type: 'CANCEL_JOURNEY'; reason: string }
  | { type: 'RESET_TO_DRAFT' };

export interface TripStateTransitionLog {
  fromState: TripState;
  toState: TripState;
  eventType: string;
  timestamp: string;
  notes?: string;
}

export class TripStateMachine {
  private currentState: TripState = 'DRAFT';
  private transitionHistory: TripStateTransitionLog[] = [];

  constructor(initialState: TripState = 'DRAFT') {
    this.currentState = initialState;
    this.transitionHistory.push({
      fromState: 'DRAFT',
      toState: initialState,
      eventType: 'INITIALIZE',
      timestamp: new Date().toISOString(),
      notes: 'State machine initialized',
    });
  }

  public getState(): TripState {
    return this.currentState;
  }

  public getHistory(): TripStateTransitionLog[] {
    return [...this.transitionHistory];
  }

  public canTransition(event: TripLifecycleEvent): boolean {
    const s = this.currentState;
    switch (event.type) {
      case 'START_PLANNING':
        return s === 'DRAFT' || s === 'CANCELLED';
      case 'ITINERARY_FINALIZED':
        return s === 'PLANNING' || s === 'DRAFT';
      case 'START_JOURNEY':
        return s === 'READY' || s === 'PAUSED';
      case 'PAUSE_JOURNEY':
        return s === 'ACTIVE';
      case 'RESUME_JOURNEY':
        return s === 'PAUSED';
      case 'DISRUPTION_DETECTED':
        return s === 'ACTIVE' || s === 'READY';
      case 'BEGIN_REPLANNING':
        return s === 'DISRUPTED' || s === 'ACTIVE';
      case 'CONFIRM_REPLAN':
        return s === 'REPLANNING';
      case 'REJECT_REPLAN':
        return s === 'REPLANNING';
      case 'FINISH_JOURNEY':
        return s === 'ACTIVE' || s === 'PAUSED';
      case 'CANCEL_JOURNEY':
        return s !== 'COMPLETED' && s !== 'CANCELLED';
      case 'RESET_TO_DRAFT':
        return true;
      default:
        return false;
    }
  }

  public transition(event: TripLifecycleEvent): { success: boolean; newState: TripState; error?: string } {
    if (!this.canTransition(event)) {
      return {
        success: false,
        newState: this.currentState,
        error: `Illegal state transition from ${this.currentState} with event ${event.type}`,
      };
    }

    const fromState = this.currentState;
    let toState: TripState = fromState;
    let notes: string | undefined;

    switch (event.type) {
      case 'START_PLANNING':
        toState = 'PLANNING';
        break;
      case 'ITINERARY_FINALIZED':
        toState = 'READY';
        break;
      case 'START_JOURNEY':
        toState = 'ACTIVE';
        break;
      case 'PAUSE_JOURNEY':
        toState = 'PAUSED';
        notes = event.reason;
        break;
      case 'RESUME_JOURNEY':
        toState = 'ACTIVE';
        break;
      case 'DISRUPTION_DETECTED':
        toState = 'DISRUPTED';
        notes = `Disruption: ${event.issue} (Segment: ${event.affectedSegmentId})`;
        break;
      case 'BEGIN_REPLANNING':
        toState = 'REPLANNING';
        notes = event.proposedChanges;
        break;
      case 'CONFIRM_REPLAN':
        toState = 'ACTIVE';
        notes = 'Traveler accepted re-planned route.';
        break;
      case 'REJECT_REPLAN':
        toState = event.revertToPrevious ? 'ACTIVE' : 'DISRUPTED';
        notes = 'Traveler rejected proposed detour.';
        break;
      case 'FINISH_JOURNEY':
        toState = 'COMPLETED';
        break;
      case 'CANCEL_JOURNEY':
        toState = 'CANCELLED';
        notes = event.reason;
        break;
      case 'RESET_TO_DRAFT':
        toState = 'DRAFT';
        break;
    }

    this.currentState = toState;
    this.transitionHistory.push({
      fromState,
      toState,
      eventType: event.type,
      timestamp: new Date().toISOString(),
      ...(notes ? { notes } : {}),
    });

    return { success: true, newState: toState };
  }
}
