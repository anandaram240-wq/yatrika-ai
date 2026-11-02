/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPTILER_API_KEY?: string;
  readonly VITE_GOOGLE_MAP_TILES_API_KEY?: string;
  readonly VITE_OSRM_ROUTE_ENDPOINT?: string;
  readonly VITE_APP_ENV?: string;
  readonly VITE_PORT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
