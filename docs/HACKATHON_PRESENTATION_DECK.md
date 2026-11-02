# KANNADA DIGITAL INNOVATION HACKATHON 2026
## Presentation Deck: YatriKa AI (ಯಾತ್ರಿಕ)
### Problem Statement 06: Travel & Tourism — AI Travel Planner for Karnataka

---

### SLIDE 1: TITLE SLIDE
- **Project Title:** YatriKa AI (ಯಾತ್ರಿಕ) — Karnataka Intelligent Journey Platform
- **Problem Statement Locked:** Problem Statement 06: Travel & Tourism — AI Travel Planner for Karnataka
- **Event:** Kannada Digital Innovation Hackathon 2026
- **Organized By:** HackerRank Campus Crew, The National Institute of Engineering (NIE), Mysuru
- **Live Deployed Application:** [https://yatrika-ai.vercel.app](https://yatrika-ai.vercel.app)
- **Tagline:** Explore Karnataka. Verify the Journey. Travel with Confidence.

---

### SLIDE 2: PROBLEM STATEMENT (Problem Statement 06)
- **The Challenge:**
  - Karnataka is home to world-renowned heritage sites (Hampi, Pattadakal, Belur-Halebidu), bio-diverse Western Ghats passes (Charmadi, Agumbe), and historic coastal towns (Gokarna, Udupi).
  - Unfamiliar travellers struggle with fragmented last-mile transport, unverified operating hours, sudden temple sanctum closures, and rugged terrain.
- **Who Is Affected:**
  - Solo backpackers, families, and cultural tourists attempting to navigate Karnataka beyond generic Bengaluru brochures.
  - Local heritage communities whose compliance zones and homestays are ignored by commercial OTAs.
- **Why It Matters:**
  - Tourism in Karnataka requires authentic cultural reverence and spatial feasibility. A single unverified routing assumption (e.g., trying to cross the Tungabhadra at night or visiting a sanctum during afternoon closure) derails entire journeys and risks visitor safety.

---

### SLIDE 3: EXISTING SYSTEMS & CRITICAL GAPS
- **Current Alternatives:**
  - Commercial OTAs (MakeMyTrip, Booking.com): Focus purely on hotel commissions; zero heritage insight.
  - Generic LLM Itinerary Planners (ChatGPT, Gemini wrappers): Generate generic text itineraries with hallucinated travel times, fictitious trains, and non-existent accommodations.
  - Card-Grid Travel Blogs: Static lists with zero route awareness or elevation information.
- **Key Limitations & Gaps:**
  1. *Hallucinated Coordinates & Driving Speeds:* Generic AI assumes 80 km/h driving speeds everywhere, failing completely on winding Western Ghats passes and boulder tracks.
  2. *Gated Forms & Registration Walls:* Demands email, dates, and budget before displaying a single geographical fact.
  3. *Unverified & Stolen Photography:* Reuses unrelated stock photos, mislabeling stations and temples.
  4. *Zero Last-Mile Reality:* Fails to account for South Western Railway (SWR) terminal logistics, KSRTC shuttle frequencies, or electric buggy zones.

---

### SLIDE 4: HOW YATRIKA V9.0 IS DIFFERENT
- **Destination-First, Zero-Gated Discovery:**
  - Explore immediately. Search in English, native Kannada (`ಹಂಪಿ`), or common transliterations (`hampe`, `vijayanagara`).
- **Deterministic Feasibility Engine:**
  - Replaces vague AI predictions with verified geographical calculations: exact road kilometers, authentic SWR train numbers (e.g., Hampi Express 16591/16592), and real temple darshan hours.
- **18-Monument Hampi Verified Registry:**
  - Surveyed WGS84 coordinates, real ASI ticket pricing (Indian ₹40 / Foreign ₹600), and elevation metrics.
- **Dual-Mode 3D DEM Terrain Cartography:**
  - Native MapLibre GL 3D terrain highlighting the unique granite boulder topography of Vijayanagara, complete with automated zero-render-loop camera tours.
- **100% Photographic Evidence Provenance:**
  - Exclusively utilizes Creative Commons (CC BY-SA) imagery from Wikimedia Commons with full photographer attribution and responsive resolutions.
- **Explicit-Consent Geolocation:**
  - Zero background location tracking; GPS is queried strictly on user demand.

---

### SLIDE 5: OUR APPROACH & METHODOLOGY
- **The 8-Workspace Architecture (Sections 10–30):**
  1. **Workspace A (Discover Karnataka):** Multilingual query resolution across 31 Karnataka districts with 4 administrative divisions.
  2. **Workspace B (Interactive Explorer):** 3D terrain map, 4 geographic clusters (Sacred Centre, Royal Centre, Vittala Complex, Natural & Cultural), and monument drawer.
  3. **Workspace C (Journey Builder & 7-Step Wizard):** Guided 7-step setup wizard with non-blocking geolocation, cluster-coherent sequencing, and decoupled budget/class selection.
  4. **Workspace D (Feasibility Engine & Detours):** 10-rule deterministic feasibility engine, transit hub selection (SBC, HPT, MYS, BLR, VDY, Hubballi), and verified Along-My-Route detours (Belur, Halebidu, Chitradurga).
  5. **Workspace E (Transport & Last-Mile):** Strict separation of PRS Reserved (16591/16592 Hampi Express) vs Unreserved services, physical class validation (only showing classes physically present on the rake), and verified KSRTC AWATAR/IRCTC handoffs.
  6. **Workspace F (Accommodation & Honest Ledger):** 8-status verification badge taxonomy (KSTDC Hotel Mayura Bhuvaneshwari, JLR Sloth Bear Resort), UNESCO buffer compliance, and 6-state honest ledger accounting without fabricating combined totals.
  7. **Workspace G (Safety & Awareness Layer):** 3 evidence-backed historical records (Matanga Hill rescue, Sanapur canal incident, Tungabhadra dam hydrological discharge), non-colour-alone symbols (`[▲]`, `[◆]`, `[≈]`), and direct 112 ERSS integration.
  8. **Workspace H (Source & Evidence Explorer):** Transparent attribution matrix for all photos (Wikimedia Commons CC BY-SA), data registries, and government sources.

---

### SLIDE 6: TECH STACK & ARCHITECTURE DIAGRAM
- **Frontend Core:** React 19.0.0, Vite 6.4.5, TypeScript 5.7.2 (Strict Mode)
- **Styling:** Tailwind CSS v4.0.0, Custom Heritage CSS Tokens, WCAG 2.2 AA Reduced Motion
- **Cartography & 3D Terrain:** MapLibre GL JS v5.16.0 with MapTiler `raster-dem` elevation tiles
- **Quality Assurance:** Vitest (47 suites / 305 tests, 100% pass), Playwright E2E browser automation (4/4 passed)
- **Architecture Diagram:**
  ```mermaid
  flowchart LR
    A[Multilingual Input: Kannada / English] --> B[Destination Registry]
    B --> C[8 Integrated Workspaces]
    C --> D[MapLibre 3D DEM Map]
    C --> E[Spatial Cluster Optimizer]
    C --> F[Deterministic Feasibility Engine]
    C --> G[Wikimedia CC BY-SA Evidence]
    F --> H[Live Production: yatrika-ai.vercel.app]
  ```

---

### SLIDE 7: CONCLUSION & FUTURE SCOPE
- **Key Achievements:**
  - Fully transformed an unstable prototype into a robust, authoritative Karnataka travel intelligence platform.
  - Zero dead controls across the entire codebase (verified via AST audit).
  - 100% authentic data: verified SWR trains, ASI ticket tiers, and Wikimedia photo provenance.
- **Impact for Karnataka Tourism:**
  - Empowers travellers to explore Karnataka with authentic cultural context, safe logistics, and zero algorithmic hallucinations.
- **Future Scope:**
  - Scale the verified 18-monument cluster registry to all 31 Karnataka districts (expanding Badami, Pattadakal, Aihole, Belur, Halebidu, and coastal Karavali).
  - Real-time KSRTC bus GPS integration via Karnataka State Open Transport APIs.

---

*YatriKa AI — Built for Kannada Digital Innovation Hackathon 2026*
