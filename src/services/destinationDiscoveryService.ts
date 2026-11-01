/**
 * @file src/services/destinationDiscoveryService.ts
 * @description Advanced multi-criteria search and filter engine for Karnataka destinations.
 * Bridges the rich V8 Comprehensive Destinations and the full 650-POI baseline registry.
 * @theme Code. Create. Celebrate Kannada.
 */

import { DestinationRegistryV8, ComprehensiveDestination, DestinationCategoryV8 } from '../data/destinations/destinationRegistry';
import { KARNATAKA_POIS } from '../data/karnatakaTravelRegistry';
import { KarnatakaPOI, KarnatakaMacroRegion } from '../types/nammatrip';

export interface DestinationFilterCriteria {
  query?: string;
  district?: string;
  macroRegion?: KarnatakaMacroRegion;
  category?: DestinationCategoryV8 | string;
  season?: 'winter' | 'monsoon' | 'summer' | 'any';
  wheelchairAccessibleOnly?: boolean;
  maxDurationHours?: number;
  nearestTransportType?: 'railway' | 'bus' | 'any';
  isFreeEntry?: boolean;
}

export class DestinationDiscoveryService {
  private static registry = DestinationRegistryV8.getInstance();

  public static search(criteria: DestinationFilterCriteria): {
    comprehensiveResults: ComprehensiveDestination[];
    catalogMatches: KarnatakaPOI[];
    totalMatches: number;
  } {
    let comp = this.registry.getAll();
    let cat = [...KARNATAKA_POIS];

    // 1. Text Query Filter
    if (criteria.query && criteria.query.trim().length > 0) {
      const q = criteria.query.toLowerCase().trim();
      comp = comp.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.nameKannada.includes(q) ||
          d.district.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.alternateNames.some((a) => a.toLowerCase().includes(q))
      );
      cat = cat.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameKannada.includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q)
      );
    }

    // 2. District Filter
    if (criteria.district && criteria.district !== 'all') {
      const d = criteria.district.toLowerCase();
      comp = comp.filter((item) => item.district.toLowerCase() === d);
      cat = cat.filter((item) => item.district.toLowerCase() === d);
    }

    // 3. Macro-Region Filter
    if (criteria.macroRegion) {
      comp = comp.filter((item) => item.macroRegion === criteria.macroRegion);
      cat = cat.filter((item) => item.macroRegion === criteria.macroRegion);
    }

    // 4. Accessibility Filter
    if (criteria.wheelchairAccessibleOnly) {
      comp = comp.filter((item) => item.accessibility.wheelchairAccessible);
    }

    // 5. Free Entry Filter
    if (criteria.isFreeEntry) {
      comp = comp.filter((item) => item.entryFee.isFree || item.entryFee.indianCitizen === 0);
      cat = cat.filter((item) => item.entryFeeInr.indianCitizen === 0);
    }

    // 6. Max Duration Filter
    if (criteria.maxDurationHours) {
      const maxH = criteria.maxDurationHours;
      comp = comp.filter((item) => item.recommendedDurationHours <= maxH);
      cat = cat.filter((item) => (item.recommendedHours || 2) <= maxH);
    }

    return {
      comprehensiveResults: comp,
      catalogMatches: cat,
      totalMatches: comp.length + cat.length,
    };
  }

  public static getDestinationDossier(id: string): {
    comprehensive?: ComprehensiveDestination;
    catalogPoi?: KarnatakaPOI;
  } {
    const comprehensive = this.registry.getById(id);
    const catalogPoi = KARNATAKA_POIS.find((p) => p.id === id);
    return { comprehensive, catalogPoi };
  }
}
