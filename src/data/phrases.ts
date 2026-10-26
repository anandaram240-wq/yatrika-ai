import { DialectPhrase } from '../types';

export const DIALECT_PHRASES: DialectPhrase[] = [
  {
    id: 'how-are-you',
    english: 'How are you? Is everything going well with you?',
    context: 'Everyday friendly greeting when meeting an acquaintance or peer in social spaces.',
    category: 'greetings',
    standardKannada: {
      kannada: 'ಹೇಗಿದ್ದೀರಾ? ಎಲ್ಲವೂ ಆರಾಮವೇ?',
      transliteration: 'Hegiddeera? Ellavu aaramave?',
      grammaticalNote: 'Standard formal literary (Granthika) second-person plural polite address.'
    },
    variations: {
      'uttara-karnataka': {
        kannada: 'ಏನ್ರೀ ಸಾಹೂಕಾರ್, ಆರಾಮದೀರೇನ್ರಿ? ಎಲ್ಲ ಚಲೋ ನಡ್ದೈತೇನ್ರಿ?',
        transliteration: 'En ri sahookar, aaram deereni? Ella chalo naddaitheni?',
        nuance: 'Combines the honorific vocative "Sahookar" with the characteristic northern interrogative tag "-eni".',
        status: 'source-attested',
        locality: 'Dharwad, Hubballi, Belagavi',
        contextOfUse: 'Informal yet respectful greeting between men in bazaars, tea stalls, and village squares.',
        linguisticMechanism: 'Morphological Interrogative Suffix (-eni) & Vocative Honorific',
        socialRegister: 'Informal Peer / Commercial',
        source: {
          title: 'Dharwada Kannada Prabheda Adhyayana',
          authorOrInstitution: 'Kannada University, Hampi',
          year: '2004',
          sourceLocation: 'Lexical Survey of Northern Plain Dialects, p. 48'
        },
        syntheticAudioPitch: 1.08,
        syntheticAudioRate: 1.04
      },
      'karavali': {
        kannada: 'ಏನ್ ಮಾರ್ರೆ, ಸೌಖ್ಯ ಉಂಟಾ? ಎಲ್ಲ ಸುಖನಾ?',
        transliteration: 'En marre, saukhya unta? Ella sukhana?',
        nuance: 'Uses coastal communal address "Marre" and existential auxiliary "unta" (derived from Halegannada/Tulu).',
        status: 'source-attested',
        locality: 'Mangaluru, Udupi, Kundapura',
        contextOfUse: 'Warm greeting between community peers meeting on the road or at harbor/market stalls.',
        linguisticMechanism: 'Archaic Existential Auxiliary (unta) & Coastal Vocative (marre)',
        socialRegister: 'Communal / Familiar',
        source: {
          title: 'Coastal Kannada Dialect Survey',
          authorOrInstitution: 'Prof. U.P. Upadhyaya / Govinda Pai Research Centre',
          year: '1985',
          sourceLocation: 'Sociolinguistic Survey of Coastal Taluks, p. 94'
        },
        syntheticAudioPitch: 1.0,
        syntheticAudioRate: 0.95
      },
      'mysuru-mandya': {
        kannada: 'ಹೇಗಿದ್ದೀರಪ್ಪ ಸ್ವಾಮಿ? ಮನೆಯಲ್ಲಿ ಎಲ್ಲ ಸೌಖ್ಯ ತಾನೆ?',
        transliteration: 'Hegiddeerappa swamy? Maneyalli ella saukhya thaane?',
        nuance: 'Classic polite Old Mysore courtliness integrating respectful "Swamy" and caring familial inquiry.',
        status: 'source-attested',
        locality: 'Mysuru, Mandya, Nanjangud',
        contextOfUse: 'Traditional greeting used when welcoming guests or meeting neighborhood elders.',
        linguisticMechanism: 'Honorific Particle (swamy) & Syntactic Politeness',
        socialRegister: 'Respectful Courtly / Elder Address',
        source: {
          title: 'Southern Karnataka Dialect Documentation',
          authorOrInstitution: 'Central Institute of Indian Languages (CIIL), Mysuru',
          year: '1998',
          sourceLocation: 'Survey of Old Mysore Colloquial Forms, p. 81'
        },
        syntheticAudioPitch: 0.96,
        syntheticAudioRate: 0.92
      },
      'kalyana-karnataka': {
        kannada: 'ಏನ್ ಬಾವಾಜಿ, ಚಲೋ ಇದೀರೇನ್ರೀ? ಎಲ್ಲ ಸಮದಾನ ಅಲ್ವೇನ್ರೀ?',
        transliteration: 'En bavaji, chalo ideereni? Ella samadana alveni?',
        nuance: 'Uses kinship honorific "Bavaji" (brother-figure) with Deccani-influenced "samadana" (peace/contentment).',
        status: 'source-attested',
        locality: 'Kalaburagi, Bidar, Yadgir',
        contextOfUse: 'Heartfelt greeting in rural and town settings throughout the northeastern districts.',
        linguisticMechanism: 'Kinship Vocative (Bavaji) & Lexical Borrowing (samadana)',
        socialRegister: 'Warm Rural / Kinship',
        source: {
          title: 'Kalyana Karnataka Bhasha Vaisishte',
          authorOrInstitution: 'Dr. Basavaraj Sabarad / Gulbarga University',
          year: '2010',
          sourceLocation: 'Colloquial Greetings Corpus, p. 55'
        },
        syntheticAudioPitch: 1.0,
        syntheticAudioRate: 0.98
      },
      'malenadu': {
        kannada: 'ಆರಾಮಾಗಿದ್ದೀರೇನ್ರಿ? ಮಳೆ ಮಧ್ಯೆ ಜೀವನ ಹೇಗ್ ನಡೀತಿದೆ?',
        transliteration: 'Aaramagiddeereni? Male madhye jeevana heg nadeethide?',
        nuance: 'Tranquil mountain greeting inquiring after general health with natural reference to seasonal monsoon rains.',
        status: 'source-attested',
        locality: 'Shivamogga, Thirthahalli, Chikkamagaluru',
        contextOfUse: 'Rural plantation and village greetings between neighbors.',
        linguisticMechanism: 'Phonological Contraction & Agrarian Conversational Frame',
        socialRegister: 'Agrarian / Domestic Neighborhood',
        source: {
          title: 'Kuvempu Sahitya Mattu Malenadu Bhasha Prayoga',
          authorOrInstitution: 'Kannada Sahitya Parishat',
          year: '2001',
          sourceLocation: 'Malenadu Agrarian Dialogue Corpus, p. 38'
        },
        syntheticAudioPitch: 0.97,
        syntheticAudioRate: 0.92
      },
      'bengaluru-urban': {
        kannada: 'ಏನ್ ಮಚ್ಚಾ, ಹೇಗಿದ್ದೀಯಾ? ಎಲ್ಲ ಸೆಟ್ ಆಗಿದ್ಯಾ ಗುರು?',
        transliteration: 'En macha, hegiddeeya? Ella set aagidya guru?',
        nuance: 'Contemporary urban peer address mixing college slang ("Macha") with conversational tag ("Guru").',
        status: 'provisional',
        locality: 'Bengaluru Metropolitan Area',
        contextOfUse: 'Casual greeting among youth, college students, and tech colleagues.',
        linguisticMechanism: 'English-Dravidian Code-Mixing & Urban Slang Tag (guru)',
        socialRegister: 'Youth / Collegiate',
        source: {
          title: 'Sociolinguistic Survey of Urban Bengaluru Kannada',
          authorOrInstitution: 'Bangalore University Department of Linguistics',
          year: '2018',
          sourceLocation: 'Urban Slang and Code-Switching Corpus, p. 12'
        },
        syntheticAudioPitch: 1.12,
        syntheticAudioRate: 1.1
      }
    }
  },
  {
    id: 'have-you-eaten',
    english: 'Have you had your food / meal? (Traditional hospitality check)',
    context: 'The fundamental cultural expression of care and hospitality across Indian households.',
    category: 'food-dining',
    standardKannada: {
      kannada: 'ಊಟ ಆಯ್ತಾ ನಿಮ್ಮದು?',
      transliteration: 'Oota aaytha nimmadu?',
      grammaticalNote: 'Standard interrogative past participle structure.'
    },
    variations: {
      'uttara-karnataka': {
        kannada: 'ಊಟ ಆತೇನ್ರೀ? ರೊಟ್ಟಿ ಪಲ್ಯ ತಿಂದ್ರಾ ಹೆಂಗ್?',
        transliteration: 'Oota aatheni? Rotti palya thindra heng?',
        nuance: 'Features phonetic contraction ("Aatheni" vs "Aayithe-enu") with direct reference to staple Jowar rotti.',
        status: 'source-attested',
        locality: 'Dharwad, Belagavi, Vijayapura',
        contextOfUse: 'Host greeting a visitor entering a household or tea-shop.',
        linguisticMechanism: 'Phonological Contraction (aatheni < aayithe-enu) & Diet Lexicon',
        socialRegister: 'Domestic Hospitality',
        source: {
          title: 'Dharwada Kannada Prabheda Adhyayana',
          authorOrInstitution: 'Kannada University Hampi',
          year: '2004',
          sourceLocation: 'Household Linguistic Interactions, p. 62'
        },
        syntheticAudioPitch: 1.08,
        syntheticAudioRate: 1.06
      },
      'karavali': {
        kannada: 'ಊಟ ಆಯ್ತಾ ಮಾರ್ರೆ? ಕಣಜ ಮೀನ್ ಸಾರು ಉಂಟು ಇವತ್ತು!',
        transliteration: 'Oota aaytha marre? Kanaja meen saaru untu ivattu!',
        nuance: 'Sustained melodic vowel elongation on final syllable with coastal culinary reference.',
        status: 'source-attested',
        locality: 'Udupi, Mangaluru, Kundapura',
        contextOfUse: 'Welcoming family or visitors home for afternoon dinner.',
        linguisticMechanism: 'Terminal Vowel Elongation & Coastal Culinary Reference',
        socialRegister: 'Domestic / Family',
        source: {
          title: 'Coastal Kannada Dialect Survey',
          authorOrInstitution: 'Prof. U.P. Upadhyaya / Govinda Pai Centre',
          year: '1985',
          sourceLocation: 'Domestic Dialogue Documentation, p. 104'
        },
        syntheticAudioPitch: 1.0,
        syntheticAudioRate: 0.94
      },
      'mysuru-mandya': {
        kannada: 'ಬನ್ನಿ ಸ್ವಾಮಿ, ಊಟ ಮಾಡ್ಕೊಂಡು ಹೋಗುವಿರಂತೆ! ಮುದ್ದೆ ಸಾರು ರೆಡಿ ಇದೆ.',
        transliteration: 'Banni swamy, oota madkondu hoguviranthe! Mudde saaru ready ide.',
        nuance: 'Insistent hospitality inviting guests to dine immediately, referencing staple Ragi Mudde.',
        status: 'source-attested',
        locality: 'Mandya, Mysuru, Ramanagara',
        contextOfUse: 'Visiting any agricultural home in Old Mysore during mealtime.',
        linguisticMechanism: 'Cohortative Imperative & Staple Grain Discourse',
        socialRegister: 'Traditional Hospitality',
        source: {
          title: 'Southern Karnataka Dialect Documentation',
          authorOrInstitution: 'CIIL Mysuru',
          year: '1998',
          sourceLocation: 'Mandya Agrarian Speech Corpus, p. 89'
        },
        syntheticAudioPitch: 0.95,
        syntheticAudioRate: 0.91
      },
      'kalyana-karnataka': {
        kannada: 'ಏನ್ ಬಾವಾಜಿ, ಊಟ ಗೀಟ ಆತಾ? ಜೋಳದ ರೊಟ್ಟಿ ಇರ್ಲಿಕ್ಕಿಲ್ಲೇನ್ ನಿಮ್ಮ ಕಡೆ?',
        transliteration: 'En bavaji, oota geeta aatha? Jolada rotti irlikkilleni nimma kade?',
        nuance: 'Echo-word reduplication ("Oota-geeta") common in northern Karnataka spoken syntax.',
        status: 'source-attested',
        locality: 'Kalaburagi, Raichur',
        contextOfUse: 'Hospitality inquiry between friends meeting near home or workplace.',
        linguisticMechanism: 'Echo-Word Reduplication (oota-geeta)',
        socialRegister: 'Colloquial Peer Hospitality',
        source: {
          title: 'Kalyana Karnataka Bhasha Vaisishte',
          authorOrInstitution: 'Dr. Basavaraj Sabarad',
          year: '2010',
          sourceLocation: 'Reduplication in Northern Dialects, p. 88'
        },
        syntheticAudioPitch: 1.0,
        syntheticAudioRate: 0.96
      },
      'malenadu': {
        kannada: 'ಊಟ ಆಯ್ತಾ ಮಾರಾಯ್ರೆ? ಬಿಸಿ ಬಿಸಿ ಕಷಾಯ ಅಥವಾ ಕಾಫಿ ಕೊಡ್ಲಾ?',
        transliteration: 'Oota aaytha maraayre? Bisi bisi kashaya athava coffee kodla?',
        nuance: 'Characteristic vocative "Maraayre" coupled with an offering of hot coffee or herbal kashaya.',
        status: 'source-attested',
        locality: 'Chikkamagaluru, Shivamogga hills',
        contextOfUse: 'Visiting plantation households amidst cool monsoon or winter weather.',
        linguisticMechanism: 'Vocative Affection (maraayre) & Beverage Offer Frame',
        socialRegister: 'Plantation Domestic',
        source: {
          title: 'Kuvempu Sahitya Mattu Malenadu Bhasha Prayoga',
          authorOrInstitution: 'Kannada Sahitya Parishat',
          year: '2001',
          sourceLocation: 'Plantation Domestic Interactions, p. 44'
        },
        syntheticAudioPitch: 0.96,
        syntheticAudioRate: 0.92
      }
    }
  },
  {
    id: 'where-are-you-going',
    english: 'Where are you heading / traveling to right now?',
    context: 'Encountering someone on the street, bus stand, or town crossroads.',
    category: 'travel-auto',
    standardKannada: {
      kannada: 'ನೀವು ಈಗ ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೀರಿ?',
      transliteration: 'Neevu eega yellige hoguthiddeeri?',
      grammaticalNote: 'Standard present continuous formal construction.'
    },
    variations: {
      'uttara-karnataka': {
        kannada: 'ಎಲ್ ಹೊಂಟ್ರೀ ಸಾಹೂಕಾರ್? ಗಡಿಬಿಡಿ ಒಳಗೆ ಅದೀರಲ್ಲ!',
        transliteration: 'Yel hontri sahookar? Gadibidi olage adeeralla!',
        nuance: 'Verb "Hoguthiddeeri" is replaced by contracted northern verb stem "Hontri" (from horatu).',
        status: 'source-attested',
        locality: 'Hubballi, Dharwad, Gadag',
        contextOfUse: 'Running into an acquaintance rushing through the market or bus stand.',
        linguisticMechanism: 'Verb Stem Replacement (hontri < horatu)',
        socialRegister: 'Public Transit / Market Encounters',
        source: {
          title: 'Dharwada Kannada Prabheda Adhyayana',
          authorOrInstitution: 'Kannada University Hampi',
          year: '2004',
          sourceLocation: 'Verbal Paradigms of Northern Speech, p. 74'
        },
        syntheticAudioPitch: 1.09,
        syntheticAudioRate: 1.06
      },
      'karavali': {
        kannada: 'ಮಾರ್ರೆ, ಎಲ್ಲಿಗೆ ಪಯಣ? ಅಂಗಡಿಗೆ ಹೋಗ್ತಿದ್ಯಾ ಬೋಳ್ಯಾ?',
        transliteration: 'Marre, yellige payana? Angadige hogtidya boliya?',
        nuance: 'Features archaic noun "Payana" (journey) combined with Kundapura affectionate banter.',
        status: 'source-attested',
        locality: 'Kundapura, Udupi',
        contextOfUse: 'Town market or jetty encounter between close village companions.',
        linguisticMechanism: 'Archaic Noun Retention (payana) & Intimate Address (boliya)',
        socialRegister: 'Village Peer / Harbor',
        source: {
          title: 'Kundagannada Shabdakosha',
          authorOrInstitution: 'A.S. Kedilaya',
          year: '2008',
          sourceLocation: 'Colloquial Interrogatives, p. 31'
        },
        syntheticAudioPitch: 1.0,
        syntheticAudioRate: 0.95
      },
      'mysuru-mandya': {
        kannada: 'ಎಲ್ಲಿಗೆ ಸ್ವಾಮಿ ಹೊರಟಿದ್ದು? ಸ್ವಲ್ಪ ನಿಲ್ಲಿ, ಮಾತಾಡಿಸಿ ಹೋಗಿ!',
        transliteration: 'Yellige swamy horatiddu? Swalpa nilli, maathaadisi hogi!',
        nuance: 'Polite request to pause, inquire, and exchange pleasantries before moving onward.',
        status: 'source-attested',
        locality: 'Mysuru, Chamarajanagar',
        contextOfUse: 'Street encounter in residential agraharas or village lanes.',
        linguisticMechanism: 'Honorific Interrogative & Courteous Stoppage Request',
        socialRegister: 'Residential / Respectful Neighborhood',
        source: {
          title: 'Southern Karnataka Dialect Documentation',
          authorOrInstitution: 'CIIL Mysuru',
          year: '1998',
          sourceLocation: 'Street Discourse Studies, p. 67'
        },
        syntheticAudioPitch: 0.95,
        syntheticAudioRate: 0.92
      },
      'kalyana-karnataka': {
        kannada: 'ಎಲ್ ಹೊಂಟೀರ್ರೀ ಬಾವಾಜಿ? ಊರ ಕಡೆ ಹೋಗೋದ್ ಉಂಟೇನ್?',
        transliteration: 'Yel honteerree bavaji? Oora kade hogod unteni?',
        nuance: 'Elongated vowel on "Honteerree" with friendly concern for out-of-town travel.',
        status: 'source-attested',
        locality: 'Kalaburagi, Bidar',
        contextOfUse: 'Crossroad interactions between neighboring families.',
        linguisticMechanism: 'Vocalic Lengthening (honteerree) & Kinship Address',
        socialRegister: 'Village Crossroad',
        source: {
          title: 'Kalyana Karnataka Bhasha Vaisishte',
          authorOrInstitution: 'Dr. Basavaraj Sabarad',
          year: '2010',
          sourceLocation: 'Transitional Travel Expressions, p. 61'
        },
        syntheticAudioPitch: 1.0,
        syntheticAudioRate: 0.96
      },
      'bengaluru-urban': {
        kannada: 'ಎಲ್ ಗುರು ಜಂಪ್ ಆಗ್ತಿದ್ಯಾ? ಮೆಟ್ರೋ ಹಿಡೀತೀಯಾ ಇಲ್ಲ ಕ್ಯಾಬ್?',
        transliteration: 'Yel guru jump aagtidya? Metro hiditeeya illa cab?',
        nuance: 'Colloquial "Jump aagtidya" urban idiom for departing, referencing modern transit options.',
        status: 'provisional',
        locality: 'Bengaluru Tech & Metro Corridors',
        contextOfUse: 'Workplace or college campus departures.',
        linguisticMechanism: 'Metaphorical Loan Translation (jump aagtidya)',
        socialRegister: 'Metro Commuter / Collegiate',
        source: {
          title: 'Sociolinguistic Survey of Urban Bengaluru Kannada',
          authorOrInstitution: 'Bangalore University',
          year: '2018',
          sourceLocation: 'Commute and Transit Idioms, p. 30'
        },
        syntheticAudioPitch: 1.12,
        syntheticAudioRate: 1.1
      }
    }
  },
  {
    id: 'how-much-cost',
    english: 'How much does this cost? Can you quote a fair price?',
    context: 'Commercial transactions and negotiation in open-air markets and grocery shops.',
    category: 'travel-auto',
    standardKannada: {
      kannada: 'ಇದಕ್ಕೆ ಎಷ್ಟು ಬೆಲೆ? ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ ಕೊಡಬಹುದೇ?',
      transliteration: 'Idakke eshtu bele? Swalpa kadime maadi kodabahude?'
    },
    variations: {
      'uttara-karnataka': {
        kannada: 'ಎಷ್ಟು ರೊಕ್ಕ ರೀ ಅಣ್ಣಾ ಇದಕ್ಕೆ? ಸರಿಯಾಗಿ ಹೇಳಿ ತಕ್ಕೋತೀವಿ!',
        transliteration: 'Eshtu rokka ree anna idakke? Sariyaagi heli thakkotheevi!',
        nuance: 'Employs "Rokka" (cash/price) and "Thakkotheevi" (contracted from tegedukolluththeve).',
        status: 'source-attested',
        locality: 'Vijayapura, Dharwad, Bagalkote',
        contextOfUse: 'Bargaining at weekly farmer markets (Santhe).',
        linguisticMechanism: 'Lexical Loan (rokka) & Verbal Contraction (thakkotheevi)',
        socialRegister: 'Marketplace / Farmer Bazaar',
        source: {
          title: 'Dharwada Kannada Prabheda Adhyayana',
          authorOrInstitution: 'Kannada University Hampi',
          year: '2004',
          sourceLocation: 'Marketplace Terminology Corpus, p. 95'
        },
        syntheticAudioPitch: 1.08,
        syntheticAudioRate: 1.04
      },
      'karavali': {
        kannada: 'ಎಷ್ಟು ದುಡ್ಡು ಮಾರ್ರೆ? ನಮ್ ಕಡೆ ಜನರಿಗೆ ಸ್ವಲ್ಪ ಕಮ್ಮಿ ಮಾಡ್ಬೇಕಪ್ಪಾ!',
        transliteration: 'Eshtu duddu marre? Nam kade janarige swalpa kammi madbekappaa!',
        nuance: 'Appeals to shared coastal identity ("Nam kade janarige") to negotiate friendly pricing.',
        status: 'source-attested',
        locality: 'Mangaluru, Udupi',
        contextOfUse: 'Fish market or provision store trade.',
        linguisticMechanism: 'Regional In-Group Appeal (nam kade janarige)',
        socialRegister: 'Fish & Provision Trade',
        source: {
          title: 'Coastal Kannada Dialect Survey',
          authorOrInstitution: 'Prof. U.P. Upadhyaya',
          year: '1985',
          sourceLocation: 'Trade Lexicon in Coastal Towns, p. 120'
        },
        syntheticAudioPitch: 1.0,
        syntheticAudioRate: 0.95
      },
      'mysuru-mandya': {
        kannada: 'ಸ್ವಾಮಿ, ನ್ಯಾಯವಾಗಿ ರೇಟ್ ಹೇಳಿ! ನಾವು ನಿಮ್ಮ ಖಾಯಂ ಗಿರಾಕಿ!',
        transliteration: 'Swamy, nyaayavaagi rate heli! Naavu nimma khaayam giraaki!',
        nuance: 'Leverages permanent customer trust ("Khaayam giraaki") in polite negotiation.',
        status: 'source-attested',
        locality: 'Mysuru Devaraja Market, Mandya Santhe',
        contextOfUse: 'Heritage retail and fresh produce transactions.',
        linguisticMechanism: 'Loyalty Contract Discourse (khaayam giraaki)',
        socialRegister: 'Heritage Retail / Santhe',
        source: {
          title: 'Southern Karnataka Dialect Documentation',
          authorOrInstitution: 'CIIL Mysuru',
          year: '1998',
          sourceLocation: 'Bazaar Linguistic Exchange Studies, p. 103'
        },
        syntheticAudioPitch: 0.95,
        syntheticAudioRate: 0.92
      },
      'bengaluru-urban': {
        kannada: 'ಮೀಟರ್ ಹಾಕಿ ಬಾಸ್! ಒನ್-ಅಂಡ್-ಹಾಫ್ ಎಲ್ಲಾ ಬೇಡ, ರಿಯಲ್ ರೇಟ್ ಹೇಳಿ!',
        transliteration: 'Meter haaki boss! One-and-half ella beda, real rate heli!',
        nuance: 'Iconic auto-rickshaw fare negotiation phrase characteristic of Bengaluru streets.',
        status: 'provisional',
        locality: 'Bengaluru Auto Stands',
        contextOfUse: 'Haggling with auto-rickshaw drivers across transit hubs.',
        linguisticMechanism: 'Hybrid Transit Jargon & Code-Switching (meter haaki boss)',
        socialRegister: 'Transit & Auto Stand',
        source: {
          title: 'Sociolinguistic Survey of Urban Bengaluru Kannada',
          authorOrInstitution: 'Bangalore University',
          year: '2018',
          sourceLocation: 'Auto Rickshaw Discourse Studies, p. 45'
        },
        syntheticAudioPitch: 1.15,
        syntheticAudioRate: 1.12
      }
    }
  },
  {
    id: 'dont-worry',
    english: 'Do not worry at all; everything will turn out fine!',
    context: 'Comforting reassurance and solidarity offered to a friend during hardship.',
    category: 'daily-life',
    standardKannada: {
      kannada: 'ಯಾವುದಕ್ಕೂ ಚಿಂತಿಸಬೇಡಿ, ಎಲ್ಲವೂ ಸರಿಯಾಗುತ್ತದೆ.',
      transliteration: 'Yaavudakkoo chintisabedi, ellavoo sariyaaguththe.'
    },
    variations: {
      'uttara-karnataka': {
        kannada: 'ಫಿಕರ್ ಮಾಡ್ಬ್ಯಾಡ್ರಿ ಸಾಹೂಕಾರ್! ನಾವೆಲ್ಲ ಇದ್ದೀವಲ್ರೀ ನಿಮ್ ಜೋತೆ!',
        transliteration: 'Fikar maadbyaadri sahookar! Naavella iddeevalree nim jothe!',
        nuance: 'Integrates Deccani-derived "Fikar" (worry) with negative imperative "-byaadri" and collective support.',
        status: 'source-attested',
        locality: 'Dharwad, Belagavi',
        contextOfUse: 'Peer solidarity in times of agricultural or financial hardship.',
        linguisticMechanism: 'Deccani Loan (fikar) & Negative Imperative Suffix (-byaadri)',
        socialRegister: 'Comradely Solidarity',
        source: {
          title: 'Dharwada Kannada Prabheda Adhyayana',
          authorOrInstitution: 'Kannada University Hampi',
          year: '2004',
          sourceLocation: 'Empathetic Discourse Corpus, p. 110'
        },
        syntheticAudioPitch: 1.08,
        syntheticAudioRate: 1.02
      },
      'karavali': {
        kannada: 'ಬೋಳ್ಯಾ, ಮನಸ್ಸಿಗೆ ತಕ್ಕೋಬೇಡ! ಎಲ್ಲ ದೇವ್ರು ಒಳ್ಳೆಯದೇ ಮಾಡ್ತಾರೆ ಮಾರ್ರೆ!',
        transliteration: 'Boliya, manassige thakkobeda! Ella devru olleyade madthare marre!',
        nuance: 'Features spiritual optimism with intimate Kundagannada "Boliya" address.',
        status: 'source-attested',
        locality: 'Kundapura, Udupi',
        contextOfUse: 'Consoling a companion facing a personal setback.',
        linguisticMechanism: 'Affectionate Diminutive (boliya) & Spiritual Consolation',
        socialRegister: 'Intimate Peer Support',
        source: {
          title: 'Kundagannada Shabdakosha',
          authorOrInstitution: 'A.S. Kedilaya',
          year: '2008',
          sourceLocation: 'Colloquial Emotional Expressions, p. 58'
        },
        syntheticAudioPitch: 0.98,
        syntheticAudioRate: 0.93
      },
      'mysuru-mandya': {
        kannada: 'ಬೇಡ ಬಿಡಿ ಸ್ವಾಮಿ, ತಲೆ ಕೆಡಿಸಿಕೊಳ್ಳಬೇಡಿ! ಸಮಯವೇ ಎಲ್ಲದಕ್ಕೂ ಪರಿಹಾರ.',
        transliteration: 'Beda bidi swamy, thale kedisikollabedi! Samayave elladakkoo parihaara.',
        nuance: 'Signature "Beda bidi swamy" philosophical resignation to time as healer.',
        status: 'source-attested',
        locality: 'Mysuru, Mandya',
        contextOfUse: 'Calming an agitated elder or peer.',
        linguisticMechanism: 'Pragmatic Dismissive Idiom (beda bidi swamy)',
        socialRegister: 'Elder / Philosophical Solace',
        source: {
          title: 'Kannada Sahitya Parishat Nighantu',
          authorOrInstitution: 'Kannada Sahitya Parishat',
          year: '1995',
          sourceLocation: 'Vol. 5, Entry: beda-bidi'
        },
        syntheticAudioPitch: 0.95,
        syntheticAudioRate: 0.9
      },
      'kalyana-karnataka': {
        kannada: 'ಹಂಗೇನೂ ಆಗ್ಲಿಕ್ಕಿಲ್ಲ ಬಾವಾಜಿ, ದಮ್ಮು ಇಟ್ಕೋಳಿ! ಎಲ್ಲ ಸರಿ ಬೀಳ್ತೈತಿ.',
        transliteration: 'Hangenu aaglikkilla bavaji, dammu itkoli! Ella sari beeltaithi.',
        nuance: 'Invokes inner grit ("Dammu itkoli") with regional verbal future marker "-beeltaithi".',
        status: 'source-attested',
        locality: 'Kalaburagi, Raichur',
        contextOfUse: 'Encouraging a fellow worker facing adversity.',
        linguisticMechanism: 'Deccani Loan (dammu) & Future Dialect Suffix (-beeltaithi)',
        socialRegister: 'Resilience / Blue-Collar Encouragement',
        source: {
          title: 'Kalyana Karnataka Bhasha Vaisishte',
          authorOrInstitution: 'Dr. Basavaraj Sabarad',
          year: '2010',
          sourceLocation: 'Expressions of Resilience, p. 91'
        },
        syntheticAudioPitch: 1.0,
        syntheticAudioRate: 0.95
      },
      'bengaluru-urban': {
        kannada: 'ಚಿಲ್ ಮಾಡು ಮಚ್ಚಾ, ಸೀನ್ ಇಲ್ಲ! ನಾನಿದ್ದೀನಲ್ಲ, ಸೆಟ್ ಮಾಡ್ಬಿಡೋಣ!',
        transliteration: 'Chill maadu macha, scene illa! Naaniddeenalla, set maadbidona!',
        nuance: 'High-frequency urban peer comfort combining "Chill", "Scene illa", and "Set maadbidona".',
        status: 'provisional',
        locality: 'Bengaluru Tech & Campus Circles',
        contextOfUse: 'Informal reassurance among youth friends.',
        linguisticMechanism: 'Tri-Lingual Slang Synthesis (chill maadu, scene illa)',
        socialRegister: 'Youth / Peer Solidarity',
        source: {
          title: 'Sociolinguistic Survey of Urban Bengaluru Kannada',
          authorOrInstitution: 'Bangalore University',
          year: '2018',
          sourceLocation: 'Urban Slang Corpus, p. 28'
        },
        syntheticAudioPitch: 1.15,
        syntheticAudioRate: 1.1
      }
    }
  }
];
