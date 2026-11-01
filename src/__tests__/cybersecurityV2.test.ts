/**
 * @file src/__tests__/cybersecurityV2.test.ts
 * @description Unit tests for Cybersecurity & Privacy V2 (STRIDE, DPDP, HTTPS Whitelist, Session Integrity).
 */

import { describe, it, expect } from 'vitest';
import { ThreatModelEvaluator, YATRIKA_THREAT_MODEL } from '../security/threatModel';
import { PrivacyAuditor } from '../security/privacyAudit';
import { ApiProtectionGuard } from '../security/apiProtection';
import { SessionIntegrityGuard } from '../security/sessionIntegrity';

describe('Cybersecurity & Privacy V2 (Phase 9)', () => {
  it('covers formal STRIDE threat categories with 100% verified mitigations in code', () => {
    const audit = ThreatModelEvaluator.auditThreatCoverage();
    expect(audit.totalThreats).toBeGreaterThanOrEqual(5);
    expect(audit.coveragePercent).toBe(100);
    expect(YATRIKA_THREAT_MODEL.some((t) => t.category === 'TAMPERING')).toBe(true);
    expect(YATRIKA_THREAT_MODEL.some((t) => t.category === 'DENIAL_OF_SERVICE')).toBe(true);
  });

  it('coarsens high-precision GPS to 3 decimals and rejects sensitive PII attributes', () => {
    // Exact GPS: 75.860123, 13.162789 (Belur)
    const coarsened = PrivacyAuditor.coarsenCoordinates([75.860123, 13.162789]);
    expect(coarsened[0]).toBe(75.86);
    expect(coarsened[1]).toBe(13.163);

    // Payload audit
    const safePayload = { tripOrigin: 'Bengaluru', favoritePois: ['poi-hampi'] };
    expect(PrivacyAuditor.auditDataPayload(safePayload).isCompliant).toBe(true);

    const violatingPayload = { tripOrigin: 'Bengaluru', aadhaar: '1234-5678-9012' };
    const auditRes = PrivacyAuditor.auditDataPayload(violatingPayload);
    expect(auditRes.isCompliant).toBe(false);
    expect(auditRes.violations[0]).toContain('aadhaar');
  });

  it('enforces strict HTTPS and outbound API domain whitelist', () => {
    // Valid HTTPS endpoints
    expect(ApiProtectionGuard.isUrlPermitted('https://api.open-meteo.com/v1/forecast')).toBe(true);
    expect(ApiProtectionGuard.isUrlPermitted('https://router.project-osrm.org/route/v1/driving')).toBe(true);

    // Invalid non-HTTPS or non-whitelisted endpoints
    expect(ApiProtectionGuard.isUrlPermitted('http://api.open-meteo.com/v1/forecast')).toBe(false); // Insecure HTTP
    expect(ApiProtectionGuard.isUrlPermitted('https://malicious-tracker.evil.com/leak')).toBe(false); // Unwhitelisted

    // Sanitization
    const sanitized = ApiProtectionGuard.sanitizeQueryParam("<script>alert('xss')</script>Belur");
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('Belur');
  });

  it('seals and verifies tamper-evident itinerary session envelopes', () => {
    const sessionData = { circuitId: 'circ-hoysala-heritage', stopsCount: 3 };
    const sealed = SessionIntegrityGuard.sealSession('session-test-01', sessionData);

    expect(sealed.signature).toBeDefined();
    expect(SessionIntegrityGuard.verifySession(sealed)).toBe(true);

    // Simulated tampering
    const tampered = { ...sealed, data: { circuitId: 'circ-hoysala-heritage', stopsCount: 99 } };
    expect(SessionIntegrityGuard.verifySession(tampered)).toBe(false);
  });
});
