import { Region } from '../types';

export const REGIONS: Region[] = [
  {
    id: 'uttara-karnataka',
    name: 'Uttara Karnataka (Dharwad & Hubli)',
    kannadaName: 'ಉತ್ತರ ಕರ್ನಾಟಕ (ಧಾರವಾಡ - ಹುಬ್ಬಳ್ಳಿ)',
    tagline: 'Bold, rhythmic, and deeply affectionate cadence with rich colloquial charm.',
    description: 'Renowned for its warmth and rapid-fire rhythm. Uttara Karnataka Kannada famously replaces standard forms with endearing respectful honorifics like "Ri", "Sahookar", and emphatic conversational tags like "Haudla". Home of Dharwad peda, Hindustani classical legends, and saint Shishunala Sharif.',
    districts: ['Dharwad', 'Hubballi', 'Belagavi', 'Vijayapura', 'Bagalkote', 'Gadag', 'Haveri'],
    themeColor: {
      primary: 'bg-red-700 text-white',
      secondary: 'bg-red-50 text-red-900 border-red-200',
      accent: 'border-red-500 text-red-700',
      bg: 'hover:bg-red-50/80',
      border: 'border-red-200'
    },
    characteristics: [
      'Frequent usage of respectful "Ri" and "Sahookar" in everyday talks',
      'Shortening of verb suffixes (e.g., "Madodilla" -> "Madalla", "Baruvudu" -> "Barodu")',
      'Emphatic tags like "Haudla", "Kel ri", "Yakka"',
      'Unique vocabulary influenced by Deccan & Maratha linguistic borders'
    ],
    signaturePhrases: [
      {
        kannada: 'ಏನ್ರೀ ಸಾಹೂಕಾರ್, ಆರಾಮದೀರೇನ್ರಿ?',
        transliteration: 'En ri sahookar, aaram deereni?',
        meaning: 'How are you doing, chief? Everything peaceful?'
      },
      {
        kannada: 'ಹೌದ್ಲಾ! ನಾನ್ ಮೊದಲೇ ಹೇಳಿಲ್ವಾ?',
        transliteration: 'Haudla! Naan modle helilva?',
        meaning: 'Is that so! Didn\'t I tell you earlier?'
      },
      {
        kannada: 'ನಡೀರಿ ಚಾ ಕುಡಿದು ಬರೂಣು!',
        transliteration: 'Nadeeri cha kudidu baronu!',
        meaning: 'Come on, let\'s go grab a hot cup of tea!'
      }
    ],
    culturalHighlights: 'Famous for Jowar Rotti, Dharwad Peda, Bendre\'s poetry, and vibrant North Karnataka theatre (Company Nataka).',
    dialectFeatures: {
      cadence: 'Crisp, fast-tempo, rising terminal pitch',
      pronouns: 'Naanu, Naavu, Neevu, Taavu, Avaru',
      notableSuffixes: '-la, -ri, -rippa, -gowda'
    }
  },
  {
    id: 'karavali',
    name: 'Karavali & Kundapura (Coastal Karnataka)',
    kannadaName: 'ಕರಾವಳಿ ಮತ್ತು ಕುಂದಾಪ್ರ ಕನ್ನಡ',
    tagline: 'Melodic, singsong ocean-breeze tones with unique Kundapra vocabulary.',
    description: 'Stretching from Mangaluru to Kundapura and Karwar, Karavali Kannada (including the beloved Kundagannada) is characterized by an unmistakable musical intonation, distinct nasal flourishes, and vocabulary deeply shaped by the Arabian sea, Yakshagana, and Tulu bilingualism.',
    districts: ['Dakshina Kannada', 'Udupi', 'Kundapura', 'Uttara Kannada (Karwar)'],
    themeColor: {
      primary: 'bg-teal-700 text-white',
      secondary: 'bg-teal-50 text-teal-900 border-teal-200',
      accent: 'border-teal-500 text-teal-700',
      bg: 'hover:bg-teal-50/80',
      border: 'border-teal-200'
    },
    characteristics: [
      'Sing-song melodic modulation and elongated vowels',
      'Iconic terms: "En Marre", "Boliya", "Kusumbere"',
      'Unique verb conjunctions and archaic Halegannada roots preserved',
      'Intimate coastal warmth with direct, humorous candor'
    ],
    signaturePhrases: [
      {
        kannada: 'ಏನ್ ಮಾರ್ರೆ, ಇವತ್ತು ಮೀನ್ ಊಟ ಉಂಟಾ?',
        transliteration: 'En marre, ivattu meen oota unta?',
        meaning: 'What buddy, is there a fish meal ready today?'
      },
      {
        kannada: 'ಬೋಳ್ಯಾ, ಎಲ್ಲಿದ್ಯ ಮಾರ್ರೆ ಇಷ್ಟೊತ್ತಿಗೆ?',
        transliteration: 'Boliya, yellidya marre ishtottige?',
        meaning: 'Hey buddy, where were you hiding all this time?'
      },
      {
        kannada: 'ಎಂತ ಕಥೆ ಮಾರ್ರೆ, ನಡೀರಿ ಬೀಚ್ ಕಡೆ!',
        transliteration: 'Entha kathe marre, nadeeri beach kade!',
        meaning: 'What\'s the story friend, let\'s head to the beach!'
      }
    ],
    culturalHighlights: 'Yakshagana theatrical arts, Kambala buffalo races, Neer Dosa, and pristine Arabian coastlines.',
    dialectFeatures: {
      cadence: 'Wave-like musical lilt with sustained vowels',
      pronouns: 'Naan, Aangolu, Neengolu, Avaru',
      notableSuffixes: '-untu, -marre, -kandya'
    }
  },
  {
    id: 'mysuru-mandya',
    name: 'Mysuru & Mandya (Old Mysore)',
    kannadaName: 'ಮೈಸೂರು - ಮಂಡ್ಯ ಕನ್ನಡ',
    tagline: 'Polite royal Mysuru gentleness blended with the raw, earthy passion of Mandya.',
    description: 'The heart of classic Kannada heritage. Mysuru dialect is celebrated for royal courtly etiquette, pristine grammatical cadence, and gentle address ("Nodi swamy"), while Mandya adds rustic sugar-cane countryside passion, punchy humor, and expressive affection.',
    districts: ['Mysuru', 'Mandya', 'Chamarajanagar', 'Hassan', 'Ramanagara'],
    themeColor: {
      primary: 'bg-amber-700 text-white',
      secondary: 'bg-amber-50 text-amber-900 border-amber-200',
      accent: 'border-amber-500 text-amber-700',
      bg: 'hover:bg-amber-50/80',
      border: 'border-amber-200'
    },
    characteristics: [
      'Courteous royal honorifics: "Swamy", "Banni thamma", "Thumba santosho"',
      'Mandya rustic punch: "Hudgeeru", "Beda bidi", "Enappa samachara"',
      'Clarity of classical Kannada diction with rich proverbs (Gaadegalu)',
      'Famous hospitality expressions centered around Ragi Mudde and filter coffee'
    ],
    signaturePhrases: [
      {
        kannada: 'ಬನ್ನಿ ಸ್ವಾಮಿ, ಊಟ ಮಾಡ್ಕೊಂಡು ಹೋಗುವಿರಂತೆ!',
        transliteration: 'Banni swamy, oota madkondu hoguviranthe!',
        meaning: 'Please come, Sir! Please do join us for lunch before leaving!'
      },
      {
        kannada: 'ಬೇಡ ಬಿಡಿ ಸ್ವಾಮಿ, ಅದೇನ್ ದೊಡ್ಡ ವಿಷ್ಯನಾ?',
        transliteration: 'Beda bidi swamy, aden dodd vishyena?',
        meaning: 'Let it be, friend! Is that really such a big deal?'
      },
      {
        kannada: 'ರಾತ್ರಿ ರಾಗಿ ಮುದ್ದೆ ಸಾರು ಘಮ್ಮೆಂತ ಇತ್ತು ಕಣಯ್ಯ!',
        transliteration: 'Raathri ragi mudde saaru ghammentha itthu kanayya!',
        meaning: 'Last night\'s Ragi Mudde with hot saaru smelled and tasted divine!'
      }
    ],
    culturalHighlights: 'Mysuru Dasara royalty, Cauvery river delta, Mysore Palace, Ragi Mudde, and legendary Kannada literature.',
    dialectFeatures: {
      cadence: 'Smooth, measured, lyrical, and polite',
      pronouns: 'Naanu, Naavu, Neevu, Taavu',
      notableSuffixes: '-swamy, -kane, -kanayya, -bidi'
    }
  },
  {
    id: 'kalyana-karnataka',
    name: 'Kalyana Karnataka (Kalaburagi & Raichur)',
    kannadaName: 'ಕಲ್ಯಾಣ ಕರ್ನಾಟಕ (ಕಲಬುರಗಿ - ರಾಯಚೂರು)',
    tagline: 'Vachana philosophy legacy fused with Deccani historical idioms and deep warmth.',
    description: 'The cradle of 12th-century Vachana movement and Basaveshwara’s social revolution. Kalyana Karnataka dialect (formerly Hyderabad Karnataka) boasts unique idioms, respectful regional addresses like "Bavaji", and vocabulary preserved from Vijayanagara and Bahmani historic exchanges.',
    districts: ['Kalaburagi', 'Raichur', 'Bidar', 'Yadgir', 'Koppal', 'Ballari', 'Vijayanagara'],
    themeColor: {
      primary: 'bg-indigo-700 text-white',
      secondary: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      accent: 'border-indigo-500 text-indigo-700',
      bg: 'hover:bg-indigo-50/80',
      border: 'border-indigo-200'
    },
    characteristics: [
      'Unique terms like "Bavaji" (brother/friend), "Yen madlaatiro" (what are you doing)',
      'Resonant vowels reflecting traditional open-air pastoral life',
      'Rich in Vachana idioms, Basava philosophy, and folk Sufi verses',
      'Warm conversational intimacy regardless of stranger or family'
    ],
    signaturePhrases: [
      {
        kannada: 'ಏನ್ ಬಾವಾಜಿ, ಎಲ್ಲಿಗೆ ಹೊಂಟಿರೀ ಇವತ್?',
        transliteration: 'En bavaji, yellige hontiri ivath?',
        meaning: 'Hey dear friend/brother, where are you headed today?'
      },
      {
        kannada: 'ನಮ್ಮ ಕಡೆ ಬಂದ್ರೆ ಜೋಳದ ರೊಟ್ಟಿ ತಿನ್ದೇ ಹೋಗ್ಬೇಡಿ!',
        transliteration: 'Namma kade bandre jolada rotti thinde hogbedi!',
        meaning: 'When you visit our region, never leave without having fresh Jowar Roti!'
      },
      {
        kannada: 'ಯಾಕೆ ಹಿಂಗ ಮಾಡ್ಲಾತಿರೋ? ಶಾಂತೀರ್ರಿ!',
        transliteration: 'Yaake hinga madlaatiro? Shaanteerri!',
        meaning: 'Why are you behaving like this? Stay calm and peaceful!'
      }
    ],
    culturalHighlights: 'Kudalasangama confluence, Hampi UNESCO ruins, Vachana literature, and red gram (Toor Dal) heartland.',
    dialectFeatures: {
      cadence: 'Earthy, deep, rhythmic, steady tempo',
      pronouns: 'Naanu, Naama, Neevu, Taavu',
      notableSuffixes: '-aatiro, -bavaji, -app'
    }
  },
  {
    id: 'malenadu',
    name: 'Malenadu (Shivamogga & Coorg)',
    kannadaName: 'ಮಲೆನಾಡು (ಶಿವಮೊಗ್ಗ - ಚಿಕ್ಕಮಗಳೂರು)',
    tagline: 'Lush rainforest idioms, coffee estate lore, and poetic kuvempu-esque beauty.',
    description: 'Nestled along the Western Ghats where Sahyadri mist blankets coffee and arecanut plantations. Malenadu Kannada is known for poetic metaphors, tranquil phrasing, Kodagu-Kannada cross-pollination, and deep connections to Kuvempu’s Sahyadri literature.',
    districts: ['Shivamogga', 'Chikkamagaluru', 'Kodagu (Coorg)', 'Hassan (Western Hills)'],
    themeColor: {
      primary: 'bg-emerald-700 text-white',
      secondary: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      accent: 'border-emerald-500 text-emerald-700',
      bg: 'hover:bg-emerald-50/80',
      border: 'border-emerald-200'
    },
    characteristics: [
      'Gentle, quiet intonations mirroring mountain valleys',
      'Nature, weather, and plantation-rich expressions (Male, Thota, Kaapi)',
      'Close affinity to the lyrical style of Rashtrakavi Kuvempu',
      'Hospitality rooted in piping hot filter coffee and Akki Roti'
    ],
    signaturePhrases: [
      {
        kannada: 'ಮಳೆ ನಿಂತ ಮೇಲೆ ಕಾಫಿ ತೋಟಕ್ಕೆ ಹೋಗಿ ಬರೋಣ ಬನ್ನಿ!',
        transliteration: 'Male nintha mele kaapi thotakke hogi barona banni!',
        meaning: 'Once the rain subsides, come let\'s take a walk through the coffee estate!'
      },
      {
        kannada: 'ಬೆಳಗ್ಗೆಯಿಂದ ಜಿಟಿ ಜಿಟಿ ಮಳೆ ಬಿಡ್ತಾನೇ ಇಲ್ಲ ಮಾರಾಯ್ರೆ!',
        transliteration: 'Belaginda jiti jiti male bidtane illa maraayre!',
        meaning: 'Since morning, this gentle drizzle refuses to stop!'
      },
      {
        kannada: 'ಬಿಸಿಯಾದ ಅಕ್ಕಿ ರೊಟ್ಟಿ ಜೊತೆ ಬೆಣ್ಣೆ ತಗೊಳ್ಳಿ!',
        transliteration: 'Bisiyada akki rotti jothe benne tagolli!',
        meaning: 'Have some steaming hot Akki Rotti with fresh country butter!'
      }
    ],
    culturalHighlights: 'Jog Falls, Sahyadri biodiversity, Kuvempu Kuppali memorial, and India\'s finest Arabica coffee estates.',
    dialectFeatures: {
      cadence: 'Gentle, soothing, drawn-out poetic warmth',
      pronouns: 'Naanu, Naavu, Neengolu, Avaru',
      notableSuffixes: '-maraayre, -anthu, -kandre'
    }
  },
  {
    id: 'bengaluru-urban',
    name: 'Bengaluru Urban (Namma Bengaluru)',
    kannadaName: 'ನಮ್ಮ ಬೆಂಗಳೂರು (ಸಿಟಿ ಕನ್ನಡ)',
    tagline: 'Vibrant, cosmopolitan youth fusion blending tech, street slang, and rapid wit.',
    description: 'The pulse of modern Karnataka. Bengaluru Kannada is electric, witty, and effortlessly blends classic Kannada with English loanwords, auto driver banter, college lingo, and cosmopolitan urban flavor. It is the language of silk board traffic, filter coffee chats, and tech campus culture.',
    districts: ['Bengaluru Urban', 'Bengaluru Rural'],
    themeColor: {
      primary: 'bg-purple-700 text-white',
      secondary: 'bg-purple-50 text-purple-900 border-purple-200',
      accent: 'border-purple-500 text-purple-700',
      bg: 'hover:bg-purple-50/80',
      border: 'border-purple-200'
    },
    characteristics: [
      'Iconic youth slang: "Macha", "Guru", "Scene illa", "Bombat"',
      'Seamless code-mixing: "Adjust madkolla", "Scene setup maadi"',
      'Fast, snappy auto-rickshaw and tea-stall conversational punches',
      'Inclusive, street-smart urban vibe welcoming people from across India'
    ],
    signaturePhrases: [
      {
        kannada: 'ಮಚ್ಚಾ, ಟ್ರಾಫಿಕ್ ಅಲ್ಲಿ ಸಿಕ್ಕಾಕ್ಕೊಂಡಿದೀನಿ, ೧೦ ನಿಮಿಷದಲ್ಲಿ ಬರ್ತೀನಿ!',
        transliteration: 'Macha, traffic alli sikkakkondidini, 10 min alli barthini!',
        meaning: 'Bro, I\'m stuck in traffic, I\'ll reach in 10 minutes flat!'
      },
      {
        kannada: 'ಏನ್ ಗುರು, ಸೀನ್ ಇಲ್ಲ! ಆರಾಮಾಗಿ ಸೆಟ್ ಮಾಡಣ!',
        transliteration: 'En guru, scene illa! Aaramagi set madana!',
        meaning: 'Hey boss, no problem at all! We\'ll comfortably sort it out!'
      },
      {
        kannada: 'ಬಾ ಮಚ್ಚಾ, ಒಂದು ಬಿಸಿ ಬಿಸಿ ಬೈ-ಟು ಕಾಫಿ ಕುಡಿಯೋಣ!',
        transliteration: 'Baa macha, ondu bisi bisi by-two coffee kudiyona!',
        meaning: 'Come bro, let\'s share a piping hot by-two filter coffee!'
      }
    ],
    culturalHighlights: 'Tech parks, Cubbon Park Sunday mornings, Vidyarthi Bhavan dosas, and rock & indie music scenes.',
    dialectFeatures: {
      cadence: 'Fast, punchy, punchline-driven, hybrid vocabulary',
      pronouns: 'Naanu, Naavu, Neenu, Neengal',
      notableSuffixes: '-macha, -guru, -alva, -kane'
    }
  }
];
