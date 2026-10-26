import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which region of Karnataka uses the iconic affectionate address "ಏನ್ ಮಾರ್ರೆ" (En Marre)?',
    phraseKannada: 'ಏನ್ ಮಾರ್ರೆ, ಇವತ್ತು ಮೀನ್ ಸಾರು ಉಂಟಾ ನಿಮ್ಮಲ್ಲಿ?',
    transliteration: 'En marre, ivattu meen saaru unta nimmalli?',
    englishMeaning: 'What buddy, is there a fish curry prepared at your home today?',
    correctRegionId: 'karavali',
    options: ['karavali', 'uttara-karnataka', 'mysuru-mandya', 'bengaluru-urban'],
    explanation: '"ಮಾರ್ರೆ" (Marre) is the undisputed signature greeting of coastal Karnataka (Mangaluru & Udupi). It denotes deep intimacy and friendly warmth.',
    culturalTrivia: 'Coastal fish curry in Karavali is traditionally cooked with fresh coconut milk and Kudampuli (Malabar tamarind).'
  },
  {
    id: 'q2',
    question: 'Where would you hear someone exclaim "ಹೌದ್ಲಾ! ನಾನ್ ಮೊದಲೇ ಹೇಳಿಲ್ವಾ?" (Haudla)?',
    phraseKannada: 'ಹೌದ್ಲಾ! ನಡೀರಿ ಚಾ ಕುಡಿದು ಬರೂಣು!',
    transliteration: 'Haudla! Nadeeri cha kudidu baroonu!',
    englishMeaning: 'Is that so! Come on, let\'s go grab a hot cup of tea!',
    correctRegionId: 'uttara-karnataka',
    options: ['uttara-karnataka', 'malenadu', 'kalyana-karnataka', 'mysuru-mandya'],
    explanation: '"ಹೌದ್ಲಾ" (Haudla) is the ultimate North Karnataka expression of agreement and surprise, heard in every tea shop in Dharwad, Belagavi, and Hubballi.',
    culturalTrivia: 'Dharwad is globally famous for its GI-tagged Dharwad Peda, crafted by the Thakur family since the 19th century.'
  },
  {
    id: 'q3',
    question: 'A shopkeeper politely smiles and says: "ಬೇಡ ಬಿಡಿ ಸ್ವಾಮಿ, ಅದೇನ್ ದೊಡ್ಡ ವಿಷ್ಯನಾ?" Which region is this from?',
    phraseKannada: 'ಬೇಡ ಬಿಡಿ ಸ್ವಾಮಿ, ನಾವೆಲ್ಲ ಒಂದೇ ಊರಿನವರು ಅಲ್ವಾ!',
    transliteration: 'Beda bidi swamy, naavella onde oorinavaru alva!',
    englishMeaning: 'Leave it be, sir; aren\'t we all from the very same town!',
    correctRegionId: 'mysuru-mandya',
    options: ['mysuru-mandya', 'karavali', 'bengaluru-urban', 'uttara-karnataka'],
    explanation: '"ಸ್ವಾಮಿ" (Swamy) honorific coupled with "ಬೇಡ ಬಿಡಿ" (Beda Bidi) is the hallmark of Old Mysuru courtly manners and peaceful demeanor.',
    culturalTrivia: 'The Kingdom of Mysore under Nalwadi Krishnaraja Wadiyar was known as "Rajarshi" for pioneering democratic reforms and social welfare.'
  },
  {
    id: 'q4',
    question: 'If someone affectionately calls you "ಬಾವಾಜಿ" (Bavaji) and invites you for hot Jowar Rotti, where are you?',
    phraseKannada: 'ಏನ್ ಬಾವಾಜಿ, ಕಲ್ಬುರ್ಗಿ ತೊಗರಿಬೇಳೆ ಸಾರು ಸವಿಯಲೇಬೇಕು ನೀವು!',
    transliteration: 'En bavaji, Kalaburgi thogaribele saaru saviyalebeku neevu!',
    englishMeaning: 'Hey brother, you must savor our authentic Kalaburagi Toor dal curry!',
    correctRegionId: 'kalyana-karnataka',
    options: ['kalyana-karnataka', 'malenadu', 'karavali', 'bengaluru-urban'],
    explanation: '"ಬಾವಾಜಿ" (Bavaji) is the cherished address across Kalaburagi, Bidar, and Raichur, treating close friends with the warmth of family.',
    culturalTrivia: 'Kalaburagi Red Gram (Toor Dal) holds a registered Geographical Indication (GI) tag due to its unique soil composition and culinary aroma.'
  },
  {
    id: 'q5',
    question: '"ಬೋಳ್ಯಾ, ಎಲ್ಲಿದ್ಯ ಮಾರ್ರೆ ಇಷ್ಟೊತ್ತಿಗೆ?" Which distinctive sub-dialect is "ಬೋಳ್ಯಾ" from?',
    phraseKannada: 'ಬೋಳ್ಯಾ, ನಡೀರಿ ಕೋಡಿ ಬೀಚ್ ಕಡೆ ಸನ್ಸೆಟ್ ನೋಡೋಣ!',
    transliteration: 'Boliya, nadeeri kodi beach kade sunset nodona!',
    englishMeaning: 'Hey rascal, come on, let\'s head to Kodi Beach to watch the sunset!',
    correctRegionId: 'karavali',
    options: ['karavali', 'uttara-karnataka', 'mysuru-mandya', 'malenadu'],
    explanation: '"ಬೋಳ್ಯಾ" (Boliya) is the world-famous trademark tease of Kundagannada (the Kundapura dialect of Karavali).',
    culturalTrivia: 'Kundapura Kannada retains several grammatical verb endings that trace back to 10th century Halegannada (Old Kannada).'
  },
  {
    id: 'q6',
    question: '"ಮಚ್ಚಾ, ಸಿಲ್ಕ್ ಬೋರ್ಡ್ ಟ್ರಾಫಿಕ್ ಅಲ್ಲಿ ಸಿಕ್ಕಾಕ್ಕೊಂಡಿದೀನಿ, ಸೀನ್ ಇಲ್ಲ!" Where does this vibrant slang originate?',
    phraseKannada: 'ಮಚ್ಚಾ, ಬೈ-ಟು ಕಾಫಿ ಕುಡಿದು ಸೀನ್ ಸೆಟ್ ಮಾಡೋಣ!',
    transliteration: 'Macha, by-two coffee kudidu scene set madona!',
    englishMeaning: 'Bro, let\'s grab a by-two filter coffee and sort this plan out!',
    correctRegionId: 'bengaluru-urban',
    options: ['bengaluru-urban', 'uttara-karnataka', 'mysuru-mandya', 'karavali'],
    explanation: 'Words like "ಮಚ್ಚಾ" (Macha), "ಬೈ-ಟು ಕಾಫಿ" (By-two coffee), and "ಸೀನ್ ಇಲ್ಲ" (Scene illa) embody the cosmopolitan energy of Namma Bengaluru.',
    culturalTrivia: 'The concept of "By-two coffee" originated in Bengaluru Darshinis, where two friends split one steel tumbler of hot filter coffee.'
  },
  {
    id: 'q7',
    question: 'A host asks: "ಮಳೆ ನಿಂತ ಮೇಲೆ ಕಾಫಿ ತೋಟಕ್ಕೆ ಹೋಗಿ ಬರೋಣ ಬನ್ನಿ ಮಾರಾಯ್ರೆ!" Which scenic region is this?',
    phraseKannada: 'ಬೆಳಗ್ಗೆಯಿಂದ ಜಿಟಿ ಜಿಟಿ ಮಳೆ, ಬಿಸಿ ಕಷಾಯ ಕುಡಿಯಿರಿ ಮಾರಾಯ್ರೆ!',
    transliteration: 'Belaginda jiti jiti male, bisi kashaya kudiyiri maraayre!',
    englishMeaning: 'Gentle rain has been falling since morning; please drink some hot kashaya, good fellow!',
    correctRegionId: 'malenadu',
    options: ['malenadu', 'karavali', 'kalyana-karnataka', 'bengaluru-urban'],
    explanation: '"ಮಾರಾಯ್ರೆ" (Maraayre) amidst monsoon rain ("ಜಿಟಿ ಜಿಟಿ ಮಳೆ") and coffee estates is pure Malenadu (Shivamogga, Chikkamagaluru & Coorg).',
    culturalTrivia: 'Chikkamagaluru is the birthplace of Indian coffee, where Sufi saint Baba Budan first planted seven raw coffee beans smuggled from Yemen.'
  },
  {
    id: 'q8',
    question: 'Which region uses the respectful and punchy conversational tag "ಏನ್ರೀ ಸಾಹೂಕಾರ್" (En ri sahookar)?',
    phraseKannada: 'ಏನ್ರೀ ಸಾಹೂಕಾರ್, ಇವತ್ತು ಜಾತ್ರಾ ಮಹೋತ್ಸವಕ್ಕೆ ಬರ್ತೀರೇನ್ರಿ?',
    transliteration: 'En ri sahookar, ivattu jaathra mahotsavakke bartheereni?',
    englishMeaning: 'Hey chief, will you be coming to the temple chariot festival today?',
    correctRegionId: 'uttara-karnataka',
    options: ['uttara-karnataka', 'mysuru-mandya', 'bengaluru-urban', 'malenadu'],
    explanation: '"ಸಾಹೂಕಾರ್" (Sahookar) is used as an affectionate and respectful title for friends in Uttara Karnataka.',
    culturalTrivia: 'North Karnataka is home to the majestic Gol Gumbaz in Vijayapura, featuring the world\'s second-largest acoustic whispering dome.'
  }
];
