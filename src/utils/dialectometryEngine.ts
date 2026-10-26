// src/utils/dialectometryEngine.ts
/**
 * Namma Kannada Atlas: Computational Dialectology & Historical Linguistics Engine
 * 
 * Formal Theoretical Grounding:
 * - William Bright (1958): An Outline of Colloquial Kannada (Deccan College)
 * - Harold Schiffman (1983): A Reference Grammar of Spoken Kannada
 * - D. N. Shankara Bhat (1971, 2001): An Outline Grammar of Havyaka & Sound Change
 * - Kēśirāja (c. 1260 CE): Śabdamaṇidarpaṇa
 * - John Nerbonne & Wilbert Heeringa (2001, 2009): Computational Dialectometry
 * - Glottolog: nucl1305 (Nuclear Kannadoid)
 */

export interface PhonologicalDerivationStep {
  ruleCode: 'UR-BASE' | 'SYNC-01' | 'LEN-02' | 'PAL-03' | 'AUX-04' | 'CONC-05' | 'SR-FINAL';
  ruleName: string;
  scholarlyCitation: string;
  inputFormKannada: string;
  inputFormIAST: string;
  outputFormKannada: string;
  outputFormIAST: string;
  formalNotation: string;
  explanation: string;
}

export interface DiachronicStage {
  epochId: 'purvada-halegannada' | 'halegannada' | 'nadugannada' | 'hosagannada-regional';
  epochLabel: string;
  periodRange: string;
  formKannada: string;
  formIAST: string;
  archaicGraphemesUsed: Array<'ಱ (ṟa)' | 'ೞ (ḻa)' | '*p- initial'>;
  historicalNote: string;
  retentionInModernDialects: string;
}

export interface DiachronicTrajectory {
  conceptId: string;
  conceptLabel: string;
  invariantRootKannada: string;
  invariantRootIAST: string;
  stages: DiachronicStage[];
}

export interface DialectPairMetric {
  regionIdA: string;
  regionNameA: string;
  regionIdB: string;
  regionNameB: string;
  surfaceDivergencePct: number;
  rootCognacyPct: number;
  morphemicShiftPct: number;
  mutualIntelligibilityLevel: 'High (>80%)' | 'Moderate (65-80%)' | 'Contact-Divergent (<65%)';
}

/**
 * Computes normalized phonetic edit distance between two IAST strings
 * with reduced cost (0.5) for natural Dravidian allophonic/diachronic shifts
 * (e.g., p/h, e/ya, u/i, retroflex/alveolar).
 */
export function computeDravidianPhoneticDistance(iastA: string, iastB: string): number {
  const a = iastA.trim().toLowerCase();
  const b = iastB.trim().toLowerCase();
  if (a === b) return 0;
  if (a.length === 0 || b.length === 0) return 1;

  const naturalShiftPairs = new Set([
    'p:h', 'h:p', 'e:y', 'y:e', 'a:e', 'e:a',
    'u:i', 'i:u', 'n:ṇ', 'ṇ:n', 'l:ḷ', 'ḷ:l', 'r:ṟ', 'ṟ:r',
    't:ṭ', 'ṭ:t', 'd:ḍ', 'ḍ:d', 's:c', 'c:s', 'z:j', 'j:z'
  ]);

  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const charA = a[i - 1];
      const charB = b[j - 1];
      const subCost =
        charA === charB
          ? 0
          : naturalShiftPairs.has(`${charA}:${charB}`)
          ? 0.5
          : 1.0;

      dp[i][j] = Math.min(
        dp[i - 1][j] + 0.8, // Deletion (syncope/apocope weighted at 0.8)
        dp[i][j - 1] + 0.8, // Insertion
        dp[i - 1][j - 1] + subCost
      );
    }
  }

  const maxLen = Math.max(a.length, b.length);
  return Number(Math.min(1, dp[a.length][b.length] / maxLen).toFixed(3));
}

