/**
 * @file src/__tests__/personalization.test.ts
 * @description Unit tests for Consent-Based Personalization & Explainable Recommendations.
 */

import { describe, it, expect } from 'vitest';
import { TravelProfileManager } from '../personalization/travelProfile';
import { PreferenceInferenceEngine } from '../personalization/preferenceInference';
import { PersonalizationRecommendationEngine } from '../personalization/recommendationEngine';
import { KARNATAKA_POIS } from '../data/karnatakaTravelRegistry';

describe('Personalized Travel Intelligence (Phase 7)', () => {
  it('manages traveler profiles with explicit opt-in and total deletion control', () => {
    const manager = new TravelProfileManager();

    // 1. User without consent is not persisted in storage
    const ephemeral = manager.createProfile({
      userId: 'user-no-consent',
      hasConsentedToStorage: false,
    });
    expect(ephemeral.hasConsentedToStorage).toBe(false);
    expect(manager.getProfile('user-no-consent')).toBeUndefined();

    // 2. User with consent is persisted
    manager.createProfile({
      userId: 'user-consent-123',
      hasConsentedToStorage: true,
      interests: { heritage_archaeology: 0.95 },
    });
    expect(manager.getProfile('user-consent-123')).toBeDefined();
    expect(manager.getProfile('user-consent-123')?.interests.heritage_archaeology).toBe(0.95);

    // 3. User requests profile deletion
    const deleted = manager.deleteProfile('user-consent-123');
    expect(deleted).toBe(true);
    expect(manager.getProfile('user-consent-123')).toBeUndefined();
  });

  it('transparently updates interest weights from interaction without demographic profiling', () => {
    const initialInterests = {
      heritage_archaeology: 0.4,
      nature_trekking: 0.3,
      spiritual_temple: 0.5,
      family_leisure: 0.5,
      adventure_wildlife: 0.3,
      culinary_dialect: 0.5,
      budget_conscious: 0.5,
      wheelchair_accessible: 0.0,
    };

    const updated = PreferenceInferenceEngine.inferFromInteraction(initialInterests, 'heritage');
    expect(updated.heritage_archaeology).toBe(0.55);
    expect(updated.spiritual_temple).toBe(0.5); // Unchanged
  });

  it('ranks destinations transparently and produces bilingual explanations', () => {
    const profile = new TravelProfileManager().createProfile({
      userId: 'traveler-heritage-lover',
      hasConsentedToStorage: false,
      interests: { heritage_archaeology: 0.95, nature_trekking: 0.2 },
    });

    const samplePois = KARNATAKA_POIS.slice(0, 10);
    const recommendations = PersonalizationRecommendationEngine.rankDestinations(samplePois, profile);

    expect(recommendations.length).toBe(10);
    expect(recommendations[0].totalScore).toBeGreaterThanOrEqual(recommendations[9].totalScore);
    expect(recommendations[0].explanationEnglish).toContain('Recommended because you have high interest in');
    expect(recommendations[0].explanationKannada).toContain('ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ');
  });
});
