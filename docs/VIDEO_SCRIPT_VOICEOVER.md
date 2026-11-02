# YatriKa AI — Explanation Video Script (Voice-Over Demo)
### Total Duration: 4 Minutes 45 Seconds (Voice-Over Screen Recording)
> **Hackathon:** Kannada Digital Innovation Hackathon 2026 (NIE Mysuru / HackerRank Campus Crew)  
> **Problem Statement:** Problem Statement 06 — Travel & Tourism: AI Travel Planner for Karnataka  
> **Live Production URL:** https://yatrika-ai.vercel.app  

---

### [0:00 – 0:45] Problem Statement and Requirements
**On Screen:**  
*Open browser tab at `https://yatrika-ai.vercel.app`. The clean, dark-mode YatriKa V9.0 platform is visible with the banner: "YATRIKA V9.0 · ಕರ್ನಾಟಕ ಪ್ರಯಾಣ ವೇದಿಕೆ".*

**Voice-Over:**  
"Hello judges and innovators. Welcome to our submission for the **Kannada Digital Innovation Hackathon 2026**, organized by the HackerRank Campus Crew at NIE Mysuru.

We have locked strictly onto **Problem Statement 06: Travel & Tourism — AI Travel Planner for Karnataka**.

Karnataka possesses extraordinary cultural and geographical richness—from the dramatic granite boulder ruins of Hampi to the misty peaks of the Western Ghats and the coastal shores of Gokarna. However, travellers attempting to explore Karnataka face severe hurdles: fragmented last-mile transit, unverified temple darshan timings, hazardous granite trails, and confusing archaeological buffer zones. The hackathon challenge demands an intelligent travel planner that constructs authentic, personalized Karnataka itineraries tailored to real-world time, budget, and experience requirements."

---

### [0:45 – 1:30] Existing Systems and Their Gaps
**On Screen:**  
*Cursor points to the top destination search bar and switches between the quick destination pills.*

**Voice-Over:**  
"Today, travellers turn to two options: commercial travel booking portals or generic AI chatbots like ChatGPT. Both fail in the context of Karnataka:

First, commercial booking apps care only about hotel commissions—they offer zero heritage insight or topographical awareness.

Second, generic AI trip planners hallucinate. They create bulleted lists assuming an impossible 80 km/h driving speed across winding Western Ghats passes. They tell travellers to visit temples right in the middle of afternoon sanctum closures, and they recommend booking non-existent luxury hotels inside protected UNESCO archaeological zones where construction is strictly prohibited.

Worst of all, almost every existing travel app forces the user behind a gated questionnaire—demanding emails, dates, and budgets before showing a single piece of geographical truth. YatriKa AI completely re-engineers this experience."

---

### [1:30 – 3:30] Our Solution: Live Product Demo & The 8 Workspaces
**On Screen:**  
*1. Demonstrates multilingual search: types `ಹಂಪಿ` (Kannada script) into the search bar and clicks 'Explore'. The view smoothly resolves Hampi's surveyed WGS84 bounding box.*  
*2. Clicks through the 4 cluster filter pills: Sacred Centre (7), Royal Centre (6), Vittala Complex (3), Natural & Cultural (4).*  
*3. Toggles 3D Terrain elevation mode on the MapLibre map. Clicks 'Play Cinematic Tour'—the camera automatically glides between monuments without UI lag.*  
*4. Opens the monument inspector drawer for Virupaksha Temple, clicks '+ Add to Journey Builder'.*  
*5. Switches to Workspace C: Journey Builder, demonstrating cluster-coherent sequencing.*  
*6. Switches to Workspace D: Feasibility Engine, switches departure hub between Bengaluru (SBC) and Hosapete (HPT), showing the dynamic viability assessment badge change to 'VERIFIED VIABLE'.*  
*7. Scrolls through Workspaces E, F, G, and H, clicking the Wikimedia Commons image to launch the high-resolution lightbox.*

**Voice-Over:**  
"YatriKa V9.0 is a **Destination-First Geographical Intelligence Platform** organized across 8 dedicated workspaces:

In **Workspace A**, we have a zero-gating policy. You can search destinations in English, native Kannada script—like typing 'ಹಂಪಿ'—or common phonetic transliterations. The engine immediately resolves the official surveyed WGS84 coordinates and district metadata.

In **Workspace B**, you see our interactive 3D destination explorer. We have cataloged all 18 major Hampi monuments across 4 geographical clusters: the Sacred Centre, the Royal Centre, the Vittala Complex, and the Natural & Cultural zone. By toggling our 3D DEM terrain button, you see the actual elevation and granite boulder ridge contours. Our automated camera tour glides across monuments using native WebGL lifecycle hooks with zero React render loops, ensuring 60 frames-per-second performance.

In **Workspace C**, our Journey Builder automatically sequences monuments by spatial cluster, ensuring travellers don't waste hours zigzagging between the Tungabhadra River and Kamalapura in 38-degree heat.

In **Workspace D**, we present our Feasibility Engine. Notice that we never silently track your location—GPS acquisition is strictly opt-in on explicit user click. Travellers can select major Karnataka transit hubs like KSR Bengaluru City Junction or Hosapete Junction. The engine deterministically validates whether your days and budget realistically support the journey.

In **Workspace E**, we verify real South Western Railway services—like the Hampi Express 16591—alongside KSRTC Kamalapura shuttles and official battery-operated EV buggies.

In **Workspace F**, we enforce UNESCO buffer compliance, guiding visitors to legitimate stays across Kamalapura, Hosapete, and licensed Anegundi homestays.

In **Workspace G**, we provide crucial safety intelligence: Tungabhadra whirlpool hazards, granite dusk descent warnings, drone prohibitions, and direct links to emergency helplines 112 and 1363.

And in **Workspace H**, every photo and data point has verified provenance—sourced from Wikimedia Commons under Creative Commons licenses with full photographer attribution and original resolution metrics."

---

### [3:30 – 4:30] Technology Stack and Architecture
**On Screen:**  
*Shows the code repository, test execution terminal (`npm test` showing 46 passed files, 288/288 tests passed), and the architecture flow diagram.*

**Voice-Over:**  
"Under the hood, YatriKa V9.0 is built on an enterprise-grade stack:
- **React 19** paired with **Vite 6** and **TypeScript 5.7** in strict mode, achieving instant HMR and rock-solid type safety.
- **Tailwind CSS v4** featuring custom Karnataka heritage stone tokens and a strict WCAG 2.2 AA reduced-motion baseline.
- **MapLibre GL JS** delivering client-side 3D raster-DEM terrain rendering without heavy Cesium or Three.js dependencies.
- Our test suite boasts **46 test files and 288 unit and integration tests with a 100% pass rate** in Vitest.
- Our automated AST code audit confirmed **zero dead controls**—every button, link, and interactive element across the entire application is fully wired to verified state."

---

### [4:30 – 5:00] Conclusion and Future Scope
**On Screen:**  
*Returns to the live application on `https://yatrika-ai.vercel.app`, showing the seamless responsiveness on both desktop and mobile viewports.*

**Voice-Over:**  
"In conclusion, YatriKa V9.0 transforms the travel planning paradigm. We don't generate hallucinations; we verify the real Karnataka journey.

Our architecture is directly scalable across all 31 Karnataka districts—expanding next into the Chalukyan circuits of Badami, Pattadakal, and Aihole, and the Hoysala temples of Belur and Halebidu.

You can test the live application right now at **https://yatrika-ai.vercel.app**.

Thank you, and Celebrate Kannada!"
