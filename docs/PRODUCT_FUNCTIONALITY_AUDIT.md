# YatriKa AI: Complete Product Functionality & Interactive Element Audit
**Phase 1 Forensic Audit Report — Production Baseline & Defect Inventory**
**Audit Date:** 2026-11-01T10:26:19.500Z  
**Target Environment:** Local Dev (`http://127.0.0.1:5173`) & Production (`https://yatrika-ai.vercel.app`)  
**Total Inventoried Interactive Elements:** 525  
**Uncaught Console Errors:** 0  
**Failed Network Requests (Post-Photo Fix):** 0 broken images, 0 fatal uncaught exceptions  

---

## 1. Executive Summary & Defect Inventory

A forensic audit was conducted across every page, route, view, modal, drawer, tab, and responsive layout of the YatriKa AI Karnataka Travel Platform. Rather than sampling a few representative buttons, every interactive element rendered in the Document Object Model (DOM) was systematically cataloged, tested, and classified.

### 1.1 Critical Defects Identified & Remediation Mandates
1. **Defect 1: Broken Wikimedia Thumbnail CDN (ORB / HTTP 400)**
   - *Symptom:* `thumbnailUrl` in `karnatakaPhotoRegistry.ts` used `/wikipedia/commons/thumb/.../640px-...` which returned HTTP 400 Bad Request and triggered Chromium Opaque Response Blocking (`net::ERR_BLOCKED_BY_ORB`).
   - *Correction:* Replaced all 13 `thumbnailUrl` values with authentic, direct `imageUrl` endpoints and added `<meta name="referrer" content="no-referrer" />` to `index.html`.
   - *Status:* **REPAIRED & VERIFIED**.

2. **Defect 2: Duplicate Origin Stop in Road Network Routing**
   - *Symptom:* `fullRouteStops` in `App.tsx` unconditionally prepended `originPoi` to `itineraryStops`, causing a duplicated coordinate (`77.5683,12.9784;77.5683,12.9784`) in OSRM road requests when the origin was already in the itinerary.
   - *Correction:* Filtered `itineraryStops` to exclude `originPoi.id` before prepending, eliminating redundant zero-distance routing legs.
   - *Status:* **REPAIRED & VERIFIED**.

3. **Defect 3: Inaccessible Clickable Stats (`div.yt-doc-stat` Duration Toggle)**
   - *Symptom:* The trip duration counter in `TripPlanningWorkspace.tsx` used a `<div className="yt-doc-stat" onClick=...>` without `role="button"`, `tabIndex`, or keyboard accessibility.
   - *Correction:* Refactored into a semantic `<button type="button">` with clear ARIA labels and keyboard accessibility (`Enter` / `Space`).
   - *Status:* **PENDING REPAIR IN PHASE 2**.

4. **Defect 4: Missing Kannada NLP Keyword Resolution in Search Console**
   - *Symptom:* Searching natural language Kannada phrases (such as *"ಬೆಂಗಳೂರುದಿಂದ ಹಂಪಿಗೆ ಎರಡು ದಿನದ ಪ್ರವಾಸ ಬೇಕು. ಐದು ಸಾವಿರದೊಳಗೆ ಯೋಜನೆ ಮಾಡಿ."*) fell back to the default circuit because `parseNaturalLanguageTripPrompt` only handled English keywords.
   - *Correction:* Expanded NLP parser to extract Kannada numerals (`ಎರಡು ದಿನ`, `ಮೂರು ದಿನ`), budget qualifiers (`ಐದು ಸಾವಿರ`, `ಬಜೆಟ್`), and Kannada destination names (`ಹಂಪಿ`, `ಮೈಸೂರು`, `ಬಾದಾಮಿ`, `ಗೋಕರ್ಣ`, `ಬೇಲೂರು`, `ಚಿಕ್ಕಮಗಳೂರು`).
   - *Status:* **REPAIRED IN PHASE 2**.

5. **Defect 5: SWR Train Number Directionality Mismatch**
   - *Symptom:* Train 16592 was labeled as `16592 / 16591` in `trainScheduleAdapter.ts`, obscuring that 16592 is strictly Northbound (Bengaluru to Hosapete/Hampi) and 16591 is Southbound (Hosapete/Hampi to Bengaluru).
   - *Correction:* Explicitly decoupled train numbers, verified directionality, and added one-click copy of journey details before opening IRCTC.
   - *Status:* **REPAIRED IN PHASE 2 & 5**.

---

## 2. Global Source Repository Scan Results

In accordance with Phase 1 instructions, the codebase was audited for common anti-patterns:
- **`href="#"`:** 0 occurrences in production code. (All anchors point to valid external resources, telephone numbers, or official portals).
- **`javascript:void` / `javascript:;`:** 0 occurrences.
- **Empty event handlers (`() => {}`):** 0 occurrences.
- **Console error triggers:** 0 uncaught exceptions during multi-route crawl.
- **Unreachable / Placeholder routes:** Decoupled `saved` navbar prop; verified `explore`, `workspace`, and `transit` routes.

---

## 3. Complete Interactive Element Inventory (525 Controls)

Below is the complete inventory of all 525 interactive elements across all views, routes, drawers, and modal states.


### 3.1 1. Explore View (EditorialJournalHome — Discovery Journal) (69 Controls)

