# FINAL RELEASE BLOCKERS & REMEDIATION PLAN (`FINAL_RELEASE_BLOCKERS.md`)
**Target Owner:** Google Antigravity (Gemini 3.8 High) + Human Project Owner  
**Current Release Status:** `NOT READY`  
**Target Status After P0 Completion:** `CONDITIONALLY READY` -> `READY FOR SUBMISSION` (upon live URL & video verification)  
**Hard Submission Deadline:** Saturday, 31 October 2026 at 10:00 PM IST

---

## P0 Release Blockers (Mandatory Fixes — Must Complete Before Recording Video or Submitting)

### BLOCKER P0-1: Purge the Six Hallucinated/Unverified Bibliography Sources and Downgrade Uninspected `source_attested` Entries
- **Observed Defect:** To satisfy the JSON Schema constraint requiring a `source_title` and `locator` for `source_attested` entries, the implementation pass introduced six unverified/fabricated sources—most glaringly *"Kalyana Karnataka Bhasha Vaisishte (2010)"* (an impossibility since Hyderabad-Karnataka was renamed Kalyana Karnataka in September 2019), *"Sociolinguistic Surveys of Old Mysore and Northern Karnataka (1998, 2012)"*, *"Coastal Kannada Dialect Survey (1985)"*, *"Dharwada Kannada Prabheda Adhyayana (2004)"*, *"Kannada Bhaasha Prabhedagala Kosha"*, and an unauthored *"Kundagannada Shabdakosha (2008)"*.
- **Required Change:**
  1. Search the entire codebase (`src/`, `public/`, `README.md`, slide deck generator) and **delete all six titles**.
  2. For every phrase variation and glossary entry that cited one of those six titles (or that has an unverified page number in Upadhyaya 1976 / Venkatasubbiah / Kittel 1894):
     - Set `evidence_status: "provisional"`, `evidence_level: "E4"`, `pattern_evidence_level: "E2"`, and `citation.locator: null` (citing `SRC-UPADHYAYA-1976`, `SRC-VENKATASUBBIAH-IGO`, or `SRC-KITTEL-1894` honestly for pattern/stem support).
     - **How to legitimately earn `source_attested` (`E1`) before submission:** A human team member (or an environment with live access to `https://alar.ink/` or `https://dsal.uchicago.edu/dictionaries/kittel/`) can look up real headwords (e.g., `ಹುಡುಗ`, `ಮಾಣಿ`, `ಚೆನ್ನ`, `ಹೊರಡು`, `ಹೇಗೆ`, `ಏನು`, `ಎಂತ`, `ಹೊಂಟು`) in **Alar** or **Kittel (1894)** and record the exact verified dictionary entry/page locator. Only entries with a genuinely verified headword/page locator may carry `evidence_status: "source_attested"`.
- **Acceptance Criteria:** Zero occurrences of the 6 fabricated titles anywhere in the repo or slides; zero entries marked `source_attested` without a genuinely inspected locator in the closed source registry.
- **Verification Instruction:** Run `grep -riE "Prabhedagala|1998|2012|Adhyayana|Shabdakosha|1985|Vaisishte" .` across the repo and confirm 0 matches.

---

### BLOCKER P0-2: Lock the Automated Test Suite Against Schema-Gaming (Closed Source Registry)
- **Observed Defect:** The current 8 automated tests check structural presence (`locator !== null`) rather than verifying that `source_id` belongs to an approved list of real publications.
- **Required Change:**
  1. Add a strict `APPROVED_SOURCES` map in the test suite containing only verified institutional/scholarly IDs:
     - `SRC-UPADHYAYA-1976` (*A Comparative Study of Kannada Dialects*, U. P. Upadhyaya, 1976)
     - `SRC-KITTEL-1894` (*A Kannada-English Dictionary*, Rev. Ferdinand Kittel, 1894)
     - `SRC-VENKATASUBBIAH-IGO` (*Igo Kannada*, G. Venkatasubbiah)
     - `SRC-ALAR` (*Alar Kannada-English Dictionary*, V. Krishna, ODbL v1.0)
     - `SRC-PADAKANAJA` (*Karnataka Padakanaja*, Govt. of Karnataka)
     - `SRC-KSP-NIGHANTU` (*Kannada Sahitya Parishat Nighantu*)
  2. Fail the test suite if any entry references a `source_id` outside `APPROVED_SOURCES`.
  3. Add a test asserting that `source_attested` entries also include a boolean `locator_human_verified: true` flag that defaults to `false` for AI-seeded records.
- **Acceptance Criteria:** Test suite deterministically rejects unknown bibliography titles and unverified locators.
- **Verification Instruction:** Run `npm test` and attach the raw console output showing all tests passing with the closed registry active.

---

