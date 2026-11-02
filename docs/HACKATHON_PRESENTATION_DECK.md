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
- **The 8-Workspace Architecture:**
  1. **Workspace A (Discover Karnataka):** Multilingual query resolution to canonical destination bounding boxes.
  2. **Workspace B (Interactive Explorer):** 3D terrain map, 4 geographic clusters (Sacred Centre, Royal Centre, Vittala Complex, Natural & Cultural), and monument drawer.
  3. **Workspace C (Journey Builder):** Cluster-coherent monument sequencing preventing erratic zigzagging across the 26 km² ruins.
  4. **Workspace D (Feasibility Engine):** Transit hub selection (SBC, HPT, MYS, BLR, VDY, Hubballi) with deterministic viability verdicts.
  5. **Workspace E (Transport & Last-Mile):** Authentic rail trunks, KSRTC Kamalapura shuttles, and Gejjala Mantapa EV buggies.
  6. **Workspace F (Accommodation Discovery):** Categorized by strict UNESCO archaeological buffer compliance zones.
  7. **Workspace G (Safety & Awareness):** Real warnings on Tungabhadra river whirlpools, granite afternoon heat, 6 PM dusk descent, and emergency 112/1363 helplines.
  8. **Workspace H (Source & Evidence Explorer):** Transparent attribution matrix for all photos, data, and government sources.

---

### SLIDE 6: TECH STACK & ARCHITECTURE DIAGRAM
- **Frontend Core:** React 19.0.0, Vite 6.0.0, TypeScript 5.7.2 (Strict Mode)
- **Styling:** Tailwind CSS v4.0.0, Custom Heritage CSS Tokens, WCAG 2.2 AA Reduced Motion
- **Cartography & 3D Terrain:** MapLibre GL JS v6.16.0 with MapTiler `raster-dem` elevation tiles
- **Quality Assurance:** Vitest (46 suites / 288 tests, 100% pass), Playwright E2E browser automation
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
