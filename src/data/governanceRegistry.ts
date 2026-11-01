/**
 * @file src/data/governanceRegistry.ts
 * @description Attributed government regulatory & temporal constraint registry for Karnataka tourism.
 * @theme Code. Create. Celebrate Kannada.
 * @compliance Official issuing authorities, gazette notifications, forest orders, and Muzrai schedules.
 */

export interface TemporalGovernanceRecord {
  poiId: string;
  name: string;
  nameKannada: string;
  issuingAuthority: string;
  documentIdentifier: string;
  publicationDate: string;
  effectiveDate: string;
  lastVerificationDate: string;
  geographicApplicability: string;
  updateFrequency: 'DAILY_REGULATED' | 'SEASONAL_PWD_BULLETIN' | 'ANNUAL_GAZETTE';
  verificationStatus: 'OFFICIALLY_VERIFIED' | 'ADVISORY_CONDITIONAL' | 'UNVERIFIED_PENDING_CONFIRMATION';
  schedule: {
    opens: string;
    closes: string;
    recessStart?: string;
    recessEnd?: string;
    recessDetailsKannada?: string;
    recessDetailsEnglish?: string;
  };
  authorityContactUrl: string;
  verificationAdvice: string;
}

export const TEMPORAL_GOVERNANCE_REGISTRY: Record<string, TemporalGovernanceRecord> = {
  'poi-belur-halebidu': {
    poiId: 'poi-belur-halebidu',
    name: 'Belur Chennakeshava & Halebidu Hoysaleswara Temples',
    nameKannada: 'ಬೇಲೂರು ಚೆನ್ನಕೇಶವ ಮತ್ತು ಹಳೇಬೀಡು ಹೊಯ್ಸಳೇಶ್ವರ ದೇವಾಲಯ',
    issuingAuthority: 'Archaeological Survey of India (Bengaluru Circle) & Karnataka Muzrai Department',
    documentIdentifier: 'ASI-BLR-CIR-2023/118 & Muzrai Niyamaavali Order No. 42',
    publicationDate: '2023-09-18',
    effectiveDate: '2023-09-18',
    lastVerificationDate: '2026-10-15',
    geographicApplicability: 'Belur & Halebidu Temple Precincts, Hassan District',
    updateFrequency: 'DAILY_REGULATED',
    verificationStatus: 'OFFICIALLY_VERIFIED',
    schedule: {
      opens: '07:30',
      closes: '19:30',
      recessStart: '12:30',
      recessEnd: '15:30',
      recessDetailsKannada: 'ಮಧ್ಯಾಹ್ನ ೧೨:೩೦ ರಿಂದ ೩:೩೦ ರವರೆಗೆ ಗರ್ಭಗುಡಿ ಮಹಾ ನೈವೇದ್ಯ ಹಾಗೂ ಅರ್ಚಕರ ವಿರಾಮ. ಹೊರಗಿನ ಶಿಲಾಬಾಲಿಕೆಯರ ವೀಕ್ಷಣೆಗೆ ಪ್ರವೇಶ ಮುಕ್ತ.',
      recessDetailsEnglish: 'Inner sanctum Garbhagudi closed 12:30 PM to 3:30 PM for Maha Naivedya and priests recess. Outer Hoysala Madanika courtyard remains accessible.',
    },
    authorityContactUrl: 'https://asibengalurucircle.in',
    verificationAdvice: 'Confirm pooja timings at Belur Temple Executive Officer counter or ASI ticket entrance.',
  },

  'poi-mullayanagiri': {
    poiId: 'poi-mullayanagiri',
    name: 'Mullayanagiri Peak & Sarpadhari Ridge',
    nameKannada: 'ಮುಳ್ಳಯ್ಯನಗಿರಿ ಶಿಖರ ಮತ್ತು ಸರ್ಪದಾರಿ ಬೆಟ್ಟ',
    issuingAuthority: 'Karnataka Forest Department (Chikkamagaluru Territorial Division / Kaimara Range)',
    documentIdentifier: 'KFD-CKM-GATE-ECO-2024/09',
    publicationDate: '2024-03-01',
    effectiveDate: '2024-03-01',
    lastVerificationDate: '2026-10-20',
    geographicApplicability: 'Kaimara Checkpost to Mullayanagiri Peak Ascent Road (1,930m)',
    updateFrequency: 'DAILY_REGULATED',
    verificationStatus: 'OFFICIALLY_VERIFIED',
    schedule: {
      opens: '06:00',
      closes: '17:30',
      recessDetailsKannada: 'ಸಂಜೆ ೫:೩೦ ರ ನಂತರ ಕೈಮಾರ ಚೆಕ್-ಪೋಸ್ಟ್‌ನಲ್ಲಿ ವಾಹನಗಳ ಪ್ರವೇಶ ಕಟ್ಟುನಿಟ್ಟಾಗಿ ನಿಷೇಧಿಸಲಾಗಿದೆ. ಬೆಟ್ಟದ ಮೇಲಿರುವ ವಾಹನಗಳು ೬:೩೦ ರೊಳಗೆ ಇಳಿಯಬೇಕು.',
      recessDetailsEnglish: 'Check-post strictly prohibits ascending vehicle movement post 17:30 (5:30 PM) to prevent night mountain accidents and wildlife conflicts. Downhill egress mandated by 18:30.',
    },
    authorityContactUrl: 'https://aranya.gov.in',
    verificationAdvice: 'Inquire with Range Forest Officer (RFO Kaimara) or Chikkamagaluru Tourist Information Counter.',
  },

  'ghat-shiradi-nh75': {
    poiId: 'ghat-shiradi-nh75',
    name: 'Shiradi Ghat NH-75 Corridor (Sakleshpur to Gundya)',
    nameKannada: 'ಶಿರಾಡಿ ಘಾಟಿ ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ ೭೫ (ಸಕಲೇಶಪುರ - ಗುಂಡ್ಯ)',
    issuingAuthority: 'National Highways Authority of India (PIU Hassan) & Hassan District Magistrate',
    documentIdentifier: 'NHAI-PIU-HSN-NH75-2025/12',
    publicationDate: '2025-06-01',
    effectiveDate: '2025-06-01',
    lastVerificationDate: '2026-10-28',
    geographicApplicability: 'NH-75 Chainage km 216 to km 242, Hassan & Dakshina Kannada Borders',
    updateFrequency: 'SEASONAL_PWD_BULLETIN',
    verificationStatus: 'OFFICIALLY_VERIFIED',
    schedule: {
      opens: '00:00',
      closes: '23:59',
      recessDetailsKannada: 'ಲಘು ವಾಹನ ಹಾಗೂ ಕಾರುಗಳಿಗೆ ೨೪ ಗಂಟೆ ಸಂಚಾರ ಮುಕ್ತ. ಭಾರೀ ಮಳೆಗಾಲದಲ್ಲಿ ಮಲ್ಟಿ-ಆಕ್ಸಲ್ ಲಾರಿಗಳಿಗೆ ಮಾತ್ರ ಜಿಲ್ಲಾಧಿಕಾರಿ ಆದೇಶದಂತೆ ತಾತ್ಕಾಲಿಕ ನಿರ್ಬಂಧವಿರುತ್ತದೆ.',
      recessDetailsEnglish: 'Open 24 hours for passenger cars and light vehicles. Multi-axle freight vehicles subject to seasonal monsoon diversions per District Magistrate notifications.',
    },
    authorityContactUrl: 'https://nhai.gov.in',
    verificationAdvice: 'Check Hassan District Police traffic updates or call NHAI Highway Helpline 1033.',
  },

  'ghat-charmadi-nh73': {
    poiId: 'ghat-charmadi-nh73',
    name: 'Charmadi Ghat NH-73 Corridor (Mudigere to Belthangady)',
    nameKannada: 'ಚಾರ್ಮಾಡಿ ಘಾಟಿ ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ ೭೩ (ಮೂಡಿಗೆರೆ - ಬೆಳ್ತಂಗಡಿ)',
    issuingAuthority: 'Karnataka State PWD (Chikkamagaluru) & Dakshina Kannada District Administration',
    documentIdentifier: 'PWD-CKM-DK-NH73-TRAFFIC-2024/71',
    publicationDate: '2024-07-15',
    effectiveDate: '2024-07-15',
    lastVerificationDate: '2026-10-28',
    geographicApplicability: 'NH-73 Kottigehara to Charmadi Village (11 Hairpin Bends)',
    updateFrequency: 'SEASONAL_PWD_BULLETIN',
    verificationStatus: 'OFFICIALLY_VERIFIED',
    schedule: {
      opens: '00:00',
      closes: '23:59',
      recessDetailsKannada: 'ಹೇರ್‌ಪಿನ್ ತಿರುವುಗಳಲ್ಲಿ ವೇಗ ಮಿತಿ ೩೦ ಕಿ.ಮೀ/ಗಂಟೆ. ರಾತ್ರಿ ೭:೦೦ ರಿಂದ ಮುಂಜಾನೆ ೬:೦೦ ವರೆಗೆ ದಟ್ಟ ಮಂಜು ಇರುವುದರಿಂದ ಮಂದಗತಿಯ ಸಂಚಾರ ಕಡ್ಡಾಯ.',
      recessDetailsEnglish: 'Maximum speed limit 30 km/h on hairpin curves. Night fog caution between 19:00 and 06:00.',
    },
    authorityContactUrl: 'https://kpwd.karnataka.gov.in',
    verificationAdvice: 'Consult Mudigere Traffic Police outpost at Kottigehara checkpost.',
  },

  'transit-shakti-scheme': {
    poiId: 'transit-shakti-scheme',
    name: 'Karnataka Shakti Scheme (Free Bus Travel for Women)',
    nameKannada: 'ಕರ್ನಾಟಕ ಶಕ್ತಿ ಯೋಜನೆ (ಮಹಿಳೆಯರಿಗೆ ಉಚಿತ ಬಸ್ ಪ್ರಯಾಣ)',
    issuingAuthority: 'Government of Karnataka, Transport Department',
    documentIdentifier: 'GoK Order No. TRD 34 MDA 2023',
    publicationDate: '2023-06-05',
    effectiveDate: '2023-06-11',
    lastVerificationDate: '2026-10-01',
    geographicApplicability: 'Intra-state travel within Karnataka borders on KSRTC, BMTC, NWKRTC, KKRTC',
    updateFrequency: 'ANNUAL_GAZETTE',
    verificationStatus: 'OFFICIALLY_VERIFIED',
    schedule: {
      opens: '00:00',
      closes: '23:59',
      recessDetailsKannada: 'ಕರ್ನಾಟಕ ಮೂಲದ ಮಹಿಳೆಯರಿಗೆ ಕೆಎಸ್‌ಆರ್‌ಟಿಸಿ / ಬಿಎಂಟಿಸಿ ಸಾಮಾನ್ಯ ಮತ್ತು ವೇಗದೂತ ಬಸ್‌ಗಳಲ್ಲಿ (ಕರ್ನಾಟಕ ಸಾರಿಗೆ) ₹೦ ಉಚಿತ ಪ್ರಯಾಣ. ಐರಾವತ, ರಾಜಹಂಸ, ಅಂಬಾರಿ ಹಾಗೂ ಅಂತರರಾಜ್ಯ ಬಸ್‌ಗಳಿಗೆ ಅನ್ವಯಿಸುವುದಿಲ್ಲ.',
      recessDetailsEnglish: '100% fare exemption for female domicile residents of Karnataka on Ordinary, Express, and City services (Karnataka Sarige). Excludes AC luxury (Airavat, Ambari Utsav), semi-luxury (Rajahamsa), and interstate legs.',
    },
    authorityContactUrl: 'https://transport.karnataka.gov.in',
    verificationAdvice: 'Carry Government of India/Karnataka issued photo ID card with Karnataka domicile address (Aadhaar, Voter ID, Driving Licence).',
  },
};

/**
 * Returns attributed temporal governance constraint for a POI or transit service.
 */
export function getTemporalGovernance(id: string): TemporalGovernanceRecord | undefined {
  return TEMPORAL_GOVERNANCE_REGISTRY[id];
}
