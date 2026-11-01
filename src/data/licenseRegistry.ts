/**
 * @file src/data/licenseRegistry.ts
 * @description Open Data licensing, copyright, and source attribution registry for YatriKa AI V4.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface LicenseEntry {
  licenseId: string;
  name: string;
  shortCode: string;
  url: string;
  attributionRequired: boolean;
  commercialUseAllowed: boolean;
  shareAlikeRequired: boolean;
  attributionTextKannada: string;
  attributionTextEnglish: string;
}

export const DATA_LICENSE_REGISTRY: Record<string, LicenseEntry> = {
  'odbl-1.0': {
    licenseId: 'odbl-1.0',
    name: 'Open Database License (ODbL) 1.0',
    shortCode: 'ODbL',
    url: 'https://opendatacommons.org/licenses/odbl/1.0/',
    attributionRequired: true,
    commercialUseAllowed: true,
    shareAlikeRequired: true,
    attributionTextKannada: '© ಓಪನ್‌ಸ್ಟ್ರೀಟ್‌ಮ್ಯಾಪ್ ಕೊಡುಗೆದಾರರು (ODbL)',
    attributionTextEnglish: '© OpenStreetMap contributors under ODbL 1.0',
  },
  'cc-by-4.0': {
    licenseId: 'cc-by-4.0',
    name: 'Creative Commons Attribution 4.0 International',
    shortCode: 'CC-BY-4.0',
    url: 'https://creativecommons.org/licenses/by/4.0/',
    attributionRequired: true,
    commercialUseAllowed: true,
    shareAlikeRequired: false,
    attributionTextKannada: 'ಮುಕ್ತ ಹವಾಮಾನ ದತ್ತಾಂಶ: ಓಪನ್-ಮೆಟಿಯೋ (CC-BY 4.0)',
    attributionTextEnglish: 'Weather forecast data courtesy of Open-Meteo under CC-BY 4.0',
  },
  'gok-open-data': {
    licenseId: 'gok-open-data',
    name: 'Government of Karnataka Open Data Initiative',
    shortCode: 'GoK-ODL',
    url: 'https://data.karnataka.gov.in/',
    attributionRequired: true,
    commercialUseAllowed: true,
    shareAlikeRequired: false,
    attributionTextKannada: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಪ್ರವಾಸೋದ್ಯಮ ಮತ್ತು ಸಾರಿಗೆ ದತ್ತಾಂಶ',
    attributionTextEnglish: 'Department of Tourism, Government of Karnataka official records',
  },
  'indian-railways-public': {
    licenseId: 'indian-railways-public',
    name: 'South Western Railway Public Passenger Timetable',
    shortCode: 'SWR-PUB',
    url: 'https://swr.indianrailways.gov.in/',
    attributionRequired: true,
    commercialUseAllowed: false,
    shareAlikeRequired: false,
    attributionTextKannada: 'ನೈಋತ್ಯ ರೈಲ್ವೆ (SWR) ಸಾರ್ವಜನಿಕ ವೇಳಾಪಟ್ಟಿ ಸೂಚ್ಯಂಕ',
    attributionTextEnglish: 'South Western Railway Public Timetable Index',
  },
};
