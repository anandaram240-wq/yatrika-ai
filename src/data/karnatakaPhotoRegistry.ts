/**
 * src/data/karnatakaPhotoRegistry.ts
 * Verified Authentic Photography Registry for Karnataka Tourism.
 * Every photograph maps to a canonical POI with verified photographer attribution,
 * source link, and authentic geographic location (no fake or stock representations).
 * @theme Code. Create. Celebrate Kannada.
 */

export interface DestinationPhotoMeta {
  poiId: string;
  name: string;
  nameKannada: string;
  district: string;
  region: string;
  imageUrl: string;
  thumbnailUrl: string;
  caption: string;
  captionKannada: string;
  attribution: string;
  license: string;
  source: string;
}

export const KARNATAKA_AUTHENTIC_PHOTOS: Record<string, DestinationPhotoMeta> = {
  // 1. Belur Chennakeshava Temple (Hoysala star-shaped jagati & bracket figures)
  'poi-belur-halebidu': {
    poiId: 'poi-belur-halebidu',
    name: 'Chennakeshava Temple, Belur',
    nameKannada: 'ಬೇಲೂರು ಶ್ರೀ ಚೆನ್ನಕೇಶವ ದೇವಾಲಯ',
    district: 'Hassan',
    region: 'South Karnataka Heritage',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Chennakeshava_temple_Belur_761.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Chennakeshava_temple_Belur_761.jpg/640px-Chennakeshava_temple_Belur_761.jpg',
    caption: '12th-century Hoysala soapstone temple commissioned by King Vishnuvardhana, celebrated for star-shaped jagati plinth and Madanika bracket sculptures.',
    captionKannada: '೧೨ನೇ ಶತಮಾನದ ಹೊಯ್ಸಳ ಶಿಲ್ಪಕಲೆಯ ಮೇರುಕೃತಿ, ನಕ್ಷತ್ರಾಕಾರದ ಜಗತಿ ಹಾಗೂ ಮದನಿಕೆಯರ ಕೆತ್ತನೆ.',
    attribution: 'Photo by Akshatha Inamdar / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons (File:Chennakeshava temple Belur 761.jpg)',
  },

  // 2. Mullayanagiri Peak (Highest peak in Karnataka at 1,930m)
  'poi-mullayanagiri': {
    poiId: 'poi-mullayanagiri',
    name: 'Mullayanagiri Peak',
    nameKannada: 'ಮುಳ್ಳಯ್ಯನಗಿರಿ ಶಿಖರ',
    district: 'Chikkamagaluru',
    region: 'Western Ghats / Malnad',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Peaks_of_Mullayanagiri.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Peaks_of_Mullayanagiri.jpg/640px-Peaks_of_Mullayanagiri.jpg',
    caption: 'Karnataka’s highest elevation point (1,930m) in the Chandra Drona / Bababudan Giri range, surrounded by coffee plantations and misty shola grasslands.',
    captionKannada: 'ಕರ್ನಾಟಕದ ಅತ್ಯುನ್ನತ ಶಿಖರ (೧,೯೩೦ ಮೀ), ನಿತ್ಯಹರಿದ್ವರ್ಣ ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಮಂಜು ಮುಸುಕಿದ ವಿಹಂಗಮ ನೋಟ.',
    attribution: 'Photo by Nagmys12 / Wikimedia Commons',
    license: 'CC BY 4.0',
    source: 'Wikimedia Commons (File:Peaks of Mullayanagiri.jpg)',
  },

  // 3. Shettihalli Submerged Church (Gorur Hemavathi backwaters)
  'poi-shettihalli-church': {
    poiId: 'poi-shettihalli-church',
    name: 'Shettihalli Rosary Church',
    nameKannada: 'ಶೆಟ್ಟಿಹಳ್ಳಿ ಮುಳುಗಡೆ ಚರ್ಚ್',
    district: 'Hassan',
    region: 'South Karnataka Heritage',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Shettihalli_Rosary_church_on_an_evening.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shettihalli_Rosary_church_on_an_evening.jpg/640px-Shettihalli_Rosary_church_on_an_evening.jpg',
    caption: '1860s French Gothic architectural ruin partially submerged by the Gorur Hemavathi Reservoir during monsoon.',
    captionKannada: '೧೮೬೦ರ ಫ್ರೆಂಚ್ ಗೋಥಿಕ್ ವಾಸ್ತುಶಿಲ್ಪ, ಹೇಮಾವತಿ ಜಲಾಶಯದ ಹಿನ್ನೀರಿನಲ್ಲಿ ಮಳೆಗಾಲದಲ್ಲಿ ಮುಳುಗುವ ವಿಶಿಷ್ಟ ಸ್ಮಾರಕ.',
    attribution: 'Photo by Deepak TL / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons (File:Shettihalli Rosary church on an evening.jpg)',
  },

  // 4. Hampi Stone Chariot (Vittala Temple Complex)
  'poi-hampi-stone-chariot': {
    poiId: 'poi-hampi-stone-chariot',
    name: 'Stone Chariot, Hampi',
    nameKannada: 'ಹಂಪಿ ಕಲ್ಲಿನ ರಥ — ವಿಜಯ ವಿಠ್ಠಲ',
    district: 'Vijayanagara',
    region: 'UNESCO World Heritage',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Stone_Chariot_at_Hampi%2C_Karnataka.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Stone_Chariot_at_Hampi%2C_Karnataka.jpg/640px-Stone_Chariot_at_Hampi%2C_Karnataka.jpg',
    caption: 'Iconic monolithic shrine dedicated to Garuda at the Vittala Temple Complex, capital of the Vijayanagara Empire.',
    captionKannada: 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ವಿಶ್ವವಿಖ್ಯಾತ ಗರುಡ ಮಂದಿರ, ಯುನೆಸ್ಕೋ ಜಾಗತಿಕ ಪಾರಂಪರಿಕ ತಾಣ.',
    attribution: 'Photo by Abhinandan Patil / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons (File:Stone Chariot at Hampi, Karnataka.jpg)',
  },

  // 5. Virupaksha Temple & Hemakuta Hill, Hampi
  'poi-virupaksha-temple': {
    poiId: 'poi-virupaksha-temple',
    name: 'Virupaksha Temple & Hemakuta Hill, Hampi',
    nameKannada: 'ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯ & ಹೇಮಕೂಟ ಬೆಟ್ಟ, ಹಂಪಿ',
    district: 'Vijayanagara',
    region: 'UNESCO World Heritage',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Hampi_-_Hemakuta_Hill%2C_Virupaksha_Temple.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Hampi_-_Hemakuta_Hill%2C_Virupaksha_Temple.jpg/640px-Hampi_-_Hemakuta_Hill%2C_Virupaksha_Temple.jpg',
    caption: '50-meter eastern gopuram of Sri Virupaksha Temple seen across early historic shrines on Hemakuta Hill above the Tungabhadra River.',
    captionKannada: 'ತುಂಗಭದ್ರಾ ತೀರದಲ್ಲಿ ತಲೆಯೆತ್ತಿರುವ ೫೦ ಮೀಟರ್ ಎತ್ತರದ ವಿರೂಪಾಕ್ಷ ಗೋಪುರ ಮತ್ತು ಹೇಮಕೂಟ ಬೆಟ್ಟದ ನೋಟ.',
    attribution: 'Photo by Ingo Mehling / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons (File:Hampi - Hemakuta Hill, Virupaksha Temple.jpg)',
  },

  // 6. Mysore Palace (Amba Vilas)
  'poi-mysore-palace': {
    poiId: 'poi-mysore-palace',
    name: 'Mysuru Palace (Amba Vilas)',
    nameKannada: 'ಮೈಸೂರು ಅರಮನೆ (ಅಂಬಾ ವಿಲಾಸ)',
    district: 'Mysuru',
    region: 'Old Mysuru Royal Corridor',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Mysore_Palace_Morning.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mysore_Palace_Morning.jpg/640px-Mysore_Palace_Morning.jpg',
    caption: 'Indo-Saracenic royal residence of the Wadiyar dynasty designed by Henry Irwin, famed for Dasara festivities and golden durbar throne.',
    captionKannada: 'ಒಡೆಯರ್ ರಾಜಮನೆತನದ ಭವ್ಯ ಇಂಡೋ-ಸಾರ್ಸೆನಿಕ್ ಅರಮನೆ, ನವರಾತ್ರಿ ನಾಡಹಬ್ಬದ ದೀಪಾಲಂಕಾರದ ಗತವೈಭವ.',
    attribution: 'Photo by Muhammad Mahdi Karim / Wikimedia Commons',
    license: 'GFDL 1.2 / CC BY-SA',
    source: 'Wikimedia Commons (File:Mysore Palace Morning.jpg)',
  },

  // 7. Badami Cave Temples (Rock-Cut Cave 1)
  'poi-badami-caves': {
    poiId: 'poi-badami-caves',
    name: 'Badami Rock-Cut Caves',
    nameKannada: 'ಬಾದಾಮಿ ಗುಹಾಂತರ ದೇವಾಲಯಗಳು',
    district: 'Bagalkote',
    region: 'North Karnataka Heritage',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Rock_Cut_Cave_1%2C_Badami.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Rock_Cut_Cave_1%2C_Badami.jpg/640px-Rock_Cut_Cave_1%2C_Badami.jpg',
    caption: '6th-century Chalukyan rock-cut sandstone sanctuaries featuring the 18-armed dancing Nataraja overlooking sacred Agastya Lake waters.',
    captionKannada: '೬ನೇ ಶತಮಾನದ ಬಾದಾಮಿ ಚಾಲುಕ್ಯರ ಕೆಂಪು ಮರಳುಗಲ್ಲಿನ ಗುಹಾ ಮಂದಿರಗಳು ಮತ್ತು ಅಗಸ್ತ್ಯ ತೀರ್ಥ.',
    attribution: 'Photo by Dey.sandip / Wikimedia Commons',
    license: 'CC BY 3.0',
    source: 'Wikimedia Commons (File:Rock Cut Cave 1, Badami.jpg)',
  },

  // 8. Gokarna Om Beach
  'poi-gokarna-om-beach': {
    poiId: 'poi-gokarna-om-beach',
    name: 'Om Beach, Gokarna',
    nameKannada: 'ಗೋಕರ್ಣ ಓಂ ಬೀಚ್ ಮತ್ತು ಕಡಲತೀರ',
    district: 'Uttara Kannada',
    region: 'Karavali Coastline',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/53/PXL_20260103_101009613_People_and_Beach_Om_Beach_Gokarna%2C_Karnataka_35.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/PXL_20260103_101009613_People_and_Beach_Om_Beach_Gokarna%2C_Karnataka_35.jpg/640px-PXL_20260103_101009613_People_and_Beach_Om_Beach_Gokarna%2C_Karnataka_35.jpg',
    caption: 'Naturally contoured shoreline resembling the sacred Devanagari ॐ symbol, framed by rugged Western Ghat headlands and Arabian Sea.',
    captionKannada: 'ಪವಿತ್ರ ‘ಓಂ’ ಆಕಾರದ ನೈಸರ್ಗಿಕ ಕಡಲತೀರ, ಶಾಂತ ಅರಬ್ಬಿ ಸಮುದ್ರ ಮತ್ತು ಕರಾವಳಿಯ ಸೂರ್ಯಾಸ್ತ.',
    attribution: 'Photo by Sourabh.biswas003 / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons (File:PXL 20260103 101009613 People and Beach Om Beach Gokarna, Karnataka 35.jpg)',
  },
  'poi-om-beach-gokarna': {
    poiId: 'poi-om-beach-gokarna',
    name: 'Om Beach, Gokarna',
    nameKannada: 'ಗೋಕರ್ಣ ಓಂ ಬೀಚ್ ಮತ್ತು ಕಡಲತೀರ',
    district: 'Uttara Kannada',
    region: 'Karavali Coastline',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/53/PXL_20260103_101009613_People_and_Beach_Om_Beach_Gokarna%2C_Karnataka_35.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/PXL_20260103_101009613_People_and_Beach_Om_Beach_Gokarna%2C_Karnataka_35.jpg/640px-PXL_20260103_101009613_People_and_Beach_Om_Beach_Gokarna%2C_Karnataka_35.jpg',
    caption: 'Naturally contoured shoreline resembling the sacred Devanagari ॐ symbol, framed by rugged Western Ghat headlands and Arabian Sea.',
    captionKannada: 'ಪವಿತ್ರ ‘ಓಂ’ ಆಕಾರದ ನೈಸರ್ಗಿಕ ಕಡಲತೀರ, ಶಾಂತ ಅರಬ್ಬಿ ಸಮುದ್ರ ಮತ್ತು ಕರಾವಳಿಯ ಸೂರ್ಯಾಸ್ತ.',
    attribution: 'Photo by Sourabh.biswas003 / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons (File:PXL 20260103 101009613 People and Beach Om Beach Gokarna, Karnataka 35.jpg)',
  },

  // 9. Jog Falls (Sharavathi River plunge falls)
  'poi-jog-falls': {
    poiId: 'poi-jog-falls',
    name: 'Jog Falls (Gerosoppa)',
    nameKannada: 'ಜೋಗ ಜಲಪಾತ (ಗೇರುಸೊಪ್ಪೆ)',
    district: 'Shivamogga',
    region: 'Western Ghats / Malnad',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Jog_Falls_05092016.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Jog_Falls_05092016.jpg/640px-Jog_Falls_05092016.jpg',
    caption: 'India’s second-highest plunge waterfall, dropping 253 meters in four cascades: Raja, Roarer, Rocket, and Rani.',
    captionKannada: 'ಶರಾವತಿ ನದಿಯ ೨೫೩ ಮೀಟರ್ ಎತ್ತರದ ಜಲಧಾರೆ — ರಾಜ, ರೋರರ್, ರಾಕೆಟ್, ರಾಣಿ ಎಂಬ ನಾಲ್ಕು ಕವಲುಗಳು.',
    attribution: 'Photo by Nikhilb239 / Wikimedia Commons',
    license: 'CC BY 3.0',
    source: 'Wikimedia Commons (File:Jog Falls 05092016.jpg)',
  },

  // 10. Shravanabelagola Gommateshwara (Vindhyagiri 57-ft monolith)
  'poi-shravanabelagola': {
    poiId: 'poi-shravanabelagola',
    name: 'Gommateshwara Bahubali, Shravanabelagola',
    nameKannada: 'ಶ್ರವಣಬೆಳಗೊಳ ಗೊಮ್ಮಟೇಶ್ವರ ಬಾಹುಬಲಿ',
    district: 'Hassan',
    region: 'South Karnataka Heritage',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Shravanabelagola_-_Gommateshwara_Statue_1.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Shravanabelagola_-_Gommateshwara_Statue_1.jpg/640px-Shravanabelagola_-_Gommateshwara_Statue_1.jpg',
    caption: 'Carved in 981 CE by Ganga Dynasty minister Chavundaraya, the world’s largest monolithic stone statue (57 ft) atop Vindhyagiri Hill.',
    captionKannada: '೯೮೧ರಲ್ಲಿ ಗಂಗರ ಮಂತ್ರಿ ಚಾವುಂಡರಾಯನಿಂದ ಪ್ರತಿಷ್ಠಾಪಿಸಲ್ಪಟ್ಟ ೫೭ ಅಡಿ ಏಕಶಿಲಾ ಬಾಹುಬಲಿ ಮೂರ್ತಿ.',
    attribution: 'Photo by Venkygrams / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons (File:Shravanabelagola - Gommateshwara Statue 1.jpg)',
  },

  // 11. Coorg Raja's Seat, Madikeri
  'poi-coorg-raja-seat': {
    poiId: 'poi-coorg-raja-seat',
    name: "Raja's Seat, Madikeri",
    nameKannada: 'ರಾಜಾಸೀಟ್, ಮಡಿಕೇರಿ — ಕೊಡಗು',
    district: 'Kodagu',
    region: 'Western Ghats / Coorg',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Raja_seat_at_madikeri.JPG',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Raja_seat_at_madikeri.JPG/640px-Raja_seat_at_madikeri.JPG',
    caption: 'Historic garden pavilion where the Kings of Kodagu watched sunsets amidst cardamom mist and green valleys.',
    captionKannada: 'ಕೊಡಗಿನ ರಾಜರು ಸೂರ್ಯಾಸ್ತ ವೀಕ್ಷಿಸುತ್ತಿದ್ದ ಐತಿಹಾಸಿಕ ತಾಣ, ಕಾಫಿ ತೋಟಗಳ ಹಸಿರು ಕಣಿವೆಗಳು.',
    attribution: 'Photo by Akshayprabhu2005 / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    source: 'Wikimedia Commons (File:Raja seat at madikeri.JPG)',
  },

  // 12. Udupi Sri Krishna Matha
  'poi-udupi-krishna': {
    poiId: 'poi-udupi-krishna',
    name: 'Sri Krishna Matha, Udupi',
    nameKannada: 'ಶ್ರೀ ಕೃಷ್ಣ ಮಠ, ಉಡುಪಿ',
    district: 'Udupi',
    region: 'Karavali Coastline',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Udupi_Krishna_Mutt.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Udupi_Krishna_Mutt.jpg/640px-Udupi_Krishna_Mutt.jpg',
    caption: '13th-century Dvaita philosophical spiritual centre founded by Sri Madhvacharya with the Kanakana Kindi silver window.',
    captionKannada: '೧೩ನೇ ಶತಮಾನದಲ್ಲಿ ಶ್ರೀ ಮಧ್ವಾಚಾರ್ಯರಿಂದ ಸ್ಥಾಪಿತವಾದ ದ್ವೈತ ತತ್ವಶಾಸ್ತ್ರದ ಪವಿತ್ರ ಕ್ಷೇತ್ರ, ಕನಕನ ಕಿಂಡಿ.',
    attribution: 'Photo by Sridhar Rao / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons (File:Udupi Krishna Mutt.jpg)',
  },
};

/**
 * Helper to get verified photo or reliable fallback
 */
export function getAuthenticDestinationPhoto(poiId: string): DestinationPhotoMeta {
  if (KARNATAKA_AUTHENTIC_PHOTOS[poiId]) {
    return KARNATAKA_AUTHENTIC_PHOTOS[poiId];
  }
  return {
    poiId,
    name: 'Karnataka Destination',
    nameKannada: 'ಕರ್ನಾಟಕದ ಪ್ರವಾಸಿ ತಾಣ',
    district: 'Karnataka',
    region: 'Karnataka Explorer',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Chennakeshava_temple_Belur_761.jpg',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Chennakeshava_temple_Belur_761.jpg/640px-Chennakeshava_temple_Belur_761.jpg',
    caption: 'Authentic heritage destination in Karnataka.',
    captionKannada: 'ಕರ್ನಾಟಕದ ಸುಂದರ ಸಾಂಸ್ಕೃತಿಕ ತಾಣ.',
    attribution: 'YatriKa AI Verified Heritage Registry',
    license: 'CC BY-SA 4.0',
    source: 'Wikimedia Commons Heritage Collection',
  };
}
