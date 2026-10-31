// src/types/nammatrip.ts

export type MapLayerCategory =
  | 'attraction'
  | 'heritage'
  | 'temple'
  | 'hill_trek'
  | 'beach_coastal'
  | 'wildlife_nature'
  | 'railway_station'
  | 'bus_terminal'
  | 'airport'
  | 'accommodation'
  | 'food_dining'
  | 'emergency_facility'
  | 'itinerary_stops'
  | 'planned_route'
  | 'alternative_route';

export type KarnatakaMacroRegion =
  | 'Old Mysuru'
  | 'Malnad & Western Ghats'
  | 'Karavali Coastal'
  | 'Kittur Karnataka'
  | 'Kalyana Karnataka'
  | 'Central Karnataka'
  | 'Bayaluseeme';

export type BudgetTier = 'backpacker' | 'comfort' | 'premium';

export interface RegionalKannadaPhrase {
  kannada: string;
  iast: string;
  english: string;
  dialectLabel: string;
  usageContext: string;
}

export interface TransportHubMetadata {
  hubType: 'railway' | 'ksrtc_bus' | 'airport';
  officialCode: string; // e.g., "SBC", "MYS", "HPT", "UD", "KSRTC-MAJ"
  zoneOrOperator: string; // e.g., "South Western Railway (SWR)", "KSRTC", "Konkan Railway"
  bookingPortalUrl: string;
  majorConnections: string[];
  referenceFareNote: string;
}

export type POICategory = Exclude<MapLayerCategory, 'itinerary_stops' | 'planned_route' | 'alternative_route'>;
export type BestTimeOfDay = 'Sunrise' | 'Morning' | 'Afternoon' | 'Sunset' | 'Evening' | 'Night' | '24 Hours';

export interface KarnatakaPOI {
  id: string;
  name: string;
  nameKannada: string;
  category: POICategory;
  district: string;
  macroRegion: KarnatakaMacroRegion;
  coordinates: [number, number]; // [lng, lat]
  minZoomLevel?: number; // Progressive LOD threshold
  summary: string;
  recommendedHours: number;
  bestTimeOfDay: string;
  entryFeeInr: {
    indianCitizen: number;
    foreignNational?: number;
    feeNote: string;
  };
  openingHours: string;
  officialUrl?: string;
  sourceAttribution: string;
  verifiedDate: string;
  nearestRailwayId: string;
  nearestBusTerminalId: string;
  localPhrase: RegionalKannadaPhrase;
  transportMeta?: TransportHubMetadata;
  costEstimatePerPersonInr?: number;
  photoUrl?: string;
}

export interface RouteManeuverStep {
  instruction: string;
  distanceKm: number;
  durationMinutes: number;
  roadName: string;
  maneuverType: string;
}

export interface RouteLegSummary {
  fromStopId: string;
  fromStopName: string;
  toStopId: string;
  toStopName: string;
  distanceKm: number;
  durationMinutes: number;
  steps: RouteManeuverStep[];
}

export interface ComputedTripRoute {
  provenance: 'live_osrm' | 'live_ors' | 'live_valhalla' | 'fallback_geodesic_corridor';
  provenanceLabel: string;
  totalDistanceKm: number;
  totalDurationMinutes: number;
  primaryGeometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
  alternativeGeometry?: {
    type: 'LineString';
    coordinates: [number, number][];
  };
  legs: RouteLegSummary[];
}

export interface TripBudgetBreakdown {
  tier: BudgetTier;
  days: number;
  travellers: number;
  transportInr: number;
  accommodationInr: number;
  foodInr: number;
  entryAndActivitiesInr: number;
  totalInr: number;
  perPersonPerDayInr: number;
}

export interface CuratedCircuitPreset {
  id: string;
  title: string;
  subtitle: string;
  days: number;
  defaultTier: BudgetTier;
  stopIds: string[];
  highlights: string[];
}
