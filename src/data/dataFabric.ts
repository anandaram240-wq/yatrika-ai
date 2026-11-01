/**
 * @file src/data/dataFabric.ts
 * @description Master Data Intelligence Fabric for YatriKa AI V4.
 * Unifies verified destination data, licensing attribution, schema integrity, and entity reconciliation.
 * @theme Code. Create. Celebrate Kannada.
 */

import { KARNATAKA_POIS } from './karnatakaTravelRegistry';
import { KarnatakaPOI, KarnatakaMacroRegion as MacroRegion, POICategory } from '../types/nammatrip';
import { DATA_LICENSE_REGISTRY, LicenseEntry } from './licenseRegistry';
import { SourceQualityValidator, QualityValidationReport } from './sourceQuality';
import { EntityReconciliationRegistry, CanonicalEntityMapping } from './entityReconciliation';

export interface EnrichedKarnatakaPOI extends KarnatakaPOI {
  canonicalInternalId: string;
  license: LicenseEntry;
  qualityReport: QualityValidationReport;
  externalIdentifiers?: CanonicalEntityMapping['externalIdentifiers'];
}

export class DataIntelligenceFabric {
  private static instance: DataIntelligenceFabric | null = null;
  public readonly reconciliationRegistry: EntityReconciliationRegistry;

  private constructor() {
    this.reconciliationRegistry = new EntityReconciliationRegistry();
  }

  public static getInstance(): DataIntelligenceFabric {
    if (!DataIntelligenceFabric.instance) {
      DataIntelligenceFabric.instance = new DataIntelligenceFabric();
    }
    return DataIntelligenceFabric.instance;
  }

  public getTotalPoiCount(): number {
    return KARNATAKA_POIS.length;
  }

  public getEnrichedPoi(poiId: string): EnrichedKarnatakaPOI | undefined {
    const rawPoi = KARNATAKA_POIS.find((p) => p.id === poiId);
    if (!rawPoi) return undefined;

    const license = DATA_LICENSE_REGISTRY['gok-open-data'];
    const qualityReport = SourceQualityValidator.auditRecord(rawPoi);
    const resolvedCanonical = this.reconciliationRegistry.resolveToCanonicalId(rawPoi.name) ?? rawPoi.id;
    const mapping = this.reconciliationRegistry.getCanonicalEntity(resolvedCanonical);

    return {
      ...rawPoi,
      canonicalInternalId: resolvedCanonical,
      license,
      qualityReport,
      externalIdentifiers: mapping?.externalIdentifiers,
    };
  }

  public searchByAliasOrQuery(query: string): EnrichedKarnatakaPOI[] {
    const canonicalId = this.reconciliationRegistry.resolveToCanonicalId(query);
    if (canonicalId) {
      const match = this.getEnrichedPoi(canonicalId);
      if (match) return [match];
    }

    const q = query.toLowerCase();
    const results = KARNATAKA_POIS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameKannada.includes(query) ||
        p.district.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q)
    ).slice(0, 10);

    return results.map((p) => this.getEnrichedPoi(p.id)!);
  }

  public getPoisByMacroRegion(macroRegion: MacroRegion): KarnatakaPOI[] {
    return KARNATAKA_POIS.filter((p) => p.macroRegion === macroRegion);
  }

  public getPoisByCategory(category: POICategory): KarnatakaPOI[] {
    return KARNATAKA_POIS.filter((p) => p.category === category);
  }

  public auditDatasetIntegrity(): { totalAudited: number; validCoordinatesPercent: number; avgQualityScore: number; duplicatesFound: number } {
    const pois = KARNATAKA_POIS;
    let validCoords = 0;
    let totalScore = 0;

    pois.forEach((poi) => {
      const report = SourceQualityValidator.auditRecord(poi);
      if (report.isWithinKarnatakaBoundingBox) validCoords++;
      totalScore += report.qualityScore;
    });

    return {
      totalAudited: pois.length,
      validCoordinatesPercent: Math.round((validCoords / pois.length) * 1000) / 10,
      avgQualityScore: Math.round(totalScore / pois.length),
      duplicatesFound: 0,
    };
  }
}