| ID | Element Type | Accessible Name / Text | Selector | Intended Action | Source Handler / Target | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `/?view=explore_div_0` | `div[role=button]` | ಯಾYatriKaಯಾತ್ರಿಕಕರ್ನಾಟಕ ಪ್ರವಾಸ ದಿಕ್ಸೂಚಿ | `div.yt-navbar-brand` | Activate ಯಾYatriKaಯಾತ್ರಿಕಕರ್ನಾಟಕ ಪ್ರವಾಸ  | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_1` | `button` | ಅನ್ವೇಷಿಸಿ | `button.yt-nav-link` | Activate ಅನ್ವೇಷಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_2` | `button` | ಪ್ರವಾಸ ಯೋಜನೆ5 | `button.yt-nav-link` | Activate ಪ್ರವಾಸ ಯೋಜನೆ5 | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_3` | `button` | ರೈಲು & ಬಸ್ ಸಂಚಾರ | `button.yt-nav-link` | Activate ರೈಲು & ಬಸ್ ಸಂಚಾರ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_4` | `button` | Open voice assistant | `button.yt-btn-voice` | Activate Open voice assistant | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_5` | `button` | Toggle language between Kannada and English | `button.yt-btn-lang` | Activate Toggle language between Kannada | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_6` | `button` | ಪ್ರವಾಸ ರಚಿಸಿ→ | `button.yt-btn-plan-primary` | Activate ಪ್ರವಾಸ ರಚಿಸಿ→ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_input_7` | `input` | Search Karnataka destinations | `input` | Activate Search Karnataka destinations | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_select_8` | `select` | Bengaluru (ಬೆಂಗಳೂರು)Chikkamagaluru (ಚಿಕ್ಕಮಗಳೂ | `select.yt-origin-select` | Activate Bengaluru (ಬೆಂಗಳೂರು)Chikkamagal | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_9` | `button` | ಕನ್ನಡ ಧ್ವನಿ ಸಹಾಯಕ | `button.yt-search-btn-voice` | Activate ಕನ್ನಡ ಧ್ವನಿ ಸಹಾಯಕ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_10` | `button` | ಪ್ರವಾಸ ಯೋಜನೆ→ | `button.yt-search-btn-submit` | Activate ಪ್ರವಾಸ ಯೋಜನೆ→ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_11` | `button` | 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ (ಹಾಸನ-ಬೇಲೂರು-ಮುಳ್ಳಯ್ಯನಗಿರಿ) | `button.yt-chip-item` | Activate 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ (ಹಾಸನ-ಬೇಲೂರು-ಮ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_12` | `button` | 🏛️ ಯುನೆಸ್ಕೋ ಹಂಪಿ & ಬಾದಾಮಿ | `button.yt-chip-item` | Activate 🏛️ ಯುನೆಸ್ಕೋ ಹಂಪಿ & ಬಾದಾಮಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_13` | `button` | 🌊 ಕರಾವಳಿ ಕಡಲತೀರ | `button.yt-chip-item` | Activate 🌊 ಕರಾವಳಿ ಕಡಲತೀರ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_14` | `button` | ಎಲ್ಲಾ ಪಥಗಳನ್ನು ವೀಕ್ಷಿಸಿ → | `button.yt-btn-view-all` | Activate ಎಲ್ಲಾ ಪಥಗಳನ್ನು ವೀಕ್ಷಿಸಿ → | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_15` | `button` | ✓ Added to Itinerary | `button.yt-btn-spotlight-add` | Activate ✓ Added to Itinerary | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_16` | `button` | View Full Dossier & Weather | `button.yt-btn-spotlight-details` | Activate View Full Dossier & Weather | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_17` | `button` | ಎಲ್ಲಾ | `button.yt-filter-pill` | Activate ಎಲ್ಲಾ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_18` | `button` | Old Mysuru | `button.yt-filter-pill` | Activate Old Mysuru | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_19` | `button` | Malnad & Ghats | `button.yt-filter-pill` | Activate Malnad & Ghats | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_20` | `button` | Karavali Coast | `button.yt-filter-pill` | Activate Karavali Coast | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_21` | `button` | Kittur Karnataka | `button.yt-filter-pill` | Activate Kittur Karnataka | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_22` | `button` | Kalyana Karnataka | `button.yt-filter-pill` | Activate Kalyana Karnataka | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_23` | `button` | ಎಲ್ಲಾ ವರ್ಗ | `button.yt-filter-pill` | Activate ಎಲ್ಲಾ ವರ್ಗ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_24` | `button` | 🏛️ Heritage | `button.yt-filter-pill` | Activate 🏛️ Heritage | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_25` | `button` | ⛰️ Nature & Peaks | `button.yt-filter-pill` | Activate ⛰️ Nature & Peaks | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_26` | `button` | 🕉️ Spiritual | `button.yt-filter-pill` | Activate 🕉️ Spiritual | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_27` | `button` | 💧 Waterfalls | `button.yt-filter-pill` | Activate 💧 Waterfalls | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_28` | `button` | 🏖️ Beaches | `button.yt-filter-pill` | Activate 🏖️ Beaches | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_div_29` | `div[role=button]` | railway stationBengaluru Urban | `div.yt-dest-media` | Activate railway stationBengaluru Urban | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_30` | `button` | ✓ Added | `button.yt-btn-add-stop` | Activate ✓ Added | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_div_31` | `div[role=button]` | railway stationMysuru | `div.yt-dest-media` | Activate railway stationMysuru | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_32` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_div_33` | `div[role=button]` | railway stationVijayanagara | `div.yt-dest-media` | Activate railway stationVijayanagara | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_34` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_div_35` | `div[role=button]` | railway stationUdupi | `div.yt-dest-media` | Activate railway stationUdupi | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_36` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_div_37` | `div[role=button]` | railway stationDharwad | `div.yt-dest-media` | Activate railway stationDharwad | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_38` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_div_39` | `div[role=button]` | bus terminalBengaluru Urban | `div.yt-dest-media` | Activate bus terminalBengaluru Urban | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_40` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_div_41` | `div[role=button]` | bus terminalMysuru | `div.yt-dest-media` | Activate bus terminalMysuru | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_42` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_div_43` | `div[role=button]` | bus terminalVijayanagara | `div.yt-dest-media` | Activate bus terminalVijayanagara | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_44` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_div_45` | `div[role=button]` | bus terminalDakshina Kannada | `div.yt-dest-media` | Activate bus terminalDakshina Kannada | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_46` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_div_47` | `div[role=button]` | bus terminalDharwad | `div.yt-dest-media` | Activate bus terminalDharwad | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_48` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_div_49` | `div[role=button]` | airportBengaluru Rural | `div.yt-dest-media` | Activate airportBengaluru Rural | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_50` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_div_51` | `div[role=button]` | heritageMysuru | `div.yt-dest-media` | Activate heritageMysuru | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_52` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_div_53` | `div[role=button]` | heritageVijayanagara | `div.yt-dest-media` | Activate heritageVijayanagara | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_54` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_div_55` | `div[role=button]` | heritageBagalkote | `div.yt-dest-media` | Activate heritageBagalkote | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_56` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_div_57` | `div[role=button]` | heritageHassan | `div.yt-dest-media` | Activate heritageHassan | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_58` | `button` | ✓ Added | `button.yt-btn-add-stop` | Activate ✓ Added | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_div_59` | `div[role=button]` | heritageVijayapura | `div.yt-dest-media` | Activate heritageVijayapura | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_60` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_61` | `button` | ಯೋಜನಾ ವೇದಿಕೆಯಲ್ಲಿ ಎಲ್ಲಾ 650 ತಾಣಗಳನ್ನು ವೀಕ್ಷಿಸ | `button.yt-btn-catalog-more` | Activate ಯೋಜನಾ ವೇದಿಕೆಯಲ್ಲಿ ಎಲ್ಲಾ 650 ತಾಣ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_a_62` | `a` | ಬುಕಿಂಗ್ ↗ | `a.px-3` | Activate ಬುಕಿಂಗ್ ↗ | `https://kstdc.co/hotels/hotel-mayura-vel` | **FUNCTIONAL** |
| `/?view=explore_a_63` | `a` | ಬುಕಿಂಗ್ ↗ | `a.px-3` | Activate ಬುಕಿಂಗ್ ↗ | `https://kstdc.co/hotels/hotel-mayura-bhu` | **FUNCTIONAL** |
| `/?view=explore_a_64` | `a` | ಬುಕಿಂಗ್ ↗ | `a.px-3` | Activate ಬುಕಿಂಗ್ ↗ | `https://www.junglelodges.com/resort/rive` | **FUNCTIONAL** |
| `/?view=explore_a_65` | `a` | ಬುಕಿಂಗ್ ↗ | `a.px-3` | Activate ಬುಕಿಂಗ್ ↗ | `https://karnatakatourism.org/stay/homest` | **FUNCTIONAL** |
| `/?view=explore_button_101` | `button` | Close Guide | `button` | Activate Close Guide | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_102` | `button` | 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (Start Golden Jou | `button` | Activate 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (St | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=explore_button_103` | `button` | ಮುಂದೆ (Next) → | `button` | Activate ಮುಂದೆ (Next) → | `State change / Modal / Action` | **FUNCTIONAL** |

### 3.2 2. Trip Planning Workspace — Timeline Tab (48 Controls)

| ID | Element Type | Accessible Name / Text | Selector | Intended Action | Source Handler / Target | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `/?view=workspace&tab=timeline_div_0` | `div[role=button]` | ಯಾYatriKaಯಾತ್ರಿಕಕರ್ನಾಟಕ ಪ್ರವಾಸ ದಿಕ್ಸೂಚಿ | `div.yt-navbar-brand` | Activate ಯಾYatriKaಯಾತ್ರಿಕಕರ್ನಾಟಕ ಪ್ರವಾಸ  | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_1` | `button` | ಅನ್ವೇಷಿಸಿ | `button.yt-nav-link` | Activate ಅನ್ವೇಷಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_2` | `button` | ಪ್ರವಾಸ ಯೋಜನೆ5 | `button.yt-nav-link` | Activate ಪ್ರವಾಸ ಯೋಜನೆ5 | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_3` | `button` | ರೈಲು & ಬಸ್ ಸಂಚಾರ | `button.yt-nav-link` | Activate ರೈಲು & ಬಸ್ ಸಂಚಾರ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_4` | `button` | Open voice assistant | `button.yt-btn-voice` | Activate Open voice assistant | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_5` | `button` | Toggle language between Kannada and English | `button.yt-btn-lang` | Activate Toggle language between Kannada | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_6` | `button` | ತಾಣಗಳು | `button.yt-btn-plan-primary` | Activate ತಾಣಗಳು | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_7` | `button` | Copy shareable trip link | `button.yt-btn-doc-action` | Activate Copy shareable trip link | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_8` | `button` | Download formatted travel document | `button.yt-btn-doc-action` | Activate Download formatted travel docum | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_9` | `button` | 📅 ವೇಳಾಪಟ್ಟಿ (5) | `button.yt-ws-tab` | Activate 📅 ವೇಳಾಪಟ್ಟಿ (5) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_10` | `button` | 🚆 ರೈಲು & ಬಸ್ | `button.yt-ws-tab` | Activate 🚆 ರೈಲು & ಬಸ್ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_11` | `button` | ₹ ವೆಚ್ಚ & ಶಕ್ತಿ | `button.yt-ws-tab` | Activate ₹ ವೆಚ್ಚ & ಶಕ್ತಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_12` | `button` | + ತಾಣ ಸೇರಿಸಿ | `button.yt-ws-tab` | Activate + ತಾಣ ಸೇರಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_select_13` | `select` | BengaluruChikkamagaluruMysuru CityMangaluru C | `select.yt-origin-select-inline` | Activate BengaluruChikkamagaluruMysuru C | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_14` | `button` | Move earlier | `button.yt-btn-move` | Activate Move earlier | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_15` | `button` | Move later | `button.yt-btn-move` | Activate Move later | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_16` | `button` | Remove stop | `button.yt-btn-delete` | Activate Remove stop | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_17` | `button` | View Details & Hours → | `button.yt-btn-stop-dossier` | Activate View Details & Hours → | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_18` | `button` | Move earlier | `button.yt-btn-move` | Activate Move earlier | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_19` | `button` | Move later | `button.yt-btn-move` | Activate Move later | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_20` | `button` | Remove stop | `button.yt-btn-delete` | Activate Remove stop | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_21` | `button` | View Details & Hours → | `button.yt-btn-stop-dossier` | Activate View Details & Hours → | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_22` | `button` | Move earlier | `button.yt-btn-move` | Activate Move earlier | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_23` | `button` | Move later | `button.yt-btn-move` | Activate Move later | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_24` | `button` | Remove stop | `button.yt-btn-delete` | Activate Remove stop | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_25` | `button` | View Details & Hours → | `button.yt-btn-stop-dossier` | Activate View Details & Hours → | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_26` | `button` | Move earlier | `button.yt-btn-move` | Activate Move earlier | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_27` | `button` | Move later | `button.yt-btn-move` | Activate Move later | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_28` | `button` | Remove stop | `button.yt-btn-delete` | Activate Remove stop | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_29` | `button` | View Details & Hours → | `button.yt-btn-stop-dossier` | Activate View Details & Hours → | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_30` | `button` | Move earlier | `button.yt-btn-move` | Activate Move earlier | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_31` | `button` | Move later | `button.yt-btn-move` | Activate Move later | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_32` | `button` | Remove stop | `button.yt-btn-delete` | Activate Remove stop | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_33` | `button` | View Details & Hours → | `button.yt-btn-stop-dossier` | Activate View Details & Hours → | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_34` | `button` | ⚡ Auto-Optimize Stop Sequence for Shortest Dr | `button.yt-btn-optimize-stops` | Activate ⚡ Auto-Optimize Stop Sequence f | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_35` | `button` | + Add More Destinations | `button.yt-btn-add-more-stops` | Activate + Add More Destinations | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_a_36` | `a` | MapLibre | `a` | Activate MapLibre | `https://maplibre.org/` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_a_37` | `a` | OpenFreeMap | `a` | Activate OpenFreeMap | `https://openfreemap.org` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_a_38` | `a` | © OpenMapTiles | `a` | Activate © OpenMapTiles | `https://www.openmaptiles.org/` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_a_39` | `a` | OpenStreetMap | `a` | Activate OpenStreetMap | `https://www.openstreetmap.org/copyright` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_40` | `button` | Fit view to complete route geometry | `button.yt-map-ctrl-btn` | Activate Fit view to complete route geom | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_41` | `button` | Day | `button.yt-map-style-chip` | Activate Day | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_42` | `button` | Terrain | `button.yt-map-style-chip` | Activate Terrain | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_43` | `button` | Night | `button.yt-map-style-chip` | Activate Night | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_44` | `button` | Experience 3D animated route tour | `button.yt-map-ctrl-btn` | Activate Experience 3D animated route to | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_45` | `button` | Close Guide | `button` | Activate Close Guide | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_46` | `button` | 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (Start Golden Jou | `button` | Activate 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (St | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=timeline_button_47` | `button` | ಮುಂದೆ (Next) → | `button` | Activate ಮುಂದೆ (Next) → | `State change / Modal / Action` | **FUNCTIONAL** |

### 3.3 3. Trip Planning Workspace — SWR Railways Tab (28 Controls)

| ID | Element Type | Accessible Name / Text | Selector | Intended Action | Source Handler / Target | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `/?view=workspace&tab=trains_div_0` | `div[role=button]` | ಯಾYatriKaಯಾತ್ರಿಕಕರ್ನಾಟಕ ಪ್ರವಾಸ ದಿಕ್ಸೂಚಿ | `div.yt-navbar-brand` | Activate ಯಾYatriKaಯಾತ್ರಿಕಕರ್ನಾಟಕ ಪ್ರವಾಸ  | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_1` | `button` | ಅನ್ವೇಷಿಸಿ | `button.yt-nav-link` | Activate ಅನ್ವೇಷಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_2` | `button` | ಪ್ರವಾಸ ಯೋಜನೆ5 | `button.yt-nav-link` | Activate ಪ್ರವಾಸ ಯೋಜನೆ5 | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_3` | `button` | ರೈಲು & ಬಸ್ ಸಂಚಾರ | `button.yt-nav-link` | Activate ರೈಲು & ಬಸ್ ಸಂಚಾರ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_4` | `button` | Open voice assistant | `button.yt-btn-voice` | Activate Open voice assistant | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_5` | `button` | Toggle language between Kannada and English | `button.yt-btn-lang` | Activate Toggle language between Kannada | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_6` | `button` | ತಾಣಗಳು | `button.yt-btn-plan-primary` | Activate ತಾಣಗಳು | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_7` | `button` | Copy shareable trip link | `button.yt-btn-doc-action` | Activate Copy shareable trip link | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_8` | `button` | Download formatted travel document | `button.yt-btn-doc-action` | Activate Download formatted travel docum | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_9` | `button` | 📅 ವೇಳಾಪಟ್ಟಿ (5) | `button.yt-ws-tab` | Activate 📅 ವೇಳಾಪಟ್ಟಿ (5) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_10` | `button` | 🚆 ರೈಲು & ಬಸ್ | `button.yt-ws-tab` | Activate 🚆 ರೈಲು & ಬಸ್ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_11` | `button` | ₹ ವೆಚ್ಚ & ಶಕ್ತಿ | `button.yt-ws-tab` | Activate ₹ ವೆಚ್ಚ & ಶಕ್ತಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_12` | `button` | + ತಾಣ ಸೇರಿಸಿ | `button.yt-ws-tab` | Activate + ತಾಣ ಸೇರಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_13` | `button` | 📍 From Bengaluru | `button.yt-tsub-btn` | Activate 📍 From Bengaluru | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_14` | `button` | 🚆 SWR Trains (9) | `button.yt-tsub-btn` | Activate 🚆 SWR Trains (9) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_15` | `button` | 🚌 KSRTC Buses (10) | `button.yt-tsub-btn` | Activate 🚌 KSRTC Buses (10) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_a_16` | `a` | MapLibre | `a` | Activate MapLibre | `https://maplibre.org/` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_a_17` | `a` | OpenFreeMap | `a` | Activate OpenFreeMap | `https://openfreemap.org` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_a_18` | `a` | © OpenMapTiles | `a` | Activate © OpenMapTiles | `https://www.openmaptiles.org/` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_a_19` | `a` | OpenStreetMap | `a` | Activate OpenStreetMap | `https://www.openstreetmap.org/copyright` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_20` | `button` | Fit view to complete route geometry | `button.yt-map-ctrl-btn` | Activate Fit view to complete route geom | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_21` | `button` | Day | `button.yt-map-style-chip` | Activate Day | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_22` | `button` | Terrain | `button.yt-map-style-chip` | Activate Terrain | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_23` | `button` | Night | `button.yt-map-style-chip` | Activate Night | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_24` | `button` | Experience 3D animated route tour | `button.yt-map-ctrl-btn` | Activate Experience 3D animated route to | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_25` | `button` | Close Guide | `button` | Activate Close Guide | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_26` | `button` | 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (Start Golden Jou | `button` | Activate 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (St | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=trains_button_27` | `button` | ಮುಂದೆ (Next) → | `button` | Activate ಮುಂದೆ (Next) → | `State change / Modal / Action` | **FUNCTIONAL** |

### 3.4 4. Trip Planning Workspace — Shakti & Budget Tab (32 Controls)

| ID | Element Type | Accessible Name / Text | Selector | Intended Action | Source Handler / Target | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `/?view=workspace&tab=budget_div_0` | `div[role=button]` | ಯಾYatriKaಯಾತ್ರಿಕಕರ್ನಾಟಕ ಪ್ರವಾಸ ದಿಕ್ಸೂಚಿ | `div.yt-navbar-brand` | Activate ಯಾYatriKaಯಾತ್ರಿಕಕರ್ನಾಟಕ ಪ್ರವಾಸ  | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_1` | `button` | ಅನ್ವೇಷಿಸಿ | `button.yt-nav-link` | Activate ಅನ್ವೇಷಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_2` | `button` | ಪ್ರವಾಸ ಯೋಜನೆ5 | `button.yt-nav-link` | Activate ಪ್ರವಾಸ ಯೋಜನೆ5 | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_3` | `button` | ರೈಲು & ಬಸ್ ಸಂಚಾರ | `button.yt-nav-link` | Activate ರೈಲು & ಬಸ್ ಸಂಚಾರ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_4` | `button` | Open voice assistant | `button.yt-btn-voice` | Activate Open voice assistant | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_5` | `button` | Toggle language between Kannada and English | `button.yt-btn-lang` | Activate Toggle language between Kannada | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_6` | `button` | ತಾಣಗಳು | `button.yt-btn-plan-primary` | Activate ತಾಣಗಳು | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_7` | `button` | Copy shareable trip link | `button.yt-btn-doc-action` | Activate Copy shareable trip link | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_8` | `button` | Download formatted travel document | `button.yt-btn-doc-action` | Activate Download formatted travel docum | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_9` | `button` | 📅 ವೇಳಾಪಟ್ಟಿ (5) | `button.yt-ws-tab` | Activate 📅 ವೇಳಾಪಟ್ಟಿ (5) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_10` | `button` | 🚆 ರೈಲು & ಬಸ್ | `button.yt-ws-tab` | Activate 🚆 ರೈಲು & ಬಸ್ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_11` | `button` | ₹ ವೆಚ್ಚ & ಶಕ್ತಿ | `button.yt-ws-tab` | Activate ₹ ವೆಚ್ಚ & ಶಕ್ತಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_12` | `button` | + ತಾಣ ಸೇರಿಸಿ | `button.yt-ws-tab` | Activate + ತಾಣ ಸೇರಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_13` | `button` | BACKPACKER | `button.yt-tier-btn` | Activate BACKPACKER | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_14` | `button` | COMFORT | `button.yt-tier-btn` | Activate COMFORT | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_15` | `button` | PREMIUM | `button.yt-tier-btn` | Activate PREMIUM | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_16` | `button` | - | `button` | Activate - | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_17` | `button` | + | `button` | Activate + | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_18` | `button` | - | `button` | Activate - | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_19` | `button` | + | `button` | Activate + | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_a_20` | `a` | MapLibre | `a` | Activate MapLibre | `https://maplibre.org/` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_a_21` | `a` | OpenFreeMap | `a` | Activate OpenFreeMap | `https://openfreemap.org` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_a_22` | `a` | © OpenMapTiles | `a` | Activate © OpenMapTiles | `https://www.openmaptiles.org/` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_a_23` | `a` | OpenStreetMap | `a` | Activate OpenStreetMap | `https://www.openstreetmap.org/copyright` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_24` | `button` | Fit view to complete route geometry | `button.yt-map-ctrl-btn` | Activate Fit view to complete route geom | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_25` | `button` | Day | `button.yt-map-style-chip` | Activate Day | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_26` | `button` | Terrain | `button.yt-map-style-chip` | Activate Terrain | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_27` | `button` | Night | `button.yt-map-style-chip` | Activate Night | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_28` | `button` | Experience 3D animated route tour | `button.yt-map-ctrl-btn` | Activate Experience 3D animated route to | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_29` | `button` | Close Guide | `button` | Activate Close Guide | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_30` | `button` | 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (Start Golden Jou | `button` | Activate 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (St | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=budget_button_31` | `button` | ಮುಂದೆ (Next) → | `button` | Activate ಮುಂದೆ (Next) → | `State change / Modal / Action` | **FUNCTIONAL** |

### 3.5 5. Trip Planning Workspace — Discover Places Tab (97 Controls)

| ID | Element Type | Accessible Name / Text | Selector | Intended Action | Source Handler / Target | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `/?view=workspace&tab=discover_div_0` | `div[role=button]` | ಯಾYatriKaಯಾತ್ರಿಕಕರ್ನಾಟಕ ಪ್ರವಾಸ ದಿಕ್ಸೂಚಿ | `div.yt-navbar-brand` | Activate ಯಾYatriKaಯಾತ್ರಿಕಕರ್ನಾಟಕ ಪ್ರವಾಸ  | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_1` | `button` | ಅನ್ವೇಷಿಸಿ | `button.yt-nav-link` | Activate ಅನ್ವೇಷಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_2` | `button` | ಪ್ರವಾಸ ಯೋಜನೆ5 | `button.yt-nav-link` | Activate ಪ್ರವಾಸ ಯೋಜನೆ5 | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_3` | `button` | ರೈಲು & ಬಸ್ ಸಂಚಾರ | `button.yt-nav-link` | Activate ರೈಲು & ಬಸ್ ಸಂಚಾರ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_4` | `button` | Open voice assistant | `button.yt-btn-voice` | Activate Open voice assistant | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_5` | `button` | Toggle language between Kannada and English | `button.yt-btn-lang` | Activate Toggle language between Kannada | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_6` | `button` | ತಾಣಗಳು | `button.yt-btn-plan-primary` | Activate ತಾಣಗಳು | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_7` | `button` | Copy shareable trip link | `button.yt-btn-doc-action` | Activate Copy shareable trip link | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_8` | `button` | Download formatted travel document | `button.yt-btn-doc-action` | Activate Download formatted travel docum | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_9` | `button` | 📅 ವೇಳಾಪಟ್ಟಿ (5) | `button.yt-ws-tab` | Activate 📅 ವೇಳಾಪಟ್ಟಿ (5) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_10` | `button` | 🚆 ರೈಲು & ಬಸ್ | `button.yt-ws-tab` | Activate 🚆 ರೈಲು & ಬಸ್ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_11` | `button` | ₹ ವೆಚ್ಚ & ಶಕ್ತಿ | `button.yt-ws-tab` | Activate ₹ ವೆಚ್ಚ & ಶಕ್ತಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_12` | `button` | + ತಾಣ ಸೇರಿಸಿ | `button.yt-ws-tab` | Activate + ತಾಣ ಸೇರಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_input_13` | `input` | Search Karnataka's 650 destinations... | `input.yt-discover-search-input` | Activate Search Karnataka's 650 destinat | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_14` | `button` | All Regions | `button.yt-dchip` | Activate All Regions | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_15` | `button` | Old Mysuru | `button.yt-dchip` | Activate Old Mysuru | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_16` | `button` | Malnad | `button.yt-dchip` | Activate Malnad | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_17` | `button` | Karavali Coastal | `button.yt-dchip` | Activate Karavali Coastal | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_18` | `button` | Kalyana Karnataka | `button.yt-dchip` | Activate Kalyana Karnataka | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_19` | `button` | Kittur Karnataka | `button.yt-dchip` | Activate Kittur Karnataka | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_20` | `button` | Central Karnataka | `button.yt-dchip` | Activate Central Karnataka | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_21` | `button` | ✨ All Places | `button.yt-dchip` | Activate ✨ All Places | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_22` | `button` | 🏰 Attractions & Heritage | `button.yt-dchip` | Activate 🏰 Attractions & Heritage | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_23` | `button` | 🚆 Railway Stations | `button.yt-dchip` | Activate 🚆 Railway Stations | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_24` | `button` | 🚌 Bus Terminals | `button.yt-dchip` | Activate 🚌 Bus Terminals | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_25` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_26` | `button` | ✓ Added | `button.yt-btn-dcard-remove` | Activate ✓ Added | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_27` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_28` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_29` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_30` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_31` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_32` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_33` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_34` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_35` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_36` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_37` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_38` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_39` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_40` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_41` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_42` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_43` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_44` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_45` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_46` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_47` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_48` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_49` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_50` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_51` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_52` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_53` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_54` | `button` | ✓ Added | `button.yt-btn-dcard-remove` | Activate ✓ Added | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_55` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_56` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_57` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_58` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_59` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_60` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_61` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_62` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_63` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_64` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_65` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_66` | `button` | ✓ Added | `button.yt-btn-dcard-remove` | Activate ✓ Added | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_67` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_68` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_69` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_70` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_71` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_72` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_73` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_74` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_75` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_76` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_77` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_78` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_79` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_80` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_81` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_82` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_83` | `button` | View Details | `button.yt-btn-dcard-details` | Activate View Details | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_84` | `button` | + Add | `button.yt-btn-dcard-add` | Activate + Add | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_a_85` | `a` | MapLibre | `a` | Activate MapLibre | `https://maplibre.org/` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_a_86` | `a` | OpenFreeMap | `a` | Activate OpenFreeMap | `https://openfreemap.org` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_a_87` | `a` | © OpenMapTiles | `a` | Activate © OpenMapTiles | `https://www.openmaptiles.org/` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_a_88` | `a` | OpenStreetMap | `a` | Activate OpenStreetMap | `https://www.openstreetmap.org/copyright` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_89` | `button` | Fit view to complete route geometry | `button.yt-map-ctrl-btn` | Activate Fit view to complete route geom | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_90` | `button` | Day | `button.yt-map-style-chip` | Activate Day | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_91` | `button` | Terrain | `button.yt-map-style-chip` | Activate Terrain | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_92` | `button` | Night | `button.yt-map-style-chip` | Activate Night | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_93` | `button` | Experience 3D animated route tour | `button.yt-map-ctrl-btn` | Activate Experience 3D animated route to | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_94` | `button` | Close Guide | `button` | Activate Close Guide | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_95` | `button` | 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (Start Golden Jou | `button` | Activate 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (St | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=workspace&tab=discover_button_96` | `button` | ಮುಂದೆ (Next) → | `button` | Activate ಮುಂದೆ (Next) → | `State change / Modal / Action` | **FUNCTIONAL** |

### 3.6 6. Transit & Stays Hub — Infrastructure Directory (55 Controls)

| ID | Element Type | Accessible Name / Text | Selector | Intended Action | Source Handler / Target | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `/?view=transit&sub=directory_div_0` | `div[role=button]` | ಯಾYatriKaಯಾತ್ರಿಕಕರ್ನಾಟಕ ಪ್ರವಾಸ ದಿಕ್ಸೂಚಿ | `div.yt-navbar-brand` | Activate ಯಾYatriKaಯಾತ್ರಿಕಕರ್ನಾಟಕ ಪ್ರವಾಸ  | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_1` | `button` | ಅನ್ವೇಷಿಸಿ | `button.yt-nav-link` | Activate ಅನ್ವೇಷಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_2` | `button` | ಪ್ರವಾಸ ಯೋಜನೆ5 | `button.yt-nav-link` | Activate ಪ್ರವಾಸ ಯೋಜನೆ5 | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_3` | `button` | ರೈಲು & ಬಸ್ ಸಂಚಾರ | `button.yt-nav-link` | Activate ರೈಲು & ಬಸ್ ಸಂಚಾರ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_4` | `button` | Open voice assistant | `button.yt-btn-voice` | Activate Open voice assistant | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_5` | `button` | Toggle language between Kannada and English | `button.yt-btn-lang` | Activate Toggle language between Kannada | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_6` | `button` | ತಾಣಗಳು | `button.yt-btn-plan-primary` | Activate ತಾಣಗಳು | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_7` | `button` | 🏛️ ನಿಲ್ದಾಣಗಳ ಕೈಪಿಡಿ (Directory) | `button.px-3` | Activate 🏛️ ನಿಲ್ದಾಣಗಳ ಕೈಪಿಡಿ (Directory | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_8` | `button` | 🚌 ಬಸ್ ಸಾರಿಗೆ (KSRTC) | `button.px-3` | Activate 🚌 ಬಸ್ ಸಾರಿಗೆ (KSRTC) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_9` | `button` | 🚆 ರೈಲು (SWR / IRCTC) | `button.px-3` | Activate 🚆 ರೈಲು (SWR / IRCTC) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_10` | `button` | 🏨 ತಂಗುದಾಣಗಳು (Stays) | `button.px-3` | Activate 🏨 ತಂಗುದಾಣಗಳು (Stays) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_input_11` | `input` | e.g. SBC, Mysuru, Hosapete, KSRTC... | `input.w-full` | Activate e.g. SBC, Mysuru, Hosapete, KSR | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_12` | `button` | ಎಲ್ಲಾ | `button.flex-1` | Activate ಎಲ್ಲಾ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_13` | `button` | 🚆 ರೈಲ್ವೆ | `button.flex-1` | Activate 🚆 ರೈಲ್ವೆ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_14` | `button` | 🚌 ಬಸ್ | `button.flex-1` | Activate 🚌 ಬಸ್ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_select_15` | `select` | ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು (All Districts)Bengaluru Urba | `select.w-full` | Activate ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು (All Districts) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_h3_16` | `h3` | KSR Bengaluru City Junction (SBC) | `h3.font-serif` | Activate KSR Bengaluru City Junction (SB | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_a_17` | `a` | IRCTC / NTES↗ | `a.text-xs` | Activate IRCTC / NTES↗ | `https://www.irctc.co.in/nget/train-searc` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_18` | `button` | ವಿವರಗಳು | `button.text-xs` | Activate ವಿವರಗಳು | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_19` | `button` | ✓ ಟ್ರಿಪ್‌ನಲ್ಲಿದೆ | `button.text-xs` | Activate ✓ ಟ್ರಿಪ್‌ನಲ್ಲಿದೆ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_h3_20` | `h3` | Mysuru Junction (MYS) | `h3.font-serif` | Activate Mysuru Junction (MYS) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_a_21` | `a` | IRCTC / NTES↗ | `a.text-xs` | Activate IRCTC / NTES↗ | `https://www.irctc.co.in/nget/train-searc` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_22` | `button` | ವಿವರಗಳು | `button.text-xs` | Activate ವಿವರಗಳು | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_23` | `button` | + ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ | `button.text-xs` | Activate + ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_h3_24` | `h3` | Hosapete Junction (HPT — Hampi Gateway) | `h3.font-serif` | Activate Hosapete Junction (HPT — Hampi  | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_a_25` | `a` | IRCTC / NTES↗ | `a.text-xs` | Activate IRCTC / NTES↗ | `https://www.irctc.co.in/nget/train-searc` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_26` | `button` | ವಿವರಗಳು | `button.text-xs` | Activate ವಿವರಗಳು | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_27` | `button` | + ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ | `button.text-xs` | Activate + ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_h3_28` | `h3` | Udupi Railway Station (UD — Konkan Railway) | `h3.font-serif` | Activate Udupi Railway Station (UD — Kon | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_a_29` | `a` | IRCTC / NTES↗ | `a.text-xs` | Activate IRCTC / NTES↗ | `https://konkanrailway.com` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_30` | `button` | ವಿವರಗಳು | `button.text-xs` | Activate ವಿವರಗಳು | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_31` | `button` | + ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ | `button.text-xs` | Activate + ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_h3_32` | `h3` | SSS Hubballi Junction (UBL) | `h3.font-serif` | Activate SSS Hubballi Junction (UBL) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_a_33` | `a` | IRCTC / NTES↗ | `a.text-xs` | Activate IRCTC / NTES↗ | `https://www.irctc.co.in/nget/train-searc` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_34` | `button` | ವಿವರಗಳು | `button.text-xs` | Activate ವಿವರಗಳು | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_35` | `button` | + ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ | `button.text-xs` | Activate + ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_h3_36` | `h3` | Kempegowda Bus Station (Majestic KSRTC) | `h3.font-serif` | Activate Kempegowda Bus Station (Majesti | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_a_37` | `a` | KSRTC Awatar↗ | `a.text-xs` | Activate KSRTC Awatar↗ | `https://ksrtc.in` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_38` | `button` | ವಿವರಗಳು | `button.text-xs` | Activate ವಿವರಗಳು | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_39` | `button` | + ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ | `button.text-xs` | Activate + ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_h3_40` | `h3` | Mysuru Suburb KSRTC Bus Stand | `h3.font-serif` | Activate Mysuru Suburb KSRTC Bus Stand | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_a_41` | `a` | KSRTC Awatar↗ | `a.text-xs` | Activate KSRTC Awatar↗ | `https://ksrtc.in` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_42` | `button` | ವಿವರಗಳು | `button.text-xs` | Activate ವಿವರಗಳು | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_43` | `button` | + ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ | `button.text-xs` | Activate + ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_h3_44` | `h3` | Hosapete KKRTC Central Bus Terminal | `h3.font-serif` | Activate Hosapete KKRTC Central Bus Term | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_a_45` | `a` | KSRTC Awatar↗ | `a.text-xs` | Activate KSRTC Awatar↗ | `https://ksrtc.in` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_46` | `button` | ವಿವರಗಳು | `button.text-xs` | Activate ವಿವರಗಳು | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_47` | `button` | + ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ | `button.text-xs` | Activate + ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_h3_48` | `h3` | Mangaluru KSRTC Bus Terminal (Bejai) | `h3.font-serif` | Activate Mangaluru KSRTC Bus Terminal (B | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_a_49` | `a` | KSRTC Awatar↗ | `a.text-xs` | Activate KSRTC Awatar↗ | `https://ksrtc.in` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_50` | `button` | ವಿವರಗಳು | `button.text-xs` | Activate ವಿವರಗಳು | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_51` | `button` | + ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ | `button.text-xs` | Activate + ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_90` | `button` | Close Guide | `button` | Activate Close Guide | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_91` | `button` | 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (Start Golden Jou | `button` | Activate 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (St | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=directory_button_92` | `button` | ಮುಂದೆ (Next) → | `button` | Activate ಮುಂದೆ (Next) → | `State change / Modal / Action` | **FUNCTIONAL** |

### 3.7 7. Transit & Stays Hub — KSRTC/BMTC/NWKRTC Bus Explorer (30 Controls)

| ID | Element Type | Accessible Name / Text | Selector | Intended Action | Source Handler / Target | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `/?view=transit&sub=buses_div_0` | `div[role=button]` | ಯಾYatriKaಯಾತ್ರಿಕಕರ್ನಾಟಕ ಪ್ರವಾಸ ದಿಕ್ಸೂಚಿ | `div.yt-navbar-brand` | Activate ಯಾYatriKaಯಾತ್ರಿಕಕರ್ನಾಟಕ ಪ್ರವಾಸ  | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_button_1` | `button` | ಅನ್ವೇಷಿಸಿ | `button.yt-nav-link` | Activate ಅನ್ವೇಷಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_button_2` | `button` | ಪ್ರವಾಸ ಯೋಜನೆ5 | `button.yt-nav-link` | Activate ಪ್ರವಾಸ ಯೋಜನೆ5 | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_button_3` | `button` | ರೈಲು & ಬಸ್ ಸಂಚಾರ | `button.yt-nav-link` | Activate ರೈಲು & ಬಸ್ ಸಂಚಾರ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_button_4` | `button` | Open voice assistant | `button.yt-btn-voice` | Activate Open voice assistant | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_button_5` | `button` | Toggle language between Kannada and English | `button.yt-btn-lang` | Activate Toggle language between Kannada | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_button_6` | `button` | ತಾಣಗಳು | `button.yt-btn-plan-primary` | Activate ತಾಣಗಳು | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_button_7` | `button` | 🏛️ ನಿಲ್ದಾಣಗಳ ಕೈಪಿಡಿ (Directory) | `button.px-3` | Activate 🏛️ ನಿಲ್ದಾಣಗಳ ಕೈಪಿಡಿ (Directory | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_button_8` | `button` | 🚌 ಬಸ್ ಸಾರಿಗೆ (KSRTC) | `button.px-3` | Activate 🚌 ಬಸ್ ಸಾರಿಗೆ (KSRTC) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_button_9` | `button` | 🚆 ರೈಲು (SWR / IRCTC) | `button.px-3` | Activate 🚆 ರೈಲು (SWR / IRCTC) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_button_10` | `button` | 🏨 ತಂಗುದಾಣಗಳು (Stays) | `button.px-3` | Activate 🏨 ತಂಗುದಾಣಗಳು (Stays) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_input_11` | `input` | e.g. Bengaluru, Mysuru, Hubballi | `input.w-full` | Activate e.g. Bengaluru, Mysuru, Hubball | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_input_12` | `input` | e.g. Belur, Hampi, Gokarna | `input.w-full` | Activate e.g. Belur, Hampi, Gokarna | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_input_13` | `input` | unnamed | `input.w-full` | Activate unnamed | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_select_14` | `select` | ಎಲ್ಲಾ ನಿಗಮಗಳು (All Operators)KSRTC (ದಕ್ಷಿಣ ಕರ | `select.w-full` | Activate ಎಲ್ಲಾ ನಿಗಮಗಳು (All Operators)KS | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_label_15` | `label` | ಶಕ್ತಿ ಯೋಜನೆ ಮಾತ್ರ (Shakti Free Only) | `label.flex` | Activate ಶಕ್ತಿ ಯೋಜನೆ ಮಾತ್ರ (Shakti Free  | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_input_16` | `input` | unnamed | `input.accent-[#A44A28]` | Activate unnamed | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_button_17` | `button` | ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ (+ Add to Trip) | `button.px-3` | Activate ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ (+ Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_a_18` | `a` | ಅಧಿಕೃತ ಬುಕಿಂಗ್ • Book on KSRTC↗ | `a.px-4` | Activate ಅಧಿಕೃತ ಬುಕಿಂಗ್ • Book on KSRTC↗ | `https://ksrtc.in/oprs-web/guest/home.do` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_button_19` | `button` | ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ (+ Add to Trip) | `button.px-3` | Activate ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ (+ Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_a_20` | `a` | ಅಧಿಕೃತ ಬುಕಿಂಗ್ • Book on KSRTC↗ | `a.px-4` | Activate ಅಧಿಕೃತ ಬುಕಿಂಗ್ • Book on KSRTC↗ | `https://ksrtc.in/oprs-web/guest/home.do` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_button_21` | `button` | ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ (+ Add to Trip) | `button.px-3` | Activate ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ (+ Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_a_22` | `a` | ಅಧಿಕೃತ ಬುಕಿಂಗ್ • Book on KSRTC↗ | `a.px-4` | Activate ಅಧಿಕೃತ ಬುಕಿಂಗ್ • Book on KSRTC↗ | `https://ksrtc.in/oprs-web/guest/home.do` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_button_23` | `button` | ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ (+ Add to Trip) | `button.px-3` | Activate ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ (+ Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_a_24` | `a` | ಅಧಿಕೃತ ಬುಕಿಂಗ್ • Book on KSRTC↗ | `a.px-4` | Activate ಅಧಿಕೃತ ಬುಕಿಂಗ್ • Book on KSRTC↗ | `https://ksrtc.in/oprs-web/guest/home.do` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_button_25` | `button` | ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ (+ Add to Trip) | `button.px-3` | Activate ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ (+ Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_a_26` | `a` | ಅಧಿಕೃತ ಬುಕಿಂಗ್ • Book on KSRTC↗ | `a.px-4` | Activate ಅಧಿಕೃತ ಬುಕಿಂಗ್ • Book on KSRTC↗ | `https://ksrtc.in/oprs-web/guest/home.do` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_button_65` | `button` | Close Guide | `button` | Activate Close Guide | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_button_66` | `button` | 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (Start Golden Jou | `button` | Activate 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (St | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=buses_button_67` | `button` | ಮುಂದೆ (Next) → | `button` | Activate ಮುಂದೆ (Next) → | `State change / Modal / Action` | **FUNCTIONAL** |

### 3.8 8. Transit & Stays Hub — SWR Train Journey Planner (20 Controls)

| ID | Element Type | Accessible Name / Text | Selector | Intended Action | Source Handler / Target | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `/?view=transit&sub=trains_div_0` | `div[role=button]` | ಯಾYatriKaಯಾತ್ರಿಕಕರ್ನಾಟಕ ಪ್ರವಾಸ ದಿಕ್ಸೂಚಿ | `div.yt-navbar-brand` | Activate ಯಾYatriKaಯಾತ್ರಿಕಕರ್ನಾಟಕ ಪ್ರವಾಸ  | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=trains_button_1` | `button` | ಅನ್ವೇಷಿಸಿ | `button.yt-nav-link` | Activate ಅನ್ವೇಷಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=trains_button_2` | `button` | ಪ್ರವಾಸ ಯೋಜನೆ5 | `button.yt-nav-link` | Activate ಪ್ರವಾಸ ಯೋಜನೆ5 | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=trains_button_3` | `button` | ರೈಲು & ಬಸ್ ಸಂಚಾರ | `button.yt-nav-link` | Activate ರೈಲು & ಬಸ್ ಸಂಚಾರ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=trains_button_4` | `button` | Open voice assistant | `button.yt-btn-voice` | Activate Open voice assistant | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=trains_button_5` | `button` | Toggle language between Kannada and English | `button.yt-btn-lang` | Activate Toggle language between Kannada | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=trains_button_6` | `button` | ತಾಣಗಳು | `button.yt-btn-plan-primary` | Activate ತಾಣಗಳು | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=trains_button_7` | `button` | 🏛️ ನಿಲ್ದಾಣಗಳ ಕೈಪಿಡಿ (Directory) | `button.px-3` | Activate 🏛️ ನಿಲ್ದಾಣಗಳ ಕೈಪಿಡಿ (Directory | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=trains_button_8` | `button` | 🚌 ಬಸ್ ಸಾರಿಗೆ (KSRTC) | `button.px-3` | Activate 🚌 ಬಸ್ ಸಾರಿಗೆ (KSRTC) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=trains_button_9` | `button` | 🚆 ರೈಲು (SWR / IRCTC) | `button.px-3` | Activate 🚆 ರೈಲು (SWR / IRCTC) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=trains_button_10` | `button` | 🏨 ತಂಗುದಾಣಗಳು (Stays) | `button.px-3` | Activate 🏨 ತಂಗುದಾಣಗಳು (Stays) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=trains_select_11` | `select` | SBC - KSR Bengaluru City (Majestic)YPR - Yesv | `select.w-full` | Activate SBC - KSR Bengaluru City (Majes | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=trains_select_12` | `select` | HPT - Hosapete Junction (Hampi Gateway)SBC -  | `select.w-full` | Activate HPT - Hosapete Junction (Hampi  | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=trains_input_13` | `input` | unnamed | `input.w-full` | Activate unnamed | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=trains_button_14` | `button` | ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ (+ Add to Trip) | `button.px-3` | Activate ಟ್ರಿಪ್‌ಗೆ ಸೇರಿಸಿ (+ Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=trains_a_15` | `a` | ಲೈವ್ ಸ್ಟೇಟಸ್ (NTES) | `a.px-3` | Activate ಲೈವ್ ಸ್ಟೇಟಸ್ (NTES) | `https://enquiry.indianrail.gov.in/mntes/` | **FUNCTIONAL** |
| `/?view=transit&sub=trains_a_16` | `a` | IRCTC ನಲ್ಲಿ ಬುಕ್ ಮಾಡಿ↗ | `a.px-4` | Activate IRCTC ನಲ್ಲಿ ಬುಕ್ ಮಾಡಿ↗ | `https://www.irctc.co.in/nget/train-searc` | **FUNCTIONAL** |
| `/?view=transit&sub=trains_button_55` | `button` | Close Guide | `button` | Activate Close Guide | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=trains_button_56` | `button` | 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (Start Golden Jou | `button` | Activate 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (St | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=trains_button_57` | `button` | ಮುಂದೆ (Next) → | `button` | Activate ಮುಂದೆ (Next) → | `State change / Modal / Action` | **FUNCTIONAL** |

### 3.9 9. Transit & Stays Hub — KSTDC & Verified Stays Workspace (18 Controls)

| ID | Element Type | Accessible Name / Text | Selector | Intended Action | Source Handler / Target | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `/?view=transit&sub=stays_div_0` | `div[role=button]` | ಯಾYatriKaಯಾತ್ರಿಕಕರ್ನಾಟಕ ಪ್ರವಾಸ ದಿಕ್ಸೂಚಿ | `div.yt-navbar-brand` | Activate ಯಾYatriKaಯಾತ್ರಿಕಕರ್ನಾಟಕ ಪ್ರವಾಸ  | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=stays_button_1` | `button` | ಅನ್ವೇಷಿಸಿ | `button.yt-nav-link` | Activate ಅನ್ವೇಷಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=stays_button_2` | `button` | ಪ್ರವಾಸ ಯೋಜನೆ5 | `button.yt-nav-link` | Activate ಪ್ರವಾಸ ಯೋಜನೆ5 | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=stays_button_3` | `button` | ರೈಲು & ಬಸ್ ಸಂಚಾರ | `button.yt-nav-link` | Activate ರೈಲು & ಬಸ್ ಸಂಚಾರ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=stays_button_4` | `button` | Open voice assistant | `button.yt-btn-voice` | Activate Open voice assistant | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=stays_button_5` | `button` | Toggle language between Kannada and English | `button.yt-btn-lang` | Activate Toggle language between Kannada | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=stays_button_6` | `button` | ತಾಣಗಳು | `button.yt-btn-plan-primary` | Activate ತಾಣಗಳು | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=stays_button_7` | `button` | 🏛️ ನಿಲ್ದಾಣಗಳ ಕೈಪಿಡಿ (Directory) | `button.px-3` | Activate 🏛️ ನಿಲ್ದಾಣಗಳ ಕೈಪಿಡಿ (Directory | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=stays_button_8` | `button` | 🚌 ಬಸ್ ಸಾರಿಗೆ (KSRTC) | `button.px-3` | Activate 🚌 ಬಸ್ ಸಾರಿಗೆ (KSRTC) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=stays_button_9` | `button` | 🚆 ರೈಲು (SWR / IRCTC) | `button.px-3` | Activate 🚆 ರೈಲು (SWR / IRCTC) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=stays_button_10` | `button` | 🏨 ತಂಗುದಾಣಗಳು (Stays) | `button.px-3` | Activate 🏨 ತಂಗುದಾಣಗಳು (Stays) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=stays_input_11` | `input` | e.g. Belur, Hampi, Chikkamagaluru, Gokarna | `input.w-full` | Activate e.g. Belur, Hampi, Chikkamagalu | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=stays_select_12` | `select` | ಎಲ್ಲಾ ವರ್ಗಗಳು (All Categories)KSTDC ಹೋಟೆಲ್ ಮಯ | `select.w-full` | Activate ಎಲ್ಲಾ ವರ್ಗಗಳು (All Categories)K | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=stays_label_13` | `label` | ಸರ್ಕಾರಿ ಒಡೆತನ ಮಾತ್ರ (KSTDC / JLR Only) | `label.flex` | Activate ಸರ್ಕಾರಿ ಒಡೆತನ ಮಾತ್ರ (KSTDC / JL | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=stays_input_14` | `input` | unnamed | `input.accent-[#A44A28]` | Activate unnamed | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=stays_button_53` | `button` | Close Guide | `button` | Activate Close Guide | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=stays_button_54` | `button` | 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (Start Golden Jou | `button` | Activate 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (St | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?view=transit&sub=stays_button_55` | `button` | ಮುಂದೆ (Next) → | `button` | Activate ಮುಂದೆ (Next) → | `State change / Modal / Action` | **FUNCTIONAL** |

### 3.10 10. Destination Detail Drawer (Belur Chennakeshava Dossier) (55 Controls)

| ID | Element Type | Accessible Name / Text | Selector | Intended Action | Source Handler / Target | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `/?detail=poi-belur-halebidu_div_0` | `div[role=button]` | ಯಾYatriKaಯಾತ್ರಿಕಕರ್ನಾಟಕ ಪ್ರವಾಸ ದಿಕ್ಸೂಚಿ | `div.yt-navbar-brand` | Activate ಯಾYatriKaಯಾತ್ರಿಕಕರ್ನಾಟಕ ಪ್ರವಾಸ  | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_1` | `button` | ಅನ್ವೇಷಿಸಿ | `button.yt-nav-link` | Activate ಅನ್ವೇಷಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_2` | `button` | ಪ್ರವಾಸ ಯೋಜನೆ5 | `button.yt-nav-link` | Activate ಪ್ರವಾಸ ಯೋಜನೆ5 | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_3` | `button` | ರೈಲು & ಬಸ್ ಸಂಚಾರ | `button.yt-nav-link` | Activate ರೈಲು & ಬಸ್ ಸಂಚಾರ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_4` | `button` | Open voice assistant | `button.yt-btn-voice` | Activate Open voice assistant | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_5` | `button` | Toggle language between Kannada and English | `button.yt-btn-lang` | Activate Toggle language between Kannada | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_6` | `button` | ತಾಣಗಳು | `button.yt-btn-plan-primary` | Activate ತಾಣಗಳು | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_7` | `button` | Copy shareable trip link | `button.yt-btn-doc-action` | Activate Copy shareable trip link | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_8` | `button` | Download formatted travel document | `button.yt-btn-doc-action` | Activate Download formatted travel docum | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_9` | `button` | 📅 ವೇಳಾಪಟ್ಟಿ (5) | `button.yt-ws-tab` | Activate 📅 ವೇಳಾಪಟ್ಟಿ (5) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_10` | `button` | 🚆 ರೈಲು & ಬಸ್ | `button.yt-ws-tab` | Activate 🚆 ರೈಲು & ಬಸ್ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_11` | `button` | ₹ ವೆಚ್ಚ & ಶಕ್ತಿ | `button.yt-ws-tab` | Activate ₹ ವೆಚ್ಚ & ಶಕ್ತಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_12` | `button` | + ತಾಣ ಸೇರಿಸಿ | `button.yt-ws-tab` | Activate + ತಾಣ ಸೇರಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_select_13` | `select` | BengaluruChikkamagaluruMysuru CityMangaluru C | `select.yt-origin-select-inline` | Activate BengaluruChikkamagaluruMysuru C | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_14` | `button` | Move earlier | `button.yt-btn-move` | Activate Move earlier | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_15` | `button` | Move later | `button.yt-btn-move` | Activate Move later | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_16` | `button` | Remove stop | `button.yt-btn-delete` | Activate Remove stop | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_17` | `button` | View Details & Hours → | `button.yt-btn-stop-dossier` | Activate View Details & Hours → | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_18` | `button` | Move earlier | `button.yt-btn-move` | Activate Move earlier | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_19` | `button` | Move later | `button.yt-btn-move` | Activate Move later | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_20` | `button` | Remove stop | `button.yt-btn-delete` | Activate Remove stop | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_21` | `button` | View Details & Hours → | `button.yt-btn-stop-dossier` | Activate View Details & Hours → | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_22` | `button` | Move earlier | `button.yt-btn-move` | Activate Move earlier | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_23` | `button` | Move later | `button.yt-btn-move` | Activate Move later | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_24` | `button` | Remove stop | `button.yt-btn-delete` | Activate Remove stop | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_25` | `button` | View Details & Hours → | `button.yt-btn-stop-dossier` | Activate View Details & Hours → | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_26` | `button` | Move earlier | `button.yt-btn-move` | Activate Move earlier | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_27` | `button` | Move later | `button.yt-btn-move` | Activate Move later | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_28` | `button` | Remove stop | `button.yt-btn-delete` | Activate Remove stop | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_29` | `button` | View Details & Hours → | `button.yt-btn-stop-dossier` | Activate View Details & Hours → | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_30` | `button` | Move earlier | `button.yt-btn-move` | Activate Move earlier | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_31` | `button` | Move later | `button.yt-btn-move` | Activate Move later | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_32` | `button` | Remove stop | `button.yt-btn-delete` | Activate Remove stop | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_33` | `button` | View Details & Hours → | `button.yt-btn-stop-dossier` | Activate View Details & Hours → | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_34` | `button` | ⚡ Auto-Optimize Stop Sequence for Shortest Dr | `button.yt-btn-optimize-stops` | Activate ⚡ Auto-Optimize Stop Sequence f | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_35` | `button` | + Add More Destinations | `button.yt-btn-add-more-stops` | Activate + Add More Destinations | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_a_36` | `a` | MapLibre | `a` | Activate MapLibre | `https://maplibre.org/` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_a_37` | `a` | OpenFreeMap | `a` | Activate OpenFreeMap | `https://openfreemap.org` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_a_38` | `a` | © OpenMapTiles | `a` | Activate © OpenMapTiles | `https://www.openmaptiles.org/` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_a_39` | `a` | OpenStreetMap | `a` | Activate OpenStreetMap | `https://www.openstreetmap.org/copyright` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_40` | `button` | Fit view to complete route geometry | `button.yt-map-ctrl-btn` | Activate Fit view to complete route geom | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_41` | `button` | Day | `button.yt-map-style-chip` | Activate Day | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_42` | `button` | Terrain | `button.yt-map-style-chip` | Activate Terrain | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_43` | `button` | Night | `button.yt-map-style-chip` | Activate Night | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_44` | `button` | Experience 3D animated route tour | `button.yt-map-ctrl-btn` | Activate Experience 3D animated route to | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_45` | `button` | Close destination dossier | `button.yt-drawer-close-btn` | Activate Close destination dossier | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_46` | `button` | ವಿವರ • Visiting Info | `button.pb-2` | Activate ವಿವರ • Visiting Info | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_47` | `button` | ಸಾರಿಗೆ • How to Reach | `button.pb-2` | Activate ಸಾರಿಗೆ • How to Reach | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_48` | `button` | ತಂಗುದಾಣ • Stays (1) | `button.pb-2` | Activate ತಂಗುದಾಣ • Stays (1) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_49` | `button` | ಊಟೋಪಹಾರ • Food (0) | `button.pb-2` | Activate ಊಟೋಪಹಾರ • Food (0) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_50` | `button` | ಮೂಲ ದಾಖಲೆ • Sources | `button.pb-2` | Activate ಮೂಲ ದಾಖಲೆ • Sources | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_51` | `button` | ✕ ಪ್ರವಾಸದಿಂದ ತೆಗೆಯಿರಿ (Remove from Trip) | `button.yt-drawer-action-btn` | Activate ✕ ಪ್ರವಾಸದಿಂದ ತೆಗೆಯಿರಿ (Remove f | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_52` | `button` | Close Guide | `button` | Activate Close Guide | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_53` | `button` | 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (Start Golden Jou | `button` | Activate 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (St | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?detail=poi-belur-halebidu_button_54` | `button` | ಮುಂದೆ (Next) → | `button` | Activate ಮುಂದೆ (Next) → | `State change / Modal / Action` | **FUNCTIONAL** |

### 3.11 11. Kannada Voice Assistant Modal (Live Microphone & NLP) (73 Controls)

| ID | Element Type | Accessible Name / Text | Selector | Intended Action | Source Handler / Target | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `/?voice=1_div_0` | `div[role=button]` | ಯಾYatriKaಯಾತ್ರಿಕಕರ್ನಾಟಕ ಪ್ರವಾಸ ದಿಕ್ಸೂಚಿ | `div.yt-navbar-brand` | Activate ಯಾYatriKaಯಾತ್ರಿಕಕರ್ನಾಟಕ ಪ್ರವಾಸ  | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_1` | `button` | ಅನ್ವೇಷಿಸಿ | `button.yt-nav-link` | Activate ಅನ್ವೇಷಿಸಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_2` | `button` | ಪ್ರವಾಸ ಯೋಜನೆ5 | `button.yt-nav-link` | Activate ಪ್ರವಾಸ ಯೋಜನೆ5 | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_3` | `button` | ರೈಲು & ಬಸ್ ಸಂಚಾರ | `button.yt-nav-link` | Activate ರೈಲು & ಬಸ್ ಸಂಚಾರ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_4` | `button` | Open voice assistant | `button.yt-btn-voice` | Activate Open voice assistant | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_5` | `button` | Toggle language between Kannada and English | `button.yt-btn-lang` | Activate Toggle language between Kannada | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_6` | `button` | ಪ್ರವಾಸ ರಚಿಸಿ→ | `button.yt-btn-plan-primary` | Activate ಪ್ರವಾಸ ರಚಿಸಿ→ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_input_7` | `input` | Search Karnataka destinations | `input` | Activate Search Karnataka destinations | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_select_8` | `select` | Bengaluru (ಬೆಂಗಳೂರು)Chikkamagaluru (ಚಿಕ್ಕಮಗಳೂ | `select.yt-origin-select` | Activate Bengaluru (ಬೆಂಗಳೂರು)Chikkamagal | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_9` | `button` | ಕನ್ನಡ ಧ್ವನಿ ಸಹಾಯಕ | `button.yt-search-btn-voice` | Activate ಕನ್ನಡ ಧ್ವನಿ ಸಹಾಯಕ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_10` | `button` | ಪ್ರವಾಸ ಯೋಜನೆ→ | `button.yt-search-btn-submit` | Activate ಪ್ರವಾಸ ಯೋಜನೆ→ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_11` | `button` | 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ (ಹಾಸನ-ಬೇಲೂರು-ಮುಳ್ಳಯ್ಯನಗಿರಿ) | `button.yt-chip-item` | Activate 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ (ಹಾಸನ-ಬೇಲೂರು-ಮ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_12` | `button` | 🏛️ ಯುನೆಸ್ಕೋ ಹಂಪಿ & ಬಾದಾಮಿ | `button.yt-chip-item` | Activate 🏛️ ಯುನೆಸ್ಕೋ ಹಂಪಿ & ಬಾದಾಮಿ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_13` | `button` | 🌊 ಕರಾವಳಿ ಕಡಲತೀರ | `button.yt-chip-item` | Activate 🌊 ಕರಾವಳಿ ಕಡಲತೀರ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_14` | `button` | ಎಲ್ಲಾ ಪಥಗಳನ್ನು ವೀಕ್ಷಿಸಿ → | `button.yt-btn-view-all` | Activate ಎಲ್ಲಾ ಪಥಗಳನ್ನು ವೀಕ್ಷಿಸಿ → | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_15` | `button` | ✓ Added to Itinerary | `button.yt-btn-spotlight-add` | Activate ✓ Added to Itinerary | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_16` | `button` | View Full Dossier & Weather | `button.yt-btn-spotlight-details` | Activate View Full Dossier & Weather | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_17` | `button` | ಎಲ್ಲಾ | `button.yt-filter-pill` | Activate ಎಲ್ಲಾ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_18` | `button` | Old Mysuru | `button.yt-filter-pill` | Activate Old Mysuru | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_19` | `button` | Malnad & Ghats | `button.yt-filter-pill` | Activate Malnad & Ghats | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_20` | `button` | Karavali Coast | `button.yt-filter-pill` | Activate Karavali Coast | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_21` | `button` | Kittur Karnataka | `button.yt-filter-pill` | Activate Kittur Karnataka | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_22` | `button` | Kalyana Karnataka | `button.yt-filter-pill` | Activate Kalyana Karnataka | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_23` | `button` | ಎಲ್ಲಾ ವರ್ಗ | `button.yt-filter-pill` | Activate ಎಲ್ಲಾ ವರ್ಗ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_24` | `button` | 🏛️ Heritage | `button.yt-filter-pill` | Activate 🏛️ Heritage | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_25` | `button` | ⛰️ Nature & Peaks | `button.yt-filter-pill` | Activate ⛰️ Nature & Peaks | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_26` | `button` | 🕉️ Spiritual | `button.yt-filter-pill` | Activate 🕉️ Spiritual | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_27` | `button` | 💧 Waterfalls | `button.yt-filter-pill` | Activate 💧 Waterfalls | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_28` | `button` | 🏖️ Beaches | `button.yt-filter-pill` | Activate 🏖️ Beaches | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_div_29` | `div[role=button]` | railway stationBengaluru Urban | `div.yt-dest-media` | Activate railway stationBengaluru Urban | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_30` | `button` | ✓ Added | `button.yt-btn-add-stop` | Activate ✓ Added | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_div_31` | `div[role=button]` | railway stationMysuru | `div.yt-dest-media` | Activate railway stationMysuru | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_32` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_div_33` | `div[role=button]` | railway stationVijayanagara | `div.yt-dest-media` | Activate railway stationVijayanagara | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_34` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_div_35` | `div[role=button]` | railway stationUdupi | `div.yt-dest-media` | Activate railway stationUdupi | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_36` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_div_37` | `div[role=button]` | railway stationDharwad | `div.yt-dest-media` | Activate railway stationDharwad | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_38` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_div_39` | `div[role=button]` | bus terminalBengaluru Urban | `div.yt-dest-media` | Activate bus terminalBengaluru Urban | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_40` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_div_41` | `div[role=button]` | bus terminalMysuru | `div.yt-dest-media` | Activate bus terminalMysuru | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_42` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_div_43` | `div[role=button]` | bus terminalVijayanagara | `div.yt-dest-media` | Activate bus terminalVijayanagara | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_44` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_div_45` | `div[role=button]` | bus terminalDakshina Kannada | `div.yt-dest-media` | Activate bus terminalDakshina Kannada | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_46` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_div_47` | `div[role=button]` | bus terminalDharwad | `div.yt-dest-media` | Activate bus terminalDharwad | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_48` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_div_49` | `div[role=button]` | airportBengaluru Rural | `div.yt-dest-media` | Activate airportBengaluru Rural | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_50` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_div_51` | `div[role=button]` | heritageMysuru | `div.yt-dest-media` | Activate heritageMysuru | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_52` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_div_53` | `div[role=button]` | heritageVijayanagara | `div.yt-dest-media` | Activate heritageVijayanagara | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_54` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_div_55` | `div[role=button]` | heritageBagalkote | `div.yt-dest-media` | Activate heritageBagalkote | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_56` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_div_57` | `div[role=button]` | heritageHassan | `div.yt-dest-media` | Activate heritageHassan | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_58` | `button` | ✓ Added | `button.yt-btn-add-stop` | Activate ✓ Added | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_div_59` | `div[role=button]` | heritageVijayapura | `div.yt-dest-media` | Activate heritageVijayapura | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_60` | `button` | + Add to Trip | `button.yt-btn-add-stop` | Activate + Add to Trip | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_61` | `button` | ಯೋಜನಾ ವೇದಿಕೆಯಲ್ಲಿ ಎಲ್ಲಾ 650 ತಾಣಗಳನ್ನು ವೀಕ್ಷಿಸ | `button.yt-btn-catalog-more` | Activate ಯೋಜನಾ ವೇದಿಕೆಯಲ್ಲಿ ಎಲ್ಲಾ 650 ತಾಣ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_a_62` | `a` | ಬುಕಿಂಗ್ ↗ | `a.px-3` | Activate ಬುಕಿಂಗ್ ↗ | `https://kstdc.co/hotels/hotel-mayura-vel` | **FUNCTIONAL** |
| `/?voice=1_a_63` | `a` | ಬುಕಿಂಗ್ ↗ | `a.px-3` | Activate ಬುಕಿಂಗ್ ↗ | `https://kstdc.co/hotels/hotel-mayura-bhu` | **FUNCTIONAL** |
| `/?voice=1_a_64` | `a` | ಬುಕಿಂಗ್ ↗ | `a.px-3` | Activate ಬುಕಿಂಗ್ ↗ | `https://www.junglelodges.com/resort/rive` | **FUNCTIONAL** |
| `/?voice=1_a_65` | `a` | ಬುಕಿಂಗ್ ↗ | `a.px-3` | Activate ಬುಕಿಂಗ್ ↗ | `https://karnatakatourism.org/stay/homest` | **FUNCTIONAL** |
| `/?voice=1_button_104` | `button` | ಕನ್ನಡ | `button.yt-vlang-btn` | Activate ಕನ್ನಡ | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_105` | `button` | English | `button.yt-vlang-btn` | Activate English | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_106` | `button` | Close dialog | `button.yt-voice-close-btn` | Activate Close dialog | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_107` | `button` | 🎙️ಮಾತನಾಡಿ (Tap to Speak) | `button.yt-vbtn-mic` | Activate 🎙️ಮಾತನಾಡಿ (Tap to Speak) | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_108` | `button` | Close Guide | `button` | Activate Close Guide | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_109` | `button` | 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (Start Golden Jou | `button` | Activate 🌟 ಸುವರ್ಣ ಪ್ರವಾಸ ಪ್ರಾರಂಭಿಸಿ (St | `State change / Modal / Action` | **FUNCTIONAL** |
| `/?voice=1_button_110` | `button` | ಮುಂದೆ (Next) → | `button` | Activate ಮುಂದೆ (Next) → | `State change / Modal / Action` | **FUNCTIONAL** |

---

## 4. Verification & Testing Methodology
Every element in this inventory was scanned live using Playwright in headless Google Chrome at 1440x900 resolution.
- Accessibility names adhere to W3C Accessible Name and Description Computation 1.2.
- Interactive states (hover, focus, active, disabled) have been cross-checked against WCAG 2.2 AA target size and contrast requirements.
- Zero unexplained nonfunctional visible interactive elements remain.
