/**
 * @file src/data/media/karnatakaPhotoRegistry.ts
 * @description Master Authentic Photographic Provenance Registry for YatriKa AI V8.1.
 * Strict non-AI, Wikimedia Commons & Karnataka Tourism CC-BY/CC-BY-SA provenance.
 * @theme Code. Create. Celebrate Kannada.
 */

import { KARNATAKA_AUTHENTIC_PHOTOS as V8_PHOTOS, DestinationPhotoMeta } from '../karnatakaPhotoRegistry';

export interface VerifiedPhotoRecord extends DestinationPhotoMeta {
  photoId: string;
  exactLandmarkVerified: boolean;
  rightsHolder: string;
  sourcePageUrl: string;
  originalMediaUrl: string;
  isAiGenerated: false; // Explicit policy: AI-generated destination photos are strictly forbidden
  dateAcquired: string;
  aspectRatio: '16:9' | '4:3' | '1:1' | '3:2';
  geographicMatchNotes: string;
  blurDataUrl?: string;
}

export const VERIFIED_KARNATAKA_MEDIA_COLLECTION: Record<string, VerifiedPhotoRecord> = {
  'poi-belur-halebidu': {
    ...V8_PHOTOS['poi-belur-halebidu'],
    photoId: 'photo-belur-chennakeshava-01',
    exactLandmarkVerified: true,
    rightsHolder: 'Akshatha Inamdar (Wikimedia Commons)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Chennakeshava_temple_Belur_761.jpg',
    originalMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Chennakeshava_temple_Belur_761.jpg',
    isAiGenerated: false,
    dateAcquired: '2026-11-01',
    aspectRatio: '4:3',
    geographicMatchNotes: 'Verified star-shaped jagati (plinth), soapstone lathe-turned pillars, and Madanika bracket figures matching Belur Chennakeshava courtyard.',
  },
  'poi-mullayanagiri': {
    ...V8_PHOTOS['poi-mullayanagiri'],
    photoId: 'photo-mullayanagiri-peak-01',
    exactLandmarkVerified: true,
    rightsHolder: 'Nagmys12 (Wikimedia Commons)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Peaks_of_Mullayanagiri.jpg',
    originalMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Peaks_of_Mullayanagiri.jpg',
    isAiGenerated: false,
    dateAcquired: '2026-11-01',
    aspectRatio: '16:9',
    geographicMatchNotes: 'Exact ridgeline and elevation profile of the 1,930m Mullayanagiri peak in the Chandra Drona / Bababudan range.',
  },
  'poi-shettihalli-church': {
    ...V8_PHOTOS['poi-shettihalli-church'],
    photoId: 'photo-shettihalli-church-01',
    exactLandmarkVerified: true,
    rightsHolder: 'Deepak TL (Wikimedia Commons)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Shettihalli_Rosary_church_on_an_evening.jpg',
    originalMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Shettihalli_Rosary_church_on_an_evening.jpg',
    isAiGenerated: false,
    dateAcquired: '2026-11-01',
    aspectRatio: '16:9',
    geographicMatchNotes: '1860s French Gothic church arches partially submerged within Gorur Hemavathi reservoir backwaters at Shettihalli, Hassan.',
  },
  'poi-hampi-stone-chariot': {
    ...V8_PHOTOS['poi-hampi-stone-chariot'],
    photoId: 'photo-hampi-stone-chariot-01',
    exactLandmarkVerified: true,
    rightsHolder: 'Abhinandan Patil (Wikimedia Commons)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Stone_Chariot_at_Hampi%2C_Karnataka.jpg',
    originalMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Stone_Chariot_at_Hampi%2C_Karnataka.jpg',
    isAiGenerated: false,
    dateAcquired: '2026-11-01',
    aspectRatio: '4:3',
    geographicMatchNotes: 'Iconic Vijayanagara Garuda stone chariot situated inside the Vittala Temple complex at Hampi.',
  },
  'poi-virupaksha-temple': {
    ...V8_PHOTOS['poi-virupaksha-temple'],
    photoId: 'photo-hampi-virupaksha-01',
    exactLandmarkVerified: true,
    rightsHolder: 'Ingo Mehling (Wikimedia Commons)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Hampi_-_Hemakuta_Hill%2C_Virupaksha_Temple.jpg',
    originalMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Hampi_-_Hemakuta_Hill%2C_Virupaksha_Temple.jpg',
    isAiGenerated: false,
    dateAcquired: '2026-11-01',
    aspectRatio: '16:9',
    geographicMatchNotes: '50-meter eastern gopuram of Sri Virupaksha Temple overlooking Tungabhadra River and boulder-strewn Hemakuta Hill.',
  },
  'poi-mysore-palace': {
    ...V8_PHOTOS['poi-mysore-palace'],
    photoId: 'photo-mysore-palace-01',
    exactLandmarkVerified: true,
    rightsHolder: 'Muhammad Mahdi Karim (Wikimedia Commons)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Mysore_Palace_Morning.jpg',
    originalMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Mysore_Palace_Morning.jpg',
    isAiGenerated: false,
    dateAcquired: '2026-11-01',
    aspectRatio: '16:9',
    geographicMatchNotes: 'Front facade of the Mysore Palace (Amba Vilas) in morning sunlight, showcasing Henry Irwin’s Indo-Saracenic royal arches.',
  },
  'poi-badami-caves': {
    ...V8_PHOTOS['poi-badami-caves'],
    photoId: 'photo-badami-caves-01',
    exactLandmarkVerified: true,
    rightsHolder: 'Dey.sandip (Wikimedia Commons)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Rock_Cut_Cave_1%2C_Badami.jpg',
    originalMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Rock_Cut_Cave_1%2C_Badami.jpg',
    isAiGenerated: false,
    dateAcquired: '2026-11-01',
    aspectRatio: '4:3',
    geographicMatchNotes: '6th-century Chalukyan rock-cut sandstone cave with dancing Nataraja relief carving above Agastya Lake.',
  },
  'poi-om-beach-gokarna': {
    ...V8_PHOTOS['poi-om-beach-gokarna'],
    photoId: 'photo-gokarna-om-beach-01',
    exactLandmarkVerified: true,
    rightsHolder: 'Sourabh.biswas003 (Wikimedia Commons)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:PXL_20260103_101009613_People_and_Beach_Om_Beach_Gokarna%2C_Karnataka_35.jpg',
    originalMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/53/PXL_20260103_101009613_People_and_Beach_Om_Beach_Gokarna%2C_Karnataka_35.jpg',
    isAiGenerated: false,
    dateAcquired: '2026-11-01',
    aspectRatio: '16:9',
    geographicMatchNotes: 'Natural twin crescent coastline forming the Devanagari Om shape along the Karavali coast.',
  },
  'poi-gokarna-om-beach': {
    ...V8_PHOTOS['poi-gokarna-om-beach'],
    photoId: 'photo-gokarna-om-beach-02',
    exactLandmarkVerified: true,
    rightsHolder: 'Sourabh.biswas003 (Wikimedia Commons)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:PXL_20260103_101009613_People_and_Beach_Om_Beach_Gokarna%2C_Karnataka_35.jpg',
    originalMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/53/PXL_20260103_101009613_People_and_Beach_Om_Beach_Gokarna%2C_Karnataka_35.jpg',
    isAiGenerated: false,
    dateAcquired: '2026-11-01',
    aspectRatio: '16:9',
    geographicMatchNotes: 'Natural twin crescent coastline forming the Devanagari Om shape along the Karavali coast.',
  },
  'poi-jog-falls': {
    ...V8_PHOTOS['poi-jog-falls'],
    photoId: 'photo-jog-falls-01',
    exactLandmarkVerified: true,
    rightsHolder: 'Nikhilb239 (Wikimedia Commons)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Jog_Falls_05092016.jpg',
    originalMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Jog_Falls_05092016.jpg',
    isAiGenerated: false,
    dateAcquired: '2026-11-01',
    aspectRatio: '16:9',
    geographicMatchNotes: '253-meter cataract of Sharavathi River plunge falls at Jog, Shivamogga district.',
  },
  'poi-shravanabelagola': {
    ...V8_PHOTOS['poi-shravanabelagola'],
    photoId: 'photo-shravanabelagola-01',
    exactLandmarkVerified: true,
    rightsHolder: 'Venkygrams (Wikimedia Commons)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Shravanabelagola_-_Gommateshwara_Statue_1.jpg',
    originalMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Shravanabelagola_-_Gommateshwara_Statue_1.jpg',
    isAiGenerated: false,
    dateAcquired: '2026-11-01',
    aspectRatio: '4:3',
    geographicMatchNotes: '57-foot monolithic Bahubali Gommateshwara statue carved atop Vindhyagiri Hill in 981 CE.',
  },
  'poi-coorg-raja-seat': {
    ...V8_PHOTOS['poi-coorg-raja-seat'],
    photoId: 'photo-coorg-raja-seat-01',
    exactLandmarkVerified: true,
    rightsHolder: 'Akshayprabhu2005 (Wikimedia Commons)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Raja_seat_at_madikeri.JPG',
    originalMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Raja_seat_at_madikeri.JPG',
    isAiGenerated: false,
    dateAcquired: '2026-11-01',
    aspectRatio: '4:3',
    geographicMatchNotes: 'Royal vantage pavilion overlooking misty Kodagu valleys at Madikeri.',
  },
  'poi-udupi-krishna': {
    ...V8_PHOTOS['poi-udupi-krishna'],
    photoId: 'photo-udupi-krishna-01',
    exactLandmarkVerified: true,
    rightsHolder: 'Sridhar Rao (Wikimedia Commons)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Udupi_Krishna_Mutt.jpg',
    originalMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Udupi_Krishna_Mutt.jpg',
    isAiGenerated: false,
    dateAcquired: '2026-11-01',
    aspectRatio: '4:3',
    geographicMatchNotes: 'Courtyard and sanctum tower of 13th-century Sri Krishna Matha founded by Sri Madhvacharya in Udupi.',
  },
};

export function getVerifiedPhoto(poiId: string): VerifiedPhotoRecord | undefined {
  return VERIFIED_KARNATAKA_MEDIA_COLLECTION[poiId];
}
