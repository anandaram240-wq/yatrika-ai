# 🎙️ YatriKa AI — 180-Second Winning Hackathon Demo Script
**Second-by-Second Walkthrough for Live Pitch Presentation**

---

## The Pitch Narrative Arc

**The Problem:** Over 20 million tourists visit Karnataka each year, yet the moment they leave Bengaluru, they hit language barriers, fragmented government rules, and total cellular blackouts in the Western Ghats.  
**The Transformation:** YatriKa AI is Karnataka's Kannada-first intelligent travel companion. It listens to you in colloquial Kannada, plans an authentic itinerary with verified government pricing, and keeps your entire journey safe and navigable without internet.

---

## Chronological Timecode & Actions

| Time | Presenter Spoken Script | On-Screen Action | Fallback Strategy |
| :---: | :--- | :--- | :--- |
| **0:00 – 0:20** | *"Good morning respected judges. Karnataka has 6 cultural zones, 31 districts, and 3 UNESCO sites. But when tourists visit, Google Maps gives generic pins, MakeMyTrip pushes commercial ads, and apps crash the moment you enter the Western Ghats with zero internet. We built YatriKa AI."* | Show clean daylight split-screen interface at `http://localhost:5173/`. | Show pre-recorded 4K screenshot if projector flickers. |
| **0:20 – 0:50** | *"Let's test our Kannada Multimodal Voice Companion. A tourist can speak naturally in any dialect."* Click the 🎙️ mic button in the omnibar and speak (or click sample): *"ಮೈಸೂರಿನಿಂದ ಚಿಕ್ಕಮಗಳೂರಿಗೆ ಐದು ಸಾವಿರ ರೂಪಾಯಿ ಬಜೆಟ್‌ನಲ್ಲಿ ಪ್ಲಾನ್ ಮಾಡಿ"* | Click 🎙️ button. The modal opens. Speech transcript appears, intent classifies to `route_search`, budget extracts to `₹5,000`, origin maps to `ಮೈಸೂರು`, destination to `ಚಿಕ್ಕಮಗಳೂರು`. Click **✓ Apply Plan**. | If mic is blocked, click the first sample prompt pill. |
| **0:50 – 1:20** | *"Look at the map. In under 15ms, YatriKa loads the complete scenic corridor. It identifies the Kaimara Check-post eco-cess, issues an advisory for the 18 hairpin bends on Mullayanagiri Road, itemizes the budget, and provides in-context Kannada voice phrases at every stop."* | Point out the Route Corridor Advisory card, click the audio speaker icon on Mullayanagiri card (*"ಬೆಟ್ಟದ ಮೇಲೆ ಮಂಜು ಬಹಳ ಇರುತ್ತಾ?"*). | Local browser audio plays instantly. |
| **1:20 – 1:50** | *"Now for the ultimate test: Western Ghats survival mode. What happens when your mobile network drops completely between Mudigere and Mullayanagiri?"* | Click **📡 Offline Pack** in the topbar. Click **💾 Save Trip Pack (Offline)**. Show the green `Offline Trip Pack Cached` badge, the 112/108/1077 emergency directory, and Kannada survival cards. | Storage is cached in IndexedDB instantly. |
| **1:50 – 2:20** | *"Notice government policy alignment: We audited the Shakti Scheme backed by Karnataka Govt. Order No. TRAN 38 TEP 2023, showing women travelers where bus fares are 100% free vs paid luxury Airawat exceptions."* | Switch to **🚌 Shakti Scheme Audit** tab. Show itemized exemptions and citations. | Show markdown export. |
| **2:20 – 2:45** | *"And for the road tour: YatriKa includes a full 60 FPS physics road simulation with live compass bearing, dynamic traveled trail lighting, and interactive HUD flight deck."* | Click **▶️ Play Route Tour (60 FPS)**. The 🚗 car marker moves smoothly along the highway with illuminated headlights and radar pulses. | Scrub the HUD timeline slider. |
| **2:45 – 3:00** | *"YatriKa AI is built on React 19, TypeScript, and MapLibre GL with 63 passing tests and 0 API dependencies. Code. Create. Celebrate Kannada. ಧನ್ಯವಾದಗಳು!"* | Show terminal with `63 / 63 passing tests` and clean `npm run build`. | End on high energy. |
