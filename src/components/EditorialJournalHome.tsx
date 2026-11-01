/**
 * src/components/EditorialJournalHome.tsx
 * Premium Editorial Karnataka Travel Journal & Destination Discovery Home.
 * Photography-led, culturally authentic, and free of generic AI dashboard clutter.
 */

import React, { useState, useMemo } from 'react';
import { KARNATAKA_POIS, KARNATAKA_GATEWAY_ORIGINS, UserOriginOption } from '../data/karnatakaTravelRegistry';
import { getAuthenticDestinationPhoto } from '../data/karnatakaPhotoRegistry';
import { VERIFIED_KARNATAKA_STAYS } from '../stays/accommodationRegistry';
import { VERIFIED_KARNATAKA_RESTAURANTS } from '../dining/restaurantRegistry';

export interface EditorialJournalHomeProps {
  uiLanguage: 'kn' | 'en';
  userOrigin: UserOriginOption;
  onChangeOrigin: (origin: UserOriginOption) => void;
  onSelectCircuit: (circuitId: string) => void;
  onSelectPoiDetail: (poiId: string) => void;
  onAddPoiToTrip: (poiId: string) => void;
  itineraryStopIds: string[];
  onOpenVoice: () => void;
  onSearchSubmit: (prompt: string) => void;
  onEnterWorkspace: () => void;
}

