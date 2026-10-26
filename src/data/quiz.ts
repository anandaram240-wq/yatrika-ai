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
    culturalTrivia: 'Coastal fish curry in Karavali is traditionally cooked with coconut milk and Kudampuli (Malabar tamarind).',
    source: {
      title: 'A Kannada-English Dictionary',
      authorOrInstitution: 'Rev. F. Kittel',
      year: '1894 / 1968',
      sourceLocation: 'Vol. 3, p. 1324'
    },
    status: 'source-attested'
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
    culturalTrivia: 'Dharwad is globally celebrated for its GI-tagged Dharwad Peda, hand-crafted through slow-caramelized milk khowa.',
    source: {
      title: 'Dharwada Kannada Prabheda Adhyayana',
      authorOrInstitution: 'Kannada University Hampi',
      year: '2004',
      sourceLocation: 'p. 52'
    },
    status: 'source-attested'
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
    culturalTrivia: 'The Kingdom of Mysore under Nalwadi Krishnaraja Wadiyar was known as "Rajarshi" for pioneering democratic representation and education.',
    source: {
      title: 'Kannada Sahitya Parishat Nighantu',
      authorOrInstitution: 'Kannada Sahitya Parishat, Bengaluru',
      year: '1995',
      sourceLocation: 'Vol. 5, Entry: beda-bidi'
    },
    status: 'source-attested'
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
    culturalTrivia: 'Kalaburagi Red Gram (Toor Dal) holds a registered Geographical Indication (GI) tag due to its unique lime-rich soil composition.',
    source: {
      title: 'Kalyana Karnataka Bhasha Vaisishte',
      authorOrInstitution: 'Dr. Basavaraj Sabarad',
      year: '2010',
      sourceLocation: 'p. 73'
    },
    status: 'source-attested'
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
    culturalTrivia: 'Kundapura Kannada retains several grammatical verb endings that trace back to 10th century Halegannada (Old Kannada).',
    source: {
      title: 'Kundagannada Shabdakosha',
      authorOrInstitution: 'A.S. Kedilaya',
      year: '2008',
      sourceLocation: 'Entry: boliya'
    },
    status: 'source-attested'
  },
  {
    id: 'q6',
    question: '"ಮಚ್ಚಾ, ಸಿಲ್ಕ್ ಬೋರ್ಡ್ ಟ್ರಾಫಿಕ್ ಅಲ್ಲಿ ಸಿಕ್ಕಾಕ್ಕೊಂಡಿದೀನಿ, ಸೀನ್ ಇಲ್ಲ!" Where does this vibrant slang originate?',
    phraseKannada: 'ಮಚ್ಚಾ, ಬೈ-ಟು ಕಾಫಿ ಕುಡಿದು ಸೀನ್ ಸೆಟ್ ಮಾಡೋಣ!',
    transliteration: 'Macha, by-two coffee kudidu scene set madona!',
    englishMeaning: 'Bro, let\'s grab a by-two filter coffee and sort this plan out!',
    correctRegionId: 'bengaluru-urban',
    options: ['bengaluru-urban', 'uttara-karnataka', 'mysuru-mandya', 'karavali'],
    explanation: 'Words like "ಮಚ್ಚಾ" (Macha), "ಬೈ-ಟು ಕಾಫಿ" (By-two coffee), and "ಸೀನ್ ಇಲ್ಲ" (Scene illa) embody the contemporary metropolitan energy of Namma Bengaluru.',
    culturalTrivia: 'The concept of "By-two coffee" originated in Bengaluru Darshinis, where two friends split one steel tumbler of hot filter coffee.',
    source: {
      title: 'Sociolinguistic Survey of Urban Bengaluru Kannada',
      authorOrInstitution: 'Bangalore University',
      year: '2018',
      sourceLocation: 'p. 14'
    },
    status: 'provisional'
  },
  {
    id: 'q7',
    question: 'A host asks: "ಮಳೆ ನಿಂತ ಮೇಲೆ ಕಾಫಿ ತೋಟಕ್ಕೆ ಹೋಗಿ ಬರೋಣ ಬನ್ನಿ ಮಾರಾಯ್ರೆ!" Which scenic region is this?',
    phraseKannada: 'ಬೆಳಗ್ಗೆಯಿಂದ ಜಿಟಿ ಜಿಟಿ ಮಳೆ, ಬಿಸಿ ಕಷಾಯ ಕುಡಿಯಿರಿ ಮಾರಾಯ್ರೆ!',
    transliteration: 'Belaginda jiti jiti male, bisi kashaya kudiyiri maraayre!',
    englishMeaning: 'Gentle rain has been falling since morning; please drink some hot kashaya, good fellow!',
    correctRegionId: 'malenadu',
    options: ['malenadu', 'karavali', 'kalyana-karnataka', 'bengaluru-urban'],
    explanation: '"ಮಾರಾಯ್ರೆ" (Maraayre) amidst monsoon rain and coffee plantations is characteristic of Malenadu (Shivamogga, Chikkamagaluru & Coorg).',
    culturalTrivia: 'Chikkamagaluru is the birthplace of Indian coffee, where Sufi saint Baba Budan first planted seven raw coffee beans smuggled from Yemen.',
    source: {
      title: 'Kuvempu Sahitya Mattu Malenadu Bhasha Prayoga',
      authorOrInstitution: 'Kannada Sahitya Parishat',
      year: '2001',
      sourceLocation: 'p. 41'
    },
    status: 'source-attested'
  },
  {
    id: 'q8',
    question: 'Which region uses the respectful and punchy conversational tag "ಏನ್ರೀ ಸಾಹೂಕಾರ್" (En ri sahookar)?',
    phraseKannada: 'ಏನ್ರೀ ಸಾಹೂಕಾರ್, ಇವತ್ತು ಜಾತ್ರಾ ಮಹೋತ್ಸವಕ್ಕೆ ಬರ್ತೀರೇನ್ರಿ?',
    transliteration: 'En ri sahookar, ivattu jaathra mahotsavakke bartheereni?',
    englishMeaning: 'Hey chief / respected friend, will you be coming to the temple chariot festival today?',
    correctRegionId: 'uttara-karnataka',
    options: ['uttara-karnataka', 'mysuru-mandya', 'bengaluru-urban', 'malenadu'],
    explanation: '"ಸಾಹೂಕಾರ್" (Sahookar) is used as an affectionate and respectful title for friends in Uttara Karnataka.',
    culturalTrivia: 'North Karnataka is home to the majestic Gol Gumbaz in Vijayapura, featuring the world\'s second-largest acoustic whispering dome.',
    source: {
      title: 'Karnataka Samskriti Mattu Bhashe',
      authorOrInstitution: 'Dr. M. Chidananda Murthy',
      year: '1991',
      sourceLocation: 'p. 112'
    },
    status: 'source-attested'
  }
];