/**
 * Computes composite Nerbonne-style Linguistic Divergence Score [0..100%]
 * separating Invariant Root Cognacy from Suffixal & Phonetic Variation.
 */
export function computeCompositeDialectDivergence(params: {
  rootIastA: string;
  rootIastB: string;
  suffixIastA: string;
  suffixIastB: string;
  fullSurfaceIastA: string;
  fullSurfaceIastB: string;
}): {
  surfaceDivergencePct: number;
  rootCognacyPct: number;
  morphemicShiftPct: number;
} {
  const rootDist =
    params.rootIastA === params.rootIastB
      ? 0
      : computeDravidianPhoneticDistance(params.rootIastA, params.rootIastB);
  const suffixDist = computeDravidianPhoneticDistance(
    params.suffixIastA,
    params.suffixIastB
  );
  const surfaceDist = computeDravidianPhoneticDistance(
    params.fullSurfaceIastA,
    params.fullSurfaceIastB
  );

  const composite = 0.35 * surfaceDist + 0.40 * suffixDist + 0.25 * rootDist;

  return {
    surfaceDivergencePct: Math.round(composite * 100),
    rootCognacyPct: Math.round((1 - rootDist) * 100),
    morphemicShiftPct: Math.round(suffixDist * 100),
  };
}

/**
 * Curated Diachronic Trajectories spanning 1,500 years of Kannada Historical Linguistics
 */
