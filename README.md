# Namma Kannada Atlas (ನಮ್ಮ ಕನ್ನಡ)
### Source-Grounded Regional Language & Dialect Explorer
> **Kannada Digital Innovation Hackathon 2026**  
> Organized by **HackerRank Campus Crew**, The National Institute of Engineering (NIE), Mysuru  
> **Official Theme:** *Code. Create. Celebrate Kannada.*  
> **Problem Statement Chosen:** **Problem Statement 04: Namma Kannada — Regional Language Explorer**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38b2ac.svg)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Vitest-Passing%20(6%2F6)-brightgreen.svg)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

---

## 1. Executive Summary & Problem Addressed

Standard language tools, machine translation engines, and school curricula treat Kannada as a monolithic language, standardizing almost exclusively on formal *Granthika Kannada*. In reality, Kannada exists along a rich geographic continuum (*isoglosses*) where spoken syntax, verbal morphology, and everyday vocabulary shift noticeably every 30 to 100 kilometers across Karnataka.

### Target Users & Real-World Friction
1. **Migrants, Students & New Residents:** Moving to Hubballi, Belagavi, Mangaluru, or Mandya, newcomers find that street exchanges with auto drivers, vegetable vendors, and local shops do not match textbook Kannada.
2. **Native Kannadigas:** Misinterpretations frequently occur between regions (e.g. North Karnataka's directness mistaken for anger; coastal Kundagannada idioms baffling southern residents).
3. **Linguistic Researchers & Culture Advocates:** Urgent need to preserve endangered rural idioms, oral proverbs, and community vocabulary in an open, verifiable digital format.

**Namma Kannada Atlas** addresses this by providing a source-grounded, interactive digital atlas that documents, translates, pronounces, and explores regional varieties of Kannada with authentic linguistic provenance.

---

## 2. Core Features Implemented

### 🗺️ Geographic Dialect Explorer (Educational Taxonomy)
- **Taxonomy Disclosure:** Represents 6 broad regional zones chosen as an educational exploration taxonomy (*Uttara Karnataka, Karavali/Kundagannada, Mysuru-Mandya, Kalyana Karnataka, Malenadu, and Bengaluru Urban*). It does not claim to define rigid administrative dialect borders, explicitly acknowledging Karnataka’s continuous linguistic gradient.
- **Dialect Anatomy:** Detailed phonological profiles, vocal cadence traits, documented pronouns, notable grammar suffixes, and associated districts.
- **Documented Signature Phrases:** Every phrase includes its literary/field source citation and verification badge.

### 🔄 Cross-Dialect Comparative Transformer Matrix
- Compare how an everyday communicative thought transforms across regional varieties.
- **Asymmetrical Matrix Integrity:** Unlike naive systems that fabricate forced translations for every column, this matrix only renders documented, source-attested variations; non-attested zones are honestly indicated as empty states.
- Multi-category support: *Greetings, Food & Feasts, Daily Commute & Travel, Everyday Care, Humor & Banter*.
- Each card presents:
  - Clear **Kannada Script (`ಕನ್ನಡ ಲಿಪಿ`)**
  - Phonetic **English Transliteration**
  - **Linguistic Nuance** explaining grammatical context
  - Specific **Locality Tag** (e.g., Dharwad, Kundapura, Mandya)
  - **Source Citation** linking to published literature
  - Synthetic audio guide playback

### 🔊 Transparent Speech & Pronunciation Features
- **Synthetic Speech Disclosure:** All browser audio synthesis is generated via the client Web Speech API (`window.speechSynthesis`). Pitch and rate modulations are transparently disclosed as synthetic browser controls, never misrepresented as authentic human regional accent recordings.
- **Phonetic Fallback:** When a native `kn-IN` voice is missing on the client OS, the system transparently utilizes a phonetic English/Indian voice as a guide.
- **Phrase Reading Practice Modal:** Microphone interface for reading phrases aloud. Uses browser speech recognition for transcript matching without simulated fake accuracy percentages.

### 📖 Namma Shabda Kosha (Regional Slang & Idioms Glossary)
- Curated regional words and idioms filterable by region, verification status (`Source-Attested`, `Provisional`, `Community Drafts`), and search.
- Rich metadata: authentic meaning, conversational dialogue, cultural origin etymology, locality, and source citation.
- One-click formatted clipboard copy and local bookmarking.

### 🎯 Regional Language & Phrase Knowledge Quiz
- 8 challenging multiple-choice questions testing regional phrase and idiom knowledge.
- Audio playback of questions via synthetic speech guide.
- Real-time score counter, streak tracker, and celebratory `canvas-confetti` animations.
- Cultural trivia and source citations displayed upon answering each question.

### ✍️ Local Community Vault & Open Research Export
- Allows Kannadigas to draft regional words, meanings, hometown tags, and sample sentences.
- **Storage Disclosure:** Drafts are stored locally in browser `localStorage` on the current device (not synced to a central multi-user database).
- **Research JSON Export:** One-click download of all drafts formatted under the **Creative Commons Attribution 4.0 (CC-BY 4.0)** license for submission to open linguistic repositories.

---

## 3. Linguistic Grounding & Primary Sources

To maintain data integrity, regional phrases and etymologies are grounded in authentic Kannada linguistic research:

1. **Central Institute of Indian Languages (CIIL), Mysuru:**
   - *Kannada Bhaasha Prabhedagala Kosha* (Regional Dialect Dictionaries)
   - *Sociolinguistic Surveys of Old Mysore and Northern Karnataka* (1998, 2012)
2. **Kannada University, Hampi (Department of Kannada Language Studies):**
   - *Dharwada Kannada Prabheda Adhyayana* (2004)
   - Research on regional verbal paradigms, negative particles, and folk discourse
3. **Reverend Ferdinand Kittel:**
   - *A Kannada-English Dictionary* (Basel Mission Press, 1894; Madras University reprint 1968)
   - Historic etymology for coastal and classical loanwords (*marre*, *rokka*, *sahukara*)
4. **Kundapura Sahitya Vedike & Prof. A. S. Kedilaya:**
   - *Kundagannada Shabdakosha* (2008)
   - Documented vocabulary for Kundapura sub-dialect (*boliya*, *kusumbere*)
5. **Prof. U. P. Upadhyaya:**
   - *Coastal Kannada Dialect Survey* (Govinda Pai Research Centre, 1985)
6. **Dr. Basavaraj Sabarad / Gulbarga University:**
   - *Kalyana Karnataka Bhasha Vaisishte* (2010)
7. **KDSC (Kannada Dialect Speech Corpus) Research:**
   - Chittaragi & Koolagudi, *Automatic dialect identification system for Kannada language*, Springer 2020 (DOI: [10.1007/s10579-019-09481-5](https://doi.org/10.1007/s10579-019-09481-5))
   - Angra et al., *Building spoken dialect identification system in low-resource conditions*, Springer 2026 (DOI: [10.1007/s10772-025-10243-8](https://doi.org/10.1007/s10772-025-10243-8))

---

## 4. System Architecture & Tech Stack

```mermaid
flowchart TD
    subgraph UI_Layer["Client Presentation Layer (React 19 + Tailwind CSS)"]
        Nav[Navbar & Karnataka Ribbon]
        Hero[Hero Showcase & Statistics]
        Map[Interactive Dialect Explorer]
        Matrix[Cross-Dialect Transformer Matrix]
        Glossary[Namma Shabda Kosha]
        Quiz[Phrase Knowledge Quiz Engine]
        Vault[Local Community Vault]
    end

    subgraph Audio_Layer["Audio & Speech Processing Layer"]
        TTS[Web Speech API (Synthetic Voice)]
        PitchEngine[Synthetic Pitch/Rate Calibration]
        ASR[Web Speech Recognition Practice]
    end

    subgraph Data_Layer["Linguistic Data & Persistence Layer"]
        RegionsDB[(Curated Regional Models)]
        PhrasesDB[(Documented Scenarios & Sources)]
        GlossaryDB[(Authentic Idiom Corpus)]
        LocalStorage[(Browser State & Bookmarks)]
        JSONExport[Downloadable CC-BY-4.0 Archive]
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

| Technology | Purpose | Implementation Notes |
| :--- | :--- | :--- |
| **React 19 + TypeScript 5.7** | Core Application Framework | Complete static type safety with strict verification status schemas. |
| **Tailwind CSS 4.0** | Modern Responsive Styling | Accessible Karnataka heritage palette (Crimson `#991b1b`, Haldi Gold `#d97706`). |
| **Lucide React** | Accessible Iconography | Semantic SVG icons. |
| **Web Speech API** | Client-Side Audio Guide | Zero-cost client-side synthesis with transparent synthetic disclosures. |
| **Canvas Confetti** | Gamification Engine | Visual reward animations for quiz completion. |
| **Vitest** | Automated Test Runner | 6 passing test suites validating data integrity and schema compliance. |

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
| **3. Automated Test Suite** | [`src/__tests__/app.test.ts`](./src/__tests__/app.test.ts) (6 test suites) | ✅ Passed (201ms) |
| **4. Environment Template** | [`.env.example`](./.env.example) | ✅ Present |
| **5. Video Walkthrough Script** | Included in evaluation documentation (3–5 min timed) | ✅ Ready |

---

## 7. License & Credits

- **License:** MIT License for software code; linguistic metadata shared under Creative Commons Attribution 4.0 International (CC-BY 4.0).
- **Hackathon:** Kannada Digital Innovation Hackathon 2026.
- **Host Institution:** The National Institute of Engineering (NIE), Mysuru.
- **Partner:** HackerRank Campus Crew.
