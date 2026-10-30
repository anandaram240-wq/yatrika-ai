/**
 * src/data/provenance/dataProvenanceRegistry.ts
 * Verified Government & Official Data Provenance Registry for YatriKa AI.
 * Section 10: Real-World Data Integrity Engine.
 */

export interface SourceProvenanceItem {
  sourceName: string;
  sourceUrl: string;
  governingBody: string;
  verificationStatus: 'verified' | 'partially_verified' | 'unverified';
  retrievedAt: string;
  verifiedAt: string;
  validUntil: string;
  coverageScope: string;
  officialOrderRef?: string;
  keyCitations: string[];
}

export const VERIFIED_DATA_PROVENANCE_REGISTRY: Record<string, SourceProvenanceItem> = {
  asi_heritage_tickets: {
    sourceName: 'Archaeological Survey of India (ASI) E-Ticketing Portal',
    sourceUrl: 'https://asi.nic.in / https://asi.payumoney.com',
    governingBody: 'Ministry of Culture, Government of India & ASI Bengaluru/Hampi Circles',
    verificationStatus: 'verified',
    retrievedAt: '2026-01-15T00:00:00Z',
    verifiedAt: '2026-10-25T00:00:00Z',
    validUntil: '2026-12-31T23:59:59Z',
    coverageScope: 'Hampi Monuments (Vittala Temple, Zenana Enclosure), Pattadakal Temple Complex',
    keyCitations: [
      '₹40 for Indian/SAARC/BIMSTEC citizens paying cashless/online; ₹50 cash at physical counter.',
      '₹600 for foreign tourists (Cashless online rate; ₹650 cash rate).',
      'Free entry for children below 15 years of age across all ASI protected monuments.',
    ],
  },

  kstdc_state_tourism: {
    sourceName: 'Karnataka State Tourism Development Corporation (KSTDC)',
    sourceUrl: 'https://kstdc.co / https://karnatakatourism.org',
    governingBody: 'Department of Tourism, Government of Karnataka',
    verificationStatus: 'verified',
    retrievedAt: '2026-02-01T00:00:00Z',
    verifiedAt: '2026-10-26T00:00:00Z',
    validUntil: '2026-12-31T23:59:59Z',
    coverageScope: 'Mysuru Ambavilas Palace, Belur Chennakeshava, Halebidu, Jog Falls view decks',
    keyCitations: [
      'Mysuru Palace Adult entry: ₹100, Children (10-18): ₹50, Below 10: Free.',
      'Audio guide included with physical security check at Varaha Gate.',
      'Sunday & State Holiday Illumination: 07:00 PM – 07:45 PM (Free public view from external lawns).',
    ],
  },

  karnataka_forest_department: {
    sourceName: 'Aranya Vihaara & Karnataka Forest Department Eco-Tourism Portal',
    sourceUrl: 'https://aranyavihaara.karnataka.gov.in',
    governingBody: 'Karnataka Forest Department (KFD) & Karnataka Ecotourism Development Board (KEDB)',
    verificationStatus: 'verified',
    retrievedAt: '2026-03-01T00:00:00Z',
    verifiedAt: '2026-10-27T00:00:00Z',
    validUntil: '2026-12-31T23:59:59Z',
    coverageScope: 'Mullayanagiri, Kudremukh National Park, Bandipur Safari, Nagarhole (Kabini)',
    officialOrderRef: 'KFD Order No. FE/WL/Eco/2024-25',
    keyCitations: [
      'Kaimara Checkpost entry fee for Mullayanagiri ghat road: ₹50 per vehicle eco-cess.',
      'Kudremukh trek mandatory daily quota: 50 permits/day via Aranya Vihaara only (₹600 permit fee).',
      'Plastics and non-biodegradable food containers banned in Shola reserve boundaries.',
    ],
  },

  shakti_scheme_ksrtc: {
    sourceName: 'Government of Karnataka Transport Department Shakti Scheme Order',
    sourceUrl: 'https://transport.karnataka.gov.in / https://ksrtc.in/shakti',
    governingBody: 'Transport Department, Government of Karnataka',
    verificationStatus: 'verified',
    retrievedAt: '2026-01-10T00:00:00Z',
    verifiedAt: '2026-10-28T00:00:00Z',
    validUntil: 'Indefinite (Standing Government Scheme)',
    coverageScope: 'All 4 State Transport Undertakings: KSRTC, BMTC, NWKRTC, KKRTC',
    officialOrderRef: 'Government Order No. TRAN 38 TEP 2023, Dated 11-06-2023',
    keyCitations: [
      'All women domicile to Karnataka (and traveling within state borders) travel at ₹0 zero fare in Ordinary and Karnataka Sarige services.',
      'Presentation of government-issued photo ID showing Karnataka residence (Aadhaar, Voter ID, Driving Licence) required.',
      'Premium services (Airawat Club Class, Ambari Dream Class, Flybus, EV Power Plus) are strictly exempted (regular fares apply).',
    ],
  },
};
