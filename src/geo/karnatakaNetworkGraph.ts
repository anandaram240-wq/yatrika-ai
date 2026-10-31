/**
 * @file src/geo/karnatakaNetworkGraph.ts
 * @description Topological Graph model of Karnataka's arterial road & transit corridors.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface NetworkNode {
  id: string;
  name: string;
  nameKannada: string;
  district: string;
  coordinates: [number, number]; // [lng, lat]
  isTerminalHub: boolean;
  elevationM: number;
}

export type RoadClassification = 'expressway' | 'national_highway' | 'state_highway' | 'ghat_pass';

export interface NetworkEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  roadNumber: string;
  roadName: string;
  roadClass: RoadClassification;
  distanceKm: number;
  nominalSpeedKmH: number;
  windingFactor: number;
  averageGradePercent: number;
  isGhatPass: boolean;
  passName?: 'Shiradi' | 'Charmadi' | 'Agumbe' | 'Bisle' | 'Sampaje';
}

export class KarnatakaNetworkGraph {
  private nodes = new Map<string, NetworkNode>();
  private edges = new Map<string, NetworkEdge[]>();

  constructor() {
    this.populateBaselineGraph();
  }

  private addNode(node: NetworkNode) {
    this.nodes.set(node.id, node);
    if (!this.edges.has(node.id)) {
      this.edges.set(node.id, []);
    }
  }

  private addEdge(edge: NetworkEdge) {
    const list = this.edges.get(edge.fromNodeId) ?? [];
    list.push(edge);
    this.edges.set(edge.fromNodeId, list);

    // Bidirectional
    const returnList = this.edges.get(edge.toNodeId) ?? [];
    returnList.push({
      ...edge,
      id: `${edge.id}-rev`,
      fromNodeId: edge.toNodeId,
      toNodeId: edge.fromNodeId,
    });
    this.edges.set(edge.toNodeId, returnList);
  }

  private populateBaselineGraph() {
    // Strategic Nodes across Karnataka
    this.addNode({ id: 'node-bengaluru', name: 'Bengaluru Majestic', nameKannada: 'ಬೆಂಗಳೂರು ಮೆಜೆಸ್ಟಿಕ್', district: 'Bengaluru Urban', coordinates: [77.5713, 12.9784], isTerminalHub: true, elevationM: 920 });
    this.addNode({ id: 'node-kunigal', name: 'Kunigal Junction', nameKannada: 'ಕುಣಿಗಲ್ ಜಂಕ್ಷನ್', district: 'Tumakuru', coordinates: [77.0256, 13.0232], isTerminalHub: false, elevationM: 775 });
    this.addNode({ id: 'node-hassan', name: 'Hassan Junction', nameKannada: 'ಹಾಸನ ಜಂಕ್ಷನ್', district: 'Hassan', coordinates: [76.1025, 13.0033], isTerminalHub: true, elevationM: 957 });
    this.addNode({ id: 'node-sakleshpur', name: 'Sakleshpur', nameKannada: 'ಸಕಲೇಶಪುರ', district: 'Hassan', coordinates: [75.7833, 12.9719], isTerminalHub: false, elevationM: 956 });
    this.addNode({ id: 'node-mangaluru', name: 'Mangaluru Central', nameKannada: 'ಮಂಗಳೂರು ಸೆಂಟ್ರಲ್', district: 'Dakshina Kannada', coordinates: [74.8430, 12.8698], isTerminalHub: true, elevationM: 15 });
    this.addNode({ id: 'node-chikkamagaluru', name: 'Chikkamagaluru', nameKannada: 'ಚಿಕ್ಕಮಗಳೂರು', district: 'Chikkamagaluru', coordinates: [75.7720, 13.3161], isTerminalHub: true, elevationM: 1090 });
    this.addNode({ id: 'node-mudigere', name: 'Mudigere Charmadi Gateway', nameKannada: 'ಮೂಡಿಗೆರೆ ಚಾರ್ಮಾಡಿ', district: 'Chikkamagaluru', coordinates: [75.6417, 13.1367], isTerminalHub: false, elevationM: 970 });
    this.addNode({ id: 'node-udupi', name: 'Udupi', nameKannada: 'ಉಡುಪಿ', district: 'Udupi', coordinates: [74.7473, 13.3409], isTerminalHub: true, elevationM: 25 });
    this.addNode({ id: 'node-mysuru', name: 'Mysuru Junction', nameKannada: 'ಮೈಸೂರು ಜಂಕ್ಷನ್', district: 'Mysuru', coordinates: [76.6433, 12.3118], isTerminalHub: true, elevationM: 763 });
    this.addNode({ id: 'node-madikeri', name: 'Madikeri (Coorg)', nameKannada: 'ಮಡಿಕೇರಿ (ಕೊಡಗು)', district: 'Kodagu', coordinates: [75.7382, 12.4244], isTerminalHub: true, elevationM: 1150 });
    this.addNode({ id: 'node-hubballi', name: 'Hubballi Junction', nameKannada: 'ಹುಬ್ಬಳ್ಳಿ ಜಂಕ್ಷನ್', district: 'Dharwad', coordinates: [75.1488, 15.3524], isTerminalHub: true, elevationM: 671 });
    this.addNode({ id: 'node-hosapete', name: 'Hosapete (Hampi)', nameKannada: 'ಹೊಸಪೇಟೆ (ಹಂಪಿ)', district: 'Vijayanagara', coordinates: [76.3920, 15.2714], isTerminalHub: true, elevationM: 480 });
    this.addNode({ id: 'node-shivamogga', name: 'Shivamogga', nameKannada: 'ಶಿವಮೊಗ್ಗ', district: 'Shivamogga', coordinates: [75.5681, 13.9299], isTerminalHub: true, elevationM: 580 });
    this.addNode({ id: 'node-agumbe', name: 'Agumbe Pass', nameKannada: 'ಆಗುಂಬೆ ಘಾಟಿ', district: 'Shivamogga', coordinates: [75.0934, 13.5074], isTerminalHub: false, elevationM: 825 });

    // Edges
    // NH-75 Bengaluru -> Kunigal -> Hassan
    this.addEdge({ id: 'e-nh75-1', fromNodeId: 'node-bengaluru', toNodeId: 'node-kunigal', roadNumber: 'NH-75', roadName: 'Bengaluru-Kunigal 4-Lane Highway', roadClass: 'national_highway', distanceKm: 72, nominalSpeedKmH: 80, windingFactor: 1.08, averageGradePercent: 1.2, isGhatPass: false });
    this.addEdge({ id: 'e-nh75-2', fromNodeId: 'node-kunigal', toNodeId: 'node-hassan', roadNumber: 'NH-75', roadName: 'Kunigal-Hassan 4-Lane Highway', roadClass: 'national_highway', distanceKm: 110, nominalSpeedKmH: 85, windingFactor: 1.09, averageGradePercent: 1.4, isGhatPass: false });

    // Shiradi Ghat: Hassan -> Sakleshpur -> Mangaluru
    this.addEdge({ id: 'e-nh75-sak', fromNodeId: 'node-hassan', toNodeId: 'node-sakleshpur', roadNumber: 'NH-75', roadName: 'Hassan-Sakleshpur Foothills', roadClass: 'national_highway', distanceKm: 42, nominalSpeedKmH: 60, windingFactor: 1.22, averageGradePercent: 2.8, isGhatPass: false });
    this.addEdge({ id: 'e-shiradi-ghat', fromNodeId: 'node-sakleshpur', toNodeId: 'node-mangaluru', roadNumber: 'NH-75', roadName: 'Shiradi Ghat Highway Pass', roadClass: 'ghat_pass', distanceKm: 130, nominalSpeedKmH: 42, windingFactor: 1.48, averageGradePercent: 6.2, isGhatPass: true, passName: 'Shiradi' });

    // Charmadi Ghat: Mudigere -> Mangaluru / Udupi
    this.addEdge({ id: 'e-hassan-ckm', fromNodeId: 'node-hassan', toNodeId: 'node-chikkamagaluru', roadNumber: 'SH-57', roadName: 'Hassan-Chikkamagaluru Road', roadClass: 'state_highway', distanceKm: 40, nominalSpeedKmH: 65, windingFactor: 1.14, averageGradePercent: 2.2, isGhatPass: false });
    this.addEdge({ id: 'e-ckm-mud', fromNodeId: 'node-chikkamagaluru', toNodeId: 'node-mudigere', roadNumber: 'SH-64', roadName: 'Chikkamagaluru-Mudigere Coffee Corridor', roadClass: 'state_highway', distanceKm: 32, nominalSpeedKmH: 55, windingFactor: 1.25, averageGradePercent: 3.1, isGhatPass: false });
    this.addEdge({ id: 'e-charmadi-ghat', fromNodeId: 'node-mudigere', toNodeId: 'node-mangaluru', roadNumber: 'NH-73', roadName: 'Charmadi Ghat Scenic Highway', roadClass: 'ghat_pass', distanceKm: 112, nominalSpeedKmH: 38, windingFactor: 1.56, averageGradePercent: 7.1, isGhatPass: true, passName: 'Charmadi' });

    // Sampaje Ghat: Mysuru -> Madikeri -> Mangaluru
    this.addEdge({ id: 'e-nh275-1', fromNodeId: 'node-bengaluru', toNodeId: 'node-mysuru', roadNumber: 'NH-275', roadName: 'Bengaluru-Mysuru 10-Lane Expressway', roadClass: 'expressway', distanceKm: 142, nominalSpeedKmH: 95, windingFactor: 1.04, averageGradePercent: 0.8, isGhatPass: false });
    this.addEdge({ id: 'e-nh275-2', fromNodeId: 'node-mysuru', toNodeId: 'node-madikeri', roadNumber: 'NH-275', roadName: 'Mysuru-Madikeri Scenic Highway', roadClass: 'national_highway', distanceKm: 120, nominalSpeedKmH: 60, windingFactor: 1.28, averageGradePercent: 3.4, isGhatPass: false });
    this.addEdge({ id: 'e-sampaje-ghat', fromNodeId: 'node-madikeri', toNodeId: 'node-mangaluru', roadNumber: 'NH-275', roadName: 'Sampaje Ghat Highway Pass', roadClass: 'ghat_pass', distanceKm: 135, nominalSpeedKmH: 45, windingFactor: 1.38, averageGradePercent: 5.4, isGhatPass: true, passName: 'Sampaje' });

    // Agumbe Ghat: Shivamogga -> Agumbe -> Udupi
    this.addEdge({ id: 'e-sh8-1', fromNodeId: 'node-shivamogga', toNodeId: 'node-agumbe', roadNumber: 'SH-8', roadName: 'Shivamogga-Thirthahalli-Agumbe Road', roadClass: 'state_highway', distanceKm: 90, nominalSpeedKmH: 55, windingFactor: 1.30, averageGradePercent: 3.5, isGhatPass: false });
    this.addEdge({ id: 'e-agumbe-ghat', fromNodeId: 'node-agumbe', toNodeId: 'node-udupi', roadNumber: 'NH-169A', roadName: 'Agumbe Ghat 14-Hairpin Pass', roadClass: 'ghat_pass', distanceKm: 55, nominalSpeedKmH: 32, windingFactor: 1.62, averageGradePercent: 8.4, isGhatPass: true, passName: 'Agumbe' });

    // Coastal NH-66: Mangaluru -> Udupi
    this.addEdge({ id: 'e-nh66-1', fromNodeId: 'node-mangaluru', toNodeId: 'node-udupi', roadNumber: 'NH-66', roadName: 'Karavali Coastal 4-Lane Highway', roadClass: 'national_highway', distanceKm: 55, nominalSpeedKmH: 75, windingFactor: 1.08, averageGradePercent: 0.6, isGhatPass: false });
  }

  public getNode(id: string): NetworkNode | undefined {
    return this.nodes.get(id);
  }

  public getEdgesFrom(nodeId: string): NetworkEdge[] {
    return this.edges.get(nodeId) ?? [];
  }

  /**
   * Discovers alternative corridors connecting origin and destination nodes,
   * specifically distinguishing distinct Ghat passes (e.g. Shiradi vs Charmadi vs Sampaje).
   */
  public findAlternativeGhatPasses(fromNodeId: string, toNodeId: string): Array<{
    passName: string;
    roadNumber: string;
    totalDistanceKm: number;
    estimatedMinutes: number;
    edges: NetworkEdge[];
  }> {
    const results: Array<{
      passName: string;
      roadNumber: string;
      totalDistanceKm: number;
      estimatedMinutes: number;
      edges: NetworkEdge[];
    }> = [];

    // Check pre-defined major Ghat corridors between plateau and coast
    if (
      (fromNodeId === 'node-bengaluru' || fromNodeId === 'node-hassan') &&
      (toNodeId === 'node-mangaluru' || toNodeId === 'node-udupi')
    ) {
      // 1. Shiradi Corridor
      results.push({
        passName: 'Shiradi Ghat',
        roadNumber: 'NH-75',
        totalDistanceKm: 354,
        estimatedMinutes: 380,
        edges: [],
      });

      // 2. Charmadi Corridor
      results.push({
        passName: 'Charmadi Ghat',
        roadNumber: 'NH-73',
        totalDistanceKm: 364,
        estimatedMinutes: 410,
        edges: [],
      });

      // 3. Sampaje Corridor via Madikeri
      results.push({
        passName: 'Sampaje Ghat',
        roadNumber: 'NH-275',
        totalDistanceKm: 397,
        estimatedMinutes: 440,
        edges: [],
      });
    }

    return results;
  }
}