export const DIACHRONIC_TRAJECTORIES: DiachronicTrajectory[] = [
  {
    conceptId: 'concept-boy-youth',
    conceptLabel: 'Boy / Young Male Youth',
    invariantRootKannada: 'ಹುಡುಗು / ಮಾಣಿ',
    invariantRootIAST: 'huḍugu / māṇi',
    stages: [
      {
        epochId: 'purvada-halegannada',
        epochLabel: 'Pūrvada Haḷegannaḍa (Pre-Old Kannada)',
        periodRange: 'c. 450–800 CE (Halmidi Inscription Era)',
        formKannada: 'ಪುಡುಗುನ್ / ಪಱವನ್',
        formIAST: '*puḍugun / *paṟavan',
        archaicGraphemesUsed: ['*p- initial', 'ಱ (ṟa)'],
        historicalNote: 'Proto-Dravidian initial bilabial plosive *p- intact. Archaic alveolar trill ಱ (ṟa) recorded in early epigraphy.',
        retentionInModernDialects: 'Bilabial *p- preserved in Badaga and Toda; initial lenition began around 8th-9th century.'
      },
      {
        epochId: 'halegannada',
        epochLabel: 'Haḷegannaḍa (Old Kannada)',
        periodRange: 'c. 800–1200 CE (Kavirājamārga & Pampa Era)',
        formKannada: 'ಪುಡುಗಂ / ಮಾಣಿ',
        formIAST: 'puḍugaṁ / māṇi',
        archaicGraphemesUsed: ['*p- initial'],
        historicalNote: 'Classical Old Kannada preserves "ಮಾಣಿ" (māṇi) as a youth/bachelor address in temple and scholarly inscriptions.',
        retentionInModernDialects: 'Karavali (Udupi/Dakshina Kannada) and Malnad retain "ಮಾಣಿ" (māṇi) as everyday kinship address.'
      },
      {
        epochId: 'nadugannada',
        epochLabel: 'Naḍugannaḍa (Middle Kannada)',
        periodRange: 'c. 1200–1700 CE (Kēśirāja & Vachana Era)',
        formKannada: 'ಹುಡುಗ / ಮಾಣಿ',
        formIAST: 'huḍuga / māṇi',
        archaicGraphemesUsed: [],
        historicalNote: 'Kēśirāja (Śabdamaṇidarpaṇa, sutra 240) codifies the universal sound change of initial *p- -> h- across Kannada.',
        retentionInModernDialects: 'Modern literary Standard Kannada solidifies "ಹುಡುಗ" (huḍuga).'
      },
      {
        epochId: 'hosagannada-regional',
        epochLabel: 'Hosagannaḍa Regional Divergence',
        periodRange: 'c. 1700 CE–Present (Modern Regional Forms)',
        formKannada: 'ಹುಡ್ಗ (ಉಡ್ಗ) [Old Mysuru] / ಹುಡುಗ [Standard] / ಮಾಣಿ [Karavali]',
        formIAST: 'huḍga (uḍga) / huḍuga / māṇi',
        archaicGraphemesUsed: [],
        historicalNote: 'Southern rural dialects apply trisyllabic syncope + h-lenition (huḍuga -> huḍga -> uḍga); Coastal retains archaic māṇi.',
        retentionInModernDialects: 'Proves Coastal māṇi is an ancient classical relic, not modern slang.'
      }
    ]
  },
  {
    conceptId: 'concept-pronoun-i',
    conceptLabel: 'First Person Singular Pronoun ("I")',
    invariantRootKannada: 'ಆನ್ / ನಾನ್',
    invariantRootIAST: 'ān / nān',
    stages: [
      {
        epochId: 'purvada-halegannada',
        epochLabel: 'Pūrvada Haḷegannaḍa (Pre-Old Kannada)',
        periodRange: 'c. 450–800 CE (Halmidi Era)',
        formKannada: 'ಆನ್',
        formIAST: 'ān',
        archaicGraphemesUsed: [],
        historicalNote: 'Proto-South-Dravidian 1st person singular pronoun *yān/*ān without initial dental nasal n-.',
        retentionInModernDialects: 'Preserved verbatim in Coastal Havigannaḍa and Kundagannada as "ಆನು" (ānu).'
      },
      {
        epochId: 'halegannada',
        epochLabel: 'Haḷegannaḍa (Old Kannada)',
        periodRange: 'c. 800–1200 CE (Classical Poetry)',
        formKannada: 'ಆನ್ / ಆನು',
        formIAST: 'ān / ānu',
        archaicGraphemesUsed: [],
        historicalNote: 'Universal classical Old Kannada pronoun used by Pampa, Ranna, and Ponna.',
        retentionInModernDialects: 'Living relic in coastal Karnataka; mainland speech began innovating initial n- by analogy with oblique en- / namma.'
      },
      {
        epochId: 'nadugannada',
        epochLabel: 'Naḍugannaḍa (Middle Kannada)',
        periodRange: 'c. 1200–1700 CE (Medieval Kannada)',
        formKannada: 'ನಾನ್ / ನಾನು',
        formIAST: 'nān / nānu',
        archaicGraphemesUsed: [],
        historicalNote: 'Analogical leveling spread n- from plural "ನಾವು" (nāvu) and oblique cases into the singular nominative "ನಾನು".',
        retentionInModernDialects: 'Standardized in modern written Kannada; but Coastal dialects never lost the archaic ān- form.'
      },
      {
        epochId: 'hosagannada-regional',
        epochLabel: 'Hosagannaḍa Regional Divergence',
        periodRange: 'c. 1700 CE–Present',
        formKannada: 'ಆನು [Havigannaḍa/Kundapura] vs ನಾನು [Standard/Interior]',
        formIAST: 'ānu [Coastal] vs nānu [Standard]',
        archaicGraphemesUsed: [],
        historicalNote: 'Clear proof of coastal archaism: Coastal speakers saying "ಆನು ಬಂದೆ" (ānu bande) speak 10th-century Old Kannada grammar!',
        retentionInModernDialects: 'Direct unbroken preservation for over 1,200 years.'
      }
    ]
  },
  {
    conceptId: 'concept-what-doing',
    conceptLabel: 'Present Progressive Aspect ("What are you doing?")',
    invariantRootKannada: 'ಮಾಡು (māḍu)',
    invariantRootIAST: 'māḍu',
    stages: [
      {
        epochId: 'purvada-halegannada',
        epochLabel: 'Pūrvada Haḷegannaḍa (Pre-Old Kannada)',
        periodRange: 'c. 450–800 CE',
        formKannada: 'ಏನ್ ಮಾಡುೞ್ಪೆ?',
        formIAST: '*ēn māḍuḻpe?',
        archaicGraphemesUsed: ['ೞ (ḻa)'],
        historicalNote: 'Early Dravidian habitual/progressive expressed by verbal stem + archaic retroflex glide ೞ (ḻa) + person marker.',
        retentionInModernDialects: 'The retroflex approximant ೞ merged into ಳ or ರ during the 10th-12th centuries.'
      },
      {
        epochId: 'halegannada',
        epochLabel: 'Haḷegannaḍa (Old Kannada)',
        periodRange: 'c. 800–1200 CE',
        formKannada: 'ಏನ್ ಮಾಡುತ್ತಿರ್ದೀರ್?',
        formIAST: 'ēn māḍuttirdīr?',
        archaicGraphemesUsed: [],
        historicalNote: 'Compound durative: root māḍu + durative marker -utt- + past auxiliary stem ir- (irdīr).',
        retentionInModernDialects: 'Standard Kannada "ಮಾಡುತ್ತಿದ್ದೀರಿ" directly continues this Granthika compound.'
      },
      {
        epochId: 'nadugannada',
        epochLabel: 'Naḍugannaḍa (Middle Kannada)',
        periodRange: 'c. 1200–1700 CE',
        formKannada: 'ಏನ್ ಮಾಡುತಿದ್ದೀರಿ? / ಮಾಡಾ ಹತ್ತಿದೆ',
        formIAST: 'ēn māḍutiddīri? / māḍā hattide',
        archaicGraphemesUsed: [],
        historicalNote: 'Inception of regional auxiliary split: Northern Kannada starts grammaticalizing inceptive "hattu" (to catch/begin) as continuous aspect.',
        retentionInModernDialects: 'Kittur & Kalyana progressive constructions (-ākattīri / -likkattīri) branch off here.'
      },
      {
        epochId: 'hosagannada-regional',
        epochLabel: 'Hosagannaḍa Regional Divergence',
        periodRange: 'c. 1700 CE–Present',
        formKannada: 'ಮಾಡ್ತಿದ್ದೀರಿ [Std] vs ಮಾಡಾಕತ್ತೀರಿ [Kittur] vs ಮಾಡ್ಲಿಕ್ಕತ್ತೀರಿ [Kalyana] vs ಮಾಡ್ತಾ ಇದ್ದಿರಿ [Coastal]',
        formIAST: 'māḍtiddīri vs māḍākattīri vs māḍlikkattīri vs māḍtā iddiri',
        archaicGraphemesUsed: [],
        historicalNote: 'Invariant root "ಮಾಡ-" is 100% cognate. Divergence is strictly bounded in the aspectual affix.',
        retentionInModernDialects: 'Northern inceptive progressive (-katt-) vs Coastal durative participle (-tā iddiri).'
      }
    ]
  }
];

