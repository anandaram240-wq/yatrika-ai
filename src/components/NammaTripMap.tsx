// src/components/NammaTripMap.tsx

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { BasemapStyleId, getBasemapStyle, MAP_PROVIDER_CONFIG } from '../config/mapProviders';
import { ComputedTripRoute, KarnatakaPOI, MapLayerCategory } from '../types/nammatrip';
import { LAYER_CATEGORY_META } from '../data/karnatakaTravelRegistry';

interface NammaTripMapProps {
  allPois: KarnatakaPOI[];
  itineraryStops: KarnatakaPOI[];
  selectedPoiId: string | null;
  onSelectPoi: (poiId: string) => void;
  route: ComputedTripRoute;
  activeLayers: Record<MapLayerCategory, boolean>;
  styleId: BasemapStyleId;
  onChangeStyleId: (styleId: BasemapStyleId) => void;
  sidebarOpen: boolean;
}

const COLOR_MAP: Record<string, string> = Object.fromEntries(
  LAYER_CATEGORY_META.map((m) => [m.id, m.colorHex])
);

export const NammaTripMap: React.FC<NammaTripMapProps> = ({
  allPois,
  itineraryStops,
  selectedPoiId,
  onSelectPoi,
  route,
  activeLayers,
  styleId,
  onChangeStyleId,
  sidebarOpen,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [is3DEnabled, setIs3DEnabled] = useState(false);
  const [measureMode, setMeasureMode] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);

  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const getCameraPadding = useCallback((): maplibregl.PaddingOptions => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) {
      return { top: 48, bottom: 260, left: 24, right: 24 };
    }
    return {
      top: 48,
      bottom: 48,
      left: sidebarOpen ? 400 : 48,
      right: 48,
    };
  }, [sidebarOpen]);

  // Build GeoJSON payloads for POIs, Ordered Itinerary Stops, and Routes
  const buildPoiGeoJson = useCallback(() => {
    const stopSet = new Set(itineraryStops.map((s) => s.id));
    const features = allPois
      .filter((poi) => activeLayers[poi.category])
      .map((poi) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: poi.coordinates,
        },
        properties: {
          id: poi.id,
          name: poi.name,
          nameKannada: poi.nameKannada,
          category: poi.category,
          color: COLOR_MAP[poi.category] || '#2563eb',
          minZoomLevel: poi.minZoomLevel,
          isSelected: poi.id === selectedPoiId ? 1 : 0,
          isStop: stopSet.has(poi.id) ? 1 : 0,
        },
      }));

    return {
      type: 'FeatureCollection' as const,
      features,
    };
  }, [allPois, itineraryStops, activeLayers, selectedPoiId]);

  const buildStopsGeoJson = useCallback(() => {
    const features = activeLayers.itinerary_stops
      ? itineraryStops.map((stop, idx) => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: stop.coordinates,
          },
          properties: {
            id: stop.id,
            stopNumber: idx + 1,
            label: `${idx + 1}. ${stop.name}`,
          },
        }))
      : [];

    return {
      type: 'FeatureCollection' as const,
      features,
    };
  }, [itineraryStops, activeLayers.itinerary_stops]);

  const buildRouteGeoJson = useCallback(
    (isAlt: boolean) => {
      const geom = isAlt ? route.alternativeGeometry : route.primaryGeometry;
      const enabled = isAlt ? activeLayers.alternative_route : activeLayers.planned_route;

      if (!enabled || !geom || geom.coordinates.length < 2) {
        return { type: 'FeatureCollection' as const, features: [] };
      }

      return {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            geometry: geom,
            properties: {
              provenance: route.provenance,
            },
          },
        ],
      };
    },
    [route, activeLayers.planned_route, activeLayers.alternative_route]
  );

  // Sync or initialize custom sources and layers whenever style loads or data updates
  const syncMapSourcesAndLayers = useCallback(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    // 1. Alternative Route Source & Layer
    const altData = buildRouteGeoJson(true);
    const existingAltSource = map.getSource('nammatrip-alt-route') as maplibregl.GeoJSONSource | undefined;
    if (existingAltSource) {
      existingAltSource.setData(altData);
    } else {
      map.addSource('nammatrip-alt-route', { type: 'geojson', data: altData });
      map.addLayer({
        id: 'nammatrip-alt-route-line',
        type: 'line',
        source: 'nammatrip-alt-route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#64748b',
          'line-width': 4,
          'line-dasharray': [2, 2],
          'line-opacity': 0.75,
        },
      });
    }

    // 2. Primary Route Source & Casing + Inner Layers
    const primaryData = buildRouteGeoJson(false);
    const existingRouteSource = map.getSource('nammatrip-primary-route') as maplibregl.GeoJSONSource | undefined;
    if (existingRouteSource) {
      existingRouteSource.setData(primaryData);
    } else {
      map.addSource('nammatrip-primary-route', { type: 'geojson', data: primaryData });
      map.addLayer({
        id: 'nammatrip-primary-route-casing',
        type: 'line',
        source: 'nammatrip-primary-route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#1e3a8a',
          'line-width': 8,
          'line-opacity': 0.85,
        },
      });
      map.addLayer({
        id: 'nammatrip-primary-route-line',
        type: 'line',
        source: 'nammatrip-primary-route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 4.5,
          'line-opacity': 0.98,
        },
      });
    }

    // 3. Clustered POI Source & Layers
    const poiData = buildPoiGeoJson();
    const existingPoiSource = map.getSource('nammatrip-pois') as maplibregl.GeoJSONSource | undefined;
    if (existingPoiSource) {
      existingPoiSource.setData(poiData);
    } else {
      map.addSource('nammatrip-pois', {
        type: 'geojson',
        data: poiData,
        cluster: true,
        clusterMaxZoom: 10,
        clusterRadius: 40,
      });

      // Cluster circles
      map.addLayer({
        id: 'nammatrip-poi-clusters',
        type: 'circle',
        source: 'nammatrip-pois',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#0284c7',
            5,
            '#4f46e5',
            10,
            '#ea580c',
          ],
          'circle-radius': ['step', ['get', 'point_count'], 16, 5, 20, 10, 24],
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#ffffff',
        },
      });

      // Cluster count text
      map.addLayer({
        id: 'nammatrip-poi-cluster-count',
        type: 'symbol',
        source: 'nammatrip-pois',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-size': 12,
        },
        paint: {
          'text-color': '#ffffff',
        },
      });

      // Unclustered individual POI points
      map.addLayer({
        id: 'nammatrip-poi-points',
        type: 'circle',
        source: 'nammatrip-pois',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': ['get', 'color'],
          'circle-radius': [
            'case',
            ['==', ['get', 'isSelected'], 1],
            11,
            7.5,
          ],
          'circle-stroke-width': [
            'case',
            ['==', ['get', 'isSelected'], 1],
            3.5,
            2,
          ],
          'circle-stroke-color': '#ffffff',
        },
      });

      // Unclustered POI labels (Progressive LOD: shown from zoom 7.2+)
      map.addLayer({
        id: 'nammatrip-poi-labels',
        type: 'symbol',
        source: 'nammatrip-pois',
        minzoom: 7.2,
        filter: ['!', ['has', 'point_count']],
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 11,
          'text-offset': [0, 1.3],
          'text-anchor': 'top',
          'text-optional': true,
        },
        paint: {
          'text-color': '#0f172a',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1.5,
        },
      });
    }

    // 4. Numbered Itinerary Stop Badges
    const stopsData = buildStopsGeoJson();
    const existingStopsSource = map.getSource('nammatrip-stops') as maplibregl.GeoJSONSource | undefined;
    if (existingStopsSource) {
      existingStopsSource.setData(stopsData);
    } else {
      map.addSource('nammatrip-stops', { type: 'geojson', data: stopsData });
      map.addLayer({
        id: 'nammatrip-stops-circle',
        type: 'circle',
        source: 'nammatrip-stops',
        paint: {
          'circle-color': '#ea580c',
          'circle-radius': 13,
          'circle-stroke-width': 3,
          'circle-stroke-color': '#ffffff',
        },
      });
      map.addLayer({
        id: 'nammatrip-stops-number',
        type: 'symbol',
        source: 'nammatrip-stops',
        layout: {
          'text-field': ['to-string', ['get', 'stopNumber']],
          'text-size': 12,
        },
        paint: {
          'text-color': '#ffffff',
        },
      });
    }
  }, [buildPoiGeoJson, buildStopsGeoJson, buildRouteGeoJson]);

  // Initialize MapLibre GL JS instance ONCE on mount
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const initialStyle = getBasemapStyle(styleId);
    let mapInstance: maplibregl.Map;

    try {
      mapInstance = new maplibregl.Map({
        container: containerRef.current,
        style: initialStyle.url,
        center: MAP_PROVIDER_CONFIG.karnatakaCenter,
        zoom: MAP_PROVIDER_CONFIG.defaultZoom,
        minZoom: initialStyle.minZoom,
        maxZoom: initialStyle.maxZoom,
        attributionControl: false,
      });

      mapInstance.addControl(
        new maplibregl.AttributionControl({ compact: true }),
        'bottom-right'
      );
      mapInstance.addControl(
        new maplibregl.ScaleControl({ maxWidth: 110, unit: 'metric' }),
        'bottom-right'
      );

      mapInstance.on('load', () => {
        setMapReady(true);
        setMapError(null);
        syncMapSourcesAndLayers();
      });

      mapInstance.on('style.load', () => {
        syncMapSourcesAndLayers();
      });

      mapInstance.on('error', (evt: maplibregl.ErrorEvent) => {
        // Switch once to explicit fallback style if primary tile style fails to load
        if (evt && evt.error && String(evt.error.message || '').includes('style')) {
          setMapError('Primary tile style experienced a network error; using fallback vector configuration.');
        }
      });

      // Click handler for clusters
      mapInstance.on('click', 'nammatrip-poi-clusters', async (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
        const features = mapInstance.queryRenderedFeatures(e.point, {
          layers: ['nammatrip-poi-clusters'],
        });
        const clusterId = features[0]?.properties?.cluster_id;
        const source = mapInstance.getSource('nammatrip-pois') as maplibregl.GeoJSONSource;
        if (clusterId !== undefined && source && typeof source.getClusterExpansionZoom === 'function') {
          const zoom = await source.getClusterExpansionZoom(clusterId);
          const coords = (features[0].geometry as unknown as { coordinates: [number, number] }).coordinates;
          mapInstance.easeTo({
            center: coords,
            zoom,
            duration: prefersReducedMotion() ? 0 : 450,
          });
        }
      });

      // Click handler for individual POI or Stop marker
      const handleMarkerClick = (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
        const feat = e.features?.[0];
        const id = feat?.properties?.id;
        if (id) {
          onSelectPoi(String(id));
        }
      };

      mapInstance.on('click', 'nammatrip-poi-points', handleMarkerClick);
      mapInstance.on('click', 'nammatrip-stops-circle', handleMarkerClick);

      // Distance ruler click listener
      mapInstance.on('click', (e: maplibregl.MapMouseEvent) => {
        setMeasurePoints((prev) => {
          if (!mapInstance.getCanvas().dataset.measuring) return prev;
          return prev.length >= 2 ? [[e.lngLat.lng, e.lngLat.lat]] : [...prev, [e.lngLat.lng, e.lngLat.lat]];
        });
      });

      mapRef.current = mapInstance;
    } catch (err) {
      setMapError(
        err instanceof Error ? `WebGL Map Initialization Alert: ${err.message}` : 'WebGL context unavailable in this environment.'
      );
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Keep canvas dataset synced with measureMode
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (measureMode) {
      map.getCanvas().dataset.measuring = 'true';
    } else {
      delete map.getCanvas().dataset.measuring;
      setMeasurePoints([]);
    }
  }, [measureMode]);

  // ResizeObserver so opening/closing sidebar recalculates WebGL viewport
  useEffect(() => {
    if (!containerRef.current || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      mapRef.current?.resize();
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [sidebarOpen]);

  // Update GeoJSON data whenever POIs, stops, route, or layer visibility changes
  useEffect(() => {
    if (mapReady) {
      syncMapSourcesAndLayers();
    }
  }, [mapReady, syncMapSourcesAndLayers]);

  // Switch basemap style without losing active trip state
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const targetStyle = getBasemapStyle(styleId);
    map.setMinZoom(targetStyle.minZoom);
    map.setMaxZoom(targetStyle.maxZoom);
    map.setStyle(targetStyle.url);
  }, [styleId, mapReady]);

  // Animate camera to selected POI with sidebar-aware padding
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !selectedPoiId) return;
    const poi = allPois.find((p) => p.id === selectedPoiId);
    if (!poi) return;

    map.flyTo({
      center: poi.coordinates,
      zoom: Math.max(map.getZoom(), 11.5),
      padding: getCameraPadding(),
      duration: prefersReducedMotion() ? 0 : 750,
      essential: true,
    });
  }, [selectedPoiId, allPois, mapReady, getCameraPadding, prefersReducedMotion]);

  // Control Actions
  const handleZoomIn = () => {
    mapRef.current?.zoomIn({ duration: prefersReducedMotion() ? 0 : 250 });
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut({ duration: prefersReducedMotion() ? 0 : 250 });
  };

  const handleResetCompass = () => {
    mapRef.current?.easeTo({
      bearing: 0,
      pitch: 0,
      duration: prefersReducedMotion() ? 0 : 350,
    });
    setIs3DEnabled(false);
  };

  const handleToggle3DPitch = () => {
    const map = mapRef.current;
    if (!map) return;
    const next3D = !is3DEnabled;
    setIs3DEnabled(next3D);
    map.easeTo({
      pitch: next3D ? 52 : 0,
      bearing: next3D ? -15 : 0,
      duration: prefersReducedMotion() ? 0 : 450,
    });
  };

  const handleFitItinerary = useCallback(() => {
    const map = mapRef.current;
    if (!map || itineraryStops.length === 0) return;
    const bounds = new maplibregl.LngLatBounds();
    itineraryStops.forEach((s) => bounds.extend(s.coordinates));
    map.fitBounds(bounds, {
      padding: getCameraPadding(),
      maxZoom: 12.5,
      duration: prefersReducedMotion() ? 0 : 650,
    });
  }, [itineraryStops, getCameraPadding, prefersReducedMotion]);

  const handleResetKarnatakaOverview = () => {
    const map = mapRef.current;
    if (!map) return;
    map.fitBounds(MAP_PROVIDER_CONFIG.karnatakaBounds, {
      padding: getCameraPadding(),
      duration: prefersReducedMotion() ? 0 : 600,
    });
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current?.flyTo({
          center: [pos.coords.longitude, pos.coords.latitude],
          zoom: 12,
          padding: getCameraPadding(),
          duration: prefersReducedMotion() ? 0 : 700,
        });
      },
      () => {
        setMapError('Location permission was declined or unavailable.');
      }
    );
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  // Compute ruler distance if 2 points clicked
  const rulerDistanceKm =
    measurePoints.length === 2
      ? (() => {
          const [a, b] = measurePoints;
          const R = 6371;
          const dLat = ((b[1] - a[1]) * Math.PI) / 180;
          const dLng = ((b[0] - a[0]) * Math.PI) / 180;
          const s =
            Math.sin(dLat / 2) ** 2 +
            Math.cos((a[1] * Math.PI) / 180) *
              Math.cos((b[1] * Math.PI) / 180) *
              Math.sin(dLng / 2) ** 2;
          return (R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s))).toFixed(2);
        })()
      : null;

  const currentStyleMeta = getBasemapStyle(styleId);

  return (
    <div
      ref={containerRef}
      className="nammatrip-map-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '520px',
        background: '#e2e8f0',
      }}
      aria-label="NammaTrip AI Interactive Karnataka Geospatial Map"
    >
      {/* Top-Right Basemap Style Switcher & Camera Controls */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'flex-end',
        }}
      >
        {/* Basemap Style Selector */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.92)',
            color: '#f8fafc',
            padding: '6px 10px',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            fontSize: 12,
          }}
        >
          <label htmlFor="basemap-select" style={{ fontWeight: 600 }}>
            Map Style:
          </label>
          <select
            id="basemap-select"
            value={styleId}
            onChange={(e) => onChangeStyleId(e.target.value as BasemapStyleId)}
            style={{
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #475569',
              borderRadius: 6,
              padding: '4px 8px',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {Object.values(MAP_PROVIDER_CONFIG.styles).map((st) => (
              <option key={st.id} value={st.id}>
                {st.label}
              </option>
            ))}
          </select>
        </div>

        {/* Camera & Geospatial Control Cluster */}
        <div
          role="toolbar"
          aria-label="Map navigation controls"
          style={{
            background: 'rgba(255, 255, 255, 0.96)',
            borderRadius: 10,
            padding: 6,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            boxShadow: '0 4px 14px rgba(15,23,42,0.18)',
          }}
        >
          <button type="button" onClick={handleZoomIn} title="Zoom in" style={controlBtnStyle}>
            + Zoom In
          </button>
          <button type="button" onClick={handleZoomOut} title="Zoom out" style={controlBtnStyle}>
            − Zoom Out
          </button>
          <button
            type="button"
            onClick={handleFitItinerary}
            title="Fit all itinerary stops"
            style={controlBtnStyle}
          >
            ⊡ Fit Route
          </button>
          <button
            type="button"
            onClick={handleResetKarnatakaOverview}
            title="Reset to Karnataka overview"
            style={controlBtnStyle}
          >
            🗺️ Karnataka
          </button>
          <button
            type="button"
            onClick={handleResetCompass}
            title="Reset North orientation"
            style={controlBtnStyle}
          >
            🧭 North
          </button>
          {currentStyleMeta.supports3DBuildings && (
            <button
              type="button"
              onClick={handleToggle3DPitch}
              title="Toggle 3D perspective tilt"
              style={{
                ...controlBtnStyle,
                background: is3DEnabled ? '#dbeafe' : '#f8fafc',
                color: is3DEnabled ? '#1d4ed8' : '#0f172a',
              }}
            >
              {is3DEnabled ? '3D Tilt: ON' : '2D / 3D Tilt'}
            </button>
          )}
          <button
            type="button"
            onClick={() => setMeasureMode((m) => !m)}
            title="Measure distance between two points on map"
            style={{
              ...controlBtnStyle,
              background: measureMode ? '#fef3c7' : '#f8fafc',
            }}
          >
            📏 {measureMode ? 'Exit Ruler' : 'Ruler'}
          </button>
          <button
            type="button"
            onClick={handleLocateMe}
            title="Center on my location"
            style={controlBtnStyle}
          >
            📍 Locate Me
          </button>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            title="Toggle fullscreen map"
            style={controlBtnStyle}
          >
            ⛶ Fullscreen
          </button>
        </div>
      </div>

      {/* Distance Ruler Readout Banner */}
      {measureMode && (
        <div
          style={{
            position: 'absolute',
            bottom: 42,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            background: '#0f172a',
            color: '#f8fafc',
            padding: '8px 14px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          }}
        >
          {rulerDistanceKm
            ? `Direct Geodesic Distance: ${rulerDistanceKm} km (Click map to reset)`
            : `Click any 2 points on the map to measure distance (${measurePoints.length}/2 selected)`}
        </div>
      )}

      {/* Deliberate Error / Fallback Notice if WebGL or Tile Style encounters an issue */}
      {mapError && (
        <div
          role="status"
          style={{
            position: 'absolute',
            top: 12,
            left: sidebarOpen ? 390 : 16,
            zIndex: 10,
            background: '#fffbeb',
            border: '1px solid #f59e0b',
            color: '#92400e',
            padding: '8px 12px',
            borderRadius: 8,
            fontSize: 12,
            maxWidth: 360,
          }}
        >
          {mapError}
        </div>
      )}
    </div>
  );
};

const controlBtnStyle: React.CSSProperties = {
  border: '1px solid #cbd5e1',
  background: '#f8fafc',
  color: '#0f172a',
  borderRadius: 6,
  padding: '5px 9px',
  fontSize: 11,
  fontWeight: 600,
  cursor: 'pointer',
  textAlign: 'left',
};
