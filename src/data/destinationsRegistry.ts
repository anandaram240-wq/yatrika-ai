// src/data/destinationsRegistry.ts
export interface DestinationRecord {
  id: 'hampi' | 'mysuru' | 'gokarna' | 'chikkamagaluru' | 'madikeri' | 'badami';
  nameEn: string;
  nameKn: string;
  district: string;
  aliases: string[];
  center: [number, number]; // [lng, lat] WGS84
  bbox: [number, number, number, number]; // [west, south, east, north]
  defaultZoom: number;
  defaultPitch: number;
  defaultBearing: number;
  editorialTagline: string;
  editorialIntro: string;
  nearestRailhead: { code: string; name: string; distanceKm: number; coordinates: [number, number] };
  nearestAirport: { code: string; name: string; distanceKm: number; coordinates: [number, number] };
  coverage3D: {
    terrainDemVerified: boolean;
    googlePhotorealisticMeshVerified: boolean;
    coverageNote: string;
  };
}

export const KARNATAKA_DESTINATIONS: Record<DestinationRecord['id'], DestinationRecord> = {
  hampi: {
    id: 'hampi',
    nameEn: 'Hampi',
    nameKn: 'ಹಂಪಿ',
    district: 'Vijayanagara',
    aliases: ['hampi', 'hampe', 'ಹಂಪಿ', 'ಹಂಪೆ', 'vijayanagara', 'hospet', 'hosapete'],
    center: [76.4600, 15.3350],
    bbox: [76.4200, 15.2900, 76.5200, 15.3700],
    defaultZoom: 13.8,
    defaultPitch: 55,
    defaultBearing: -18,
    editorialTagline: 'Granite Boulder Topography & Capital of the Vijayanagara Empire (UNESCO World Heritage Site)',
    editorialIntro:
      'Spanning over 4,187 hectares along the southern bank of the Tungabhadra River in Vijayanagara district, Hampi combines a dramatic Deccan granite boulder landscape with 14th–16th century Dravidian and Indo-Islamic monuments across the Sacred Centre, Royal Enclosure, and Vittala Temple complex.',
    nearestRailhead: {
      code: 'HPT',
      name: 'Hosapete Junction',
      distanceKm: 13,
      coordinates: [76.3860, 15.2689],
    },
    nearestAirport: {
      code: 'VDY',
      name: 'Jindal Vijaynagar Airport (Vidyanagar)',
      distanceKm: 37,
      coordinates: [76.6347, 15.1758],
    },
    coverage3D: {
      terrainDemVerified: true,
      googlePhotorealisticMeshVerified: false,
      coverageNote:
        'Verified DEM 3D elevation terrain (Matanga Hill, Hemakuta Hill, Tungabhadra gorge) is active. Google Photorealistic 3D city mesh is not surveyed over the rural Hampi archaeological zone; monuments are rendered with surveyed WGS84 coordinates, real elevation contours, and licensed Wikimedia Commons photography.',
    },
  },
  mysuru: {
    id: 'mysuru',
    nameEn: 'Mysuru',
    nameKn: 'ಮೈಸೂರು',
    district: 'Mysuru',
    aliases: ['mysuru', 'mysore', 'ಮೈಸೂರು', 'mahishuru'],
    center: [76.6552, 12.3052],
    bbox: [76.5800, 12.2400, 76.7200, 12.3600],
    defaultZoom: 13.2,
    defaultPitch: 45,
    defaultBearing: 0,
    editorialTagline: 'Wodeyar Royal Heritage, Chamundi Hill & Living Cultural Capital of Karnataka',
    editorialIntro:
      'Anchored by Amba Vilas Palace and the granite massif of Chamundi Hill, Mysuru offers radial heritage boulevards, silk and sandalwood craft ecosystems, and direct rail/expressway links from Bengaluru.',
    nearestRailhead: {
      code: 'MYS',
      name: 'Mysuru Junction',
      distanceKm: 2.1,
      coordinates: [76.6458, 12.3136],
    },
    nearestAirport: {
      code: 'MYQ',
      name: 'Mysuru Airport (Mandakalli)',
      distanceKm: 12,
      coordinates: [76.6558, 12.2300],
    },
    coverage3D: {
      terrainDemVerified: true,
      googlePhotorealisticMeshVerified: false,
      coverageNote: '3D elevation terrain active across Chamundi Hill and Mysuru basin.',
    },
  },
  gokarna: {
    id: 'gokarna',
    nameEn: 'Gokarna',
    nameKn: 'ಗೋಕರ್ಣ',
    district: 'Uttara Kannada',
    aliases: ['gokarna', 'gokarn', 'ಗೋಕರ್ಣ', 'om beach', 'kudle'],
    center: [74.3188, 14.5479],
    bbox: [74.2900, 14.5000, 74.3600, 14.5800],
    defaultZoom: 13.5,
    defaultPitch: 50,
    defaultBearing: 25,
    editorialTagline: 'Arabian Sea Headlands, Mahabaleshwar Sacred Town & Cliff-Trail Coves',
    editorialIntro:
      'Where the Western Ghats meet the Arabian Sea in Uttara Kannada, Gokarna pairs an ancient Shaivite pilgrimage town with rocky headland trails linking Kudle, Om, Half-Moon, and Paradise beaches.',
    nearestRailhead: {
      code: 'GOK',
      name: 'Gokarna Road Station (Konkan Railway)',
      distanceKm: 9.5,
      coordinates: [74.3644, 14.5772],
    },
    nearestAirport: {
      code: 'GOI',
      name: 'Goa International Airport (Dabolim)',
      distanceKm: 145,
      coordinates: [73.8314, 15.3808],
    },
    coverage3D: {
      terrainDemVerified: true,
      googlePhotorealisticMeshVerified: false,
      coverageNote: 'Coastal cliff DEM terrain enabled across Kudle–Om–Paradise headlands.',
    },
  },
  chikkamagaluru: {
    id: 'chikkamagaluru',
    nameEn: 'Chikkamagaluru',
    nameKn: 'ಚಿಕ್ಕಮಗಳೂರು',
    district: 'Chikkamagaluru',
    aliases: ['chikkamagaluru', 'chikmagalur', 'ಚಿಕ್ಕಮಗಳೂರು', 'mullayanagiri', 'baba budangiri'],
    center: [75.7720, 13.3161],
    bbox: [75.6800, 13.2500, 75.8600, 13.4500],
    defaultZoom: 12.4,
    defaultPitch: 60,
    defaultBearing: -10,
    editorialTagline: 'Mullayanagiri Sky-Ridges, Shola Grasslands & Shade-Grown Coffee Estates',
    editorialIntro:
      'Home to Karnataka’s highest peak at Mullayanagiri (1,930 m), Chikkamagaluru rises steeply into the Baba Budangiri horseshoe ridge and Bhadra Tiger Reserve.',
    nearestRailhead: {
      code: 'KDR',
      name: 'Kadur Junction / Chikkamagaluru Railhead',
      distanceKm: 40,
      coordinates: [76.0128, 13.5519],
    },
    nearestAirport: {
      code: 'IXE',
      name: 'Mangaluru International Airport',
      distanceKm: 155,
      coordinates: [74.8901, 12.9613],
    },
    coverage3D: {
      terrainDemVerified: true,
      googlePhotorealisticMeshVerified: false,
      coverageNote: 'High-relief Western Ghats 3D DEM terrain verified for Mullayanagiri ridge.',
    },
  },
  madikeri: {
    id: 'madikeri',
    nameEn: 'Madikeri (Kodagu)',
    nameKn: 'ಮಡಿಕೇರಿ (ಕೊಡಗು)',
    district: 'Kodagu',
    aliases: ['madikeri', 'coorg', 'kodagu', 'ಮಡಿಕೇರಿ', 'ಕೊಡಗು', 'talakaveri'],
    center: [75.7382, 12.4244],
    bbox: [75.6500, 12.3500, 75.8200, 12.5000],
    defaultZoom: 12.8,
    defaultPitch: 55,
    defaultBearing: 15,
    editorialTagline: 'Misty Kodagu Highlands, Kaveri Headwaters & Ghat Escarpments',
    editorialIntro:
      'Perched along the Western Ghats crest at 1,150 m, Madikeri is the gateway to Kodagu’s spice-and-coffee valleys, Raja’s Seat escarpment, and the origin of the River Kaveri at Talakaveri.',
    nearestRailhead: {
      code: 'MYS',
      name: 'Mysuru Junction',
      distanceKm: 118,
      coordinates: [76.6458, 12.3136],
    },
    nearestAirport: {
      code: 'CNN',
      name: 'Kannur International Airport',
      distanceKm: 92,
      coordinates: [75.5482, 11.9186],
    },
    coverage3D: {
      terrainDemVerified: true,
      googlePhotorealisticMeshVerified: false,
      coverageNote: '3D DEM elevation active for Kodagu ghat roads and Brahmagiri range.',
    },
  },
  badami: {
    id: 'badami',
    nameEn: 'Badami',
    nameKn: 'ಬಾದಾಮಿ',
    district: 'Bagalkote',
    aliases: ['badami', 'vatapi', 'ಬಾದಾಮಿ', 'aihole', 'pattadakal'],
    center: [75.6768, 15.9149],
    bbox: [75.6400, 15.8900, 75.7200, 15.9500],
    defaultZoom: 14.2,
    defaultPitch: 55,
    defaultBearing: -25,
    editorialTagline: 'Red Sandstone Ravines, 6th-Century Chalukya Cave Temples & Agastya Lake',
    editorialIntro:
      'Formerly Vatapi, the regal capital of the Early Chalukyas (540–757 CE), Badami is carved into dramatic red sandstone cliffs encircling the emerald waters of Agastya Teertha.',
    nearestRailhead: {
      code: 'BDM',
      name: 'Badami Railway Station',
      distanceKm: 5.0,
      coordinates: [75.6989, 15.9553],
    },
    nearestAirport: {
      code: 'HBX',
      name: 'Hubballi Airport',
      distanceKm: 106,
      coordinates: [75.0849, 15.3617],
    },
    coverage3D: {
      terrainDemVerified: true,
      googlePhotorealisticMeshVerified: false,
      coverageNote: 'Sandstone canyon DEM terrain active around Agastya Lake.',
    },
  },
};

export function resolveDestinationQuery(rawQuery: string): DestinationRecord | null {
  const normalized = rawQuery.trim().toLowerCase();
  if (!normalized) return null;
  for (const record of Object.values(KARNATAKA_DESTINATIONS)) {
    if (
      record.id === normalized ||
      record.nameEn.toLowerCase().includes(normalized) ||
      record.nameKn.includes(normalized) ||
      record.aliases.some((alias) => alias.toLowerCase().includes(normalized) || normalized.includes(alias.toLowerCase()))
    ) {
      return record;
    }
  }
  return null;
}

