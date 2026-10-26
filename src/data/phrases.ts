import { DialectPhrase } from '../types';

export const DIALECT_PHRASES: DialectPhrase[] = [
  {
    id: 'how-are-you',
    english: 'How are you? Is everything going well?',
    context: 'Standard friendly greeting used when meeting a friend or acquaintance.',
    category: 'greetings',
    standardKannada: {
      kannada: 'ಹೇಗಿದ್ದೀರಾ? ಎಲ್ಲವೂ ಆರಾಮವೇ?',
      transliteration: 'Hegiddeera? Ellavu aaramave?'
    },
    variations: {
      'uttara-karnataka': {
        kannada: 'ಏನ್ರೀ ಸಾಹೂಕಾರ್, ಆರಾಮದೀರೇನ್ರಿ? ಎಲ್ಲ ಚಲೋ ನಡ್ದೈತೇನ್ರಿ?',
        transliteration: 'En ri sahookar, aaram deereni? Ella chalo naddaitheni?',
        nuance: 'Warm, respectful honorific "Sahookar" with quick cadence.',
        audioPitch: 1.1,
        audioRate: 1.05
      },
      'karavali': {
        kannada: 'ಏನ್ ಮಾರ್ರೆ, ಸುಖ ಉಂಟಾ? ಎಲ್ಲ ಸೌಖ್ಯನಾ?',
        transliteration: 'En marre, sukha unta? Ella saukhyana?',
        nuance: 'Signature "En marre" greeting with coastal melodic rising tone.',
        audioPitch: 1.0,
        audioRate: 0.95
      },
      'mysuru-mandya': {
        kannada: 'ಹೇಗಿದ್ದೀರಪ್ಪ ಸ್ವಾಮಿ? ಮನೆಯಲ್ಲಿ ಎಲ್ಲ ಸೌಖ್ಯ ತಾನೆ?',
        transliteration: 'Hegiddeerappa swamy? Maneyalli ella saukhya thaane?',
        nuance: 'Classic polite Mysuru courtliness with gentle "Swamy" tag.',
        audioPitch: 0.95,
        audioRate: 0.92
      },
      'kalyana-karnataka': {
        kannada: 'ಏನ್ ಬಾವಾಜಿ, ಚಲೋ ಇದೀರೇನ್ರೀ? ಎಲ್ಲ ಸಮದಾನ ಅಲ್ವೇನ್ರೀ?',
        transliteration: 'En bavaji, chalo ideereni? Ella samadana alveni?',
        nuance: 'Intimate "Bavaji" (brother-figure) with comforting tone.',
        audioPitch: 1.0,
        audioRate: 0.98
      },
      'malenadu': {
        kannada: 'ಆರಾಮಾಗಿದ್ದೀರೇನ್ರಿ? ಮಳೆ ಮಧ್ಯೆ ಜೀವನ ಹೇಗ್ ನಡೀತಿದೆ?',
        transliteration: 'Aaramagiddeereni? Male madhye jeevana heg nadeethide?',
        nuance: 'Gentle, soothing mountain tone inquiring about health and weather.',
        audioPitch: 0.98,
        audioRate: 0.9
      },
      'bengaluru-urban': {
        kannada: 'ಏನ್ ಮಚ್ಚಾ, ಹೇಗಿದ್ದೀಯಾ? ಎಲ್ಲ ಸೆಟ್ ಆಗಿದ್ಯಾ ಗುರು?',
        transliteration: 'En macha, hegiddeeya? Ella set aagidya guru?',
        nuance: 'Peppy street/tech combo using "Macha" and "Guru".',
        audioPitch: 1.15,
        audioRate: 1.1
      }
    }
  },
  {
    id: 'have-you-eaten',
    english: 'Have you had your food / meal?',
    context: 'The quintessential Indian expression of hospitality and care.',
    category: 'food-dining',
    standardKannada: {
      kannada: 'ಊಟ ಆಯ್ತಾ ನಿಮ್ಮದು?',
      transliteration: 'Oota aaytha nimmadu?'
    },
    variations: {
      'uttara-karnataka': {
        kannada: 'ಊಟ ಆತೇನ್ರೀ? ರೊಟ್ಟಿ ಪಲ್ಯ ತಿಂದ್ರಾ ಹೆಂಗ್?',
        transliteration: 'Oota aatheni? Rotti palya thindra heng?',
        nuance: 'Shortened "Aatheni" with direct reference to staple Rotti.',
        audioPitch: 1.1,
        audioRate: 1.1
      },
      'karavali': {
        kannada: 'ಊಟ ಆಯ್ತಾ ಮಾರ್ರೆ? ಕಣಜ ಮೀನ್ ಸಾರು ಇತ್ತು ಇವತ್ತು!',
        transliteration: 'Oota aaytha marre? Kanaja meen saaru itthu ivattu!',
        nuance: 'Sung with lingering final syllable and coastal warmth.',
        audioPitch: 1.0,
        audioRate: 0.92
      },
      'mysuru-mandya': {
        kannada: 'ಬನ್ನಿ ಸ್ವಾಮಿ, ಊಟ ಮಾಡ್ಕೊಂಡು ಹೋಗುವಿರಂತೆ! ಮುದ್ದೆ ಸಾರು ರೆಡಿ ಇದೆ.',
        transliteration: 'Banni swamy, oota madkondu hoguviranthe! Mudde saaru ready ide.',
        nuance: 'Insistent hospitality inviting the guest immediately to dine.',
        audioPitch: 0.95,
        audioRate: 0.9
      },
      'kalyana-karnataka': {
        kannada: 'ಏನ್ ಬಾವಾಜಿ, ಊಟ ಗೀಟ ಆತಾ? ಜೋಳದ ರೊಟ್ಟಿ ಇರ್ಲಿಕ್ಕಿಲ್ಲೇನ್ ನಿಮ್ಮ ಕಡೆ?',
        transliteration: 'En bavaji, oota geeta aatha? Jolada rotti irlikkilleni nimma kade?',
        nuance: 'Double-word "Oota-geeta" common in Hyderabad-Karnataka speech.',
        audioPitch: 1.0,
        audioRate: 0.95
      },
      'malenadu': {
        kannada: 'ಊಟ ಆಯ್ತಾ ಮಾರಾಯ್ರೆ? ಬಿಸಿ ಬಿಸಿ ಕಷಾಯ ಅಥವಾ ಕಾಫಿ ಕೊಡ್ಲಾ?',
        transliteration: 'Oota aaytha maraayre? Bisi bisi kashaya athava coffee kodla?',
        nuance: 'Classic Malenadu "Maraayre" coupled with steaming coffee offering.',
        audioPitch: 0.97,
        audioRate: 0.92
      },
      'bengaluru-urban': {
        kannada: 'ಊಟ ಆಯ್ತಾ ಬ್ರೋ? ಸ್ವಿಗ್ಗಿ ಜಿ಼ಪ್ತೋ ಆಥವಾ ಹೋಟೆಲ್ ಮಚ್ಚಾ?',
        transliteration: 'Oota aaytha bro? Swiggy Zomato athava hotel macha?',
        nuance: 'Modern metro delivery app slang mixed with casual Kannada.',
        audioPitch: 1.1,
        audioRate: 1.15
      }
    }
  },
  {
    id: 'where-are-you-going',
    english: 'Where are you going right now?',
    context: 'Common conversational question asked when running into someone outside.',
    category: 'travel-auto',
    standardKannada: {
      kannada: 'ನೀವು ಈಗ ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೀರಿ?',
      transliteration: 'Neevu eega yellige hoguthiddeeri?'
    },
    variations: {
      'uttara-karnataka': {
        kannada: 'ಎಲ್ ಹೊಂಟ್ರೀ ಸಾಹೂಕಾರ್? ಗಡಿಬಿಡಿ ಒಳಗೆ ಅದೀರಲ್ಲ!',
        transliteration: 'Yel hontri sahookar? Gadibidi olage adeeralla!',
        nuance: '"Hontri" replaces standard "Hoguthiddeeri"; punchy cadence.',
        audioPitch: 1.1,
        audioRate: 1.1
      },
      'karavali': {
        kannada: 'ಮಾರ್ರೆ, ಎಲ್ಲಿಗೆ ಪಯಣ? ಅಂಗಡಿಗೆ ಹೋಗ್ತಿದ್ಯಾ ಬೋಳ್ಯಾ?',
        transliteration: 'Marre, yellige payana? Angadige hogtidya boliya?',
        nuance: 'Poetic "Payana" with Kundapura affectionate banter.',
        audioPitch: 1.02,
        audioRate: 0.95
      },
      'mysuru-mandya': {
        kannada: 'ಎಲ್ಲಿಗೆ ಸ್ವಾಮಿ ಹೊರಟಿದ್ದು? ಸ್ವಲ್ಪ ನಿಲ್ಲಿ, ಮಾತಾಡಿಸಿ ಹೋಗಿ!',
        transliteration: 'Yellige swamy horatiddu? Swalpa nilli, maathaadisi hogi!',
        nuance: 'Polite request to pause and chat before going anywhere.',
        audioPitch: 0.95,
        audioRate: 0.92
      },
      'kalyana-karnataka': {
        kannada: 'ಎಲ್ ಹೊಂಟೀರ್ರೀ ಬಾವಾಜಿ? ಊರ ಕಡೆ ಹೋಗೋದ್ ಉಂಟೇನ್?',
        transliteration: 'Yel honteerree bavaji? Oora kade hogod unteni?',
        nuance: 'Elongated vowel on "Honteerree" with friendly tone.',
        audioPitch: 1.0,
        audioRate: 0.95
      },
      'malenadu': {
        kannada: 'ತೋಟದ ಕಡೆನಾ ಇಲ್ಲ ಪೇಟೆ ಕಡೆನಾ ಹೊರಟಿದ್ದು ನೀವು?',
        transliteration: 'Thotada kadena illa pete kadena horatiddu neevu?',
        nuance: 'Typical Malenadu landscape dichotomy: Plantation vs Town market.',
        audioPitch: 0.95,
        audioRate: 0.9
      },
      'bengaluru-urban': {
        kannada: 'ಎಲ್ ಗುರು ಜಂಪ್ ಆಗ್ತಿದ್ಯಾ? ಮೆಟ್ರೋ ಹಿಡೀತೀಯಾ ಇಲ್ಲ ಕ್ಯಾಬ್?',
        transliteration: 'Yel guru jump aagtidya? Metro hiditeeya illa cab?',
        nuance: '"Jump aagtidya" urban slang for taking off / leaving.',
        audioPitch: 1.12,
        audioRate: 1.12
      }
    }
  },
  {
    id: 'how-much-cost',
    english: 'How much does this cost? Can you give a fair price?',
    context: 'Bargaining or shopping at a local marketplace.',
    category: 'travel-auto',
    standardKannada: {
      kannada: 'ಇದಕ್ಕೆ ಎಷ್ಟು ಬೆಲೆ? ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ ಕೊಡಬಹುದೇ?',
      transliteration: 'Idakke eshtu bele? Swalpa kadime maadi kodabahude?'
    },
    variations: {
      'uttara-karnataka': {
        kannada: 'ಎಷ್ಟು ರೊಕ್ಕ ರೀ ಅಣ್ಣಾ ಇದಕ್ಕೆ? ಸರಿಯಾಗಿ ಹೇಳಿ ತಕ್ಕೋತೀವಿ!',
        transliteration: 'Eshtu rokka ree anna idakke? Sariyaagi heli thakkotheevi!',
        nuance: '"Rokka" (money/cash) is iconic North Karnataka commercial vocabulary.',
        audioPitch: 1.08,
        audioRate: 1.05
      },
      'karavali': {
        kannada: 'ಎಷ್ಟು ದುಡ್ಡು ಮಾರ್ರೆ? ನಮ್ ಕಡೆ ಜನರಿಗೆ ಸ್ವಲ್ಪ ಕಮ್ಮಿ ಮಾಡ್ಬೇಕಪ್ಪಾ!',
        transliteration: 'Eshtu duddu marre? Nam kade janarige swalpa kammi madbekappaa!',
        nuance: 'Appealing to coastal kinship ("Nam kade janarige") to negotiate.',
        audioPitch: 1.0,
        audioRate: 0.95
      },
      'mysuru-mandya': {
        kannada: 'ಸ್ವಾಮಿ, ನ್ಯಾಯವಾಗಿ ರೇಟ್ ಹೇಳಿ! ನಾವು ನಿಮ್ಮ ಖಾಯಂ ಗಿರಾಕಿ!',
        transliteration: 'Swamy, nyaayavaagi rate heli! Naavu nimma khaayam giraaki!',
        nuance: '"Khaayam giraaki" (regular permanent customer) leverage.',
        audioPitch: 0.95,
        audioRate: 0.92
      },
      'kalyana-karnataka': {
        kannada: 'ಎಷ್ಟು ಬೀಳ್ತೈತ್ರಿ ಇದು? ದರ ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡ್ರಿ ಸಾಹೇಬ್ರೇ!',
        transliteration: 'Eshtu beeltaitri idu? Dara swalpa kadime maadri saahebre!',
        nuance: '"Eshtu beeltaitri" (How much does it fall for / cost).',
        audioPitch: 1.0,
        audioRate: 0.96
      },
      'malenadu': {
        kannada: 'ನ್ಯಾಯವಾದ ಬೆಲೆ ಹೇಳಿ ಸ್ವಾಮಿ, ಊರಿಗೆಲ್ಲ ನಾವೇ ಹೇಳ್ತೀವಿ!',
        transliteration: 'Nyaayavaada bele heli swamy, oorigella naave heltheevi!',
        nuance: 'Gentle rural merchant-customer trust dynamic.',
        audioPitch: 0.96,
        audioRate: 0.92
      },
      'bengaluru-urban': {
        kannada: 'ಮೀಟರ್ ಹಾಕಿ ಬಾಸ್! ಒನ್-ಅಂಡ್-ಹಾಫ್ ಎಲ್ಲಾ ಬೇಡ, ರಿಯಲ್ ರೇಟ್ ಹೇಳಿ!',
        transliteration: 'Meter haaki boss! One-and-half ella beda, real rate heli!',
        nuance: 'Bangalore auto-rickshaw standoff classic line.',
        audioPitch: 1.15,
        audioRate: 1.15
      }
    }
  },
  {
    id: 'food-delicious',
    english: 'The food is extraordinarily delicious!',
    context: 'Praising the host or chef after an authentic Karnataka feast.',
    category: 'food-dining',
    standardKannada: {
      kannada: 'ಊಟ ತುಂಬಾ ರುಚಿಕರವಾಗಿದೆ ಮತ್ತು ತೃಪ್ತಿಕರವಾಗಿದೆ!',
      transliteration: 'Oota thumba ruchikaravaagide mathu thrupthikaravaagide!'
    },
    variations: {
      'uttara-karnataka': {
        kannada: 'ರೊಟ್ಟಿ ಖಾರ ಸೂಪರ್ ಅದ್ರೀ! ನಾಲಿಗೆಗೆ ಝಣ್ ಅಂತ ಹತ್ಕೊತು!',
        transliteration: 'Rotti khaara super adree! Naaligege jhan antha hathkothu!',
        nuance: '"Jhan antha" vivid sensory description of spicy North Karnataka food.',
        audioPitch: 1.1,
        audioRate: 1.08
      },
      'karavali': {
        kannada: 'ಮಾರ್ರೆ, ಸಾರು ಮಸ್ತ್ ಉಂಟು! ಕಾಯಿ ಹಾಲು ಪರಿಮಳ ಘಮ್ಮೆನ್ನುತ್ತೆ!',
        transliteration: 'Marre, saaru mast untu! Kaayi haalu parimala ghammennuthe!',
        nuance: '"Mast untu" - coastal celebration of fresh coconut coconut milk saaru.',
        audioPitch: 1.02,
        audioRate: 0.94
      },
      'mysuru-mandya': {
        kannada: 'ಆಹಾ ಸ್ವಾಮಿ, ನಳಪಾಕ! ಮುದ್ದೆ ಜೊತೆ ನಾಟಿ ಕೋಳಿ ಸಾರು ಅಮೃತ ಕಣಯ್ಯ!',
        transliteration: 'Aaha swamy, nalapaaka! Mudde jothe naati koli saaru amrutha kanayya!',
        nuance: 'Literary tribute "Nalapaaka" (feast fit for king Nala).',
        audioPitch: 0.95,
        audioRate: 0.9
      },
      'kalyana-karnataka': {
        kannada: 'ಬಹಳ ಚಲೋ ಅದ್ರೀ ಅಡುಗೆ! ಹೊಟ್ಟೆ ತುಂಬಿತು, ಮನಸ್ಸೂ ತಂಪಾಯ್ತು!',
        transliteration: 'Bahal chalo adree aduge! Hotte thumbithu, manassoo thampaaythu!',
        nuance: 'Deeply expressive contentment ("Manassoo thampaaythu").',
        audioPitch: 1.0,
        audioRate: 0.95
      },
      'malenadu': {
        kannada: 'ತಾಜಾ ಕಾಳು ಸಾರು, ಅಕ್ಕಿ ರೊಟ್ಟಿ ಘಮ ಅಂದ್ರೆ ಇದೇ ಮಾರಾಯ್ರೆ! ಸ್ವರ್ಗ!',
        transliteration: 'Taaja kaalu saaru, akki rotti ghama andre ide maraayre! Swarga!',
        nuance: 'Pure mountain nostalgia celebrating steaming spices and fresh produce.',
        audioPitch: 0.96,
        audioRate: 0.91
      },
      'bengaluru-urban': {
        kannada: 'ಬೊಂಬಾಟ್ ಗುರು! ಫುಲ್ಲ್ ವರ್ಥ್, ಫುಡ್ ಕಾಮಾಗೆ ಹೋಗೋ ತರಹ ಇದೆ!',
        transliteration: 'Bombat guru! Full worth, food coma-ge hogo thara ide!',
        nuance: '"Bombat" (superb/stellar) followed by food coma slang.',
        audioPitch: 1.15,
        audioRate: 1.12
      }
    }
  },
  {
    id: 'dont-worry',
    english: 'Do not worry at all, everything will be completely fine!',
    context: 'Reassuring a friend going through a challenging situation.',
    category: 'daily-life',
    standardKannada: {
      kannada: 'ಯಾವುದಕ್ಕೂ ಚಿಂತಿಸಬೇಡಿ, ಎಲ್ಲವೂ ಸರಿಯಾಗುತ್ತದೆ.',
      transliteration: 'Yaavudakkoo chintisabedi, ellavoo sariyaaguththe.'
    },
    variations: {
      'uttara-karnataka': {
        kannada: 'ಫಿಕರ್ ಮಾಡ್ಬ್ಯಾಡ್ರಿ ಸಾಹೂಕಾರ್! ನಾವೆಲ್ಲ ಇದ್ದೀವಲ್ರೀ ನಿಮ್ ಜೋತೆ!',
        transliteration: 'Fikar maadbyaadri sahookar! Naavella iddeevalree nim jothe!',
        nuance: '"Fikar maadbyaadri" (Deccani-influenced reassurance) packed with solidarity.',
        audioPitch: 1.08,
        audioRate: 1.02
      },
      'karavali': {
        kannada: 'ಬೋಳ್ಯಾ, ಮನಸ್ಸಿಗೆ ತಕ್ಕೋಬೇಡ! ಎಲ್ಲ ದೇವ್ರು ಒಳ್ಳೆಯದೇ ಮಾಡ್ತಾರೆ ಮಾರ್ರೆ!',
        transliteration: 'Boliya, manassige thakkobeda! Ella devru olleyade madthare marre!',
        nuance: 'Spiritual faith and comforting coastal optimism.',
        audioPitch: 0.98,
        audioRate: 0.93
      },
      'mysuru-mandya': {
        kannada: 'ಬೇಡ ಬಿಡಿ ಸ್ವಾಮಿ, ತಲೆ ಕೆಡಿಸಿಕೊಳ್ಳಬೇಡಿ! ಸಮಯವೇ ಎಲ್ಲದಕ್ಕೂ ಪರಿಹಾರ.',
        transliteration: 'Beda bidi swamy, thale kedisikollabedi! Samayave elladakkoo parihaara.',
        nuance: '"Beda bidi swamy" (Let it go) - the quintessential Mysuru tranquility.',
        audioPitch: 0.94,
        audioRate: 0.9
      },
      'kalyana-karnataka': {
        kannada: 'ಹಂಗೇನೂ ಆಗ್ಲಿಕ್ಕಿಲ್ಲ ಬಾವಾಜಿ, ದಮ್ಮು ಇಟ್ಕೋಳಿ! ಎಲ್ಲ ಸರಿ ಬೀಳ್ತೈತಿ.',
        transliteration: 'Hangenu aaglikkilla bavaji, dammu itkoli! Ella sari beeltaithi.',
        nuance: '"Dammu itkoli" (Keep courage/strength in your chest).',
        audioPitch: 1.0,
        audioRate: 0.95
      },
      'malenadu': {
        kannada: 'ಧೈರ್ಯ ತಗೋ ಮಾರಾಯ್ರೆ, ಮಳೆ ಕಳೆದು ಬಿಸಿಲು ಬಂದೇ ಬರುತ್ತೆ ಅಲ್ವಾ?',
        transliteration: 'Dhairya thago maraayre, male kaledu bisilu bande baruthe alva?',
        nuance: 'Poetic weather metaphor comparing hardships to monsoon clouds.',
        audioPitch: 0.96,
        audioRate: 0.9
      },
      'bengaluru-urban': {
        kannada: 'ಚಿಲ್ ಮಾಡು ಮಚ್ಚಾ, ಸೀನ್ ಇಲ್ಲ! ನಾನಿದ್ದೀನಲ್ಲ, ಸೆಟ್ ಮಾಡ್ಬಿಡೋಣ!',
        transliteration: 'Chill maadu macha, scene illa! Naaniddeenalla, set maadbidona!',
        nuance: 'Ultimate urban Bangalore buddy comfort line.',
        audioPitch: 1.15,
        audioRate: 1.1
      }
    }
  },
  {
    id: 'why-angry',
    english: 'Why are you getting angry? Let us talk calmly.',
    context: 'Defusing tension during an argument or misunderstanding.',
    category: 'humor-slang',
    standardKannada: {
      kannada: 'ಯಾಕೆ ಕೋಪಗೊಳ್ಳುತ್ತಿದ್ದೀರಿ? ಶಾಂತವಾಗಿ ಮಾತನಾಡೋಣ.',
      transliteration: 'Yaake kopagolluthiddeeri? Shaantavaagi maathanaadona.'
    },
    variations: {
      'uttara-karnataka': {
        kannada: 'ಯಾಕ್ರೀ ಬೆಂಕಿ ಆಗ್ಲಾತಿರಿ? ಸ್ವಲ್ಪ ಶಾಂತೀರ್ಪಾ, ಕೂತು ಮಾತಾಡೋಣು!',
        transliteration: 'Yaakree benki aaglaatiri? Swalpa shaanteerpa, koothu maathaadonoo!',
        nuance: '"Benki aaglaatiri" (literally "turning into fire") - very graphic visual slang.',
        audioPitch: 1.1,
        audioRate: 1.05
      },
      'karavali': {
        kannada: 'ಎಂತಕ್ಕೆ ಮಾರ್ರೆ ಅಷ್ಟೊಂದು ಗರಂ? ತಂಪಾಗಿ ತಣ್ಣನೆ ಮಾತಾಡ್ ಮಾರ್ರೆ!',
        transliteration: 'Enthakke marre ashtondu garam? Thampaagi thannane maatad marre!',
        nuance: '"Garam" contrast with "Thampaagi thannane" (cool as sea breeze).',
        audioPitch: 1.0,
        audioRate: 0.95
      },
      'mysuru-mandya': {
        kannada: 'ಸ್ವಾಮಿ, ಸಿಟ್ಟಲ್ಲಿ ಬುದ್ಧಿ ಕೆಡುತ್ತೆ ಕಣಯ್ಯ! ತಾಳ್ಮೆಯಿಂದ ಇರಪ್ಪ.',
        transliteration: 'Swamy, sittalli buddhi keduthe kanayya! Thaalmeyinda irappa.',
        nuance: 'Classic ethical elder advice with Mandya affectionate phrasing.',
        audioPitch: 0.95,
        audioRate: 0.91
      },
      'kalyana-karnataka': {
        kannada: 'ಏನ್ ಬಾವಾಜಿ, ರೋಷ ಯಾಕ್ರೀ? ನಾವ ನಾವ ಒಬ್ರೇ ಅಲ್ಲವೇನ್ರಿ?',
        transliteration: 'En bavaji, rosha yaakree? Naava naava obre allavenri?',
        nuance: 'Invoking brotherhood ("Naava naava obre" - aren\'t we one family).',
        audioPitch: 1.0,
        audioRate: 0.95
      },
      'malenadu': {
        kannada: 'ಅದೇನಕ್ಕೆ ಅಷ್ಟೊಂದು ಆವೇಶ ಮಾರಾಯ್ರೆ? ಒಂದು ಕಪ್ ಕಾಫಿ ಕುಡಿದು ತಣ್ಣಗಾಗು!',
        transliteration: 'Adenakke ashtondu aavesha maraayre? Ondu cup coffee kudidu thannagaagu!',
        nuance: 'Prescribing a cup of coffee to cure sudden anger.',
        audioPitch: 0.96,
        audioRate: 0.9
      },
      'bengaluru-urban': {
        kannada: 'ಯಾಕೋ ಹೈಪರ್ ಆಗ್ತಿದ್ಯಾ? ಬಿಪಿ ಜಾಸ್ತಿ ಮಾಡ್ಕೊಬೇಡ, ಕೂಲ್ ಗುರು!',
        transliteration: 'Yaako hyper aagtidya? BP jaasti madkobeda, cool guru!',
        nuance: 'Urban English medical idioms adapted into street Kannada.',
        audioPitch: 1.12,
        audioRate: 1.12
      }
    }
  },
  {
    id: 'lets-go-together',
    english: 'Come on, let us all go together right now!',
    context: 'Rallying friends or group members for an outing or festival.',
    category: 'daily-life',
    standardKannada: {
      kannada: 'ಬನ್ನಿ, ನಾವೆಲ್ಲರೂ ಒಟ್ಟಿಗೆ ಹೋಗೋಣ.',
      transliteration: 'Banni, naavellaroo ottige hogona.'
    },
    variations: {
      'uttara-karnataka': {
        kannada: 'ನಡೀರ್ರೀ ಸಾಹೂಕಾರ್, ಎಲ್ಲಾರೂ ಕೂಡಿ ನಡ್ದು ಬಿಡೂಣು!',
        transliteration: 'Nadeerree sahookar, ellaaroo koodi naddu bidoonoo!',
        nuance: 'High-energy group call with rhythmic "Nadeerree".',
        audioPitch: 1.12,
        audioRate: 1.08
      },
      'karavali': {
        kannada: 'ಬನ್ನಿ ಮಾರ್ರೆ, ಒಟ್ಟಿಂಗೆ ಹೋಗುವಾ! ತಡ ಆದ್ರೆ ಗಾಡಿ ಸಿಗಲ್ಲ!',
        transliteration: 'Banni marre, ottinge hoguvaa! Thada aadre gaadi sigalla!',
        nuance: '"Ottinge hoguvaa" melodic cadence.',
        audioPitch: 1.0,
        audioRate: 0.95
      },
      'mysuru-mandya': {
        kannada: 'ಬನ್ನಿ ಸ್ವಾಮಿ ನಾವೂ ಬರ್ತೀವಿ, ಜೊತೆಯಲ್ಲೇ ದಾರಿ ಕಳೆಯುತ್ತೆ!',
        transliteration: 'Banni swamy naavoo barteevi, jotheyalle daari kaleyuthe!',
        nuance: 'Poetic companionship phrase ("The journey passes easily together").',
        audioPitch: 0.95,
        audioRate: 0.92
      },
      'kalyana-karnataka': {
        kannada: 'ನಡ್ರಿ ಬಾವಾಜಿ, ಎಲ್ಲಾರೂ ಜೊತಿಗ ಹೊಂಟ್ರೆ ಮಜಾನೇ ಬೇರೆ!',
        transliteration: 'Nadri bavaji, ellaaroo jothiga hontre majaane bere!',
        nuance: 'Celebration of collective bonding.',
        audioPitch: 1.0,
        audioRate: 0.97
      },
      'malenadu': {
        kannada: 'ಬನ್ನಿ ಮಾರಾಯ್ರೆ, ಮಳೆ ಶುರುವಾಗೋ ಮುಂಚೆ ಬೇಗ ಹೊರಡೋಣ!',
        transliteration: 'Banni maraayre, male shuruvaago munche bega horadona!',
        nuance: 'Rushing to leave before the heavy Sahyadri downpour begins.',
        audioPitch: 0.97,
        audioRate: 0.92
      },
      'bengaluru-urban': {
        kannada: 'ಬನ್ನಿ ಬಾಯ್ಸ್, ಗಾಡಿ ತೆಗೀರಿ! ಇವತ್ತು ಫುಲ್ ಆನ್ ಸೀನ್!',
        transliteration: 'Banni boys, gaadi tegeeri! Ivattu full-on scene!',
        nuance: 'Spontaneous road-trip energy popular among Bangalore techies.',
        audioPitch: 1.15,
        audioRate: 1.15
      }
    }
  }
];