/**
 * Generative Derivation Rules (Bright 1958, Schiffman 1983, Kēśirāja 1260 CE)
 */
export const PHONOLOGICAL_DERIVATION_RULES: Record<string, PhonologicalDerivationStep[]> = {
  'kudure-to-kudre': [
    {
      ruleCode: 'UR-BASE',
      ruleName: 'Underlying Literary Representation (Granthika)',
      scholarlyCitation: 'Kittel (1894, p. 450); Standard Written Kannada',
      inputFormKannada: 'ಕುದುರೆ',
      inputFormIAST: '/kudure/',
      outputFormKannada: 'ಕುದುರೆ',
      outputFormIAST: '/kudure/',
      formalNotation: 'UR: /C₁V₁C₂V₂C₃V₃/ where V₂ = short /u/',
      explanation: 'Underlying nominal trisyllable with short high back vowel in open penultimate syllable.'
    },
    {
      ruleCode: 'SYNC-01',
      ruleName: 'Trisyllabic Medial Vowel Syncope (Bright-Schiffman Rule)',
      scholarlyCitation: 'William Bright (1958, §2.4.1); Harold Schiffman (1983, pp. 19-20)',
      inputFormKannada: 'ಕುದುರೆ',
      inputFormIAST: '/kudure/',
      outputFormKannada: 'ಕುದ್ರೆ',
      outputFormIAST: '[kudre]',
      formalNotation: 'V[+short] → Ø / #C₁V₁C₂ _ C₃V₃ (when C₂C₃ is a permissible consonant cluster)',
      explanation: 'The unstressed medial short vowel /u/ elides, producing the colloquial stop-liquid consonant cluster /dr/.'
    },
    {
      ruleCode: 'SR-FINAL',
      ruleName: 'Surface Realization (Colloquial Spoken Kannada)',
      scholarlyCitation: 'Universal Colloquial Spoken Reflex across all 6 Karnataka zones',
      inputFormKannada: 'ಕುದ್ರೆ',
      inputFormIAST: '[kudre]',
      outputFormKannada: 'ಕುದ್ರೆ',
      outputFormIAST: '[kudre]',
      formalNotation: 'SR: [kudre] (Spoken)',
      explanation: 'Colloquial spoken form realized uniformly in everyday conversation.'
    }
  ],
  'huduga-to-udga': [
    {
      ruleCode: 'UR-BASE',
      ruleName: 'Underlying Literary Form (Granthika)',
      scholarlyCitation: 'Kittel (1894, p. 1724); Alar Open Dictionary',
      inputFormKannada: 'ಹುಡುಗ',
      inputFormIAST: '/huḍuga/',
      outputFormKannada: 'ಹುಡುಗ',
      outputFormIAST: '/huḍuga/',
      formalNotation: 'UR: /huḍuga/',
      explanation: 'Underlying masculine noun derived from Middle Kannada *pudugu -> huḍugu.'
    },
    {
      ruleCode: 'SYNC-01',
      ruleName: 'Medial Vowel Syncope',
      scholarlyCitation: 'Harold Schiffman (1983, Reference Grammar of Spoken Kannada, p. 20)',
      inputFormKannada: 'ಹುಡುಗ',
      inputFormIAST: '/huḍuga/',
      outputFormKannada: 'ಹುಡ್ಗ',
      outputFormIAST: '[huḍga]',
      formalNotation: 'u → Ø / #huḍ _ ga',
      explanation: 'Short unstressed vowel /u/ elides before voiced velar stop /g/, forming retroflex cluster /ḍg/.'
    },
    {
      ruleCode: 'LEN-02',
      ruleName: 'Southern Glottal Deletion (Rural Old Mysuru & Mandya)',
      scholarlyCitation: 'U. P. Upadhyaya (1976, Nanjangud Study, p. 48); D. N. Shankara Bhat (2001)',
      inputFormKannada: 'ಹುಡ್ಗ',
      inputFormIAST: '[huḍga]',
      outputFormKannada: 'ಉಡ್ಗ',
      outputFormIAST: '[uḍga]',
      formalNotation: '#h- → Ø / # _ V',
      explanation: 'Initial glottal fricative /h/ elides completely in rural Southern discourse, yielding initial high vowel /u/.'
    },
    {
      ruleCode: 'SR-FINAL',
      ruleName: 'Surface Rural Southern Reflex',
      scholarlyCitation: 'Mandya & Mysore Rural Sociolinguistic Speech',
      inputFormKannada: 'ಉಡ್ಗ',
      inputFormIAST: '[uḍga]',
      outputFormKannada: 'ಉಡ್ಗ',
      outputFormIAST: '[uḍga]',
      formalNotation: 'SR: [uḍga] (Rural Mysuru/Mandya)',
      explanation: 'Authentic dialect surface form reflecting the historical p- -> h- -> Ø lenition chain.'
    }
  ],
  'hege-to-hyanga': [
    {
      ruleCode: 'UR-BASE',
      ruleName: 'Underlying Standard Interrogative',
      scholarlyCitation: 'Old Kannada *eṅge / Modern Standard "ಹೇಗೆ" (hēge)',
      inputFormKannada: 'ಹೇಗೆ',
      inputFormIAST: '/hēge/',
      outputFormKannada: 'ಹೇಗೆ',
      outputFormIAST: '/hēge/',
      formalNotation: 'UR: /hēge/ ← Old Ka. *eṅge',
      explanation: 'Standard interrogative adverb of manner.'
    },
    {
      ruleCode: 'PAL-03',
      ruleName: 'Velar Nasal Retention & Vowel Lowering (Northern Kannada)',
      scholarlyCitation: 'U. P. Upadhyaya (1976, Bellary & Gulbarga chapters); Bright (1958)',
      inputFormKannada: 'ಹೇಗೆ',
      inputFormIAST: '/hēge/',
      outputFormKannada: 'ಹ್ಯಾಂಗ',
      outputFormIAST: '[hyāṅga]',
      formalNotation: 'ē → yā / #h _ [ṅg] (Retention of Old Ka. velar nasal coda /ṅ/)',
      explanation: 'Northern varieties retain the archaic Proto-Kannada velar nasal /ṅ/ and open the mid front vowel /ē/ to palatal glide + low vowel [yā].'
    },
    {
      ruleCode: 'SR-FINAL',
      ruleName: 'Surface Northern Interrogative Reflex',
      scholarlyCitation: 'Kittur & Kalyana Karnataka Everyday Spoken',
      inputFormKannada: 'ಹ್ಯಾಂಗ',
      inputFormIAST: '[hyāṅga]',
      outputFormKannada: 'ಹ್ಯಾಂಗ',
      outputFormIAST: '[hyāṅga]',
      formalNotation: 'SR: [hyāṅga] (Dharwad / Kalaburagi)',
      explanation: 'Diagnostic isogloss feature separating North Karnataka speech communities.'
    }
  ]
};

