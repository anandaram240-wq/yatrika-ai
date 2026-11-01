/**
 * @file src/data/destinations/destinationVerification.ts
 * @description Quality gate and forensic validation for Karnataka Destinations.
 * @theme Code. Create. Celebrate Kannada.
 */

import { SourceTrustClassification } from '../../data-fabric/verificationStatus';

export interface DestinationAuditResult {
  poiId: string;
  name: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  trustClassification: SourceTrustClassification;
  coordinatesValid: boolean;
  kannadaEncodingValid: boolean;
  hasVerifiedHours: boolean;
  hasVerifiedFees: boolean;
}

export class DestinationVerifier {
  // Karnataka Bounding Box: Longitude [74.0, 78.6], Latitude [11.5, 18.5]
  public static readonly KARNATAKA_BOUNDS = {
    minLng: 74.0,
    maxLng: 78.6,
    minLat: 11.5,
    maxLat: 18.5,
  };

  public static isWithinKarnataka(coordinates: [number, number]): boolean {
    const [lng, lat] = coordinates;
    return (
      lng >= this.KARNATAKA_BOUNDS.minLng &&
      lng <= this.KARNATAKA_BOUNDS.maxLng &&
      lat >= this.KARNATAKA_BOUNDS.minLat &&
      lat <= this.KARNATAKA_BOUNDS.maxLat
    );
  }

  public static hasValidKannada(text: string): boolean {
    if (!text || text.trim().length === 0) return false;
    // Kannada Unicode Range: \u0C80-\u0CFF
    return /[\u0C80-\u0CFF]/.test(text);
  }

  public static audit(poi: {
    id: string;
    name: string;
    nameKannada: string;
    district: string;
    coordinates: [number, number];
    openingHours?: string;
    entryFeeInr?: { indianCitizen?: number; feeNote?: string };
    sourceAttribution?: string;
    trustClassification?: SourceTrustClassification;
  }): DestinationAuditResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const coordinatesValid = this.isWithinKarnataka(poi.coordinates);
    if (!coordinatesValid) {
      errors.push(`Coordinates [${poi.coordinates.join(', ')}] fall outside Karnataka geographical boundaries.`);
    }

    const kannadaEncodingValid = this.hasValidKannada(poi.nameKannada);
    if (!kannadaEncodingValid) {
      errors.push(`Kannada name "${poi.nameKannada}" lacks valid Kannada Unicode script characters.`);
    }

    if (!poi.district || poi.district.trim().length === 0) {
      errors.push('Missing administrative district assignment.');
    }

    const hasVerifiedHours = Boolean(
      poi.openingHours &&
      poi.openingHours !== 'Unknown' &&
      poi.openingHours !== 'Not Available'
    );
    if (!hasVerifiedHours) {
      warnings.push('Statutory opening hours not published; marked for local field verification.');
    }

    const hasVerifiedFees = Boolean(
      poi.entryFeeInr &&
      typeof poi.entryFeeInr.indianCitizen === 'number'
    );
    if (!hasVerifiedFees) {
      warnings.push('Official entry fee not confirmed; marked as unverified.');
    }

    const trustClassification: SourceTrustClassification =
      poi.trustClassification ?? (hasVerifiedHours && coordinatesValid ? 'OFFICIAL_PUBLISHED' : 'COMMUNITY_MAPPED');

    return {
      poiId: poi.id,
      name: poi.name,
      isValid: errors.length === 0,
      errors,
      warnings,
      trustClassification,
      coordinatesValid,
      kannadaEncodingValid,
      hasVerifiedHours,
      hasVerifiedFees,
    };
  }
}