export const EditorialJournalHome: React.FC<EditorialJournalHomeProps> = ({
  uiLanguage,
  userOrigin,
  onChangeOrigin,
  onSelectCircuit,
  onSelectPoiDetail,
  onAddPoiToTrip,
  itineraryStopIds,
  onOpenVoice,
  onSearchSubmit,
  onEnterWorkspace,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredPois = useMemo(() => {
    return KARNATAKA_POIS.filter((poi) => {
      if (selectedRegion !== 'all' && poi.macroRegion !== selectedRegion) return false;
      if (selectedCategory !== 'all' && poi.category !== selectedCategory) return false;
      if (searchInput.trim()) {
        const q = searchInput.toLowerCase();
        const matchesName = poi.name.toLowerCase().includes(q) || poi.nameKannada.includes(q);
        const matchesDistrict = poi.district.toLowerCase().includes(q);
        const matchesRegion = poi.macroRegion.toLowerCase().includes(q);
        return matchesName || matchesDistrict || matchesRegion;
      }
      return true;
    });
  }, [selectedRegion, selectedCategory, searchInput]);

  const handleSearchForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchSubmit(searchInput.trim());
    } else {
      onEnterWorkspace();
    }
  };

  const getPoiPhoto = (poiId: string, category?: string, name?: string, district?: string) => {
    return getAuthenticDestinationPhoto(poiId, category, name, district).imageUrl;
  };

  return (
    <div className="yt-home-container">
      {/* ================= 1. HERO COVER SECTION ================= */}
      <section className="yt-hero-section">
        <div className="yt-hero-backdrop">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c5/Chennakeshava_temple_Belur_761.jpg"
            alt="Chennakeshava Temple Belur Hoysala Stone Architecture"
            className="yt-hero-image"
          />
          <div className="yt-hero-gradient-overlay" />
        </div>

        <div className="yt-hero-content">
          <div className="yt-hero-kicker">
            <span className="yt-kicker-dot"></span>
            <span className="font-kannada">ಕರ್ನಾಟಕ ಪಾರಂಪರಿಕ ಯಾತ್ರೆ</span>
            <span>•</span>
            <span>Curated Karnataka Travel Journal</span>
          </div>

          <h1 className="yt-hero-headline font-kannada">
            {uiLanguage === 'kn' ? (
              <>ಕರ್ನಾಟಕವನ್ನು ಅನ್ವೇಷಿಸುವ<br /><span className="yt-highlight-gold">ಅದ್ಭುತ ಪಯಣ</span></>
            ) : (
              <>Where would you like to travel in <span className="yt-highlight-gold">Karnataka</span>?</>
            )}
          </h1>

          <p className="yt-hero-subtitle">
            {uiLanguage === 'kn'
              ? 'ಹೊಯ್ಸಳರ ಶಿಲ್ಪಕಲಾ ವೈಭವದಿಂದ ಮಲೆನಾಡಿನ ಕಾಫಿ ಗಿರಿಶಿಖರಗಳವರೆಗೆ, ಅರಬ್ಬಿ ಸಮುದ್ರದ ಕಡಲತೀರದಿಂದ ಬಾದಾಮಿ-ಹಂಪಿಯ ಯುನೆಸ್ಕೋ ಪಾರಂಪರಿಕ ತಾಣಗಳವರೆಗೆ — ನಿಮ್ಮ ಪ್ರವಾಸವನ್ನು ಸುಲಭವಾಗಿ ಯೋಜಿಸಿ.'
              : 'From 12th-century Hoysala soapstone poetry in Belur to the mist-covered Western Ghats of Chikkamagaluru, and sun-warmed sands of the Karavali coast.'}
          </p>

          {/* Elevated Search Console */}
          <form className="yt-search-console" onSubmit={handleSearchForm}>
            <div className="yt-search-field-main">
              <span className="yt-search-icon">🔍</span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={
                  uiLanguage === 'kn'
                    ? "ಉದಾಹರಣೆಗೆ: 'ಬೇಲೂರು ಚೆನ್ನಕೇಶವ ದೇವಾಲಯ' ಅಥವಾ 'ಮುಳ್ಳಯ್ಯನಗಿರಿ ಚಾರಣ'..."
                    : "Search destination, e.g. 'Belur Hoysala Temples' or 'Mullayanagiri Peak'..."
                }
                aria-label="Search Karnataka destinations"
              />
            </div>

            <div className="yt-search-divider" />

            <div className="yt-search-field-origin">
              <span className="yt-origin-icon">📍</span>
              <div className="yt-origin-picker">
                <span className="yt-origin-caption">{uiLanguage === 'kn' ? 'ಆರಂಭಿಕ ಸ್ಥಳ' : 'Starting From'}</span>
                <select
                  value={userOrigin.id}
                  onChange={(e) => {
                    const found = KARNATAKA_GATEWAY_ORIGINS.find((o) => o.id === e.target.value);
                    if (found) onChangeOrigin(found);
                  }}
                  className="yt-origin-select"
                >
                  {KARNATAKA_GATEWAY_ORIGINS.slice(0, 8).map((orig) => (
                    <option key={orig.id} value={orig.id}>
                      {orig.name.split('(')[0].trim()} ({orig.nameKannada})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              className="yt-search-btn-voice"
              onClick={onOpenVoice}
              title={uiLanguage === 'kn' ? 'ಕನ್ನಡ ಧ್ವನಿ ಸಹಾಯಕ' : 'Speak in Kannada'}
            >
              🎙️
            </button>

            <button type="submit" className="yt-search-btn-submit">
              <span>{uiLanguage === 'kn' ? 'ಪ್ರವಾಸ ಯೋಜನೆ' : 'Plan Trip'}</span>
              <span className="yt-arrow-icon">→</span>
            </button>
          </form>

          {/* Quick inspiration chips */}
          <div className="yt-hero-chips">
            <span className="yt-chips-label">{uiLanguage === 'kn' ? 'ತ್ವರಿತ ಪಥಗಳು:' : 'Quick circuits:'}</span>
            <button
              type="button"
              className="yt-chip-item featured"
              onClick={() => onSelectCircuit('circuit-golden-bengaluru-mullayanagiri')}
            >
              🌟 {uiLanguage === 'kn' ? 'ಸುವರ್ಣ ಪ್ರವಾಸ (ಹಾಸನ-ಬೇಲೂರು-ಮುಳ್ಳಯ್ಯನಗಿರಿ)' : 'The Golden Corridor'}
            </button>
            <button
              type="button"
              className="yt-chip-item"
              onClick={() => onSelectCircuit('circuit-unesco')}
            >
              🏛️ {uiLanguage === 'kn' ? 'ಯುನೆಸ್ಕೋ ಹಂಪಿ & ಬಾದಾಮಿ' : 'UNESCO Hampi & Badami'}
            </button>
            <button
              type="button"
              className="yt-chip-item"
              onClick={() => onSelectCircuit('circuit-karavali')}
            >
              🌊 {uiLanguage === 'kn' ? 'ಕರಾವಳಿ ಕಡಲತೀರ' : 'Karavali Coast'}
            </button>
          </div>
        </div>
      </section>

      {/* ================= 2. CURATED TRAVEL CIRCUITS ================= */}
      <section className="yt-section yt-circuits-section">
        <div className="yt-section-header">
          <div>
            <div className="yt-section-eyebrow font-kannada">ಆಯ್ದ ಮಾರ್ಗಗಳು</div>
            <h2 className="yt-section-title">
              {uiLanguage === 'kn' ? 'ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಪ್ರವಾಸ ಪಥಗಳು' : 'Iconic Karnataka Journeys'}
            </h2>
            <p className="yt-section-desc">
              {uiLanguage === 'kn'
                ? 'ಪರಿಶೀಲಿಸಿದ ರಸ್ತೆ ಸಂಪರ್ಕಗಳು, ಇಂಧನ ವೆಚ್ಚ ಮತ್ತು ಶಕ್ತಿ ಯೋಜನೆಯ ಲೆಕ್ಕಾಚಾರದೊಂದಿಗೆ ರೂಪಿಸಲಾದ ಸಂಪೂರ್ಣ ಪ್ರವಾಸಗಳು.'
                : 'Carefully curated journeys with verified highway routes, scenic elevation stops, and transit timings.'}
            </p>
          </div>

          <button
            type="button"
            className="yt-btn-view-all"
            onClick={onEnterWorkspace}
          >
            {uiLanguage === 'kn' ? 'ಎಲ್ಲಾ ಪಥಗಳನ್ನು ವೀಕ್ಷಿಸಿ →' : 'Open Trip Workspace →'}
          </button>
        </div>

        <div className="yt-circuits-grid">
          {/* Circuit 1: The Golden Corridor (Flagship) */}
          <article className="yt-circuit-card featured" onClick={() => onSelectCircuit('circuit-golden-bengaluru-mullayanagiri')}>
            <div className="yt-circuit-image-box">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/5d/Peaks_of_Mullayanagiri.jpg"
                alt="Mullayanagiri Western Ghats Peak"
                className="yt-circuit-img"
              />
              <span className="yt-circuit-badge-gold">🌟 Flagship Journey</span>
              <span className="yt-circuit-duration">3 Days • 274 km</span>
            </div>
            <div className="yt-circuit-body">
              <div className="yt-circuit-route font-kannada">
                ಬೆಂಗಳೂರು ➔ ಹಾಸನ (ಶೆಟ್ಟಿಹಳ್ಳಿ) ➔ ಬೇಲೂರು ➔ ಚಿಕ್ಕಮಗಳೂರು ➔ ಮುಳ್ಳಯ್ಯನಗಿರಿ
              </div>
              <h3 className="yt-circuit-name">The Royal Golden Corridor</h3>
              <p className="yt-circuit-summary">
                Experience submerged Gothic architecture at Shettihalli, 12th-century Hoysala soapstone poetry at Belur, and sunrise above the clouds at Mullayanagiri peak (1,930m).
              </p>
              <div className="yt-circuit-footer">
                <span className="yt-circuit-stat">
                  <strong>₹1,470</strong> est. per person with Shakti
                </span>
                <span className="yt-circuit-cta">Explore Route →</span>
              </div>
            </div>
          </article>

          {/* Circuit 2: UNESCO Heritage */}
          <article className="yt-circuit-card" onClick={() => onSelectCircuit('circuit-unesco')}>
            <div className="yt-circuit-image-box">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/bb/Stone_Chariot_at_Hampi%2C_Karnataka.jpg"
                alt="Stone Chariot Hampi"
                className="yt-circuit-img"
              />
              <span className="yt-circuit-badge">World Heritage</span>
              <span className="yt-circuit-duration">4 Days • 430 km</span>
            </div>
            <div className="yt-circuit-body">
              <div className="yt-circuit-route font-kannada">
                ಹೊಸಪೇಟೆ ➔ ಹಂಪಿ ವಿಠ್ಠಲ ➔ ಬಾದಾಮಿ ಗುಹೆಗಳು ➔ ಪಟ್ಟದಕಲ್ಲು ➔ ಐಹೊಳೆ
              </div>
              <h3 className="yt-circuit-name">UNESCO Stone Architecture Trail</h3>
              <p className="yt-circuit-summary">
                The world’s grandest open-air museum: boulder-strewn Tungabhadra ruins of Vijayanagara, 6th-century Chalukyan cliff-carved caves, and temple cradles.
              </p>
              <div className="yt-circuit-footer">
                <span className="yt-circuit-stat">4 UNESCO World Monuments</span>
                <span className="yt-circuit-cta">Explore Route →</span>
              </div>
            </div>
          </article>

          {/* Circuit 3: Malnad Mist & Waterfalls */}
          <article className="yt-circuit-card" onClick={() => onSelectCircuit('circuit-chikkamagaluru')}>
            <div className="yt-circuit-image-box">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/f5/Jog_Falls_05092016.jpg"
                alt="Jog Falls Shravathi River"
                className="yt-circuit-img"
              />
              <span className="yt-circuit-badge">Western Ghats</span>
              <span className="yt-circuit-duration">3 Days • 290 km</span>
            </div>
            <div className="yt-circuit-body">
              <div className="yt-circuit-route font-kannada">
                ಚಿಕ್ಕಮಗಳೂರು ➔ ಕುದುರೆಮುಖ ➔ ಶೃಂಗೇರಿ ➔ ಅಗುಂಬೆ ➔ ಜೋಗ ಜಲಪಾತ
              </div>
              <h3 className="yt-circuit-name">Malnad Mist & Coffee Trails</h3>
              <p className="yt-circuit-summary">
                Drive through ancient Shola grasslands, sacred Sharada Peetham, India’s Cherrapunji at Agumbe, and the 253-meter roaring plunge of Jog Falls.
              </p>
              <div className="yt-circuit-footer">
                <span className="yt-circuit-stat">Ghat-Shield Verified</span>
                <span className="yt-circuit-cta">Explore Route →</span>
              </div>
            </div>
          </article>

          {/* Circuit 4: Karavali Coastline */}
          <article className="yt-circuit-card" onClick={() => onSelectCircuit('circuit-karavali')}>
            <div className="yt-circuit-image-box">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/PXL_20260103_101009613_People_and_Beach_Om_Beach_Gokarna%2C_Karnataka_35.jpg"
                alt="Om Beach Gokarna Coast"
                className="yt-circuit-img"
              />
              <span className="yt-circuit-badge">Coastal Sanctuary</span>
              <span className="yt-circuit-duration">3 Days • 310 km</span>
            </div>
            <div className="yt-circuit-body">
              <div className="yt-circuit-route font-kannada">
                ಮಂಗಳೂರು ➔ ಉಡುಪಿ ಶ್ರೀಕೃಷ್ಣ ➔ ಮರವಂತೆ ಬೀಚ್ ➔ ಮುರುಡೇಶ್ವರ ➔ ಗೋಕರ್ಣ
              </div>
              <h3 className="yt-circuit-name">Karavali Shore & Temple Corridor</h3>
              <p className="yt-circuit-summary">
                National Highway 66 coastal drive between the Arabian Sea and Suparnika River at Maravanthe, Udupi temple cuisine, and Gokarna’s Om Beach.
              </p>
              <div className="yt-circuit-footer">
                <span className="yt-circuit-stat">Coastal Seafood & Pilgrimage</span>
                <span className="yt-circuit-cta">Explore Route →</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ================= 3. SPOTLIGHT FEATURE: BELUR & HOYSALA ================= */}
      <section className="yt-section yt-spotlight-section">
        <div className="yt-spotlight-card">
          <div className="yt-spotlight-media">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c5/Chennakeshava_temple_Belur_761.jpg"
              alt="Hoysala Chennakeshava Temple Belur"
              className="yt-spotlight-img"
            />
            <div className="yt-spotlight-caption">
              Photo: Chennakeshava Temple, Belur (1117 CE) • Akshatha Inamdar / Wikimedia Commons (CC BY-SA 4.0)
            </div>
          </div>
          <div className="yt-spotlight-content">
            <span className="yt-spotlight-tag font-kannada">ಕಿರೀಟ ಪ್ರಾಯದ ತಾಣ • Crown Jewel of Hoysala Art</span>
            <h3 className="yt-spotlight-title font-kannada">
              ಬೇಲೂರು ಶ್ರೀ ಚೆನ್ನಕೇಶವ ದೇವಾಲಯ
            </h3>
            <div className="yt-spotlight-english">Chennakeshava Temple, Belur (Hassan District)</div>
            <p className="yt-spotlight-text">
              Commissioned in 1117 CE by King Vishnuvardhana to commemorate his triumph over the Cholas at Talakad, this soapstone marvel took 103 years to complete across three generations of master sculptors led by Jakanachari and Dakanachari.
            </p>
            <div className="yt-spotlight-highlights">
              <div className="yt-highlight-item">
                <span className="yt-hi-label">Architectural Dynasty:</span>
                <span className="yt-hi-value">Hoysala Empire (Star-shaped Jagati)</span>
              </div>
              <div className="yt-highlight-item">
                <span className="yt-hi-label">Verified Visiting Hours:</span>
                <span className="yt-hi-value">7:30 AM – 7:30 PM (Daily, No Entry Fee)</span>
              </div>
              <div className="yt-highlight-item">
                <span className="yt-hi-label">Distance from Bengaluru:</span>
                <span className="yt-hi-value">222 km via NH-75 (Hassan Bypass)</span>
              </div>
            </div>
            <div className="yt-spotlight-actions">
              <button
                type="button"
                className="yt-btn-spotlight-add"
                onClick={() => onAddPoiToTrip('poi-belur-halebidu')}
              >
                {itineraryStopIds.includes('poi-belur-halebidu') ? '✓ Added to Itinerary' : '+ Add to My Journey'}
              </button>
              <button
                type="button"
                className="yt-btn-spotlight-details"
                onClick={() => onSelectPoiDetail('poi-belur-halebidu')}
              >
                View Full Dossier & Weather
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. DESTINATION DISCOVERY CATALOG ================= */}
      <section className="yt-section yt-discovery-section">
        <div className="yt-section-header">
          <div>
            <div className="yt-section-eyebrow font-kannada">ತಾಣಗಳ ಸಮಗ್ರ ಪರಿಶೋಧನೆ</div>
            <h2 className="yt-section-title">
              {uiLanguage === 'kn' ? 'ಕರ್ನಾಟಕದ ಪ್ರಸಿದ್ಧ ತಾಣಗಳು' : 'Explore Karnataka Destinations'}
            </h2>
            <p className="yt-section-desc">
              {uiLanguage === 'kn'
                ? 'ಐತಿಹಾಸಿಕ ದೇವಾಲಯಗಳು, ಗಿರಿಶಿಖರಗಳು, ಜಲಪಾತಗಳು ಮತ್ತು ವನ್ಯಜೀವಿ ತಾಣಗಳ ಅಧಿಕೃತ ವಿವರಗಳು.'
                : 'Over 650 verified destinations across 31 districts with authentic photography and geo-coordinates.'}
            </p>
          </div>

          <div className="yt-catalog-count-badge">
            <strong>{filteredPois.length}</strong> {uiLanguage === 'kn' ? 'ತಾಣಗಳು ಲಭ್ಯ' : 'Destinations Found'}
          </div>
        </div>

        {/* Region & Category Filter Pills */}
        <div className="yt-filters-toolbar">
          <div className="yt-filter-group">
            <span className="yt-filter-label">{uiLanguage === 'kn' ? 'ಪ್ರದೇಶ:' : 'Region:'}</span>
            <button
              type="button"
              className={`yt-filter-pill ${selectedRegion === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedRegion('all')}
            >
              {uiLanguage === 'kn' ? 'ಎಲ್ಲಾ' : 'All Regions'}
            </button>
            <button
              type="button"
              className={`yt-filter-pill ${selectedRegion === 'Old Mysuru' ? 'active' : ''}`}
              onClick={() => setSelectedRegion('Old Mysuru')}
            >
              Old Mysuru
            </button>
            <button
              type="button"
              className={`yt-filter-pill ${selectedRegion === 'Central Karnataka / Malnad' ? 'active' : ''}`}
              onClick={() => setSelectedRegion('Central Karnataka / Malnad')}
            >
              Malnad & Ghats
            </button>
            <button
              type="button"
              className={`yt-filter-pill ${selectedRegion === 'Karavali / Coastal Karnataka' ? 'active' : ''}`}
              onClick={() => setSelectedRegion('Karavali / Coastal Karnataka')}
            >
              Karavali Coast
            </button>
            <button
              type="button"
              className={`yt-filter-pill ${selectedRegion === 'Kittur Karnataka' ? 'active' : ''}`}
              onClick={() => setSelectedRegion('Kittur Karnataka')}
            >
              Kittur Karnataka
            </button>
            <button
              type="button"
              className={`yt-filter-pill ${selectedRegion === 'Kalyana Karnataka' ? 'active' : ''}`}
              onClick={() => setSelectedRegion('Kalyana Karnataka')}
            >
              Kalyana Karnataka
            </button>
          </div>

          <div className="yt-filter-group">
            <span className="yt-filter-label">{uiLanguage === 'kn' ? 'ವರ್ಗ:' : 'Category:'}</span>
            <button
              type="button"
              className={`yt-filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              {uiLanguage === 'kn' ? 'ಎಲ್ಲಾ ವರ್ಗ' : 'All Types'}
            </button>
            <button
              type="button"
              className={`yt-filter-pill ${selectedCategory === 'heritage' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('heritage')}
            >
              🏛️ Heritage
            </button>
            <button
              type="button"
              className={`yt-filter-pill ${selectedCategory === 'nature' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('nature')}
            >
              ⛰️ Nature & Peaks
            </button>
            <button
              type="button"
              className={`yt-filter-pill ${selectedCategory === 'spiritual' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('spiritual')}
            >
              🕉️ Spiritual
            </button>
            <button
              type="button"
              className={`yt-filter-pill ${selectedCategory === 'waterfall' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('waterfall')}
            >
              💧 Waterfalls
            </button>
            <button
              type="button"
              className={`yt-filter-pill ${selectedCategory === 'beach' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('beach')}
            >
              🏖️ Beaches
            </button>
          </div>
        </div>

        {/* Destination Editorial Cards Grid */}
        <div className="yt-destinations-grid">
          {filteredPois.slice(0, 16).map((poi) => {
            const isAdded = itineraryStopIds.includes(poi.id);
            const photoUrl = getPoiPhoto(poi.id, poi.category, poi.name, poi.district);
            return (
              <article key={poi.id} className="yt-dest-card">
                <div
                  className="yt-dest-media"
                  onClick={() => onSelectPoiDetail(poi.id)}
                  role="button"
                  tabIndex={0}
                >
                  <img
                    src={photoUrl}
                    alt={poi.name}
                    className="yt-dest-img"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const fallback = getAuthenticDestinationPhoto(poi.id, poi.category, poi.name, poi.district);
                      if (!target.src.startsWith('data:image/svg+xml')) {
                        target.src = fallback.imageUrl;
                      }
                    }}
                  />
                  <span className="yt-dest-badge">{poi.category.replace('_', ' ')}</span>
                  <span className="yt-dest-district">{poi.district}</span>
                </div>

                <div className="yt-dest-body">
                  <div className="yt-dest-kannada font-kannada">{poi.nameKannada}</div>
                  <h4 className="yt-dest-english" onClick={() => onSelectPoiDetail(poi.id)}>
                    {poi.name}
                  </h4>
                  <p className="yt-dest-desc">
                    {poi.summary || 'Verified heritage destination in Karnataka.'}
                  </p>

                  <div className="yt-dest-footer">
                    <span className="yt-dest-time">
                      {poi.category === 'railway_station'
                        ? `🚆 Railway Interchange (${poi.transportMeta?.officialCode || 'SWR'})`
                        : poi.category === 'bus_terminal'
                        ? `🚌 Bus Interchange (${poi.transportMeta?.zoneOrOperator?.split(' ')[0] || 'KSRTC'})`
                        : poi.category === 'airport'
                        ? '✈️ Regional Airport'
                        : `⏱️ ${Math.round((poi.recommendedHours || 1.5) * 60)}m visit`}
                    </span>
                    <button
                      type="button"
                      className={`yt-btn-add-stop ${isAdded ? 'added' : ''}`}
                      onClick={() => onAddPoiToTrip(poi.id)}
                    >
                      {isAdded ? '✓ Added' : '+ Add to Trip'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filteredPois.length > 16 && (
          <div className="yt-catalog-load-more">
            <button type="button" className="yt-btn-catalog-more" onClick={onEnterWorkspace}>
              {uiLanguage === 'kn'
                ? `ಯೋಜನಾ ವೇದಿಕೆಯಲ್ಲಿ ಎಲ್ಲಾ ${filteredPois.length} ತಾಣಗಳನ್ನು ವೀಕ್ಷಿಸಿ →`
                : `Explore all ${filteredPois.length} destinations in Trip Planner Workspace →`}
            </button>
          </div>
        )}
      </section>

      {/* ================= 4.5 VERIFIED STAYS & HOMESTAYS SHOWCASE ================= */}
      <section className="yt-section yt-catalog-section" style={{ borderTop: '1px solid #E8DFD3', paddingTop: '3rem' }}>
        <div className="yt-section-header">
          <div className="yt-section-kicker">
            {uiLanguage === 'kn' ? 'ಅಧಿಕೃತ ತಂಗುದಾಣಗಳು • Verified Stays' : 'Authentic Hospitality'}
          </div>
          <h2 className="yt-section-title">
            {uiLanguage === 'kn' ? 'ಕೆಎಸ್‌ಟಿಡಿಸಿ ಮಯೂರ & ನೋಂದಾಯಿತ ಹೋಮ್‌ಸ್ಟೇಗಳು' : 'KSTDC Mayura Hotels & Registered Homestays'}
          </h2>
          <p className="yt-section-subtitle">
            {uiLanguage === 'kn'
              ? 'ಪ್ರತಿಯೊಂದು ತಂಗುದಾಣವು ಸರ್ಕಾರಿ ನೋಂದಣಿ ಐಡಿ ಹಾಗೂ ಅಧಿಕೃತ ದರಗಳನ್ನು ಹೊಂದಿರುತ್ತದೆ. ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ಕಮಿಷನ್ ಇಲ್ಲ.'
              : 'Every property carries an authentic government registration ID and verified statutory tariffs. Direct booking with no middleman markup.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
          {VERIFIED_KARNATAKA_STAYS.slice(0, 4).map((stay) => (
            <div
              key={stay.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#E8DFD3] hover:border-[#D5C9B8] transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="relative h-44 w-full bg-[#1A1714]">
                  <img src={stay.photoUrl} alt={stay.name} loading="lazy" className="w-full h-full object-cover" />
                  <div className="absolute top-2.5 left-2.5 bg-[#2B4C3F] text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm">
                    {stay.category === 'kstdc_mayura' ? 'KSTDC Mayura' : stay.category === 'jungle_lodges' ? 'Jungle Lodges' : 'Govt Homestay'}
                  </div>
                  <div className="absolute bottom-2 left-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[11px] text-white">
                    📍 {stay.servesDestinationName} ({stay.distanceToDestinationKm} km)
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-serif text-base font-medium text-[#1A1714] line-clamp-1">{stay.name}</h3>
                  <p className="text-xs text-[#7A7369] font-kannada">{stay.nameKannada}</p>
                  <p className="text-xs text-[#4A443C] line-clamp-2">{stay.description}</p>
                </div>
              </div>

              <div className="p-4 pt-3 border-t border-[#F4EFEA] flex items-center justify-between">
                <div>
                  <span className="text-base font-serif font-semibold text-[#1A1714]">₹{stay.priceRangeInr.min}</span>
                  <span className="text-[11px] text-[#7A7369]"> / ರಾತ್ರಿ</span>
                </div>
                <a
                  href={stay.officialBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs rounded-lg bg-[#A44A28] text-white font-medium hover:bg-[#8B3E22] transition-colors"
                >
                  ಬುಕಿಂಗ್ ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 4.6 AUTHENTIC KARNATAKA GASTRONOMY & GI CULINARY TRAIL ================= */}
      <section className="yt-section yt-catalog-section" style={{ borderTop: '1px solid #E8DFD3', paddingTop: '3rem' }}>
        <div className="yt-section-header">
          <div className="yt-section-kicker">
            {uiLanguage === 'kn' ? 'ಆಹಾರ ಪರಂಪರೆ • Heritage Gastronomy' : 'Culinary Traditions'}
          </div>
          <h2 className="yt-section-title">
            {uiLanguage === 'kn' ? 'ಕರ್ನಾಟಕದ ಜಿಐ ಮಾನ್ಯತೆಯ ಪಾರಂಪರಿಕ ಊಟೋಪಹಾರ' : 'GI-Certified Gastronomy & Iconic Eateries'}
          </h2>
          <p className="yt-section-subtitle">
            {uiLanguage === 'kn'
              ? 'ಧಾರವಾಡ ಪೇಡಾ, ಮೈಸೂರು ಮೈಲಾರಿ ದೋಸೆ, ಮಂಗಳೂರು ಕರಾವಳಿ ಊಟ ಹಾಗೂ ಮಲೆನಾಡಿನ ಅಕ್ಕಿ ರೊಟ್ಟಿ.'
              : 'Discover genuine culinary institutions celebrated for geographical indications (GI) and ancestral recipes.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          {VERIFIED_KARNATAKA_RESTAURANTS.slice(0, 3).map((dine) => (
            <div key={dine.id} className="bg-white rounded-2xl p-5 border border-[#E8DFD3] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                    {dine.giTagAssociated ? '🏆 GI ಮಾನ್ಯತೆ' : 'ಪಾರಂಪರಿಕ ತಾಣ'}
                  </span>
                  <span className="text-xs text-[#166534] font-medium">{dine.isPureVeg ? 'ಶುದ್ಧ ಸಸ್ಯಾಹಾರಿ' : 'ಕರಾವಳಿ ಊಟ'}</span>
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1A1714]">{dine.name}</h3>
                <p className="text-xs text-[#7A7369] font-kannada">{dine.nameKannada}</p>
                <p className="text-xs text-[#4A443C] mt-2 leading-relaxed">{dine.culturalNote}</p>
                <div className="mt-3 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#F4EFEA] text-xs">
                  <span className="font-semibold text-[#A44A28]">🌟 ಪ್ರಸಿದ್ಧ ತಿನಿಸು: </span>
                  <span>{dine.signatureDishes.join(', ')}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F4EFEA] flex justify-between items-center text-xs text-[#7A7369]">
                <span>📍 {dine.townOrCity}, {dine.district}</span>
                <span className="font-semibold text-[#1A1714]">~₹{dine.pricePerPersonEstimateInr}/ವ್ಯಕ್ತಿಗೆ</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 5. CULTURAL & TRANSIT LEDGER NOTES ================= */}
      <section className="yt-section yt-wisdom-section">
        <div className="yt-wisdom-grid">
          <div className="yt-wisdom-box">
            <span className="yt-wisdom-icon">🌸</span>
            <div className="yt-wisdom-title font-kannada">ಶಕ್ತಿ ಯೋಜನೆ — ಮಹಿಳೆಯರಿಗೆ ಉಚಿತ ಸಂಚಾರ</div>
            <div className="yt-wisdom-sub">Karnataka Shakti Scheme Audit</div>
            <p className="yt-wisdom-text">
              Zero-fare public transport for all domicile women across KSRTC ordinary and express buses throughout Karnataka. YatriKa AI automatically calculates and audits your transport savings on every corridor.
            </p>
          </div>

          <div className="yt-wisdom-box">
            <span className="yt-wisdom-icon">🛡️</span>
            <div className="yt-wisdom-title font-kannada">ಘಾಟ್-ಶೀಲ್ಡ್ ರಕ್ಷಣಾ ದಿಕ್ಸೂಚಿ</div>
            <div className="yt-wisdom-sub">Ghat-Shield Real-Time Weather & Road Guard</div>
            <p className="yt-wisdom-text">
              Dynamic Open-Meteo precipitation tracking across Western Ghat corridors (Shiradi, Charmadi, Agumbe, Bisle) warns travellers of landslides and dense fog before departure.
            </p>
          </div>

          <div className="yt-wisdom-box">
            <span className="yt-wisdom-icon">🚆</span>
            <div className="yt-wisdom-title font-kannada">ನೈಋತ್ಯ ರೈಲ್ವೆ & ಕೆಎಸ್‌ಆರ್‌ಟಿಸಿ ಸಂಯೋಜನೆ</div>
            <div className="yt-wisdom-sub">SWR Vistadome & KSRTC Direct Transit</div>
            <p className="yt-wisdom-text">
              Seamless multimodal timetables from Bengaluru, Mysuru, and Mangaluru. Enjoy scenic Vistadome glass-roof coaches through the Sakleshpur green route.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 6. REFINED FOOTER ================= */}
      <footer className="yt-footer">
        <div className="yt-footer-inner">
          <div className="yt-footer-brand">
            <div className="yt-footer-logo font-kannada">ಯಾತ್ರಿಕ</div>
            <div className="yt-footer-lead">
              YatriKa AI: A beautiful way to discover Karnataka. An intelligent way to travel it.
            </div>
            <div className="yt-footer-theme font-kannada">
              ಕೋಡ್. ಸೃಷ್ಟಿಸು. ಕನ್ನಡವನ್ನು ಸಂಭ್ರಮಿಸು — Code. Create. Celebrate Kannada.
            </div>
          </div>

          <div className="yt-footer-meta">
            <div><strong>Hackathon:</strong> Karnataka Digital Innovation 2026, NIE Mysuru</div>
            <div><strong>Problem Statement:</strong> 06, Travel & Tourism</div>
            <div><strong>Data Provenance:</strong> 650 POIs, Open-Meteo, SWR & KSRTC Schedules</div>
            <div className="yt-footer-copy">© 2026 YatriKa AI. Open Knowledge for Karnataka Tourism.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
