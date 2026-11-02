# YatriKa AI (V9.0) — Karnataka Intelligent Journey Platform
### Verified Geographical Intelligence, Multilingual Discovery & Deterministic Feasibility

> **Event:** Kannada Digital Innovation Hackathon 2026 (Organized by HackerRank Campus Crew, NIE Mysuru)  
> **Official Theme:** *Code. Create. Celebrate Kannada.*  
> **Single Problem Statement Lock:** **Problem Statement 06 — Travel & Tourism: AI Travel Planner for Karnataka**  
> *"Develop an AI-powered travel planner that creates personalized Karnataka itineraries based on a traveller's interests, available time, budget, and preferred type of experience."*

[![Live Production](https://img.shields.io/badge/Live%20Production-yatrika--ai.vercel.app-emerald.svg)](https://yatrika-ai.vercel.app)
[![Track](https://img.shields.io/badge/Hackathon%20Track-Problem%20Statement%2006-blue.svg)](https://yatrika-ai.vercel.app)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-5.7%20Strict-blue.svg)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-4.0%20Vite-38b2ac.svg)](https://tailwindcss.com/)
[![Vitest Passing](https://img.shields.io/badge/Vitest-Passing%20(47%2F47%20files%2C%20305%2F305%20tests)-brightgreen.svg)](https://vitest.dev/)
[![Playwright Passing](https://img.shields.io/badge/Playwright-100%25%20Passing-brightgreen.svg)]()
[![Audited Dead Controls](https://img.shields.io/badge/Dead%20Controls-0%20(AST%20Audited)-brightgreen.svg)]()
[![License](https://img.shields.io/badge/License-CC%20BY--SA%20%2F%20MIT-amber.svg)](LICENSE)

---

## 1. Product Summary & Central Promise
> *"Search a Karnataka destination and understand the entire journey around it."*

YatriKa AI replaces generic text-only LLM itinerary generators and static card grids with a **destination-first geographical workspace** for Karnataka. Built with Hampi (`ಹಂಪಿ`) as the flagship pilot and preloaded metadata across all 31 Karnataka districts, YatriKa integrates:
- **Multilingual Destination-First Discovery (Section 11):** Instant resolution of Kannada (`ಕನ್ನಡ`), English, and transliterated place names (`ಹಂಪಿ`, `ಮೈಸೂರು`, `ಗೋಕರ್ಣ`, `ಚಿಕ್ಕಮಗಳೂರು`, `ಕೊಡಗು`, `ಬಾದಾಮಿ`) into canonical WGS84 bounding boxes with zero gating forms.
- **Dual-Mode 3D Terrain & Verified Monument Clusters (Section 6 & 7):** MapLibre GL JS 3D elevation terrain (`raster-dem`) paired with 18 surveyed Hampi monuments across 4 clusters (Sacred Centre, Royal Centre, Vittala Complex, Natural & Cultural) and zero-React-re-render camera tours.
- **Decoupled Budget & Travel Class Engine (Section 10):** Independent configuration of INR budget and rail/bus travel classes (`UR`, `2S`, `SL`, `3A`, `2A`, `1A`, `CC`, `EC`) with honest status accounting (`CONFIRMED`, `PUBLISHED_RATE`, `PROVIDER_QUOTE`, `ESTIMATED`, `UNAVAILABLE`, `NOT_INCLUDED`). Never fabricates a combined total when live hotel inventory is unavailable.
- **Traceable Indian Railways & Karnataka Bus Connectivity (Sections 12 & 13):** Distinguishes PRS Reserved trains (*16592/16591 Hampi Express*) from Unreserved/Passenger services with state-preserving handoffs to IRCTC, RailOne, NTES, KSRTC AWATAR, and Namma BMTC 2.0.
- **Strict Government & Registered Accommodation Filter (Section 15):** Highlights KSTDC (*Hotel Mayura Bhuvaneshwari Hampi*), Jungle Lodges & Resorts, and valid Karnataka Tourism registered homestays while flagging expired or `NIDHI_LISTED_ONLY` properties.
- **Evidence-Backed Safety & Environmental Layer (Section 16):** Source-cited historical precautions (Matanga Hill June 2025 cave rescue, Sanapur March 2025 incident & Feb 2026 conviction, July 2024 Tungabhadra dam discharge context) alongside intentional `112` emergency access.
- **Deterministic 10-Rule Feasibility & Along-My-Route Detours (Sections 21 & 22):** Deterministic constraint validation (`FEASIBLE` vs `FEASIBLE_WITH_UNCONFIRMED_CONNECTIONS`) and authentic road corridor detours (Belur Chennakeshava, Halebidu Hoysaleswara, Chitradurga Fort).

---

## 2. Tech Stack & Architecture Diagram

- **Frontend Core:** React 19.0.0, TypeScript 5.7.2, Vite 6.0.0, Tailwind CSS v4.0.0, Radix UI accessible primitives, MapLibre GL JS v6.16.0 (3D Terrain DEM).
- **Geospatial & Data Layer:** PostgreSQL + PostGIS schema (`src/server/schema.sql`), deterministic Feasibility & Corridor Detour Engine, Wikimedia Commons CC BY-SA responsive image pipeline.
- **Testing & Quality:** Vitest (47 suites / 305 tests passing, 100%), Playwright E2E release acceptance suite (`tests/e2e/yatrika-acceptance.spec.ts`), AST automated dead-control audit (0 dead controls).

```text
[User: Kannada / English Query or 7-Step Wizard]
        │
        ▼
[Kannada/English Canonical Resolver] ──► [31-District & Hampi Verified Registry]
        │
        ├──► [MapLibre GL 3D DEM Explorer + Zero-Re-Render Camera Tour]
        ├──► [Deterministic Feasibility & "Along My Route" Detour Engine]
        ├──► [Decoupled Budget & Class Ledger (Never fabricates totals)]
        ├──► [Provider Adapters: Rail (NTES/IRCTC/RailOne) | Bus (KSRTC/KKRTC) | Stay (KSTDC/JLR)]
        └──► [Safety & Environmental Layer (Source-Backed + 112 ERSS)]
                    │
                    ▼
        [Journey Readiness Passport (Interactive + Exportable)]
```

---

## 3. The 8 Unified Functional Workspaces

| Workspace | Title | Purpose & Architectural Invariants |
|---|---|---|
| **Workspace A** | **Discover Karnataka** | Multilingual destination resolver (`ಕನ್ನಡ` / English) + 7-Step Progressive Setup Wizard + 31-District Statewide Baseline. |
| **Workspace B** | **Interactive Destination Explorer** | Dual-mode 2D/3D DEM terrain map + 18 surveyed Hampi monuments across 4 clusters + zero-re-render camera tour. |
| **Workspace C** | **Journey Builder** | Cluster-coherent monument sequencing + Along-My-Route Detours (Belur, Halebidu, Chitradurga) + Honest Budget Ledger. |
| **Workspace D** | **Journey Feasibility Engine** | Non-intrusive departure hub selection (SBC, HPT, MYS, BLR, VDY, Majestic, Hubballi) + 10-rule deterministic viability audit. |
| **Workspace E** | **Transport & Last-Mile Intelligence** | PRS Express vs. Unreserved Passenger separation + Train 16592/16591 + KSRTC AWATAR + KKRTC Kamalapura shuttles. |
| **Workspace F** | **Accommodation Discovery** | Strict 8-status verification badge taxonomy (KSTDC Hotel Mayura Bhuvaneshwari, JLR Sloth Bear Resort, NIDHI+ disclosures). |
| **Workspace G** | **Safety & Visitor Awareness** | Evidence-backed records: Matanga Hill cave rescue, Sanapur canal incident & conviction, TB dam flood context + direct `112` ERSS link. |
| **Workspace H** | **Source & Evidence Explorer** | 100% CC BY-SA 3.0 / 4.0 Wikimedia Commons high-resolution photography with responsive `srcset` and fullscreen lightbox. |

---

## 4. Setup & Local Development Instructions

### Prerequisites
- Node.js version 20.x or 22.x LTS
- `npm` version 10.x+

```bash
# 1. Clone the repository
git clone https://github.com/anandaram240-wq/yatrika-ai.git
cd yatrika-ai

# 2. Check out the verified V9.0 branch
git checkout rescue/v8.2-complete-reconstruction

# 3. Copy .env.example to .env.local (no secrets are committed to Git)
cp .env.example .env.local

# 4. Install dependencies and start development server
npm install
npm run dev
# Open http://localhost:5173

# 5. Run typecheck and production build
npm run build

# 6. Run unit and integration tests (305 tests)
npm test

# 7. Run Playwright E2E release acceptance tests
npx playwright test tests/e2e/yatrika-acceptance.spec.ts

# 8. Run automated AST dead-control audit
node scripts/audit-repo.mjs
```

---

## 5. Hackathon Submission Deliverables Index

In accordance with the **Event Submission Guidelines** (Kannada Digital Innovation Hackathon 2026):

| # | Deliverable | Format | Verified Resource Link |
|---|---|---|---|
| **1** | **Public GitHub Repository** | Public link with complete README | [github.com/anandaram240-wq/yatrika-ai](https://github.com/anandaram240-wq/yatrika-ai) |
| **2** | **Presentation (PPT Deck)** | 12-Slide Structured PPT Outline | [`docs/HACKATHON_PRESENTATION_DECK.md`](docs/HACKATHON_PRESENTATION_DECK.md) |
| **3** | **Deployed Project** | Live, working URL | [https://yatrika-ai.vercel.app](https://yatrika-ai.vercel.app) |
| **4** | **Explanation Video Script** | 3–5 min voice-over only script | [`docs/VIDEO_SCRIPT_VOICEOVER.md`](docs/VIDEO_SCRIPT_VOICEOVER.md) |

---

*YatriKa AI — Code. Create. Celebrate Karnataka.*
