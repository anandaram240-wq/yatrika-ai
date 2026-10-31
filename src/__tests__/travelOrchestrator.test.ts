import { describe, expect, it } from 'vitest';
import { TripStateMachine } from '../agents/tripStateMachine';
import { TravelOrchestrator } from '../agents/travelOrchestrator';
import { TravelDecisionEngine } from '../agents/travelDecisionEngine';

describe('Phase 2: Autonomous Trip Orchestration Engine', () => {
  it('1. State machine tracks lifecycle and prevents illegal transitions', () => {
    const sm = new TripStateMachine('DRAFT');
    expect(sm.getState()).toBe('DRAFT');

    // DRAFT -> START_PLANNING -> PLANNING
    const res1 = sm.transition({ type: 'START_PLANNING' });
    expect(res1.success).toBe(true);
    expect(sm.getState()).toBe('PLANNING');

    // Illegal: PLANNING -> START_JOURNEY without ITINERARY_FINALIZED
    const res2 = sm.transition({ type: 'START_JOURNEY' });
    expect(res2.success).toBe(false);
    expect(sm.getState()).toBe('PLANNING');

    // Legal: PLANNING -> ITINERARY_FINALIZED -> READY -> START_JOURNEY -> ACTIVE
    sm.transition({ type: 'ITINERARY_FINALIZED' });
    expect(sm.getState()).toBe('READY');

    sm.transition({ type: 'START_JOURNEY' });
    expect(sm.getState()).toBe('ACTIVE');

    expect(sm.getHistory().length).toBeGreaterThanOrEqual(4);
  });

  it('2. Evaluates travel feasibility and identifies overpacked itineraries in Ghat terrain', () => {
    // 6 stops in 1 day in Ghat terrain is dangerous
    const badPlan = TravelDecisionEngine.evaluateFeasibility({
      stopCount: 6,
      allocatedDays: 1,
      totalRoadDistanceKm: 320,
      estimatedDriveHours: 8.5,
      isGhatTerrain: true,
    });

    expect(badPlan.isFeasible).toBe(false);
    expect(badPlan.isOverpacked).toBe(true);
    expect(badPlan.explanation).toContain('Overpacked schedule');

    // 2 stops in 1 day in Ghat terrain is feasible
    const goodPlan = TravelDecisionEngine.evaluateFeasibility({
      stopCount: 2,
      allocatedDays: 1,
      totalRoadDistanceKm: 140,
      estimatedDriveHours: 3.2,
      isGhatTerrain: true,
    });

    expect(goodPlan.isFeasible).toBe(true);
    expect(goodPlan.isOverpacked).toBe(false);
  });

  it('3. Orchestrator handles disruptions and enforces explicit confirmation before altering active route', () => {
    const orchestrator = new TravelOrchestrator();

    const trip = orchestrator.orchestrateTrip({
      originId: 'rail-sbc',
      originName: 'Bengaluru Majestic (SBC)',
      destinationIds: ['poi-mullayanagiri', 'poi-baba-budangiri'],
      viaIds: ['poi-belur-temple'],
      days: 2,
      totalRoadDistanceKm: 280,
      estimatedDriveHours: 5.5,
      isGhatTerrain: true,
    });

    expect(trip.state).toBe('READY');
    expect(trip.stopIds.length).toBe(3);

    // Start journey
    orchestrator.dispatchLifecycleEvent({ type: 'START_JOURNEY' });
    expect(orchestrator.getState()).toBe('ACTIVE');

    // Simulate verified road closure on Shiradi Ghat
    const disruption = orchestrator.handleDisruptionEvent({
      corridorName: 'NH-75 Shiradi Ghat',
      precipitationMm: 22.4,
      windKmh: 42,
      isOfficialRoadClosure: true,
      closureReason: 'Rockfall reported by Sakleshpur Traffic Police',
      suggestedBypassCorridor: 'NH-275 Sampaje Ghat via Madikeri',
      bypassAdditionalMinutes: 45,
      bypassAdditionalKm: 34,
      reportingSourceId: 'src-karnataka-pwd',
    });

    expect(disruption.disrupted).toBe(true);
    expect(disruption.requiresTravelerConfirmation).toBe(true);
    expect(orchestrator.getState()).toBe('DISRUPTED');

    // Traveler confirms detour
    const confirmed = orchestrator.confirmDetourProposal();
    expect(confirmed).toBe(true);
    expect(orchestrator.getState()).toBe('ACTIVE');
    expect(orchestrator.getCurrentPlan()?.totalDistanceKm).toBe(280 + 34);
  });
});
