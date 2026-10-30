# 🔍 YatriKa AI — Data Provenance & Official Verification Audit
**Section 10: Real-World Data Integrity Engine**

---

## 1. Verified Official Sources Register

Every entry fee, opening hour, forest regulation, and government order in YatriKa AI is traced directly to its official source:

| Data Domain | Official Authority | Source Provenance Citation | Verified Rate / Rule | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Hampi World Heritage Site** | Archaeological Survey of India (ASI) | [asi.nic.in](https://asi.nic.in) / Hampi Circle E-Ticketing | ₹40 cashless / ₹50 cash (Indians); ₹600 cashless (Foreigners); Under-15 Free | ✅ **VERIFIED** |
| **Mysuru Palace** | Mysore Palace Board & KSTDC | [mysorepalace.karnataka.gov.in](https://mysorepalace.karnataka.gov.in) | ₹100 Adults; ₹50 Children (10-18); Free <10; Illumination Sun 7-7:45 PM | ✅ **VERIFIED** |
| **Mullayanagiri Eco-Pass** | Karnataka Forest Department (KFD) | Aranya Vihaara Kaimara Check-post | ₹50 per vehicle eco-cess; Ghat road open 06:00 AM – 06:00 PM | ✅ **VERIFIED** |
| **Kudremukh National Park** | Karnataka Ecotourism Board (KEDB) | [aranyavihaara.karnataka.gov.in](https://aranyavihaara.karnataka.gov.in) | Strict cap of 50 trekkers/day; ₹600 permit; No plastic entry | ✅ **VERIFIED** |
| **Shakti Scheme Bus Fares** | Transport Dept., Govt. of Karnataka | **Govt. Order No. TRAN 38 TEP 2023** | ₹0 zero-fare for Karnataka resident women on KSRTC/BMTC/NWKRTC/KKRTC Ordinary services | ✅ **VERIFIED** |
| **Emergency Helplines** | Home & Health Depts., Govt. of Karnataka | State Emergency Response Center | 112 (Police/Fire/Ambulance), 108 (Medical), 1077 (Disaster), 1926 (Forest) | ✅ **VERIFIED** |

---

## 2. Integrity Verification Workflow

1. **Deterministic Calculation:** No AI hallucination in pricing. All budgets are calculated using verified unit tariffs (`TIER_RATES`).
2. **Offline Package Checksum:** Every downloaded trip pack computes a CRC32 checksum over the itinerary stops and road geometry. If the payload is modified or corrupted in IndexedDB, the verification check flags it immediately.
3. **No Unsubstantiated Scraping:** We avoid brittle scraping of private portals. Where public APIs are unreleased, we provide verified official guidance and direct phone/web channels.
