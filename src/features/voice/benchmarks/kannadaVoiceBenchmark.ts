/**
 * src/features/voice/benchmarks/kannadaVoiceBenchmark.ts
 * Master 100-Prompt Authentic Real-World Kannada Voice Evaluation Corpus.
 * Covers 8 regional dialects, colloquial markers, and Kanglish code-switching.
 */

export interface KannadaVoiceBenchmarkSample {
  id: string;
  category:
    | 'standard_kannada'
    | 'bengaluru_colloquial'
    | 'old_mysuru'
    | 'kundagannada_coastal'
    | 'havyaka_malnad'
    | 'kalyana_karnataka'
    | 'kittur_karnataka'
    | 'kannada_english_codeswitch';
  spokenText: string;
  expectedOrigin?: string;
  expectedDestination?: string;
  expectedWaypoints?: string[];
  expectedDurationDays?: number;
  expectedBudgetInr?: number;
  expectedIntent: string;
  isFemalePassenger?: boolean;
}

export const KANNADA_100_VOICE_BENCHMARK: KannadaVoiceBenchmarkSample[] = [
  // 1. STANDARD KANNADA (1-15)
  {
    id: 'std-01',
    category: 'standard_kannada',
    spokenText: 'ಬೆಂಗಳೂರಿನಿಂದ ಮೈಸೂರಿಗೆ ಎರಡು ದಿನದ ಪ್ರವಾಸ ಯೋಜನೆ ರೂಪಿಸಿ',
    expectedOrigin: 'ಬೆಂಗಳೂರು',
    expectedDestination: 'ಮೈಸೂರು',
    expectedDurationDays: 2,
    expectedIntent: 'route_search',
  },
  {
    id: 'std-02',
    category: 'standard_kannada',
    spokenText: 'ಬೆಂಗಳೂರಿನಿಂದ ಹಾಸನದ ಮೂಲಕ ಬೇಲೂರು ಮತ್ತು ಹಳೇಬೀಡು ಪ್ರವಾಸ ಪ್ಲಾನ್ ಮಾಡಿ',
    expectedOrigin: 'ಬೆಂಗಳೂರು',
    expectedDestination: 'ಬೇಲೂರು',
    expectedWaypoints: ['ಹಾಸನ'],
    expectedIntent: 'route_search',
  },
  {
    id: 'std-03',
    category: 'standard_kannada',
    spokenText: 'ಹಂಪಿಯ ಐತಿಹಾಸಿಕ ಸ್ಮಾರಕಗಳನ್ನು ನೋಡಲು ಮೂರು ದಿನದ ಪ್ರವಾಸ ಬೇಕು',
    expectedDestination: 'ಹಂಪಿ',
    expectedDurationDays: 3,
    expectedIntent: 'route_search',
  },
  {
    id: 'std-04',
    category: 'standard_kannada',
    spokenText: 'ಚಿಕ್ಕಮಗಳೂರಿನ ಮುಳ್ಳಯ್ಯನಗಿರಿ ಶಿಖರಕ್ಕೆ ಪ್ರವಾಸ ಯೋಜನೆ ಮಾಡಿ',
    expectedDestination: 'ಮುಳ್ಳಯ್ಯನಗಿರಿ',
    expectedIntent: 'route_search',
  },
  {
    id: 'std-05',
    category: 'standard_kannada',
    spokenText: 'ಉಡುಪಿ ಶ್ರೀಕೃಷ್ಣ ಮಠ ಮತ್ತು ಮಲ್ಪೆ ಕಡಲತೀರಕ್ಕೆ ಹೋಗಬೇಕು',
    expectedDestination: 'ಉಡುಪಿ',
    expectedIntent: 'route_search',
  },
  {
    id: 'std-06',
    category: 'standard_kannada',
    spokenText: 'ಬಾದಾಮಿ ಗುಹಾ ದೇವಾಲಯಗಳು ಮತ್ತು ಪಟ್ಟದಕಲ್ಲು ನೋಡಲು ನಾಲ್ಕು ದಿನ ಬೇಕು',
    expectedDestination: 'ಬಾದಾಮಿ',
    expectedDurationDays: 4,
    expectedIntent: 'route_search',
  },
  {
    id: 'std-07',
    category: 'standard_kannada',
    spokenText: 'ಶಿವಮೊಗ್ಗದ ಜೋಗ ಜಲಪಾತಕ್ಕೆ ಮಳೆಗಾಲದ ಪ್ರವಾಸ ಪ್ಲಾನ್ ಕೊಡಿ',
    expectedDestination: 'ಜೋಗ ಜಲಪಾತ',
    expectedIntent: 'route_search',
  },
  {
    id: 'std-08',
    category: 'standard_kannada',
    spokenText: 'ಗೋಕರ್ಣದ ಓಂ ಬೀಚ್ ಮತ್ತು ಮುರುಡೇಶ್ವರ ದೇವಾಲಯಕ್ಕೆ ಹೋಗಲು ಬಜೆಟ್ ಎಷ್ಟು?',
    expectedDestination: 'ಗೋಕರ್ಣ',
    expectedIntent: 'budget_query',
  },
  {
    id: 'std-09',
    category: 'standard_kannada',
    spokenText: 'ಮಡಿಕೇರಿ ಮತ್ತು ರಾಜಾಸೀಟ್ ವೀಕ್ಷಣೆಗೆ ಎರಡು ದಿನದ ಪ್ರವಾಸ',
    expectedDestination: 'ಮಡಿಕೇರಿ',
    expectedDurationDays: 2,
    expectedIntent: 'route_search',
  },
  {
    id: 'std-10',
    category: 'standard_kannada',
    spokenText: 'ಕಬಿನಿ ವನ್ಯಜೀವಿ ಸಫಾರಿ ಮತ್ತು ನಾಗರಹೊಳೆ ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನ ಪ್ರವಾಸ',
    expectedDestination: 'ಕಬಿನಿ',
    expectedIntent: 'route_search',
  },
  {
    id: 'std-11',
    category: 'standard_kannada',
    spokenText: 'ಬಿಜಾಪುರದ ಗೋಲ್ ಗುಂಬಜ್ ಮತ್ತು ಇಬ್ರಾಹಿಂ ರೋಜಾ ನೋಡಲು ಹೋಗಬೇಕು',
    expectedDestination: 'ವಿಜಯಪುರ',
    expectedIntent: 'route_search',
  },
  {
    id: 'std-12',
    category: 'standard_kannada',
    spokenText: 'ಶಕ್ತಿ ಯೋಜನೆಯಡಿ ಮಹಿಳೆಯರಿಗೆ ಕೆಎಸ್ಆರ್ಟಿಸಿ ಬಸ್ ಪ್ರಯಾಣ ಉಚಿತವೇ?',
    expectedIntent: 'budget_query',
    isFemalePassenger: true,
  },
  {
    id: 'std-13',
    category: 'standard_kannada',
    spokenText: 'ಬೇಲೂರು ಚೆನ್ನಕೇಶವ ದೇವಾಲಯದ ಮಧ್ಯಾಹ್ನದ ನೈವೇದ್ಯ ಸಮಯ ಯಾವಾಗ?',
    expectedDestination: 'ಬೇಲೂರು',
    expectedIntent: 'corridor_advice_query',
  },
  {
    id: 'std-14',
    category: 'standard_kannada',
    spokenText: 'ಶಿರಾಡಿ ಘಾಟ್ ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ 75 ರಲ್ಲಿ ರಸ್ತೆ ಸ್ಥಿತಿ ಹೇಗಿದೆ?',
    expectedIntent: 'corridor_advice_query',
  },
  {
    id: 'std-15',
    category: 'standard_kannada',
    spokenText: 'ತುರ್ತು ಅಪಘಾತ ಸಹಾಯವಾಣಿ ಸಂಖ್ಯೆ ಮತ್ತು ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ ವಿವರ ಕೊಡಿ',
    expectedIntent: 'emergency_query',
  },

  // 2. BENGALURU COLLOQUIAL (16-30)
  {
    id: 'blr-16',
    category: 'bengaluru_colloquial',
    spokenText: 'ವೀಕೆಂಡ್‌ನಲ್ಲಿ ನಂದಿ ಹಿಲ್ಸ್‌ಗೆ ಹೋಗಿ ಸನ್‌ರೈಸ್ ನೋಡ್ಬೇಕು ಗುರು',
    expectedDestination: 'ನಂದಿ ಬೆಟ್ಟ',
    expectedIntent: 'route_search',
  },
  {
    id: 'blr-17',
    category: 'bengaluru_colloquial',
    spokenText: 'ಬೆಂಗಳೂರಿನಿಂದ ಚಿಕ್ಕಮಗಳೂರಿಗೆ ಒಂದು ಸೂಪರ್ ಟ್ರಿಪ್ ಪ್ಲಾನ್ ಹಾಕಿ ಕೊಡಿ ಬಾಸ್',
    expectedOrigin: 'ಬೆಂಗಳೂರು',
    expectedDestination: 'ಚಿಕ್ಕಮಗಳೂರು',
    expectedIntent: 'route_search',
  },
  {
    id: 'blr-18',
    category: 'bengaluru_colloquial',
    spokenText: 'ಹಂಪಿ ಟ್ರಿಪ್‌ಗೆ ಐದು ಸಾವಿರ ಬಜೆಟ್‌ನಲ್ಲಿ ಏನೆಲ್ಲಾ ಕವರ್ ಮಾಡಬಹುದು?',
    expectedDestination: 'ಹಂಪಿ',
    expectedBudgetInr: 5000,
    expectedIntent: 'budget_query',
  },
  {
    id: 'blr-19',
    category: 'bengaluru_colloquial',
    spokenText: 'ಕನಕಪುರ ರೋಡ್ ಮಾರ್ಗವಾಗಿ ಮೇಕೆದಾಟು ಮತ್ತು ಸಂಗಮ ನೋಡೋಣ ಬನ್ನಿ',
    expectedDestination: 'ಮೇಕೆದಾಟು',
    expectedIntent: 'route_search',
  },
  {
    id: 'blr-20',
    category: 'bengaluru_colloquial',
    spokenText: 'ಬನ್ನೇರುಘಟ್ಟ ಜೂ ಸಫಾರಿಗೆ ಫ್ಯಾಮಿಲಿ ಜೊತೆ ಒಂದು ದಿನದ ಪ್ರವಾಸ',
    expectedDestination: 'ಬನ್ನೇರುಘಟ್ಟ',
    expectedDurationDays: 1,
    expectedIntent: 'route_search',
  },
  {
    id: 'blr-21',
    category: 'bengaluru_colloquial',
    spokenText: 'ಮೈಸೂರು ಎಕ್ಸ್‌ಪ್ರೆಸ್‌ವೇಯಲ್ಲಿ ಚನ್ನಪಟ್ಟಣ ಬೊಂಬೆ ಅಂಗಡಿ ಎಲ್ಲಿದೆ ಮಚ್ಚಾ?',
    expectedDestination: 'ಚನ್ನಪಟ್ಟಣ',
    expectedIntent: 'food_khanavali_query',
  },
  {
    id: 'blr-22',
    category: 'bengaluru_colloquial',
    spokenText: 'ಶಿವನಸಮುದ್ರ ಫಾಲ್ಸ್ ನೋಡೋಕೆ ಮಳೆಗಾಲದಲ್ಲಿ ಬೆಸ್ಟ್ ಟೈಮ್ ಯಾವುದು?',
    expectedDestination: 'ಶಿವನಸಮುದ್ರ',
    expectedIntent: 'weather_season_query',
  },
  {
    id: 'blr-23',
    category: 'bengaluru_colloquial',
    spokenText: 'ಸಾವನದುರ್ಗ ಬೆಟ್ಟ ಟ್ರೆಕ್ಕಿಂಗ್ ಮಾಡೋಕೆ ಪರ್ಮಿಷನ್ ಬೇಕಾ?',
    expectedDestination: 'ಸಾವನದುರ್ಗ',
    expectedIntent: 'corridor_advice_query',
  },
  {
    id: 'blr-24',
    category: 'bengaluru_colloquial',
    spokenText: 'ರಾಮನಗರ ಶೋಲೆ ಬೆಟ್ಟಕ್ಕೆ ಹೋಗಿ ರಾಕ್ ಕ್ಲೈಂಬಿಂಗ್ ಮಾಡ್ಬೇಕು',
    expectedDestination: 'ರಾಮನಗರ',
    expectedIntent: 'route_search',
  },
  {
    id: 'blr-25',
    category: 'bengaluru_colloquial',
    spokenText: 'ಮಂಗಳೂರಿಗೆ ವಿಸ್ಟಾಡೋಮ್ ಟ್ರೈನ್ ಟಿಕೆಟ್ ಸಿಗುತ್ತಾ ಚೆಕ್ ಮಾಡಿ',
    expectedDestination: 'ಮಂಗಳೂರು',
    expectedIntent: 'route_search',
  },
  {
    id: 'blr-26',
    category: 'bengaluru_colloquial',
    spokenText: 'ಬೇಲೂರು ಚೆನ್ನಕೇಶವ ಟೆಂಪಲ್ ಹತ್ರ ಒಳ್ಳೆ ಮಧ್ಯಾಹ್ನದ ಊಟ ಎಲ್ಲಿ ಸಿಗುತ್ತೆ?',
    expectedDestination: 'ಬೇಲೂರು',
    expectedIntent: 'food_khanavali_query',
  },
  {
    id: 'blr-27',
    category: 'bengaluru_colloquial',
    spokenText: 'ಮುಳ್ಳಯ್ಯನಗಿರಿ ಮೇಲೆ ಸಂಜೆ ಐದೂವರೆಗೆ ಗೇಟ್ ಕ್ಲೋಸ್ ಮಾಡ್ತಾರಾ ಬ್ರೋ?',
    expectedDestination: 'ಮುಳ್ಳಯ್ಯನಗಿರಿ',
    expectedIntent: 'corridor_advice_query',
  },
  {
    id: 'blr-28',
    category: 'bengaluru_colloquial',
    spokenText: 'ಹೊಸಕೋಟೆ ಬಿರಿಯಾನಿ ತಿನ್ನೋಕೆ ಮುಂಜಾನೆ ಎಷ್ಟು ಗಂಟೆಗೆ ಹೋಗ್ಬೇಕು?',
    expectedDestination: 'ಹೊಸಕೋಟೆ',
    expectedIntent: 'food_khanavali_query',
  },
  {
    id: 'blr-29',
    category: 'bengaluru_colloquial',
    spokenText: 'ದೊಡ್ಡ ಆಲದ ಮರ ಮತ್ತು ಮಂಚನಬೆಲೆ ಡ್ಯಾಮ್ ನೋಡಲು ಹಾಫ್ ಡೇ ಟ್ರಿಪ್',
    expectedDestination: 'ದೊಡ್ಡ ಆಲದ ಮರ',
    expectedIntent: 'route_search',
  },
  {
    id: 'blr-30',
    category: 'bengaluru_colloquial',
    spokenText: 'ಕೊಡಗಿನಲ್ಲಿ ಮಡಿಕೇರಿ ಕೋಟೆ ಮತ್ತು ಅಬ್ಬಿ ಫಾಲ್ಸ್ ನೋಡಲು ಪ್ಲಾನ್ ಕೊಡಿ',
    expectedDestination: 'ಕೊಡಗು',
    expectedIntent: 'route_search',
  },

  // 3. OLD MYSURU (31-42)
  {
    id: 'mys-31',
    category: 'old_mysuru',
    spokenText: 'ಮೈಸೂರು ಅರಮನೆ ಮತ್ತು ಚಾಮುಂಡಿ ಬೆಟ್ಟ ದರ್ಶನಕ್ಕೆ ಒಂದು ದಿನದ ಯಾತ್ರೆ',
    expectedDestination: 'ಮೈಸೂರು ಅರಮನೆ',
    expectedDurationDays: 1,
    expectedIntent: 'route_search',
  },
  {
    id: 'mys-32',
    category: 'old_mysuru',
    spokenText: 'ಶ್ರೀರಂಗಪಟ್ಟಣದ ರಂಗನಾಥಸ್ವಾಮಿ ಗುಡಿ ಮತ್ತು ನಿಮಿಷಾಂಬಾ ದೇವಸ್ಥಾನ ಪ್ರವಾಸ',
    expectedDestination: 'ಶ್ರೀರಂಗಪಟ್ಟಣ',
    expectedIntent: 'route_search',
  },
  {
    id: 'mys-33',
    category: 'old_mysuru',
    spokenText: 'ತಲಕಾಡಿನ ಮರಳು ಕಾಡು ಮತ್ತು ಪಂಚಲಿಂಗ ದರ್ಶನಕ್ಕೆ ಹೋಗಬೇಕು',
    expectedDestination: 'ತಲಕಾಡು',
    expectedIntent: 'route_search',
  },
  {
    id: 'mys-34',
    category: 'old_mysuru',
    spokenText: 'ಸೋಮನಾಥಪುರದ ಪ್ರಸನ್ನ ಚೆನ್ನಕೇಶವ ಹೊಯ್ಸಳ ದೇಗುಲ ನೋಡಲು ದಾರಿ ಯಾವುದು?',
    expectedDestination: 'ಸೋಮನಾಥಪುರ',
    expectedIntent: 'route_search',
  },
  {
    id: 'mys-35',
    category: 'old_mysuru',
    spokenText: 'ಮೇಲುಕೋಟೆ ಚೆಲುವನಾರಾಯಣ ಸ್ವಾಮಿ ದರ್ಶನ ಮತ್ತು ಪುಳಿಯೋಗರೆ ಪ್ರಸಾದ',
    expectedDestination: 'ಮೇಲುಕೋಟೆ',
    expectedIntent: 'food_khanavali_query',
  },
  {
    id: 'mys-36',
    category: 'old_mysuru',
    spokenText: 'ಹಿಮವದ್ ಗೋಪಾಲಸ್ವಾಮಿ ಬೆಟ್ಟಕ್ಕೆ ಬಸ್ಸು ಯಾವಾಗ ಹೊರಡುತ್ತದೆ?',
    expectedDestination: 'ಗೋಪಾಲಸ್ವಾಮಿ ಬೆಟ್ಟ',
    expectedIntent: 'corridor_advice_query',
  },
  {
    id: 'mys-37',
    category: 'old_mysuru',
    spokenText: 'ಬಂಡೀಪುರ ಹುಲಿ ಸಂರಕ್ಷಿತಾರಣ್ಯದಲ್ಲಿ ಬೆಳಗ್ಗೆ ಸಫಾರಿ ಬುಕಿಂಗ್ ವಿವರ',
    expectedDestination: 'ಬಂಡೀಪುರ',
    expectedIntent: 'route_search',
  },
  {
    id: 'mys-38',
    category: 'old_mysuru',
    spokenText: 'ರಂಗನತಿಟ್ಟು ಪಕ್ಷಿಧಾಮದಲ್ಲಿ ದೋಣಿ ವಿಹಾರಕ್ಕೆ ಟಿಕೆಟ್ ದರ ಎಷ್ಟು?',
    expectedDestination: 'ರಂಗನತಿಟ್ಟು',
    expectedIntent: 'budget_query',
  },
  {
    id: 'mys-39',
    category: 'old_mysuru',
    spokenText: 'ಶ್ರವಣಬೆಳಗೊಳದ ಗೊಮ್ಮಟೇಶ್ವರ ಬಾಹುಬಲಿ ಸ್ವಾಮಿ ಮಹಾಮಸ್ತಕಾಭಿಷೇಕ ಕ್ಷೇತ್ರ ದರ್ಶನ',
    expectedDestination: 'ಶ್ರವಣಬೆಳಗೊಳ',
    expectedIntent: 'route_search',
  },
  {
    id: 'mys-40',
    category: 'old_mysuru',
    spokenText: 'ಮೈಸೂರಿನ ಮೈಲಾರಿ ದೋಸೆ ತಿನ್ನಲು ಹೊಟೇಲ್ ಎಲ್ಲಿ ಬರುತ್ತೆ ಸ್ವಾಮಿ?',
    expectedDestination: 'ಮೈಸೂರು',
    expectedIntent: 'food_khanavali_query',
  },
  {
    id: 'mys-41',
    category: 'old_mysuru',
    spokenText: 'ನಂಜನಗೂಡು ಶ್ರೀ ಶ್ರೀಕಂಠೇಶ್ವರ ನಂಜುಂಡೇಶ್ವರ ದೇವಸ್ಥಾನ ಪ್ರವಾಸ',
    expectedDestination: 'ನಂಜನಗೂಡು',
    expectedIntent: 'route_search',
  },
  {
    id: 'mys-42',
    category: 'old_mysuru',
    spokenText: 'ಮಲೆ ಮಹದೇಶ್ವರ ಬೆಟ್ಟಕ್ಕೆ ಭಕ್ತಾದಿಗಳ ಪಾದಯಾತ್ರೆ ಮಾರ್ಗ ವಿವರ',
    expectedDestination: 'ಎಂಎಂ ಹಿಲ್ಸ್',
    expectedIntent: 'corridor_advice_query',
  },

  // 4. KUNDAGANNADA & COASTAL (43-54)
  {
    id: 'knd-43',
    category: 'kundagannada_coastal',
    spokenText: 'ಕುಂದಾಪುರ ಕಡೆಯಿಂದ ಕೊಲ್ಲೂರು ಮೂಕಾಂಬಿಕಾ ದೇವಸ್ಥಾನಕ್ಕೆ ಹೋಪುದು ಎಂತಾ ಮಾರೆ',
    expectedDestination: 'ಕೊಲ್ಲೂರು',
    expectedIntent: 'route_search',
  },
  {
    id: 'knd-44',
    category: 'kundagannada_coastal',
    spokenText: 'ಮರವಂತೆ ಕಡಲತೀರದಲ್ಲಿ ಸಮುದ್ರ ಮತ್ತೆ ನದಿ ಒಟ್ಟಿಗೆ ನೋಡೋ ಮಜಾನೇ ಬೇರೆ',
    expectedDestination: 'ಮರವಂತೆ',
    expectedIntent: 'route_search',
  },
  {
    id: 'knd-45',
    category: 'kundagannada_coastal',
    spokenText: 'ಉಡುಪೀಲಿ ಮಟ್ಟು ಗುಳ್ಳ ಸಾಂಬಾರ್ ಮತ್ತೆ ನೀರ್ ದೋಸೆ ಎಲ್ಲಿ ಸಿಕ್ಕುತ್ತ್?',
    expectedDestination: 'ಉಡುಪಿ',
    expectedIntent: 'food_khanavali_query',
  },
  {
    id: 'knd-46',
    category: 'kundagannada_coastal',
    spokenText: 'ಆನೆಗುಡ್ಡೆ ವಿನಾಯಕನ ದರ್ಶನ ಪಡ್ಕೊಂಡು ಕೋಟ ತಟ್ಟಿರಾಯನ ಗುಡಿಗೆ ಹೋಗಣ',
    expectedDestination: 'ಆನೆಗುಡ್ಡೆ',
    expectedIntent: 'route_search',
  },
  {
    id: 'knd-47',
    category: 'kundagannada_coastal',
    spokenText: 'ಮಲ್ಪೆ ಸೈಂಟ್ ಮೇರಿಸ್ ಐಲ್ಯಾಂಡ್‌ಗೆ ಬೋಟ್ ಸರ್ವೀಸ್ ಯಾವಾಗ ಓಪನ್ ಆಗ್ತದೆ?',
    expectedDestination: 'ಸೈಂಟ್ ಮೇರಿಸ್',
    expectedIntent: 'corridor_advice_query',
  },
  {
    id: 'knd-48',
    category: 'kundagannada_coastal',
    spokenText: 'ಬೈಂದೂರು ಒಟ್ಟಿನೆಣೆ ಸನ್‌ಸೆಟ್ ಪಾಯಿಂಟ್ ನೋಡಲು ಎರಡು ದಿನದ ಟ್ರಿಪ್',
    expectedDestination: 'ಬೈಂದೂರು',
    expectedDurationDays: 2,
    expectedIntent: 'route_search',
  },
  {
    id: 'knd-49',
    category: 'kundagannada_coastal',
    spokenText: 'ಕಾರ್ಕಳ ಗೊಮ್ಮಟೇಶ್ವರ ಮತ್ತು ಮೂಡುಬಿದಿರೆ ಸಾವಿರ ಕಂಬದ ಬಸದಿ ನೋಡಬೇಕು',
    expectedDestination: 'ಮೂಡುಬಿದಿರೆ',
    expectedIntent: 'route_search',
  },
  {
    id: 'knd-50',
    category: 'kundagannada_coastal',
    spokenText: 'ಕರಾವಳಿ ತೀರದಲ್ಲಿ ಮಳೆ ಗಾಳಿ ಹೆಂಗದೆ ಇವತ್ತು?',
    expectedIntent: 'weather_season_query',
  },
  {
    id: 'knd-51',
    category: 'kundagannada_coastal',
    spokenText: 'ಧರ್ಮಸ್ಥಳ ಮಂಜುನಾಥ ಸ್ವಾಮಿ ದರ್ಶನ ಮತ್ತು ಅಣ್ಣಪ್ಪ ಬೆಟ್ಟಕ್ಕೆ ಹೋಗಬೇಕು',
    expectedDestination: 'ಧರ್ಮಸ್ಥಳ',
    expectedIntent: 'route_search',
  },
  {
    id: 'knd-52',
    category: 'kundagannada_coastal',
    spokenText: 'ಕುಕ್ಕೆ ಸುಬ್ರಹ್ಮಣ್ಯ ಸರ್ಪ ಸಂಸ್ಕಾರ ಸೇವೆ ವಿವರ ಮತ್ತು ಮಾರ್ಗ ಮಾಹಿತಿ',
    expectedDestination: 'ಕುಕ್ಕೆ ಸುಬ್ರಹ್ಮಣ್ಯ',
    expectedIntent: 'route_search',
  },
  {
    id: 'knd-53',
    category: 'kundagannada_coastal',
    spokenText: 'ಮಂಗಳೂರು ಪಬ್ಬಾಸ್ ಐಸ್ ಕ್ರೀಮ್ ತಿನ್ನಲು ಎಲ್ಲಿದೆ ಅಣ್ಣಾ?',
    expectedDestination: 'ಮಂಗಳೂರು',
    expectedIntent: 'food_khanavali_query',
  },
  {
    id: 'knd-54',
    category: 'kundagannada_coastal',
    spokenText: 'ಕಾಪು ಬೀಚ್ ಲೈಟ್‌ಹೌಸ್ ಹತ್ತೋಕೆ ಸಂಜೆ ಟೈಮಿಂಗ್ಸ್ ಎಷ್ಟೊತ್ತು?',
    expectedDestination: 'ಕಾಪು ಬೀಚ್',
    expectedIntent: 'corridor_advice_query',
  },

  // 5. HAVYAKA & MALNAD (55-66)
  {
    id: 'hvy-55',
    category: 'havyaka_malnad',
    spokenText: 'ಶಿರಸಿ ಮಾರಿಕಾಂಬಾ ಅಮ್ಮನ ದರ್ಶನ ತಗೊಂಡು ಯಾಣದ ಗುಹೆ ನೋಡೋಣು',
    expectedDestination: 'ಯಾಣ',
    expectedIntent: 'route_search',
  },
  {
    id: 'hvy-56',
    category: 'havyaka_malnad',
    spokenText: 'ಅಗುಂಬೆ ಘಾಟೀಲಿ ಸೂರ್ಯಾಸ್ತ ನೋಡೋಕೆ ಹೋದರೆ ಮಳೆ ಬರ್ತದಾ?',
    expectedDestination: 'ಅಗುಂಬೆ',
    expectedIntent: 'weather_season_query',
  },
  {
    id: 'hvy-57',
    category: 'havyaka_malnad',
    spokenText: 'ಸಾಗರದ ಇಕ್ಕೇರಿ ಅಘೋರೇಶ್ವರ ಮತ್ತು ಕೆಳದಿ ಶಿವಪ್ಪ ನಾಯಕ ಅರಮನೆ',
    expectedDestination: 'ಇಕ್ಕೇರಿ',
    expectedIntent: 'route_search',
  },
  {
    id: 'hvy-58',
    category: 'havyaka_malnad',
    spokenText: 'ಶೃಂಗೇರಿ ಶಾರದಾಂಬೆ ದರ್ಶನ ಮತ್ತು ತುಂಗಾ ನದಿ ಮೀನುಗಳಿಗೆ ಅರಳು ಹಾಕುವುದು',
    expectedDestination: 'ಶೃಂಗೇರಿ',
    expectedIntent: 'route_search',
  },
  {
    id: 'hvy-59',
    category: 'havyaka_malnad',
    spokenText: 'ಕುದುರೆಮುಖ ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನ ಟ್ರೆಕ್ಕಿಂಗ್ ಅರಣ್ಯ ಅನುಮತಿ ಪತ್ರ ಬೇಕಾ?',
    expectedDestination: 'ಕುದುರೆಮುಖ',
    expectedIntent: 'corridor_advice_query',
  },
  {
    id: 'hvy-60',
    category: 'havyaka_malnad',
    spokenText: 'ಹೊನ್ನಾವರ ಶರಾವತಿ ಹಿನ್ನೀರು ಬೋಟಿಂಗ್ ಮತ್ತು ಮ್ಯಾಂಗ್ರೋವ್ ಕಾಡು ಸಫಾರಿ',
    expectedDestination: 'ಹೊನ್ನಾವರ',
    expectedIntent: 'route_search',
  },
  {
    id: 'hvy-61',
    category: 'havyaka_malnad',
    spokenText: 'ಕವಲೇದುರ್ಗ ಕೋಟೆ ಚಾರಣಕ್ಕೆ ಬೆಳಗ್ಗೆ ಹೋಗೋದು ಹಿತವೇ?',
    expectedDestination: 'ಕವಲೇದುರ್ಗ',
    expectedIntent: 'route_search',
  },
  {
    id: 'hvy-62',
    category: 'havyaka_malnad',
    spokenText: 'ಬನವಾಸಿ ಮಧುಕೇಶ್ವರ ದೇವಾಲಯ ಮತ್ತು ಪಂಪನ ಕದಂಬೋತ್ಸವ ಕ್ಷೇತ್ರ ದರ್ಶನ',
    expectedDestination: 'ಬನವಾಸಿ',
    expectedIntent: 'route_search',
  },
  {
    id: 'hvy-63',
    category: 'havyaka_malnad',
    spokenText: 'ಉಂಚಳ್ಳಿ ಜಲಪಾತ ಮತ್ತು ಮುಂಡಿಗೆಸರ ಜಲಪಾತ ನೋಡಲು ಟ್ರಿಪ್ ಪ್ಲಾನ್',
    expectedDestination: 'ಉಂಚಳ್ಳಿ ಫಾಲ್ಸ್',
    expectedIntent: 'route_search',
  },
  {
    id: 'hvy-64',
    category: 'havyaka_malnad',
    spokenText: 'ತೀರ್ಥಹಳ್ಳಿ ಕುಪ್ಪಳ್ಳಿ ಕುವೆಂಪು ಅವರ ಕವಿಮನೆ ಸ್ಮಾರಕ ವೀಕ್ಷಣೆ',
    expectedDestination: 'ಕುಪ್ಪಳ್ಳಿ',
    expectedIntent: 'route_search',
  },
  {
    id: 'hvy-65',
    category: 'havyaka_malnad',
    spokenText: 'ಮಲೆನಾಡಿನ ಕಡೆ ಹಲಸಿನ ಹಪ್ಪಳ ಮತ್ತು ತೊಡದೇವು ಊಟ ಎಲ್ಲಿ ಸಿಗ್ತದೆ?',
    expectedIntent: 'food_khanavali_query',
  },
  {
    id: 'hvy-66',
    category: 'havyaka_malnad',
    spokenText: 'ಕಳಸ ಕಳಸೇಶ್ವರ ಮತ್ತು ಹೊರನಾಡು ಅನ್ನಪೂರ್ಣೇಶ್ವರಿ ದೇವಾಲಯ ಯಾತ್ರೆ',
    expectedDestination: 'ಹೊರನಾಡು',
    expectedIntent: 'route_search',
  },

  // 6. KALYANA KARNATAKA (67-78)
  {
    id: 'kly-67',
    category: 'kalyana_karnataka',
    spokenText: 'ಕಲಬುರಗಿ ಕೋಟೆ ಮತ್ತು ಖ್ವಾಜಾ ಬಂದೇ ನವಾಜ್ ದರ್ಗಾ ನೋಡಾಕ ಹೊಂಟೇವಿ',
    expectedDestination: 'ಕಲಬುರಗಿ',
    expectedIntent: 'route_search',
  },
  {
    id: 'kly-68',
    category: 'kalyana_karnataka',
    spokenText: 'ಬೀದರ್ ಕೋಟೆ ಮತ್ತು ಮಹಮೂದ್ ಗವಾನ್ ಮದರಸಾ ನೋಡಾಕ ಎರಡು ದಿನ ಬೇಕ್ರಿ',
    expectedDestination: 'ಬೀದರ್',
    expectedDurationDays: 2,
    expectedIntent: 'route_search',
  },
  {
    id: 'kly-69',
    category: 'kalyana_karnataka',
    spokenText: 'ಬಸವಕಲ್ಯಾಣ ಅನುಭವ ಮಂಟಪ ಮತ್ತು ಶರಣರ ಬಸವೇಶ್ವರ ಸ್ಮಾರಕ ದರ್ಶನ',
    expectedDestination: 'ಬಸವಕಲ್ಯಾಣ',
    expectedIntent: 'route_search',
  },
  {
    id: 'kly-70',
    category: 'kalyana_karnataka',
    spokenText: 'ಉತ್ತರ ಕರ್ನಾಟಕ ಖಡಕ್ ರೊಟ್ಟಿ ಮತ್ತೆ ಎಣಗಾಯಿ ಪಲ್ಯ ಎಲ್ಲಿ ರುಚಿ ಸಿಗತೈತಿ?',
    expectedIntent: 'food_khanavali_query',
  },
  {
    id: 'kly-71',
    category: 'kalyana_karnataka',
    spokenText: 'ಸನ್ನತಿ ಬೌದ್ಧ ಸ್ತೂಪ ಮತ್ತು ಅಶೋಕನ ಶಿಲಾಶಾಸನ ವೀಕ್ಷಣೆ ಪ್ರವಾಸ',
    expectedDestination: 'ಸನ್ನತಿ',
    expectedIntent: 'route_search',
  },
  {
    id: 'kly-72',
    category: 'kalyana_karnataka',
    spokenText: 'ರಾಯಚೂರು ಕೋಟೆ ಮತ್ತು ಕೃಷ್ಣಾ ನದಿ ಸಂಗಮ ನೋಡಾಕ ಹೋಗಬೇಕ್ರೀ',
    expectedDestination: 'ರಾಯಚೂರು',
    expectedIntent: 'route_search',
  },
  {
    id: 'kly-73',
    category: 'kalyana_karnataka',
    spokenText: 'ಯಾದಗಿರಿ ಮಲ್ಲೇಶ್ವರ ಬೆಟ್ಟ ಮತ್ತು ವನದುರ್ಗ ಕೋಟೆ ದರ್ಶನ',
    expectedDestination: 'ಯಾದಗಿರಿ',
    expectedIntent: 'route_search',
  },
  {
    id: 'kly-74',
    category: 'kalyana_karnataka',
    spokenText: 'ಕೊಪ್ಪಳದ ಕಿನ್ನಾಳ ಆಟಿಕೆಗಳ ಕರಕುಶಲ ಕಲೆ ತಯಾರಿಕೆ ನೋಡಲು ಎಲ್ಲಿ ಹೋಗಬೇಕು?',
    expectedDestination: 'ಕೊಪ್ಪಳ',
    expectedIntent: 'route_search',
  },
  {
    id: 'kly-75',
    category: 'kalyana_karnataka',
    spokenText: 'ಬಳ್ಳಾರಿ ಕೋಟೆ ಕಡಿದಾದ ಏಕಶಿಲಾ ಗುಡ್ಡ ಹತ್ತಲು ಎಷ್ಟು ಹೊತ್ತು ಹಿಡೀತೈತಿ?',
    expectedDestination: 'ಬಳ್ಳಾರಿ',
    expectedIntent: 'corridor_advice_query',
  },
  {
    id: 'kly-76',
    category: 'kalyana_karnataka',
    spokenText: 'ಕೂಡ್ಲಿಗಿ ಉಜ್ಜಯಿನಿ ಪೀಠ ಮತ್ತು ಕೊಟ್ಟೂರು ಗುರು ಬಸವೇಶ್ವರ ರಥೋತ್ಸವ',
    expectedDestination: 'ಕೊಟ್ಟೂರು',
    expectedIntent: 'route_search',
  },
  {
    id: 'kly-77',
    category: 'kalyana_karnataka',
    spokenText: 'ಹೈದರಾಬಾದ್ ಕರ್ನಾಟಕ ಭಾಗದಲ್ಲಿ ಬಿಸಿಲು ಭಾಳ ಅದ ಮಧ್ಯಾಹ್ನ ಹೊರಗ ಹೋಗಬ್ಯಾಡ್ರಿ',
    expectedIntent: 'weather_season_query',
  },
  {
    id: 'kly-78',
    category: 'kalyana_karnataka',
    spokenText: 'ಗಾಣಗಾಪುರ ದತ್ತಾತ್ರೇಯ ಕ್ಷೇತ್ರಕ್ಕೆ ಅಮಾವಾಸ್ಯೆ ದರ್ಶನಕ್ಕೆ ಎಷ್ಟು ಖರ್ಚು ಬರತದ?',
    expectedDestination: 'ಗಾಣಗಾಪುರ',
    expectedIntent: 'budget_query',
  },

  // 7. KITTUR KARNATAKA (79-90)
  {
    id: 'ktr-79',
    category: 'kittur_karnataka',
    spokenText: 'ಕಿತ್ತೂರು ರಾಣಿ ಚೆನ್ನಮ್ಮನ ಕೋಟೆ ಮತ್ತು ಸಂಗೊಳ್ಳಿ ರಾಯಣ್ಣ ಸ್ಮಾರಕ ದರ್ಶನ',
    expectedDestination: 'ಕಿತ್ತೂರು',
    expectedIntent: 'route_search',
  },
  {
    id: 'ktr-80',
    category: 'kittur_karnataka',
    spokenText: 'ಬೆಳಗಾವಿ ಕೋಟೆ ಕಮಲ ಬಸದಿ ಮತ್ತು ಸುವರ್ಣ ವಿಧಾನಸೌಧ ನೋಡಲು ಪ್ಲಾನ್ ಕೊಡಿ',
    expectedDestination: 'ಬೆಳಗಾವಿ',
    expectedIntent: 'route_search',
  },
  {
    id: 'ktr-81',
    category: 'kittur_karnataka',
    spokenText: 'ಧಾರವಾಡ ಪೇಡಾ ಮತ್ತು ಮಿರ್ಚಿ ಬಜ್ಜಿ ಎಲ್ಲಿ ಚೊಲೋ ಸಿಗತದ್ರೀ?',
    expectedDestination: 'ಧಾರವಾಡ',
    expectedIntent: 'food_khanavali_query',
  },
  {
    id: 'ktr-82',
    category: 'kittur_karnataka',
    spokenText: 'ಹುಬ್ಬಳ್ಳಿ ಸಿದ್ಧಾರೂಢ ಮಠ ಮತ್ತು ಉಣಕಲ್ ಕೆರೆಗೆ ಸಂಜೆ ಹೋಗೋಣ',
    expectedDestination: 'ಹುಬ್ಬಳ್ಳಿ',
    expectedIntent: 'route_search',
  },
  {
    id: 'ktr-83',
    category: 'kittur_karnataka',
    spokenText: 'ಗೋಕಾಕ್ ಜಲಪಾತ ತೂಗುಸೇತುವೆ ಮೇಲೆ ನೀರು ಧುಮುಕೋ ದೃಶ್ಯ ಅದ್ಭುತ',
    expectedDestination: 'ಗೋಕಾಕ್ ಜಲಪಾತ',
    expectedIntent: 'route_search',
  },
  {
    id: 'ktr-84',
    category: 'kittur_karnataka',
    spokenText: 'ಸವದತ್ತಿ ರೇಣುಕಾ ಎಲ್ಲಮ್ಮನ ಗುಡ್ಡಕ್ಕೆ ಮಂಗಳವಾರ ಜತ್ರೆಗೆ ಹೋಗಬೇಕು',
    expectedDestination: 'ಸವದತ್ತಿ',
    expectedIntent: 'route_search',
  },
  {
    id: 'ktr-85',
    category: 'kittur_karnataka',
    spokenText: 'ಗದಗ ತ್ರಿಕೂಟೇಶ್ವರ ದೇವಾಲಯ ಮತ್ತು ಲಕ್ಕುಂಡಿ ಕಲ್ಯಾಣಿ ಬಾವಿಗಳು',
    expectedDestination: 'ಗದಗ',
    expectedIntent: 'route_search',
  },
  {
    id: 'ktr-86',
    category: 'kittur_karnataka',
    spokenText: 'ಹಾವೇರಿ ಏಲಕ್ಕಿ ನಗರ ಮತ್ತು ಮೈಲಾರ ಲಿಂಗೇಶ್ವರ ಕಾರ್ಣಿಕ ಕ್ಷೇತ್ರ',
    expectedDestination: 'ಹಾವೇರಿ',
    expectedIntent: 'route_search',
  },
  {
    id: 'ktr-87',
    category: 'kittur_karnataka',
    spokenText: 'ದಾವಣಗೆರೆ ಬೆಣ್ಣೆ ದೋಸೆ ತಿನ್ನಲು ಹಳೆ ಊರಲ್ಲಿ ಒಳ್ಳೆ ಹೋಟೆಲ್ ಯಾವುದು?',
    expectedDestination: 'ದಾವಣಗೆರೆ',
    expectedIntent: 'food_khanavali_query',
  },
  {
    id: 'ktr-88',
    category: 'kittur_karnataka',
    spokenText: 'ಚಿತ್ರದುರ್ಗದ ಏಳು ಸುತ್ತಿನ ಕಲ್ಲುಕೋಟೆ ಮತ್ತು ಒನಕೆ ಓಬವ್ವನ ಕಿಂಡಿ',
    expectedDestination: 'ಚಿತ್ರದುರ್ಗ',
    expectedIntent: 'route_search',
  },
  {
    id: 'ktr-89',
    category: 'kittur_karnataka',
    spokenText: 'ದಾಂಡೇಲಿ ಕಾಳಿ ನದಿಯಲ್ಲಿ ವೈಟ್ ವಾಟರ್ ರಾಫ್ಟಿಂಗ್ ಮಾಡಾಕ ಹೋಗಬೇಕು',
    expectedDestination: 'ದಾಂಡೇಲಿ',
    expectedIntent: 'route_search',
  },
  {
    id: 'ktr-90',
    category: 'kittur_karnataka',
    spokenText: 'ಐಹೊಳೆ ದುರ್ಗಾ ದೇವಾಲಯ ವಾಸ್ತುಶಿಲ್ಪದ ತೊಟ್ಟಿಲು ನೋಡಲು ಮೂರು ದಿನ ಬೇಕ್ರಿ',
    expectedDestination: 'ಐಹೊಳೆ',
    expectedDurationDays: 3,
    expectedIntent: 'route_search',
  },

  // 8. KANGLISH CODE-SWITCHING (91-100)
  {
    id: 'kgl-91',
    category: 'kannada_english_codeswitch',
    spokenText: 'Plan a 3 days trip from Bangalore to Chikmagalur under 5000 budget',
    expectedOrigin: 'ಬೆಂಗಳೂರು',
    expectedDestination: 'ಚಿಕ್ಕಮಗಳೂರು',
    expectedDurationDays: 3,
    expectedBudgetInr: 5000,
    expectedIntent: 'route_search',
  },
  {
    id: 'kgl-92',
    category: 'kannada_english_codeswitch',
    spokenText: 'Mysore palace inda Coorg ge ಹೋಗೋಕೆ best route ಯಾವುದು?',
    expectedOrigin: 'ಮೈಸೂರು',
    expectedDestination: 'ಕೊಡಗು',
    expectedIntent: 'route_search',
  },
  {
    id: 'kgl-93',
    category: 'kannada_english_codeswitch',
    spokenText: 'Is KSRTC bus free for women under Shakti scheme to Dharmasthala?',
    expectedDestination: 'ಧರ್ಮಸ್ಥಳ',
    expectedIntent: 'budget_query',
    isFemalePassenger: true,
  },
  {
    id: 'kgl-94',
    category: 'kannada_english_codeswitch',
    spokenText: 'Hampi heritage ruins ನೋಡೋಕೆ weekend 2 days itinerary ಕೊಡಿ',
    expectedDestination: 'ಹಂಪಿ',
    expectedDurationDays: 2,
    expectedIntent: 'route_search',
  },
  {
    id: 'kgl-95',
    category: 'kannada_english_codeswitch',
    spokenText: 'Shiradi ghat road condition monsoon nalli safe ಇದೆಯಾ?',
    expectedIntent: 'corridor_advice_query',
  },
  {
    id: 'kgl-96',
    category: 'kannada_english_codeswitch',
    spokenText: 'Mullayanagiri peak gate timings ಸಂಜೆ ಎಷ್ಟೊತ್ತಿಗೆ close ಆಗುತ್ತೆ?',
    expectedDestination: 'ಮುಳ್ಳಯ್ಯನಗಿರಿ',
    expectedIntent: 'corridor_advice_query',
  },
  {
    id: 'kgl-97',
    category: 'kannada_english_codeswitch',
    spokenText: 'Bangalore inda Jog falls ge Vande Bharat or express train ಇದೆಯಾ?',
    expectedOrigin: 'ಬೆಂಗಳೂರು',
    expectedDestination: 'ಜೋಗ ಜಲಪಾತ',
    expectedIntent: 'route_search',
  },
  {
    id: 'kgl-98',
    category: 'kannada_english_codeswitch',
    spokenText: 'Badami caves and Pattadakal UNESCO monuments ticket booking online ಮಾಡ್ಬೇಕಾ?',
    expectedDestination: 'ಬಾದಾಮಿ',
    expectedIntent: 'corridor_advice_query',
  },
  {
    id: 'kgl-99',
    category: 'kannada_english_codeswitch',
    spokenText: 'Gokarna beach trekking permit forest department inda ತಗೋಬೇಕಾ?',
    expectedDestination: 'ಗೋಕರ್ಣ',
    expectedIntent: 'corridor_advice_query',
  },
  {
    id: 'kgl-100',
    category: 'kannada_english_codeswitch',
    spokenText: 'Emergency hospital helpline and 112 police contact Hassan district ನಲ್ಲಿ ಬೇಕು',
    expectedDestination: 'ಹಾಸನ',
    expectedIntent: 'emergency_query',
  },
];

/**
 * Calculates token-level Word Error Rate (WER) between hypothesis and reference
 */
export function calculateTokenWER(reference: string, hypothesis: string): number {
  const refTokens = reference.trim().split(/\s+/);
  const hypTokens = hypothesis.trim().split(/\s+/);

  const m = refTokens.length;
  const n = hypTokens.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (refTokens[i - 1] === hypTokens[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n] / Math.max(1, m);
}

export interface BenchmarkEvaluationResult {
  totalSamples: number;
  intentAccuracy: number;
  originResolutionRate: number;
  destinationResolutionRate: number;
  shaktiDetectionRate: number;
  categoryBreakdown: Record<string, { total: number; correctIntent: number; correctDestination: number }>;
}
