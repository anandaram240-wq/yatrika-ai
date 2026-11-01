/**
 * @file src/geo/geoUncertainty.ts
 * @description Evidence-driven road status & hazard uncertainty classifier for Karnataka mountain corridors.
 * Strictly separates weather conditions from confirmed official closures.
 * @theme Code. Create. Celebrate Kannada.
 */

export type RoadStatusConfidence = 'CONFIRMED_OFFICIAL' | 'REPORTED_UNVERIFIED' | 'WEATHER_INFERRED_RISK' | 'UNKNOWN';

export interface GhatHazardEvidence {
  passName: 'Shiradi' | 'Charmadi' | 'Agumbe' | 'Bisle' | 'Sampaje';
  highwayCode: string;
  historicalRainfallPattern: {
    annualMonsoonMm: number;
    highestRiskMonths: number[]; // e.g. [6, 7, 8]
  };
  currentPrecipitationMm: number;
  forecastPrecipitationMm: number;
  officialPwdAdvisory?: {
    issuingAuthority: string; // e.g. "Karnataka PWD Hassan Division"
    bulletinNumber: string;
    restrictionType: 'OPEN' | 'ONE_WAY' | 'HEAVY_VEHICLES_BANNED' | 'NIGHT_RESTRICTION' | 'FULLY_CLOSED';
    effectiveUntil: string;
  };
  reportedIncident?: {
    incidentType: 'LANDSLIDE' | 'TREE_FALL' | 'WATERLOGGING' | 'CULVERT_REPAIR';
    locationDescription: string;
    reportedTimestamp: string;
    verifiedByLocalPolice: boolean;
  };
  confidence: RoadStatusConfidence;
}

export class GeoUncertaintyClassifier {
  /**
   * Classify road corridor status strictly distinguishing weather risk from official closure.
   * NEVER infers an official closure from heavy rain alone.
   */
  public static evaluatePassStatus(evidence: GhatHazardEvidence): {
    isPassPhysicallyOpen: boolean;
    travelRecommendation: 'PROCEED_NORMAL' | 'PROCEED_WITH_CAUTION' | 'DIVERT_VIA_ALTERNATIVE' | 'DO_NOT_TRAVEL';
    explanationEnglish: string;
    explanationKannada: string;
  } {
    // 1. Official closure takes absolute precedence
    if (evidence.officialPwdAdvisory?.restrictionType === 'FULLY_CLOSED') {
      return {
        isPassPhysicallyOpen: false,
        travelRecommendation: 'DO_NOT_TRAVEL',
        explanationEnglish: `Confirmed Official Closure: ${evidence.passName} Ghat (${evidence.highwayCode}) is closed by ${evidence.officialPwdAdvisory.issuingAuthority}. Divert via alternative route.`,
        explanationKannada: `ಅಧಿಕೃತ ಆದೇಶ: ${evidence.passName} ಘಾಟಿ ಸಂಪೂರ್ಣ ಬಂದ್ ಆಗಿದೆ (${evidence.officialPwdAdvisory.issuingAuthority}). ಪರ್ಯಾಯ ಮಾರ್ಗ ಬಳಸಿ.`,
      };
    }

    // 2. Active verified landslide blocking road
    if (evidence.reportedIncident?.incidentType === 'LANDSLIDE' && evidence.reportedIncident.verifiedByLocalPolice) {
      return {
        isPassPhysicallyOpen: false,
        travelRecommendation: 'DIVERT_VIA_ALTERNATIVE',
        explanationEnglish: `Road Blocked: Landslide reported at ${evidence.reportedIncident.locationDescription} verified by local police. Clearance in progress.`,
        explanationKannada: `ರಸ್ತೆ ಸಂಚಾರ ಸ್ಥಗಿತ: ${evidence.reportedIncident.locationDescription} ಬಳಿ ಭೂಕುಸಿತ ಸಂಭವಿಸಿದೆ. ತೆರವು ಕಾರ್ಯ ಪ್ರಗತಿಯಲ್ಲಿದೆ.`,
      };
    }

    // 3. Official partial restriction (One-way or night ban)
    if (evidence.officialPwdAdvisory && evidence.officialPwdAdvisory.restrictionType !== 'OPEN') {
      return {
        isPassPhysicallyOpen: true,
        travelRecommendation: 'PROCEED_WITH_CAUTION',
        explanationEnglish: `Official Restriction: ${evidence.officialPwdAdvisory.restrictionType} on ${evidence.passName} Ghat per ${evidence.officialPwdAdvisory.issuingAuthority}.`,
        explanationKannada: `ಅಧಿಕೃತ ನಿರ್ಬಂಧ: ${evidence.passName} ಘಾಟಿಯಲ್ಲಿ ನಿಯಂತ್ರಿತ ಸಂಚಾರ (${evidence.officialPwdAdvisory.issuingAuthority}). ಎಚ್ಚರಿಕೆಯಿಂದ ಚಲಿಸಿ.`,
      };
    }

    // 4. Heavy weather risk (Road is OPEN, but high caution needed. NEVER mark closed.)
    if (evidence.currentPrecipitationMm > 40 || evidence.forecastPrecipitationMm > 60) {
      return {
        isPassPhysicallyOpen: true,
        travelRecommendation: 'PROCEED_WITH_CAUTION',
        explanationEnglish: `Pass is OPEN with Weather Advisory: Heavy rainfall (${evidence.currentPrecipitationMm}mm). Maintain low speed and avoid shoulder overtaking.`,
        explanationKannada: `ರಸ್ತೆ ಮುಕ್ತವಾಗಿದೆ, ಆದರೆ ಅಧಿಕ ಮಳೆ ಎಚ್ಚರಿಕೆ (${evidence.currentPrecipitationMm}mm). ನಿಧಾನವಾಗಿ, ಎಚ್ಚರಿಕೆಯಿಂದ ಚಲಿಸಿ.`,
      };
    }

    return {
      isPassPhysicallyOpen: true,
      travelRecommendation: 'PROCEED_NORMAL',
      explanationEnglish: `${evidence.passName} Ghat corridor clear with normal traffic flow.`,
      explanationKannada: `${evidence.passName} ಘಾಟಿ ಮಾರ್ಗದಲ್ಲಿ ಸಂಚಾರ ಸಹಜವಾಗಿದೆ.`,
    };
  }
}
