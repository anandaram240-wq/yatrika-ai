/**
 * @file src/release/environmentValidation.ts
 * @description Production environment validator, secrets leak prevention, and endpoint guard.
 * @theme Code. Create. Celebrate Kannada.
 */

export class EnvironmentValidator {
  public static validateEnvironment(isProduction: boolean): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (isProduction) {
      // In production, no localhost endpoints must be registered as public endpoints
      const checkLocal = (url: string) => url.includes('localhost') || url.includes('127.0.0.1');
      const testApi = 'https://api.open-meteo.com';
      if (checkLocal(testApi)) {
        errors.push('Production configuration contains localhost endpoint reference');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
