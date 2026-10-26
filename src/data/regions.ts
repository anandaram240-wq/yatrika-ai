import { Region } from '../types';

export const REGIONS: Region[] = [
  {
    id: 'uttara-karnataka',
    slotKey: 'kittur_karnataka',
    name: 'Uttara Karnataka (Northern Dialect Zone)',
    kannadaName: 'ಉತ್ತರ ಕರ್ನಾಟಕ ಪ್ರಾದೇಶಿಕ ರೂಪ',
    taxonomyNote: 'Educational exploration grouping. Northern Kannada encompasses diverse micro-variations across Belagavi, Dharwad, and the Krishna basin, with mutual influences from neighboring Marathi and Deccani speech communities.',
    description: 'Documented in linguistic surveys for its rapid tempo, phonetic contraction of verbal suffixes, distinctive honorific particles ("Ri", "Sahookar"), and emphatic tags ("Haudla"). Historically influenced by the Seuna, Chalukya, and Adil Shahi administrative zones.',
    districtsAssociated: ['Dharwad', 'Hubballi', 'Belagavi', 'Vijayapura', 'Bagalkote', 'Gadag', 'Haveri'],
    isoglossNotes: 'Forms an expansive dialect continuum spanning the northern plains. Transitions southward into Central/Malnad varieties around Davanagere and Haveri.',
    themeColor: {
      primary: 'bg-red-700 text-white',
      secondary: 'bg-red-50 text-red-900 border-red-200',
      accent: 'border-red-500 text-red-700',
      bg: 'hover:bg-red-50/80',
      border: 'border-red-200'
    },
    characteristics: [
      'Frequent usage of respectful conversational address: "Ri" and "Sahookar"',
      'Phonetic shortening of verb infinitives and negative markers (e.g., "Madalla" vs standard "Maduvudilla")',
      'Interrogative and confirmation tags: "Haudla", "Kel ri", "Yakka"',
      'Distinctive lexical items recorded in North Karnataka oral literature and folk plays'
    ],
    signaturePhrases: [
      {
        kannada: 'ಏನ್ರೀ ಸಾಹೂಕಾರ್, ಆರಾಮದೀರೇನ್ರಿ?',
        transliteration: 'En ri sahookar, aaram deereni?',
        meaning: 'How are you doing, chief / respected friend? Is everything well?',
        source: {
          title: 'Provisional colloquial candidate (no established source)',
          authorOrInstitution: 'Colloquial oral usage',
          sourceLocation: 'None (pending primary source citation)',
        },
        status: 'provisional'
      },
      {
        kannada: 'ಹೌದ್ಲಾ! ನಾನ್ ಮೊದಲೇ ಹೇಳಿಲ್ವಾ?',
        transliteration: 'Haudla! Naan modle helilva?',
        meaning: 'Is that so! Didn\'t I mention that to you earlier?',
        source: {
          title: 'Provisional colloquial candidate (no established source)',
          authorOrInstitution: 'Colloquial oral usage',
          sourceLocation: 'None (pending primary source citation)',
        },
        status: 'provisional'
      }
    ],
    culturalHighlights: 'Rich literary heritage encompassing Vachana literature, folk theatre (Bayalata), and classical Hindustani music lineages.',
    dialectFeatures: {
      cadenceDescription: 'Vocal rhythm characterized by elevated tempo, shortened syllable durations, and rising pitch on phrase-final interrogative particles.',
      pronouns: 'Naanu, Naavu, Neevu, Taavu, Avaru',
      notableSuffixes: '-la, -ri, -rippa, -gowda'
    }
  },
  {
    id: 'karavali',
    slotKey: 'karavali_coastal',
    name: 'Karavali & Coastal Zone (Including Kundagannada)',
    kannadaName: 'ಕರಾವಳಿ ಮತ್ತು ಕುಂದಾಪ್ರ ಕನ್ನಡ',
    taxonomyNote: 'Educational exploration grouping. Coastal Karnataka is a trilingual contact zone where Kannada coexists with Tulu and Konkani. Kundagannada (Kundapura Kannada) preserves distinct archaic phonological and grammatical forms.',
    description: 'Extending from Karwar through Udupi, Kundapura, and Mangaluru. Documented for its distinctive melodic intonation, vowel length modifications, and preservation of Halegannada (Old Kannada) verbal structures.',
    districtsAssociated: ['Dakshina Kannada', 'Udupi', 'Kundapura sub-region', 'Uttara Kannada (coastal)'],
    isoglossNotes: 'Features sharp transitions between Tulu-influenced Southern Coastal speech (Mangaluru), Kundagannada (Kundapura/Byndoor), and Havyaka dialects in the adjoining hill foothills.',
    themeColor: {
      primary: 'bg-teal-700 text-white',
      secondary: 'bg-teal-50 text-teal-900 border-teal-200',
      accent: 'border-teal-500 text-teal-700',
      bg: 'hover:bg-teal-50/80',
      border: 'border-teal-200'
    },
    characteristics: [
      'Musical intonational contours with sustained terminal vowels',
      'Iconic communal address terms: "Marre" (friend) and playful "Boliya"',
      'Unique syntactic preservation of Halegannada verb auxiliaries (e.g. "-untu" for existence)',
      'Rich vocabulary tied to coastal ecology, fishing, and Yakshagana performance'
    ],
    signaturePhrases: [
      {
        kannada: 'ಏನ್ ಮಾರ್ರೆ, ಇವತ್ತು ಸೌಖ್ಯ ಉಂಟಾ?',
        transliteration: 'En marre, ivattu saukhya unta?',
        meaning: 'Hello my friend, is all well with you today?',
        source: {
          title: 'Provisional colloquial candidate (no established source)',
          authorOrInstitution: 'Colloquial oral usage',
          sourceLocation: 'None (pending primary source citation)',
        },
        status: 'provisional'
      },
      {
        kannada: 'ಬೋಳ್ಯಾ, ಎಲ್ಲಿದ್ಯ ಮಾರ್ರೆ ಇಷ್ಟೊತ್ತಿಗೆ?',
        transliteration: 'Boliya, yellidya marre ishtottige?',
        meaning: 'Hey buddy, where were you hiding all this time?',
        source: {
          title: 'Provisional colloquial candidate (no established source)',
          authorOrInstitution: 'Colloquial oral usage',
          sourceLocation: 'None (pending primary source citation)',
        },
        status: 'provisional'
      }
    ],
    culturalHighlights: 'World-renowned Yakshagana theatrical heritage, coastal temple architecture, and maritime folk traditions.',
    dialectFeatures: {
      cadenceDescription: 'Wave-like pitch rises with elongated penult vowels and nasal resonance.',
      pronouns: 'Naan, Aangolu, Neengolu, Avaru',
      notableSuffixes: '-untu, -marre, -kandya'
    }
  },
  {
    id: 'mysuru-mandya',
    slotKey: 'old_mysuru_southern',
    name: 'Mysuru & Mandya (Southern Dialect Zone)',
    kannadaName: 'ಮೈಸೂರು - ಮಂಡ್ಯ ಪ್ರಾದೇಶಿಕ ರೂಪ',
    taxonomyNote: 'Educational exploration grouping. Historically formed the basis for modern standardized Granthika Kannada, but retains distinct spoken colloquial varieties in rural Mandya and Mysore.',
    description: 'Encompasses the Cauvery river basin. Characterized by polite courtly address markers ("Swamy", "Banni"), combined with the lively, emphatic rural rhythm of the Mandya agricultural belt ("Kanayya").',
    districtsAssociated: ['Mysuru', 'Mandya', 'Chamarajanagar', 'Hassan (plains)', 'Ramanagara'],
    isoglossNotes: 'Gradually merges northward into the Bangalore urban continuum and westward into the Malenadu hill varieties around Hassan.',
    themeColor: {
      primary: 'bg-amber-700 text-white',
      secondary: 'bg-amber-50 text-amber-900 border-amber-200',
      accent: 'border-amber-500 text-amber-700',
      bg: 'hover:bg-amber-50/80',
      border: 'border-amber-200'
    },
    characteristics: [
      'Courteous honorifics: "Swamy", "Banni", "Thumba santosho"',
      'Mandya emphatic conversational particles: "Kanayya", "Beda bidi"',
      'Clear, measured articulation closely aligned with classical literature',
      'Rich agrarian and culinary metaphors centered around Ragi Mudde and sugarcane farming'
    ],
    signaturePhrases: [
      {
        kannada: 'ಬನ್ನಿ ಸ್ವಾಮಿ, ಊಟ ಮಾಡ್ಕೊಂಡು ಹೋಗುವಿರಂತೆ!',
        transliteration: 'Banni swamy, oota madkondu hoguviranthe!',
        meaning: 'Please come, Sir! Please do join us for lunch before leaving!',
        source: {
          title: 'Provisional colloquial candidate (no established source)',
          authorOrInstitution: 'Colloquial oral usage',
          sourceLocation: 'None (pending primary source citation)',
        },
        status: 'provisional'
      },
      {
        kannada: 'ಬೇಡ ಬಿಡಿ ಸ್ವಾಮಿ, ಅದೇನ್ ದೊಡ್ಡ ವಿಷ್ಯನಾ?',
        transliteration: 'Beda bidi swamy, aden dodd vishyena?',
        meaning: 'Let it be, friend! Is that really such a major issue?',
        source: {
          title: 'Provisional colloquial candidate (no established source)',
          authorOrInstitution: 'Colloquial oral usage',
          sourceLocation: 'None (pending primary source citation)',
        },
        status: 'provisional'
      }
    ],
    culturalHighlights: 'The royal Wadiyar heritage, world-famous Mysore Dasara festivities, and the cradle of modern Kannada prose.',
    dialectFeatures: {
      cadenceDescription: 'Smooth, measured cadence with balanced vowel intervals and polite clause-final descent.',
      pronouns: 'Naanu, Naavu, Neevu, Taavu',
      notableSuffixes: '-swamy, -kanayya, -bidi'
    }
  },
  {
    id: 'kalyana-karnataka',
    slotKey: 'kalyana_karnataka',
    name: 'Kalyana Karnataka (Northeastern Zone)',
    kannadaName: 'ಕಲ್ಯಾಣ ಕರ್ನಾಟಕ ಪ್ರಾದೇಶಿಕ ರೂಪ',
    taxonomyNote: 'Educational exploration grouping. Formerly referred to as Hyderabad-Karnataka. Shaped by medieval Vachana literature and historic linguistic contact with Marathi, Telugu, and Deccani Urdu.',
    description: 'Encompasses Kalaburagi, Raichur, Bidar, and Yadgir. Characterized by distinctive kinship addresses ("Bavaji"), progressive aspect markers ("-aatiro"), and historical Deccan vocabulary.',
    districtsAssociated: ['Kalaburagi', 'Raichur', 'Bidar', 'Yadgir', 'Koppal', 'Ballari'],
    isoglossNotes: 'Demonstrates strong transitional features along the Maharashtra and Telangana borders, with noticeable lexical exchange across multilingual taluks.',
    themeColor: {
      primary: 'bg-indigo-700 text-white',
      secondary: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      accent: 'border-indigo-500 text-indigo-700',
      bg: 'hover:bg-indigo-50/80',
      border: 'border-indigo-200'
    },
    characteristics: [
      'Affectionate kinship address: "Bavaji" (brother/companion)',
      'Distinct progressive verbal markers (e.g., "Madlaatiro" vs standard "Maduttiddira")',
      'Resonant, open acoustic vowels reflecting traditional pastoral life',
      'Rich vocabulary tied to red gram (Toor dal) agriculture and Sufi/Vachana heritage'
    ],
    signaturePhrases: [
      {
        kannada: 'ಏನ್ ಬಾವಾಜಿ, ಎಲ್ಲಿಗೆ ಹೊಂಟಿರೀ ಇವತ್?',
        transliteration: 'En bavaji, yellige hontiri ivath?',
        meaning: 'Hey dear friend/brother, where are you headed today?',
        source: {
          title: 'Provisional colloquial candidate (no established source)',
          authorOrInstitution: 'Colloquial oral usage',
          sourceLocation: 'None (pending primary source citation)',
        },
        status: 'provisional'
      }
    ],
    culturalHighlights: '12th-century Sharana movement cradle, Basavakalyan, Hampi UNESCO monument corridors, and historic Bahmani architecture.',
    dialectFeatures: {
      cadenceDescription: 'Deep, resonant acoustic tone with sustained interrogative stems and retroflex emphasis.',
      pronouns: 'Naanu, Naama, Neevu, Taavu',
      notableSuffixes: '-aatiro, -bavaji, -app'
    }
  },
  {
    id: 'malenadu',
    slotKey: 'malnad',
    name: 'Malenadu (Western Ghats Hill Zone)',
    kannadaName: 'ಮಲೆನಾಡು ಪ್ರಾದೇಶಿಕ ರೂಪ',
    taxonomyNote: 'Educational exploration grouping. A rugged geographic zone along the Sahyadri ranges. Includes rural plantation Kannada and transitions into Kodava and Havyaka linguistic enclaves.',
    description: 'Documented in the regional literature of Rashtrakavi Kuvempu and Poornachandra Tejaswi. Features gentle intonations, tranquil sentence structures, and an abundance of rainforest, weather, and plantation metaphors.',
    districtsAssociated: ['Shivamogga', 'Chikkamagaluru', 'Kodagu (hill tracts)', 'Hassan (Western Ghats)'],
    isoglossNotes: 'Gradually shifts eastward into the southern plains and westward into coastal Tulu and Kundagannada valleys.',
    themeColor: {
      primary: 'bg-emerald-700 text-white',
      secondary: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      accent: 'border-emerald-500 text-emerald-700',
      bg: 'hover:bg-emerald-50/80',
      border: 'border-emerald-200'
    },
    characteristics: [
      'Gentle, quiet intonational contours reflecting mountain valley life',
      'Abundance of nature, monsoon, and plantation-based idioms (Male, Thota, Kaapi)',
      'Colloquial address term: "Maraayre" (good fellow/sir)',
      'High affinity to Kuvempu’s Sahyadri romantic poetic idiom'
    ],
    signaturePhrases: [
      {
        kannada: 'ಮಳೆ ನಿಂತ ಮೇಲೆ ಕಾಫಿ ತೋಟಕ್ಕೆ ಹೋಗಿ ಬರೋಣ ಬನ್ನಿ ಮಾರಾಯ್ರೆ!',
        transliteration: 'Male nintha mele kaapi thotakke hogi barona banni maraayre!',
        meaning: 'Once the rain subsides, come let us take a walk through the coffee estate, good fellow!',
        source: {
          title: 'Provisional colloquial candidate (no established source)',
          authorOrInstitution: 'Colloquial oral usage',
          sourceLocation: 'None (pending primary source citation)',
        },
        status: 'provisional'
      }
    ],
    culturalHighlights: 'The Western Ghats UNESCO biodiversity hotspot, origin of rivers Tunga and Bhadra, and the cradle of Indian Arabica coffee.',
    dialectFeatures: {
      cadenceDescription: 'Tranquil, softer dynamic volume with extended sentence-initial pause structure.',
      pronouns: 'Naanu, Naavu, Neengolu, Avaru',
      notableSuffixes: '-maraayre, -anthu, -kandre'
    }
  },
  {
    id: 'bengaluru-urban',
    slotKey: 'central_border_cluster',
    name: 'Bengaluru Urban (Metropolitan Vernacular)',
    kannadaName: 'ನಮ್ಮ ಬೆಂಗಳೂರು (ನಗರ ಆಡುಭಾಷೆ)',
    taxonomyNote: 'Educational exploration grouping. Unlike historical rural dialects, Bengaluru Urban Kannada is a contemporary contact vernacular characterized by extensive code-mixing with English and Dravidian neighbor languages.',
    description: 'The contemporary colloquial language of Karnataka’s tech metropolis. Characterized by rapid conversational wit, auto-rickshaw idioms, bilingual code-switching ("Adjust madkoli"), and youth peer slang ("Macha", "Guru").',
    districtsAssociated: ['Bengaluru Urban', 'Bengaluru Rural (industrial belt)'],
    isoglossNotes: 'A rapidly evolving contact zone situated geographically within Old Mysore, heavily influenced by cosmopolitan migration.',
    themeColor: {
      primary: 'bg-purple-700 text-white',
      secondary: 'bg-purple-50 text-purple-900 border-purple-200',
      accent: 'border-purple-500 text-purple-700',
      bg: 'hover:bg-purple-50/80',
      border: 'border-purple-200'
    },
    characteristics: [
      'Contemporary street & youth slang: "Macha", "Guru", "Scene illa", "Bombat"',
      'Seamless English-Kannada code-mixing in public transit and office domains',
      'Punchy, fast-paced conversational tempo',
      'Observed in contemporary Bengaluru urban youth and workplace speech'
    ],
    signaturePhrases: [
      {
        kannada: 'ಏನ್ ಮಚ್ಚಾ, ಸೀನ್ ಇಲ್ಲ! ಆರಾಮಾಗಿ ಸೆಟ್ ಮಾಡಣ!',
        transliteration: 'En macha, scene illa! Aaramagi set madana!',
        meaning: 'Hey bro, no problem at all! We will comfortably take care of it!',
        source: {
          title: 'Provisional colloquial candidate (no established source)',
          authorOrInstitution: 'Colloquial oral usage',
          sourceLocation: 'None (pending primary source citation)',
        },
        status: 'provisional'
      }
    ],
    culturalHighlights: 'Global technology center, historic Kempegowda towers, iconic Darshini food culture, and cosmopolitan arts.',
    dialectFeatures: {
      cadenceDescription: 'Fast-paced, clipped tempo with frequent code-switched loanword intonations.',
      pronouns: 'Naanu, Naavu, Neenu, Neengal',
      notableSuffixes: '-macha, -guru, -alva'
    }
  }
];
