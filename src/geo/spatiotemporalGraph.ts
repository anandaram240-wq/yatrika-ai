/**
 * @file src/geo/spatiotemporalGraph.ts
 * @description Spatiotemporal Travel Network Graph with time-dependent edge traversal costs for Karnataka.
 * @theme Code. Create. Celebrate Kannada.
 */

import { GeoUncertaintyClassifier, GhatHazardEvidence } from './geoUncertainty';
import { RouteTemporalAnalyzer } from './routeTemporalAnalyzer';

export interface SpatiotemporalEdge {
  fromNode: string;
  toNode: string;
  distanceKm: number;
  baseTimeMinutes: number;
  highwayCode: string;
  isGhatSection: boolean;
  passKey?: 'shiradi' | 'charmadi' | 'agumbe' | 'bisle' | 'sampaje';
  isClosed: boolean;
  statusNote?: string;
}

export class SpatiotemporalGraph {
  private edges: SpatiotemporalEdge[] = [];
  private nodes = new Set<string>();

  constructor() {
    this.seedKarnatakaCorridors();
  }

  private seedKarnatakaCorridors() {
    const rawEdges: Array<Omit<SpatiotemporalEdge, 'isClosed'>> = [
      // Bengaluru -> Hassan (NH-75 plains)
      { fromNode: 'Bengaluru', toNode: 'Hassan', distanceKm: 182, baseTimeMinutes: 180, highwayCode: 'NH-75', isGhatSection: false },
      // Hassan -> Sakleshpur
      { fromNode: 'Hassan', toNode: 'Sakleshpur', distanceKm: 42, baseTimeMinutes: 45, highwayCode: 'NH-75', isGhatSection: false },
      // Sakleshpur -> Gundya (Shiradi Ghat)
      { fromNode: 'Sakleshpur', toNode: 'Gundya', distanceKm: 26, baseTimeMinutes: 50, highwayCode: 'NH-75', isGhatSection: true, passKey: 'shiradi' },
      // Gundya -> Mangaluru
      { fromNode: 'Gundya', toNode: 'Mangaluru', distanceKm: 98, baseTimeMinutes: 105, highwayCode: 'NH-75', isGhatSection: false },

      // Hassan -> Belur
      { fromNode: 'Hassan', toNode: 'Belur', distanceKm: 38, baseTimeMinutes: 45, highwayCode: 'SH-57', isGhatSection: false },
      // Belur -> Chikkamagaluru
      { fromNode: 'Belur', toNode: 'Chikkamagaluru', distanceKm: 25, baseTimeMinutes: 30, highwayCode: 'SH-57', isGhatSection: false },
      // Chikkamagaluru -> Mudigere
      { fromNode: 'Chikkamagaluru', toNode: 'Mudigere', distanceKm: 30, baseTimeMinutes: 40, highwayCode: 'SH-64', isGhatSection: false },
      // Mudigere -> Belthangady (Charmadi Ghat)
      { fromNode: 'Mudigere', toNode: 'Belthangady', distanceKm: 35, baseTimeMinutes: 70, highwayCode: 'NH-73', isGhatSection: true, passKey: 'charmadi' },
      // Belthangady -> Mangaluru
      { fromNode: 'Belthangady', toNode: 'Mangaluru', distanceKm: 60, baseTimeMinutes: 70, highwayCode: 'NH-73', isGhatSection: false },

      // Chikkamagaluru -> Mullayanagiri
      { fromNode: 'Chikkamagaluru', toNode: 'Mullayanagiri', distanceKm: 22, baseTimeMinutes: 45, highwayCode: 'MDR-Peak', isGhatSection: true },

      // Shivamogga -> Thirthahalli
      { fromNode: 'Shivamogga', toNode: 'Thirthahalli', distanceKm: 62, baseTimeMinutes: 70, highwayCode: 'NH-169', isGhatSection: false },
      // Thirthahalli -> Someshwara (Agumbe Ghat)
      { fromNode: 'Thirthahalli', toNode: 'Someshwara', distanceKm: 32, baseTimeMinutes: 65, highwayCode: 'NH-169A', isGhatSection: true, passKey: 'agumbe' },
      // Someshwara -> Udupi
      { fromNode: 'Someshwara', toNode: 'Udupi', distanceKm: 45, baseTimeMinutes: 50, highwayCode: 'NH-169A', isGhatSection: false },

      // Mysuru -> Madikeri (NH-275)
      { fromNode: 'Mysuru', toNode: 'Madikeri', distanceKm: 120, baseTimeMinutes: 150, highwayCode: 'NH-275', isGhatSection: false },
      // Madikeri -> Sullia (Sampaje Ghat)
      { fromNode: 'Madikeri', toNode: 'Sullia', distanceKm: 52, baseTimeMinutes: 80, highwayCode: 'NH-275', isGhatSection: true, passKey: 'sampaje' },
      // Sullia -> Mangaluru
      { fromNode: 'Sullia', toNode: 'Mangaluru', distanceKm: 85, baseTimeMinutes: 100, highwayCode: 'NH-275', isGhatSection: false },
    ];

    rawEdges.forEach((e) => {
      this.nodes.add(e.fromNode);
      this.nodes.add(e.toNode);
      this.edges.push({ ...e, isClosed: false });
      // Bi-directional highway
      this.edges.push({
        fromNode: e.toNode,
        toNode: e.fromNode,
        distanceKm: e.distanceKm,
        baseTimeMinutes: e.baseTimeMinutes,
        highwayCode: e.highwayCode,
        isGhatSection: e.isGhatSection,
        passKey: e.passKey,
        isClosed: false,
      });
    });
  }

