# Namma Kannada Atlas (ನಮ್ಮ ಕನ್ನಡ)
### Evidence-Graded Regional Language & Dialect Explorer
> **Kannada Digital Innovation Hackathon 2026**  
> Organized by **HackerRank Campus Crew**, The National Institute of Engineering (NIE), Mysuru  
> **Official Theme:** *Code. Create. Celebrate Kannada.*  
> **Problem Statement Chosen:** **Problem Statement 04: Namma Kannada — Regional Language Explorer**  
> **Architecture Level:** **Argon Phase 4 & Phase 5 Integration: Phrase Passport, Morpheme X-Ray & Verified Bibliographic Provenance**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38b2ac.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Passing%20(28%2F28)-brightgreen.svg)](https://vitest.dev/)
[![JSON Schema](https://img.shields.io/badge/JSON%20Schema-Draft%202020--12-blueviolet.svg)](https://json-schema.org/)
[![License](https://img.shields.io/badge/License-MIT%20%2B%20CC--BY--4.0%20%2B%20ODbL-amber.svg)](LICENSE)

---

## 1. Executive Summary & Problem Addressed

Standard natural language tools, machine translation engines, and school curricula treat Kannada as a monolithic language, standardizing almost exclusively on formal *Granthika Kannada*. In reality, Kannada exists along a rich geographic continuum (*isoglosses*) where spoken syntax, verbal morphology, and everyday vocabulary shift noticeably every 30 to 100 kilometers across Karnataka.

### The Hackathon Trap vs Grounded Solution
Typical hackathon projects build decorative translation chatbots that synthesize fake regional accents by pitch-shifting browser TTS, invent uniform 6-column translation grids, or present unverified random words as "dialects". 

**Namma Kannada Atlas** rejects these simulated authority traps. In **Argon Phase 5**, the application is engineered as an **evidence-graded, source-grounded regional language explorer** where every single entry is backed by linguistic literature, clear isogloss awareness, strict JSON Schema Draft 2020-12 validation, and our flagship innovations:
1. **Interactive Morpheme-Shift X-Ray (`MorphemeXRayBar`):** Slot-by-slot morphological decomposition demonstrating how dialect forms share invariant Dravidian roots while shifting aspectual affixes and phonemes.
2. **Regional Knowledge-Gap Ribbon (`KnowledgeGapRibbon`):** Honest visualization of Karnataka's 6 macro-regions, turning missing data into an open invitation for verified citizen linguistics.
3. **Inspectable Phrase Passport (`PhrasePassportDrawer`):** Slide-out drawer answering all 8 mandatory linguistic questions (meaning, register, public status, primary source link, 5-dimension evidence audit, morphemes, shared regions, and limitations).

---

## 2. Reconciled Data Model & Evidence Tiers

### 📊 Dataset Reconciliation (13 Candidate Entries across 5 Concepts)
An independent packaging audit of the authoritative seed dataset (`src/data/atlas-evidence-candidates.json`) establishes that the dataset contains **13 entries across 5 concepts**:
- **Concept 1 (`concept-how-are-you`):** 3 entries (`nka-how-are-you-std`, `nka-how-are-you-nk-shared`, `nka-how-are-you-coastal-kunda`)
- **Concept 2 (`concept-what-are-you-doing`):** 4 entries (`nka-what-doing-std`, `nka-what-doing-kittur`, `nka-what-doing-kalyana`, `nka-what-doing-coastal-malnad`)
- **Concept 3 (`concept-where-setting-out`):** 2 entries (`nka-where-going-std`, `nka-where-going-nk-shared`)
- **Concept 4 (`concept-good-fine`):** 2 entries (`nka-good-fine-std`, `nka-good-fine-kittur`)
- **Concept 5 (`concept-boy-youth`):** 2 entries (`nka-boy-std`, `nka-boy-coastal-mani`)
- **Total:** `3 + 4 + 2 + 2 + 2 = 13` documented entries.

### 🛡️ Strict Evidence Status & Locator Integrity
All 13 candidate seed entries hold **provisional (`E4` phrase / `E2` pattern)** status with `citation.locator: null`. The system adheres strictly to the rule:
- **No Fabricated Locators:** We do not invent physical book page numbers or upgrade entries to `source_attested` (`E1`) until a human researcher inspects the physical book or live dictionary headword.
- **No Fabricated Speaker Reviews:** Strictly 0 entries claim `speaker_reviewed` (`E3`) without an authenticated contributor protocol with recorded consent.
- **Quarantined Legacy Backlog:** The 15 pre-existing repository glossary items are quarantined under **`unverified` (`E5`)** status with clear visual toggles and notices.
- **Closed Bibliographic Registry (v4.0.0):** Every candidate links to [`src/data/VERIFIED_SOURCE_REGISTRY.json`](./src/data/VERIFIED_SOURCE_REGISTRY.json), containing strictly vetted primary sources verified against academic and library catalogues:
  1. `SRC-UPADHYAYA-1976` (Dr. U. P. Upadhyaya, *A Comparative Study of Kannada Dialects*, Univ of Mysore)
  2. `SRC-KITTEL-1894` (Rev. Ferdinand Kittel, *A Kannada-English Dictionary*, Basel Mission Press / DSAL)
  3. `SRC-VENKATASUBBIAH-IGO` (Prof. G. Venkatasubbiah, *Igo Kannada: Samajika Nighantu*, Navakarnataka)
  4. `SRC-ALAR` (V. Krishna, *Alar Open Dictionary*, ODbL 1.0)
  5. `SRC-PADAKANAJA` (Kannada Development Authority / DPAR, *Padakanaja Multilingual Online Dictionary*)
  6. `SRC-BHAT-1971` (Dr. D. N. Shankara Bhat, *An Outline Grammar of Havyaka*, Deccan College Postgraduate and Research Institute)
  7. `SRC-BRIGHT-1958` (Prof. William Bright, *An Outline of Colloquial Kannada*, Linguistic Society of India / Deccan College)
  8. `SRC-HIREMATH-1961` (Dr. R. C. Hiremath, *The Structure of Kannada*, Karnatak University Dharwad)
  9. `SRC-LDCIL-DOC` (Linguistic Data Consortium for Indian Languages / CIIL, Mysore)
  10. `SRC-KSP-NIGHANTU` (*Kannada Sahitya Parishat Nighantu*, Vols 1–8)
  *(Strictly purged 6 unverified synthetic titles: `Kannada Bhaasha Prabhedagala Kosha`, `Sociolinguistic Surveys of Old Mysore`, `Dharwada Kannada Prabheda Adhyayana`, `Kundagannada Shabdakosha`, `Coastal Kannada Dialect Survey`, `Kalyana Karnataka Bhasha Vaisishte`, plus uncataloged `SRC-BHAT-1967`)*.

---

## 3. Flagship Technological Innovations

### 🔬 1. The Morpheme-Shift X-Ray (`src/components/MorphemeXRayBar.tsx`)
- Solves the common misconception that dialects are "different languages" or "slang".
- Decomposes every regional candidate into constituent morphemes:
  - **Invariant Dravidian Root (Green):** Identifies the shared lexical verb or noun base (e.g. `ಮಾಡ್-` [*māḍ-*] "do", `ಹುಡುಗ` [*huḍuga*] "boy").
  - **Aspectual / Progressive Morpheme (Indigo):** Visualizes diagnostic regional aspect markers (e.g. Kittur `-ಆಕತ್ತ-` [*-ākatta-*] vs Kalyana `-ಲಿಕ್ಕತ್ತ-` [*-likkatta-*] vs Coastal `-ತಾ` [*-tā*]).
  - **Phonological Shift (Amber):** Highlights regular sound correspondences (e.g. `ಹ್ಯಾಂಗ` [*hyāṅga*] with Old Kannada velar nasal retention).
  - **Lexical Replacement (Rose):** Highlights regional nouns or adjectives (e.g. `ಎಂತ` [*enta*], `ಚೊಲೊ` [*colo*], `ಮಾಣಿ` [*māṇi*]).
- Interactive popover reveals underlying reconstructions, linguistic glosses, and etymological mechanisms.

### 🌐 2. Regional Knowledge-Gap Ribbon (`src/components/KnowledgeGapRibbon.tsx`)
- Maps communicative concepts across Karnataka's 6 macro-linguistic zones:
  1. `old_mysuru_southern`
  2. `kittur_karnataka`
  3. `kalyana_karnataka`
  4. `karavali_coastal`
  5. `malnad`
  6. `central_border_cluster`
- **7-State Comparative Matrix Classification (Phase 4 Workstream E):**
  - `distinct_regional_variant` (Emerald): Documented distinct regional reflex (e.g. Kittur `-ಆಕತ್ತೀರಿ`, Coastal `ಎಂತ`).
  - `documented_multi_region` (Blue): Isogloss shared across northern regions (e.g. Kittur & Kalyana).
  - `borrowed_contact_variant` (Purple): Borderland language contact loans (e.g. Kittur `ಚೊಲೊ` < Marathi चांगला/चोख).
  - `shared_with_standard` (Stone): Formal or baseline standard reflex used across everyday social contexts.
  - `no_verified_distinct_variant` (Amber dashed): Honest knowledge gap preserving open spaces rather than fabricating fake dialect words.
  - `sub_regional_vernacular` (Indigo): Micro-local vernacular attested in dialect monographs.
  - `quarantined_pending_fieldwork` (Slate): Unreviewed community contributions quarantined in local storage.
- **Actionable Citizen Linguistics:** Open knowledge gaps feature a **"Log Fieldwork"** button that pre-populates the local contribution workflow to gather authenticated native-speaker observations.

### 🛂 3. Official Phrase Passport Drawer (`src/components/PhrasePassportDrawer.tsx`)
- Deep slide-out drawer providing 8-pillar linguistic inspection for any candidate:
  1. **Meaning & Concept:** Detailed semantic definition and communicative register.
  2. **Pragmatic Context:** Sub-variety, target locality, and spoken registers.
  3. **Public Legal Status (Phase 4 Artifact D):** Transparent licensing via `rights_and_provenance`:
     - ODbL v1.0 database terms explicitly declared.
     - Entry-level rights: `open_database_odbl_v1`, `public_domain_source`, `copyrighted_reference_factual_citation_only` (Fair Dealing under Indian Copyright Act 1957, Section 52(1)(a)), and `community_open_cc_by_4`.
  4. **Primary Source Provenance:** Verified bibliographic record linked to `VERIFIED_SOURCE_REGISTRY.json` v4.0.0 with access rationale.
  5. **5-Dimension Evidence Radar:** Invariant root, semantic equivalence, grammatical pattern, isogloss distribution, locator status, and speaker review status.
  6. **Morpheme-Shift Decomposition:** Slot-by-slot analysis of surface vs underlying forms.
  7. **Shared Regions & Isoglosses:** Regional distribution across Karnataka.
  8. **Epistemic Limitations:** Explicit list of caveats and reasons held at provisional tier.
  - **Native-Speaker Review Protocol (E3):** Step-by-step guidance on collecting authentic native-speaker reviews with informed consent, eliminating fabricated entries.

### 🔊 4. Audio Authenticity & Deterministic Spoken Recall Check
- **Speech Synthesis:** Fixed standard readout (`pitch: 1.0`, `rate: 0.95`, `kn-IN`). Explicitly labeled as **"Synthetic Standard kn-IN Script Readout — Not a Native Regional Recording"**. Eliminates deceptive accent manipulation.
- **Spoken Recall Check:** Captures browser Web Speech recognition transcripts, performs deterministic **Levenshtein character distance**, and prominently displays standard ASR dialect disclaimers.

---

## 4. Automated Vitest Suite (28/28 Passing)

The project includes **28 automated Vitest unit and integration tests** executing in under 300ms:

```bash
 ✓ src/__tests__/app.test.ts (28 tests) 92ms
   ✓ Namma Kannada Atlas Phase 2.5 Evidence-Graded & Semantic Verification Suite (28)
     ✓ 1. Validates candidate dataset against JSON Schema Draft 2020-12 with zero schema errors 69ms
     ✓ 2. Enforces all 6 Semantic Validation Rules via validateAtlasDataset 1ms
     ✓ 3. Reconciles dataset counts: confirms exactly 13 candidate entries across 5 concepts (resolving Argon report 12 vs 13) 0ms
     ✓ 4. Enforces provisional status and null locators on candidate entries (no invented citations) 1ms
     ✓ 5. Enforces per-entry licensing metadata and top-level license policy 1ms
     ✓ 6. Verifies sparse 6-region matrix states include shared-form and honest missing-data handling 1ms
     ✓ 7. Verifies speech service provides honest diagnostics and rejects simulated accents 0ms
     ✓ 8. Verifies educational macro-cluster taxonomy and isogloss notes for all 6 regions 0ms
     ✓ 9. Verifies absence of duplicate IDs across concepts, candidates, regions, glossary, and quiz 0ms
     ✓ 10. Verifies legacy glossary items are quarantined under unverified (E5) status 0ms
     ✓ 11. Verifies quiz questions contain unique options and morphological mechanism notes 0ms
     ✓ 12. Actively asserts zero occurrences of forbidden synthetic titles across all active application datasets 7ms
     ✓ 13. Verifies semantic validator actively rejects blacklisted titles and unregistered source IDs 1ms
     ✓ 14. Asserts no entry or question claims source_attested without physical locator and registered source ID 1ms
     ✓ 15. Validates licensing metadata completeness and fair dealing/ODbL disclosure compliance 0ms
     ✓ 16. Verifies exact active 5 concepts: how-are-you, what-are-you-doing, where-setting-out, good-fine, boy-youth 1ms
     ✓ 17. Verifies Kundagannada candidate nka-how-are-you-coastal-kunda ("ಹೆಂಗಿದ್ದಿರಿ?") provenance and limitations 0ms
     ✓ 18. Enforces strictly 0 E3 records across datasets and confirms removal of unverified SRC-BHAT-1967 0ms
     ✓ 19. Asserts zero pseudo-corpus or fake oral collection names in secondary source metadata 1ms
     ✓ 20. (Phase 5 - TEST-01) Validates morpheme_xray_concatenation_and_slot_integrity across all 13 candidates 2ms
     ✓ 21. (Phase 5 - TEST-02) Validates phrase_passport_five_dimension_evidence_gate 0ms
     ✓ 22. (Phase 5 - TEST-03) Validates closed_bibliography_registry_and_purge_check via VERIFIED_SOURCE_REGISTRY.json 0ms
     ✓ 23. (Phase 5 - TEST-04) Validates knowledge_gap_sparse_matrix_honesty across all 5 concepts and 6 macro-regions 0ms
     ✓ 24. (Phase 5 - TEST-05) Validates composite_license_and_odbl_export_validation 0ms
     ✓ 25. (Phase 5 - TEST-06) Validates synthetic_tts_neutrality_and_fallback diagnostics 0ms
     ✓ 26. (Phase 4 - TEST-07) Validates rights_and_provenance and ODbL v1.0 compliance across candidate entries 1ms
     ✓ 27. (Phase 4 - TEST-08) Validates 7-state comparison_cell_state mapping across candidate entries 0ms
     ✓ 28. (Phase 4 - TEST-09) Strict gating against unverified E1 source_attested claims and purged titles across all datasets 1ms

 Test Files  1 passed (1)
      Tests  28 passed (28)
   Duration  274ms
```

---

## 5. Getting Started & Local Development

### Prerequisites
- **Node.js:** v18.0.0 or higher (v24.x verified)
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
npm test
```

### Production Build
```bash
npm run build
```

---

## 6. 3-to-5 Minute Video Walkthrough Script

*Total duration: ~3 minutes 50 seconds. Structured specifically for hackathon evaluators.*

### [0:00 - 0:45] Hook, Problem Statement & Evidence Grounding
- **Visual:** Screen recording of the Hero section, showing the Karnataka interactive dialect map.
- **Spoken Script:**
  > "Namaskara! I am presenting *Namma Kannada Atlas*, built for Problem Statement 04: Regional Language Explorer at the Kannada Digital Innovation Hackathon 2026.
  > 
  > Standard NLP and translation tools treat Kannada as a single monolithic block, defaulting to formal literary *Granthika Kannada*. But in real life, spoken Kannada changes every 50 kilometers—from the northern cadences of Dharwad and Belagavi to coastal Kundagannada and Old Mysore speech.
  > 
  > Instead of building a decorative chatbot with simulated AI accents, our mission was simple: create an **evidence-graded, source-grounded regional language explorer** where every single entry is backed by linguistic literature, clear isogloss awareness, and transparent provenance."

### [0:45 - 1:45] Flagship Demo: Morpheme-Shift X-Ray & Regional Knowledge Gaps
- **Visual:** Navigate to "Comparative Matrix". Click on "What are you doing?". Toggle the "Morpheme X-Ray: ON" switch. Click the `-ಆಕತ್ತ-` slot on the Kittur card and `-ಲಿಕ್ಕತ್ತ-` slot on the Kalyana card.
- **Spoken Script:**
  > "Here is our flagship innovation: **The Morpheme-Shift X-Ray**. Dialects are not separate languages; they are regular morphological shifts atop invariant Dravidian roots.
  > 
  > Look at the concept 'What are you doing?':
  > In the green pill, you see the invariant root `ಮಾಡ-` (māḍu), shared across all Kannada speakers.
  > But look at the aspect marker: In Kittur Karnataka, it shifts to `-ಆಕತ್ತ-` (-ākatta-), grammaticalized from the purposive infinitive and inceptive auxiliary.
  > In Kalyana Karnataka, it shifts to the dative-progressive `-ಲಿಕ್ಕತ್ತ-` (-likkatta-).
  > And in Karavali Kundagannada, notice the lexical interrogative `ಎಂತ` (enta).
  > 
  > Right above the grid, our **Knowledge-Gap Ribbon** honestly displays Karnataka's six macro-regions. Notice the dashed card: where literature has not yet attested a distinct variant, we preserve an honest empty state with a 'Log Fieldwork' button to invite authenticated community contributions rather than hallucinating nonexistent dialect words."

### [1:45 - 2:40] The Phrase Passport Drawer & 5-Dimension Evidence Radar
- **Visual:** Click "Passport" on the Kittur card. The `PhrasePassportDrawer` slides out. Scroll through the 8 dimensions. Click "Review Protocol" under E3.
- **Spoken Script:**
  > "Next, click **'Passport'** on any phrase. Our slide-out **Phrase Passport** answers eight mandatory linguistic questions.
  > 
  > You see the exact meaning, sociolinguistic register, and public licensing under CC BY 4.0 and Fair Dealing.
  > Under source provenance, notice the live link to our closed **Verified Source Registry**, citing Dr. Upadhyaya's 1976 dialect survey.
  > Look at our **Five-Dimension Evidence Radar**: the lexical root, grammatical pattern, and isogloss distribution are verified at E2, while exact page citations and speaker reviews are honestly marked null because this is a provisional candidate.
  > We even provide a formal protocol for how community speakers can elevate entries to genuine E3 speaker review with recorded consent."

### [2:40 - 3:20] Audio Authenticity & Deterministic Spoken Recall Check
- **Visual:** Click "kn-IN TTS". Then click "Recall" to open the Voice Practice modal. Speak into the microphone and demonstrate the deterministic Levenshtein comparison.
- **Spoken Script:**
  > "Notice our audio honesty: every audio button is labeled **'Synthetic Standard kn-IN Script Readout — Not a Native Regional Recording'**. We explicitly eliminated pitch-shifting and fake accent modulation.
  > 
  > In our **Spoken Recall Check**, we replaced fake random scores with deterministic **Levenshtein character distance** against captured browser ASR transcripts, accompanied by permanent notices explaining standard ASR dialect limitations."

### [3:20 - 3:50] 28 Passing Tests, Production Build & Conclusion
- **Visual:** Show terminal executing `npm test` (all 28 passing) and show the 8-slide presentation deck.
- **Spoken Script:**
  > "Under the hood, Namma Kannada Atlas passes **28 automated Vitest acceptance tests** in 274ms, validates against JSON Schema Draft 2020-12 via Ajv, compiles to a lightweight production bundle, and includes an 8-slide widescreen presentation deck.
  > 
  > Namma Kannada Atlas proves that technological innovation in Indian languages comes from linguistic truth, verifiable provenance, and deep structural insight.
  > 
  > Thank you! Sirigannadam Gelge, Sirigannadam Balge!"

---

## 7. Submission Deliverables Summary

| Deliverable | File / Location | Status |
| :--- | :--- | :---: |
| **1. Source Code Repository** | Standalone Git repo with complete commit history | ✅ Verified (`main`) |
| **2. Presentation Deck** | [`Namma_Kannada_Regional_Explorer_Presentation.pptx`](./Namma_Kannada_Regional_Explorer_Presentation.pptx) | ✅ 8-Slide Widescreen Deck Generated |
| **3. Automated Test Suite** | [`src/__tests__/app.test.ts`](./src/__tests__/app.test.ts) (28 tests) | ✅ 28/28 Passed (92ms) |
| **4. JSON Schema Draft 2020-12** | [`src/data/atlas-data.schema.json`](./src/data/atlas-data.schema.json) | ✅ Ajv 2020 Compliant |
| **5. Seed Dataset (13 Entries)** | [`src/data/atlas-evidence-candidates.json`](./src/data/atlas-evidence-candidates.json) | ✅ Enriched with Morpheme & Rights Metadata |
| **6. Verified Source Registry** | [`src/data/VERIFIED_SOURCE_REGISTRY.json`](./src/data/VERIFIED_SOURCE_REGISTRY.json) | ✅ 10 Closed Vetted Titles (v4.0.0) |
| **7. Production Build** | [`dist/`](./dist/) | ✅ Vite 6 / TS 5.7 (1.35s build) |
| **8. Video Walkthrough Script** | Section 6 above (3:50 timed spoken script) | ✅ Ready to Record |

---

## 8. License & Policy

- **Software Code:** MIT License.
- **Dataset Policy:** Original English explanations, morpheme decompositions, and structural metadata by the Namma Kannada Atlas team are released under Creative Commons Attribution 4.0 International (CC-BY 4.0); cited third-party lexical sources retain their respective rights and restrictions.
- **Hackathon:** Kannada Digital Innovation Hackathon 2026.
- **Host Institution:** The National Institute of Engineering (NIE), Mysuru.
- **Partner:** HackerRank Campus Crew.