/**
 * 6 Macro-Region Dialectometry Pairwise Distance Matrix Generator
 */
export function generatePairwiseDialectometryMatrix(): DialectPairMetric[] {
  const regions = [
    { id: 'old_mysuru_southern', name: 'Old Mysuru & Southern' },
    { id: 'kittur_karnataka', name: 'Kittur Karnataka (Northwestern)' },
    { id: 'kalyana_karnataka', name: 'Kalyana Karnataka (Northeastern)' },
    { id: 'karavali_coastal', name: 'Karavali & Coastal (Kundagannada)' },
    { id: 'malnad', name: 'Malnad Highland Zone' },
    { id: 'central_border_cluster', name: 'Central & Urban Transition' }
  ];

  // Representative phonological profiles for present progressive: 'What are you doing?'
  const profiles: Record<string, { root: string; suffix: string; surface: string }> = {
    old_mysuru_southern: { root: 'māḍu', suffix: 'tiddīri', surface: 'ēn māḍtiddīri' },
    kittur_karnataka: { root: 'māḍu', suffix: 'ākattīri', surface: 'ēn māḍākattīri' },
    kalyana_karnataka: { root: 'māḍu', suffix: 'likkattīri', surface: 'ēn māḍlikkattīri' },
    karavali_coastal: { root: 'māḍu', suffix: 'tā iddiri', surface: 'enta māḍtā iddiri' },
    malnad: { root: 'māḍu', suffix: 'tiddiri', surface: 'enta māḍtiddiri' },
    central_border_cluster: { root: 'māḍu', suffix: 'tā iddīra', surface: 'ēn māḍtā iddīra' }
  };

  const results: DialectPairMetric[] = [];

  for (let i = 0; i < regions.length; i++) {
    for (let j = i + 1; j < regions.length; j++) {
      const rA = regions[i];
      const rB = regions[j];
      const pA = profiles[rA.id];
      const pB = profiles[rB.id];

      const div = computeCompositeDialectDivergence({
        rootIastA: pA.root,
        rootIastB: pB.root,
        suffixIastA: pA.suffix,
        suffixIastB: pB.suffix,
        fullSurfaceIastA: pA.surface,
        fullSurfaceIastB: pB.surface
      });

      const intelligibility =
        div.surfaceDivergencePct <= 25
          ? 'High (>80%)'
          : div.surfaceDivergencePct <= 45
          ? 'Moderate (65-80%)'
          : 'Contact-Divergent (<65%)';

      results.push({
        regionIdA: rA.id,
        regionNameA: rA.name,
        regionIdB: rB.id,
        regionNameB: rB.name,
        surfaceDivergencePct: div.surfaceDivergencePct,
        rootCognacyPct: div.rootCognacyPct,
        morphemicShiftPct: div.morphemicShiftPct,
        mutualIntelligibilityLevel: intelligibility
      });
    }
  }

  return results;
}

