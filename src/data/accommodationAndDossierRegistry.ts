// src/data/accommodationAndDossierRegistry.ts

export type AccommodationVerificationLabel =
  | 'GOVERNMENT_OPERATED'
  | 'GOVERNMENT_CLASSIFIED'
  | 'STATE_REGISTERED_HOMESTAY'
  | 'DIRECTLY_CONFIRMED_PROPERTY'
  | 'REGISTRATION_EXPIRED'
  | 'CLASSIFICATION_EXPIRED'
  | 'UNVERIFIED'
  | 'NIDHI_LISTED_ONLY';

export interface VerifiedAccommodationRecord {
  id: string;
  destinationId: string;
  propertyName: string;
  verificationLabel: AccommodationVerificationLabel;
  operatingOrClassifyingAuthority: string;
  registrationOrClassificationNumber: string;
  validFrom: string;
  validUntil: string;
  locality: string;
  taluk: string;
  district: string;
  coordinates: [number, number];
  distanceFromDestinationKm: number;
  distanceReferencePoint: string;
  roomTypes: {
    name: string;
    publishedTariffInr: number | null;
    taxNote: string;
  }[];
  availabilityDisclosure: string;
  officialPropertyUrl: string;
  officialRegistrySourceUrl: string;
  lastVerifiedDate: string;
  eligibleForPrimaryRecommendation: boolean;
}

export const HAMPI_ACCOMMODATION_REGISTRY: VerifiedAccommodationRecord[] = [
  {
    id: 'kstdc-mayura-bhuvaneshwari-hampi',
    destinationId: 'hampi',
    propertyName: 'KSTDC Hotel Mayura Bhuvaneshwari Hampi',
    verificationLabel: 'GOVERNMENT_OPERATED',
    operatingOrClassifyingAuthority:
      'Karnataka State Tourism Development Corporation (KSTDC — Government of Karnataka Undertaking)',
    registrationOrClassificationNumber: 'KSTDC-UNIT-HAMPI-KAMALAPURA',
    validFrom: 'Permanent Statutory Undertaking',
    validUntil: 'Active Government Operation',
    locality: 'Kamalapura',
    taluk: 'Hosapete',
    district: 'Vijayanagara',
    coordinates: [76.4765, 15.3036],
    distanceFromDestinationKm: 1.8,
    distanceReferencePoint: '1.8 km from Lotus Mahal / Royal Enclosure; 4.2 km from Virupaksha Temple',
    roomTypes: [
      {
        name: 'AC Deluxe / Standard Rooms (Check live KSTDC tariff portal at retrieval time)',
        publishedTariffInr: null, // Enforces Section 10E & 15: Never copy stale rates as live booking quotes
        taxNote: 'GST extra as applicable per KSTDC booking rules.',
      },
    ],
    availabilityDisclosure:
      'Official property listing. Confirm room availability and current tariff with the property.',
    officialPropertyUrl: 'https://kstdc.co/hotels/hotel-mayura-bhuvaneshwari-hampi/',
    officialRegistrySourceUrl: 'https://kstdc.co/mayura-hotels/',
    lastVerifiedDate: '2026-10-24',
    eligibleForPrimaryRecommendation: true,
  },
  {
    id: 'jlr-sloth-bear-resort-hampi',
    destinationId: 'hampi',
    propertyName: 'Jungle Lodges & Resorts (JLR) — Hampi Heritage & Wilderness Camp',
    verificationLabel: 'GOVERNMENT_OPERATED',
    operatingOrClassifyingAuthority: 'Jungle Lodges & Resorts Ltd. (Government of Karnataka)',
    registrationOrClassificationNumber: 'JLR-GOK-DAROJI-HAMPI',
    validFrom: 'Permanent Statutory Undertaking',
    validUntil: 'Active Government Operation',
    locality: 'Kamalapura – Daroji Road',
    taluk: 'Hosapete',
    district: 'Vijayanagara',
    coordinates: [76.5120, 15.2840],
    distanceFromDestinationKm: 6.5,
    distanceReferencePoint: '6.5 km from Royal Enclosure towards Daroji Sloth Bear Sanctuary',
    roomTypes: [
      {
        name: 'Eco-Cottage / Package Stay (Includes guided safari & meals per JLR tariff)',
        publishedTariffInr: null,
        taxNote: 'Verify current seasonal tariff directly on junglelodges.com.',
      },
    ],
    availabilityDisclosure:
      'Official property listing. Confirm room availability and current tariff with the property.',
    officialPropertyUrl: 'https://www.junglelodges.com/',
    officialRegistrySourceUrl: 'https://www.junglelodges.com/',
    lastVerifiedDate: '2026-10-24',
    eligibleForPrimaryRecommendation: true,
  },
  {
    id: 'sample-nidhi-only-disclosure',
    destinationId: 'hampi',
    propertyName: 'Example NIDHI+ Self-Declared Lodge (Excluded from Primary Recommendations)',
    verificationLabel: 'NIDHI_LISTED_ONLY',
    operatingOrClassifyingAuthority: 'Ministry of Tourism NIDHI+ Self-Declaration Database',
    registrationOrClassificationNumber: 'NIDHI-SELF-DECLARED-ONLY',
    validFrom: '2025-01-01',
    validUntil: 'Unverified Local Operating Licence',
    locality: 'Hosapete Outskirts',
    taluk: 'Hosapete',
    district: 'Vijayanagara',
    coordinates: [76.3950, 15.2750],
    distanceFromDestinationKm: 12.0,
    distanceReferencePoint: 'Hosapete Town',
    roomTypes: [],
    availabilityDisclosure:
      'NIDHI_LISTED_ONLY: An entry on NIDHI+ does not by itself prove valid Karnataka Tourism Homestay Registration (Revised Guidelines 2025) or local trade licensing. Excluded from primary recommendations.',
    officialPropertyUrl: 'https://nidhi.tourism.gov.in/',
    officialRegistrySourceUrl:
      'https://karnatakatourism.org/en/news/official-karnataka-homestay-registration-guidelines/',
    lastVerifiedDate: '2026-10-24',
    eligibleForPrimaryRecommendation: false,
  },
];
