/**
 * @file src/__tests__/v8ComprehensiveDestinations.test.ts
 * @description Unit tests for YatriKa AI V8 Comprehensive Destination Intelligence.
 * @theme Code. Create. Celebrate Kannada.
 */

import { describe, it, expect } from 'vitest';
import { DestinationRegistryV8 } from '../data/destinations/destinationRegistry';
import { DestinationVerifier } from '../data/destinations/destinationVerification';
import { DestinationDiscoveryService } from '../services/destinationDiscoveryService';

describe('YatriKa AI V8 — Comprehensive Destination Registry Suite', () => {
  const registry = DestinationRegistryV8.getInstance();

  it('1. verifies that flagship destinations have complete multi-domain dossiers', () => {
    const destinations = registry.getAll();
    expect(destinations.length).toBeGreaterThanOrEqual(6);

    for (const d of destinations) {
      expect(d.id).toBeDefined();
      expect(d.name).toBeDefined();
      expect(d.nameKannada.length).toBeGreaterThan(3);
      expect(d.district).toBeDefined();
      expect(d.taluk).toBeDefined();
      expect(d.description.length).toBeGreaterThan(30);
      expect(d.historicalSignificance.length).toBeGreaterThan(20);
      expect(d.openingHours).toBeDefined();
      expect(d.seasonalAccess.bestSeason).toBeDefined();
      expect(d.transitConnectivity.nearestRailwayStation).toBeDefined();
      expect(d.transitConnectivity.nearestBusTerminal).toBeDefined();
      expect(d.sourceRef.trustClassification).toBeDefined();
      expect(d.visitorRecommendations.length).toBeGreaterThan(0);
    }
  });

  it('2. validates that every destination coordinate strictly conforms to Karnataka geographical boundaries', () => {
    for (const d of registry.getAll()) {
      const isInside = DestinationVerifier.isWithinKarnataka(d.coordinates);
      expect(isInside).toBe(true);
    }
  });

  it('3. verifies authentic Kannada typography and Unicode block encoding', () => {
    for (const d of registry.getAll()) {
      const isValidKannada = DestinationVerifier.hasValidKannada(d.nameKannada);
      expect(isValidKannada).toBe(true);
    }
  });

  it('4. verifies multi-dimensional discovery search and filtering', () => {
    // Search by district 'Hassan'
    const hassanSearch = DestinationDiscoveryService.search({ district: 'Hassan' });
    expect(hassanSearch.comprehensiveResults.length).toBeGreaterThanOrEqual(2);
    expect(hassanSearch.comprehensiveResults.some((d) => d.id === 'poi-belur-halebidu')).toBe(true);

    // Search by free entry
    const freeSearch = DestinationDiscoveryService.search({ isFreeEntry: true });
    expect(freeSearch.comprehensiveResults.some((d) => d.entryFee.isFree)).toBe(true);

    // Get specific dossier
    const hampiDossier = DestinationDiscoveryService.getDestinationDossier('poi-virupaksha-temple');
    expect(hampiDossier.comprehensive).toBeDefined();
    expect(hampiDossier.comprehensive?.category).toBe('unesco_world_heritage');
  });
});
