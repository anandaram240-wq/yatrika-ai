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

// CARTO Global Basemaps (Ultra-fast CDN, zero auth required, 99.99% uptime)
export const CARTO_VOYAGER_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';
export const CARTO_POSITRON_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
export const CARTO_DARK_MATTER_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const CARTO_ATTRIBUTION =
  '© <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>';

/**
 * Built-in self-contained raster fallback style specification.
 * Used if vector style JSON download times out or encounters network restrictions.
 */
export const FALLBACK_RASTER_STYLE = {
  version: 8 as const,
  sources: {
    'osm-tiles': {
      type: 'raster' as const,
      tiles: [
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: 'osm-tiles-layer',
      type: 'raster' as const,
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export const MAP_PROVIDER_CONFIG: ProviderRegistryConfig = {
  mapProviderName: env.VITE_MAP_PROVIDER || 'carto',
  defaultStyleId: 'bright',
  fallbackStyleId: 'positron',
  styles: {
    bright: {
      id: 'bright',
      label: 'Day (Vibrant Streets)',
      description: 'High-contrast street, topography, and highway cartography powered by Carto Voyager',
      url: env.VITE_MAP_STYLE_URL || CARTO_VOYAGER_STYLE,
      minZoom: 2,
      maxZoom: 20,
      supports3DBuildings: true,
      supportsTerrain: false,
      attribution: CARTO_ATTRIBUTION,
    },
    liberty: {
      id: 'liberty',
      label: 'Outdoors & Terrain',
      description: 'Detailed general-purpose cartography with parks, peaks, and heritage corridors',
      url: CARTO_VOYAGER_STYLE,
      minZoom: 2,
      maxZoom: 20,
      supports3DBuildings: true,
      supportsTerrain: false,
      attribution: CARTO_ATTRIBUTION,
    },
    positron: {
      id: 'positron',
      label: 'Light Minimal',
      description: 'Clean light canvas that maximizes POI marker and route legibility',
      url: CARTO_POSITRON_STYLE,
      minZoom: 2,
      maxZoom: 20,
      supports3DBuildings: false,
      supportsTerrain: false,
      attribution: CARTO_ATTRIBUTION,
    },
    dark: {
      id: 'dark',
      label: 'Night Drive',
      description: 'Low-glare dark vector cartography for evening route planning',
      url: CARTO_DARK_MATTER_STYLE,
      minZoom: 2,
      maxZoom: 20,
      supports3DBuildings: false,
      supportsTerrain: false,
      attribution: CARTO_ATTRIBUTION,
    },
    fiord: {
      id: 'fiord',
      label: 'Coastal & Ghat Slate',
      description: 'Deep slate palette highlighting hydrography and regional corridors',
      url: CARTO_DARK_MATTER_STYLE,
      minZoom: 2,
      maxZoom: 20,
      supports3DBuildings: false,
      supportsTerrain: false,
      attribution: CARTO_ATTRIBUTION,
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
