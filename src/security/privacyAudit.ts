/**
 * @file src/security/privacyAudit.ts
 * @description Privacy compliance auditor for India Digital Personal Data Protection (DPDP) Act 2023.
 * Enforces coordinate coarsening (~100m) and zero third-party telemetry leakage.
 * @theme Code. Create. Celebrate Kannada.
 */

export class PrivacyAuditor {
  /**
   * Coarsens precise user GPS coordinates to 3 decimal places (~110 meters) to protect privacy.
   */
  public static coarsenCoordinates(coords: [number, number]): [number, number] {
    return [
      Math.round(coords[0] * 1000) / 1000,
      Math.round(coords[1] * 1000) / 1000,
    ];
  }

  /**
   * Scans an object to ensure no unauthorized tracking or personally identifiable fields are present.
   */
  public static auditDataPayload(payload: Record<string, unknown>): { isCompliant: boolean; violations: string[] } {
    const forbiddenKeys = ['aadhaar', 'pan', 'phonenumber', 'email', 'imei', 'advertisingid'];
    const violations: string[] = [];

    Object.keys(payload).forEach((k) => {
      const lower = k.toLowerCase().replace(/[^a-z]/g, '');
      if (forbiddenKeys.includes(lower)) {
        violations.push(`Forbidden PII key detected: ${k}`);
      }
    });

    return {
      isCompliant: violations.length === 0,
      violations,
    };
  }
}
