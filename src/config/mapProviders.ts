// src/config/mapProviders.ts

export type BasemapStyleId = 'bright' | 'liberty' | 'positron' | 'dark' | 'fiord';
export type RoutingProviderId = 'osrm' | 'openrouteservice' | 'valhalla';

export interface BasemapStyleConfig {
  id: BasemapStyleId;
  label: string;
  description: string;
  url: string;
  minZoom: number;
  maxZoom: number;
  supports3DBuildings: boolean;
  supportsTerrain: boolean;
  attribution: string;
}

export interface ProviderRegistryConfig {
  mapProviderName: string;
  defaultStyleId: BasemapStyleId;
  fallbackStyleId: BasemapStyleId;
  styles: Record<BasemapStyleId, BasemapStyleConfig>;
  karnatakaBounds: [[number, number], [number, number]]; // [[swLng, swLat], [neLng, neLat]]
  karnatakaCenter: [number, number]; // [lng, lat]
  defaultZoom: number;
  routingProvider: RoutingProviderId;
  osrmBaseUrl: string;
  orsBaseUrl: string;
  orsApiKey: string;
  valhallaBaseUrl: string;
  productionAvailabilityNote: string;
}

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};

export const MAPTILER_API_KEY = env.VITE_MAPTILER_API_KEY || env.VITE_MAPTILER_KEY || '';

// CARTO Global Basemaps (Ultra-fast CDN, zero auth required, 99.99% uptime, CORS enabled)
export const CARTO_VOYAGER_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';
export const CARTO_POSITRON_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
export const CARTO_DARK_MATTER_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const CARTO_ATTRIBUTION =
  '© <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>';

const MAPTILER_ATTRIBUTION =
  '© <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noreferrer">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>';

/**
 * Built-in self-contained raster fallback style specification.
 * Uses CARTO Voyager raster tiles (which do NOT block browser referers, unlike raw osm.org).
 * Prevents "Access Blocked / Tile Usage Policy" placeholder images.
 */
