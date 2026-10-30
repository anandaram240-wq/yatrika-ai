# 🛡️ YatriKa AI — Security, Privacy & Data Governance Audit
**Section 09 & 10: Adversarial Testing & Privacy Review**

---

## 1. Privacy Architecture (Zero Unnecessary Data Collection)

1. **Client-Side Speech Processing:**
   - Raw microphone audio is processed in-browser via the standardized Web Speech API (`SpeechRecognition`).
   - No audio recordings or voice biometrics are ever streamed to or stored on external servers.
2. **GPS Geolocation Consent:**
   - User GPS coordinates are retrieved strictly upon explicit click of the `"🎯 Current GPS"` button via `navigator.geolocation.getCurrentPosition`.
   - Coordinates are held in ephemeral React component memory (`useState`) and never transmitted to any telemetry or third-party tracking server.
3. **Local-First Persistence:**
   - Saved offline trip packs are stored locally in the user's browser sandbox using native IndexedDB (`yatrika_offline_survival_db`).
   - Trips are not tied to a mandatory user login, phone number, or email tracker.

---

## 2. Adversarial & Threat Model Review

| Threat Scenario | Vector | Mitigation in YatriKa AI | Verification |
| :--- | :--- | :--- | :--- |
| **Microphone Permission Denial** | User blocks microphone in browser | `speechRecognitionAdapter.ts` catches `not-allowed` event and presents a friendly error banner with typed fallback | ✅ Passed |
| **GPS Permission Denial** | User denies location access | Falls back gracefully to the default Bengaluru Gateway without breaking the route engine | ✅ Passed |
| **IndexedDB Quota / Private Browsing** | IndexedDB unavailable in incognito mode | `OfflineStorageRepository.ts` falls back to in-memory `Map` with zero crash | ✅ Passed |
| **Malicious URL Query Injection** | User passes malformed query parameters in URL (`?stops=../../`) | `parseTripFromQueryString` filters against verified POI registry whitelist (`getPoiById`) | ✅ Passed |
| **Storage Cache Poisoning** | Local storage tampering | Offline trip packs compute and verify a CRC32 checksum before rendering | ✅ Passed |
