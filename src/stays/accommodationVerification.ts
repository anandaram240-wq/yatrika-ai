/**
 * @file src/stays/accommodationVerification.ts
 * @description Standardized stay verification classifications and auditing logic.
 * Never conflates a government registration with confirmed room availability.
 * @theme Code. Create. Celebrate Kannada.
 */

export type StayVerificationStatus =
  | 'GOVERNMENT_REGISTERED'
  | 'GOVERNMENT_CLASSIFIED'
  | 'OFFICIAL_KSTDC_PROPERTY'
  | 'OFFICIAL_JLR_PROPERTY'
  | 'VERIFIED_BUSINESS_IDENTITY'
  | 'PARTNER_CONFIRMED'
  | 'THIRD_PARTY_LISTING'
  | 'SELF_REPORTED'
  | 'UNVERIFIED'
  | 'REGISTRATION_EXPIRED'
  | 'STATUS_UNKNOWN';

export interface StayVerificationMeta {
  code: StayVerificationStatus;
  label: string;
  labelKannada: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  description: string;
}

export const STAY_VERIFICATION_METADATA: Record<StayVerificationStatus, StayVerificationMeta> = {
  OFFICIAL_KSTDC_PROPERTY: {
    code: 'OFFICIAL_KSTDC_PROPERTY',
    label: 'Official KSTDC Hotel Mayura',
    labelKannada: 'ಕೆಎಸ್‌ಟಿಡಿಸಿ ಮಯೂರ ಅಧಿಕೃತ ಹೋಟೆಲ್',
    badgeBg: '#F0FDF4',
    badgeText: '#166534',
    badgeBorder: '#BBF7D0',
    description: 'Owned and operated by Karnataka State Tourism Development Corporation (GoK).',
  },
  OFFICIAL_JLR_PROPERTY: {
    code: 'OFFICIAL_JLR_PROPERTY',
    label: 'Official Jungle Lodges & Resorts',
    labelKannada: 'ಜಂಗಲ್ ಲಾಡ್ಜಸ್ & ರೆಸಾರ್ಟ್ಸ್ ಅಧಿಕೃತ',
    badgeBg: '#ECFDF5',
    badgeText: '#065F46',
    badgeBorder: '#A7F3D0',
    description: 'Government of Karnataka eco-tourism enterprise property with certified wildlife safaris.',
  },
  GOVERNMENT_REGISTERED: {
    code: 'GOVERNMENT_REGISTERED',
    label: 'Govt. Registered Homestay',
    labelKannada: 'ಸರ್ಕಾರ ನೋಂದಾಯಿತ ಹೋಮ್‌ಸ್ಟೇ',
    badgeBg: '#EFF6FF',
    badgeText: '#1E40AF',
    badgeBorder: '#BFDBFE',
    description: 'Holds valid registration certificate from District Tourism Council under Karnataka Tourism Policy.',
  },
  GOVERNMENT_CLASSIFIED: {
    code: 'GOVERNMENT_CLASSIFIED',
    label: 'Govt. Classified Hotel (Star Rated)',
    labelKannada: 'ಸರ್ಕಾರ ವರ್ಗೀಕೃತ ಹೋಟೆಲ್',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    badgeBorder: '#FDE68A',
    description: 'Classified under Ministry of Tourism / GoK Hotel Classification Committee standards.',
  },
  VERIFIED_BUSINESS_IDENTITY: {
    code: 'VERIFIED_BUSINESS_IDENTITY',
    label: 'Verified Business Identity',
    labelKannada: 'ದೃಢೀಕೃತ ವಾಣಿಜ್ಯ ಸಂಸ್ಥೆ',
    badgeBg: '#F3F4F6',
    badgeText: '#374151',
    badgeBorder: '#E5E7EB',
    description: 'Commercial GST / trade license verified; independent tourist quality audit pending.',
  },
  PARTNER_CONFIRMED: {
    code: 'PARTNER_CONFIRMED',
    label: 'Partner Confirmed',
    labelKannada: 'ಪಾಲುದಾರ ದೃಢೀಕೃತ',
    badgeBg: '#F5F3FF',
    badgeText: '#5B21B6',
    badgeBorder: '#DDD6FE',
    description: 'Direct agreement between property owner and YatriKa platform.',
  },
  THIRD_PARTY_LISTING: {
    code: 'THIRD_PARTY_LISTING',
    label: 'Third-Party Directory Listing',
    labelKannada: 'ಬಾಹ್ಯ ಕೋಶ ಪಟ್ಟಿ',
    badgeBg: '#F8FAFC',
    badgeText: '#475569',
    badgeBorder: '#E2E8F0',
    description: 'Listed from public tourism directories without direct physical audit.',
  },
  SELF_REPORTED: {
    code: 'SELF_REPORTED',
    label: 'Self-Reported Owner Listing',
    labelKannada: 'ಮಾಲೀಕರ ಸ್ವಯಂ ಘೋಷಿತ ಪಟ್ಟಿ',
    badgeBg: '#FFFBEB',
    badgeText: '#B45309',
    badgeBorder: '#FDE68A',
    description: 'Submitted by property owner; awaiting field audit by district tourism coordinator.',
  },
  UNVERIFIED: {
    code: 'UNVERIFIED',
    label: 'Unverified Stay',
    labelKannada: 'ದೃಢೀಕರಣವಿಲ್ಲದ ತಂಗುದಾಣ',
    badgeBg: '#FFF1F2',
    badgeText: '#BE123C',
    badgeBorder: '#FECDD3',
    description: 'Not yet verified by authorities; traveler discretion advised.',
  },
  REGISTRATION_EXPIRED: {
    code: 'REGISTRATION_EXPIRED',
    label: 'Registration Expired',
    labelKannada: 'ನೋಂದಣಿ ಅವಧಿ ಮುಗಿದಿದೆ',
    badgeBg: '#FEE2E2',
    badgeText: '#991B1B',
    badgeBorder: '#FCA5A5',
    description: 'District administration homestay registration has lapsed; renewal pending.',
  },
  STATUS_UNKNOWN: {
    code: 'STATUS_UNKNOWN',
    label: 'Status Unknown',
    labelKannada: 'ಸ್ಥಿತಿ ಅಸ್ಪಷ್ಟ',
    badgeBg: '#F3F4F6',
    badgeText: '#6B7280',
    badgeBorder: '#D1D5DB',
    description: 'Current operational verification unavailable.',
  },
};

export function getStayVerificationMeta(status: StayVerificationStatus): StayVerificationMeta {
  return STAY_VERIFICATION_METADATA[status] ?? STAY_VERIFICATION_METADATA.STATUS_UNKNOWN;
}