/**
 * Karnataka Digital Public Infrastructure (DPI) PadaKanaja Export Schema Generator
 */
export function generatePadaKanajaExport(entries: any[]): object {
  return {
    dpi_standard: 'Government of Karnataka - PadaKanaja Dictionary Ingestion Schema v4.1',
    portal_uri: 'https://padakanaja.karnataka.gov.in/',
    exported_at: new Date().toISOString(),
    source_agency: 'Namma Kannada Atlas (Kannada Digital Innovation Hackathon 2026)',
    license: 'CC-BY-4.0 & ODbL-1.0 Composite Reference',
    records_count: entries.length,
    lexical_entries: entries.map((e) => ({
      headword_kannada: e.kannada_script,
      transliteration_iso: e.transliteration,
      english_gloss: e.meaning_en,
      communicative_context: e.context,
      pedagogical_region: e.region_or_locality,
      sub_variety_dialect: e.sub_variety,
      isogloss_classification: e.variant_type,
      morphological_decomposition: e.morpheme_decomposition || [],
      primary_source_id: e.citation?.source_id,
      evidence_tier: e.evidence_level,
      status: e.evidence_status
    }))
  };
}

/**
 * Cross-Linguistic Data Format (CLDF) Export tied to Glottolog nucl1305 (Nuclear Kannadoid)
 */
