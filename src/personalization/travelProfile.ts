/**
 * @file src/personalization/travelProfile.ts
 * @description Consent-based traveler preference profile manager for YatriKa AI V4.
 * Enforces strict user opt-in, clear inspection, and zero retention upon deletion.
 * @theme Code. Create. Celebrate Kannada.
 */

export type TravelInterestCategory =
  | 'heritage_archaeology'
  | 'nature_trekking'
  | 'spiritual_temple'
  | 'family_leisure'
  | 'adventure_wildlife'
  | 'culinary_dialect'
  | 'budget_conscious'
  | 'wheelchair_accessible';

export interface TravelerProfile {
  userId: string;
  hasConsentedToStorage: boolean;
  interests: Record<TravelInterestCategory, number>; // Weights from 0.0 to 1.0
  preferredTransport: 'KSRTC_BUS' | 'SWR_TRAIN' | 'PERSONAL_CAR' | 'METRO_PUBLIC';
  shaktiSchemeEligible: boolean;
  maxDailyBudgetInr?: number;
  accessibilityRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export class TravelProfileManager {
  private inMemoryStore = new Map<string, TravelerProfile>();

  public createProfile(params: {
    userId: string;
    hasConsentedToStorage: boolean;
    interests?: Partial<Record<TravelInterestCategory, number>>;
    preferredTransport?: TravelerProfile['preferredTransport'];
    shaktiSchemeEligible?: boolean;
    maxDailyBudgetInr?: number;
    accessibilityRequired?: boolean;
  }): TravelerProfile {
    const defaultInterests: Record<TravelInterestCategory, number> = {
      heritage_archaeology: 0.5,
      nature_trekking: 0.5,
      spiritual_temple: 0.5,
      family_leisure: 0.5,
      adventure_wildlife: 0.5,
      culinary_dialect: 0.5,
      budget_conscious: 0.5,
      wheelchair_accessible: 0.0,
    };

    const profile: TravelerProfile = {
      userId: params.userId,
      hasConsentedToStorage: params.hasConsentedToStorage,
      interests: { ...defaultInterests, ...(params.interests ?? {}) },
      preferredTransport: params.preferredTransport ?? 'KSRTC_BUS',
      shaktiSchemeEligible: params.shaktiSchemeEligible ?? false,
      maxDailyBudgetInr: params.maxDailyBudgetInr ?? 2500,
      accessibilityRequired: params.accessibilityRequired ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (params.hasConsentedToStorage) {
      this.inMemoryStore.set(params.userId, profile);
    }

    return profile;
  }

  public getProfile(userId: string): TravelerProfile | undefined {
    return this.inMemoryStore.get(userId);
  }

  public deleteProfile(userId: string): boolean {
    return this.inMemoryStore.delete(userId);
  }
}
