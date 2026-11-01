/**
 * @file src/data-fabric/verificationStatus.ts
 * @description Standardized Trust and Evidence Classifications for YatriKa AI V8.
 * Replaces generic "VERIFIED" badges with granular, auditable trust categories.
 * @theme Code. Create. Celebrate Kannada.
 */

export type SourceTrustClassification =
  | 'OFFICIAL_LIVE'
  | 'OFFICIAL_PUBLISHED'
  | 'GOVERNMENT_REGISTERED'
  | 'OPERATOR_CONFIRMED'
  | 'PROPERTY_DIRECT_CONFIRMED'
  | 'LICENSED_THIRD_PARTY'
  | 'COMMUNITY_MAPPED'
  | 'ESTIMATED'
  | 'UNVERIFIED'
  | 'EXPIRED';

export interface TrustClassificationMeta {
  code: SourceTrustClassification;
  label: string;
  labelKannada: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  icon: string;
  isStatutoryOrOfficial: boolean;
}

export const TRUST_CLASSIFICATION_METADATA: Record<SourceTrustClassification, TrustClassificationMeta> = {
  OFFICIAL_LIVE: {
    code: 'OFFICIAL_LIVE',
    label: 'Official Live Stream',
    labelKannada: 'ಅಧಿಕೃತ ನೇರ ಮಾಹಿತಿ',
    description: 'Direct real-time query verified from authoritative government API or live dispatch feed.',
    badgeBg: '#ECFDF5',
    badgeText: '#065F46',
    badgeBorder: '#A7F3D0',
    icon: '🟢',
    isStatutoryOrOfficial: true,
  },
  OFFICIAL_PUBLISHED: {
    code: 'OFFICIAL_PUBLISHED',
    label: 'Official Published Record',
    labelKannada: 'ಅಧಿಕೃತ ಪ್ರಕಟಿತ ದಾಖಲೆ',
    description: 'Statutory gazette, official government portal schedule, or ASI monument notification.',
    badgeBg: '#F0FDF4',
    badgeText: '#166534',
    badgeBorder: '#BBF7D0',
    icon: '🏛️',
    isStatutoryOrOfficial: true,
  },
  GOVERNMENT_REGISTERED: {
    code: 'GOVERNMENT_REGISTERED',
    label: 'Govt. Registered Entity',
    labelKannada: 'ಸರ್ಕಾರ ನೋಂದಾಯಿತ ಸಂಸ್ಥೆ',
    description: 'Homestay, guide, or tourism facility holding valid registration with District Tourism Council / GoK.',
    badgeBg: '#EFF6FF',
    badgeText: '#1E40AF',
    badgeBorder: '#BFDBFE',
    icon: '📜',
    isStatutoryOrOfficial: true,
  },
  OPERATOR_CONFIRMED: {
    code: 'OPERATOR_CONFIRMED',
    label: 'Operator Confirmed Schedule',
    labelKannada: 'ಸಾರಿಗೆ ನಿಗಮ ದೃಢೀಕೃತ ವೇಳಾಪಟ್ಟಿ',
    description: 'Timetable published and certified by KSRTC, BMTC, NWKRTC, KKRTC, or South Western Railway.',
    badgeBg: '#F5F3FF',
    badgeText: '#5B21B6',
    badgeBorder: '#DDD6FE',
    icon: '🚌',
    isStatutoryOrOfficial: true,
  },
  PROPERTY_DIRECT_CONFIRMED: {
    code: 'PROPERTY_DIRECT_CONFIRMED',
    label: 'Property Direct Confirmed',
    labelKannada: 'ನೇರ ಹೊಟೇಲ್/ರೆಸಾರ್ಟ್ ದೃಢೀಕೃತ',
    description: 'Directly verified tariffs and availability from KSTDC Mayura, Jungle Lodges (JLR), or certified stays.',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    badgeBorder: '#FDE68A',
    icon: '🏨',
    isStatutoryOrOfficial: false,
  },
  LICENSED_THIRD_PARTY: {
    code: 'LICENSED_THIRD_PARTY',
    label: 'Licensed Third-Party Data',
    labelKannada: 'ಪರವಾನಗಿ ಪಡೆದ ಬಾಹ್ಯ ದತ್ತಾಂಶ',
    description: 'Data sourced under explicit academic or commercial API licenses (e.g. Open-Meteo CC-BY 4.0).',
    badgeBg: '#F3F4F6',
    badgeText: '#374151',
    badgeBorder: '#E5E7EB',
    icon: '📊',
    isStatutoryOrOfficial: false,
  },
  COMMUNITY_MAPPED: {
    code: 'COMMUNITY_MAPPED',
    label: 'Open Community Mapped',
    labelKannada: 'ಮುಕ್ತ ಸಮುದಾಯ ನಕ್ಷೆ',
    description: 'Geospatial coordinates or road vectors contributed via OpenStreetMap (ODbL).',
    badgeBg: '#F8FAFC',
    badgeText: '#475569',
    badgeBorder: '#E2E8F0',
    icon: '🗺️',
    isStatutoryOrOfficial: false,
  },
  ESTIMATED: {
    code: 'ESTIMATED',
    label: 'Algorithmically Estimated',
    labelKannada: 'ಅಂದಾಜು ಲೆಕ್ಕಾಚಾರ',
    description: 'Estimated distance, duration, or budget tier derived from validated spatial heuristics.',
    badgeBg: '#FFFBEB',
    badgeText: '#B45309',
    badgeBorder: '#FDE68A',
    icon: '📐',
    isStatutoryOrOfficial: false,
  },
  UNVERIFIED: {
    code: 'UNVERIFIED',
    label: 'Unverified / Crowdsourced',
    labelKannada: 'ದೃಢೀಕರಣವಿಲ್ಲದ ಮಾಹಿತಿ',
    description: 'Awaiting independent physical or documentary verification by YatriKa field auditors.',
    badgeBg: '#FFF1F2',
    badgeText: '#BE123C',
    badgeBorder: '#FECDD3',
    icon: '⚠️',
    isStatutoryOrOfficial: false,
  },
  EXPIRED: {
    code: 'EXPIRED',
    label: 'Expired Historical Record',
    labelKannada: 'ಅವಧಿ ಮುಗಿದ ದಾಖಲೆ',
    description: 'Validity TTL expired. Displayed strictly as historical reference; fresh verification pending.',
    badgeBg: '#FEE2E2',
    badgeText: '#991B1B',
    badgeBorder: '#FCA5A5',
    icon: '⏳',
    isStatutoryOrOfficial: false,
  },
};

export function getTrustClassificationMeta(code: SourceTrustClassification): TrustClassificationMeta {
  return TRUST_CLASSIFICATION_METADATA[code] ?? TRUST_CLASSIFICATION_METADATA.UNVERIFIED;
}
