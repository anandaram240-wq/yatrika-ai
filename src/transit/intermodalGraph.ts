/**
 * @file src/transit/intermodalGraph.ts
 * @description Intermodal connectivity graph linking railway stations, bus stands, and metro lines.
 * @theme Code. Create. Celebrate Kannada.
 */

export interface TerminalHub {
  id: string;
  name: string;
  city: string;
  type: 'railway_junction' | 'bus_terminal' | 'metro_interchange';
  coordinates: [number, number];
}

export interface IntermodalTransferEdge {
  fromHubId: string;
  toHubId: string;
  transferMode: 'pedestrian_subway' | 'city_shuttle_bus' | 'prepaid_auto';
  averageTransferMinutes: number;
  transferCostInr: number;
  accessibilityNotes: string;
}

export const TERMINAL_HUBS: TerminalHub[] = [
  { id: 'hub-sbc-railway', name: 'KSR Bengaluru City Junction (SBC)', city: 'Bengaluru', type: 'railway_junction', coordinates: [77.5697, 12.9781] },
  { id: 'hub-majestic-bus', name: 'Kempegowda Bus Station Majestic (KBS)', city: 'Bengaluru', type: 'bus_terminal', coordinates: [77.5724, 12.9774] },
  { id: 'hub-majestic-metro', name: 'Nadaprabhu Kempegowda Metro Interchange', city: 'Bengaluru', type: 'metro_interchange', coordinates: [77.5718, 12.9756] },
  { id: 'hub-mys-railway', name: 'Mysuru Junction (MYS)', city: 'Mysuru', type: 'railway_junction', coordinates: [76.6433, 12.3118] },
  { id: 'hub-mys-suburban-bus', name: 'Mysuru Suburban Bus Stand', city: 'Mysuru', type: 'bus_terminal', coordinates: [76.6570, 12.3106] },
  { id: 'hub-ckm-bus', name: 'Chikkamagaluru KSRTC Bus Stand', city: 'Chikkamagaluru', type: 'bus_terminal', coordinates: [75.7750, 13.3180] },
  { id: 'hub-hpt-railway', name: 'Hosapete Junction (HPT)', city: 'Hosapete', type: 'railway_junction', coordinates: [76.3888, 15.2689] },
  { id: 'hub-hampi-bazaar', name: 'Hampi Bazaar Terminal', city: 'Hampi', type: 'bus_terminal', coordinates: [76.4600, 15.3350] },
];

export const INTERMODAL_TRANSFERS: IntermodalTransferEdge[] = [
  {
    fromHubId: 'hub-sbc-railway',
    toHubId: 'hub-majestic-bus',
    transferMode: 'pedestrian_subway',
    averageTransferMinutes: 12,
    transferCostInr: 0,
    accessibilityNotes: 'Direct pedestrian subway under Gubbi Thotadappa Road; escalators available on Platform 1.',
  },
  {
    fromHubId: 'hub-sbc-railway',
    toHubId: 'hub-majestic-metro',
    transferMode: 'pedestrian_subway',
    averageTransferMinutes: 8,
    transferCostInr: 0,
    accessibilityNotes: 'Integrated concourse walkway connecting Railway Platform 1 to Metro Gate A.',
  },
  {
    fromHubId: 'hub-majestic-bus',
    toHubId: 'hub-majestic-metro',
    transferMode: 'pedestrian_subway',
    averageTransferMinutes: 6,
    transferCostInr: 0,
    accessibilityNotes: 'Direct pedestrian ramp from Terminal 1 & 2 to underground metro concourse.',
  },
  {
    fromHubId: 'hub-mys-railway',
    toHubId: 'hub-mys-suburban-bus',
    transferMode: 'prepaid_auto',
    averageTransferMinutes: 10,
    transferCostInr: 45,
    accessibilityNotes: 'Pre-paid auto rickshaw stand outside Platform 1 portico (metered tariff).',
  },
  {
    fromHubId: 'hub-hpt-railway',
    toHubId: 'hub-hampi-bazaar',
    transferMode: 'city_shuttle_bus',
    averageTransferMinutes: 25,
    transferCostInr: 25,
    accessibilityNotes: 'KKRTC local bus departs directly from station forecourt every 20 minutes.',
  },
];

export class IntermodalGraph {
  public static getTransferDetails(fromHubId: string, toHubId: string): IntermodalTransferEdge | undefined {
    return INTERMODAL_TRANSFERS.find(
      (e) => (e.fromHubId === fromHubId && e.toHubId === toHubId) || (e.fromHubId === toHubId && e.toHubId === fromHubId)
    );
  }
}
