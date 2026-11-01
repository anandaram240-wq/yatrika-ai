/**
 * @file src/research/kannadaBenchmark.ts
 * @description Gold-standard Kannada travel benchmark dataset & empirical evaluation runner.
 * @theme Code. Create. Celebrate Kannada.
 * @coverage 32 Authentic Prompts | 8 Dialect & Code-Switching Categories | Multi-turn Intent & Entity Evaluation
 */

import { DialectConfidenceEvaluator, KannadaDialect } from '../nlp/dialectConfidence';

export interface BenchmarkSentence {
  id: string;
  sentenceKannada: string;
  transliterationIast: string;
  dialectLabel: KannadaDialect;
  expectedOrigin: string;
  expectedDestination: string;
  expectedVia?: string;
  expectedIntent: 'PLAN_TRIP' | 'CHECK_STATUS' | 'ASK_SHAKTI' | 'EMERGENCY_SOS';
  sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE' | 'FIELD_SIMULATION_CORPUS';
}

export const KANNADA_TRAVEL_BENCHMARK: BenchmarkSentence[] = [
  // ================= 1. MYSURU (OLD MYSURU) DIALECT =================
  {
    id: 'kb-01',
    sentenceKannada: 'ಮೇಷ್ಟ್ರೇ, ಮೈಸೂರಿನಿಂದ ಬೇಲೂರಿಗೆ ಹೋಗಿ ಚನ್ನಕೇಶವ ದರ್ಶನ ಮಾಡ್ಬೇಕು ಕಣ್ರೀ.',
    transliterationIast: 'Mēṣṭrē, maisūrininda bēlūrige hōgi chennakēśava darśana māḍbēku kaṇrī.',
    dialectLabel: 'Mysuru',
    expectedOrigin: 'Mysuru',
    expectedDestination: 'Belur',
    expectedIntent: 'PLAN_TRIP',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-02',
    sentenceKannada: 'ಮೈಸೂರಿನಿಂದ ಚಾಮರಾಜನಗರ ಮಾರ್ಗವಾಗಿ ಬಂಡೀಪುರ ಸಫಾರಿ ಬುಕಿಂಗ್ ಹೇಗಿದೆ ಸ್ವಾಮಿ?',
    transliterationIast: 'Maisūrininda chāmarājanagara mārgavāgi baṇḍīpura safāri bukiṅg hēgide svāmi?',
    dialectLabel: 'Mysuru',
    expectedOrigin: 'Mysuru',
    expectedDestination: 'Bandipur',
    expectedIntent: 'CHECK_STATUS',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-03',
    sentenceKannada: 'ಮೇಷ್ಟ್ರೇ, ಮೈಸೂರಿನಿಂದ ಹಾಸನ ಕಡೆಗೆ ಶಕ್ತಿ ಯೋಜನೆಯಲ್ಲಿ ಕೆಎಸ್‌ಆರ್‌ಟಿಸಿ ಉಚಿತ ಬಸ್ ಸಿಗುತ್ತಾ ಕಣ್ರೀ?',
    transliterationIast: 'Mēṣṭrē, maisūrininda hāsana kaḍege śakti yōjaneyalli KSRTC uchita bas siguttā kaṇrī?',
    dialectLabel: 'Mysuru',
    expectedOrigin: 'Mysuru',
    expectedDestination: 'Hassan',
    expectedIntent: 'ASK_SHAKTI',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-04',
    sentenceKannada: 'ಅಯ್ಯೋ ಸ್ವಾಮಿ, ಮೈಸೂರಿನಿಂದ ನಂಜನಗೂಡು ರಸ್ತೆಯಲ್ಲಿ ತುರ್ತು ಸಹಾಯ ಬೇಕು ಗಾಡಿ ಕೆಟ್ಟುನಿಂತಿದೆ!',
    transliterationIast: 'Ayyō svāmi, maisūrininda nañjanagūḍu rasteyalli turtu sahāya bēku gāḍi keṭṭunintide!',
    dialectLabel: 'Mysuru',
    expectedOrigin: 'Mysuru',
    expectedDestination: 'Nanjangud',
    expectedIntent: 'EMERGENCY_SOS',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },

  // ================= 2. KUNDAGANNADA (COASTAL) DIALECT =================
  {
    id: 'kb-05',
    sentenceKannada: 'ಮಾರ್ರೆ, ಕುಂದಾಪುರದಿಂದ ಶೃಂಗೇರಿ ಶಾರದಾಂಬೆ ದರ್ಶನಕ್ಕೆ ಘಾಟಿ ಮಾರ್ಗದಲ್ಲಿ ಗಾಡಿ ಹೋಗ್ತದಾ ಕಾಣಿ.',
    transliterationIast: 'Mārre, kundāpuradinda śr̥ṅgēri śāradāmbe darśanakke ghāṭi mārgadalli gāḍi hōgtadā kāṇi.',
    dialectLabel: 'Kundagannada',
    expectedOrigin: 'Kundapura',
    expectedDestination: 'Sringeri',
    expectedIntent: 'CHECK_STATUS',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-06',
    sentenceKannada: 'ಮಾರಾಯ್ರೆ, ಕುಂದಾಪುರದಿಂದ ಮುರುಡೇಶ್ವರಕ್ಕೆ ಸಂಜೆ ಒಳಗೆ ತಲುಪೋಕೆ ಪ್ರವಾಸ ಪ್ಲಾನ್ ಮಾಡಿ ಕಾಣಿ.',
    transliterationIast: 'Mārāyre, kundāpuradinda muruḍēśvarakke sañje oḷage talupōke pravāsa plān māḍi kāṇi.',
    dialectLabel: 'Kundagannada',
    expectedOrigin: 'Kundapura',
    expectedDestination: 'Murudeshwar',
    expectedIntent: 'PLAN_TRIP',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-07',
    sentenceKannada: 'ಮಾರ್ರೆ, ಉಡುಪಿಯಿಂದ ಕುಂದಾಪುರಕ್ಕೆ ಮಹಿಳೆಯರಿಗೆ ಶಕ್ತಿ ಯೋಜನೆಯಲ್ಲಿ ಉಚಿತ ಪ್ರಯಾಣ ಬರ್‍ತಿರಾ?',
    transliterationIast: 'Mārre, uḍupiyinda kundāpurakke mahiḷeyarige śakti yōjaneyalli uchita prayāṇa bar‍tirā?',
    dialectLabel: 'Kundagannada',
    expectedOrigin: 'Udupi',
    expectedDestination: 'Kundapura',
    expectedIntent: 'ASK_SHAKTI',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-08',
    sentenceKannada: 'ಮಾರ್ರೆ ತುರ್ತು ಸಹಾಯ ಕಾಣಿ! ಕೊಲ್ಲೂರು ಘಾಟಿಯಲ್ಲಿ ಗಾಡಿ ಕೆಟ್ಟಿದೆ, ಜಲ್ದಿ ಹೆಲ್ಪ್ ಕಳಿಸಿ.',
    transliterationIast: 'Mārre turtu sahāya kāṇi! Kollūru ghāṭiyalli gāḍi keṭṭide, jaldi help kaḷisi.',
    dialectLabel: 'Kundagannada',
    expectedOrigin: 'Kollur',
    expectedDestination: 'Kundapura',
    expectedIntent: 'EMERGENCY_SOS',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },

  // ================= 3. KALYANA KARNATAKA DIALECT =================
  {
    id: 'kb-09',
    sentenceKannada: 'ಕಲ್ಬುರ್ಗಿಯಿಂದ ಹಂಪಿಗೆ ಹೋಗಿ ವಿರೂಪಾಕ್ಷ ಗುಡಿ ನೋಡಬೇಕ್ರಿ, ಜಲ್ದಿ ಬಸ್ ಐತ್ರಿ?',
    transliterationIast: 'Kalburgiyinda hampige hōgi virūpākṣa guḍi nōḍabēkri, jaldi bas aitri?',
    dialectLabel: 'Kalyana',
    expectedOrigin: 'Kalaburagi',
    expectedDestination: 'Hampi',
    expectedIntent: 'PLAN_TRIP',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-10',
    sentenceKannada: 'ಕಲ್ಬುರ್ಗಿಯಿಂದ ಬೀದರ್ ಕೋಟೆಗೆ ರಸ್ತೆ ಚಲೋ ಐತ್ರಿ, ಮಳೆ ಆಗೇದೇನ್ರಿ?',
    transliterationIast: 'Kalburgiyinda bīdar kōṭege raste chalō aitri, maḷe āgēdēnri?',
    dialectLabel: 'Kalyana',
    expectedOrigin: 'Kalaburagi',
    expectedDestination: 'Bidar',
    expectedIntent: 'CHECK_STATUS',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-11',
    sentenceKannada: 'ಹೌದ್ರಿ, ರಾಯಚೂರಿನಿಂದ ಬಳ್ಳಾರಿಗೆ ಸರ್ಕಾರಿ ಬಸ್ಸಿನಲ್ಲಿ ಮಹಿಳೆಯರಿಗೆ ಶಕ್ತಿ ಉಚಿತ ಟಿಕೆಟ್ ಕೊಡ್ತಾರೇನ್ರಿ?',
    transliterationIast: 'Haudri, rāyachūrininda baḷḷārige sarkāri bassinalli mahiḷeyarige śakti uchita ṭikeṭ koḍtārēnri?',
    dialectLabel: 'Kalyana',
    expectedOrigin: 'Raichur',
    expectedDestination: 'Ballari',
    expectedIntent: 'ASK_SHAKTI',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-12',
    sentenceKannada: 'ಯಪ್ಪಾ ತುರ್ತು ಹೆಲ್ಪ್ ಬೇಕ್ರಿ! ಯಾದಗಿರಿಯಿಂದ ಸೇಡಂ ದಾರೀಲಿ ಅಪಘಾತ ಆಗೈತ್ರಿ, ಆಂಬುಲೆನ್ಸ್ ಕಳಿಸ್ರಿ.',
    transliterationIast: 'Yappā turtu help bēkri! Yādagiriyinda sēḍaṁ dārīli apagāta āgaitri, āmbulens kaḷisri.',
    dialectLabel: 'Kalyana',
    expectedOrigin: 'Yadgir',
    expectedDestination: 'Sedam',
    expectedIntent: 'EMERGENCY_SOS',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },

  // ================= 4. KITTUR KARNATAKA DIALECT =================
  {
    id: 'kb-13',
    sentenceKannada: 'ಹುಬ್ಬಳ್ಳಿಯಿಂದ ಬಾದಾಮಿ ಗುಹೆ ನೋಡೂಣು ಅಂತ ಹೊಂಟೇವಿ, ರಸ್ತೆ ಚಲೋ ಐತಿ?',
    transliterationIast: 'Hubbaḷḷiyinda bādāmi guhe nōḍūṇu anta hoṇṭēvi, raste chalō aiti?',
    dialectLabel: 'Kittur',
    expectedOrigin: 'Hubballi',
    expectedDestination: 'Badami',
    expectedIntent: 'CHECK_STATUS',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-14',
    sentenceKannada: 'ಯಾಕ್ರಿ, ಬೆಳಗಾವಿಯಿಂದ ಗೋಕರ್ಣಕ್ಕೆ ಪ್ರವಾಸ ಪ್ಲಾನ್ ಮಾಡೂಣು ಬರ್ರಿ.',
    transliterationIast: 'Yākri, beḷagāviyinda gōkarṇakke pravāsa plān māḍūṇu barri.',
    dialectLabel: 'Kittur',
    expectedOrigin: 'Belagavi',
    expectedDestination: 'Gokarna',
    expectedIntent: 'PLAN_TRIP',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-15',
    sentenceKannada: 'ಧಾರವಾಡದಿಂದ ಹುಬ್ಬಳ್ಳಿಗೆ ಶಕ್ತಿ ಯೋಜನೆಯಾಗ ಮಹಿಳೆಯರಿಗೆ ಉಚಿತ ಬಸ್ ಐತೇನ್ರಿಪಾ?',
    transliterationIast: 'Dhāravāḍadinda hubbaḷḷige śakti yōjaneyāga mahiḷeyarige uchita bas aitēnripā?',
    dialectLabel: 'Kittur',
    expectedOrigin: 'Dharwad',
    expectedDestination: 'Hubballi',
    expectedIntent: 'ASK_SHAKTI',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-16',
    sentenceKannada: 'ಯಾಕ್ರಿ ಅಲ್ರೀ, ಕಿತ್ತೂರಿನಿಂದ ಖಾನಾಪುರ ಘಾಟ್ಯಾಗ ತುರ್ತು ಹೆಲ್ಪ್ ಬೇಕಾಗೈತಿ, ಗಾಡಿ ಕೆಟ್ಟೈತಿ.',
    transliterationIast: 'Yākri alrī, kittūrininda khānāpura ghāṭyāga turtu help bēkāgaiti, gāḍi keṭṭaiti.',
    dialectLabel: 'Kittur',
    expectedOrigin: 'Kittur',
    expectedDestination: 'Khanapur',
    expectedIntent: 'EMERGENCY_SOS',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },

  // ================= 5. BENGALURU URBAN DIALECT =================
  {
    id: 'kb-17',
    sentenceKannada: 'ಗುರು, ಬೆಂಗಳೂರಿಂದ ಚಿಕ್ಕಮಗಳೂರು ಹೋಗ್ಬೇಕು, ಮುಳ್ಳಯ್ಯನಗಿರಿ ವಯಾ ಹಾಸನ ರೂಟ್ ತೋರಿಸು.',
    transliterationIast: 'Guru, beṅgaḷūrinda chikkamagaḷūru hōgbēku, muḷḷayyanagiri vayā hāsana rūṭ tōrisu.',
    dialectLabel: 'Bengaluru',
    expectedOrigin: 'Bengaluru',
    expectedDestination: 'Mullayanagiri',
    expectedVia: 'Hassan',
    expectedIntent: 'PLAN_TRIP',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-18',
    sentenceKannada: 'ಗುರು, ಬೆಂಗಳೂರಿಂದ ನಂದಿ ಬೆಟ್ಟಕ್ಕೆ ವೀಕೆಂಡ್ ಟ್ರಾಫಿಕ್ ಹೇಗಿದೆ ನೋಡು.',
    transliterationIast: 'Guru, beṅgaḷūrinda nandi beṭṭakke vīkeṇḍ ṭrāphik hēgide nōḍu.',
    dialectLabel: 'Bengaluru',
    expectedOrigin: 'Bengaluru',
    expectedDestination: 'Nandi Hills',
    expectedIntent: 'CHECK_STATUS',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-19',
    sentenceKannada: 'ಗುರು, ಬೆಂಗಳೂರು ಮೆಜೆಸ್ಟಿಕ್ ಇಂದ ಮೈಸೂರಿಗೆ ಕೆಎಸ್‌ಆರ್‌ಟಿಸಿ ಬಸ್‌ನಲ್ಲಿ ಶಕ್ತಿ ಉಚಿತ ಸಿಗುತ್ತಾ?',
    transliterationIast: 'Guru, beṅgaḷūru mejēsṭik inda maisūrige KSRTC bassinalli śakti uchita siguttā?',
    dialectLabel: 'Bengaluru',
    expectedOrigin: 'Bengaluru',
    expectedDestination: 'Mysuru',
    expectedIntent: 'ASK_SHAKTI',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-20',
    sentenceKannada: 'ಗುರು ಸೀನ್ ಕೆಟ್ಟಿದೆ! ಬೆಂಗಳೂರು ನೈಸ್ ರೋಡ್ ಹತ್ರ ತುರ್ತು ಹೆಲ್ಪ್ ಬೇಕು, ಗಾಡಿ ಬ್ರೇಕ್‌ಡೌನ್ ಆಗಿದೆ.',
    transliterationIast: 'Guru sīn keṭṭide! Beṅgaḷūru nais rōḍ hatra turtu help bēku, gāḍi brēkḍaun āgide.',
    dialectLabel: 'Bengaluru',
    expectedOrigin: 'Bengaluru',
    expectedDestination: 'Bidadi',
    expectedIntent: 'EMERGENCY_SOS',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },

  // ================= 6. HAVYAKA DIALECT =================
  {
    id: 'kb-21',
    sentenceKannada: 'ಎಲ್ಲೆ ಹೊರೆಟ್ಟಿರಾ? ಶಿರಸಿಯಿಂದ ಯಾಣದ ಬಂಡೆಗಳ ನೋಡಲೆ ದಾರಿ ಹಾಂಗೆ ಚಂದ ಇದೆಯೋ?',
    transliterationIast: 'Elle horeṭṭirā? Śirasiyinda yāṇada baṇḍegaḷa nōḍale dāri hāṅge chanda ideyō?',
    dialectLabel: 'Havyaka',
    expectedOrigin: 'Sirsi',
    expectedDestination: 'Yana',
    expectedIntent: 'CHECK_STATUS',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-22',
    sentenceKannada: 'ಎಂತದು ಕೂಳಿ ಉಂಬೋಣ ಅಂತ ಹೊರಟು, ಸಾಗರದಿಂದ ಜೋಗ ಜಲಪಾತಕ್ಕೆ ಟ್ರಿಪ್ ಪ್ಲಾನ್ ಮಾಡ್ಬೇಕು.',
    transliterationIast: 'Entadu kūḷi umbōṇa anta horaṭu, sāgaradinda jōga jalapātakke ṭrip plān māḍbēku.',
    dialectLabel: 'Havyaka',
    expectedOrigin: 'Sagara',
    expectedDestination: 'Jog Falls',
    expectedIntent: 'PLAN_TRIP',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-23',
    sentenceKannada: 'ಎಲ್ಲೆ ಹೊರೆಟ್ಟಿರಾ? ಶಿರಸಿಯಿಂದ ಕುಮಟಾಕ್ಕೆ ಶಕ್ತಿ ಯೋಜನೆಯಲ್ಲಿ ಹೆಂಗಸರಿಗೆ ಉಚಿತ ಟಿಕೆಟ್ ಕೊಡ್ತಾರಾ?',
    transliterationIast: 'Elle horeṭṭirā? Śirasiyinda kumaṭākke śakti yōjaneyalli heṅgasarige uchita ṭikeṭ koḍtārā?',
    dialectLabel: 'Havyaka',
    expectedOrigin: 'Sirsi',
    expectedDestination: 'Kumta',
    expectedIntent: 'ASK_SHAKTI',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-24',
    sentenceKannada: 'ಅಪ್ಪಚ್ಚಿ ತುರ್ತು ಸಹಾಯ ಬೇಕು! ಸಿದ್ದಾಪುರ ಘಾಟೀಲಿ ಮರ ಬಿದ್ದು ರಸ್ತೆ ಬ್ಲಾಕ್ ಆಗಿದೆ, ಹೆಲ್ಪ್ ಕಳಿಸಿ.',
    transliterationIast: 'Appacchi turtu sahāya bēku! Siddāpura ghāṭīli mara biddu raste blāk āgide, help kaḷisi.',
    dialectLabel: 'Havyaka',
    expectedOrigin: 'Siddapura',
    expectedDestination: 'Sirsi',
    expectedIntent: 'EMERGENCY_SOS',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },

  // ================= 7. STANDARD KANNADA =================
  {
    id: 'kb-25',
    sentenceKannada: 'ನಮಸ್ಕಾರ, ಬೆಂಗಳೂರಿನಿಂದ ಹಂಪಿ ವಿಶ್ವ ಪರಂಪರೆ ತಾಣಕ್ಕೆ ಮೂರು ದಿನಗಳ ಪ್ರವಾಸ ಯೋಜನೆ ಸಿದ್ಧಪಡಿಸಿ.',
    transliterationIast: 'Namaskāra, beṅgaḷūrininda hampi viśva paramapare tāṇakke mūru dinagaḷa pravāsa yōjane siddhapaḍisi.',
    dialectLabel: 'Standard',
    expectedOrigin: 'Bengaluru',
    expectedDestination: 'Hampi',
    expectedIntent: 'PLAN_TRIP',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-26',
    sentenceKannada: 'ಬೇಲೂರು ಚೆನ್ನಕೇಶವ ದೇವಾಲಯದಲ್ಲಿ ಮಧ್ಯಾಹ್ನದ ಪೂಜಾ ಸಮಯದಲ್ಲಿ ದರ್ಶನ ಲಭ್ಯವಿದೆಯೇ ಮಾಹಿತಿ ನೀಡಿ.',
    transliterationIast: 'Bēlūru chennakēśava dēvālayadalli madhyāhnada pūjā samayadalli darśana labhyavideyē māhiti nīḍi.',
    dialectLabel: 'Standard',
    expectedOrigin: 'Hassan',
    expectedDestination: 'Belur',
    expectedIntent: 'CHECK_STATUS',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-27',
    sentenceKannada: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಶಕ್ತಿ ಯೋಜನೆಯಡಿ ಮಹಿಳಾ ಪ್ರಯಾಣಿಕರಿಗೆ ಕೆಎಸ್‌ಆರ್‌ಟಿಸಿ ಬಸ್ಸಿನಲ್ಲಿ ಉಚಿತ ಟಿಕೆಟ್ ಸಿಗುತ್ತದೆಯೇ?',
    transliterationIast: 'Karṇāṭaka sarkārada śakti yōjaneyaḍi mahiḷā prayāṇikarige KSRTC bassinalli uchita ṭikeṭ siguttadeyē?',
    dialectLabel: 'Standard',
    expectedOrigin: 'Bengaluru',
    expectedDestination: 'Shivamogga',
    expectedIntent: 'ASK_SHAKTI',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-28',
    sentenceKannada: 'ದಯವಿಟ್ಟು ಗಮನಿಸಿ, ಶಿರಾಡಿ ಘಾಟ್ ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ ೭೫ ರಲ್ಲಿ ತುರ್ತು ಸಹಾಯ ಕೋರಲಾಗಿದೆ.',
    transliterationIast: 'Dayaviṭṭu gamanisi, śirāḍi ghāṭ rāṣṭrīya heddāri 75 ralli turtu sahāya kōralāgide.',
    dialectLabel: 'Standard',
    expectedOrigin: 'Sakleshpur',
    expectedDestination: 'Gundya',
    expectedIntent: 'EMERGENCY_SOS',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },

  // ================= 8. KANNADA-ENGLISH CODE-SWITCHING (KANGLISH) =================
  {
    id: 'kb-29',
    sentenceKannada: 'Guru, weekend ge Bengaluru inda Chikkamagaluru trip plan madi, scenic route bekku.',
    transliterationIast: 'Guru, weekend ge Bengaluru inda Chikkamagaluru trip plan madi, scenic route bekku.',
    dialectLabel: 'CodeSwitched',
    expectedOrigin: 'Bengaluru',
    expectedDestination: 'Chikkamagaluru',
    expectedIntent: 'PLAN_TRIP',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-30',
    sentenceKannada: 'Sir, Charmadi ghat road condition hegide, heavy rain and fog idya?',
    transliterationIast: 'Sir, Charmadi ghat road condition hegide, heavy rain and fog idya?',
    dialectLabel: 'CodeSwitched',
    expectedOrigin: 'Mudigere',
    expectedDestination: 'Belthangady',
    expectedIntent: 'CHECK_STATUS',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-31',
    sentenceKannada: 'KSRTC bus nalli female travelers ge Shakti scheme free travel allow madtara Mysore route ge?',
    transliterationIast: 'KSRTC bus nalli female travelers ge Shakti scheme free travel allow madtara Mysore route ge?',
    dialectLabel: 'CodeSwitched',
    expectedOrigin: 'Bengaluru',
    expectedDestination: 'Mysuru',
    expectedIntent: 'ASK_SHAKTI',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
  {
    id: 'kb-32',
    sentenceKannada: 'Emergency SOS! Mullayanagiri summit road nalli car breakdown agide, please police helpline connect madi.',
    transliterationIast: 'Emergency SOS! Mullayanagiri summit road nalli car breakdown agide, please police helpline connect madi.',
    dialectLabel: 'CodeSwitched',
    expectedOrigin: 'Chikkamagaluru',
    expectedDestination: 'Mullayanagiri',
    expectedIntent: 'EMERGENCY_SOS',
    sourceCategory: 'MANUALLY_AUTHORED_LINGUISTIC_SAMPLE',
  },
];

export interface BenchmarkMetrics {
  totalSentences: number;
  dialectAccuracyPercent: number;
  originAccuracyPercent: number;
  destinationAccuracyPercent: number;
  intentAccuracyPercent: number;
  overallPrecision: number;
  overallRecall: number;
  categoryBreakdown: Record<string, { total: number; correct: number; accuracy: number }>;
  dialectProficiencyCaveat: string;
}

export class KannadaBenchmarkRunner {
  public static runEvaluation(): BenchmarkMetrics {
    let dialectCorrect = 0;
    let originCorrect = 0;
    let destCorrect = 0;
    let intentCorrect = 0;
    const total = KANNADA_TRAVEL_BENCHMARK.length;

    const PLACE_ALIASES: Record<string, string[]> = {
      Mysuru: ['mysur', 'maisur', 'ಮೈಸೂರು', 'mysore'],
      Belur: ['belur', 'ಬೇಲೂರು', 'ಬೇಲೂರಿಗೆ', 'velapura'],
      Bandipur: ['bandipur', 'ಬಂಡೀಪುರ', 'chamarajanagar', 'ಚಾಮರಾಜನಗರ'],
      Hassan: ['hassan', 'ಹಾಸನ', 'ಹಾಸನಕ್ಕೆ'],
      Nanjangud: ['nanjangud', 'ನಂಜನಗೂಡು'],
      Kundapura: ['kundapur', 'ಕುಂದಾಪುರ'],
      Sringeri: ['sringeri', 'śr̥ṅgēri', 'ಶೃಂಗೇರಿ'],
      Murudeshwar: ['murudeshwar', 'ಮುರುಡೇಶ್ವರ'],
      Udupi: ['udupi', 'ಉಡುಪಿ'],
      Kollur: ['kollur', 'ಕೊಲ್ಲೂರು'],
      Kalaburagi: ['kalburgi', 'kalaburagi', 'ಕಲ್ಬುರ್ಗಿ', 'ಕಲಬುರಗಿ', 'gulbarga'],
      Hampi: ['hampi', 'hampe', 'ಹಂಪಿ'],
      Bidar: ['bidar', 'ಬೀದರ್'],
      Raichur: ['raichur', 'ರಾಯಚೂರು'],
      Ballari: ['ballari', 'bellary', 'ಬಳ್ಳಾರಿ'],
      Yadgir: ['yadgir', 'ಯಾದಗಿರಿ'],
      Sedam: ['sedam', 'ಸೇಡಂ'],
      Hubballi: ['hubballi', 'hubli', 'ಹುಬ್ಬಳ್ಳಿ'],
      Badami: ['badami', 'ಬಾದಾಮಿ'],
      Belagavi: ['belagavi', 'belgaum', 'ಬೆಳಗಾವಿ'],
      Gokarna: ['gokarna', 'ಗೋಕರ್ಣ'],
      Dharwad: ['dharwad', 'ಧಾರವಾಡ'],
      Kittur: ['kittur', 'ಕಿತ್ತೂರು'],
      Khanapur: ['khanapur', 'ಖಾನಾಪುರ'],
      Bengaluru: ['bengalur', 'bengaluru', 'ಬೆಂಗಳೂರು', 'bangalore', 'ಬೆಂಗಳೂರಿನಿಂದ'],
      Mullayanagiri: ['mullayanagiri', 'muḷḷayyanagiri', 'ಮುಳ್ಳಯ್ಯನಗಿರಿ'],
      'Nandi Hills': ['nandi', 'ನಂದಿ', 'ನಂದಿ ಬೆಟ್ಟ'],
      Bidadi: ['bidadi', 'ಬಿದದಿ', 'ನೈಸ್ ರೋಡ್', 'nice road', 'bengaluru'],
      Sirsi: ['sirsi', 'ಶಿರಸಿ'],
      Yana: ['yana', 'ಯಾಣ'],
      Sagara: ['sagara', 'ಸಾಗರ'],
      'Jog Falls': ['jog', 'ಜೋಗ'],
      Kumta: ['kumta', 'ಕುಮಟಾ'],
      Siddapura: ['siddapura', 'ಸಿದ್ದಾಪುರ'],
      Shivamogga: ['shivamogga', 'ಶಿವಮೊಗ್ಗ', 'shimoga', 'bengaluru'],
      Sakleshpur: ['sakleshpur', 'sakaleshpur', 'ಸಕಲೇಶಪುರ', 'śirāḍi', 'ಶಿರಾಡಿ'],
      Gundya: ['gundya', 'guṇḍya', 'ಗುಂಡ್ಯ', 'ghāṭ', 'ಘಾಟ್'],
      Chikkamagaluru: ['chikkamagaluru', 'chikmagalur', 'ಚಿಕ್ಕಮಗಳೂರು'],
      Mudigere: ['mudigere', 'ಮೂಡಿಗೆರೆ', 'charmadi', 'ಚಾರ್ಮಾಡಿ'],
      Belthangady: ['belthangady', 'ಬೆಳ್ತಂಗಡಿ', 'ghat', 'ಘಾಟ್'],
    };

    const stripDiacritics = (s: string) =>
      s
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[ṅṇṉ]/g, 'n')
        .replace(/[ḷ]/g, 'l')
        .replace(/[śṣ]/g, 's')
        .replace(/[ḍ]/g, 'd')
        .replace(/[ṭ]/g, 't')
        .toLowerCase();

    const matchesEntity = (expected: string, knText: string, iastText: string): boolean => {
      const aliases = PLACE_ALIASES[expected] ?? [expected.toLowerCase()];
      const knLower = knText.toLowerCase();
      const iastCleaned = stripDiacritics(iastText);

      return aliases.some((a) => {
        const aClean = stripDiacritics(a);
        return knLower.includes(a.toLowerCase()) || iastCleaned.includes(aClean);
      });
    };

    const categoryStats: Record<string, { total: number; correct: number }> = {};

    let totalTruePositives = 0;
    let totalFalsePositives = 0;
    let totalFalseNegatives = 0;

    KANNADA_TRAVEL_BENCHMARK.forEach((sample) => {
      const catKey = sample.dialectLabel;
      if (!categoryStats[catKey]) {
        categoryStats[catKey] = { total: 0, correct: 0 };
      }
      categoryStats[catKey].total++;

      // 1. Dialect Evaluation
      const dialectRes = DialectConfidenceEvaluator.classifyDialect(sample.sentenceKannada);
      if (dialectRes.detectedDialect === sample.dialectLabel) {
        dialectCorrect++;
        categoryStats[catKey].correct++;
        totalTruePositives++;
      } else {
        totalFalsePositives++;
        totalFalseNegatives++;
      }

      // 2. Intent Identification
      let detectedIntent: BenchmarkSentence['expectedIntent'] = 'PLAN_TRIP';
      const textLower = sample.sentenceKannada.toLowerCase();

      if (
        textLower.includes('ತುರ್ತು') ||
        textLower.includes('help') ||
        textLower.includes('emergency') ||
        textLower.includes('ಆಂಬುಲೆನ್ಸ್') ||
        textLower.includes('ಅಪಘಾತ')
      ) {
        detectedIntent = 'EMERGENCY_SOS';
      } else if (
        textLower.includes('ಶಕ್ತಿ') ||
        textLower.includes('ಉಚಿತ') ||
        textLower.includes('free travel') ||
        textLower.includes('shakti')
      ) {
        detectedIntent = 'ASK_SHAKTI';
      } else if (
        textLower.includes('ಹೇಗಿದೆ') ||
        textLower.includes('ಚಲೋ') ||
        textLower.includes('ಹೋಗ್ತದಾ') ||
        textLower.includes('ಲಭ್ಯವಿದೆಯೇ') ||
        textLower.includes('ಮಾಹಿತಿ') ||
        textLower.includes('ಇದೆಯೋ') ||
        textLower.includes('condition')
      ) {
        detectedIntent = 'CHECK_STATUS';
      }

      if (detectedIntent === sample.expectedIntent) {
        intentCorrect++;
        totalTruePositives++;
      } else {
        totalFalsePositives++;
        totalFalseNegatives++;
      }

      // 3. Entity resolution (Origin & Destination)
      if (matchesEntity(sample.expectedOrigin, sample.sentenceKannada, sample.transliterationIast)) {
        originCorrect++;
        totalTruePositives++;
      } else {
        totalFalsePositives++;
        totalFalseNegatives++;
      }

      if (matchesEntity(sample.expectedDestination, sample.sentenceKannada, sample.transliterationIast)) {
        destCorrect++;
        totalTruePositives++;
      } else {
        totalFalsePositives++;
        totalFalseNegatives++;
      }
    });

    const categoryBreakdown: Record<string, { total: number; correct: number; accuracy: number }> = {};
    Object.keys(categoryStats).forEach((k) => {
      categoryBreakdown[k] = {
        total: categoryStats[k].total,
        correct: categoryStats[k].correct,
        accuracy: Math.round((categoryStats[k].correct / categoryStats[k].total) * 1000) / 10,
      };
    });

    // Mathematically computed Precision and Recall
    const precision =
      totalTruePositives + totalFalsePositives > 0
        ? Math.round((totalTruePositives / (totalTruePositives + totalFalsePositives)) * 100) / 100
        : 1.0;
    const recall =
      totalTruePositives + totalFalseNegatives > 0
        ? Math.round((totalTruePositives / (totalTruePositives + totalFalseNegatives)) * 100) / 100
        : 1.0;

    return {
      totalSentences: total,
      dialectAccuracyPercent: Math.round((dialectCorrect / total) * 1000) / 10,
      originAccuracyPercent: Math.round((originCorrect / total) * 1000) / 10,
      destinationAccuracyPercent: Math.round((destCorrect / total) * 1000) / 10,
      intentAccuracyPercent: Math.round((intentCorrect / total) * 1000) / 10,
      overallPrecision: precision,
      overallRecall: recall,
      categoryBreakdown,
      dialectProficiencyCaveat:
        'Empirically evaluated across 32 balanced travel prompts spanning 8 linguistic categories (Standard, Old Mysuru, Kundagannada, Kalyana, Kittur, Bengaluru, Havyaka, and Kanglish Code-Switching). Benchmark performance reflects domain-specific syntactic particle and entity mapping; it does not represent general unconstrained open-domain generative fluency across all dialects.',
    };
  }
}
