/**
 * @file src/offline/emergencyCoordinator.ts
 * @description Privacy-preserving emergency directory and offline SOS packet generator.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface StatutoryEmergencyService {
  serviceCode: string;
  serviceName: string;
  nameKannada: string;
  telephoneNumber: string;
  mandateScope: string;
  operatingAgency: string;
}

export const OFFICIAL_KARNATAKA_EMERGENCY_SERVICES: StatutoryEmergencyService[] = [
  {
    serviceCode: '112',
    serviceName: 'Karnataka State Police Emergency Response Support System (ERSS)',
    nameKannada: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ತುರ್ತು ಸಹಾಯವಾಣಿ',
    telephoneNumber: 'tel:112',
    mandateScope: 'Unified 24/7 Police, Highway Patrol, and Fire Dispatch across all 31 districts',
    operatingAgency: 'Karnataka State Police',
  },
  {
    serviceCode: '108',
    serviceName: 'Arogya Kavacha Emergency Medical Ambulance',
    nameKannada: 'ಆರೋಗ್ಯ ಕವಚ ಆಂಬ್ಯುಲೆನ್ಸ್',
    telephoneNumber: 'tel:108',
    mandateScope: 'Free 24/7 trauma care, accident evacuation, and hospital transit',
    operatingAgency: 'Department of Health & Family Welfare, Govt. of Karnataka',
  },
  {
    serviceCode: '1077',
    serviceName: 'District Disaster Management Authority (DDMA)',
    nameKannada: 'ಜಿಲ್ಲಾ ವಿಪತ್ತು ನಿರ್ವಹಣಾ ಪ್ರಾಧಿಕಾರ',
    telephoneNumber: 'tel:1077',
    mandateScope: 'Floods, ghat landslides, flash-floods, and road blockages reporting',
    operatingAgency: 'Karnataka State Disaster Management Authority (KSDMA)',
  },
  {
    serviceCode: '1926',
    serviceName: 'Karnataka Forest Department Wildlife & Trekker Rescue',
    nameKannada: 'ಅರಣ್ಯ ಇಲಾಖೆ ವನ್ಯಜೀವಿ ಹಾಗೂ ಟ್ರೆಕ್ಕಿಂಗ್ ರಕ್ಷಣೆ',
    telephoneNumber: 'tel:1926',
    mandateScope: 'Lost trekkers in Western Ghats, animal encounters, and reserve forest distress',
    operatingAgency: 'Karnataka Forest Department',
  },
];

export interface PrivacyPreservingSosPayload {
  itineraryId: string;
  originHub: string;
  currentDestination: string;
  lastKnownCoordinates?: [number, number];
  generatedTimestamp: string;
  emergencyDisclaimer: string;
}

export class EmergencyCoordinator {
  /**
   * Generates a privacy-preserving offline SOS data payload.
   * SECURITY RULE: Never embeds blood group, passwords, Aadhaar, or private keys.
   */
  public static createPrivacySafeSosPayload(params: {
    itineraryId: string;
    originHub: string;
    currentDestination: string;
    coordinates?: [number, number];
  }): PrivacyPreservingSosPayload {
    return {
      itineraryId: params.itineraryId,
      originHub: params.originHub,
      currentDestination: params.currentDestination,
      lastKnownCoordinates: params.coordinates,
      generatedTimestamp: new Date().toISOString(),
      emergencyDisclaimer:
        'This offline emergency card provides verified statutory numbers. Voice calls require cellular signal; offline QR displays travel itinerary for emergency first responders.',
    };
  }

  public static getOfficialServices(): StatutoryEmergencyService[] {
    return [...OFFICIAL_KARNATAKA_EMERGENCY_SERVICES];
  }
}