### BLOCKER P0-3: Audit the 10 Newly Added Regional Variations & 15 Glossary Entries for Linguistic Integrity
- **Observed Defect:** Phase 2.5 provided 12 vetted variations across 5 concepts. The implementation report claims 22 regional variations and 15 glossary entries.
- **Required Change:**
  1. Inspect each of the 10 additional regional variations and 15 glossary entries:
     - Ensure **no Tulu (`tcy`), Kodava (`kfa`), or Konkani (`kok`) words** are mislabeled as Kannada (`kn`) dialects. (If a word is a contact borrowing into Coastal/Kodagu Kannada, set `variation_type: "language_contact_loan"` and explain the source language in `morphological_note`).
     - Ensure **no concept row is artificially padded** to 6 distinct strings if the evidence only supports 2–4 distinct regional variants; use `shared_with_standard` and `no_verified_distinct_variant` slots instead.
  2. Update the **8 Quiz Questions** so that every question tests a documented grammatical or lexical contrast from the verified/pattern-supported pool and displays an honest explanation card after the user answers.
- **Acceptance Criteria:** Every variation and glossary entry has accurate `language_code: "kn"`, valid ISO-15919 transliteration, honest `evidence_status`, and zero forced 6-cell padding.
- **Verification Instruction:** Export the full dataset JSON and inspect every entry row-by-row against `PHRASE_SOURCE_AUDIT.csv`.

---

### BLOCKER P0-4: Enforce Alar ODbL v1.0 Attribution & Composite Licensing in Export, Consent, and README
- **Observed Defect:** Alar's corpus is governed by **ODbL v1.0**, which requires database attribution and share-alike compliance on derivative database exports, whereas original project code is MIT and original team explanations are CC BY 4.0.
- **Required Change:**
  1. In `README.md`, the UI Footer, and the Research JSON Export header, clearly state:
     - **Software Code:** MIT License.
     - **Original Team Explanatory Metadata & Consented User Notes:** CC BY 4.0.
     - **Alar-Derived Lexical References (if any):** Subject to the **Open Database License (ODbL v1.0)**, attributed to *V. Krishna / Alar (`https://alar.ink/`)*.
     - **Scholarly Citations (Upadhyaya 1976, Venkatasubbiah, Kittel 1894, Padakanaja):** Cited under fair-dealing reference terms; per-entry `license_status` governs reuse.
  2. Verify the **Browser-Local Contribution Form** includes a required consent checkbox before submission/export and labels storage explicitly as `"Saved in Browser-Local Storage (localStorage) — Not Shared to a Public Server"`.
- **Acceptance Criteria:** Exported JSON, contribution UI, and `README.md` contain accurate composite licensing and storage disclosures.
- **Verification Instruction:** Trigger "Research JSON Export" in the app and inspect the top-level license fields and per-entry `license_status` values.

---

## P1 Delivery & Presentation Blockers (Must Complete Before Final Unstop Submission)

### BLOCKER P1-1: Align the 8-Slide Presentation and README with the Cleaned Dataset
- **Required Change:**
  1. Update the generated 8-slide presentation and `README.md` so they no longer claim *"12 source-attested glossary entries"* based on the purged bibliography.
  2. Present the exact post-audit counts (e.g., *"X Source-Attested Headwords (`E1`), Y Scholarly Pattern-Supported Regional Variations (`E2`/`E4` Provisional), and Z Community/Glossary Candidates"*) and highlight our **2-Dimensional Evidence & Provenance Architecture** as the centerpiece of the presentation.
  3. Remove the 6 purged bibliography items from the References slide. Only list the 2019 and 2025/2026 Springer papers if a human confirms their exact titles and authors from the DOI pages.
- **Acceptance Criteria:** Zero contradictions between the live deployed app, the `README.md`, and the 8 presentation slides.

### BLOCKER P1-2: Verify Live Deployment, Public GitHub Repo, and Recorded 3–5 Minute Video
- **Required Change:**
  1. **Public GitHub Repo:** Push the post-audit codebase to GitHub and verify in an Incognito browser window that the repository is publicly accessible.
  2. **Live Deployed Application:** Deploy the production build to a public HTTPS URL (Vercel / Netlify / GitHub Pages) and test the complete user journey (Region Explorer -> Sparse Comparator -> Evidence Filter -> Glossary -> Quiz -> Synthetic TTS Playback -> Local Contribution & JSON Export -> Reset) on desktop and mobile viewports.
  3. **3–5 Minute Explanation Video:** Record the actual screen-cast + voiceover demonstrating the live deployed URL (do not submit a text script in place of a video). Verify the video link works in an Incognito window without login prompts.
- **Acceptance Criteria:** All four required hackathon submission artifacts exist, match one another, and are independently verified prior to **31 October 2026, 10:00 PM IST**.
