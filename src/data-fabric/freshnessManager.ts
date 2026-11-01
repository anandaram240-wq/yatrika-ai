/**
 * @file src/data-fabric/freshnessManager.ts
 * @description Standardized data freshness evaluator and cache TTL policy manager.
 * Categorizes external and cached data into explicit freshness tiers.
 * @theme Code. Create. Celebrate Kannada.
 */

export type FreshnessState =
  | 'Fresh'
  | 'Recently updated'
  | 'Stale'
  | 'Expired'
  | 'Verification unavailable';

export interface FreshnessMeta {
  state: FreshnessState;
  stateKannada: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  icon: string;
  isStaleOrExpired: boolean;
  ageMinutes: number;
  formattedAge: string;
  lastRetrievedIso: string;
  noticeText?: string;
}

export interface FreshnessPolicy {
  freshThresholdMinutes: number;
  recentlyUpdatedThresholdMinutes: number;
  staleThresholdMinutes: number;
  hardExpiryMinutes: number;
}

export const DEFAULT_FRESHNESS_POLICIES: Record<string, FreshnessPolicy> = {
  weather: {
    freshThresholdMinutes: 30,
    recentlyUpdatedThresholdMinutes: 90,
    staleThresholdMinutes: 180,
    hardExpiryMinutes: 360,
  },
  road_condition: {
    freshThresholdMinutes: 60,
    recentlyUpdatedThresholdMinutes: 180,
    staleThresholdMinutes: 360,
    hardExpiryMinutes: 720,
  },
  bus_schedule: {
    freshThresholdMinutes: 180,
    recentlyUpdatedThresholdMinutes: 720,
    staleThresholdMinutes: 1440,
    hardExpiryMinutes: 4320,
  },
  train_schedule: {
    freshThresholdMinutes: 240,
    recentlyUpdatedThresholdMinutes: 1440,
    staleThresholdMinutes: 2880,
    hardExpiryMinutes: 10080,
  },
  opening_hours: {
    freshThresholdMinutes: 1440 * 7,    // 7 days
    recentlyUpdatedThresholdMinutes: 1440 * 30, // 30 days
    staleThresholdMinutes: 1440 * 90,   // 90 days
    hardExpiryMinutes: 1440 * 180,      // 180 days
  },
  destination_info: {
    freshThresholdMinutes: 1440 * 14,   // 14 days
    recentlyUpdatedThresholdMinutes: 1440 * 60, // 60 days
    staleThresholdMinutes: 1440 * 180,  // 180 days
    hardExpiryMinutes: 1440 * 365,      // 1 year
  },
  heritage_epigraphy: {
    freshThresholdMinutes: 1440 * 365,
    recentlyUpdatedThresholdMinutes: 1440 * 365 * 5,
    staleThresholdMinutes: 1440 * 365 * 10,
    hardExpiryMinutes: 1440 * 365 * 100, // Permanent records
  },
};

export class FreshnessManager {
  /**
   * Evaluates the freshness of a record given its last fetched / verified timestamp.
   */
  public static evaluate(
    lastRetrievedIso?: string | null,
    category: string = 'destination_info',
    now: Date = new Date()
  ): FreshnessMeta {
    if (!lastRetrievedIso) {
      return {
        state: 'Verification unavailable',
        stateKannada: 'ದೃಢೀಕರಣ ಅಲಭ್ಯ',
        badgeBg: '#F3F4F6',
        badgeText: '#4B5563',
        badgeBorder: '#D1D5DB',
        icon: '⚪',
        isStaleOrExpired: true,
        ageMinutes: Infinity,
        formattedAge: 'Never audited',
        lastRetrievedIso: '',
        noticeText: 'No verified timestamp found. Direct physical or telephone verification required.',
      };
    }

    const timestamp = new Date(lastRetrievedIso).getTime();
    if (isNaN(timestamp)) {
      return {
        state: 'Verification unavailable',
        stateKannada: 'ದೃಢೀಕರಣ ಅಲಭ್ಯ',
        badgeBg: '#F3F4F6',
        badgeText: '#4B5563',
        badgeBorder: '#D1D5DB',
        icon: '⚪',
        isStaleOrExpired: true,
        ageMinutes: Infinity,
        formattedAge: 'Invalid timestamp',
        lastRetrievedIso,
        noticeText: 'Corrupted timestamp in evidence ledger.',
      };
    }

    const elapsedMs = Math.max(0, now.getTime() - timestamp);
    const ageMinutes = Math.floor(elapsedMs / (1000 * 60));
    const policy = DEFAULT_FRESHNESS_POLICIES[category] ?? DEFAULT_FRESHNESS_POLICIES.destination_info;

    let state: FreshnessState = 'Fresh';
    let stateKannada = 'ತಾಜಾ ಮಾಹಿತಿ';
    let badgeBg = '#ECFDF5';
    let badgeText = '#065F46';
    let badgeBorder = '#A7F3D0';
    let icon = '🟢';
    let isStaleOrExpired = false;
    let noticeText: string | undefined = undefined;

    if (ageMinutes > policy.hardExpiryMinutes) {
      state = 'Expired';
      stateKannada = 'ಅವಧಿ ಮುಗಿದ ಮಾಹಿತಿ';
      badgeBg = '#FEE2E2';
      badgeText = '#991B1B';
      badgeBorder = '#FCA5A5';
      icon = '🔴';
      isStaleOrExpired = true;
      noticeText = 'Data exceeded maximum validity lifecycle. Displayed as historical reference.';
    } else if (ageMinutes > policy.staleThresholdMinutes) {
      state = 'Stale';
      stateKannada = 'ಹಳೆಯ ಮಾಹಿತಿ (ಪರಿಶೀಲನೆ ಅಗತ್ಯ)';
      badgeBg = '#FFFBEB';
      badgeText = '#B45309';
      badgeBorder = '#FDE68A';
      icon = '🟠';
      isStaleOrExpired = true;
      noticeText = `Last updated ${FreshnessManager.formatAge(ageMinutes)} ago. Local operator confirmation recommended.`;
    } else if (ageMinutes > policy.freshThresholdMinutes) {
      state = 'Recently updated';
      stateKannada = 'ಇತ್ತೀಚೆಗೆ ನವೀಕರಿಸಲಾಗಿದೆ';
      badgeBg = '#F0FDF4';
      badgeText = '#166534';
      badgeBorder = '#BBF7D0';
      icon = '🟡';
      isStaleOrExpired = false;
    }

    return {
      state,
      stateKannada,
      badgeBg,
      badgeText,
      badgeBorder,
      icon,
      isStaleOrExpired,
      ageMinutes,
      formattedAge: FreshnessManager.formatAge(ageMinutes),
      lastRetrievedIso,
      noticeText,
    };
  }

  public static formatAge(minutes: number): string {
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = (days / 365).toFixed(1);
    return `${years}y ago`;
  }
}