  public updateGhatStatus(passKey: 'shiradi' | 'charmadi' | 'agumbe' | 'bisle' | 'sampaje', evidence: GhatHazardEvidence) {
    const evaluation = GeoUncertaintyClassifier.evaluatePassStatus(evidence);

    this.edges.forEach((edge) => {
      if (edge.passKey === passKey) {
        edge.isClosed = !evaluation.isPassPhysicallyOpen;
        edge.statusNote = evaluation.explanationEnglish;
      }
    });
  }

  /**
   * Find fastest path considering time of day and live road closures.
   */
  public findOptimalPath(
    origin: string,
    destination: string,
    departureHour: number,
    isMonsoonMonth: boolean = false
  ): { path: string[]; totalDistanceKm: number; totalDurationMinutes: number; viaGhats: string[]; statusNotes: string[] } | null {
    const distances = new Map<string, number>();
    const durations = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const unvisited = new Set<string>();

    this.nodes.forEach((node) => {
      durations.set(node, Infinity);
      distances.set(node, Infinity);
      previous.set(node, null);
      unvisited.add(node);
    });

    durations.set(origin, 0);
    distances.set(origin, 0);

    while (unvisited.size > 0) {
      let current: string | null = null;
      let minDuration = Infinity;

      unvisited.forEach((node) => {
        const d = durations.get(node)!;
        if (d < minDuration) {
          minDuration = d;
          current = node;
        }
      });

      if (!current || minDuration === Infinity) break;
      if (current === destination) break;

      unvisited.delete(current);

      const outgoing = this.edges.filter((e) => e.fromNode === current && !e.isClosed);
      for (const edge of outgoing) {
        if (!unvisited.has(edge.toNode)) continue;

        let edgeCost = edge.baseTimeMinutes;
        if (edge.passKey) {
          const temporal = RouteTemporalAnalyzer.analyzeCorridorTransit(
            edge.passKey,
            departureHour,
            (durations.get(current)! / 60),
            isMonsoonMonth
          );
          edgeCost = Math.round(edgeCost * temporal.transitRiskMultiplier);
        }

        const altDuration = durations.get(current)! + edgeCost;
        if (altDuration < durations.get(edge.toNode)!) {
          durations.set(edge.toNode, altDuration);
          distances.set(edge.toNode, distances.get(current)! + edge.distanceKm);
          previous.set(edge.toNode, current);
        }
      }
    }

    if (durations.get(destination) === Infinity) return null;

    const path: string[] = [];
    let curr: string | null = destination;
    while (curr) {
      path.unshift(curr);
      curr = previous.get(curr) ?? null;
    }

    const viaGhats: string[] = [];
    const statusNotes: string[] = [];

    for (let i = 0; i < path.length - 1; i++) {
      const edge = this.edges.find((e) => e.fromNode === path[i] && e.toNode === path[i + 1]);
      if (edge?.passKey) viaGhats.push(edge.passKey);
      if (edge?.statusNote) statusNotes.push(edge.statusNote);
    }

    return {
      path,
      totalDistanceKm: distances.get(destination)!,
      totalDurationMinutes: durations.get(destination)!,
      viaGhats,
      statusNotes,
    };
  }
}
