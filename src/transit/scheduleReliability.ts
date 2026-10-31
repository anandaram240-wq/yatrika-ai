/**
 * @file src/transit/scheduleReliability.ts
 * @description Statutory Karnataka Shakti Scheme eligibility verification and audit engine.
 * @reference Government of Karnataka Order No. TRD 34 MDA 2023, dated 05-06-2023.
 * @theme Code. Create. Celebrate Kannada.
 */

import { TransitServiceSchedule } from './transportDataAdapter';

export interface ShaktiAuditResult {
  isEligibleForZeroFare: boolean;
  baseFareInr: number;
  farePaidInr: number;
  savingsInr: number;
  statutoryReference: string;
  ineligibilityReason?: string;
  auditBadgeLabel: 'SHAKTI_VERIFIED_FREE' | 'FULL_FARE_PAYABLE' | 'NOT_COVERED_LUXURY_OR_TRAIN';
}

export class ScheduleReliability {
  /**
   * Verifies Shakti Scheme ₹0 fare eligibility per passenger and per transit leg
   * in strict compliance with Government Order TRD 34 MDA 2023.
   */
  public static auditShaktiEligibility(params: {
    service: TransitServiceSchedule;
    isFemalePassenger: boolean;
    isKarnatakaResident?: boolean;
    isInterstateBorderCrossed?: boolean;
  }): ShaktiAuditResult {
    const {
      service,
      isFemalePassenger,
      isKarnatakaResident = true,
      isInterstateBorderCrossed = false,
    } = params;

    const STATUTORY_ORDER = 'GoK Order No. TRD 34 MDA 2023 (Shakti Scheme)';

    // Rule 1: Passenger Gender & Residency
    if (!isFemalePassenger) {
      return {
        isEligibleForZeroFare: false,
        baseFareInr: service.baseFareInr,
        farePaidInr: service.baseFareInr,
        savingsInr: 0,
        statutoryReference: STATUTORY_ORDER,
        ineligibilityReason: 'Passenger is not eligible under female passenger criteria.',
        auditBadgeLabel: 'FULL_FARE_PAYABLE',
      };
    }

    if (!isKarnatakaResident) {
      return {
        isEligibleForZeroFare: false,
        baseFareInr: service.baseFareInr,
        farePaidInr: service.baseFareInr,
        savingsInr: 0,
        statutoryReference: STATUTORY_ORDER,
        ineligibilityReason: 'Shakti Scheme applies to Karnataka domicile residents (physical ID verification required).',
        auditBadgeLabel: 'FULL_FARE_PAYABLE',
      };
    }

    // Rule 2: Operator & Mode (Buses only; Trains and Metro excluded)
    if (service.operator === 'SWR_INDIAN_RAILWAYS' || service.operator === 'BMRCL_METRO') {
      return {
        isEligibleForZeroFare: false,
        baseFareInr: service.baseFareInr,
        farePaidInr: service.baseFareInr,
        savingsInr: 0,
        statutoryReference: STATUTORY_ORDER,
        ineligibilityReason: 'Railway and Metro services are governed by Central / Joint corporations and excluded from Shakti bus scheme.',
        auditBadgeLabel: 'NOT_COVERED_LUXURY_OR_TRAIN',
      };
    }

    // Rule 3: Service Classification (Ordinary / Express only; Luxury excluded)
    if (!service.isShaktiEligible) {
      return {
        isEligibleForZeroFare: false,
        baseFareInr: service.baseFareInr,
        farePaidInr: service.baseFareInr,
        savingsInr: 0,
        statutoryReference: STATUTORY_ORDER,
        ineligibilityReason: `Luxury/Semi-luxury service (${service.serviceCategory}) is explicitly excluded under Section 3(b) of TRD 34 MDA 2023.`,
        auditBadgeLabel: 'NOT_COVERED_LUXURY_OR_TRAIN',
      };
    }

    // Rule 4: Interstate Border Restriction
    if (isInterstateBorderCrossed) {
      return {
        isEligibleForZeroFare: false,
        baseFareInr: service.baseFareInr,
        farePaidInr: service.baseFareInr,
        savingsInr: 0,
        statutoryReference: STATUTORY_ORDER,
        ineligibilityReason: 'Shakti ₹0 travel applies strictly up to the Karnataka state boundary points.',
        auditBadgeLabel: 'FULL_FARE_PAYABLE',
      };
    }

    // Fully verified eligible
    return {
      isEligibleForZeroFare: true,
      baseFareInr: service.baseFareInr,
      farePaidInr: 0,
      savingsInr: service.baseFareInr,
      statutoryReference: STATUTORY_ORDER,
      auditBadgeLabel: 'SHAKTI_VERIFIED_FREE',
    };
  }
}
