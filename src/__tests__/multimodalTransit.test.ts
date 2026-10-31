import { describe, expect, it } from 'vitest';
import { VERIFIED_TRANSIT_SERVICES, TransitServiceSchedule } from '../transit/transportDataAdapter';
import { IntermodalGraph } from '../transit/intermodalGraph';
import { TransferOptimizer } from '../transit/transferOptimizer';
import { ScheduleReliability } from '../transit/scheduleReliability';

describe('Phase 5: Real-World Multimodal Travel Engine & Statutory Shakti Audit', () => {
  it('1. Provides verified schedule data with clear classification and booking links', () => {
    expect(VERIFIED_TRANSIT_SERVICES.length).toBeGreaterThanOrEqual(4);
    VERIFIED_TRANSIT_SERVICES.forEach((service) => {
      expect(service.serviceId).toBeDefined();
      expect(service.officialBookingUrl).toMatch(/^https:\/\//);
      expect(['scheduled_published', 'estimated_frequency', 'external_hand_off']).toContain(
        service.dataClassification
      );
    });
  });

  it('2. Models intermodal transfer connections with realistic pedestrian buffer times', () => {
    // SBC Railway Platform 1 to Majestic Bus Stand Terminal 2
    const transfer = IntermodalGraph.getTransferDetails('hub-sbc-railway', 'hub-majestic-bus');
    expect(transfer).toBeDefined();
    expect(transfer?.averageTransferMinutes).toBeGreaterThanOrEqual(10);
    expect(transfer?.transferMode).toBe('pedestrian_subway');
  });

  it('3. Optimizes transfers, evaluates missed connection risk, and calculates carbon offsets', () => {
    // Metro arrives Kengeri 06:28, Bus departs 07:15 -> 47 min buffer -> LOW risk
    const leg1: TransitServiceSchedule = {
      serviceId: 'test-metro',
      operator: 'BMRCL_METRO',
      serviceCategory: 'metro_purple',
      serviceName: 'Metro Purple',
      originHubId: 'hub-majestic-metro',
      originHubName: 'Majestic Metro',
      destinationHubId: 'hub-majestic-bus',
      destinationHubName: 'Majestic Bus Stand',
      departureTime: '06:00',
      arrivalTime: '06:15',
      durationMinutes: 15,
      baseFareInr: 30,
      isShaktiEligible: false,
      dataClassification: 'scheduled_published',
      officialBookingUrl: 'https://bmrc.co.in',
    };

    const leg2: TransitServiceSchedule = VERIFIED_TRANSIT_SERVICES[0]; // Departs 06:30 -> buffer 15 mins -> MEDIUM risk

    const connection = TransferOptimizer.optimizeTransfer(leg1, leg2, 280);
    expect(connection).toBeDefined();
    expect(connection?.transferBufferMinutes).toBe(15);
    expect(connection?.missedConnectionRisk).toBe('MEDIUM');
    expect(connection?.estimatedCarbonSavedKg).toBeGreaterThan(35); // 280 km * 0.149 kg/km = 41.7 kg
  });

  it('4. Enforces legally accurate Shakti Scheme ₹0 audit under TRD 34 MDA 2023', () => {
    const sarigeBus = VERIFIED_TRANSIT_SERVICES.find((s) => s.serviceCategory === 'karnataka_sarige')!;
    const rajahamsaBus = VERIFIED_TRANSIT_SERVICES.find((s) => s.serviceCategory === 'rajahamsa')!;
    const vandeBharat = VERIFIED_TRANSIT_SERVICES.find((s) => s.serviceCategory === 'vande_bharat')!;

    // Scenario A: Female Karnataka resident on Ordinary Karnataka Sarige -> FREE
    const auditA = ScheduleReliability.auditShaktiEligibility({
      service: sarigeBus,
      isFemalePassenger: true,
      isKarnatakaResident: true,
    });
    expect(auditA.isEligibleForZeroFare).toBe(true);
    expect(auditA.farePaidInr).toBe(0);
    expect(auditA.savingsInr).toBe(sarigeBus.baseFareInr);
    expect(auditA.auditBadgeLabel).toBe('SHAKTI_VERIFIED_FREE');

    // Scenario B: Male passenger on Karnataka Sarige -> Full Fare
    const auditB = ScheduleReliability.auditShaktiEligibility({
      service: sarigeBus,
      isFemalePassenger: false,
    });
    expect(auditB.isEligibleForZeroFare).toBe(false);
    expect(auditB.farePaidInr).toBe(sarigeBus.baseFareInr);
    expect(auditB.savingsInr).toBe(0);

    // Scenario C: Female passenger on Luxury/Semi-luxury Rajahamsa -> Full Fare (Excluded by law)
    const auditC = ScheduleReliability.auditShaktiEligibility({
      service: rajahamsaBus,
      isFemalePassenger: true,
      isKarnatakaResident: true,
    });
    expect(auditC.isEligibleForZeroFare).toBe(false);
    expect(auditC.auditBadgeLabel).toBe('NOT_COVERED_LUXURY_OR_TRAIN');
    expect(auditC.ineligibilityReason).toContain('Luxury/Semi-luxury');

    // Scenario D: Female passenger on SWR Vande Bharat Train -> Full Fare (Central Railway Excluded)
    const auditD = ScheduleReliability.auditShaktiEligibility({
      service: vandeBharat,
      isFemalePassenger: true,
      isKarnatakaResident: true,
    });
    expect(auditD.isEligibleForZeroFare).toBe(false);
    expect(auditD.auditBadgeLabel).toBe('NOT_COVERED_LUXURY_OR_TRAIN');
    expect(auditD.ineligibilityReason).toContain('Railway and Metro');

    // Scenario E: Interstate travel beyond Karnataka border -> Full Fare
    const auditE = ScheduleReliability.auditShaktiEligibility({
      service: sarigeBus,
      isFemalePassenger: true,
      isKarnatakaResident: true,
      isInterstateBorderCrossed: true,
    });
    expect(auditE.isEligibleForZeroFare).toBe(false);
    expect(auditE.ineligibilityReason).toContain('state boundary');
  });
});
