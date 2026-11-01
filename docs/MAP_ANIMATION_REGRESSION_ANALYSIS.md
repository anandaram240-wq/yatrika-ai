# YATRIKA AI: MAP ANIMATION & TILE PROVIDER REGRESSION ANALYSIS
## Forensic Git History Audit & Recovery Strategy for Release V8.3

**Document Version:** 1.0.0  
**Date:** 2026-11-01  
**Target Repository:** `anandaram240-wq/yatrika-ai`  
**Branch:** `rescue/v8.2-complete-reconstruction`  
**Classification:** Core Functional Recovery & Forensic Audit  

---

## 1. Executive Summary

A comprehensive forensic audit of the Git commit history from the initial commit through HEAD (`4163bea`) was performed to trace the origin, evolution, and subsequent regression of YatriKa AI's 60 FPS cinematic map tour animation, interactive vehicle HUD, and map tile cartography.

The investigation conclusively identified:
- **Last Known Fully Functional Animation Commit:** [`426fe6f88114196b81aa1941d5746efef17a27a4`](#commit-426fe6f) (`fix(camera-smoothing): exponential bearing LERP easing and auto-smooth highway order button to eliminate rapid jumping`) preceded by [`b4292d91a04f5ec28d1e8fc22056fe133db58fd0`](#commit-b4292d9) (`feat(theme-animation): restore royal Karnataka heritage theme and implement 60 FPS cinematic road vehicle simulation with interactive HUD`).
- **Commit Introducing the Regression:** [`7c8591a1156620a4ba5743cd3d267d10ee1f6e04`](#commit-7c8591a) (`feat(design-reset): complete product design reset with magazine editorial journal and workspace`).
- **Tile Blocking Defect:** Direct inclusion of raw `https://tile.openstreetmap.org/{z}/{x}/{y}.png` as a fallback raster tile source in [`4163bea`](#commit-4163bea), violating OpenStreetMap Foundation Tile Usage Policies and triggering access-blocked placeholder image responses.

---

## 2. Commit Forensics & Timeline

### Commit 1: Genesis of 60 FPS Cinematic Simulation
- **Commit SHA:** `b4292d91a04f5ec28d1e8fc22056fe133db58fd0`
- **Author:** `anandaram240-wq <anandakiccha240@gmail.com>`
- **Date:** Fri Oct 30 08:22:35 2026 +0530
- **Summary:** Introduced the complete 60 FPS MapLibre camera tour with:
  1. `nt-vehicle-marker` DOM element with spinning radar, headlights, and emoji vehicle chassis rotating with geographical route bearing (`getCoordBearing`).
  2. Traveled polyline GeoJSON layer (`nt-route-traveled`) dynamically rendered behind the vehicle.
  3. Interactive Tour Flight Deck HUD (`.nt-tour-flight-deck`) with:
     - Real-time speedometer telemetry (`telemetrySpeed` in km/h) and altitude gauge (`telemetryAltitude` in m).
     - Timeline scrubber slider (`handleScrubTour`) allowing instant dragging across the entire route.
     - Play / Pause / Resume controls (`handleTogglePlayPause`).
     - Previous / Next waypoint navigation (`handlePrevStop`, `handleNextStop`).
     - Simulation speed multipliers (`1x`, `2x`, `5x`).
     - Camera chase mode toggle (`🎥 3D Chase` vs `🗺️ Free Cam`).
  4. Waypoint arrival celebration toast (`.nt-waypoint-celebration-toast`) with destination thumbnail, bilingual titles, and audio playback.

### Commit 2: Camera Smoothing Optimization
- **Commit SHA:** `426fe6f88114196b81aa1941d5746efef17a27a4`
- **Author:** `anandaram240-wq <anandakiccha240@gmail.com>`
- **Date:** Fri Oct 30 12:05:46 2026 +0530
- **Summary:** Added exponential bearing LERP easing (`currentCameraBearingRef.current += diff * 0.10`) to eliminate camera jitter on sharp highway turns and ghat hairpin bends.

### Commit 3: Architectural Regression
- **Commit SHA:** `7c8591a1156620a4ba5743cd3d267d10ee1f6e04`
- **Author:** `anandaram240-wq <anandakiccha240@gmail.com>`
- **Date:** Sun Nov 1 12:14:06 2026 +0530
- **Summary:** In refactoring `src/App.tsx` into a modular split architecture (`EditorialJournalHome.tsx`, `TripPlanningWorkspace.tsx`, `DestinationDetailDrawer.tsx`):
  1. The entire Tour Flight Deck HUD JSX markup was dropped from the DOM tree.
  2. State variables `isTourPaused`, `tourProgressRatio`, `tourSpeedMultiplier`, `isCameraChase`, `telemetrySpeed`, `telemetryAltitude`, and `arrivedStop` were deleted.
  3. Handler functions `handleTogglePlayPause`, `handleScrubTour`, `handleNextStop`, and `handlePrevStop` were excised.
  4. Only a vestigial `handleStartTour` and `handleStopTour` were retained in `App.tsx`, attached to a single button in `TripPlanningWorkspace.tsx`.
  5. Because the HUD was absent, users could not pause, scrub, adjust speed, view telemetry, or navigate between waypoints.

### Commit 4: OpenStreetMap Tile Access Blocking
- **Commit SHA:** `4163bea`
- **Date:** Sun Nov 1 18:05:32 2026 +0530
- **Root Cause:** When vector CDN endpoints timed out, MapLibre fell back to `FALLBACK_RASTER_STYLE` pointing to `https://tile.openstreetmap.org/{z}/{x}/{y}.png`. OpenStreetMap Foundation enforces strict User-Agent, referer, and volume policies. Requests originating from browser origins without approved headers receive HTTP 403 or blocked image tiles depicting "Access Blocked / Tile Usage Policy Violation".

---

## 3. Structural Comparison: Working vs Regressed State

| Capability | Working Baseline (`426fe6f`) | Regressed State (`HEAD`) | V8.3 Restored State |
| :--- | :--- | :--- | :--- |
| **Interactive Tour HUD** | Present (`.nt-tour-flight-deck`) with telemetry & scrubber | Missing (stripped during split-screen refactor) | **Restored** directly in `TripPlanningWorkspace` map viewport |
| **Play / Pause / Resume** | Yes (`❚❚` / `▶` toggle with `cancelAnimationFrame`) | No (Only binary Start/Stop) | **Restored** with explicit FSM: `idle`, `playing`, `paused`, `completed` |
| **Route Scrubber Slider** | Yes (0% to 100% interactive range input) | No | **Restored** with real-time distance and percentage sync |
| **Speed Multipliers** | Yes (`1x`, `2x`, `5x`) | Hardcoded (~80 km/h) | **Restored** with accessible speed pills (`1x`, `2x`, `5x`) |
| **Step Next / Prev Waypoint** | Yes (`⏮` / `⏭`) | None | **Restored** with stop milestone seeking |
| **Moving Vehicle Marker** | `nt-vehicle-marker` (radar, headlights, chassis) | Present in ref but minimal HUD integration | **Restored** with rotation, altitude telemetry, and mountain detection |
| **Camera Chase vs Free Cam** | Toggleable (`🎥 3D Chase` / `🗺️ Free Cam`) | Always locked to chase | **Restored** with user override option |
| **Milestone Celebration Toast**| Yes (photo + bilingual lore + audio) | None | **Restored** at each itinerary stop |
| **Map Tile Provider** | OpenFreeMap (unstable uptime) | OSM Raster (blocked by OSM policy) | **Authorized CARTO / MapTiler Cloud with domain fallback; zero blocked tiles** |

---

## 4. Recovery & Restoration Plan

1. **Map Tile Provider Hardening:**
   - Eliminate `https://tile.openstreetmap.org` completely.
   - Wire `VITE_MAPTILER_API_KEY` when supplied in environment for official MapTiler Cloud vector cartography.
   - Maintain resilient high-uptime CARTO Voyager (`https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json`) and Dark Matter vector styles as zero-key default.
   - For raster fallback, use CARTO Voyager raster tiles (`https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png`), which do not block browser referers.
2. **Animation Architecture Re-integration:**
   - Migrate tour state machine and flight deck controls into `src/components/TripPlanningWorkspace.tsx` and `src/App.tsx`.
   - Restore `tourProgressRatio`, `isTourPaused`, `tourSpeedMultiplier`, `isCameraChase`, `telemetrySpeed`, `telemetryAltitude`, and `arrivedStop`.
   - Implement accessibility features: `prefers-reduced-motion` compliance, pause/resume keyboard shortcuts, and full screen-reader ARIA metadata.
3. **Control Audit & Dead Control Elimination:**
   - Execute an exhaustive inventory of all visible interactive elements across all pages.
   - Wire or eliminate every inactive button, ensuring 100% functional closure.
