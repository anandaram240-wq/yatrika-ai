/**
 * @file src/operations/dataFreshnessMonitor.ts
 * @description Data freshness and TTL monitoring for YatriKa AI V4.
 * Tracks dataset staleness and flags expired operational caches.
 * @theme Code. Create. Celebrate Kannada.
 */

export type DatasetCategory =
  | 'weather'
  | 'road_hazard'
  | 'transit_timetable'
  | 'poi_catalog'
  | 'kannada_lexicon'
  | 'elevation_profile';

export interface FreshnessPolicy {
  category: DatasetCategory;
  name: string;
  ttlMinutes: number; // Maximum age before considered stale
  criticalTtlMinutes: number; // Age after which data is expired
  sourceAuthority: string;
}

export const DATA_FRESHNESS_POLICIES: Record<DatasetCategory, FreshnessPolicy> = {
  weather: {
    category: 'weather',
    name: 'Open-Meteo European Weather Ensemble',
    ttlMinutes: 30,
    criticalTtlMinutes: 120,
    sourceAuthority: 'Open-Meteo / IMD Bengaluru',
  },
  road_hazard: {
    category: 'road_hazard',
    name: 'Karnataka PWD & NHAI Road Status',
    ttlMinutes: 120,
    criticalTtlMinutes: 360,
    sourceAuthority: 'Karnataka PWD / NHAI Regional Office',
  },
  transit_timetable: {
    category: 'transit_timetable',
    name: 'KSRTC & SWR Schedule Index',
    ttlMinutes: 360,
    criticalTtlMinutes: 1440,
    sourceAuthority: 'KSRTC Central / South Western Railway Mysuru',
  },
  poi_catalog: {
    category: 'poi_catalog',
    name: 'Karnataka 678 Destination Unified Registry',
    ttlMinutes: 10080, // 7 days
    criticalTtlMinutes: 43200, // 30 days
    sourceAuthority: 'Karnataka Tourism Dept (KSTDC)',
  },
  kannada_lexicon: {
    category: 'kannada_lexicon',
    name: 'NammaVani Dialect & Vibhakti Lexicon',
    ttlMinutes: 43200, // 30 days
    criticalTtlMinutes: 525600, // 1 year
    sourceAuthority: 'Kannada Sahitya Parishat / Kannada Univ Hampi',
  },
  elevation_profile: {
    category: 'elevation_profile',
    name: 'SRTM Ghat Topographical Dataset',
    ttlMinutes: 525600, // 1 year
    criticalTtlMinutes: 5256000,
    sourceAuthority: 'NASA SRTM / ISRO Bhuvan',
  },
};

export interface FreshnessReport {
  category: DatasetCategory;
  lastUpdated: string;
  ageMinutes: number;
  isStale: boolean;
  isExpired: boolean;
  ttlMinutes: number;
  sourceAuthority: string;
  recommendation: 'FRESH' | 'REFRESH_SOON' | 'FORCE_REFRESH' | 'OFFLINE_FALLBACK';
}

export class DataFreshnessMonitor {
  private lastUpdatedMap = new Map<DatasetCategory, number>();

  constructor() {
    const now = Date.now();
    // Default initializations
    Object.keys(DATA_FRESHNESS_POLICIES).forEach((cat) => {
      this.lastUpdatedMap.set(cat as DatasetCategory, now);
    });
  }

  public recordUpdate(category: DatasetCategory, timestampMs: number = Date.now()): void {
    this.lastUpdatedMap.set(category, timestampMs);
  }

  public setSimulatedAge(category: DatasetCategory, ageMinutes: number): void {
    const simulatedTimestamp = Date.now() - ageMinutes * 60 * 1000;
    this.lastUpdatedMap.set(category, simulatedTimestamp);
  }

  public checkFreshness(category: DatasetCategory): FreshnessReport {
    const policy = DATA_FRESHNESS_POLICIES[category];
    const lastUpdatedMs = this.lastUpdatedMap.get(category) ?? 0;
    const now = Date.now();
    const ageMinutes = Math.max(0, Math.round((now - lastUpdatedMs) / (60 * 1000)));

    const isStale = ageMinutes > policy.ttlMinutes;
    const isExpired = ageMinutes > policy.criticalTtlMinutes;

    let recommendation: FreshnessReport['recommendation'] = 'FRESH';
    if (isExpired) {
      recommendation = 'FORCE_REFRESH';
    } else if (isStale) {
      recommendation = 'REFRESH_SOON';
    }

    return {
      category,
      lastUpdated: new Date(lastUpdatedMs).toISOString(),
      ageMinutes,
      isStale,
      isExpired,
      ttlMinutes: policy.ttlMinutes,
      sourceAuthority: policy.sourceAuthority,
      recommendation,
    };
  }

  public checkAll(): FreshnessReport[] {
    return Object.keys(DATA_FRESHNESS_POLICIES).map((cat) =>
      this.checkFreshness(cat as DatasetCategory)
    );
  }

  public getStaleCategories(): DatasetCategory[] {
    return this.checkAll()
      .filter((r) => r.isStale)
      .map((r) => r.category);
  }
}
