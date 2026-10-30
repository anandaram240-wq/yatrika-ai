/**
 * src/features/offline-travel/domain/types.ts
 * Type-Safe Contracts for YatriKa Offline Survival Mode
 */

export type OfflinePackStatus =
  | 'pending'
  | 'downloading'
  | 'verifying'
  | 'ready'
  | 'corrupted'
  | 'expired';

export interface OfflineStopData {
  id: string;
  name: string;
  nameKannada: string;
  district: string;
  coordinates: [number, number];
  category: string;
  timing: string;
  durationHours: number;
  entryFeeInr: number;
  nearestRailStation?: string;
  forestPermitRequired?: boolean;
  contactNumber?: string;
  localPhrase: {
    kannada: string;
    english: string;
    phonetic: string;
    context: string;
  };
}

export interface OfflineEmergencyContact {
  id: string;
  title: string;
  titleKannada: string;
  phoneNumber: string;
  category: 'police' | 'medical' | 'disaster' | 'forest' | 'tourism' | 'transport';
  availableHours: string;
  notes: string;
}

export interface OfflineSurvivalPhrase {
  kannada: string;
  phonetic: string;
  english: string;
  category: 'safety' | 'direction' | 'transport' | 'medical' | 'food';
}

export interface OfflineTripPack {
  id: string;
  circuitTitle: string;
  circuitTitleKannada: string;
  origin: {
    id: string;
    name: string;
    nameKannada: string;
    coordinates: [number, number];
  };
  stops: OfflineStopData[];
  totalDistanceKm: number;
  estimatedDriveHours: number;
  routeCoordinates: [number, number][]; // Full geometry points for offline drawing
  emergencyDirectory: OfflineEmergencyContact[];
  kannadaSurvivalPhrases: OfflineSurvivalPhrase[];
  shaktiGuidance: {
    isEligible: boolean;
    freeBusServices: string[];
    paidExemptions: string[];
    officialOrderReference: string;
  };
  budgetSummary: {
    netTotalInr: number;
    lodgingInr: number;
    fuelInr: number;
    ticketsInr: number;
    foodInr: number;
  };
  createdAt: string;
  schemaVersion: number;
  sizeBytes: number;
  checksum: string;
  status: OfflinePackStatus;
}

export interface StorageQuotaInfo {
  usedBytes: number;
  quotaBytes: number;
  percentageUsed: number;
}
