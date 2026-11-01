/**
 * @file src/__tests__/autonomousReplanningV2.test.ts
 * @description Unit tests for Autonomous Trip Replanning V2 (Bengaluru -> Hassan -> Belur -> Chikkamagaluru -> Mullayanagiri).
 */

import { describe, it, expect } from 'vitest';
import { AdaptiveTripOrchestrator } from '../agents/adaptiveTripOrchestrator';
import { ItineraryStop } from '../agents/routeReplanner';
import { DisruptionEvent } from '../agents/disruptionAnalyzer';

describe('Autonomous Trip Replanning V2 (Phase 5)', () => {
  const initialStops: ItineraryStop[] = [
    {
      poiId: 'poi-hassan-hasanamba',
      name: 'Hasanamba Temple Hassan',
      plannedArrival: '09:30',
      plannedDeparture: '10:30',
      openingTime: '06:00',
      closingTime: '20:00',
      estimatedCostInr: 50,
    },
    {
      poiId: 'poi-belur-chennakeshava',
      name: 'Chennakeshava Temple Belur',
      plannedArrival: '11:15',
      plannedDeparture: '12:45',
      openingTime: '07:30',
      closingTime: '19:30',
      noonClosureStart: '12:30',
      noonClosureEnd: '15:30',
      estimatedCostInr: 100,
    },
    {
      poiId: 'poi-chikkamagaluru-coffee',
      name: 'Chikkamagaluru Coffee Museum',
      plannedArrival: '14:00',
      plannedDeparture: '15:30',
      openingTime: '10:00',
      closingTime: '18:00',
      estimatedCostInr: 40,
    },
    {
      poiId: 'poi-mullayanagiri-peak',
      name: 'Mullayanagiri Peak',
      plannedArrival: '16:30',
      plannedDeparture: '18:00',
      openingTime: '06:00',
      closingTime: '17:30', // Forest gate sunset lock
      estimatedCostInr: 0,
    },
  ];

  it('detects route disruption, checks source authority, and generates feasible alternatives', () => {
    const orchestrator = new AdaptiveTripOrchestrator(initialStops, 'Bengaluru');

    // Simulate 50 mins highway culvert repair on SH-57 reported by Karnataka PWD
    const disruption: DisruptionEvent = {
      eventId: 'evt-pwd-hassan-001',
      affectedCorridor: 'SH-57 Hassan - Belur Highway',
      interruptionType: 'ROAD_MAINTENANCE',
      sourceAuthority: 'Karnataka PWD Hassan Division',
      sourceReliabilityScore: 0.95,
      ageMinutes: 15,
      expectedDelayMinutes: 50,
      isHardBlock: false,
    };

    const replanResult = orchestrator.handleDisruption(disruption);

    expect(replanResult.requiresApproval).toBe(true);
    expect(replanResult.alternatives.length).toBeGreaterThanOrEqual(2);
    expect(replanResult.explanationEnglish).toContain('SH-57 Hassan - Belur Highway');
    expect(replanResult.explanationKannada).toContain('ಮಾರ್ಗ ಪರಿಷ್ಕರಣೆ');

    const auditLog = orchestrator.auditManager.getAllDecisions();
    expect(auditLog).toHaveLength(1);
    expect(auditLog[0].approvalStatus).toBe('PENDING');
    expect(auditLog[0].humanApprovalRequired).toBe(true);
  });

  it('requires human approval gate and updates itinerary only upon explicit traveler consent', () => {
    const orchestrator = new AdaptiveTripOrchestrator(initialStops, 'Bengaluru');

    const disruption: DisruptionEvent = {
      eventId: 'evt-pwd-002',
      affectedCorridor: 'SH-57 Belur Corridor',
      interruptionType: 'ROAD_MAINTENANCE',
      sourceAuthority: 'Karnataka Police Traffic Hassan',
      sourceReliabilityScore: 0.9,
      ageMinutes: 10,
      expectedDelayMinutes: 45,
      isHardBlock: false,
    };

    const result = orchestrator.handleDisruption(disruption);
    const chosenOption = result.alternatives[0];

    // Traveler approves Option 1
    const approved = orchestrator.commitUserApproval(result.decisionId, chosenOption.optionId, result.alternatives);
    expect(approved).toBe(true);

    const updatedState = orchestrator.getTripState();
    expect(updatedState.isRerouteInProgress).toBe(false);
    expect(orchestrator.auditManager.getDecision(result.decisionId)?.approvalStatus).toBe('APPROVED');
  });

  it('supports full rollback to previous itinerary snapshot if traveler rejects proposed reroute', () => {
    const orchestrator = new AdaptiveTripOrchestrator(initialStops, 'Bengaluru');

    const disruption: DisruptionEvent = {
      eventId: 'evt-pwd-003',
      affectedCorridor: 'Mullayanagiri Access Road',
      interruptionType: 'WEATHER_HAZARD',
      sourceAuthority: 'District Disaster Management Authority Chikkamagaluru',
      sourceReliabilityScore: 0.92,
      ageMinutes: 20,
      expectedDelayMinutes: 60,
      isHardBlock: true,
    };

    const result = orchestrator.handleDisruption(disruption);
    // User rejects the alternative
    const rollbackSuccess = orchestrator.rollback(result.decisionId);
    expect(rollbackSuccess).toBe(true);

    const restoredState = orchestrator.getTripState();
    expect(restoredState.activeStops).toHaveLength(4);
    expect(restoredState.activeStops[1].name).toBe('Chennakeshava Temple Belur');
    expect(orchestrator.auditManager.getDecision(result.decisionId)?.approvalStatus).toBe('ROLLED_BACK');
  });
});
