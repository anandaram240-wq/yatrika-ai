/**
 * @file src/release/featureFlags.ts
 * @description Dynamic feature flag toggles for gradual rollout and defensive kill-switches.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface YatrikaFeatureFlags {
  enableParetoOptimizer: boolean;
  enablePredictiveEta: boolean;
  enableLiveOperationsBadge: boolean;
  enableKannadaVoiceAgent: boolean;
  enableOfflineRoutePacks: boolean;
  enableStrictDpdpAnonymization: boolean;
}

export class FeatureFlagController {
  private static flags: YatrikaFeatureFlags = {
    enableParetoOptimizer: true,
    enablePredictiveEta: true,
    enableLiveOperationsBadge: true,
    enableKannadaVoiceAgent: true,
    enableOfflineRoutePacks: true,
    enableStrictDpdpAnonymization: true,
  };

  public static isEnabled(flagName: keyof YatrikaFeatureFlags): boolean {
    return this.flags[flagName] ?? false;
  }

  public static setFlag(flagName: keyof YatrikaFeatureFlags, enabled: boolean): void {
    this.flags[flagName] = enabled;
  }

  public static getAllFlags(): YatrikaFeatureFlags {
    return { ...this.flags };
  }
}
