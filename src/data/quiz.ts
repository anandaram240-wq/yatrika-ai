import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which region of Karnataka uses the iconic affectionate address "ಏನ್ ಮಾರ್ರೆ" (En Marre)?',
    phraseKannada: 'ಏನ್ ಮಾರ್ರೆ, ಇವತ್ತು ಸೌಖ್ಯ ಉಂಟಾ ನಿಮ್ಮಲ್ಲಿ?',
    transliteration: 'En marre, ivattu saukhya unta nimmalli?',
    englishMeaning: 'Hello my friend, is all well at your home today?',
    correctRegionId: 'karavali',
    options: ['karavali', 'uttara-karnataka', 'mysuru-mandya', 'bengaluru-urban'],
    explanation: '"ಮಾರ್ರೆ" (Marre) is the signature communal address of coastal Karnataka (Mangaluru & Udupi). Traced to Halegannada and Tulu cognates, it denotes deep familiarity and mutual warmth.',
    morphological_note: 'Coastal communal vocative "Marre" combined with existential auxiliary "unta" (preserved from Halegannada/Tulu).',
    culturalTrivia: 'Coastal fish curry in Karavali is traditionally cooked with coconut milk and Kudampuli (Malabar tamarind).',
    source: {
      title: 'Coastal Conversational Address & Existential Auxiliary (Marre)',
      authorOrInstitution: 'Coastal oral usage documentation',
      year: null as any,
      sourceLocation: 'Oral field collection pending archival verification'
    },
    status: 'provisional',
    evidence_status: 'provisional',
    evidence_level: 'E4'
  },
  {
    id: 'q2',
    question: 'Where would you hear someone exclaim "ಹೌದ್ಲಾ! ನಾನ್ ಮೊದಲೇ ಹೇಳಿಲ್ವಾ?" (Haudla)?',
    phraseKannada: 'ಹೌದ್ಲಾ! ನಡೀರಿ ಚಾ ಕುಡಿದು ಬರೂಣು!',
    transliteration: 'Haudla! Nadeeri cha kudidu baroonu!',
    englishMeaning: 'Is that so! Come on, let us go drink some hot tea!',
    correctRegionId: 'uttara-karnataka',
    options: ['uttara-karnataka', 'malenadu', 'kalyana-karnataka', 'mysuru-mandya'],
    explanation: '"ಹೌದ್ಲಾ" (Haudla) is the quintessential North Karnataka particle expressing surprised confirmation, widely heard across Dharwad, Belagavi, and Hubballi.',
    morphological_note: 'Phonological contraction of "Haudu Alva" (Is it not so?) + cohortative imperative verb ending "-oonu".',
    culturalTrivia: 'Dharwad is globally celebrated for its GI-tagged Dharwad Peda, hand-crafted through slow-caramelized milk khowa.',
    source: {
      title: 'Northern Conversational Particle Corpus (Haudla)',
      authorOrInstitution: 'Dharwad / Belagavi oral usage documentation',
      year: null as any,
      sourceLocation: 'Oral field collection pending archival verification'
    },
    status: 'provisional',
    evidence_status: 'provisional',
    evidence_level: 'E4'
  },
  {
    id: 'q3',
    question: 'A shopkeeper politely smiles and says: "ಬೇಡ ಬಿಡಿ ಸ್ವಾಮಿ, ಅದೇನ್ ದೊಡ್ಡ ವಿಷ್ಯನಾ?" Which region is this from?',
    phraseKannada: 'ಬೇಡ ಬಿಡಿ ಸ್ವಾಮಿ, ನಾವೆಲ್ಲ ಒಂದೇ ಊರಿನವರು ಅಲ್ವಾ!',
    transliteration: 'Beda bidi swamy, naavella onde oorinavaru alva!',
    englishMeaning: 'Leave it be, sir; are we not all people of the same town!',
    correctRegionId: 'mysuru-mandya',
    options: ['mysuru-mandya', 'karavali', 'bengaluru-urban', 'uttara-karnataka'],
    explanation: '"ಸ್ವಾಮಿ" (Swamy) honorific coupled with "ಬೇಡ ಬಿಡಿ" (Beda Bidi) is the hallmark of Old Mysuru courtly manners and peaceful demeanor.',
    morphological_note: 'Polite dismissive imperative "Beda bidi" + respectful masculine vocative "Swamy".',
    culturalTrivia: 'The Kingdom of Mysore under Nalwadi Krishraj Wadiyar was known as "Rajarshi" for pioneering democratic representation and education.',
    source: {
      title: 'Southern Polite Register & Conversational Tag (Beda Bidi)',
      authorOrInstitution: 'Old Mysuru oral usage documentation',
      year: null as any,
      sourceLocation: 'Oral field collection pending archival verification'
    },
    status: 'provisional',
    evidence_status: 'provisional',
    evidence_level: 'E4'
  },
  {
    id: 'q4',
    question: 'If someone affectionately calls you "ಬಾವಾಜಿ" (Bavaji) and invites you for hot Jowar Rotti, where are you?',
    phraseKannada: 'ಏನ್ ಬಾವಾಜಿ, ಕಲ್ಬುರ್ಗಿ ತೊಗರಿಬೇಳೆ ಸಾರು ಸವಿಯಲೇಬೇಕು ನೀವು!',
    transliteration: 'En bavaji, Kalaburgi thogaribele saaru saviyalebeku neevu!',
    englishMeaning: 'Hey brother, you must savor our authentic Kalaburagi Toor dal curry!',
    correctRegionId: 'kalyana-karnataka',
    options: ['kalyana-karnataka', 'malenadu', 'karavali', 'bengaluru-urban'],
    explanation: '"ಬಾವಾಜಿ" (Bavaji) is the cherished kinship address across Kalaburagi, Bidar, and Raichur, treating close companions with the affection of family.',
    morphological_note: 'Kinship honorific "Bavaji" (brother-figure) derived from medieval Deccani social discourse.',
    culturalTrivia: 'Kalaburagi Red Gram (Toor Dal) holds a registered Geographical Indication (GI) tag due to its unique lime-rich soil composition.',
    source: {
      title: 'Kalyana Karnataka Kinship Address (Bavaji)',
      authorOrInstitution: 'Kalaburagi / Bidar oral usage documentation',
      year: null as any,
      sourceLocation: 'Oral field collection pending archival verification'
    },
    status: 'provisional',
    evidence_status: 'provisional',
    evidence_level: 'E4'
  },
  {
    id: 'q5',
    question: '"ಬೋಳ್ಯಾ, ಎಲ್ಲಿದ್ಯ ಮಾರ್ರೆ ಇಷ್ಟೊತ್ತಿಗೆ?" Which distinctive coastal sub-dialect is "ಬೋಳ್ಯಾ" from?',
    phraseKannada: 'ಬೋಳ್ಯಾ, ನಡೀರಿ ಕೋಡಿ ಬೀಚ್ ಕಡೆ ಸನ್ಸೆಟ್ ನೋಡೋಣ!',
    transliteration: 'Boliya, nadeeri kodi beach kade sunset nodona!',
    englishMeaning: 'Hey buddy / rascal, come on, let\'s head to Kodi Beach to watch the sunset!',
    correctRegionId: 'karavali',
    options: ['karavali', 'uttara-karnataka', 'mysuru-mandya', 'malenadu'],
    explanation: '"ಬೋಳ್ಯಾ" (Boliya) is the trademark affectionate banter term of Kundagannada (the Kundapura coastal sub-dialect of Karavali).',
    morphological_note: 'Kundagannada sub-dialect vocative "Boliya" paired with cohortative "-ona".',
    culturalTrivia: 'Kundapura Kannada retains several grammatical verb endings that trace back to 10th century Halegannada (Old Kannada).',
    source: {
      title: 'Kundagannada Sub-variety Banter Corpus (Boliya)',
      authorOrInstitution: 'Kundapura oral usage documentation',
      year: null as any,
      sourceLocation: 'Oral field collection pending archival verification'
    },
    status: 'provisional',
    evidence_status: 'provisional',
    evidence_level: 'E4'
  },
  {
    id: 'q6',
    question: '"ಮಚ್ಚಾ, ಸಿಲ್ಕ್ ಬೋರ್ಡ್ ಟ್ರಾಫಿಕ್ ಅಲ್ಲಿ ಸಿಕ್ಕಾಕ್ಕೊಂಡಿದೀನಿ, ಸೀನ್ ಇಲ್ಲ!" Where does this vibrant slang originate?',
    phraseKannada: 'ಮಚ್ಚಾ, ಬೈ-ಟು ಕಾಫಿ ಕುಡಿದು ಸೀನ್ ಸೆಟ್ ಮಾಡೋಣ!',
    transliteration: 'Macha, by-two coffee kudidu scene set madona!',
    englishMeaning: 'Bro, let\'s grab a by-two filter coffee and sort this plan out!',
    correctRegionId: 'bengaluru-urban',
    options: ['bengaluru-urban', 'mysuru-mandya', 'karavali', 'uttara-karnataka'],
    explanation: 'Combining English loan words ("Scene set") with youth Dravidian address ("Macha") is the hallmark of cosmopolitan Bengaluru college slang.',
    morphological_note: 'Bilingual code-switching (English "scene" + Kannada cohortative verb "set madona").',
    culturalTrivia: 'Bengaluru\'s "By-two coffee" culture originated in iconic Brahmin tiffin rooms of Malleswaram and Basavanagudi.',
    source: {
      title: 'Metropolitan Youth Slang & Code-Mixing Corpus (Macha)',
      authorOrInstitution: 'Bengaluru urban oral usage documentation',
      year: null as any,
      sourceLocation: 'Oral field collection pending archival verification'
    },
    status: 'provisional',
    evidence_status: 'provisional',
    evidence_level: 'E4'
  },
  {
    id: 'q7',
    question: 'Which hill region uses "ಮಾರಾಯ್ರೆ" (Maraayre) in everyday greetings amid monsoon rains?',
    phraseKannada: 'ಮಳೆ ನಿಂತ ಮೇಲೆ ತೋಟಕ್ಕೆ ಹೋಗಿ ಬರೋಣ ಬನ್ನಿ ಮಾರಾಯ್ರೆ!',
    transliteration: 'Male nintha mele thotakke hogi barona banni maraayre!',
    englishMeaning: 'Once the rain ceases, come let us walk over to the plantation, good fellow!',
    correctRegionId: 'malenadu',
    options: ['malenadu', 'uttara-karnataka', 'bengaluru-urban', 'kalyana-karnataka'],
    explanation: '"ಮಾರಾಯ್ರೆ" (Maraayre) is widely celebrated across the Western Ghats (Shivamogga, Chikkamagaluru), immortalized in the rustic prose of Kuvempu and Tejaswi.',
    morphological_note: 'Malenadu hill vocative "Maraayre" with agrarian conversational setting.',
    culturalTrivia: 'The Malenadu region receives some of India\'s highest rainfall, with Agumbe known as the "Cherrapunji of the South".',
    source: {
      title: 'Malnad Western Ghats Colloquial Address (Maraayre)',
      authorOrInstitution: 'Western Ghats oral usage documentation',
      year: null as any,
      sourceLocation: 'Oral field collection pending archival verification'
    },
    status: 'provisional',
    evidence_status: 'provisional',
    evidence_level: 'E4'
  },
  {
    id: 'q8',
    question: 'A farmer in Mandya says: "ಅದೇ ಕಣಯ್ಯ ನಮ್ಮ ಮಣ್ಣಿನ ಗುಣ!" What does "ಕಣಯ್ಯ" (Kanayya) express?',
    phraseKannada: 'ಅದೇ ಕಣಯ್ಯ ನಮ್ಮ ಮಂಡ್ಯದ ರೈತರ ಹಿರಿಮೆ!',
    transliteration: 'Ade kanayya namma mandyada raithara hirime!',
    englishMeaning: 'That, you see my friend, is the greatness of our Mandya farmers!',
    correctRegionId: 'mysuru-mandya',
    options: ['mysuru-mandya', 'uttara-karnataka', 'karavali', 'kalyana-karnataka'],
    explanation: '"ಕಣಯ್ಯ" (Kanayya) is an emphatic conversational tag in Mandya rural speech, expressing intimate conviction and agricultural pride.',
    morphological_note: 'Mandya rural emphatic tag "Kanayya" (contracted from "Kano Ayya" - see here, sir/friend).',
    culturalTrivia: 'Mandya is widely hailed as "Sakkareya Nadu" (The Land of Sugar) due to the extensive sugarcane cultivation powered by the Visvesvaraya Canal.',
    source: {
      title: 'Mandya Rural Conversational Tag (Kanayya)',
      authorOrInstitution: 'Mandya agrarian oral usage documentation',
      year: null as any,
      sourceLocation: 'Oral field collection pending archival verification'
    },
    status: 'provisional',
    evidence_status: 'provisional',
    evidence_level: 'E4'
  }
];
