/**
 * @file src/nlp/entityResolver.ts
 * @description Bilingual Kannada-English entity resolution across all 678 Karnataka destinations.
 * @theme Code. Create. Celebrate Kannada.
 */

import { KARNATAKA_POIS, KARNATAKA_GATEWAY_ORIGINS, UserOriginOption } from '../data/karnatakaTravelRegistry';
import { KarnatakaPOI } from '../types/nammatrip';

export interface ResolvedEntity {
  id: string;
  nameKannada: string;
  nameEnglish: string;
  district: string;
  macroRegion: string;
  confidence: number;
  isOriginHub: boolean;
}

export class EntityResolver {
  private static lookupMap = new Map<string, ResolvedEntity>();

  static {
    // Populate origins
    KARNATAKA_GATEWAY_ORIGINS.forEach((orig: UserOriginOption) => {
      const entry: ResolvedEntity = {
        id: orig.id,
        nameKannada: orig.nameKannada,
        nameEnglish: orig.name,
        district: orig.name.split('(')[0].trim(),
        macroRegion: 'Origin Hub',
        confidence: 1.0,
        isOriginHub: true,
      };
      this.registerAliases(orig.name, entry);
      this.registerAliases(orig.nameKannada, entry);
    });

    // Populate registry POIs
    KARNATAKA_POIS.forEach((poi: KarnatakaPOI) => {
      const entry: ResolvedEntity = {
        id: poi.id,
        nameKannada: poi.nameKannada,
        nameEnglish: poi.name,
        district: poi.district,
        macroRegion: poi.macroRegion,
        confidence: 0.95,
        isOriginHub: false,
      };
      this.registerAliases(poi.name, entry);
      this.registerAliases(poi.nameKannada, entry);
      this.registerAliases(poi.id, entry);
    });
  }

  private static registerAliases(alias: string, entity: ResolvedEntity) {
    if (!alias) return;
    const clean = alias
      .toLowerCase()
      .normalize('NFC')
      .replace(/[.,!?;:()[\]{}"'“”‘’]/gu, '')
      .trim();
    if (clean) {
      this.lookupMap.set(clean, entity);
    }
  }

  /**
   * Resolves a raw word or phrase into a Karnataka POI or origin entity.
   */
  public static resolvePlace(token: string): ResolvedEntity | undefined {
    const clean = token
      .toLowerCase()
      .normalize('NFC')
      .replace(/[.,!?;:()[\]{}"'“”‘’]/gu, '')
      .trim();

    if (!clean) return undefined;

    // Direct match
    if (this.lookupMap.has(clean)) {
      return this.lookupMap.get(clean);
    }

    // Common transliterated variations
    const norm = clean
      .replace(/galur|galuru/g, 'magalur')
      .replace(/bengaluru|bangalore/g, 'bengaluru')
      .replace(/mysuru|mysore/g, 'mysuru')
      .replace(/hosapete|hospet/g, 'hosapete');

    for (const [key, entity] of this.lookupMap.entries()) {
      if (key.includes(norm) || norm.includes(key)) {
        return entity;
      }
    }

    return undefined;
  }
}
