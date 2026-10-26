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

const OPENFREEMAP_ATTRIBUTION =
  '© <a href="https://openfreemap.org" target="_blank" rel="noreferrer">OpenFreeMap</a> © <a href="https://www.openmaptiles.org/" target="_blank" rel="noreferrer">OpenMapTiles</a> Data from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>';

export const MAP_PROVIDER_CONFIG: ProviderRegistryConfig = {
  mapProviderName: env.VITE_MAP_PROVIDER || 'openfreemap',
  defaultStyleId: 'bright',
  fallbackStyleId: 'positron',
  styles: {
    bright: {
      id: 'bright',
      label: 'Standard Bright',
      description: 'High-contrast street and highway map ideal for road trips',
      url: env.VITE_MAP_STYLE_URL || 'https://tiles.openfreemap.org/styles/bright',
      minZoom: 4,
      maxZoom: 18.5, // True vector source limit; avoids empty over-zoom promises
      supports3DBuildings: true,
      supportsTerrain: false,
      attribution: OPENFREEMAP_ATTRIBUTION,
    },
    liberty: {
      id: 'liberty',
      label: 'Outdoors & Heritage',
      description: 'Detailed general-purpose cartography with parks and landmarks',
      url: 'https://tiles.openfreemap.org/styles/liberty',
      minZoom: 4,
      maxZoom: 18.5,
      supports3DBuildings: true,
      supportsTerrain: false,
      attribution: OPENFREEMAP_ATTRIBUTION,
    },
    positron: {
      id: 'positron',
      label: 'Light Minimal',
      description: 'Clean light canvas that maximizes POI marker and route legibility',
      url: 'https://tiles.openfreemap.org/styles/positron',
      minZoom: 4,
      maxZoom: 18.5,
      supports3DBuildings: false,
      supportsTerrain: false,
      attribution: OPENFREEMAP_ATTRIBUTION,
    },
    dark: {
      id: 'dark',
      label: 'Night Drive',
      description: 'Low-glare dark vector cartography for evening route planning',
      url: 'https://tiles.openfreemap.org/styles/dark',
      minZoom: 4,
      maxZoom: 18.5,
      supports3DBuildings: false,
      supportsTerrain: false,
      attribution: OPENFREEMAP_ATTRIBUTION,
    },
    fiord: {
      id: 'fiord',
      label: 'Coastal & Ghat Slate',
      description: 'Deep slate palette highlighting hydrography and regional corridors',
      url: 'https://tiles.openfreemap.org/styles/fiord',
      minZoom: 4,
      maxZoom: 18.5,
      supports3DBuildings: false,
      supportsTerrain: false,
      attribution: OPENFREEMAP_ATTRIBUTION,
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
    'OpenFreeMap public vector tiles and OSRM demo routing are zero-key public services suitable for hackathon demonstrations. Neither guarantees commercial SLA; replace VITE_MAP_STYLE_URL and VITE_ROUTING_PROVIDER for production deployment.',
};

export function getBasemapStyle(styleId: BasemapStyleId): BasemapStyleConfig {
  return MAP_PROVIDER_CONFIG.styles[styleId] ?? MAP_PROVIDER_CONFIG.styles.bright;
}
