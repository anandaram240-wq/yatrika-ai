/**
 * @file src/data/sourceQuality.ts
 * @description Quality validation, coordinate sanity checks, and duplicate detection for Karnataka datasets.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface QualityValidationReport {
  recordId: string;
  isCoordinateValid: boolean;
  isWithinKarnatakaBoundingBox: boolean;
  missingRequiredFields: string[];
  duplicateCandidateOf?: string;
  qualityScore: number; // 0 to 100
  issues: string[];
}

export class SourceQualityValidator {
  // Karnataka WGS84 Geographic Envelope
  public static readonly KARNATAKA_BBOX = {
    minLat: 11.5,
    maxLat: 18.5,
    minLon: 74.0,
    maxLon: 78.6,
  };

  /**
   * Validates if a WGS84 coordinate [lon, lat] is physically situated inside Karnataka.
   */
  public static isWithinKarnataka(coordinates: [number, number]): boolean {
    const [lon, lat] = coordinates;
    if (typeof lon !== 'number' || typeof lat !== 'number' || isNaN(lon) || isNaN(lat)) {
      return false;
    }
    return (
      lat >= this.KARNATAKA_BBOX.minLat &&
      lat <= this.KARNATAKA_BBOX.maxLat &&
      lon >= this.KARNATAKA_BBOX.minLon &&
      lon <= this.KARNATAKA_BBOX.maxLon
    );
  }

  /**
   * Great circle distance in meters between two coordinates.
   */
  public static haversineMeters(c1: [number, number], c2: [number, number]): number {
    const R = 6371000;
    const dLat = ((c2[1] - c1[1]) * Math.PI) / 180;
    const dLon = ((c2[0] - c1[0]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((c1[1] * Math.PI) / 180) *
        Math.cos((c2[1] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Check for true duplicate POIs (distance < 50m and matching normalized name).
   * Guardrail: Never merges nearby distinct temples/attractions (e.g. Belur Chennakeshava vs Kappe Chennigaraya).
   */
  public static findDuplicate(
    candidate: { id: string; name: string; coordinates: [number, number] },
    existingList: Array<{ id: string; name: string; coordinates: [number, number] }>
  ): string | undefined {
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const candNorm = norm(candidate.name);

    for (const item of existingList) {
      if (item.id === candidate.id) continue;
      const dist = this.haversineMeters(candidate.coordinates, item.coordinates);
      const itemNorm = norm(item.name);

      // Only flag as duplicate if physically within 50m AND name strings are identical or mutual substrings
      if (dist < 50 && (candNorm === itemNorm || (candNorm.length > 5 && itemNorm.includes(candNorm)))) {
        return item.id;
      }
    }
    return undefined;
  }

  public static auditRecord(record: {
    id: string;
    name?: string;
    coordinates?: [number, number];
    category?: string;
    district?: string;
  }): QualityValidationReport {
    const issues: string[] = [];
    const missing: string[] = [];

    if (!record.name) {
      missing.push('name');
      issues.push('Missing destination name');
    }
    if (!record.category) {
      missing.push('category');
      issues.push('Missing category');
    }
    if (!record.district) {
      missing.push('district');
      issues.push('Missing district');
    }

    const hasCoords = Array.isArray(record.coordinates) && record.coordinates.length === 2;
    const isCoordValid = hasCoords && !isNaN(record.coordinates![0]) && !isNaN(record.coordinates![1]);
    const inKarnataka = isCoordValid ? this.isWithinKarnataka(record.coordinates!) : false;

    if (!hasCoords || !isCoordValid) {
      missing.push('coordinates');
      issues.push('Invalid or absent coordinates');
    } else if (!inKarnataka) {
      issues.push(
        `Coordinates [${record.coordinates![0]}, ${record.coordinates![1]}] fall outside Karnataka bounding box`
      );
    }

    let qualityScore = 100;
    qualityScore -= missing.length * 20;
    if (!inKarnataka) qualityScore -= 40;

    return {
      recordId: record.id,
      isCoordinateValid: isCoordValid,
      isWithinKarnatakaBoundingBox: inKarnataka,
      missingRequiredFields: missing,
      qualityScore: Math.max(0, qualityScore),
      issues,
    };
  }
}
