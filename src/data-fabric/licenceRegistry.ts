/**
 * @file src/data-fabric/licenceRegistry.ts
 * @description Standardized data licensing registry for YatriKa AI V8.
 * Ensures every dataset, map tile, photograph, and timetable has clear legal usage provenance.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface MasterLicenseEntry {
  licenseId: string;
  name: string;
  shortCode: string;
  url: string;
  commercialUsePermitted: boolean;
  attributionRequired: boolean;
  shareAlikeRequired: boolean;
  canonicalAttributionStatement: string;
  legalEntity: string;
}

export const MASTER_LICENSE_REGISTRY: Record<string, MasterLicenseEntry> = {
  'ogd-india': {
    licenseId: 'ogd-india',
    name: 'National Data Sharing and Accessibility Policy (NDSAP) / Government of India Open Data License',
    shortCode: 'GODL-India',
    url: 'https://data.gov.in/sites/default/files/Gazette_Notification_OGDL.pdf',
    commercialUsePermitted: true,
    attributionRequired: true,
    shareAlikeRequired: false,
    canonicalAttributionStatement: 'Published by Government of Karnataka / Government of India under Open Government Data (OGD) License.',
    legalEntity: 'Government of Karnataka / National Informatics Centre (NIC)',
  },
  'asi-public-statutory': {
    licenseId: 'asi-public-statutory',
    name: 'Statutory Public Notice under Ancient Monuments and Archaeological Sites and Remains Act (AMASR 1958)',
    shortCode: 'ASI-AMASR',
    url: 'https://asi.nic.in/regulations-and-acts/',
    commercialUsePermitted: true,
    attributionRequired: true,
    shareAlikeRequired: false,
    canonicalAttributionStatement: 'Monument notification and statutory timings under Archaeological Survey of India (ASI).',
    legalEntity: 'Archaeological Survey of India, Ministry of Culture, GoI',
  },
  'cc-by-4.0': {
    licenseId: 'cc-by-4.0',
    name: 'Creative Commons Attribution 4.0 International',
    shortCode: 'CC-BY-4.0',
    url: 'https://creativecommons.org/licenses/by/4.0/',
    commercialUsePermitted: true,
    attributionRequired: true,
    shareAlikeRequired: false,
    canonicalAttributionStatement: 'Data licensed under Creative Commons Attribution 4.0 International.',
    legalEntity: 'Creative Commons / Original Publisher',
  },
  'cc-by-sa-4.0': {
    licenseId: 'cc-by-sa-4.0',
    name: 'Creative Commons Attribution-ShareAlike 4.0 International',
    shortCode: 'CC-BY-SA-4.0',
    url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    commercialUsePermitted: true,
    attributionRequired: true,
    shareAlikeRequired: true,
    canonicalAttributionStatement: 'Content licensed under CC BY-SA 4.0 from Wikimedia Commons / Wikipedia contributors.',
    legalEntity: 'Wikimedia Foundation',
  },
  'odbl-1.0': {
    licenseId: 'odbl-1.0',
    name: 'Open Database License 1.0',
    shortCode: 'ODbL-1.0',
    url: 'https://opendatacommons.org/licenses/odbl/1-0/',
    commercialUsePermitted: true,
    attributionRequired: true,
    shareAlikeRequired: true,
    canonicalAttributionStatement: '© OpenStreetMap contributors under ODbL.',
    legalEntity: 'OpenStreetMap Foundation (OSMF)',
  },
  'unsplash-license': {
    licenseId: 'unsplash-license',
    name: 'Unsplash Commercial-Friendly License',
    shortCode: 'Unsplash',
    url: 'https://unsplash.com/license',
    commercialUsePermitted: true,
    attributionRequired: false,
    shareAlikeRequired: false,
    canonicalAttributionStatement: 'Photography verified via Unsplash Verified Photography Collection.',
    legalEntity: 'Unsplash / Contributing Photographer',
  },
  'ksrtc-published-schedule': {
    licenseId: 'ksrtc-published-schedule',
    name: 'KSRTC Public Transit Passenger Information Terms',
    shortCode: 'KSRTC-Public',
    url: 'https://ksrtc.in/pages/terms-conditions',
    commercialUsePermitted: false,
    attributionRequired: true,
    shareAlikeRequired: false,
    canonicalAttributionStatement: 'Public bus schedules published by Karnataka State Road Transport Corporation (KSRTC). Ticket bookings via ksrtc.in.',
    legalEntity: 'Karnataka State Road Transport Corporation (KSRTC)',
  },
  'irctc-swr-passenger-info': {
    licenseId: 'irctc-swr-passenger-info',
    name: 'Indian Railways Public Passenger Information Feed',
    shortCode: 'IR-SWR',
    url: 'https://enquiry.indianrail.gov.in/',
    commercialUsePermitted: false,
    attributionRequired: true,
    shareAlikeRequired: false,
    canonicalAttributionStatement: 'Train schedules from South Western Railway (SWR) / National Train Enquiry System (NTES). Ticket bookings via IRCTC.',
    legalEntity: 'South Western Railway / CRIS Indian Railways',
  },
};

export function getMasterLicense(id: string): MasterLicenseEntry {
  return MASTER_LICENSE_REGISTRY[id] ?? MASTER_LICENSE_REGISTRY['ogd-india'];
}
