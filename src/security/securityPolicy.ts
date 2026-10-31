/**
 * @file src/security/securityPolicy.ts
 * @description Responsible AI policies, input sanitizer, and data minimization validator.
 * @theme Code. Create. Celebrate Kannada.
 */

export class SecurityPolicy {
  /**
   * Sanitizes user inputs against XSS and script injection.
   */
  public static sanitizeInput(input: string): string {
    return input
      .replace(/<[^>]*>/g, '') // Strip HTML tags
      .replace(/[javascript:|data:|vbscript:]/gi, '')
      .trim();
  }

  /**
   * Validates external outbound URLs to ensure they only connect to approved statutory portals.
   */
  public static isApprovedExternalDomain(urlStr: string): boolean {
    try {
      const parsed = new URL(urlStr);
      const allowedDomains = [
        'karnatakatourism.org',
        'ksrtc.in',
        'indianrail.gov.in',
        'irctc.co.in',
        'open-meteo.com',
        'mausam.imd.gov.in',
        'asibengalurucircle.in',
        'kpwd.karnataka.gov.in',
        'ksdma.karnataka.gov.in',
        'wikimedia.org',
        'wikipedia.org',
      ];
      return allowedDomains.some((d) => parsed.hostname === d || parsed.hostname.endsWith(`.${d}`));
    } catch {
      return false;
    }
  }

  /**
   * AI Safety Guard: Asserts that an emergency telephone number belongs strictly to
   * the verified statutory emergency list (112, 108, 1077, 1926).
   */
  public static verifyStatutoryEmergencyCode(code: string): boolean {
    const verifiedCodes = new Set(['112', '108', '1077', '1926']);
    return verifiedCodes.has(code.trim());
  }

  /**
   * Privacy Guard: Validates that an object does not contain unauthorized personal telemetry.
   */
  public static assertNoSensitivePii(data: Record<string, unknown>): { isSafe: boolean; flaggedFields: string[] } {
    const forbiddenKeys = ['bloodGroup', 'password', 'aadhaar', 'panNumber', 'privateKey', 'creditCard'];
    const flagged: string[] = [];

    const inspect = (obj: Record<string, unknown>) => {
      for (const [k, v] of Object.entries(obj)) {
        if (forbiddenKeys.some((fk) => k.toLowerCase().includes(fk.toLowerCase()))) {
          flagged.push(k);
        }
        if (v && typeof v === 'object' && !Array.isArray(v)) {
          inspect(v as Record<string, unknown>);
        }
      }
    };

    inspect(data);
    return {
      isSafe: flagged.length === 0,
      flaggedFields: flagged,
    };
  }
}
