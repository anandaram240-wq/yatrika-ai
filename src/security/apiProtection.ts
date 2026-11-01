/**
 * @file src/security/apiProtection.ts
 * @description Outbound API request validator, protocol enforcement, and domain whitelist auditor.
 * @theme Code. Create. Celebrate Kannada.
 */

export class ApiProtectionGuard {
  private static readonly ALLOWED_DOMAINS = [
    'api.open-meteo.com',
    'nominatim.openstreetmap.org',
    'router.project-osrm.org',
    'kstdc.co',
    'data.karnataka.gov.in',
    'swr.indianrailways.gov.in',
  ];

  public static isUrlPermitted(urlString: string): boolean {
    try {
      const url = new URL(urlString);
      if (url.protocol !== 'https:') return false; // Enforce strict HTTPS

      return this.ALLOWED_DOMAINS.some(
        (allowed) => url.hostname === allowed || url.hostname.endsWith(`.${allowed}`)
      );
    } catch {
      return false;
    }
  }

  public static sanitizeQueryParam(param: string): string {
    return param.replace(/[<>"'`;()&]/g, '').trim().substring(0, 100);
  }
}
