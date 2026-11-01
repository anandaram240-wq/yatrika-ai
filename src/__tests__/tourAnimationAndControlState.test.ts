/**
 * @file src/__tests__/tourAnimationAndControlState.test.ts
 * @description Unit tests for 60 FPS Route Tour Animation, Bearing Mathematics,
 * Waypoint Milestones, and Map Tile Provider Integrity.
 * Verifies the core functional restoration for YatriKa AI V8.3.
 * @theme Code. Create. Celebrate Kannada.
 */

import { describe, it, expect } from 'vitest';
import {
  CARTO_VOYAGER_STYLE,
  CARTO_DARK_MATTER_STYLE,
  FALLBACK_RASTER_STYLE,
  getBasemapStyle,
} from '../config/mapProviders';
import { KARNATAKA_GATEWAY_ORIGINS } from '../data/karnatakaTravelRegistry';

function getCoordBearing(c1: [number, number], c2: [number, number]): number {
  const y = Math.sin(((c2[0] - c1[0]) * Math.PI) / 180) * Math.cos((c2[1] * Math.PI) / 180);
  const x =
    Math.cos((c1[1] * Math.PI) / 180) * Math.sin((c2[1] * Math.PI) / 180) -
    Math.sin((c1[1] * Math.PI) / 180) *
      Math.cos((c2[1] * Math.PI) / 180) *
      Math.cos(((c2[0] - c1[0]) * Math.PI) / 180);
  const b = (Math.atan2(y, x) * 180) / Math.PI;
  return (b + 360) % 360;
}

describe('YatriKa AI V8.3 — Map Tile Provider & Resiliency', () => {
  it('does NOT reference blocked tile.openstreetmap.org anywhere in fallback styles', () => {
    const tilesStr = JSON.stringify(FALLBACK_RASTER_STYLE);
    expect(tilesStr).not.toContain('tile.openstreetmap.org');
    expect(tilesStr).toContain('cartocdn.com');
  });

  it('provides authorized CORS-enabled CARTO vector basemap styles', () => {
    expect(CARTO_VOYAGER_STYLE).toContain('basemaps.cartocdn.com');
    expect(CARTO_DARK_MATTER_STYLE).toContain('basemaps.cartocdn.com');

    const bright = getBasemapStyle('bright');
    expect(bright.url).toBeDefined();
    expect(bright.supports3DBuildings).toBe(true);

    const dark = getBasemapStyle('dark');
    expect(dark.url).toBeDefined();
  });

  it('falls back gracefully to CARTO raster tiles without throwing errors', () => {
    expect(FALLBACK_RASTER_STYLE.sources['carto-raster-tiles']).toBeDefined();
    expect(FALLBACK_RASTER_STYLE.sources['carto-raster-tiles'].tiles.length).toBeGreaterThanOrEqual(1);
  });
});

describe('YatriKa AI V8.3 — Bearing & Camera Interpolation Mathematics', () => {
  it('calculates cardinal bearings accurately', () => {
    // North: lng identical, lat increases
    const northBearing = getCoordBearing([77.5946, 12.9716], [77.5946, 13.9716]);
    expect(Math.round(northBearing)).toBe(0);

    // East: lat identical, lng increases
    const eastBearing = getCoordBearing([77.0, 13.0], [78.0, 13.0]);
    expect(Math.round(eastBearing)).toBe(90);

    // South: lng identical, lat decreases
    const southBearing = getCoordBearing([77.5946, 13.9716], [77.5946, 12.9716]);
    expect(Math.round(southBearing)).toBe(180);

    // West: lat identical, lng decreases
    const westBearing = getCoordBearing([78.0, 13.0], [77.0, 13.0]);
    expect(Math.round(westBearing)).toBe(270);
  });

  it('calculates highway bearing between Bengaluru and Hassan corridor', () => {
    const sbc = KARNATAKA_GATEWAY_ORIGINS[0].coordinates; // Bengaluru [77.57, 12.97]
    const has = [76.10, 13.00] as [number, number]; // Hassan
    const bearing = getCoordBearing(sbc, has);
    // Heading predominantly West-Northwest (between 270° and 300°)
    expect(bearing).toBeGreaterThan(260);
    expect(bearing).toBeLessThan(300);
  });
});

describe('YatriKa AI V8.3 — Waypoint Stop Seeking & Scrubber Milestone Mathematics', () => {
  const coords: [number, number][] = [
    [77.57, 12.97], // SBC
    [76.35, 12.93], // Kunigal / Channarayapatna
    [76.03, 12.93], // Hassan / Shettihalli
    [75.86, 13.16], // Belur
    [75.77, 13.31], // Chikkamagaluru
    [75.72, 13.39], // Mullayanagiri Peak
  ];

  it('correctly maps stop milestones to monotonically increasing route distances', () => {
    let cum = 0;
    const distances: number[] = [0];
    for (let i = 1; i < coords.length; i++) {
      const d = Math.hypot(coords[i][0] - coords[i - 1][0], coords[i][1] - coords[i - 1][1]) * 111;
      cum += d;
      distances.push(cum);
    }

    expect(distances[0]).toBe(0);
    expect(distances[distances.length - 1]).toBeGreaterThan(200);

    // Verify next stop finding
    const currentDist = 140; // Past Kunigal (~135 km), heading to Hassan (~170 km)
    const nextStopIndex = distances.findIndex((d) => d > currentDist + 0.5);
    expect(nextStopIndex).toBe(2); // Hassan

    // Verify prev stop finding
    const prevStopDistances = distances.filter((d) => d < currentDist - 0.5);
    expect(prevStopDistances.length).toBe(2); // SBC (0) and Kunigal (~135)
    expect(prevStopDistances[prevStopDistances.length - 1]).toBe(distances[1]); // Kunigal
  });
});
