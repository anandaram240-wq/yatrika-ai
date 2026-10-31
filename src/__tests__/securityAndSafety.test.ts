import { describe, expect, it } from 'vitest';
import { SecurityPolicy } from '../security/securityPolicy';

describe('Phase 8: Responsible AI, Security & Privacy Guardrails', () => {
  it('1. Sanitizes user input and strips malicious script tags', () => {
    const malicious = '<script>alert("hack")</script>ಬೆಂಗಳೂರಿನಿಂದ ಮೈಸೂರಿಗೆ';
    const clean = SecurityPolicy.sanitizeInput(malicious);
    expect(clean).not.toContain('<script>');
    expect(clean).toContain('ಬೆಂಗಳೂರಿನಿಂದ ಮೈಸೂರಿಗೆ');
  });

  it('2. Enforces outbound domain whitelist for official portals', () => {
    expect(SecurityPolicy.isApprovedExternalDomain('https://ksrtc.in/oprs-web/')).toBe(true);
    expect(SecurityPolicy.isApprovedExternalDomain('https://asibengalurucircle.in/monuments')).toBe(true);
    expect(SecurityPolicy.isApprovedExternalDomain('https://phishing-travel-scam.com/book')).toBe(false);
  });

  it('3. AI Safety Guard rejects invented emergency codes and asserts statutory 112/108/1077/1926', () => {
    expect(SecurityPolicy.verifyStatutoryEmergencyCode('112')).toBe(true);
    expect(SecurityPolicy.verifyStatutoryEmergencyCode('108')).toBe(true);
    expect(SecurityPolicy.verifyStatutoryEmergencyCode('1077')).toBe(true);
    expect(SecurityPolicy.verifyStatutoryEmergencyCode('1926')).toBe(true);

    // AI must NEVER invent fake emergency lines
    expect(SecurityPolicy.verifyStatutoryEmergencyCode('911')).toBe(false);
    expect(SecurityPolicy.verifyStatutoryEmergencyCode('999')).toBe(false);
    expect(SecurityPolicy.verifyStatutoryEmergencyCode('12345')).toBe(false);
  });

  it('4. Privacy Guard detects and prevents leakage of sensitive personal credentials', () => {
    const safeData = {
      tripId: 'trip-01',
      destination: 'Hampi',
      days: 3,
    };
    expect(SecurityPolicy.assertNoSensitivePii(safeData).isSafe).toBe(true);

    const leakyData = {
      tripId: 'trip-02',
      travelerName: 'Ananda',
      bloodGroup: 'O+ve', // Sensitive PII
      aadhaarNumber: '1234-5678-9012',
    };
    const check = SecurityPolicy.assertNoSensitivePii(leakyData);
    expect(check.isSafe).toBe(false);
    expect(check.flaggedFields).toContain('bloodGroup');
    expect(check.flaggedFields).toContain('aadhaarNumber');
  });
});
