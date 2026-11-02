// src/components/map/HampiDualModeMap.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { HAMPI_ATTRACTIONS, HampiAttraction, HampiClusterId } from '../../data/hampiVerifiedRegistry';
import { DestinationRecord } from '../../data/destinationsRegistry';

interface Props {
  destination: DestinationRecord;
  selectedPoiId: string | null;
  activeCluster: HampiClusterId | 'all';
  onSelectPoi: (poi: HampiAttraction) => void;
}

type TourState = 'idle' | 'playing' | 'paused';

const CLUSTER_COLORS: Record<HampiClusterId, string> = {
  sacred_centre: '#d97736',
  royal_centre: '#eab308',
  vittala_complex: '#2a9d8f',
  natural_cultural: '#10b981',
};

export const HampiDualModeMap: React.FC<Props> = ({
  destination,
  selectedPoiId,
  activeCluster,
  onSelectPoi,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const tourIndexRef = useRef<number>(0);
  const tourTimerRef = useRef<number | null>(null);
  const tourActiveRef = useRef<boolean>(false);

  const [is3DTerrain, setIs3DTerrain] = useState<boolean>(true);
  const [tourState, setTourState] = useState<TourState>('idle');
  const [tourCaption, setTourCaption] = useState<string>('');
  const [photorealisticProbeStatus, setPhotorealisticProbeStatus] = useState<
    'UNCHECKED' | 'DEM_TERRAIN_VERIFIED_NO_CITY_MESH' | 'GOOGLE_3D_ACTIVE'
  >('UNCHECKED');

  const prefersReducedMotion = useCallback(() => {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Initialize MapLibre GL JS instance once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const maptilerKey = import.meta.env.VITE_MAPTILER_API_KEY;
    const styleUrl = maptilerKey
      ? `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${maptilerKey}`
      : 'https://demotiles.maplibre.org/style.json';

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: destination.center,
      zoom: destination.defaultZoom,
      pitch: prefersReducedMotion() ? 0 : destination.defaultPitch,
      bearing: prefersReducedMotion() ? 0 : destination.defaultBearing,
      maxPitch: 75,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 120, unit: 'metric' }), 'bottom-right');

    map.on('load', () => {
      // Attach real DEM elevation source (MapTiler Terrain RGB when key present, else AWS Terrain Tiles)
      const terrainSourceConfig: maplibregl.RasterDEMSourceSpecification = maptilerKey
        ? {
            type: 'raster-dem',
            url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${maptilerKey}`,
            tileSize: 256,
          }
        : {
            type: 'raster-dem',
            tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
            encoding: 'terrarium',
            tileSize: 256,
            maxzoom: 15,
          };

      if (!map.getSource('karnataka-dem')) {
        map.addSource('karnataka-dem', terrainSourceConfig);
      }

      if (is3DTerrain) {
        map.setTerrain({ source: 'karnataka-dem', exaggeration: 1.45 });
      }

      setPhotorealisticProbeStatus(
        destination.coverage3D.googlePhotorealisticMeshVerified
          ? 'GOOGLE_3D_ACTIVE'
          : 'DEM_TERRAIN_VERIFIED_NO_CITY_MESH'
      );
    });

    mapRef.current = map;

    return () => {
      if (tourTimerRef.current) window.clearTimeout(tourTimerRef.current);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Fly to destination smoothly when destination changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (prefersReducedMotion()) {
      map.jumpTo({
        center: destination.center,
        zoom: destination.defaultZoom,
        pitch: 0,
        bearing: 0,
      });
    } else {
      map.flyTo({
        center: destination.center,
        zoom: destination.defaultZoom,
        pitch: is3DTerrain ? destination.defaultPitch : 0,
        bearing: is3DTerrain ? destination.defaultBearing : 0,
        duration: 1800,
        essential: true,
      });
    }
  }, [destination, is3DTerrain, prefersReducedMotion]);

  // Render verified Hampi POI markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    if (destination.id !== 'hampi') return;

    const visiblePois =
      activeCluster === 'all'
        ? HAMPI_ATTRACTIONS
        : HAMPI_ATTRACTIONS.filter((p) => p.cluster === activeCluster);

    visiblePois.forEach((poi) => {
      const el = document.createElement('button');
      const isSelected = poi.id === selectedPoiId;
      el.type = 'button';
      el.setAttribute('aria-label', `${poi.nameEn} (${poi.nameKn})`);
      el.style.width = isSelected ? '22px' : '16px';
      el.style.height = isSelected ? '22px' : '16px';
      el.style.borderRadius = '9999px';
      el.style.backgroundColor = CLUSTER_COLORS[poi.cluster];
      el.style.border = isSelected ? '3px solid #ffffff' : '2px solid #0c0f14';
      el.style.boxShadow = isSelected
        ? '0 0 0 6px rgba(217,119,54,0.45)'
        : '0 2px 6px rgba(0,0,0,0.6)';
      el.style.cursor = 'pointer';

      el.addEventListener('click', () => {
        onSelectPoi(poi);
        if (prefersReducedMotion()) {
          map.jumpTo({ center: poi.coordinates, zoom: 16.2 });
        } else {
          map.flyTo({
            center: poi.coordinates,
            zoom: 16.2,
            pitch: is3DTerrain ? 62 : 0,
            bearing: is3DTerrain ? 24 : 0,
            duration: 1400,
          });
        }
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(poi.coordinates)
        .addTo(map);
      markersRef.current.set(poi.id, marker);
    });
  }, [destination.id, activeCluster, selectedPoiId, is3DTerrain, onSelectPoi, prefersReducedMotion]);

  // Toggle 3D Elevation Terrain
  const toggle3DTerrain = () => {
    const map = mapRef.current;
    if (!map) return;
    const nextState = !is3DTerrain;
    setIs3DTerrain(nextState);
    if (nextState && map.getSource('karnataka-dem')) {
      map.setTerrain({ source: 'karnataka-dem', exaggeration: 1.45 });
      map.easeTo({ pitch: 58, bearing: -18, duration: prefersReducedMotion() ? 0 : 900 });
    } else {
      map.setTerrain(null);
      map.easeTo({ pitch: 0, bearing: 0, duration: prefersReducedMotion() ? 0 : 900 });
    }
  };

  // Stop-by-stop Camera Tour lifecycle (uses MapLibre moveend event, zero React frame loops)
  const executeTourStep = useCallback(
    (stepIdx: number) => {
      const map = mapRef.current;
      if (!map || !tourActiveRef.current) return;

      const stops = HAMPI_ATTRACTIONS;
      if (stepIdx >= stops.length) {
        tourActiveRef.current = false;
        setTourState('idle');
        setTourCaption('Tour completed.');
        return;
      }

      const target = stops[stepIdx];
      tourIndexRef.current = stepIdx;
      setTourCaption(
        `Stop ${stepIdx + 1}/${stops.length}: ${target.nameEn} (${target.nameKn}) — ${target.clusterLabel}`
      );
      onSelectPoi(target);

      map.flyTo({
        center: target.coordinates,
        zoom: 16.3,
        pitch: is3DTerrain ? 64 : 0,
        bearing: (stepIdx * 35) % 360,
        duration: prefersReducedMotion() ? 0 : 2400,
        essential: true,
      });

      map.once('moveend', () => {
        if (!tourActiveRef.current) return;
        tourTimerRef.current = window.setTimeout(() => {
          if (tourActiveRef.current) {
            executeTourStep(stepIdx + 1);
          }
        }, 2600);
      });
    },
    [is3DTerrain, onSelectPoi, prefersReducedMotion]
  );

  const startOrResumeTour = () => {
    tourActiveRef.current = true;
    setTourState('playing');
    executeTourStep(tourIndexRef.current);
  };

  const pauseTour = () => {
    tourActiveRef.current = false;
    if (tourTimerRef.current) window.clearTimeout(tourTimerRef.current);
    mapRef.current?.stop();
    setTourState('paused');
  };

  const restartTour = () => {
    if (tourTimerRef.current) window.clearTimeout(tourTimerRef.current);
    tourIndexRef.current = 0;
    tourActiveRef.current = true;
    setTourState('playing');
    executeTourStep(0);
  };

  const exitTour = () => {
    tourActiveRef.current = false;
    if (tourTimerRef.current) window.clearTimeout(tourTimerRef.current);
    mapRef.current?.stop();
    tourIndexRef.current = 0;
    setTourState('idle');
    setTourCaption('');
    mapRef.current?.flyTo({
      center: destination.center,
      zoom: destination.defaultZoom,
      pitch: is3DTerrain ? destination.defaultPitch : 0,
      bearing: is3DTerrain ? destination.defaultBearing : 0,
      duration: prefersReducedMotion() ? 0 : 1200,
    });
  };

  return (
    <div className="relative w-full h-[540px] rounded-2xl overflow-hidden border border-white/15 bg-[#0c0f14]">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top-Left 3D Mode & Coverage Truth Badge */}
      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 z-10">
        <button
          type="button"
          onClick={toggle3DTerrain}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#151a23]/90 text-[#f4f1ea] border border-white/20 hover:border-[#d97736] transition"
        >
          {is3DTerrain ? '3D Elevation Terrain: ON' : 'Standard 2D Map: ON'}
        </button>

        <span
          className="px-2.5 py-1 rounded-md text-[11px] bg-[#151a23]/90 text-emerald-400 border border-emerald-500/30"
          title={destination.coverage3D.coverageNote}
        >
          {photorealisticProbeStatus === 'DEM_TERRAIN_VERIFIED_NO_CITY_MESH'
            ? 'DEM Elevation + Surveyed WGS84 (Verified)'
            : '3D Coverage Active'}
        </span>
      </div>

      {/* Bottom Cinematic Tour Bar (Hampi) */}
      {destination.id === 'hampi' && (
        <div className="absolute bottom-3 left-3 right-16 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[#151a23]/95 border border-white/15 z-10">
          <div className="text-xs text-[#f4f1ea] font-medium truncate">
            {tourState === 'idle'
              ? 'Cinematic Tour: 18 Verified Hampi Monuments across 4 Geographic Clusters'
              : tourCaption}
          </div>
          <div className="flex items-center gap-1.5">
            {tourState !== 'playing' ? (
              <button
                type="button"
                onClick={startOrResumeTour}
                className="px-3 py-1 rounded-md text-xs font-semibold bg-[#d97736] text-black hover:bg-[#e5894a]"
              >
                {tourState === 'paused' ? 'Resume Tour' : 'Start 3D Tour'}
              </button>
            ) : (
              <button
                type="button"
                onClick={pauseTour}
                className="px-3 py-1 rounded-md text-xs font-semibold bg-amber-500 text-black"
              >
                Pause
              </button>
            )}
            {tourState !== 'idle' && (
              <>
                <button
                  type="button"
                  onClick={restartTour}
                  className="px-2.5 py-1 rounded-md text-xs bg-white/10 text-white hover:bg-white/20"
                >
                  Restart
                </button>
                <button
                  type="button"
                  onClick={exitTour}
                  className="px-2.5 py-1 rounded-md text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30"
                >
                  Exit Tour
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