export const FALLBACK_RASTER_STYLE = {
  version: 8 as const,
  sources: {
    'carto-raster-tiles': {
      type: 'raster' as const,
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: CARTO_ATTRIBUTION,
    },
  },
  layers: [
    {
      id: 'carto-raster-tiles-layer',
      type: 'raster' as const,
      source: 'carto-raster-tiles',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

function getStyleUrl(styleId: BasemapStyleId): { url: string; attribution: string } {
  if (MAPTILER_API_KEY) {
    switch (styleId) {
      case 'bright':
        return {
          url: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`,
          attribution: MAPTILER_ATTRIBUTION,
        };
      case 'liberty':
        return {
          url: `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${MAPTILER_API_KEY}`,
          attribution: MAPTILER_ATTRIBUTION,
        };
      case 'positron':
        return {
          url: `https://api.maptiler.com/maps/dataviz-light/style.json?key=${MAPTILER_API_KEY}`,
          attribution: MAPTILER_ATTRIBUTION,
        };
      case 'dark':
        return {
          url: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAPTILER_API_KEY}`,
          attribution: MAPTILER_ATTRIBUTION,
        };
      case 'fiord':
        return {
          url: `https://api.maptiler.com/maps/topo-v2/style.json?key=${MAPTILER_API_KEY}`,
          attribution: MAPTILER_ATTRIBUTION,
        };
    }
  }

  // High-uptime CARTO vector styles by default
  switch (styleId) {
    case 'bright':
      return {
        url: env.VITE_MAP_STYLE_URL || CARTO_VOYAGER_STYLE,
        attribution: CARTO_ATTRIBUTION,
      };
    case 'liberty':
      return {
        url: CARTO_VOYAGER_STYLE,
        attribution: CARTO_ATTRIBUTION,
      };
    case 'positron':
      return {
        url: CARTO_POSITRON_STYLE,
        attribution: CARTO_ATTRIBUTION,
      };
    case 'dark':
    case 'fiord':
      return {
        url: CARTO_DARK_MATTER_STYLE,
        attribution: CARTO_ATTRIBUTION,
      };
  }
}

export const MAP_PROVIDER_CONFIG: ProviderRegistryConfig = {
  mapProviderName: MAPTILER_API_KEY ? 'maptiler' : (env.VITE_MAP_PROVIDER || 'carto'),
  defaultStyleId: 'bright',
  fallbackStyleId: 'positron',
  styles: {
    bright: {
      id: 'bright',
      label: 'Day (Vibrant Streets)',
      description: MAPTILER_API_KEY
        ? 'High-contrast street and highway cartography powered by MapTiler Cloud'
        : 'High-contrast street, topography, and highway cartography powered by Carto Voyager',
      url: getStyleUrl('bright').url,
      minZoom: 2,
      maxZoom: 20,
      supports3DBuildings: true,
      supportsTerrain: !!MAPTILER_API_KEY,
      attribution: getStyleUrl('bright').attribution,
    },
    liberty: {
      id: 'liberty',
      label: 'Outdoors & Terrain',
      description: MAPTILER_API_KEY
        ? 'Topographic terrain with elevation contours and national parks'
        : 'Detailed general-purpose cartography with parks, peaks, and heritage corridors',
      url: getStyleUrl('liberty').url,
      minZoom: 2,
      maxZoom: 20,
      supports3DBuildings: true,
      supportsTerrain: !!MAPTILER_API_KEY,
      attribution: getStyleUrl('liberty').attribution,
    },
    positron: {
      id: 'positron',
      label: 'Light Minimal',
      description: 'Clean light canvas that maximizes POI marker and route legibility',
      url: getStyleUrl('positron').url,
      minZoom: 2,
      maxZoom: 20,
      supports3DBuildings: false,
      supportsTerrain: false,
      attribution: getStyleUrl('positron').attribution,
    },
    dark: {
      id: 'dark',
      label: 'Night Drive',
      description: 'Low-glare dark vector cartography for evening route planning',
      url: getStyleUrl('dark').url,
      minZoom: 2,
      maxZoom: 20,
      supports3DBuildings: false,
      supportsTerrain: false,
      attribution: getStyleUrl('dark').attribution,
    },
    fiord: {
      id: 'fiord',
      label: 'Coastal & Ghat Slate',
      description: 'Deep slate palette highlighting hydrography and regional corridors',
      url: getStyleUrl('fiord').url,
      minZoom: 2,
      maxZoom: 20,
      supports3DBuildings: false,
      supportsTerrain: false,
      attribution: getStyleUrl('fiord').attribution,
    },
  },
  // Bounding box encompassing all 31 districts of Karnataka (Bidar to Chamarajanagar, Karwar to Kolar)
  karnatakaBounds: [
    [74.0, 11.5],
    [78.6, 18.5],
  ],
  karnatakaCenter: [75.7139, 15.3173],
  defaultZoom: 6.6,
  routingProvider: (env.VITE_ROUTING_PROVIDER as RoutingProviderId) || 'osrm',
  osrmBaseUrl: env.VITE_OSRM_BASE_URL || 'https://router.project-osrm.org',
  orsBaseUrl: env.VITE_ORS_BASE_URL || 'https://api.openrouteservice.org',
  orsApiKey: env.VITE_ORS_API_KEY || '',
  valhallaBaseUrl: env.VITE_VALHALLA_BASE_URL || 'https://valhalla1.openstreetmap.de',
  productionAvailabilityNote:
    'Reliable multi-tier basemap architecture using CARTO GL vector styles with instant failover to OpenStreetMap raster cartography and Google Maps external handoff.',
};

export function getBasemapStyle(styleId: BasemapStyleId): BasemapStyleConfig {
  return MAP_PROVIDER_CONFIG.styles[styleId] ?? MAP_PROVIDER_CONFIG.styles.bright;
}

/**
 * Builds an official Google Maps Directions URL for the given route stops.
 */
export function buildGoogleMapsRouteUrl(
  originCoords: [number, number],
  stopCoords: [number, number][]
): string {
  if (stopCoords.length === 0) {
    return `https://www.google.com/maps/search/?api=1&query=${originCoords[1]},${originCoords[0]}`;
  }
  const originStr = `${originCoords[1]},${originCoords[0]}`;
  const destCoords = stopCoords[stopCoords.length - 1];
  const destStr = `${destCoords[1]},${destCoords[0]}`;
  const intermediate = stopCoords.slice(0, -1);

  const url = new URL('https://www.google.com/maps/dir/');
  url.searchParams.set('api', '1');
  url.searchParams.set('origin', originStr);
  url.searchParams.set('destination', destStr);
  if (intermediate.length > 0) {
    const waypoints = intermediate.map((c) => `${c[1]},${c[0]}`).join('|');
    url.searchParams.set('waypoints', waypoints);
  }
  url.searchParams.set('travelmode', 'driving');
  return url.toString();
}

/**
 * Builds an OpenStreetMap Directions URL for the given route stops.
 */
export function buildOpenStreetMapRouteUrl(
  originCoords: [number, number],
  stopCoords: [number, number][]
): string {
  if (stopCoords.length === 0) {
    return `https://www.openstreetmap.org/#map=10/${originCoords[1]}/${originCoords[0]}`;
  }
  const destCoords = stopCoords[stopCoords.length - 1];
  return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${originCoords[1]}%2C${originCoords[0]}%3B${destCoords[1]}%2C${destCoords[0]}`;
}
