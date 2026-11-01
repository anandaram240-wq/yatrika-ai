/**
 * @file src/data/entityReconciliation.ts
 * @description Single Authoritative Internal POI Identity & Alias Reconciliation Engine.
 * Supports cross-system identifiers (OSM, Wikidata, Tourism Dept, ASI) and phonetic aliases.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface CanonicalEntityMapping {
  internalPoiId: string;
  canonicalName: string;
  canonicalNameKannada: string;
  district: string;
  externalIdentifiers: {
    osmId?: string;
    wikidataId?: string;
    asiProtectedCode?: string;
    kstdcPortalSlug?: string;
  };
  knownAliases: string[];
}

export class EntityReconciliationRegistry {
  private canonicalMap = new Map<string, CanonicalEntityMapping>();
  private aliasIndex = new Map<string, string>(); // normalized alias -> internalPoiId

  constructor() {
    this.seedAuthoritativeEntities();
  }

  private normalize(str: string): string {
    return str
      .toLowerCase()
      .replace(/[\s\-_'’.]+/g, '')
      .replace(/[^a-z0-9\u0C80-\u0CFF]/g, '');
  }

  private seedAuthoritativeEntities() {
    const seed: CanonicalEntityMapping[] = [
      {
        internalPoiId: 'poi-virupaksha-temple',
        canonicalName: 'Virupaksha Temple Hampi',
        canonicalNameKannada: 'ವಿರೂಪಾಕ್ಷ ದೇವಸ್ಥಾನ ಹಂಪಿ',
        district: 'Vijayanagara',
        externalIdentifiers: {
          osmId: 'node/253918239',
          wikidataId: 'Q2504826',
          asiProtectedCode: 'ASI-N-KA-D14',
          kstdcPortalSlug: 'virupaksha-temple-hampi',
        },
        knownAliases: [
          'Hampi',
          'Hampe',
          'ಹಂಪಿ',
          'ಪಂಪಾಪತಿ',
          'Pampapathi Temple',
          'Virupaksha',
          'Vijayanagara ruins',
          'Hampi main temple',
        ],
      },
      {
        internalPoiId: 'poi-chennakeshava-belur',
        canonicalName: 'Chennakeshava Temple Belur',
        canonicalNameKannada: 'ಚನ್ನಕೇಶವ ದೇವಾಲಯ ಬೇಲೂರು',
        district: 'Hassan',
        externalIdentifiers: {
          osmId: 'way/11928374',
          wikidataId: 'Q3537293',
          asiProtectedCode: 'ASI-N-KA-D7',
          kstdcPortalSlug: 'belur-chennakeshava',
        },
        knownAliases: [
          'Belur',
          'Beluru',
          'ಬೇಲೂರು',
          'Velapura',
          'Chennakesava',
          'Chennigaraya',
          'Hoysala Belur',
        ],
      },
      {
        internalPoiId: 'poi-hoysaleswara-halebidu',
        canonicalName: 'Hoysaleswara Temple Halebidu',
        canonicalNameKannada: 'ಹೊಯ್ಸಳೇಶ್ವರ ದೇವಾಲಯ ಹಳೇಬೀಡು',
        district: 'Hassan',
        externalIdentifiers: {
          osmId: 'way/9283741',
          wikidataId: 'Q3633658',
          asiProtectedCode: 'ASI-N-KA-D8',
          kstdcPortalSlug: 'halebeedu-temple',
        },
        knownAliases: [
          'Halebidu',
          'Halebeedu',
          'ಹಳೇಬೀಡು',
          'Dorasamudra',
          'Dwarasamudra',
          'Hoysaleshwara',
        ],
      },
      {
        internalPoiId: 'poi-mullayanagiri-peak',
        canonicalName: 'Mullayanagiri Peak',
        canonicalNameKannada: 'ಮುಳ್ಳಯ್ಯನಗಿರಿ ಶಿಖರ',
        district: 'Chikkamagaluru',
        externalIdentifiers: {
          osmId: 'node/38172635',
          wikidataId: 'Q3530861',
          kstdcPortalSlug: 'mullayanagiri-peak',
        },
        knownAliases: [
          'Mullayanagiri',
          'Mullayyana Giri',
          'ಮುಳ್ಳಯ್ಯನಗಿರಿ',
          'Highest peak of Karnataka',
          'Bababudangiri range summit',
        ],
      },
      {
        internalPoiId: 'poi-chamundeshwari-mysuru',
        canonicalName: 'Chamundeshwari Temple Mysuru',
        canonicalNameKannada: 'ಚಾಮುಂಡೇಶ್ವರಿ ದೇವಾಲಯ ಮೈಸೂರು',
        district: 'Mysuru',
        externalIdentifiers: {
          wikidataId: 'Q5069871',
          kstdcPortalSlug: 'chamundi-hills-mysuru',
        },
        knownAliases: [
          'Chamundi Hill',
          'Chamundi Betta',
          'ಚಾಮುಂಡಿ ಬೆಟ್ಟ',
          'Mysuru temple',
          'Chamundeshwari',
        ],
      },
    ];

    seed.forEach((entity) => {
      this.canonicalMap.set(entity.internalPoiId, entity);
      // Index primary names and aliases
      const allTokens = [
        entity.canonicalName,
        entity.canonicalNameKannada,
        ...entity.knownAliases,
        ...(entity.externalIdentifiers.wikidataId ? [entity.externalIdentifiers.wikidataId] : []),
        ...(entity.externalIdentifiers.asiProtectedCode ? [entity.externalIdentifiers.asiProtectedCode] : []),
      ];

      allTokens.forEach((token) => {
        this.aliasIndex.set(this.normalize(token), entity.internalPoiId);
      });
    });
  }

  public registerEntity(entity: CanonicalEntityMapping) {
    this.canonicalMap.set(entity.internalPoiId, entity);
    const tokens = [entity.canonicalName, entity.canonicalNameKannada, ...entity.knownAliases];
    tokens.forEach((t) => this.aliasIndex.set(this.normalize(t), entity.internalPoiId));
  }

  public resolveToCanonicalId(queryOrAlias: string): string | undefined {
    const norm = this.normalize(queryOrAlias);
    if (this.aliasIndex.has(norm)) {
      return this.aliasIndex.get(norm);
    }
    // Substring lookup
    for (const [indexedNorm, id] of this.aliasIndex.entries()) {
      if (indexedNorm.length > 3 && (norm.includes(indexedNorm) || indexedNorm.includes(norm))) {
        return id;
      }
    }
    return undefined;
  }

  public getCanonicalEntity(internalPoiId: string): CanonicalEntityMapping | undefined {
    return this.canonicalMap.get(internalPoiId);
  }
}
