/**
 * @file src/data/destinations/destinationSources.ts
 * @description Authoritative source mapping for Karnataka Destinations.
 * @theme Code. Create. Celebrate Kannada.
 */

import { SourceTrustClassification } from '../../data-fabric/verificationStatus';

export interface DestinationSourceRef {
  sourceId: string;
  organization: string;
  organizationKannada: string;
  sourceUrl: string;
  trustClassification: SourceTrustClassification;
  citationNotice: string;
  lastAuditedDate: string;
}

export const CANONICAL_DESTINATION_SOURCES: Record<string, DestinationSourceRef> = {
  asi_monuments: {
    sourceId: 'src-asi-monuments',
    organization: 'Archaeological Survey of India (ASI)',
    organizationKannada: 'ಭಾರತೀಯ ಪುರಾತತ್ವ ಸರ್ವೇಕ್ಷಣಾ ಇಲಾಖೆ',
    sourceUrl: 'https://asibengalurucircle.in/',
    trustClassification: 'OFFICIAL_PUBLISHED',
    citationNotice: 'Statutory timings and ticketing under Ancient Monuments and Archaeological Sites and Remains Act 1958.',
    lastAuditedDate: '2026-10-28',
  },
  unesco_world_heritage: {
    sourceId: 'src-unesco-whc',
    organization: 'UNESCO World Heritage Centre',
    organizationKannada: 'ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪರಂಪರೆ ಸಮಿತಿ',
    sourceUrl: 'https://whc.unesco.org/en/statesparties/in',
    trustClassification: 'OFFICIAL_PUBLISHED',
    citationNotice: 'Inscribed UNESCO World Heritage Site dossier (Hampi ref 241, Pattadakal ref 368, Hoysala Sacred Ensembles ref 1670).',
    lastAuditedDate: '2026-10-15',
  },
  karnataka_tourism: {
    sourceId: 'src-karnataka-tourism',
    organization: 'Department of Tourism, Government of Karnataka',
    organizationKannada: 'ಪ್ರವಾಸೋದ್ಯಮ ಇಲಾಖೆ, ಕರ್ನಾಟಕ ಸರ್ಕಾರ',
    sourceUrl: 'https://karnatakatourism.org/',
    trustClassification: 'OFFICIAL_PUBLISHED',
    citationNotice: 'Official tourist destination handbook published by Government of Karnataka.',
    lastAuditedDate: '2026-10-31',
  },
  karnataka_forest: {
    sourceId: 'src-forest-dept',
    organization: 'Karnataka Forest Department (Eco-Tourism Development Board / MyEcoTrip)',
    organizationKannada: 'ಕರ್ನಾಟಕ ಅರಣ್ಯ ಇಲಾಖೆ (ಮೈ ಇಕೋ ಟ್ರಿಪ್)',
    sourceUrl: 'https://myecotrip.com/',
    trustClassification: 'OFFICIAL_PUBLISHED',
    citationNotice: 'Official trekking permits, daily slot limits, and wildlife sanctuary access regulations.',
    lastAuditedDate: '2026-10-30',
  },
  district_administration: {
    sourceId: 'src-district-admin',
    organization: 'District Administration & District Tourism Development Council',
    organizationKannada: 'ಜಿಲ್ಲಾಡಳಿತ ಹಾಗೂ ಜಿಲ್ಲಾ ಪ್ರವಾಸೋದ್ಯಮ ಅಭಿವೃದ್ಧಿ ಮಂಡಳಿ',
    sourceUrl: 'https://karnataka.gov.in/',
    trustClassification: 'GOVERNMENT_REGISTERED',
    citationNotice: 'District gazetteer and certified local administration tourist registry.',
    lastAuditedDate: '2026-10-25',
  },
  muzrai_department: {
    sourceId: 'src-muzrai-dept',
    organization: 'Hindu Religious Institutions & Charitable Endowments (Muzrai) Department, GoK',
    organizationKannada: 'ಧಾರ್ಮಿಕ ದತ್ತಿ ಇಲಾಖೆ (ಮುಜರಾಯಿ), ಕರ್ನಾಟಕ ಸರ್ಕಾರ',
    sourceUrl: 'https://karnataka.gov.in/muzrai',
    trustClassification: 'OFFICIAL_PUBLISHED',
    citationNotice: 'Official temple pooja schedules, darshana timings, and Annadana seva records.',
    lastAuditedDate: '2026-10-20',
  },
};
