/**
 * @file src/offline/offlineReadiness.ts
 * @description Computes verified Offline Readiness Score based on actual locally cached travel assets.
 * Refuses to report 100% readiness when only the HTML/JS application shell is cached.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface CachedAssetCheck {
  hasAppShellCached: boolean;
  hasRouteGeometryCached: boolean;
  hasDestinationMetadataCached: boolean;
  hasNavigationStepsCached: boolean;
  hasEmergencyDirectoryCached: boolean;
  hasElevationProfileCached: boolean;
  hasDialectPhrasesCached: boolean;
}

export interface OfflineReadinessReport {
  readinessScore: number; // 0 to 100%
  isReadyForDisconnectedGhatTravel: boolean;
  missingCrucialAssets: string[];
  breakdown: Record<keyof CachedAssetCheck, number>;
  guidanceKannada: string;
  guidanceEnglish: string;
}

export class OfflineReadinessCalculator {
  public static calculateScore(assets: CachedAssetCheck): OfflineReadinessReport {
    const missing: string[] = [];

    // Weights strictly reflecting real field requirements in disconnected Western Ghats
    const weights: Record<keyof CachedAssetCheck, number> = {
      hasAppShellCached: 10,
      hasRouteGeometryCached: 25,
      hasDestinationMetadataCached: 20,
      hasNavigationStepsCached: 15,
      hasEmergencyDirectoryCached: 15,
      hasElevationProfileCached: 10,
      hasDialectPhrasesCached: 5,
    };

    let score = 0;
    const breakdown: Record<keyof CachedAssetCheck, number> = {
      hasAppShellCached: 0,
      hasRouteGeometryCached: 0,
      hasDestinationMetadataCached: 0,
      hasNavigationStepsCached: 0,
      hasEmergencyDirectoryCached: 0,
      hasElevationProfileCached: 0,
      hasDialectPhrasesCached: 0,
    };

    (Object.keys(weights) as Array<keyof CachedAssetCheck>).forEach((key) => {
      if (assets[key]) {
        score += weights[key];
        breakdown[key] = weights[key];
      } else {
        missing.push(key);
      }
    });

    const isReady = score >= 85 && assets.hasRouteGeometryCached && assets.hasEmergencyDirectoryCached;

    let guidanceEn = 'Offline readiness is incomplete. Download the offline circuit pack before entering the ghat.';
    let guidanceKn = 'ಆಫ್‌ಲೈನ್ ಸಿದ್ಧತೆ ಅಪೂರ್ಣವಾಗಿದೆ. ಘಾಟಿ ಪ್ರವೇಶಿಸುವ ಮುನ್ನ ಆಫ್‌ಲೈನ್ ರೂಟ್ ಪ್ಯಾಕ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.';

    if (isReady) {
      guidanceEn = 'Fully ready for disconnected ghat travel. Route, emergency directory, and destinations cached locally.';
      guidanceKn = 'ಸಂಪರ್ಕರಹಿತ ಘಾಟಿ ಪ್ರಯಾಣಕ್ಕೆ ಸಂಪೂರ್ಣ ಸಿದ್ಧವಾಗಿದೆ. ಮಾರ್ಗ, ತುರ್ತು ಡೈರೆಕ್ಟರಿ ಮತ್ತು ತಾಣಗಳು ಉಳಿಸಲಾಗಿದೆ.';
    }

    return {
      readinessScore: score,
      isReadyForDisconnectedGhatTravel: isReady,
      missingCrucialAssets: missing,
      breakdown,
      guidanceEnglish: guidanceEn,
      guidanceKannada: guidanceKn,
    };
  }
}
