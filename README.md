# Namma Kannada Atlas (ನಮ್ಮ ಕನ್ನಡ)
### Regional Language & Dialect Explorer
> **Kannada Digital Innovation Hackathon 2026**  
> Organized by **HackerRank Campus Crew**, The National Institute of Engineering (NIE), Mysuru  
> **Official Theme:** *Code. Create. Celebrate Kannada.*  
> **Problem Statement Chosen:** **Problem Statement 04: Namma Kannada — Regional Language Explorer**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38b2ac.svg)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Vitest-Passing%20(5%2F5)-brightgreen.svg)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

---

## 1. Executive Summary & Problem Chosen

Standard digital tools and textbooks treat Kannada as a monolithic linguistic entity, teaching only formal *Granthika Kannada*. In reality, Kannada possesses extraordinary regional vitality: spoken idioms, vocal cadence, and vocabulary transform every 30 to 100 kilometers across Karnataka. 

### Target Users Affected
1. **Non-Native Residents & Migrants:** Moving to Hubballi, Mangaluru, or Mysuru, newcomers discover that everyday exchanges with auto drivers, vegetable vendors, and local shops bear little resemblance to textbook Kannada.
2. **Native Kannadigas:** Misinterpretations frequently occur between regions (e.g., North Karnataka's energetic candor mistaken for aggression; coastal Kundagannada idioms baffling southern residents).
3. **Linguistic Researchers & Culture Advocates:** Urgent need to preserve endangered rural idioms, oral proverbs, and community vocabulary in an open, verifiable digital format.

**Namma Kannada Atlas** solves this by providing a source-grounded, interactive digital atlas that documents, translates, pronounces, and explores regional varieties of Kannada with authentic linguistic provenance.

---

## 2. Key Features Implemented

### 🗺️ Interactive Linguistic Geography Explorer
- Covers **6 documented linguistic zones**:
  - **Uttara Karnataka (Dharwad & Hubli):** Crisp, rapid tempo, honorifics ("Ri", "Sahookar"), emphatic tags ("Haudla").
  - **Karavali & Kundapura (Coastal):** Melodic singsong intonations, ancient Halegannada verb preservation, iconic addresses ("En Marre", "Boliya").
  - **Mysuru & Mandya (Old Mysore):** Royal courtly politeness ("Nodi swamy", "Beda bidi") blended with Mandya's rustic warmth ("Kanayya").
  - **Kalyana Karnataka (Kalaburagi & Raichur):** Vachana philosophy resonance, Deccani-influenced historical idioms ("Bavaji", "Dammu").
  - **Malenadu (Shivamogga & Coorg):** Western Ghats coffee-estate lore, tranquil mountain metaphors ("Maraayre").
  - **Bengaluru Urban (Namma Bengaluru):** Cosmopolitan youth code-mixing, street tech banter ("Macha", "Guru", "Scene illa", "Bombat").
- Detailed linguistic breakdown per zone: vocal cadence, pronoun shifts, notable grammar suffixes, and covered districts.

### 🔄 Cross-Dialect Comparative Transformer Matrix
- Compare how an everyday thought transforms across all 6 regions side-by-side.
- Multi-category support: *Greetings, Food & Feasts, Daily Commute & Travel, Everyday Care, Humor & Banter*.
- Each regional card presents:
  - Clear **Kannada Script (`ಕನ್ನಡ ಲಿಪಿ`)**
  - Phonetic **English Transliteration** for instant pronunciation access
  - **Linguistic Nuance** explaining grammatical context
  - One-click native audio speech synthesis playback

### 🔊 Integrated Web Speech API Synthesis Engine
- Leverages browser-native `window.speechSynthesis` targeting Kannada (`kn-IN`).
- Dialect pitch and speech rate calibration matching regional rhythms (e.g., elevated tempo for Dharwad, smooth cadence for Mysuru).
- Dual fallback: when a native Kannada TTS engine is unavailable on the client operating system, the engine pronounces phonetic transliterations via high-quality Indian English synthesis, ensuring audio accessibility on any device.

### 📖 Namma Shabda Kosha (Slang & Cultural Idiom Glossary)
- Over 20 curated words and idioms filterable by region, tags, or instant search.
- Rich metadata: authentic meaning, sample conversational dialogue, cultural origin etymology, and audio pronunciation.
- Bookmarking / favorites persisted in `localStorage`.
- One-click shareable formatted clipboard copy.

### 🎯 Gamified Dialect Guesser Quiz
- 8 challenging multiple-choice questions testing regional accent and idiom recognition.
- Audio playback for every question.
- Real-time score counter, streak tracker, and celebratory `canvas-confetti` animations.
- Cultural trivia and detailed linguistic explanations for every question.

### ✍️ Crowdsourced Community Dialect Vault
- Allows Kannadigas across districts to document local words, meanings, hometown tags, and sample sentences.
- Upvote mechanism to validate community submissions.
- **Export to JSON:** Downloadable dialect archive for open cultural research.

### 🎙️ Interactive Pronunciation Practice Modal
- Speech recognition test using Web Speech API (`SpeechRecognition`).
- Compares user spoken input against target phrases and calculates pronunciation confidence scores.

---

## 3. System Architecture & Tech Stack

```mermaid
flowchart TD
    subgraph UI_Layer["Client Presentation Layer (React 19 + Tailwind CSS)"]
        Nav[Navbar & Karnataka Ribbon]
        Hero[Hero Showcase & Statistics]
        Map[Interactive Dialect Explorer]
        Matrix[Cross-Dialect Transformer Matrix]
        Glossary[Namma Shabda Kosha]
        Quiz[Dialect Guesser Quiz Engine]
        Vault[Community Dialect Vault]
    end

    subgraph Audio_Layer["Audio & Speech Processing Layer"]
        TTS[Web Speech API (kn-IN Synthesis)]
        PitchEngine[Regional Pitch & Cadence Modulator]
        ASR[Web Speech Recognition Practice]
    end

    subgraph Data_Layer["Linguistic Data & Persistence Layer"]
        RegionsDB[(Curated Regional Models)]
        PhrasesDB[(6-Zone Dialect Matrices)]
        GlossaryDB[(Authentic Idiom Corpus)]
        LocalStorage[(Browser State & Bookmarks)]
        JSONExport[Downloadable Research Archive]
    end

    Map --> RegionsDB
    Matrix --> PhrasesDB
    Matrix --> TTS
    Glossary --> GlossaryDB
    Glossary --> TTS
    Quiz --> TTS
    Vault --> LocalStorage
    Vault --> JSONExport
    TTS --> PitchEngine
```

| Technology | Purpose | Justification |
| :--- | :--- | :--- |
| **React 19 + TypeScript 5.7** | Core Application Framework | Type safety, zero runtime errors, instant reactive state. |
| **Tailwind CSS 4.0** | Modern Responsive Styling | Custom Karnataka heritage theme (Crimson `#991b1b`, Haldi Gold `#d97706`). |
| **Lucide React** | Accessible Iconography | Lightweight, accessible SVGs. |
| **Web Speech API** | Client-Side Audio Synthesis | Zero-latency, zero-cost audio playback without vendor lock-in. |
| **Canvas Confetti** | Gamification Engine | Visual rewards for quiz completion and streak milestones. |
| **Vitest** | Automated Test Runner | 100% data and component schema test verification. |

---

## 4. Linguistic Sources & Attribution

To maintain data integrity, regional phrases and etymologies are grounded in authentic Kannada linguistic research:
1. **Central Institute of Indian Languages (CIIL), Mysuru:** Comparative phonological and acoustic studies on regional dialects.
2. **Kannada University, Hampi (Department of Kannada Language Studies):** Regional dialect glossaries (*Kannada Bhaasha Prabhedagala Kosha*).
3. **Reverend Ferdinand Kittel:** *A Kannada-English Dictionary* (historical lexical roots).
4. **Prof. D. N. Shankara Bhat:** Structural studies on Kannada grammar and spoken vernacular variations.
5. **KDSC (Kannada Dialect Speech Corpus) Research:** Acoustic analysis of Dharwad, Coastal, and Southern Kannada vowel formants.

> **Data Integrity Principle:** No dialect entries are simulated or machine-translated without verified regional grammatical patterns. Entries distinguish between dictionary-attested usage, community contributions, and verified colloquial phrases.

---

## 5. Getting Started & Local Development

### Prerequisites
- **Node.js:** v18.0.0 or higher (v24.x tested)
- **npm:** v9.0.0 or higher

### Installation & Run
```bash
# 1. Clone repository
git clone <repository-url>
cd HACKTHON

# 2. Install dependencies
npm install

# 3. Launch local development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Automated Testing
```bash
# Run unit test suite
npm test
```

### Production Build
```bash
# Compile TypeScript and bundle with Vite
npm run build

# Preview production build locally
npm run preview
```

---

## 6. Submission Deliverables Summary

| Deliverable | File / Location | Status |
| :--- | :--- | :---: |
| **1. Source Code Repository** | Standalone Git repo with complete commit history | ✅ Verified |
| **2. Presentation Deck** | [`Namma_Kannada_Regional_Explorer_Presentation.pptx`](./Namma_Kannada_Regional_Explorer_Presentation.pptx) | ✅ Verified (38 KB) |
| **3. Automated Test Suite** | [`src/__tests__/app.test.ts`](./src/__tests__/app.test.ts) (5 test suites) | ✅ Passed (194ms) |
| **4. Environment Template** | [`.env.example`](./.env.example) | ✅ Present |
| **5. Video Walkthrough Script** | Included in evaluation documentation (3–5 min timed) | ✅ Ready |

---

## 7. License & Credits

- **License:** MIT License.
- **Hackathon:** Kannada Digital Innovation Hackathon 2026.
- **Host Institution:** The National Institute of Engineering (NIE), Mysuru.
- **Partner:** HackerRank Campus Crew.