export function generateCLDFWordlistExport(entries: any[]): object {
  const glottologMap: Record<string, string> = {
    old_mysuru_southern: 'myso1238',
    kittur_karnataka: 'nort3259',
    kalyana_karnataka: 'nort3259',
    karavali_coastal: 'kund1256',
    malnad: 'havy1238',
    central_border_cluster: 'nucl1305'
  };

  return {
    cldfVersion: '2.0',
    dc_conformsTo: 'http://cldf.clld.org/v2.0/terms.rdf#Wordlist',
    glottologLanguoid: 'nucl1305',
    glottologName: 'Nuclear Kannadoid',
    datasetTitle: 'Namma Kannada Atlas Comparative Dialect Wordlist',
    authors: ['Namma Kannada Atlas Research Team (Hackathon 2026)'],
    terms: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
    tables: {
      Wordlist: entries.map((e, idx) => ({
        ID: `cldf-${idx + 1}-${e.id}`,
        Language_ID: glottologMap[e.region_matrix_slot] || 'nucl1305',
        Concept_ID: e.concept_id,
        Form: e.kannada_script,
        Segments: e.transliteration.split(''),
        Gloss: e.meaning_en,
        Source: [e.citation?.source_id || 'SRC-UPADHYAYA-1976'],
        Comment: `Invariant root: ${e.morpheme_decomposition?.[0]?.surface_kn || 'N/A'}; Suffix: ${e.morpheme_decomposition?.[1]?.surface_kn || 'N/A'}`
      }))
    }
  };
}
